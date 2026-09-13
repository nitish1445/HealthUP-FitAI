import { WorkoutPlan } from "../models/Workout.js";
import {
  EXERCISE_LIBRARY,
  SPLIT_TEMPLATES,
  DAY_NAMES,
} from "./exerciseLibrary.js";

// Experience level -> volume/intensity rules
const EXPERIENCE_RULES = {
  beginner: {
    exercisesPerDay: 3,
    sets: 3,
    repsRange: "10-15",
    restSeconds: 75,
    intensity: "low",
  },
  intermediate: {
    exercisesPerDay: 4,
    sets: 3,
    repsRange: "8-12",
    restSeconds: 90,
    intensity: "moderate",
  },
  advanced: {
    exercisesPerDay: 5,
    sets: 4,
    repsRange: "6-10",
    restSeconds: 90,
    intensity: "high",
  },
};

const pickSplit = (daysPerWeek, goal) => {
  const key = [3, 4, 5, 6].reduce(
    (best, d) =>
      Math.abs(d - daysPerWeek) < Math.abs(best - daysPerWeek) ? d : best,
    4,
  );
  const base = [...SPLIT_TEMPLATES[key]];

  // Endurance goal: swap one lifting day for cardio
  if (goal === "Improve Endurance") {
    const idx = base.findIndex((f) => f !== "Rest");
    if (idx !== -1) base[idx] = "Cardio";
  }
  return base;
};

const buildDay = (focus, rules) => {
  if (focus === "Rest") {
    return { focus: "Rest", isRestDay: true, exercises: [], intensity: "low" };
  }

  const pool = EXERCISE_LIBRARY[focus] || EXERCISE_LIBRARY["Full Body"];
  const count = Math.min(rules.exercisesPerDay, pool.length);
  const chosen = pool.slice(0, count);

  const exercises = chosen.map((ex) => ({
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    formGuidance: ex.formGuidance,
    sets: rules.sets,
    repsRange: rules.repsRange,
    restSeconds: rules.restSeconds,
  }));

  return { focus, isRestDay: false, exercises, intensity: rules.intensity };
};

// Generates and persists a new active 7-day workout plan for the user,
// deactivating any previously active plan.
export const generateWorkoutPlan = async (userId, profile, options = {}) => {
  const rules =
    EXPERIENCE_RULES[profile.experienceLevel] || EXPERIENCE_RULES.beginner;
  const daysPerWeek = profile.workoutDaysPerWeek || 4;
  const split = pickSplit(daysPerWeek, profile.primaryGoal);

  const days = DAY_NAMES.map((dayName, i) => ({
    dayName,
    ...buildDay(split[i], rules),
  }));

  const previousActive = await WorkoutPlan.findOne({
    user: userId,
    active: true,
  }).sort({ version: -1 });
  const nextVersion = previousActive ? previousActive.version + 1 : 1;

  if (previousActive) {
    previousActive.active = false;
    await previousActive.save();
  }

  const plan = await WorkoutPlan.create({
    user: userId,
    week: options.week || 1,
    goal: profile.primaryGoal,
    experienceLevel: profile.experienceLevel,
    days,
    version: nextVersion,
    active: true,
    generatedAt: new Date(),
  });

  return plan;
};

export const getTodayFocus = (plan) => {
  const todayName = DAY_NAMES[(new Date().getDay() + 6) % 7]; // Mon=0..Sun=6
  return plan.days.find((d) => d.dayName === todayName) || null;
};
