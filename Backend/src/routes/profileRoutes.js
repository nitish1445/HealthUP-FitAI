import { Router } from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../controllers/profileController.js";
import { validate, fitnessProfileSchema } from "../validators/schemas.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/user-profile", getProfile);
router.post("/complete-profile", validate(fitnessProfileSchema), createProfile);
router.put(
  "/update-profile",
  validate(fitnessProfileSchema.partial()),
  updateProfile,
);

export default router;
