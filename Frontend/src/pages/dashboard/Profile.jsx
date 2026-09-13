import { useEffect, useState, useCallback } from "react";
import * as profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";

const GOALS = ["Weight Loss", "Muscle Gain", "Body Recomposition", "Maintain", "Improve Endurance"];

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.getProfile();
      setProfile(res.data);
      if (res.data) setForm(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileService.updateProfile({
        age: Number(form.age),
        biologicalSex: form.biologicalSex,
        heightCm: Number(form.heightCm),
        currentWeightKg: Number(form.currentWeightKg),
        targetWeightKg: Number(form.targetWeightKg),
        activityLevel: form.activityLevel,
        experienceLevel: form.experienceLevel,
        primaryGoal: form.primaryGoal,
        workoutDaysPerWeek: Number(form.workoutDaysPerWeek),
      });
      setProfile(res.data);
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to save your profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!profile || !form) return <ErrorState message="Complete onboarding to view your profile." />;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-text">Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your personal and fitness information.</p>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Name" value={user?.name || ""} disabled />
          <Input label="Email" value={user?.email || ""} disabled />
          <Input label="Age" type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
          <Select
            label="Biological sex"
            value={form.biologicalSex}
            onChange={(e) => update("biologicalSex", e.target.value)}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Body Information</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Height (cm)" type="number" value={form.heightCm} onChange={(e) => update("heightCm", e.target.value)} />
          <Input
            label="Current weight (kg)"
            type="number"
            value={form.currentWeightKg}
            onChange={(e) => update("currentWeightKg", e.target.value)}
          />
          <Input
            label="Target weight (kg)"
            type="number"
            value={form.targetWeightKg}
            onChange={(e) => update("targetWeightKg", e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Fitness</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Activity level"
            value={form.activityLevel}
            onChange={(e) => update("activityLevel", e.target.value)}
            options={[
              { value: "sedentary", label: "Sedentary" },
              { value: "light", label: "Light" },
              { value: "moderate", label: "Moderate" },
              { value: "active", label: "Active" },
              { value: "very_active", label: "Very Active" },
            ]}
          />
          <Select
            label="Experience level"
            value={form.experienceLevel}
            onChange={(e) => update("experienceLevel", e.target.value)}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
          <Select
            label="Primary goal"
            value={form.primaryGoal}
            onChange={(e) => update("primaryGoal", e.target.value)}
            options={GOALS.map((g) => ({ value: g, label: g }))}
          />
          <Input
            label="Workout days per week"
            type="number"
            min={1}
            max={7}
            value={form.workoutDaysPerWeek}
            onChange={(e) => update("workoutDaysPerWeek", e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Calculated Metrics</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted text-xs uppercase mb-1">BMI</p>
            <p className="font-semibold text-lg">{profile.bmi} <span className="text-xs text-muted font-normal">({profile.bmiCategory})</span></p>
          </div>
          <div>
            <p className="text-muted text-xs uppercase mb-1">Maintenance Calories</p>
            <p className="font-semibold text-lg">{profile.maintenanceCalories} kcal</p>
          </div>
          <div>
            <p className="text-muted text-xs uppercase mb-1">Target Calories</p>
            <p className="font-semibold text-lg">{profile.calorieTarget} kcal</p>
          </div>
        </div>
        <p className="text-xs text-muted mt-4">
          This information is provided for general fitness guidance and is not a substitute for medical advice.
        </p>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="self-start">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
