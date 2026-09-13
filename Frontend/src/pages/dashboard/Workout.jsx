import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Check,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flag,
  RefreshCw,
  SkipForward,
  Target,
} from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

export default function Workout() {
  const { showToast } = useToast();

  const [plan, setPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [logging, setLogging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (showRefreshToast = false) => {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const res = await api.get("/workouts");
        setPlan(res.data.data);

        if (showRefreshToast) {
          showToast("Workout plan refreshed successfully.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Unable to load your workout plan.";

        setError(message);

        if (showRefreshToast) {
          showToast(message, "error");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
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
      const res = await api.post("/workouts/generate");

      setPlan(res.data.data);
      setActiveDay(0);

      showToast("Workout plan regenerated successfully.");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to generate your workout plan.",
        "error",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleLog = async (status) => {
    if (!plan) return;

    const day = plan.days?.[activeDay];

    if (!day) return;

    setLogging(true);

    try {
      await api.post(`/workouts/${plan._id}/log`, {
        dayName: day.dayName,
        status,
        exercisesCompleted: (day.exercises || []).map((exercise) => ({
          name: exercise.name,
          completed: status === "Completed",
        })),
      });

      showToast(
        status === "Completed"
          ? "Workout completed. Great work!"
          : status === "Partial"
            ? "Workout marked as partial."
            : "Workout marked as skipped.",
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to save your workout.",
        "error",
      );
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded bg-surface-soft" />
          <div className="mt-3 h-8 w-48 rounded-lg bg-surface-soft" />
          <div className="mt-2 h-4 w-80 rounded bg-surface-soft" />
        </div>

        <div className="h-44 animate-pulse rounded-3xl bg-surface-soft" />
        <div className="h-16 animate-pulse rounded-2xl bg-surface-soft" />
        <div className="h-96 animate-pulse rounded-3xl bg-surface-soft" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl bg-surface px-6 text-center shadow-[0_8px_30px_rgba(23,32,27,0.05)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
          <Dumbbell size={24} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-text">
          Unable to load your workout
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted">{error}</p>

        <button
          type="button"
          onClick={() => load()}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-primary-dark"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  if (!plan || !Array.isArray(plan.days) || !plan.days.length) {
    return (
      <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl bg-surface px-6 text-center shadow-[0_8px_30px_rgba(23,32,27,0.05)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-light text-secondary-dark">
          <Dumbbell size={24} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-text">
          No active workout plan
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Generate a personalized workout plan based on your fitness profile to
          get started.
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={generating ? "animate-spin" : ""} />
          {generating ? "Generating..." : "Generate Workout Plan"}
        </button>
      </div>
    );
  }

  const day = plan.days[activeDay];

  const exercises = day?.exercises || [];

  const totalExercises = exercises.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark">
            Training plan
          </p>

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
            Workout
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            {plan.goal
              ? `Built for ${plan.goal}`
              : "Your personalized training plan"}
            {plan.experienceLevel ? ` · ${plan.experienceLevel} level` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-[0_4px_18px_rgba(23,32,27,0.06)] transition-all hover:shadow-[0_7px_24px_rgba(23,32,27,0.09)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={generating ? "animate-spin" : ""} />
          {generating ? "Regenerating..." : "Regenerate Plan"}
        </button>
      </div>

      {/* Plan Overview */}
      <section className="rounded-3xl bg-text p-5 shadow-[0_12px_36px_rgba(23,32,27,0.08)] sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-text">
              <Dumbbell size={24} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/45">
                Current plan
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                {plan.goal || "Personalized Training"}
              </h2>

              <p className="mt-1 text-sm text-white/50">
                {plan.days.length} training days in your current plan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/8 px-4 py-3">
              <p className="text-xs text-white/45">Days</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {plan.days.length}
              </p>
            </div>

            <div className="rounded-xl bg-white/8 px-4 py-3">
              <p className="text-xs text-white/45">Exercises</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {plan.days.reduce(
                  (total, currentDay) =>
                    total + (currentDay.exercises?.length || 0),
                  0,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Day Selector */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Training schedule
            </h2>

            <p className="mt-1 text-sm text-muted">
              Select a day to view your workout.
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {plan.days.map((item, index) => {
            const selected = activeDay === index;

            return (
              <button
                key={`${item.dayName}-${index}`}
                type="button"
                onClick={() => setActiveDay(index)}
                className={`flex min-w-27.5 cursor-pointer shrink-0 flex-col items-center rounded-2xl px-4 py-3 transition-all ${
                  selected
                    ? "bg-primary text-text shadow-[0_5px_16px_rgba(255,157,80,0.18)]"
                    : "bg-surface text-muted shadow-[0_4px_16px_rgba(23,32,27,0.04)] hover:bg-surface-soft hover:text-text"
                }`}
              >
                <span className="text-xs font-semibold">Day {index + 1}</span>

                <span
                  className={`mt-1 max-w-25 truncate text-xs ${
                    selected ? "text-text/65" : "text-muted"
                  }`}
                >
                  {item.dayName}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Workout */}
      <section className="rounded-3xl bg-surface shadow-[0_8px_30px_rgba(23,32,27,0.05)]">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
                {day.isRestDay ? (
                  <Activity size={21} />
                ) : (
                  <Dumbbell size={21} />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
                  Day {activeDay + 1}
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-text">
                  {day.focus || day.dayName}
                </h2>

                {!day.isRestDay && day.intensity && (
                  <p className="mt-1 text-sm text-muted">
                    {day.intensity} intensity
                  </p>
                )}
              </div>
            </div>

            {!day.isRestDay && (
              <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-2 text-xs font-medium text-muted">
                <Target size={15} />
                {totalExercises}{" "}
                {totalExercises === 1 ? "exercise" : "exercises"}
              </div>
            )}
          </div>

          {day.isRestDay ? (
            <div className="mt-6 rounded-2xl bg-secondary-light p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-text">
                  <Activity size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-text">Recovery day</h3>

                  <p className="mt-1 text-sm leading-6 text-text/65">
                    Rest day — recovery is part of your progress. Give your body
                    time to adapt and come back stronger.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Exercise List */}
              <div className="mt-6 flex flex-col gap-3">
                {exercises.map((exercise, index) => (
                  <div
                    key={`${exercise.name}-${index}`}
                    className="rounded-2xl bg-background p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-xs font-bold text-muted">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-text">
                            {exercise.name}
                          </p>

                          {exercise.formGuidance && (
                            <p className="mt-1 text-xs leading-5 text-muted">
                              {exercise.formGuidance}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <div className="rounded-xl bg-surface px-3 py-2 text-center">
                          <p className="text-xs font-semibold text-text">
                            {exercise.sets} × {exercise.repsRange}
                          </p>

                          <p className="mt-0.5 text-[10px] text-muted">
                            Sets × reps
                          </p>
                        </div>

                        <div className="rounded-xl bg-surface px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Clock3 size={12} className="text-muted" />
                            <span className="text-xs font-semibold text-text">
                              {exercise.restSeconds}s
                            </span>
                          </div>

                          <p className="mt-0.5 text-[10px] text-muted">Rest</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleLog("Completed")}
                  disabled={logging}
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <CheckCircle2 size={17} />
                  {logging ? "Saving..." : "Finish Workout"}
                </button>

                <button
                  type="button"
                  onClick={() => handleLog("Partial")}
                  disabled={logging}
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary-light px-5 py-3 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary/15 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Flag size={16} />
                  Mark Partial
                </button>

                <button
                  type="button"
                  onClick={() => handleLog("Skipped")}
                  disabled={logging}
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-soft hover:text-text disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <SkipForward size={16} />
                  Skip
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
