import mongoose from "mongoose";

const habitScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weekStart: { type: Date, required: true },
    workoutAdherence: { type: Number, required: true }, // 0-100
    dietAdherence: { type: Number, required: true }, // 0-100
    habitScore: { type: Number, required: true }, // 0-100
    streak: { type: Number, default: 0 },
    riskStatus: {
      type: String,
      enum: ["none", "at_risk", "high_risk"],
      default: "none",
    },
  },
  { timestamps: true },
);
habitScoreSchema.index({ user: 1, weekStart: -1 });

const aiConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    context: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

const planAdjustmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planType: { type: String, enum: ["workout", "diet"], required: true },
    previousPlanVersion: { type: Number },
    trigger: { type: String, required: true }, // e.g. "high_adherence", "low_adherence", "fatigue"
    reason: { type: String, required: true },
    change: { type: String, required: true },
    expectedOutcome: { type: String },
  },
  { timestamps: true },
);
planAdjustmentSchema.index({ user: 1, createdAt: -1 });

export const HabitScore = mongoose.model("HabitScore", habitScoreSchema);
export const AIConversation = mongoose.model(
  "AIConversation",
  aiConversationSchema,
);
export const PlanAdjustment = mongoose.model(
  "PlanAdjustment",
  planAdjustmentSchema,
);
