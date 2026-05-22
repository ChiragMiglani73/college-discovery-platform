import express from "express";

import {
  saveCollege,
  getSavedColleges,
  removeSavedCollege,
} from "../controllers/savedController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:collegeId", protect, saveCollege);

router.get("/", protect, getSavedColleges);

router.delete("/:collegeId", protect, removeSavedCollege);

export default router;