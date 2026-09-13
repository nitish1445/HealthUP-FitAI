import { WorkoutLog } from "../models/Workout.js";
import { DietLog } from "../models/Diet.js";
import { HabitScore } from "../models/Intelligence.js";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const calcWorkoutAdherence = (logs) => {
  if (!logs.length) return 0;
  // Completed = 100%, Partial = 50%, Skipped = 0%
  const points = logs.reduce((sum, l) => {
    if (l.status === "Completed") return sum + 100;
    if (l.status === "Partial") return sum + 50;
    return sum;
  }, 0);
  return Math.round(points / logs.length);
};

const calcDietAdherence = (logs) => {
  if (!logs.length) return 0;
  const points = logs.reduce((sum, l) => {
    if (l.adherence === "Followed") return sum + 100;
    if (l.adherence === "Mostly") return sum + 60;
    return sum;
  }, 0);
  return Math.round(points / logs.length);
};

const calcStreak = (workoutLogs) => {
  // Consecutive days (most recent backward) with a "Completed" workout log.
  const completedDates = new Set(
    workoutLogs
      .filter((l) => l.status === "Completed")
      .map((l) => new Date(l.date).toDateString()),
  );
  let streak = 0;
  for (let i = 0; i < 90; i++) {
    const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString();
    if (completedDates.has(day)) streak++;
    else if (i === 0)
      continue; // allow "today not logged yet"
    else break;
  }
  return streak;
};

const detectRisk = async (userId, workoutLogs, dietLogs) => {
  // Trigger 1: 3 consecutive missed (Skipped) workouts
  const recentWorkouts = [...workoutLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const last3 = recentWorkouts.slice(0, 3);
  const trigger1 =
    last3.length === 3 && last3.every((l) => l.status === "Skipped");

  // Trigger 2: no log at all (workout or diet) for 14 days
  const allDates = [...workoutLogs, ...dietLogs].map((l) => new Date(l.date));
  const mostRecent = allDates.length ? new Date(Math.max(...allDates)) : null;
  const trigger2 = !mostRecent || mostRecent < daysAgo(14);

  // Trigger 3: diet adherence < 40% over last 2 weeks
  const twoWeekDietLogs = dietLogs.filter(
    (l) => new Date(l.date) >= daysAgo(14),
  );
  const dietAdherence2wk = calcDietAdherence(twoWeekDietLogs);
  const trigger3 = twoWeekDietLogs.length >= 4 && dietAdherence2wk < 40;

  if (trigger1 || trigger2) return "high_risk";
  if (trigger3) return "at_risk";
  return "none";
};

// Computes and persists this week's habit score for a user.
export const computeWeeklyHabitScore = async (userId) => {
  const since = daysAgo(7);
  const [workoutLogs, dietLogs] = await Promise.all([
    WorkoutLog.find({ user: userId, date: { $gte: since } }),
    DietLog.find({ user: userId, date: { $gte: since } }),
  ]);

  const workoutAdherence = calcWorkoutAdherence(workoutLogs);
  const dietAdherence = calcDietAdherence(dietLogs);
  const habitScore = Math.round(workoutAdherence * 0.6 + dietAdherence * 0.4);

  const allWorkoutLogs = await WorkoutLog.find({
    user: userId,
    date: { $gte: daysAgo(90) },
  });
  const allDietLogsForRisk = await DietLog.find({
    user: userId,
    date: { $gte: daysAgo(30) },
  });

  const streak = calcStreak(allWorkoutLogs);
  const riskStatus = await detectRisk(
    userId,
    allWorkoutLogs,
    allDietLogsForRisk,
  );

  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const record = await HabitScore.findOneAndUpdate(
    { user: userId, weekStart },
    { workoutAdherence, dietAdherence, habitScore, streak, riskStatus },
    { new: true, upsert: true },
  );

  return record;
};

export const getHabitHistory = async (userId, weeks = 12) => {
  return HabitScore.find({ user: userId }).sort({ weekStart: -1 }).limit(weeks);
};
