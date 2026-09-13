// Simplified meal building blocks with approximate macros per serving.
// Real product would source this from a verified nutrition database.

export const FOOD_ITEMS = {
  proteinSources: [
    {
      name: "Grilled Chicken Breast (150g)",
      calories: 248,
      protein: 46,
      carbs: 0,
      fat: 5,
    },
    { name: "Paneer (150g)", calories: 340, protein: 28, carbs: 5, fat: 25 },
    { name: "Tofu (150g)", calories: 190, protein: 20, carbs: 5, fat: 11 },
    {
      name: "Salmon Fillet (150g)",
      calories: 310,
      protein: 34,
      carbs: 0,
      fat: 19,
    },
    {
      name: "Egg Whites (4) + 1 Whole Egg",
      calories: 190,
      protein: 26,
      carbs: 2,
      fat: 7,
    },
    {
      name: "Greek Yogurt (200g)",
      calories: 146,
      protein: 20,
      carbs: 8,
      fat: 4,
    },
    {
      name: "Lentils, cooked (200g)",
      calories: 230,
      protein: 18,
      carbs: 40,
      fat: 1,
    },
  ],
  carbSources: [
    {
      name: "Steamed Rice (150g)",
      calories: 195,
      protein: 4,
      carbs: 43,
      fat: 0,
    },
    { name: "Roti (2 pieces)", calories: 160, protein: 5, carbs: 32, fat: 2 },
    {
      name: "Sweet Potato (200g)",
      calories: 172,
      protein: 3,
      carbs: 40,
      fat: 0,
    },
    { name: "Oats (60g dry)", calories: 230, protein: 8, carbs: 39, fat: 4 },
    {
      name: "Quinoa, cooked (150g)",
      calories: 180,
      protein: 6,
      carbs: 32,
      fat: 3,
    },
  ],
  fatSources: [
    { name: "Almonds (20g)", calories: 116, protein: 4, carbs: 4, fat: 10 },
    {
      name: "Olive Oil (1 tbsp)",
      calories: 119,
      protein: 0,
      carbs: 0,
      fat: 13.5,
    },
    {
      name: "Peanut Butter (1 tbsp)",
      calories: 95,
      protein: 4,
      carbs: 3,
      fat: 8,
    },
    { name: "Avocado (half)", calories: 120, protein: 1.5, carbs: 6, fat: 11 },
  ],
  vegetables: [
    {
      name: "Mixed Sauteed Vegetables (150g)",
      calories: 70,
      protein: 3,
      carbs: 12,
      fat: 1,
    },
    {
      name: "Side Salad with Lemon Dressing",
      calories: 45,
      protein: 1,
      carbs: 6,
      fat: 2,
    },
    {
      name: "Steamed Broccoli (150g)",
      calories: 51,
      protein: 4,
      carbs: 10,
      fat: 0.5,
    },
  ],
};

export const MEAL_SLOTS = ["Breakfast", "Lunch", "Snack", "Dinner"];

// Substitution map for the meal-swap engine: nutritionally similar alternatives.
export const SUBSTITUTIONS = {
  "Grilled Chicken Breast (150g)": [
    "Paneer (150g)",
    "Tofu (150g)",
    "Salmon Fillet (150g)",
  ],
  "Paneer (150g)": ["Grilled Chicken Breast (150g)", "Tofu (150g)"],
  "Tofu (150g)": ["Paneer (150g)", "Lentils, cooked (200g)"],
  "Salmon Fillet (150g)": ["Grilled Chicken Breast (150g)"],
  "Steamed Rice (150g)": [
    "Roti (2 pieces)",
    "Quinoa, cooked (150g)",
    "Sweet Potato (200g)",
  ],
  "Roti (2 pieces)": ["Steamed Rice (150g)", "Sweet Potato (200g)"],
  "Oats (60g dry)": ["Quinoa, cooked (150g)"],
};
