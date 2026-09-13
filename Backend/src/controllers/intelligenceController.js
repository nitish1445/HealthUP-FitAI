import { FitnessProfile } from "../models/FitnessProfile.js";
import {
  computeWeeklyHabitScore,
  getHabitHistory,
} from "../services/habitService.js";
import {
  logEnergyCheckIn,
  getRecoveryInsights,
} from "../services/recoveryService.js";
import { getGoalForecast } from "../services/forecastService.js";
import {
  runWeeklyEvaluation,
  getRecentAdjustments,
} from "../services/planAdjustmentService.js";
import { getCoachResponse } from "../services/ai/aiProvider.js";
import { AIConversation, PlanAdjustment } from "../models/Intelligence.js";
import { AppError, asyncHandler } from "../utils/AppError.js";

const requireProfile = async (userId) => {
  const profile = await FitnessProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Complete your fitness profile first", 400);
  return profile;
};

// ---- Habits ----
export const getHabits = asyncHandler(async (req, res) => {
  const current = await computeWeeklyHabitScore(req.user._id);
  const history = await getHabitHistory(req.user._id, 12);
  res.status(200).json({ success: true, data: { current, history } });
});

// ---- Recovery ----
export const checkInEnergy = asyncHandler(async (req, res) => {
  const log = await logEnergyCheckIn(req.user._id, req.validatedBody);
  res
    .status(201)
    .json({ success: true, message: "Recovery day applied", data: log });
});

export const getRecovery = asyncHandler(async (req, res) => {
  const insights = await getRecoveryInsights(req.user._id);
  res.status(200).json({ success: true, data: insights });
});

// ---- Forecast ----
export const getForecast = asyncHandler(async (req, res) => {
  const profile = await requireProfile(req.user._id);
  const forecast = await getGoalForecast(req.user._id, profile);
  res.status(200).json({ success: true, data: forecast });
});

// ---- Plan evaluation / adjustments ----
export const evaluatePlan = asyncHandler(async (req, res) => {
  const profile = await requireProfile(req.user._id);
  const result = await runWeeklyEvaluation(req.user._id, profile);
  res
    .status(200)
    .json({
      success: true,
      message: "Weekly evaluation complete",
      data: result,
    });
});

export const getAdjustments = asyncHandler(async (req, res) => {
  const adjustments = await getRecentAdjustments(req.user._id);
  res.status(200).json({ success: true, data: adjustments });
});

// ---- Coach ----
export const getCoachContext = asyncHandler(async (req, res) => {
  const profile = await requireProfile(req.user._id);
  const { context } = await getCoachResponse({
    userId: req.user._id,
    profile,
    question: "",
  });
  res.status(200).json({ success: true, data: context });
});

export const sendCoachMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new AppError("Message is required", 400);
  }

  const profile = await requireProfile(req.user._id);
  const { answer, context } = await getCoachResponse({
    userId: req.user._id,
    profile,
    question: message,
  });

  let conversation = await AIConversation.findOne({ user: req.user._id }).sort({
    createdAt: -1,
  });
  if (!conversation) {
    conversation = await AIConversation.create({
      user: req.user._id,
      messages: [],
      context,
    });
  }
  conversation.messages.push({ role: "user", content: message });
  conversation.messages.push({ role: "assistant", content: answer });
  conversation.context = context;
  await conversation.save();

  res
    .status(200)
    .json({
      success: true,
      data: { answer, context, conversationId: conversation._id },
    });
});
