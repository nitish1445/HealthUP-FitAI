import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please provide a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const fitnessProfileSchema = z.object({
  age: z.number().int().min(13).max(100),
  biologicalSex: z.enum(["male", "female"]),
  heightCm: z.number().min(100).max(250),
  currentWeightKg: z.number().min(30).max(300),
  targetWeightKg: z.number().min(30).max(300),
  activityLevel: z.enum([
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  primaryGoal: z.enum([
    "Weight Loss",
    "Muscle Gain",
    "Body Recomposition",
    "Maintain",
    "Improve Endurance",
  ]),
  workoutDaysPerWeek: z.number().int().min(1).max(7).optional(),
});

export const weightLogSchema = z.object({
  date: z.string().optional(),
  weightKg: z.number().min(30).max(300),
});

export const measurementLogSchema = z.object({
  date: z.string().optional(),
  waistCm: z.number().optional(),
  chestCm: z.number().optional(),
  hipsCm: z.number().optional(),
  armsCm: z.number().optional(),
  thighsCm: z.number().optional(),
});

export const energyLogSchema = z.object({
  date: z.string().optional(),
  energyLevel: z.enum([
    "Energized",
    "Normal",
    "Slightly Fatigued",
    "Very Tired",
  ]),
  notes: z.string().max(500).optional(),
});

export const workoutLogSchema = z.object({
  dayName: z.string(),
  status: z.enum(["Completed", "Partial", "Skipped"]),
  exercisesCompleted: z
    .array(z.object({ name: z.string(), completed: z.boolean() }))
    .optional(),
  durationMinutes: z.number().optional(),
  notes: z.string().max(500).optional(),
});

export const dietLogSchema = z.object({
  adherence: z.enum(["Followed", "Mostly", "Deviated"]),
  caloriesConsumed: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  notes: z.string().max(500).optional(),
});

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return res.status(400).json({ success: false, message });
  }
  req.validatedBody = result.data;
  next();
};
