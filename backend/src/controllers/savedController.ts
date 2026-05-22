import { Response } from "express";
import pool from "../db/db";
import { AuthRequest } from "../middleware/authMiddleware";

export const saveCollege = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { collegeId } = req.params;

    await pool.query(
      `
      INSERT INTO saved_colleges (user_id, college_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, college_id) DO NOTHING
      `,
      [userId, collegeId]
    );

    return res.json({
      success: true,
      message: "College saved successfully",
    });
  } catch (error) {
    console.error("saveCollege error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to save college",
    });
  }
};

export const getSavedColleges = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `
      SELECT
        colleges.*
      FROM saved_colleges

      JOIN colleges
      ON colleges.id = saved_colleges.college_id

      WHERE saved_colleges.user_id = $1

      ORDER BY saved_colleges.created_at DESC
      `,
      [userId]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("getSavedColleges error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch saved colleges",
    });
  }
};

export const removeSavedCollege = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { collegeId } = req.params;

    await pool.query(
      `
      DELETE FROM saved_colleges
      WHERE user_id = $1
      AND college_id = $2
      `,
      [userId, collegeId]
    );

    return res.json({
      success: true,
      message: "College removed",
    });
  } catch (error) {
    console.error("removeSavedCollege error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to remove college",
    });
  }
};