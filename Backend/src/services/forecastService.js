import { WeightLog } from "../models/TrackingLogs.js";

// Requires at least this many logs spanning at least this many days to forecast responsibly.
const MIN_LOGS = 3;
const MIN_SPAN_DAYS = 10;

export const getGoalForecast = async (userId, profile) => {
  const logs = await WeightLog.find({ user: userId }).sort({ date: 1 });

  if (logs.length < MIN_LOGS) {
    return {
      hasEnoughData: false,
      message:
        "Forecast needs more data. Log your weight consistently for a few weeks to unlock this.",
    };
  }

  const first = logs[0];
  const last = logs[logs.length - 1];
  const spanDays =
    (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);

  if (spanDays < MIN_SPAN_DAYS) {
    return {
      hasEnoughData: false,
      message:
        "Forecast needs more data. Log your weight consistently for a few weeks to unlock this.",
    };
  }

  const totalChangeKg = last.weightKg - first.weightKg;
  const weeklyChangeKg = totalChangeKg / (spanDays / 7);

  const remainingKg = profile.targetWeightKg - last.weightKg;

  // If direction of remaining change doesn't match trend direction, we can't project forward meaningfully.
  const sameDirection =
    (remainingKg > 0 && weeklyChangeKg > 0) ||
    (remainingKg < 0 && weeklyChangeKg < 0) ||
    Math.abs(remainingKg) < 0.5;

  if (!sameDirection || Math.abs(weeklyChangeKg) < 0.01) {
    return {
      hasEnoughData: true,
      currentTrajectoryKgPerWeek: Math.round(weeklyChangeKg * 100) / 100,
      message:
        "Your current trend isn't moving toward your target weight yet. Keep logging consistently — the forecast will update as your trend changes.",
      estimatedWeeks: null,
    };
  }

  const estimatedWeeks = Math.abs(remainingKg / weeklyChangeKg);
  const lowWeeks = Math.round(estimatedWeeks * 0.85);
  const highWeeks = Math.round(estimatedWeeks * 1.25);

  const today = new Date();
  const lowDate = new Date(
    today.getTime() + lowWeeks * 7 * 24 * 60 * 60 * 1000,
  );
  const highDate = new Date(
    today.getTime() + highWeeks * 7 * 24 * 60 * 60 * 1000,
  );

  return {
    hasEnoughData: true,
    currentWeightKg: last.weightKg,
    targetWeightKg: profile.targetWeightKg,
    currentTrajectoryKgPerWeek: Math.round(weeklyChangeKg * 100) / 100,
    estimatedWeeksRange: [lowWeeks, highWeeks],
    estimatedCompletionDateRange: [lowDate, highDate],
  };
};
