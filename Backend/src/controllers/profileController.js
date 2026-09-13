import { FitnessProfile } from "../models/FitnessProfile.js";
import { User } from "../models/User.js";
import { computeFullMetrics } from "../utils/fitnessCalculations.js";
import { AppError, asyncHandler } from "../utils/AppError.js";
import { generateWorkoutPlan } from "../services/workoutGenerationService.js";
import { generateDietPlan } from "../services/dietGenerationService.js";

const buildProfilePayload = (body) => {
  const metrics = computeFullMetrics({
    weightKg: body.currentWeightKg,
    heightCm: body.heightCm,
    age: body.age,
    sex: body.biologicalSex,
    activityLevel: body.activityLevel,
    goal: body.primaryGoal,
  });

  return {
    ...body,
    ...metrics,
    profileCompletionStatus: "complete",
  };
};

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await FitnessProfile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(200).json({ success: true, data: null, message: "Profile not yet created" });
  }
  res.status(200).json({ success: true, data: profile });
});

// Creates the profile AND auto-generates the user's first workout + diet plan.
export const createProfile = asyncHandler(async (req, res) => {
  const existing = await FitnessProfile.findOne({ user: req.user._id });
  if (existing) {
    throw new AppError("Profile already exists. Use update instead.", 409);
  }

  const payload = buildProfilePayload(req.validatedBody);
  const profile = await FitnessProfile.create({ user: req.user._id, ...payload });

  await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });

  // Kick off first personalized plans so the user never lands on an empty dashboard.
  const workoutPlan = await generateWorkoutPlan(req.user._id, profile);
  const dietPlan = await generateDietPlan(req.user._id, profile);

  res.status(201).json({
    success: true,
    message: "Profile created and your first plan is ready",
    data: { profile, workoutPlan, dietPlan },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const existing = await FitnessProfile.findOne({ user: req.user._id });
  if (!existing) {
    throw new AppError("Profile not found. Please complete onboarding first.", 404);
  }

  const merged = { ...existing.toObject(), ...req.validatedBody };
  const payload = buildProfilePayload(merged);

  const profile = await FitnessProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: payload },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, message: "Profile updated successfully", data: profile });
});
