import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Repeat } from "lucide-react";
import * as dietService from "../../services/dietService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function Diet() {
  const { showToast } = useToast();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [logging, setLogging] = useState(false);
  const [swapping, setSwapping] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dietService.getActiveDietPlan();
      setPlan(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your diet plan.");
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
      const res = await dietService.regenerateDietPlan();
      setPlan(res.data);
      showToast("Diet plan regenerated");
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to generate a plan.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleLog = async (adherence) => {
    setLogging(true);
    try {
      await dietService.logDiet({ adherence });
      showToast("Diet log saved");
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to save your log.", "error");
    } finally {
      setLogging(false);
    }
  };

  const handleSwap = async (mealName, itemName) => {
    setSwapping(itemName);
    try {
      const res = await dietService.swapMeal(mealName, itemName);
      setPlan(res.data);
      showToast("Meal swapped successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "No substitution available for this item.", "error");
    } finally {
      setSwapping(null);
    }
  };

  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  if (!plan) {
    return (
      <EmptyState
        title="No active diet plan"
        description="Generate a plan based on your calorie and macro targets."
        action={
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating..." : "Generate Diet Plan"}
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">Diet</h1>
          <p className="text-sm text-muted mt-1">Goal: {plan.goal}</p>
        </div>
        <Button variant="secondary" onClick={handleGenerate} disabled={generating}>
          <RefreshCw size={16} /> {generating ? "Regenerating..." : "Regenerate Plan"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-xs text-muted uppercase">Calories</p>
          <p className="text-xl font-semibold mt-1">{plan.calorieTarget}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted uppercase">Protein</p>
          <p className="text-xl font-semibold mt-1">{plan.macroTarget.protein}g</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted uppercase">Carbs</p>
          <p className="text-xl font-semibold mt-1">{plan.macroTarget.carbs}g</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted uppercase">Fat</p>
          <p className="text-xl font-semibold mt-1">{plan.macroTarget.fat}g</p>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        {plan.meals.map((meal) => (
          <Card key={meal.mealName}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{meal.mealName}</h3>
              <span className="text-xs text-muted">
                {meal.totalCalories} kcal · P{meal.totalProtein} C{meal.totalCarbs} F{meal.totalFat}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {meal.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted text-xs">{item.calories} kcal</span>
                    <button
                      onClick={() => handleSwap(meal.mealName, item.name)}
                      disabled={swapping === item.name}
                      className="text-primary-dark hover:opacity-70"
                      aria-label={`Swap ${item.name}`}
                      title="Swap this item"
                    >
                      <Repeat size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold mb-3">How did today go?</h3>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => handleLog("Followed")} disabled={logging}>
            Mark Followed
          </Button>
          <Button variant="secondary" onClick={() => handleLog("Mostly")} disabled={logging}>
            Mark Mostly
          </Button>
          <Button variant="ghost" onClick={() => handleLog("Deviated")} disabled={logging}>
            Mark Deviated
          </Button>
        </div>
      </Card>
    </div>
  );
}
