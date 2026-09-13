import { Router } from "express";
import {
  getActiveWorkoutPlan,
  getTodayWorkout,
  regenerateWorkoutPlan,
  logWorkout,
  getWorkoutLogs,
} from "../controllers/workoutController.js";
import { validate, workoutLogSchema } from "../validators/schemas.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", getActiveWorkoutPlan);
router.get("/today", getTodayWorkout);
router.get("/logs", getWorkoutLogs);
router.post("/generate", regenerateWorkoutPlan);
router.post("/:id/log", validate(workoutLogSchema), logWorkout);

export default router;
