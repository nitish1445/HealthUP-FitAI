import { DietPlan } from "../models/Diet.js";
import { FOOD_ITEMS, MEAL_SLOTS, SUBSTITUTIONS } from "./mealLibrary.js";

// Rough distribution of daily calories across meal slots
const MEAL_DISTRIBUTION = {
  Breakfast: 0.25,
  Lunch: 0.35,
  Snack: 0.1,
  Dinner: 0.3,
};

const sumItems = (items) => {
  return items.reduce(
    (acc, it) => ({
      calories: acc.calories + it.calories,
      protein: acc.protein + it.protein,
      carbs: acc.carbs + it.carbs,
      fat: acc.fat + it.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

const buildMeal = (mealName, targetCalories, index) => {
  // Rotate through the library so the week doesn't feel identical, using index as a seed.
  const protein = FOOD_ITEMS.proteinSources[index % FOOD_ITEMS.proteinSources.length];
  const carb = FOOD_ITEMS.carbSources[index % FOOD_ITEMS.carbSources.length];
  const veg = FOOD_ITEMS.vegetables[index % FOOD_ITEMS.vegetables.length];

  const items = [protein, carb, veg];
  let totals = sumItems(items);

  // If well under target, add a fat source for satiety/calories.
  if (totals.calories < targetCalories * 0.85) {
    const fat = FOOD_ITEMS.fatSources[index % FOOD_ITEMS.fatSources.length];
    items.push(fat);
    totals = sumItems(items);
  }

  return {
    mealName,
    items,
    totalCalories: Math.round(totals.calories),
    totalProtein: Math.round(totals.protein),
    totalCarbs: Math.round(totals.carbs),
    totalFat: Math.round(totals.fat),
  };
};

export const generateDietPlan = async (userId, profile, options = {}) => {
  const { calorieTarget, macroTarget } = profile;

  const meals = MEAL_SLOTS.map((slot, i) => {
    const target = calorieTarget * MEAL_DISTRIBUTION[slot];
    return buildMeal(slot, target, i);
  });

  const previousActive = await DietPlan.findOne({ user: userId, active: true }).sort({ version: -1 });
  const nextVersion = previousActive ? previousActive.version + 1 : 1;

  if (previousActive) {
    previousActive.active = false;
    await previousActive.save();
  }

  const plan = await DietPlan.create({
    user: userId,
    calorieTarget,
    macroTarget: {
      protein: macroTarget.protein,
      carbs: macroTarget.carbs,
      fat: macroTarget.fat,
    },
    goal: profile.primaryGoal,
    meals,
    version: nextVersion,
    active: true,
    generatedAt: new Date(),
  });

  return plan;
};

// Meal swap engine: replaces one item in a meal with a nutritionally similar alternative.
export const swapMealItem = (meal, itemName) => {
  const alternatives = SUBSTITUTIONS[itemName];
  if (!alternatives || alternatives.length === 0) {
    return { success: false, message: "No substitution available for this item" };
  }

  const allFoods = Object.values(FOOD_ITEMS).flat();
  const replacementName = alternatives[0];
  const replacement = allFoods.find((f) => f.name === replacementName);
  if (!replacement) {
    return { success: false, message: "Substitution item not found in library" };
  }

  const newItems = meal.items.map((it) => (it.name === itemName ? replacement : it));
  const totals = sumItems(newItems);

  return {
    success: true,
    meal: {
      ...meal.toObject ? meal.toObject() : meal,
      items: newItems,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein),
      totalCarbs: Math.round(totals.carbs),
      totalFat: Math.round(totals.fat),
    },
  };
};
