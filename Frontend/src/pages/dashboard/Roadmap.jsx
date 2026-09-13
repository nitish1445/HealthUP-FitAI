import React, { useCallback, useEffect, useState } from "react";
import { Flag, RefreshCw, Target, CheckCircle2, Activity } from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

export default function Roadmap() {
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        const res = await api.get("/roadmap");
        setData(res.data.data);

        if (showRefreshToast) {
          showToast("Roadmap refreshed successfully.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Unable to load your roadmap.";

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

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded bg-surface-soft" />
          <div className="mt-3 h-8 w-56 rounded-lg bg-surface-soft" />
          <div className="mt-2 h-4 w-72 rounded bg-surface-soft" />
        </div>

        <div className="h-44 animate-pulse rounded-3xl bg-surface-soft" />

        <div className="flex flex-col gap-4">
          <div className="h-32 animate-pulse rounded-3xl bg-surface-soft" />
          <div className="h-32 animate-pulse rounded-3xl bg-surface-soft" />
          <div className="h-32 animate-pulse rounded-3xl bg-surface-soft" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl bg-surface px-6 text-center shadow-[0_8px_30px_rgba(23,32,27,0.05)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
          <Target size={24} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-text">
          Unable to load your roadmap
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

  if (!data || !Array.isArray(data.weeks) || !data.weeks.length) {
    return (
      <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl bg-surface px-6 text-center shadow-[0_8px_30px_rgba(23,32,27,0.05)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-light text-secondary-dark">
          <Target size={24} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-text">
          Your roadmap is almost ready
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Complete your profile to generate your personalized 8-week roadmap.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark">
            Your journey
          </p>

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
            8-Week Roadmap
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            A structured path built around your goal, training, and nutrition.
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

      {/* Goal Summary */}
      <section className="rounded-3xl bg-text p-5 shadow-[0_12px_36px_rgba(23,32,27,0.08)] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-text">
              <Target size={24} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/45">
                Primary goal
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                {data.goal || "Your fitness goal"}
              </h2>
            </div>
          </div>

          <div className="rounded-xl bg-white/8 px-4 py-3">
            <p className="text-xs text-white/45">Plan duration</p>
            <p className="mt-0.5 text-sm font-semibold text-white">8 weeks</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Your roadmap</h2>

            <p className="mt-1 text-sm text-muted">
              Follow each phase and build momentum week by week.
            </p>
          </div>

          <span className="hidden text-xs font-medium text-muted sm:block">
            {data.weeks.length} weeks
          </span>
        </div>

        <div className="relative">
          {data.weeks.map((week, index) => {
            const isLast = index === data.weeks.length - 1;

            return (
              <div key={week.week} className="relative flex gap-3 sm:gap-5">
                {/* Timeline */}
                <div className="flex w-9 shrink-0 flex-col items-center">
                  <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-text shadow-[0_4px_12px_rgba(255,157,80,0.18)]">
                    {week.week}
                  </div>

                  {!isLast && <div className="w-px flex-1 bg-border" />}
                </div>

                {/* Week Card */}
                <div
                  className={`mb-4 min-w-0 flex-1 rounded-3xl bg-surface p-5 shadow-[0_7px_26px_rgba(23,32,27,0.05)] transition-shadow hover:shadow-[0_10px_30px_rgba(23,32,27,0.08)] sm:p-6 ${
                    isLast ? "mb-0" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
                          Week {week.week}
                        </span>

                        {index === 0 && (
                          <span className="rounded-full bg-success-light px-2.5 py-1 text-[10px] font-semibold text-success-dark">
                            Start here
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-text">
                        {week.intensityNote || "Training phase"}
                      </h3>
                    </div>

                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark sm:flex">
                      {index === data.weeks.length - 1 ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Activity size={18} />
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-background p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                        Training
                      </p>

                      <p className="mt-2 text-sm leading-6 text-text">
                        {week.intensityNote || "Follow your planned training."}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-background p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                        Nutrition
                      </p>

                      <p className="mt-2 text-sm leading-6 text-text">
                        {week.dietNote ||
                          "Stay consistent with your nutrition plan."}
                      </p>
                    </div>
                  </div>

                  {week.milestone && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl bg-primary-light p-4">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-text">
                        <Flag size={15} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark">
                          Milestone
                        </p>

                        <p className="mt-1 text-sm font-medium leading-6 text-text">
                          {week.milestone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
