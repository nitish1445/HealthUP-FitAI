import React, { useCallback, useEffect, useState } from "react";
import { Activity, Battery, Check, RefreshCw, ShieldCheck } from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

const LEVELS = [
  {
    label: "Energized",
    description: "Ready for a strong session",
    icon: "⚡",
  },
  {
    label: "Normal",
    description: "Feeling good and steady",
    icon: "◉",
  },
  {
    label: "Slightly Fatigued",
    description: "May need lighter training",
    icon: "◐",
  },
  {
    label: "Very Tired",
    description: "Recovery should come first",
    icon: "○",
  },
];

export default function Recovery() {
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
        const res = await api.get("/recovery");
        setData(res.data.data);

        if (showRefreshToast) {
          showToast("Recovery data refreshed successfully.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Unable to load recovery data.";

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

  const handleCheckIn = async (level) => {
    setSubmitting(true);

    try {
      await api.post("/recovery/check-in", {
        energyLevel: level,
      });

      showToast(
        level === "Very Tired" || level === "Slightly Fatigued"
          ? "Recovery day applied."
          : "Check-in saved.",
      );

      await load();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to save your check-in.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse">
          <div className="h-8 w-36 rounded-lg bg-surface-soft" />
          <div className="mt-2 h-4 w-80 rounded bg-surface-soft" />
        </div>
        <div className="h-56 animate-pulse rounded-3xl bg-surface-soft" />
        <div className="h-64 animate-pulse rounded-3xl bg-surface-soft" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl bg-surface px-6 text-center shadow-[0_8px_30px_rgba(23,32,27,0.05)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
          <Activity size={24} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-text">
          Something went wrong
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

  if (!data) {
    return (
      <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl bg-surface px-6 text-center shadow-[0_8px_30px_rgba(23,32,27,0.05)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-light text-secondary-dark">
          <Battery size={25} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-text">
          No recovery data yet
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Complete your daily energy check-in to start understanding your
          recovery.
        </p>
      </div>
    );
  }

  const todayLevel = data.todayEnergyLevel;
  const selectedLevel = LEVELS.find((item) => item.label === todayLevel);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark">
            Daily recovery
          </p>

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
            How is your body feeling?
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Tell HealthUP how you feel today and we’ll use it to guide your
            training intensity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-[0_4px_18px_rgba(23,32,27,0.06)] transition-all hover:shadow-[0_7px_24px_rgba(23,32,27,0.09)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Today's Status */}
      <section className="rounded-3xl bg-text p-5 shadow-[0_12px_36px_rgba(23,32,27,0.08)] sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface text-2xl">
              {selectedLevel?.icon || "◉"}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/45">
                Today's energy
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-white">
                {todayLevel || "Not checked in"}
              </h2>

              {selectedLevel && (
                <p className="mt-1 text-sm text-white/55">
                  {selectedLevel.description}
                </p>
              )}
            </div>
          </div>

          {data.forceRecoveryDay && (
            <div className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-text">
              <ShieldCheck size={18} />
              Recovery day active
            </div>
          )}
        </div>
      </section>

      {/* Energy Check-in */}
      <section className="rounded-3xl bg-surface p-5 shadow-[0_8px_30px_rgba(23,32,27,0.05)] sm:p-7">
        <div>
          <h2 className="text-lg font-semibold text-text">Energy check-in</h2>

          <p className="mt-1 text-sm leading-6 text-muted">
            Choose the option that best describes you right now.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LEVELS.map((level) => {
            const selected = todayLevel === level.label;

            return (
              <button
                key={level.label}
                type="button"
                onClick={() => handleCheckIn(level.label)}
                disabled={submitting}
                className={`group flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                  selected
                    ? "bg-primary-light shadow-[0_5px_18px_rgba(255,157,80,0.12)]"
                    : "bg-background hover:bg-surface-soft"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                    selected ? "bg-primary text-text" : "bg-surface text-muted"
                  }`}
                >
                  {level.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      selected ? "text-primary-dark" : "text-text"
                    }`}
                  >
                    {level.label}
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-muted">
                    {level.description}
                  </p>
                </div>

                {selected && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-text">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {submitting && (
          <p className="mt-4 text-xs font-medium text-muted">
            Saving your recovery check-in...
          </p>
        )}
      </section>

      {/* Recommendation */}
      <section className="rounded-3xl bg-primary-light p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-text">
            <Activity size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-dark">
              HealthUP recommendation
            </p>

            <p className="mt-2 text-base font-medium leading-7 text-text">
              {data.hasData ? data.recommendation : data.message}
            </p>

            {data.forceRecoveryDay && (
              <p className="mt-3 text-sm leading-6 text-text/65">
                Your recent recovery signals suggest prioritizing rest and
                reducing training intensity today.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Fatigue */}
      {data.hasData && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-surface p-5 shadow-[0_8px_30px_rgba(23,32,27,0.05)] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Fatigue flags</p>

                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-text">
                  {data.fatigueFlags}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
                <Battery size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-muted">
              Flags recorded during the last 7 days.
            </p>
          </div>

          <div className="rounded-3xl bg-surface p-5 shadow-[0_8px_30px_rgba(23,32,27,0.05)] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted">
                  Recovery status
                </p>

                <p className="mt-2 text-xl font-semibold text-text">
                  {data.forceRecoveryDay ? "Take it easy" : "Training ready"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-light text-success-dark">
                <ShieldCheck size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-muted">
              {data.forceRecoveryDay
                ? "A recovery day has been triggered based on your recent fatigue."
                : "No forced recovery day is currently active."}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
