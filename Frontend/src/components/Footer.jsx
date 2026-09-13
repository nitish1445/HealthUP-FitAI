import { ArrowUpRight, HeartPulse, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Logomark from "./common/Logomark";

const exploreLinks = [
  { label: "Home", path: "/" },
  { label: "About us", path: "/about" },
  { label: "Dashboard", path: "/login" },
];

const supportLinks = [
  { label: "Contact us", path: "/contact" },
  { label: "Start Free", path: "/register" },
  { label: "Privacy Policy", path: "/privacy" },
];

const benefits = [
  {
    title: "Personal",
    description: "Built around your goals, body, and lifestyle.",
  },
  {
    title: "Measurable",
    description: "Turn your progress into meaningful insights.",
  },
  {
    title: "Adaptive",
    description: "Keep improving as your journey changes.",
  },
];

const Footer = () => {
  return (
    <footer className="overflow-hidden bg-text text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
        {/* Main Footer */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center text-primary">
                <Logomark />
              </div>

              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold leading-none tracking-[-0.02em] text-white">
                  HealthUP
                </span>

                <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Fitness Intelligence
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
              Your intelligent health and fitness companion, helping you train
              smarter, build better habits, and make meaningful progress every
              day.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Explore
            </p>

            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-primary transition-all duration-200 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
              Support
            </p>

            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-secondary transition-all duration-200 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Why HealthUP */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-success">
              Why HealthUP
            </p>

            <div className="mt-5 space-y-4">
              {benefits.map((benefit) => {
                return (
                  <div
                    key={benefit.title}
                    className="group flex items-start gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {benefit.title}
                      </p>

                      <p className="text-xs leading-5 text-white/45">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-9 h-px bg-white/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-white/35">
            © {new Date().getFullYear()} HealthUP. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/nitish1445/healthup-ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-white/40 transition-colors duration-200 hover:text-white"
            >
              Github
              <ArrowUpRight size={12} />
            </a>

            <span className="text-xs text-white/15">•</span>

            <span className="text-[10px] font-medium uppercase tracking-[0.13em] text-white/35">
              Smart Health · Better You
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
