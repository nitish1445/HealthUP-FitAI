import { DietPlan, DietLog } from "../models/Diet.js";
import { FitnessProfile } from "../models/FitnessProfile.js";
import {
  generateDietPlan,
  swapMealItem,
} from "../services/dietGenerationService.js";
import { AppError, asyncHandler } from "../utils/AppError.js";

export const getActiveDietPlan = asyncHandler(async (req, res) => {
  const plan = await DietPlan.findOne({ user: req.user._id, active: true });
  if (!plan) {
    return res
      .status(200)
      .json({ success: true, data: null, message: "No active diet plan yet" });
  }
  res.status(200).json({ success: true, data: plan });
});

export const regenerateDietPlan = asyncHandler(async (req, res) => {
  const profile = await FitnessProfile.findOne({ user: req.user._id });
  if (!profile) {
    throw new AppError(
      "Complete your fitness profile before generating a plan",
      400,
    );
  }
  const plan = await generateDietPlan(req.user._id, profile);
  res
    .status(201)
    .json({
      success: true,
      message: "Diet plan regenerated successfully",
      data: plan,
    });
});

export const logDiet = asyncHandler(async (req, res) => {
  const { adherence, caloriesConsumed, protein, carbs, fat, notes } =
    req.validatedBody;

  const activePlan = await DietPlan.findOne({
    user: req.user._id,
    active: true,
  });

  const log = await DietLog.create({
    user: req.user._id,
    dietPlan: activePlan?._id,
    adherence,
    caloriesConsumed,
    protein,
    carbs,
    fat,
    notes,
  });

  res.status(201).json({ success: true, message: "Diet log saved", data: log });
});

export const getDietLogs = asyncHandler(async (req, res) => {
  const { limit = 30 } = req.query;
  const logs = await DietLog.find({ user: req.user._id })
    .sort({ date: -1 })
    .limit(Number(limit));
  res.status(200).json({ success: true, data: logs });
});

export const swapMeal = asyncHandler(async (req, res) => {
  const { mealName, itemName } = req.body;
  const plan = await DietPlan.findOne({ user: req.user._id, active: true });
  if (!plan) throw new AppError("No active diet plan found", 404);

  const meal = plan.meals.find((m) => m.mealName === mealName);
  if (!meal) throw new AppError("Meal not found in active plan", 404);

  const result = swapMealItem(meal, itemName);
  if (!result.success) throw new AppError(result.message, 400);

  meal.items = result.meal.items;
  meal.totalCalories = result.meal.totalCalories;
  meal.totalProtein = result.meal.totalProtein;
  meal.totalCarbs = result.meal.totalCarbs;
  meal.totalFat = result.meal.totalFat;

  await plan.save();

  res
    .status(200)
    .json({ success: true, message: "Meal swapped successfully", data: plan });
});
