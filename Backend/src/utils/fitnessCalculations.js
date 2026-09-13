// All weights in kg, heights in cm, ages in years.

export const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

// Mifflin-St Jeor Equation
export const calculateBMR = (weightKg, heightCm, age, sex) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const calculateMaintenanceCalories = (bmr, activityLevel) => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

const CALORIE_FLOORS = {
  female: 1200,
  male: 1500,
};

// Returns a safe calorie target based on maintenance calories and goal.
export const calculateCalorieTarget = (maintenanceCalories, goal, sex) => {
  let target = maintenanceCalories;

  switch (goal) {
    case "Weight Loss":
      target = maintenanceCalories - 500; // ~0.5kg/week deficit
      break;
    case "Muscle Gain":
      target = maintenanceCalories + 300;
      break;
    case "Body Recomposition":
      target = maintenanceCalories - 150;
      break;
    case "Improve Endurance":
      target = maintenanceCalories + 100;
      break;
    case "Maintain":
    default:
      target = maintenanceCalories;
  }

  const floor = CALORIE_FLOORS[sex] || CALORIE_FLOORS.female;
  if (target < floor) target = floor;

  return Math.round(target);
};

const MACRO_TEMPLATES = {
  "Weight Loss": { protein: 0.4, carbs: 0.3, fat: 0.3 },
  "Muscle Gain": { protein: 0.3, carbs: 0.5, fat: 0.2 },
  "Body Recomposition": { protein: 0.4, carbs: 0.35, fat: 0.25 },
  Maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  "Improve Endurance": { protein: 0.25, carbs: 0.55, fat: 0.2 },
};

// protein/carbs = 4 kcal/g, fat = 9 kcal/g
export const calculateMacros = (calorieTarget, goal) => {
  const template = MACRO_TEMPLATES[goal] || MACRO_TEMPLATES.Maintain;

  const proteinCalories = calorieTarget * template.protein;
  const carbCalories = calorieTarget * template.carbs;
  const fatCalories = calorieTarget * template.fat;

  return {
    protein: Math.round(proteinCalories / 4),
    carbs: Math.round(carbCalories / 4),
    fat: Math.round(fatCalories / 9),
    percentages: {
      protein: Math.round(template.protein * 100),
      carbs: Math.round(template.carbs * 100),
      fat: Math.round(template.fat * 100),
    },
  };
};

export const computeFullMetrics = ({ weightKg, heightCm, age, sex, activityLevel, goal }) => {
  const bmi = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(weightKg, heightCm, age, sex);
  const maintenanceCalories = calculateMaintenanceCalories(bmr, activityLevel);
  const calorieTarget = calculateCalorieTarget(maintenanceCalories, goal, sex);
  const macros = calculateMacros(calorieTarget, goal);

  return {
    bmi,
    bmiCategory: getBMICategory(bmi),
    bmr: Math.round(bmr),
    maintenanceCalories,
    calorieTarget,
    macroTarget: macros,
  };
};
