import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getHabits,
  checkInEnergy,
  getRecovery,
  getForecast,
  evaluatePlan,
  getAdjustments,
  getCoachContext,
  sendCoachMessage,
} from "../controllers/intelligenceController.js";
import { validate, energyLogSchema } from "../validators/schemas.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many requests to the coach. Please slow down.",
  },
});

router.get("/habits", getHabits);

router.post("/recovery/check-in", validate(energyLogSchema), checkInEnergy);
router.get("/recovery", getRecovery);

router.get("/forecast", getForecast);

router.post("/plans/evaluate", evaluatePlan);
router.get("/plans/adjustments", getAdjustments);

router.get("/coach/context", getCoachContext);
router.post("/coach/message", aiLimiter, sendCoachMessage);

export default router;
