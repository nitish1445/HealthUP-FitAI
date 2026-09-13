import mongoose from "mongoose";

const fitnessProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    age: { type: Number, required: true, min: 13, max: 100 },
    biologicalSex: { type: String, enum: ["male", "female"], required: true },
    heightCm: { type: Number, required: true, min: 100, max: 250 },
    currentWeightKg: { type: Number, required: true, min: 30, max: 300 },
    targetWeightKg: { type: Number, required: true, min: 30, max: 300 },

    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    primaryGoal: {
      type: String,
      enum: [
        "Weight Loss",
        "Muscle Gain",
        "Body Recomposition",
        "Maintain",
        "Improve Endurance",
      ],
      required: true,
    },
    workoutDaysPerWeek: { type: Number, min: 1, max: 7, default: 4 },

    // Calculated / derived fields
    bmi: { type: Number },
    bmiCategory: { type: String },
    bmr: { type: Number },
    maintenanceCalories: { type: Number },
    calorieTarget: { type: Number },
    macroTarget: {
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
      percentages: {
        protein: Number,
        carbs: Number,
        fat: Number,
      },
    },

    profileCompletionStatus: {
      type: String,
      enum: ["incomplete", "complete"],
      default: "complete",
    },
  },
  { timestamps: true },
);

export const FitnessProfile = mongoose.model(
  "FitnessProfile",
  fitnessProfileSchema,
);
