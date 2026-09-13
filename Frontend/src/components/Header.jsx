import { useEffect, useState } from "react";
import { ArrowRight, Menu, X, Circle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logomark from "./common/Logomark";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Header */}
      <div
        className={`border-b bg-white transition-all duration-200 ${scrolled ? "border-border shadow-[0_6px_24px_rgba(23,32,27,0.07)]" : "border-border/70"}`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5"
          >
            <Logomark />

            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold leading-none tracking-[-0.02em] text-text">
                HealthUP
              </span>

              <span className=" text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] text-primary-dark">
                Fitness Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link
                to="/dashboard/profile"
                className="group flex items-center gap-3 rounded-full bg-surface px-2 py-1.5 pr-4 transition-all duration-200 hover:shadow-[0_7px_24px_rgba(23,32,27,0.09)]"
              >
                <div className="h-9 w-9 overflow-hidden rounded-full bg-primary">
                  {user?.image ? (
                    <img
                      src={user?.image?.url}
                      alt={user?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-text">
                      {user?.name.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="max-w-32 truncate text-[14px] font-semibold leading-4 text-text">
                    {user?.name || "Guest User"}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium capitalize text-muted">
                    {user?.role || "user"}
                  </p>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-transparent px-4 py-2.5 text-[14.5px] font-medium text-text transition-colors duration-200 hover:bg-surface-soft hover:text-primary-dark"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4.5 py-2.5 text-[14.5px] font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark hover:shadow-[0_5px_14px_rgba(255,157,80,0.28)]"
                >
                  Start free
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-text transition-colors duration-200 hover:bg-surface-soft md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-60 bg-text/35 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <aside
        aria-label="Mobile menu"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-70 flex h-dvh w-[min(80vw,360px)] flex-col bg-white shadow-[-12px_0_40px_rgba(23,32,27,0.14)] transition-transform duration-300 ease-out md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5"
          >
            <Logomark />

            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold leading-none tracking-[-0.02em] text-text">
                HealthUP
              </span>

              <span className=" text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] text-primary-dark">
                Fitness Intelligence
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-text transition-colors duration-200 hover:bg-surface-soft"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Explore
            </p>

            <nav className="space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`group flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === "/"
                    ? "bg-surface-soft text-primary-dark"
                    : "text-text hover:bg-surface-soft hover:text-primary-dark"
                }`}
              >
                <span>Home</span>

                <span
                  className={`h-1.5 w-1.5 rounded-full bg-primary transition-opacity duration-200 ${
                    location.pathname === "/" ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>

              <Link
                to="/about"
                onClick={closeMenu}
                className={`group flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === "/about"
                    ? "bg-surface-soft text-primary-dark"
                    : "text-text hover:bg-surface-soft hover:text-primary-dark"
                }`}
              >
                <span>About</span>

                <span
                  className={`h-1.5 w-1.5 rounded-full bg-primary transition-opacity duration-200 ${
                    location.pathname === "/about" ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>

              <Link
                to="/contact"
                onClick={closeMenu}
                className={`group flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === "/contact"
                    ? "bg-surface-soft text-primary-dark"
                    : "text-text hover:bg-surface-soft hover:text-primary-dark"
                }`}
              >
                <span>Contact</span>

                <span
                  className={`h-1.5 w-1.5 rounded-full bg-primary transition-opacity duration-200 ${
                    location.pathname === "/contact"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
              </Link>
            </nav>
          </div>

          <div className="my-8 h-px bg-border" />

          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              {user ? "Your account" : "Get started"}
            </p>

            {user ? (
              <Link
                to="/dashboard/profile"
                onClick={closeMenu}
                className="group flex items-center justify-between rounded-2xl bg-surface-soft p-3 transition-all duration-200 hover:bg-primary-light"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {user?.name || "Guest User"}
                  </p>

                  <p className="mt-1 text-xs font-medium capitalize text-muted">
                    {user.role || "User"}
                  </p>
                </div>

                <div className="ml-4 h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary">
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
                </div>
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border-strong bg-white text-sm font-semibold text-text transition-all duration-200 hover:border-primary/40 hover:bg-surface-soft"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_8px_20px_rgba(255,157,80,0.2)]"
                >
                  Start free
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            )}
          </div>

          <div className="mt-auto pt-12">
            <p className="mt-5 text-center text-[10px] text-muted">
              © 2026 HealthUP. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </header>
  );
}
