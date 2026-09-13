import {
  Activity,
  ArrowRight,
  BarChart3,
  CircleCheckBig,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Target,
  AudioLines,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logomark from "../components/common/Logomark";

export default function About() {
  const workflow = [
    {
      icon: ClipboardList,
      title: "Profile",
      description: "Understand your body, goals, experience, and lifestyle.",
      color: "bg-primary-light text-primary-dark",
    },
    {
      icon: Target,
      title: "Plan",
      description: "Build personalized workouts, nutrition, and routines.",
      color: "bg-secondary-light text-secondary-dark",
    },
    {
      icon: Dumbbell,
      title: "Execute",
      description: "Follow your plan and turn intention into consistency.",
      color: "bg-success-light text-success-dark",
    },
    {
      icon: AudioLines,
      title: "Track",
      description: "Capture workouts, habits, measurements, and progress.",
      color: "bg-primary-light text-primary-dark",
    },
    {
      icon: Activity,
      title: "Analyze",
      description: "Turn your activity and progress into useful insights.",
      color: "bg-secondary-light text-secondary-dark",
    },
    {
      icon: SlidersHorizontal,
      title: "Adjust",
      description: "Refine your plan as your body and goals change.",
      color: "bg-success-light text-success-dark",
    },
    {
      icon: Sparkles,
      title: "Coach",
      description: "Get guidance that helps you make better next decisions.",
      color: "bg-primary-light text-primary-dark",
    },
    {
      icon: RefreshCw,
      title: "Repeat",
      description: "Keep improving through an intelligent feedback loop.",
      color: "bg-secondary-light text-secondary-dark",
    },
  ];

  const benefits = [
    "Personalized instead of generic",
    "Progress-data instead of guesswork",
    "Adaptive instead of static",
    "Connected instead of fragmented",
  ];

  return (
    <main className="bg-background text-text">
      {/* Section 1 — Introduction */}
      <section className="px-6 py-16 sm:px-10 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-dark">
              About HealthUP
            </p>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-tighter sm:text-5xl lg:text-6xl">
              Fitness that{" "}
              <span className="text-primary-dark">evolves with you.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              HealthUP is a fitness intelligence platform designed to make your
              fitness journey personal, measurable, and adaptive. It connects
              your profile, plans, daily execution, progress, insights, and
              coaching into one continuous system.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] bg-surface p-7 shadow-[0_10px_35px_rgba(23,32,27,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(23,32,27,0.08)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light">
                <Sparkles size={20} className="text-primary-dark" />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold">
                Personal
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Your goals, body, experience, routine, and preferences shape the
                experience.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-surface p-7 shadow-[0_10px_35px_rgba(23,32,27,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(23,32,27,0.08)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-light">
                <BarChart3 size={20} className="text-secondary-dark" />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold">
                Measurable
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Your activity and progress become meaningful data that helps
                guide your next step.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-surface p-7 shadow-[0_10px_35px_rgba(23,32,27,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(23,32,27,0.08)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-light">
                <RefreshCw size={20} className="text-success-dark" />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold">
                Adaptive
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Your plan doesn't have to stay the same when your needs and
                progress change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — HealthUP System */}
      <section className="bg-surface px-6 py-16 sm:px-10 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
                The HealthUP system
              </p>

              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                A fitness journey built as a continuous loop.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted sm:text-base lg:pb-1">
              HealthUP doesn't stop after giving you a plan. It follows the
              complete journey, learning from what you do and helping you decide
              what comes next.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group relative rounded-3xl bg-background p-5 shadow-[0_8px_30px_rgba(23,32,27,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(23,32,27,0.08)]"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.color}`}
                    >
                      <Icon size={19} />
                    </div>

                    <span className="text-xs font-semibold tracking-[0.08em] text-muted">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-lg font-semibold text-text">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — Why HealthUP */}
      <section className="px-6 py-16 sm:px-10 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-dark">
                Why HealthUP
              </p>

              <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                Don't just follow a plan.{" "}
                <span className="text-primary-dark">
                  Understand your progress.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Most fitness journeys become difficult when the plan stays
                static while the person changes. HealthUP is designed around the
                opposite idea: your fitness system should learn from your
                journey and continuously help you move forward.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3.5 shadow-[0_5px_20px_rgba(23,32,27,0.035)]"
                  >
                    <CircleCheckBig
                      size={18}
                      className="shrink-0 text-success-dark"
                    />

                    <span className="text-sm font-medium text-text">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-4xl bg-text p-8 text-white sm:p-10">
              <Logomark />

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                The HealthUP philosophy
              </p>

              <h3 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.035em]">
                Your journey.
                <br />
                Your data.
                <br />
                Your next move.
              </h3>

              <p className="mt-5 text-sm leading-6 text-white/55">
                HealthUP brings everything together so every decision is
                connected to where you are now and where you want to go.
              </p>

              <Link
                to="/register"
                className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark"
              >
                Start with HealthUP
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
