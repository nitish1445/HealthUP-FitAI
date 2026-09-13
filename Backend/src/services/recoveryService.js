import { EnergyLog } from "../models/TrackingLogs.js";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const FATIGUE_LEVELS = {
  Energized: 0,
  Normal: 1,
  "Slightly Fatigued": 2,
  "Very Tired": 3,
};

export const logEnergyCheckIn = async (userId, payload) => {
  const log = await EnergyLog.create({
    user: userId,
    date: payload.date ? new Date(payload.date) : new Date(),
    energyLevel: payload.energyLevel,
    notes: payload.notes,
  });
  return log;
};

// Returns today's status plus a recommendation based on the last 7 days of check-ins.
export const getRecoveryInsights = async (userId) => {
  const logs = await EnergyLog.find({
    user: userId,
    date: { $gte: daysAgo(7) },
  }).sort({ date: -1 });

  if (!logs.length) {
    return {
      hasData: false,
      message:
        "No recent energy check-ins. Log how you're feeling to unlock recovery insights.",
      recommendation: null,
      forceRecoveryDay: false,
      fatigueFlags: 0,
    };
  }

  const today = logs.find(
    (l) => new Date(l.date).toDateString() === new Date().toDateString(),
  );
  const fatigueFlags = logs.filter(
    (l) => FATIGUE_LEVELS[l.energyLevel] >= 2,
  ).length;
  const forceRecoveryDay = fatigueFlags >= 3;

  let recommendation;
  if (forceRecoveryDay) {
    recommendation =
      "Your recent fatigue pattern suggests reducing training intensity today. A recovery day has been recommended.";
  } else if (today && FATIGUE_LEVELS[today.energyLevel] >= 2) {
    recommendation =
      "You're reporting reduced energy today. Consider lowering volume or replacing your heavy session with mobility work.";
  } else {
    recommendation =
      "Your energy levels look stable. Proceed with your planned training.";
  }

  return {
    hasData: true,
    todayEnergyLevel: today ? today.energyLevel : null,
    fatigueFlags,
    forceRecoveryDay,
    recommendation,
    recentLogs: logs,
  };
};

// Adjusts a workout day's intensity/volume based on current fatigue state.
export const applyRecoveryAdjustment = (workoutDay, insights) => {
  if (!insights.hasData) return workoutDay;

  if (insights.forceRecoveryDay) {
    return {
      ...workoutDay,
      focus: "Mobility",
      intensity: "low",
      exercises: [],
      isRestDay: true,
      adjustedForRecovery: true,
    };
  }

  if (
    insights.todayEnergyLevel === "Slightly Fatigued" ||
    insights.todayEnergyLevel === "Very Tired"
  ) {
    return {
      ...workoutDay,
      intensity: "low",
      exercises: workoutDay.exercises.map((ex) => ({
        ...ex,
        sets: Math.max(2, ex.sets - 1),
      })),
      adjustedForRecovery: true,
    };
  }

  return workoutDay;
};
