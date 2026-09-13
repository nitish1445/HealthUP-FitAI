import { Router } from "express";
import {
  getActiveDietPlan,
  regenerateDietPlan,
  logDiet,
  getDietLogs,
  swapMeal,
} from "../controllers/dietController.js";
import { validate, dietLogSchema } from "../validators/schemas.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", getActiveDietPlan);
router.get("/logs", getDietLogs);
router.post("/generate", regenerateDietPlan);
router.post("/log", validate(dietLogSchema), logDiet);
router.post("/swap", swapMeal);

export default router;
