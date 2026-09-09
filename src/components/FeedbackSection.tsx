import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackKind = "issue" | "suggestion";

/**
 * Public feedback form: visitors can report issues or leave suggestions with
 * no account required. Minimal hairline inputs, quiet pill selector.
 */
export function FeedbackSection() {
  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const feedbackCount = useQuery(api.feedback.getFeedbackCount, {});

  const [kind, setKind] = useState<FeedbackKind>("suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await submitFeedback({
        kind,
        message,
        email: email.trim() ? email.trim() : undefined,
      });
      setSubmitted(true);
      setMessage("");
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="feedback"
      className="border-y border-border/80"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: framing */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Tell us what to fix or add
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Comic Home improves one suggestion at a time. If a
              recommendation misses the mark, something looks broken, or
              there's a feature you wish existed — leave a note below. No
              account needed.
            </p>
            {typeof feedbackCount === "number" && feedbackCount > 0 && (
              <p className="mt-6 text-xs text-muted-foreground/70">
                {feedbackCount}
                {feedbackCount === 1 ? " note" : " notes"} received so far.
              </p>
            )}
          </div>

          {/* Right: form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-start gap-3 py-6">
                <CheckCircle2 className="size-5 text-foreground" strokeWidth={1.5} />
                <p className="text-sm font-medium">Thanks — your note is in.</p>
                <p className="text-sm text-muted-foreground">
                  We read every submission. If you left an email, we'll reply
                  when there's something to share.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-sm underline underline-offset-4 hover:opacity-70"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Kind selector */}
                <div className="flex gap-2">
                  {(
                    [
                      { value: "suggestion", label: "Suggestion" },
                      { value: "issue", label: "Report an issue" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setKind(opt.value)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                        kind === opt.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="feedback-message"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    {kind === "issue"
                      ? "What went wrong?"
                      : "What should we add or change?"}
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={3}
                    maxLength={2000}
                    rows={4}
                    placeholder={
                      kind === "issue"
                        ? "Describe the problem — where it happened and what you expected."
                        : "Describe the feature or improvement you have in mind."
                    }
                    className="mt-2 w-full resize-none rounded-md border border-border bg-transparent px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none"
                  />
                </div>

                {/* Optional email */}
                <div>
                  <label
                    htmlFor="feedback-email"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Email <span className="normal-case">(optional)</span>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com — only if you'd like a reply"
                    className="mt-2 w-full rounded-md border border-border bg-transparent px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || message.trim().length < 3}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                >
                  {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                  Send note
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
