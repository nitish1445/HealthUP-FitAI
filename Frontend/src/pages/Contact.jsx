import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CircleCheckBig,
  Clock3,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const Contact = () => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!form.message.trim()) {
      setError("Please tell us how we can help.");
      return;
    }

    setLoading(true);

    try {
      //will connect backend here
      await new Promise((resolve) => setTimeout(resolve, 900));

      showToast("Your message has been sent successfully.");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Unable to send your message. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="px-5 py-16 text-center sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-2 text-xs font-semibold text-primary-dark">
            <MessageCircle size={14} />
            Contact HealthUP
          </div>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-text sm:text-5xl lg:text-6xl">
            Let's make your fitness journey{" "}
            <span className="text-primary-dark">better.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Have a question, feedback, or need help getting started? Reach out
            to the HealthUP team. We're here to help you move forward with
            confidence.
          </p>
        </div>
      </section>

      {/* Contact Experience */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-4xl bg-surface shadow-[0_20px_60px_rgba(23,32,27,0.08)] lg:grid-cols-[0.85fr_1.15fr]">
          {/* Contact Information */}
          <div className="bg-text p-7 text-white sm:p-10 lg:p-12">
            <div className="flex h-full flex-col">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Get in touch
                </p>

                <h2 className="mt-4 max-w-sm font-display text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                  We're listening.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                  Whether you're exploring HealthUP or already part of the
                  journey, you can reach us whenever you need.
                </p>
              </div>

              <div className="mt-10 space-y-3">
                <a
                  href="mailto:nitishroy.dz@gmail.com"
                  className="group flex items-center gap-4 rounded-2xl bg-white/6 p-4 transition-all duration-200 hover:bg-white/10"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-text">
                    <Mail size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/45">
                      Email us
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      nitishroy.dz@gmail.com
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto text-white/35 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>

                <div className="flex items-center gap-4 rounded-2xl bg-white/6 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-text">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/45">
                      Response time
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto hidden pt-12 lg:block">
                <div className="flex items-center gap-3 text-sm text-white/55">
                  <CircleCheckBig size={14} className="text-success" />
                  Your message goes directly to our team.
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-7 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">
                Send a message
              </p>

              <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
                How can we help?
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Your name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-xl border border-border-strong/60 bg-white px-4 text-sm text-text shadow-[0_2px_12px_rgba(23,32,27,0.05)] outline-none transition-all duration-200 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-border-strong/60 bg-white px-4 text-sm text-text shadow-[0_2px_12px_rgba(23,32,27,0.05)] outline-none transition-all duration-200 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What would you like to talk about?"
                  className="h-12 w-full rounded-xl border border-border-strong/60 bg-white px-4 text-sm text-text shadow-[0_2px_12px_rgba(23,32,27,0.05)] outline-none transition-all duration-200 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us a little more..."
                  className="w-full resize-none rounded-xl border border-border-strong/60 bg-white px-4 py-3.5 text-sm leading-6 text-text shadow-[0_2px_12px_rgba(23,32,27,0.05)] outline-none transition-all duration-200 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_8px_24px_rgba(255,157,80,0.2)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Sending..." : "Send message"}

                {!loading && (
                  <Send
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
