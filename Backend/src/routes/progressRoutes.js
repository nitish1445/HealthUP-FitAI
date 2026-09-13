import { Router } from "express";
import {
  logWeight,
  logMeasurements,
  getProgress,
} from "../controllers/progressController.js";
import {
  validate,
  weightLogSchema,
  measurementLogSchema,
} from "../validators/schemas.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", getProgress);
router.post("/weight", validate(weightLogSchema), logWeight);
router.post("/measurements", validate(measurementLogSchema), logMeasurements);

export default router;
