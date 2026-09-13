import { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  Repeat,
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
  CheckCircle2,
} from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

export default function Diet() {
  const { showToast } = useToast();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [logging, setLogging] = useState(false);
  const [swapping, setSwapping] = useState(null);

  const load = useCallback(
    async (showSuccessToast = false) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/diet");
        setPlan(res.data.data);

        if (showSuccessToast) {
          showToast("Diet plan refreshed successfully.");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || "Unable to load your diet plan.";

        setError(message);
        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      const res = await api.post("/diet/generate");
      setPlan(res.data.data);
      showToast("Diet plan regenerated successfully.");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Unable to generate a diet plan.",
        "error",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleLog = async (adherence) => {
    setLogging(true);

    try {
      await api.post("/diet/log", { adherence });
      showToast(`Diet marked as ${adherence}.`);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Unable to save your diet log.",
        "error",
      );
    } finally {
      setLogging(false);
    }
  };

  const handleSwap = async (mealName, itemName) => {
    setSwapping(`${mealName}-${itemName}`);

    try {
      const res = await api.post("/diet/swap", {
        mealName,
        itemName,
      });

      setPlan(res.data.data);
      showToast("Meal item swapped successfully.");
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "No substitution available for this item.",
        "error",
      );
    } finally {
      setSwapping(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-8 w-28 animate-pulse rounded-lg bg-surface-soft" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-surface-soft" />
          </div>

          <div className="h-10 w-32 animate-pulse rounded-xl bg-surface-soft" />
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
          <Utensils size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">
          Unable to load diet plan
        </h2>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted">{error}</p>

        <button
          type="button"
          onClick={() => load()}
          className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-text px-4 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:opacity-90 active:scale-95"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-light text-secondary-dark">
          <Utensils size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">
          No active diet plan
        </h2>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Generate a personalized plan based on your calorie and macro targets.
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Utensils size={16} />
          {generating ? "Generating..." : "Generate Diet Plan"}
        </button>
      </div>
    );
  }

  const macroCards = [
    {
      label: "Calories",
      value: plan.calorieTarget,
      unit: "kcal",
      icon: Flame,
      className: "bg-primary-light text-primary-dark",
    },
    {
      label: "Protein",
      value: plan.macroTarget?.protein,
      unit: "g",
      icon: Beef,
      className: "bg-success-light text-success-dark",
    },
    {
      label: "Carbs",
      value: plan.macroTarget?.carbs,
      unit: "g",
      icon: Wheat,
      className: "bg-secondary-light text-secondary-dark",
    },
    {
      label: "Fat",
      value: plan.macroTarget?.fat,
      unit: "g",
      icon: Droplets,
      className: "bg-primary-light text-primary-dark",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-text">
            Diet
          </h1>

          <p className="mt-1 text-sm text-muted">
            Goal: {plan.goal || "Personalized nutrition"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading}
            className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 text-xs font-medium text-muted transition-all duration-200 hover:bg-surface-soft hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh diet plan"
            aria-label="Refresh diet plan"
          >
            <RefreshCw
              size={15}
              className={`transition-transform duration-500 ${
                loading ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />

            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary px-3.5 text-xs font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <RefreshCw size={15} className={generating ? "animate-spin" : ""} />

            <span className="hidden sm:inline">
              {generating ? "Regenerating..." : "Regenerate Plan"}
            </span>

            <span className="sm:hidden">
              {generating ? "..." : "Regenerate"}
            </span>
          </button>
        </div>
      </div>

      {/* Macro overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {macroCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl bg-surface p-4 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.className}`}
                >
                  <Icon size={17} />
                </div>

                <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted sm:text-[10px]">
                  {item.label}
                </span>
              </div>

              <p className="mt-4 text-xl font-semibold tracking-[-0.02em] text-text">
                {item.value ?? "—"}
                <span className="ml-1 text-xs font-medium text-muted">
                  {item.unit}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-4">
        {(plan.meals || []).map((meal) => (
          <div
            key={meal.mealName}
            className="rounded-2xl bg-surface p-4 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
                  <Utensils size={17} />
                </div>

                <div>
                  <h3 className="font-display text-base font-semibold text-text">
                    {meal.mealName}
                  </h3>

                  <p className="mt-0.5 text-xs text-muted">
                    {meal.items?.length || 0} item(s)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted sm:justify-end">
                <span>{meal.totalCalories} kcal</span>
                <span>P {meal.totalProtein}g</span>
                <span>C {meal.totalCarbs}g</span>
                <span>F {meal.totalFat}g</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {(meal.items || []).map((item) => {
                const swapKey = `${meal.mealName}-${item.name}`;
                const isSwapping = swapping === swapKey;

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-xl bg-background px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">
                        {item.name}
                      </p>

                      {item.quantity && (
                        <p className="mt-0.5 text-[11px] text-muted">
                          {item.quantity}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-xs text-muted sm:inline">
                        {item.calories} kcal
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSwap(meal.mealName, item.name)}
                        disabled={isSwapping}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-surface text-primary-dark transition-all duration-200 hover:bg-primary-light hover:text-primary-dark active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Swap ${item.name}`}
                        title="Swap this item"
                      >
                        <Repeat
                          size={15}
                          className={isSwapping ? "animate-spin" : ""}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Daily adherence */}
      <div className="rounded-2xl bg-text p-5 shadow-[0_4px_24px_rgba(23,32,27,0.06)] sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-white">
              How did today go?
            </h3>

            <p className="mt-1 text-xs leading-5 text-white/50">
              Log how closely you followed today's nutrition plan.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleLog("Followed")}
            disabled={logging}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            Mark Followed
          </button>

          <button
            type="button"
            onClick={() => handleLog("Mostly")}
            disabled={logging}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-white/15 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark Mostly
          </button>

          <button
            type="button"
            onClick={() => handleLog("Deviated")}
            disabled={logging}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-white/5 px-4 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark Deviated
          </button>
        </div>
      </div>
    </div>
  );
}
