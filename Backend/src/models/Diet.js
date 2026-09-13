import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  { _id: false },
);

const mealSchema = new mongoose.Schema(
  {
    mealName: { type: String, required: true }, // Breakfast, Lunch, Dinner, Snack
    items: [foodItemSchema],
    totalCalories: { type: Number, required: true },
    totalProtein: { type: Number, required: true },
    totalCarbs: { type: Number, required: true },
    totalFat: { type: Number, required: true },
  },
  { _id: false },
);

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    calorieTarget: { type: Number, required: true },
    macroTarget: {
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    goal: { type: String, required: true },
    meals: [mealSchema],
    version: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
dietPlanSchema.index({ user: 1, active: 1 });

const dietLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dietPlan: { type: mongoose.Schema.Types.ObjectId, ref: "DietPlan" },
    date: { type: Date, required: true, default: Date.now },
    adherence: {
      type: String,
      enum: ["Followed", "Mostly", "Deviated"],
      required: true,
    },
    caloriesConsumed: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);
dietLogSchema.index({ user: 1, date: -1 });

export const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
export const DietLog = mongoose.model("DietLog", dietLogSchema);
