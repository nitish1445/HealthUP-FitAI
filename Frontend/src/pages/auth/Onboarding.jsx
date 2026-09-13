import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Check,
  CircleCheckBig,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Target,
} from "lucide-react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Logomark from "../../components/common/Logomark";

const GOALS = [
  {
    value: "Weight Loss",
    label: "Weight Loss",
    description: "Reduce body fat while improving overall fitness.",
  },
  {
    value: "Muscle Gain",
    label: "Muscle Gain",
    description: "Build strength and increase lean muscle.",
  },
  {
    value: "Body Recomposition",
    label: "Body Recomposition",
    description: "Build muscle while reducing body fat.",
  },
  {
    value: "Maintain",
    label: "Maintain",
    description: "Maintain your current weight and fitness.",
  },
  {
    value: "Improve Endurance",
    label: "Improve Endurance",
    description: "Improve stamina and cardiovascular fitness.",
  },
];

const STEPS = ["Basics", "Body", "Activity", "Goal"];

const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise",
  },
  {
    value: "light",
    label: "Light",
    description: "Exercise 1-3 days/week",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Exercise 3-5 days/week",
  },
  {
    value: "active",
    label: "Active",
    description: "Exercise 6-7 days/week",
  },
  {
    value: "very_active",
    label: "Very active",
    description: "Physical job + training",
  },
];

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to structured training",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Consistent training experience",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Strong training experience",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setHasProfile } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    age: "",
    biologicalSex: "male",
    heightCm: "",
    currentWeightKg: "",
    targetWeightKg: "",
    activityLevel: "moderate",
    experienceLevel: "beginner",
    primaryGoal: "Weight Loss",
    workoutDaysPerWeek: 4,
  });

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateStep = () => {
    if (step === 0) {
      return form.age && form.biologicalSex;
    }

    if (step === 1) {
      return (
        form.heightCm &&
        form.currentWeightKg &&
        form.targetWeightKg
      );
    }

    if (step === 2) {
      return (
        form.activityLevel &&
        form.experienceLevel &&
        form.workoutDaysPerWeek
      );
    }

    return form.primaryGoal;
  };

  const next = () => {
    if (!validateStep()) {
      setError("Please complete all fields before continuing.");
      return;
    }

    setError("");
    setStep((current) =>
      Math.min(current + 1, STEPS.length - 1),
    );
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      setError("Please complete all fields before continuing.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const payload = {
        age: Number(form.age),
        biologicalSex: form.biologicalSex,
        heightCm: Number(form.heightCm),
        currentWeightKg: Number(form.currentWeightKg),
        targetWeightKg: Number(form.targetWeightKg),
        activityLevel: form.activityLevel,
        experienceLevel: form.experienceLevel,
        primaryGoal: form.primaryGoal,
        workoutDaysPerWeek: Number(form.workoutDaysPerWeek),
      };

      const res = await api.post(
        "/profile/complete-profile",
        payload,
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Unable to save your profile.",
        );
      }

      setHasProfile(true);

      showToast("Your personalized plan is ready!");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to save your profile. Please try again.";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15";

  const selectClass =
    "h-11 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15";

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-text sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Logomark />

          <div>
            <span className="font-display text-lg font-semibold tracking-[-0.02em] text-text">
              HealthUP
            </span>

            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
              Fitness Intelligence
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-surface p-5 shadow-[0_12px_40px_rgba(23,32,27,0.07)] sm:p-7">
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary-dark">
                  Your profile
                </p>

                <p className="mt-1 font-display text-lg font-semibold text-text">
                  {STEPS[step]}
                </p>
              </div>

              <span className="text-xs font-medium text-muted">
                {step + 1} of {STEPS.length}
              </span>
            </div>

            <div className="flex gap-1.5">
              {STEPS.map((item, index) => (
                <div
                  key={item}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= step ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {step === 0 && (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                    <HeartPulse
                      size={19}
                      className="text-primary-dark"
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-semibold text-text">
                      Tell us about you
                    </h2>

                    <p className="mt-0.5 text-xs text-muted">
                      This helps us personalize your experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="age"
                    className="mb-1.5 block text-sm font-medium text-text"
                  >
                    Age
                  </label>

                  <input
                    id="age"
                    type="number"
                    min={13}
                    max={100}
                    value={form.age}
                    onChange={(e) =>
                      update("age", e.target.value)
                    }
                    placeholder="Enter your age"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Biological sex
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          update(
                            "biologicalSex",
                            option.value,
                          )
                        }
                        className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border text-sm font-medium transition-all ${
                          form.biologicalSex === option.value
                            ? "border-primary bg-primary-light text-primary-dark"
                            : "border-border bg-background text-text-secondary hover:bg-surface-soft"
                        }`}
                      >
                        {form.biologicalSex === option.value && (
                          <Check
                            size={16}
                            className="mr-2"
                          />
                        )}

                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light">
                    <Activity
                      size={19}
                      className="text-secondary-dark"
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-semibold text-text">
                      Your body
                    </h2>

                    <p className="mt-0.5 text-xs text-muted">
                      Tell us where you're starting from.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="height"
                    className="mb-1.5 block text-sm font-medium text-text"
                  >
                    Height
                  </label>

                  <div className="relative">
                    <input
                      id="height"
                      type="number"
                      min={50}
                      max={250}
                      value={form.heightCm}
                      onChange={(e) =>
                        update(
                          "heightCm",
                          e.target.value,
                        )
                      }
                      placeholder="170"
                      className={`${inputClass} pr-12`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
                      cm
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="currentWeight"
                    className="mb-1.5 block text-sm font-medium text-text"
                  >
                    Current weight
                  </label>

                  <div className="relative">
                    <input
                      id="currentWeight"
                      type="number"
                      min={20}
                      max={400}
                      value={form.currentWeightKg}
                      onChange={(e) =>
                        update(
                          "currentWeightKg",
                          e.target.value,
                        )
                      }
                      placeholder="70"
                      className={`${inputClass} pr-12`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
                      kg
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="targetWeight"
                    className="mb-1.5 block text-sm font-medium text-text"
                  >
                    Target weight
                  </label>

                  <div className="relative">
                    <input
                      id="targetWeight"
                      type="number"
                      min={20}
                      max={400}
                      value={form.targetWeightKg}
                      onChange={(e) =>
                        update(
                          "targetWeightKg",
                          e.target.value,
                        )
                      }
                      placeholder="65"
                      className={`${inputClass} pr-12`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
                      kg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light">
                    <Dumbbell
                      size={19}
                      className="text-success-dark"
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-semibold text-text">
                      Your activity
                    </h2>

                    <p className="mt-0.5 text-xs text-muted">
                      Help us understand your current routine.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Activity level
                  </label>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {ACTIVITY_LEVELS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          update(
                            "activityLevel",
                            option.value,
                          )
                        }
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                          form.activityLevel === option.value
                            ? "border-secondary bg-secondary-light"
                            : "border-border bg-background hover:bg-surface-soft"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-text">
                            {option.label}
                          </p>

                          <p className="mt-0.5 text-xs text-muted">
                            {option.description}
                          </p>
                        </div>

                        {form.activityLevel ===
                          option.value && (
                          <CircleCheckBig
                            size={17}
                            className="shrink-0 text-secondary-dark"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Experience level
                  </label>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {EXPERIENCE_LEVELS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          update(
                            "experienceLevel",
                            option.value,
                          )
                        }
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                          form.experienceLevel ===
                          option.value
                            ? "border-success bg-success-light"
                            : "border-border bg-background hover:bg-surface-soft"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-text">
                            {option.label}
                          </p>

                          <p className="mt-0.5 text-xs text-muted sm:hidden">
                            {option.description}
                          </p>
                        </div>

                        {form.experienceLevel ===
                          option.value && (
                          <CircleCheckBig
                            size={15}
                            className="text-success-dark"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="workoutDays"
                    className="mb-1.5 block text-sm font-medium text-text"
                  >
                    Workout days per week
                  </label>

                  <div className="relative">
                    <select
                      id="workoutDays"
                      value={form.workoutDaysPerWeek}
                      onChange={(e) =>
                        update(
                          "workoutDaysPerWeek",
                          e.target.value,
                        )
                      }
                      className={selectClass}
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(
                        (days) => (
                          <option
                            key={days}
                            value={days}
                          >
                            {days}{" "}
                            {days === 1
                              ? "day"
                              : "days"}{" "}
                            per week
                          </option>
                        ),
                      )}
                    </select>

                    <ChevronRight
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                    <Target
                      size={19}
                      className="text-primary-dark"
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-semibold text-text">
                      What's your main goal?
                    </h2>

                    <p className="mt-0.5 text-xs text-muted">
                      We'll use this to shape your personalized
                      plan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2.5">
                {GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() =>
                      update("primaryGoal", goal.value)
                    }
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
                      form.primaryGoal === goal.value
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:bg-surface-soft"
                    }`}
                  >
                    <div className="pr-4">
                      <p className="text-sm font-semibold text-text">
                        {goal.label}
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-muted">
                        {goal.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        form.primaryGoal === goal.value
                          ? "bg-success text-text"
                          : "border border-border-strong bg-surface"
                      }`}
                    >
                      {form.primaryGoal === goal.value && (
                        <Check className="h-4 w-4 text-text" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs leading-5 text-muted">
                Your goal helps HealthUP calculate your calorie
                target and generate your initial workout and diet
                plan.
              </p>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={`inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-soft hover:text-text ${
                step === 0 ? "invisible" : ""
              }`}
            >
              <ChevronLeft size={17} />
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_6px_18px_rgba(255,157,80,0.2)]"
              >
                Continue

                <ChevronRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_6px_18px_rgba(255,157,80,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Generating..."
                  : "Finish & Generate Plan"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                )}
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          Your information helps HealthUP create a plan tailored
          to you.
        </p>
      </div>
    </div>
  );
}