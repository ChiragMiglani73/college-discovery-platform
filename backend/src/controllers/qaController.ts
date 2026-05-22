import { Request, Response } from "express";
import pool from "../db/db";

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { college_id, question, asked_by = "Anonymous" } = req.body;

    if (!college_id || !question) {
      return res
        .status(400)
        .json({ success: false, error: "college_id and question are required" });
    }

    const result = await pool.query(
      "INSERT INTO questions (college_id, question, asked_by) VALUES ($1,$2,$3) RETURNING *",
      [college_id, question, asked_by]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("createQuestion error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const createAnswer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answer, answered_by = "Anonymous" } = req.body;

    if (!answer) {
      return res
        .status(400)
        .json({ success: false, error: "answer is required" });
    }

    const questionCheck = await pool.query(
      "SELECT id FROM questions WHERE id = $1",
      [id]
    );
    if (questionCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    const result = await pool.query(
      "INSERT INTO answers (question_id, answer, answered_by) VALUES ($1,$2,$3) RETURNING *",
      [id, answer, answered_by]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("createAnswer error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { college_id, user_name = "Anonymous", rating, comment } = req.body;

    if (!college_id || !rating) {
      return res
        .status(400)
        .json({ success: false, error: "college_id and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, error: "Rating must be between 1 and 5" });
    }

    const result = await pool.query(
      "INSERT INTO reviews (college_id, user_name, rating, comment) VALUES ($1,$2,$3,$4) RETURNING *",
      [college_id, user_name, rating, comment]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("createReview error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
