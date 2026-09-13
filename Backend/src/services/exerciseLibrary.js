// A small curated exercise library used by the rule-based workout generator.
// Each entry includes sets/reps/rest guidance tuned per experience level.

export const EXERCISE_LIBRARY = {
  Push: [
    {
      name: "Bench Press",
      muscleGroup: "Chest",
      formGuidance: "Keep shoulder blades retracted, control the descent.",
    },
    {
      name: "Shoulder Press",
      muscleGroup: "Shoulders",
      formGuidance: "Avoid arching your lower back; press straight up.",
    },
    {
      name: "Incline Dumbbell Press",
      muscleGroup: "Chest",
      formGuidance: "45-degree bench, elbows at ~45 degrees from torso.",
    },
    {
      name: "Triceps Pushdown",
      muscleGroup: "Triceps",
      formGuidance: "Keep elbows pinned to your sides.",
    },
    {
      name: "Lateral Raise",
      muscleGroup: "Shoulders",
      formGuidance: "Slight elbow bend, raise to shoulder height.",
    },
  ],
  Pull: [
    {
      name: "Deadlift",
      muscleGroup: "Back",
      formGuidance: "Neutral spine, push the floor away, bar close to shins.",
    },
    {
      name: "Lat Pulldown",
      muscleGroup: "Back",
      formGuidance: "Pull to upper chest, avoid excessive leaning back.",
    },
    {
      name: "Barbell Row",
      muscleGroup: "Back",
      formGuidance: "Hinge at hips, pull to lower ribcage.",
    },
    {
      name: "Face Pull",
      muscleGroup: "Rear Delts",
      formGuidance: "Pull to eye level, squeeze shoulder blades.",
    },
    {
      name: "Bicep Curl",
      muscleGroup: "Biceps",
      formGuidance: "Control the eccentric, avoid swinging.",
    },
  ],
  Legs: [
    {
      name: "Back Squat",
      muscleGroup: "Quads/Glutes",
      formGuidance: "Knees track over toes, brace your core.",
    },
    {
      name: "Romanian Deadlift",
      muscleGroup: "Hamstrings",
      formGuidance: "Hinge at hips, slight knee bend, bar close to legs.",
    },
    {
      name: "Leg Press",
      muscleGroup: "Quads",
      formGuidance: "Full range of motion, avoid locking knees hard.",
    },
    {
      name: "Walking Lunge",
      muscleGroup: "Glutes/Quads",
      formGuidance: "Keep torso upright, front knee stable.",
    },
    {
      name: "Calf Raise",
      muscleGroup: "Calves",
      formGuidance: "Full stretch at bottom, pause at top.",
    },
  ],
  "Upper Body": [
    {
      name: "Push-Up",
      muscleGroup: "Chest",
      formGuidance: "Body in a straight line, full range of motion.",
    },
    {
      name: "Dumbbell Row",
      muscleGroup: "Back",
      formGuidance: "Flat back, pull elbow toward hip.",
    },
    {
      name: "Overhead Press",
      muscleGroup: "Shoulders",
      formGuidance: "Brace core, avoid excessive back arch.",
    },
  ],
  "Lower Body": [
    {
      name: "Goblet Squat",
      muscleGroup: "Quads/Glutes",
      formGuidance: "Chest up, sit between your hips.",
    },
    {
      name: "Glute Bridge",
      muscleGroup: "Glutes",
      formGuidance: "Squeeze glutes at the top, avoid overarching.",
    },
    {
      name: "Step-Up",
      muscleGroup: "Quads/Glutes",
      formGuidance: "Drive through the front heel.",
    },
  ],
  Cardio: [
    {
      name: "Incline Treadmill Walk",
      muscleGroup: "Cardio",
      formGuidance: "Maintain a conversational pace.",
    },
    {
      name: "Cycling Intervals",
      muscleGroup: "Cardio",
      formGuidance: "Alternate high and moderate effort.",
    },
    {
      name: "Rowing Machine",
      muscleGroup: "Cardio",
      formGuidance: "Legs-hips-arms drive sequence.",
    },
  ],
  "Full Body": [
    {
      name: "Kettlebell Swing",
      muscleGroup: "Full Body",
      formGuidance: "Hip hinge power, not a squat.",
    },
    {
      name: "Burpee",
      muscleGroup: "Full Body",
      formGuidance: "Controlled tempo over speed early on.",
    },
    {
      name: "Plank",
      muscleGroup: "Core",
      formGuidance: "Neutral spine, brace core, don't sag hips.",
    },
  ],
  Mobility: [
    {
      name: "Dynamic Stretch Flow",
      muscleGroup: "Mobility",
      formGuidance: "Move through full pain-free range.",
    },
    {
      name: "Foam Rolling",
      muscleGroup: "Recovery",
      formGuidance: "Slow rolls over tight areas, 30-60s each.",
    },
    {
      name: "Light Walk",
      muscleGroup: "Recovery",
      formGuidance: "Easy pace, focus on breathing.",
    },
  ],
};

// Weekly split templates keyed by days-per-week and goal category.
export const SPLIT_TEMPLATES = {
  3: ["Full Body", "Rest", "Full Body", "Rest", "Full Body", "Rest", "Rest"],
  4: ["Upper Body", "Lower Body", "Rest", "Push", "Pull", "Rest", "Rest"],
  5: ["Push", "Pull", "Legs", "Rest", "Upper Body", "Lower Body", "Rest"],
  6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"],
};

export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
