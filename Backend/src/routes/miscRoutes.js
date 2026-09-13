import { Router } from "express";
import {
  getAnalytics,
  getRoadmap,
  getDashboardSummary,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/analytics", getAnalytics);
router.get("/roadmap", getRoadmap);
router.get("/dashboard", getDashboardSummary);

export default router;
