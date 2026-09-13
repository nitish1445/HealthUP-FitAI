import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    repsRange: { type: String, required: true }, // e.g. "8-12"
    restSeconds: { type: Number, required: true },
    formGuidance: { type: String },
    muscleGroup: { type: String },
  },
  { _id: false },
);

const workoutDaySchema = new mongoose.Schema(
  {
    dayName: { type: String, required: true }, // Monday, Tuesday...
    focus: { type: String, required: true }, // Push, Pull, Legs, Rest...
    isRestDay: { type: Boolean, default: false },
    exercises: [exerciseSchema],
    intensity: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate",
    },
  },
  { _id: false },
);

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    week: { type: Number, default: 1 },
    goal: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    days: [workoutDaySchema],
    version: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
workoutPlanSchema.index({ user: 1, active: 1 });

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutPlan" },
    date: { type: Date, required: true, default: Date.now },
    dayName: { type: String, required: true },
    status: {
      type: String,
      enum: ["Completed", "Partial", "Skipped"],
      required: true,
    },
    exercisesCompleted: [{ name: String, completed: Boolean }],
    durationMinutes: { type: Number },
    volume: { type: Number }, // total sets*reps as proxy, or user-entered
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);
workoutLogSchema.index({ user: 1, date: -1 });

export const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);
