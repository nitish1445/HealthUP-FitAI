import mongoose from "mongoose";

const weightLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, default: Date.now },
    weightKg: { type: Number, required: true, min: 30, max: 300 },
  },
  { timestamps: true },
);
weightLogSchema.index({ user: 1, date: -1 });

const measurementLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, default: Date.now },
    waistCm: Number,
    chestCm: Number,
    hipsCm: Number,
    armsCm: Number,
    thighsCm: Number,
  },
  { timestamps: true },
);
measurementLogSchema.index({ user: 1, date: -1 });

const energyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, default: Date.now },
    energyLevel: {
      type: String,
      enum: ["Energized", "Normal", "Slightly Fatigued", "Very Tired"],
      required: true,
    },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);
energyLogSchema.index({ user: 1, date: -1 });

export const WeightLog = mongoose.model("WeightLog", weightLogSchema);
export const MeasurementLog = mongoose.model(
  "MeasurementLog",
  measurementLogSchema,
);
export const EnergyLog = mongoose.model("EnergyLog", energyLogSchema);
