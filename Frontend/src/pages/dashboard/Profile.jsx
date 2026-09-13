import { useEffect, useState, useCallback } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

const GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Body Recomposition",
  "Maintain",
  "Improve Endurance",
];

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15";

const disabledInputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-muted outline-none";

const selectClass =
  "h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15";

const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const Field = ({
  label,
  type = "text",
  value,
  onChange,
  disabled = false,
  min,
  max,
  step,
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-text-secondary">
      {label}
    </span>

    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={disabled ? disabledInputClass : inputClass}
    />
  </label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-text-secondary">
      {label}
    </span>

    <select value={value ?? ""} onChange={onChange} className={selectClass}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const Section = ({ title, description, children }) => (
  <section className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
    <div className="mb-5">
      <h2 className="font-semibold text-text">{title}</h2>

      {description && (
        <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      )}
    </div>

    {children}
  </section>
);

const LoadingState = () => (
  <div className="flex w-full flex-col gap-6">
    <div>
      <div className="h-7 w-32 animate-pulse rounded-lg bg-border/60" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-border/50" />
    </div>

    <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 animate-pulse rounded-full bg-border/50" />

        <div className="flex-1">
          <div className="h-5 w-40 animate-pulse rounded bg-border/60" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-border/40" />
          <div className="mt-2 h-4 w-20 animate-pulse rounded bg-border/40" />
        </div>
      </div>
    </div>

    {[1, 2, 3, 4].map((section) => (
      <div
        key={section}
        className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6"
      >
        <div className="mb-5 h-5 w-40 animate-pulse rounded bg-border/60" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item}>
              <div className="mb-2 h-3 w-24 animate-pulse rounded bg-border/50" />
              <div className="h-12 animate-pulse rounded-xl bg-border/40" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-90 w-full flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center shadow-[0_4px_20px_rgba(23,32,27,0.05)]">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
      !
    </div>

    <h2 className="text-lg font-semibold text-text">
      Unable to load your profile
    </h2>

    <p className="mt-2 max-w-md text-sm leading-6 text-muted">{message}</p>

    {onRetry && (
      <Button onClick={onRetry} className="mt-5">
        Try Again
      </Button>
    )}
  </div>
);

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const userName = user?.name || user?.fullName || "User";
  const userEmail = user?.email || "";
  const userRole = user?.role || "user";

  const nameParts = userName.trim().split(/\s+/);

  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0]?.charAt(0) || "U";

  const profileImage =
    user?.profileImage ||
    user?.profilePicture ||
    user?.avatar ||
    user?.image?.src ||
    "";

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const res = await api.get("/profile/user-profile");
        const profileData = res.data.data;

        setProfile(profileData);

        if (profileData) {
          setForm(profileData);
        }

        if (isRefresh) {
          showToast("Profile refreshed successfully.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Unable to load your profile.";

        setError(message);

        if (isRefresh) {
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

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form) return;

    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const currentWeightKg = Number(form.currentWeightKg);
    const targetWeightKg = Number(form.targetWeightKg);
    const workoutDaysPerWeek = Number(form.workoutDaysPerWeek);

    if (
      !age ||
      !heightCm ||
      !currentWeightKg ||
      !targetWeightKg ||
      !workoutDaysPerWeek
    ) {
      showToast("Please complete all required profile fields.", "error");
      return;
    }

    if (workoutDaysPerWeek < 1 || workoutDaysPerWeek > 7) {
      showToast("Workout days must be between 1 and 7.", "error");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        age,
        biologicalSex: form.biologicalSex,
        heightCm,
        currentWeightKg,
        targetWeightKg,
        activityLevel: form.activityLevel,
        experienceLevel: form.experienceLevel,
        primaryGoal: form.primaryGoal,
        workoutDaysPerWeek,
      };

      const res = await api.put("/profile/update-profile", payload);

      const updatedProfile = res.data.data;

      setProfile(updatedProfile);
      setForm(updatedProfile);

      showToast("Profile updated successfully.");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to save your profile.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !profile) {
    return <ErrorState message={error} onRetry={() => load()} />;
  }

  if (!profile || !form) {
    return <ErrorState message="Complete onboarding to view your profile." />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Profile
          </h1>

          <p className="mt-1 text-sm leading-6 text-muted">
            Manage your personal and fitness information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-[0_3px_14px_rgba(23,32,27,0.05)] transition-all duration-200 hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <section className="w-full rounded-2xl bg-surface p-5 shadow-[0_6px_24px_rgba(23,32,27,0.06)] sm:p-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary sm:h-24 sm:w-24">
            {profileImage ? (
              <img
                src={profileImage}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold tracking-wide text-text sm:text-3xl">
                {initials.toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-text sm:text-2xl">
              {userName}
            </h2>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{userEmail}</span>
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary-light px-2.5 py-1 text-[10px] font-semibold capitalize text-secondary-dark">
              <ShieldCheck size={12} />
              {userRole}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs leading-5 text-muted">
          <UserRound size={14} className="mt-0.5 shrink-0" />
          <span>
            Your profile photo is displayed here. If you haven't added one,
            HealthUP shows your name initials instead.
          </span>
        </div>
      </section>

      <Section
        title="Personal Information"
        description="Your account details and basic personal information."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Name" value={userName} disabled />

          <Field label="Email" value={userEmail} disabled />

          <Field
            label="Age"
            type="number"
            min={1}
            max={120}
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />

          <SelectField
            label="Biological sex"
            value={form.biologicalSex}
            onChange={(e) => update("biologicalSex", e.target.value)}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </div>
      </Section>

      <Section
        title="Body Information"
        description="Keep your current and target body information up to date."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Height (cm)"
            type="number"
            min={1}
            step="0.1"
            value={form.heightCm}
            onChange={(e) => update("heightCm", e.target.value)}
          />

          <Field
            label="Current weight (kg)"
            type="number"
            min={1}
            step="0.1"
            value={form.currentWeightKg}
            onChange={(e) => update("currentWeightKg", e.target.value)}
          />

          <Field
            label="Target weight (kg)"
            type="number"
            min={1}
            step="0.1"
            value={form.targetWeightKg}
            onChange={(e) => update("targetWeightKg", e.target.value)}
          />
        </div>
      </Section>

      <Section
        title="Fitness"
        description="Adjust the information HealthUP uses to personalize your plans."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
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

          <SelectField
            label="Experience level"
            value={form.experienceLevel}
            onChange={(e) => update("experienceLevel", e.target.value)}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />

          <SelectField
            label="Primary goal"
            value={form.primaryGoal}
            onChange={(e) => update("primaryGoal", e.target.value)}
            options={GOALS.map((goal) => ({
              value: goal,
              label: goal,
            }))}
          />

          <Field
            label="Workout days per week"
            type="number"
            min={1}
            max={7}
            value={form.workoutDaysPerWeek}
            onChange={(e) => update("workoutDaysPerWeek", e.target.value)}
          />
        </div>
      </Section>

      <Section
        title="Calculated Metrics"
        description="Metrics calculated from your current profile information."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-background p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              BMI
            </p>

            <p className="mt-1 text-xl font-semibold text-text">
              {profile.bmi ?? "—"}

              {profile.bmiCategory && (
                <span className="ml-1 text-xs font-normal text-muted">
                  ({profile.bmiCategory})
                </span>
              )}
            </p>
          </div>

          <div className="rounded-xl bg-background p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Maintenance Calories
            </p>

            <p className="mt-1 text-xl font-semibold text-text">
              {profile.maintenanceCalories ?? "—"}

              {profile.maintenanceCalories != null && (
                <span className="ml-1 text-xs font-normal text-muted">
                  kcal
                </span>
              )}
            </p>
          </div>

          <div className="rounded-xl bg-background p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Target Calories
            </p>

            <p className="mt-1 text-xl font-semibold text-text">
              {profile.calorieTarget ?? "—"}

              {profile.calorieTarget != null && (
                <span className="ml-1 text-xs font-normal text-muted">
                  kcal
                </span>
              )}
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs leading-5 text-muted">
          This information is provided for general fitness guidance and is not a
          substitute for medical advice.
        </p>
      </Section>

      <div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
