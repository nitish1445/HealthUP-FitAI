import { useEffect, useState, useCallback } from "react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";
import { Users, RefreshCw, CalendarDays } from "lucide-react";

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (showSuccessToast = false) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.data);

        if (showSuccessToast) {
          showToast("Users refreshed successfully.");
        }
      } catch (err) {
        const message = err?.response?.data?.message || "Unable to load users.";

        setError(message);
        showToast(message, "error");
      } finally {
        setLoading(false);
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
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-soft" />
          <div className="mt-2 h-4 w-44 animate-pulse rounded bg-surface-soft" />
        </div>

        <div className="rounded-2xl bg-surface p-4">
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-background"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-light text-danger">
          <Users size={20} />
        </div>

        <h2 className="mt-4 text-base font-semibold text-text">
          Unable to load users
        </h2>

        <p className="mt-1 text-sm text-muted">{error}</p>

        <button
          type="button"
          onClick={load}
          className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-text px-4 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:opacity-90 active:scale-95"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary-dark">
          <Users size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">No users yet</h2>

        <p className="mt-1 text-sm text-muted">
          Users will appear here once they register.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-text">
            Users
          </h1>

          <p className="mt-1 text-sm text-muted">
            {users.length} registered user(s).
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 text-xs font-medium text-muted transition-all duration-200 hover:bg-surface-soft hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Refresh users"
          title="Refresh users"
        >
          <RefreshCw
            size={15}
            className={`transition-transform duration-500 ${
              loading ? "animate-spin" : "group-hover:rotate-180"
            }`}
          />
          <span className="hidden sm:inline">
            {loading ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((u) => {
          const name = u.name || u.fullName || "User";

          return (
            <div
              key={u._id}
              className="rounded-2xl bg-surface p-4 shadow-[0_4px_20px_rgba(23,32,27,0.04)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-text">
                    {name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text">
                      {name}
                    </h3>

                    <p className="mt-0.5 truncate text-xs text-muted">
                      {u.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                    u.role === "admin"
                      ? "bg-success-light text-success-dark"
                      : "bg-surface-soft text-text"
                  }`}
                >
                  {u.role}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-background p-3">
                  <div className="flex items-center gap-1.5 text-muted">
                    <Users size={13} />
                    <span className="text-[10px] font-medium">Profile</span>
                  </div>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      u.profileCompleted ? "text-success-dark" : "text-muted"
                    }`}
                  >
                    {u.profileCompleted ? "Completed" : "Incomplete"}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-3">
                  <div className="flex items-center gap-1.5 text-muted">
                    <CalendarDays size={13} />
                    <span className="text-[10px] font-medium">Joined</span>
                  </div>

                  <p className="mt-1 text-xs font-semibold text-text">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl bg-surface shadow-[0_4px_24px_rgba(23,32,27,0.04)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-sm">
            <thead>
              <tr className="border-b border-border bg-background text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Profile Completed</th>
                <th className="px-5 py-4">Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-border/60 last:border-0 hover:bg-background/60"
                >
                  <td className="px-5 py-4 font-medium text-text">
                    {u.name || u.fullName || "—"}
                  </td>

                  <td className="px-5 py-4 text-muted">{u.email}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                        u.role === "admin"
                          ? "bg-success-light text-success-dark"
                          : "bg-surface-soft text-text"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        u.profileCompleted
                          ? "font-medium text-success-dark"
                          : "font-medium text-muted"
                      }
                    >
                      {u.profileCompleted ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-muted">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
