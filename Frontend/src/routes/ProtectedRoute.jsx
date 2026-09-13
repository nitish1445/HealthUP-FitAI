import { Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthRequired from "../pages/auth/AuthRequired";
import { ArrowRight, ShieldAlert } from "lucide-react";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <AuthRequired />;
  if (user.role !== "user") return <UnauthorizedUser />;
  return <Outlet />;
}

export function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <AuthRequired />;
  if (user.role !== "admin") return <UnauthorizedAdmin />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { loading } = useAuth();
  if (loading) return null;
  return <Outlet />;
}

export function UnauthorizedAdmin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginAgain = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-center text-text">
      <div className="w-full max-w-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-light">
          <ShieldAlert size={30} className="text-danger" />
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-danger">
          Access denied
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-text sm:text-4xl">
          You are not authorized to access this page.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base">
          This area is restricted to administrators. Please log in with an
          administrator account to continue.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleLoginAgain}
            className="cursor-pointer group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark"
          >
            Login Again
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export function UnauthorizedUser() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginAgain = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-center text-text">
      <div className="w-full max-w-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-light">
          <ShieldAlert size={30} className="text-danger" />
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-danger">
          Access denied
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-text sm:text-4xl">
          You are not authorized to access this page.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base">
          This page is not available for your current account. Please log in
          with an authorized account to continue.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleLoginAgain}
            className="cursor-pointer group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark"
          >
            Login Again
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
