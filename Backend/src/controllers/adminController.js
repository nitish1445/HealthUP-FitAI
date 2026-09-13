import { User } from "../models/User.js";
import { FitnessProfile } from "../models/FitnessProfile.js";
import { WorkoutLog } from "../models/Workout.js";
import { DietLog } from "../models/Diet.js";
import { asyncHandler } from "../utils/AppError.js";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export const getAdminOverview = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();

  const activeUsers = await User.countDocuments({
    lastLoginAt: { $gte: daysAgo(30) },
  });

  const goalDistribution = await FitnessProfile.aggregate([
    {
      $group: {
        _id: "$primaryGoal",
        count: { $sum: 1 },
      },
    },
  ]);

  const recentWorkoutLogs = await WorkoutLog.find({
    date: { $gte: daysAgo(30) },
  });

  const recentDietLogs = await DietLog.find({
    date: { $gte: daysAgo(30) },
  });

  const completedWorkouts = recentWorkoutLogs.filter(
    (log) => log.status === "Completed",
  ).length;

  const followedDiets = recentDietLogs.filter(
    (log) => log.adherence === "Followed",
  ).length;

  const workoutAdherence = recentWorkoutLogs.length
    ? Math.round((completedWorkouts / recentWorkoutLogs.length) * 100)
    : null;

  const dietAdherence = recentDietLogs.length
    ? Math.round((followedDiets / recentDietLogs.length) * 100)
    : null;

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeUsers,

      goalDistribution: goalDistribution.map((goal) => ({
        goal: goal._id,
        count: goal.count,
      })),

      platformWorkoutAdherencePct: workoutAdherence,
      platformDietAdherencePct: dietAdherence,
    },
  });
});

//all users list for admin dashboard
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(200);

  res.status(200).json({
    success: true,
    data: users,
  });
});
