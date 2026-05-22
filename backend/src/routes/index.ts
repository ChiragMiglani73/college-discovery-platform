import { Router } from "express";
import {
  getColleges,
  getCollegeById,
  compareColleges,
  predictColleges,
  getLocations,
  getCourses,
} from "../controllers/collegeController";
import {
  createQuestion,
  createAnswer,
  createReview,
} from "../controllers/qaController";

const router = Router();

router.get("/colleges", getColleges);
router.get("/colleges/compare", compareColleges);
router.get("/colleges/predict", predictColleges);
router.get("/colleges/locations", getLocations);
router.get("/colleges/courses", getCourses);
router.get("/colleges/:id", getCollegeById);

router.post("/questions", createQuestion);
router.post("/questions/:id/answers", createAnswer);
router.post("/reviews", createReview);

router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
