import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ChevronRight,
  KeyRound,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../config/Api";

export default function Settings() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const navigate = useNavigate();

  const [evaluating, setEvaluating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const userName = user?.name || user?.fullName || "User";
  const userEmail = user?.email || "No email available";
  const userRole = user?.role || "user";

  const initials = userName
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const handleEvaluate = async () => {
    setEvaluating(true);

    try {
      const res = await api.post("/plans/evaluate");

      const adjustments =
        res.data?.data?.adjustments || res.data?.adjustments || [];

      const count = adjustments.length;

      showToast(
        count > 0
          ? `Plan regenerated with ${count} adjustment(s).`
          : "Evaluation complete — no adjustments needed.",
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to run evaluation.",
        "error",
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();

    console.log("Change password form:", passwordForm);

    showToast("Change password is not connected yet.");
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark">
          Account preferences
        </p>

        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          Manage your account, security, plan intelligence, and current session.
        </p>
      </div>

      {/* Account */}
      <section className="rounded-3xl bg-surface p-5 shadow-[0_8px_30px_rgba(23,32,27,0.05)] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-text">
              {initials || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-text">Account</h2>

              <p className="mt-1 truncate text-sm text-muted">{userEmail}</p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-success-light px-3 py-1.5 text-xs font-semibold capitalize text-success-dark">
            {userRole}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-background p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              Name
            </p>

            <p className="mt-2 truncate text-sm font-semibold text-text">
              {userName}
            </p>
          </div>

          <div className="rounded-2xl bg-background p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              Email
            </p>

            <p className="mt-2 truncate text-sm font-semibold text-text">
              {userEmail}
            </p>
          </div>

          <div className="rounded-2xl bg-background p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              Account type
            </p>

            <p className="mt-2 text-sm font-semibold capitalize text-text">
              {userRole}
            </p>
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section className="rounded-3xl bg-surface p-5 shadow-[0_8px_30px_rgba(23,32,27,0.05)] sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
            <KeyRound size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-text">Change Password</h2>

            <p className="mt-1 text-sm leading-6 text-muted">
              Update your account password to keep your HealthUP account secure.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordChange}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Current password
            </label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordInput}
              placeholder="Current password"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              New password
            </label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordInput}
              placeholder="New password"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordInput}
              placeholder="Confirm password"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-primary-dark sm:w-auto"
            >
              <KeyRound size={16} />
              Change Password
            </button>
          </div>
        </form>
      </section>

      {/* Plan Evaluation */}
      <section className="rounded-3xl bg-text p-5 shadow-[0_12px_36px_rgba(23,32,27,0.08)] sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-text">
              <Activity size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                HealthUP intelligence
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                Weekly Plan Evaluation
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                HealthUP automatically evaluates your progress each week and can
                adjust your plan when your results suggest a change is needed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={evaluating}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw size={16} className={evaluating ? "animate-spin" : ""} />
            {evaluating ? "Evaluating..." : "Run Evaluation"}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-white/45">
          <ShieldCheck size={15} />
          Your plan is evaluated using your recent progress and adherence.
        </div>
      </section>

      {/* Session */}
      <section className="rounded-3xl bg-surface p-5 shadow-[0_8px_30px_rgba(23,32,27,0.05)] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-text">Current Session</h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                Sign out of your HealthUP account on this device.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-danger px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(220,38,38,0.16)] transition-all hover:bg-danger/90 hover:shadow-[0_7px_20px_rgba(220,38,38,0.22)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-32.5"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out..." : "Log Out"}
            {!loggingOut && <ChevronRight size={15} />}
          </button>
        </div>
      </section>
    </div>
  );
}
