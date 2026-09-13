import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Apple,
  ChartNoAxesColumnIncreasing,
  ChartNoAxesCombined,
  Flame,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Route,
  Settings,
  User,
  Maximize2,
  X,
  Goal,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logomark from "../components/common/Logomark";
const WORKSPACE_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/diet", label: "Diet", icon: Apple },
  { to: "/dashboard/workout", label: "Workout", icon: Goal },
  { to: "/dashboard/progress", label: "Progress", icon: ChartNoAxesCombined },
  { to: "/dashboard/habits", label: "Habits", icon: Flame },
  { to: "/dashboard/recovery", label: "Recovery", icon: HeartPulse },
  {
    to: "/dashboard/analytics",
    label: "Analytics",
    icon: ChartNoAxesColumnIncreasing,
  },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: Route },
  { to: "/dashboard/measurements", label: "Measurements", icon: Maximize2 },
  { to: "/dashboard/coach", label: "AI Coach", icon: MessageCircle },
];
const ACCOUNT_ITEMS = [
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const NavItem = ({ item, onNavigate }) => {
  const { to, label, icon: Icon, end } = item;

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary/10 text-primary-dark"
            : "text-muted hover:bg-surface-soft hover:text-text"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={isActive ? 2.2 : 1.9}
            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
          />

          <span className="flex-1">{label}</span>

          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </>
      )}
    </NavLink>
  );
};

const Navigation = ({ onNavigate }) => {
  return (
    <nav className="flex flex-col">
      <div>
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted/70">
          Workspace
        </p>

        <div className="flex flex-col gap-1">
          {WORKSPACE_ITEMS.map((item) => (
            <NavItem key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted/70">
          Account
        </p>

        <div className="flex flex-col gap-1">
          {ACCOUNT_ITEMS.map((item) => (
            <NavItem key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </nav>
  );
};

const Brand = () => {
  return (
    <NavLink to="/dashboard" className="flex items-center gap-2.5 px-1">
      <Logomark />

      <div className="flex flex-col">
        <span className="font-display text-lg font-semibold leading-none tracking-[-0.02em] text-text">
          HealthUP
        </span>

        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.13em] text-primary-dark">
          Fitness Intelligence
        </span>
      </div>
    </NavLink>
  );
};

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-surface px-4 py-5 lg:flex">
        <Brand />

        <div className="mt-8 flex-1 overflow-y-auto pr-1">
          <Navigation />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />

          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-surface px-4 py-5 shadow-2xl">
            <div className="flex items-center justify-between px-1">
              <Brand />

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-soft hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto pr-1">
              <Navigation onNavigate={() => setDrawerOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-border/60 bg-background px-4 lg:px-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-soft hover:text-text lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-medium text-text">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p className="mt-0.5 text-[11px] text-muted">
              Your health journey, one day at a time.
            </p>
          </div>

          {/* Profile */}
          <NavLink
            to="/dashboard/profile"
            className="group flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors duration-200 hover:bg-surface"
          >
            <div className="hidden text-right sm:block">
              <p className="max-w-32 truncate text-sm font-semibold leading-4 text-text">
                {user?.name || "Guest User"}
              </p>

              <p className="mt-0.5 text-[10px] font-medium capitalize text-muted">
                {user?.role || "user"}
              </p>
            </div>

            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
              {user?.image ? (
                <img
                  src={user?.image?.src}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-text">
                  {user?.name.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div className="absolute inset-0 rounded-full bg-text/0 transition-colors duration-200 group-hover:bg-text/5" />
            </div>

            <ChevronRight
              size={15}
              className="hidden text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text sm:block"
            />
          </NavLink>
        </header>

        {/* Page */}
        <main className="mx-auto flex w-full max-w-6xl flex-1 p-4 lg:p-8">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
