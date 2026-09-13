import { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as intelligenceService from "../../services/intelligenceService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import ProgressBar from "../../components/common/ProgressBar";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const RISK_TONE = { none: "success", at_risk: "warning", high_risk: "danger" };
const RISK_LABEL = { none: "On Track", at_risk: "At Risk", high_risk: "High Risk" };

export default function Habits() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.getHabits();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your habit data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { current, history } = data;
  const chartData = [...history].reverse().map((h) => ({
    week: new Date(h.weekStart).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: h.habitScore,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Habits</h1>
        <p className="text-sm text-muted mt-1">
          Habit Score = Workout Adherence × 0.60 + Diet Adherence × 0.40
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Weekly Habit Score</p>
          <p className="text-3xl font-semibold mb-2">{current.habitScore}/100</p>
          <ProgressBar value={current.habitScore} />
        </Card>
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Current Streak</p>
          <p className="text-3xl font-semibold">{current.streak} day{current.streak === 1 ? "" : "s"}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Risk Status</p>
          <Badge tone={RISK_TONE[current.riskStatus]}>{RISK_LABEL[current.riskStatus]}</Badge>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Workout Adherence</p>
          <p className="text-2xl font-semibold mb-2">{current.workoutAdherence}%</p>
          <ProgressBar value={current.workoutAdherence} />
        </Card>
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Diet Adherence</p>
          <p className="text-2xl font-semibold mb-2">{current.dietAdherence}%</p>
          <ProgressBar value={current.dietAdherence} tone="warning" />
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Monthly Trend</h2>
        {chartData.length === 0 ? (
          <EmptyState title="No habit history yet" description="Log workouts and meals for a few weeks to see your trend." />
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {current.riskStatus !== "none" && (
        <Card className="border border-amber-200 bg-amber-50/50">
          <h3 className="font-semibold text-amber-800 mb-1">We noticed a drop in consistency</h3>
          <p className="text-sm text-amber-700">
            {current.riskStatus === "high_risk"
              ? "It looks like it's been a while, or a few sessions were missed in a row. Consider a lighter plan or resetting your schedule — small consistent steps beat an all-or-nothing approach."
              : "Diet adherence has been lower than usual over the last two weeks. That's completely normal — consider simplifying your meal plan this week."}
          </p>
        </Card>
      )}
    </div>
  );
}
