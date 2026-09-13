import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import * as workoutService from "../../services/workoutService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function Workout() {
  const { showToast } = useToast();
  const [plan, setPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [logging, setLogging] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await workoutService.getActiveWorkoutPlan();
      setPlan(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your workout plan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await workoutService.regenerateWorkoutPlan();
      setPlan(res.data);
      setActiveDay(0);
      showToast("Plan regenerated");
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to generate a plan.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleLog = async (status) => {
    if (!plan) return;
    setLogging(true);
    try {
      const day = plan.days[activeDay];
      await workoutService.logWorkout(plan._id, {
        dayName: day.dayName,
        status,
        exercisesCompleted: day.exercises.map((ex) => ({ name: ex.name, completed: status === "Completed" })),
      });
      showToast(status === "Completed" ? "Workout marked as completed" : `Workout marked as ${status.toLowerCase()}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to save your workout.", "error");
    } finally {
      setLogging(false);
    }
  };

  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  if (!plan) {
    return (
      <EmptyState
        title="No active workout plan"
        description="Generate a plan based on your fitness profile to get started."
        action={
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating..." : "Generate Workout Plan"}
          </Button>
        }
      />
    );
  }

  const day = plan.days[activeDay];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">Workout</h1>
          <p className="text-sm text-muted mt-1">Goal: {plan.goal} · {plan.experienceLevel}</p>
        </div>
        <Button variant="secondary" onClick={handleGenerate} disabled={generating}>
          <RefreshCw size={16} /> {generating ? "Regenerating..." : "Regenerate Plan"}
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {plan.days.map((d, i) => (
          <button
            key={d.dayName}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeDay === i ? "bg-primary text-white" : "bg-surface border border-gray-200 text-muted hover:text-text"
            }`}
          >
            {d.dayName}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">{day.focus}</h2>
            {!day.isRestDay && <Badge tone="success">{day.intensity} intensity</Badge>}
          </div>
        </div>

        {day.isRestDay ? (
          <p className="text-sm text-muted">Rest day — recovery is part of your progress.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {day.exercises.map((ex) => (
              <div key={ex.name} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-sm text-text">{ex.name}</p>
                  <p className="text-xs text-muted mt-0.5">{ex.formGuidance}</p>
                </div>
                <div className="text-right text-sm text-muted shrink-0 ml-4">
                  <p>{ex.sets} × {ex.repsRange}</p>
                  <p className="text-xs">Rest: {ex.restSeconds}s</p>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-3 flex-wrap">
              <Button onClick={() => handleLog("Completed")} disabled={logging}>
                Finish Workout
              </Button>
              <Button variant="secondary" onClick={() => handleLog("Partial")} disabled={logging}>
                Mark Partial
              </Button>
              <Button variant="ghost" onClick={() => handleLog("Skipped")} disabled={logging}>
                Skip
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
