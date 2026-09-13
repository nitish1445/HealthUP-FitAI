import {
  ArrowRight,
  Check,
  CircleCheckBig,
  HeartPulse,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: HeartPulse,
    title: "Personalized Fitness",
    description:
      "Get workouts and fitness guidance built around your goals, experience, schedule, and preferences.",
    tone: "primary",
  },
  {
    icon: Sparkles,
    title: "Adaptive Intelligence",
    description:
      "HealthUP continuously adapts your recommendations as your habits, recovery, performance, and goals change.",
    tone: "secondary",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Track workouts, measurements, habits, recovery, and progress in one connected fitness experience.",
    tone: "success",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-background text-text">
      {/* Hero */}
      <section className="relative">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-22">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary-light px-3.5 py-2">
              <Sparkles size={14} className="text-secondary-dark" />
              <span className="text-xs font-semibold text-secondary-dark">
                Adaptive Fitness Intelligence
              </span>
            </div>

            <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-text sm:text-5xl md:mt-7 md:text-6xl">
              A smarter way to{" "}
              <span className="text-primary-dark">
                understand your fitness.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg md:mt-6">
              HealthUP brings your workouts, habits, recovery, nutrition, and
              progress together to create a fitness experience that adapts to
              you.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark hover:shadow-[0_8px_20px_rgba(255,157,80,0.28)] sm:w-auto"
              >
                Start free
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to={"/about"}
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border-strong bg-surface px-6 text-sm font-semibold text-text transition-colors duration-200 hover:bg-surface-soft sm:w-auto"
              >
                Learn more
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-7">
              <div className="flex items-center gap-2 text-xs font-medium text-muted">
                <CircleCheckBig size={17} className="text-success-dark" />
                Personalized plans
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-muted">
                <CircleCheckBig size={17} className="text-secondary-dark" />
                Adaptive guidance
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-muted">
                <CircleCheckBig size={17} className="text-primary-dark" />
                Progress tracking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Details */}
      <section id="features" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">
              Why HealthUP
            </span>

            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-text md:text-4xl">
              Your fitness. Your data. Your journey.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted">
              Everything you need to build a healthier and more consistent
              routine without making fitness complicated.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              const iconStyles = {
                primary: "bg-primary-light text-primary-dark",
                secondary: "bg-secondary-light text-secondary-dark",
                success: "bg-success-light text-success-dark",
              };

              const checkStyles = {
                primary: "text-primary-dark",
                secondary: "text-secondary-dark",
                success: "text-success-dark",
              };

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-border bg-background p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(23,32,27,0.07)]"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyles[feature.tone]}`}
                  >
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.02em] text-text">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 border-t border-border pt-5">
                    <CircleCheckBig
                      size={17}
                      className={checkStyles[feature.tone]}
                    />

                    <span className="text-xs font-semibold text-text-secondary">
                      Built for your journey
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-surface-soft">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-dark">
              How it works
            </span>

            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-text md:text-4xl">
              Start simple. Grow smarter.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted">
              HealthUP turns your goals and daily information into a simple,
              personalized fitness journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-surface p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-text">
                01
              </div>

              <h3 className="mt-6 font-display text-lg font-semibold text-text">
                Tell us about you
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Share your goals, experience, lifestyle, preferences, and
                starting point.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-display text-sm font-semibold text-text">
                02
              </div>

              <h3 className="mt-6 font-display text-lg font-semibold text-text">
                Get your plan
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Receive personalized workout, diet, habit, recovery, and fitness
                recommendations.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success font-display text-sm font-semibold text-text">
                03
              </div>

              <h3 className="mt-6 font-display text-lg font-semibold text-text">
                Track your progress
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Keep logging your journey and use your insights to understand
                what is working and what to improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-18">
        <div className="relative overflow-hidden rounded-[28px] bg-text px-6 py-12 text-center md:rounded-4xl md:px-12 md:py-14">
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
              <HeartPulse size={21} className="text-text" />
            </div>

            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-4xl">
              Have questions? We're here to help.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
              Whether you need help getting started or have feedback for
              HealthUP, our team would love to hear from you.
            </p>

            <div className="mt-7">
              <Link
                to="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark hover:shadow-[0_8px_10px_rgba(255,157,80,0.25)] md:px-8 md:text-[15px]"
              >
                Contact us
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 md:h-4 md:w-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
