import { Response } from "express";

import pool from "../db/db";

import { AuthRequest } from "../middleware/authMiddleware";


export const saveComparison = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    const { collegeIds } = req.body;

    if (
      !collegeIds ||
      !Array.isArray(collegeIds) ||
      collegeIds.length < 2
    ) {
      return res.status(400).json({
        success: false,
        error:
          "At least 2 colleges required",
      });
    }

    await pool.query(
      `
      INSERT INTO saved_comparisons
      (user_id, college_ids)

      VALUES ($1, $2)
      `,
      [userId, collegeIds]
    );

    return res.json({
      success: true,
      message:
        "Comparison saved successfully",
    });
  } catch (error) {
    console.error(
      "saveComparison error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to save comparison",
    });
  }
};


export const getSavedComparisons =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.id;

      const result = await pool.query(
        `
      SELECT *
      FROM saved_comparisons

      WHERE user_id = $1

      ORDER BY created_at DESC
      `,
        [userId]
      );

      return res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error(
        "getSavedComparisons error:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to fetch comparisons",
      });
    }
  };