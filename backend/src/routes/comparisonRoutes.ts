import express from "express";

import {
  saveComparison,
  getSavedComparisons,
} from "../controllers/comparisonController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  saveComparison
);

router.get(
  "/",
  protect,
  getSavedComparisons
);

export default router;