import {
  Database,
  LockKeyhole,
  ShieldCheck,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-2 text-xs font-semibold text-primary-dark">
              <LockKeyhole size={14} />
              Privacy & Security
            </div>

            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-text sm:text-5xl lg:text-6xl">
              Your health is personal.{" "}
              <span className="text-primary-dark">We treat it that way.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              HealthUP is built around your goals, your progress, and your
              journey. We believe the information that powers that journey
              should be handled with care and transparency.
            </p>

            <p className="mt-5 text-xs font-medium text-muted">
              Last updated at{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              .
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3">
            <PrivacyCard
              icon={ShieldCheck}
              title="Built with care"
              description="We take reasonable steps to protect the information you trust us with."
              iconClass="bg-primary-light text-primary-dark"
            />

            <PrivacyCard
              icon={Database}
              title="Used with purpose"
              description="Your information helps us personalize, operate, and improve your HealthUP experience."
              iconClass="bg-secondary-light text-secondary-dark"
            />

            <PrivacyCard
              icon={LockKeyhole}
              title="Never taken for granted"
              description="We don't treat your personal information as something to be casually shared or sold."
              iconClass="bg-success-light text-success-dark"
            />
          </div>
        </div>
      </section>

      {/* Main Privacy Content */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          {/* Side */}
          <div className="rounded-4xl bg-text p-7 text-white sm:p-9 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Our approach
            </p>

            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              Clear by design.
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/55">
              Privacy shouldn't be hidden behind complicated language. Here's a
              simple overview of what information HealthUP uses and why.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-text" />
                </div>

                <p className="text-sm leading-6 text-white/65">
                  Your account information helps us manage your HealthUP
                  account.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-text" />
                </div>

                <p className="text-sm leading-6 text-white/65">
                  Your fitness information helps personalize your plans and
                  track progress.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-text" />
                </div>

                <p className="text-sm leading-6 text-white/65">
                  We use appropriate safeguards to help protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-4xl bg-surface p-7 shadow-[0_16px_50px_rgba(23,32,27,0.06)] sm:p-9 lg:p-10">
            <div className="space-y-10">
              <PrivacyDetail number="01" title="Information we collect">
                <p>
                  When you create an account or use HealthUP, we may collect
                  information such as your name, email address, account details,
                  fitness goals, profile information, and information you choose
                  to provide about your fitness journey.
                </p>
              </PrivacyDetail>

              <PrivacyDetail number="02" icon={Database} title="How we use it">
                <p>
                  We use this information to provide your HealthUP experience,
                  personalize plans, track progress, operate features, improve
                  the product, and provide support.
                </p>
              </PrivacyDetail>

              <PrivacyDetail number="03" title="How we protect it">
                <p>
                  We use reasonable technical and organizational measures
                  designed to protect your information from unauthorized access,
                  alteration, disclosure, or misuse.
                </p>
              </PrivacyDetail>

              <PrivacyDetail number="04" title="Your choices">
                <p>
                  You can review and update certain account information. Where
                  applicable, you may also request access to or deletion of your
                  personal information, subject to legal and operational
                  requirements.
                </p>
              </PrivacyDetail>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-surface-soft p-7 sm:p-9 lg:flex-row lg:items-center lg:p-10">
            <div>
              <div className="flex items-center gap-2 text-primary-dark">
                <Mail size={18} />
                <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                  Questions?
                </span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
                Want to know more about your privacy?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                We're happy to answer questions about how HealthUP handles your
                information.
              </p>
            </div>

            <Link
              to="/contact"
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-text px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark hover:text-text"
            >
              Contact us
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

const PrivacyCard = ({ icon: Icon, title, description, iconClass }) => {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-[0_8px_30px_rgba(23,32,27,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(23,32,27,0.08)]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={20} />
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold text-text">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
};

const PrivacyDetail = ({ number, title, children }) => {
  return (
    <div className="relative border-l-2 lg:border-l-3 border-primary/50 pl-6">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-semibold tracking-[0.12em] text-secondary">
          {number}
        </span>

        <h3 className="font-display text-base font-semibold tracking-[-0.02em] text-text">
          {title}
        </h3>
      </div>

      <div className="mt-2 text-[13px] lg:text-sm leading-5 text-muted">
        {children}
      </div>
    </div>
  );
};

export default Privacy;
