import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Target, Scale, Flame, Activity, Zap, CheckCircle2 } from "lucide-react";
import * as analyticsService from "../../services/analyticsService";
import * as workoutService from "../../services/workoutService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function Dashboard() {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logging, setLogging] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getDashboardSummary();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuickComplete = async () => {
    if (!data?.todayWorkout || !data?.profile) return;
    setLogging(true);
    try {
      const activePlan = await workoutService.getActiveWorkoutPlan();
      if (!activePlan.data) throw new Error("No active plan");
      await workoutService.logWorkout(activePlan.data._id, {
        dayName: data.todayWorkout.dayName,
        status: "Completed",
      });
      showToast("Workout marked as completed");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to save your workout.", "error");
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (!data) {
    return (
      <EmptyState
        title="Let's set up your profile"
        description="Complete your fitness profile to get a personalized workout and diet plan."
        action={
          <Link to="/onboarding">
            <Button>Start Onboarding</Button>
          </Link>
        }
      />
    );
  }

  const { profile, currentWeightKg, todayWorkout, dietPlan, habit, recovery, forecast, recentAdjustments } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Welcome back 👋</h1>
        <p className="text-sm text-muted mt-1">Here's where things stand today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Goal" value={profile.primaryGoal} icon={Target} />
        <StatCard label="Current Weight" value={`${currentWeightKg} kg`} sub={`Target: ${profile.targetWeightKg} kg`} icon={Scale} />
        <StatCard label="Habit Score" value={`${habit.habitScore}/100`} sub={`Streak: ${habit.streak} day(s)`} icon={Flame} />
        <StatCard
          label="Energy Status"
          value={recovery.hasData ? recovery.todayEnergyLevel || "Not logged today" : "No data"}
          icon={Zap}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-text">Today's Workout</h2>
            <Link to="/dashboard/workout" className="text-xs font-medium text-primary-dark">
              View plan
            </Link>
          </div>
          {!todayWorkout ? (
            <p className="text-sm text-muted">No active plan yet. Visit the Workout page to generate one.</p>
          ) : todayWorkout.isRestDay ? (
            <div className="flex items-center gap-2">
              <Badge tone="neutral">Rest Day</Badge>
              <span className="text-sm text-muted">Recovery is part of the plan — enjoy it.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge tone="success">{todayWorkout.focus}</Badge>
                <span className="text-xs text-muted">{todayWorkout.exercises.length} exercises</span>
              </div>
              <ul className="text-sm text-text flex flex-col gap-1">
                {todayWorkout.exercises.slice(0, 3).map((ex) => (
                  <li key={ex.name} className="flex justify-between">
                    <span>{ex.name}</span>
                    <span className="text-muted">
                      {ex.sets} × {ex.repsRange}
                    </span>
                  </li>
                ))}
              </ul>
              <Button onClick={handleQuickComplete} disabled={logging} className="w-full mt-1">
                <CheckCircle2 size={16} />
                {logging ? "Saving..." : "Mark Completed"}
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-text">Today's Diet</h2>
            <Link to="/dashboard/diet" className="text-xs font-medium text-primary-dark">
              View plan
            </Link>
          </div>
          {!dietPlan ? (
            <p className="text-sm text-muted">No active diet plan yet. Visit the Diet page to generate one.</p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Calories</span>
                <span className="font-medium">{dietPlan.calorieTarget} kcal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Protein</span>
                <span className="font-medium">{dietPlan.macroTarget.protein} g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Carbs</span>
                <span className="font-medium">{dietPlan.macroTarget.carbs} g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Fat</span>
                <span className="font-medium">{dietPlan.macroTarget.fat} g</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-semibold text-text mb-2">Goal Forecast</h2>
          {!forecast?.hasEnoughData ? (
            <p className="text-sm text-muted">{forecast?.message}</p>
          ) : forecast.estimatedWeeksRange ? (
            <p className="text-sm text-text">
              At your current trajectory ({forecast.currentTrajectoryKgPerWeek} kg/week), you're projected to reach
              your goal in <strong>{forecast.estimatedWeeksRange[0]}–{forecast.estimatedWeeksRange[1]} weeks</strong>.
            </p>
          ) : (
            <p className="text-sm text-muted">{forecast.message}</p>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-text mb-2">AI Coach</h2>
          <p className="text-sm text-muted mb-3">
            {recovery.hasData ? recovery.recommendation : "Log an energy check-in to get a personalized recommendation."}
          </p>
          <Link to="/dashboard/coach">
            <Button variant="secondary" className="w-full">
              Ask FitAI
            </Button>
          </Link>
        </Card>
      </div>

      {recentAdjustments?.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} className="text-primary" />
            <h2 className="font-semibold text-text">Your plan was adjusted</h2>
          </div>
          <div className="flex flex-col gap-4">
            {recentAdjustments.map((adj) => (
              <div key={adj._id} className="border-l-2 border-primary pl-4">
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Reason</p>
                <p className="text-sm text-text mb-2">{adj.reason}</p>
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Change</p>
                <p className="text-sm text-text">{adj.change}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
