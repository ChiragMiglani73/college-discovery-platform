import { Request, Response } from "express";
import pool from "../db/db";


export const getColleges = async (req: Request, res: Response) => {
  try {
    const {
      search,
      location,
      min_fees,
      max_fees,
      course,
      sort_by = "nirf_rank",
      order = "ASC",
      page = "1",
      limit = "9",
    } = req.query as Record<string, string>;

    const conditions: string[] = [];
    const params: unknown[] = [];

    let paramCount = 1;

    if (search) {
      conditions.push(`name ILIKE $${paramCount}`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (location) {
      conditions.push(`location ILIKE $${paramCount}`);
      params.push(`%${location}%`);
      paramCount++;
    }

    if (min_fees) {
      conditions.push(`fees >= $${paramCount}`);
      params.push(parseInt(min_fees));
      paramCount++;
    }

    if (max_fees) {
      conditions.push(`fees <= $${paramCount}`);
      params.push(parseInt(max_fees));
      paramCount++;
    }

    if (course) {
      conditions.push(`$${paramCount} = ANY(courses)`);
      params.push(course);
      paramCount++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const validSortCols = [
      "nirf_rank",
      "rating",
      "fees",
      "placement_percentage",
      "average_package",
      "name",
    ];

    const sortCol = validSortCols.includes(sort_by)
      ? sort_by
      : "nirf_rank";

    const sortOrder =
      order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const offset =
      (parseInt(page) - 1) * parseInt(limit);

    const countQuery = `
      SELECT COUNT(*) 
      FROM colleges
      ${whereClause}
    `;

    const dataQuery = `
      SELECT *
      FROM colleges
      ${whereClause}
      ORDER BY ${sortCol} ${sortOrder} NULLS LAST
      LIMIT $${paramCount}
      OFFSET $${paramCount + 1}
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params),

      pool.query(dataQuery, [
        ...params,
        parseInt(limit),
        offset,
      ]),
    ]);

    return res.json({
      success: true,

      data: dataResult.rows,

      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),

        totalPages: Math.ceil(
          parseInt(countResult.rows[0].count) /
            parseInt(limit)
        ),
      },
    });
  } catch (error) {
    console.error("getColleges error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};


export const getCollegeById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const collegeResult = await pool.query(
      "SELECT * FROM colleges WHERE id = $1",
      [id]
    );

    if (collegeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "College not found",
      });
    }

    const reviewsResult = await pool.query(
      `
      SELECT *
      FROM reviews
      WHERE college_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    );

    const questionsResult = await pool.query(
      `
      SELECT
        q.*,

        json_agg(
          json_build_object(
            'id', a.id,
            'answer', a.answer,
            'answered_by', a.answered_by,
            'created_at', a.created_at
          )
        ) FILTER (WHERE a.id IS NOT NULL) AS answers

      FROM questions q

      LEFT JOIN answers a
      ON a.question_id = q.id

      WHERE q.college_id = $1

      GROUP BY q.id

      ORDER BY q.created_at DESC
      `,
      [id]
    );

    return res.json({
      success: true,

      data: {
        ...collegeResult.rows[0],

        reviews: reviewsResult.rows,

        questions: questionsResult.rows,
      },
    });
  } catch (error) {
    console.error("getCollegeById error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const compareColleges = async (
  req: Request,
  res: Response
) => {
  try {
    const { ids } = req.query as { ids: string };

    if (!ids) {
      return res.status(400).json({
        success: false,
        error: "ids query param required",
      });
    }

    const idList = ids
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id))
      .slice(0, 3);

    if (idList.length < 2) {
      return res.status(400).json({
        success: false,
        error: "At least 2 college IDs required",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        location,
        fees,
        rating,
        courses,
        placement_percentage,
        average_package,
        nirf_rank,
        type,
        established

      FROM colleges

      WHERE id = ANY($1)

      ORDER BY array_position($1, id)
      `,
      [idList]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("compareColleges error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};


export const predictColleges = async (
  req: Request,
  res: Response
) => {
  try {
    const { exam, rank } = req.query;

    const rankNum = parseInt(rank as string);

    if (!exam || !rankNum) {
      return res.status(400).json({
        success: false,
        error: "Exam and rank are required",
      });
    }

    let query = "";
    let predictionLabel = "";

    if (exam === "JEE Advanced") {
      predictionLabel = "IIT Admission Prediction";

      if (rankNum <= 500) {
        query = `
          SELECT *
          FROM colleges

          WHERE (
            name ILIKE '%IIT%'
            OR name ILIKE '%Indian Institute of Technology%'
          )

          AND nirf_rank <= 5

          ORDER BY nirf_rank ASC

          LIMIT 3
        `;
      }

      else if (rankNum <= 2000) {
        query = `
          SELECT *
          FROM colleges

          WHERE (
            name ILIKE '%IIT%'
            OR name ILIKE '%Indian Institute of Technology%'
          )

          AND nirf_rank <= 15

          ORDER BY nirf_rank ASC

          LIMIT 5
        `;
      }

      else {
        query = `
          SELECT *
          FROM colleges

          WHERE (
            name ILIKE '%IIT%'
            OR name ILIKE '%Indian Institute of Technology%'
          )

          ORDER BY nirf_rank ASC

          LIMIT 6
        `;
      }
    }


    else if (exam === "JEE Mains") {
      predictionLabel =
        "NIT / IIIT Admission Prediction";

      if (rankNum <= 1000) {
        query = `
          SELECT *
          FROM colleges

          WHERE (
            name ILIKE '%NIT%'
            OR name ILIKE '%IIIT%'
          )

          AND nirf_rank <= 25

          ORDER BY nirf_rank ASC

          LIMIT 5
        `;
      }

      else if (rankNum <= 10000) {
        query = `
          SELECT *
          FROM colleges

          WHERE (
            name ILIKE '%NIT%'
            OR name ILIKE '%IIIT%'
            OR type ILIKE '%State%'
          )

          ORDER BY nirf_rank ASC

          LIMIT 8
        `;
      }

      else {
        query = `
          SELECT *
          FROM colleges

          WHERE (
            name ILIKE '%NIT%'
            OR type ILIKE '%State%'
          )

          ORDER BY rating DESC

          LIMIT 8
        `;
      }
    }


    else if (exam === "BITSAT") {
      predictionLabel =
        "BITS Pilani Admission Prediction";

      query = `
        SELECT *
        FROM colleges

        WHERE name ILIKE '%BITS Pilani%'

        ORDER BY nirf_rank ASC

        LIMIT 1
      `;
    }

    else if (exam === "State CET") {
      predictionLabel =
        "State College Admission Prediction";

      query = `
        SELECT *
        FROM colleges

        WHERE (
          type ILIKE '%State%'
          OR name ILIKE '%DTU%'
          OR name ILIKE '%NSUT%'
          OR name ILIKE '%Jadavpur%'
        )

        ORDER BY rating DESC

        LIMIT 8
      `;
    }

    else {
      return res.status(400).json({
        success: false,
        error: "Invalid exam type",
      });
    }

    const result = await pool.query(query);

    return res.json({
      success: true,
      prediction_label: predictionLabel,
      data: result.rows,
    });
  } catch (error) {
    console.error("predictColleges error:", error);

    return res.status(500).json({
      success: false,
      error: "Prediction failed",
    });
  }
};



export const getLocations = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT location
      FROM colleges
      ORDER BY location
    `);

    return res.json({
      success: true,
      data: result.rows.map((r) => r.location),
    });
  } catch (error) {
    console.error("getLocations error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getCourses = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT UNNEST(courses) AS course
      FROM colleges
      ORDER BY course
    `);

    return res.json({
      success: true,
      data: result.rows.map((r) => r.course),
    });
  } catch (error) {
    console.error("getCourses error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};