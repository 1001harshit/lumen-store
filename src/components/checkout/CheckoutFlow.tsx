"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { useState, useTransition } from "react";
import { placeOrder, type CheckoutDetails } from "@/app/actions/checkout";
import { formatMoney, cn } from "@/lib/utils";

const STEPS = [
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Delivery" },
  { id: "payment", label: "Payment" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const EMPTY: CheckoutDetails = {
  email: "",
  phone: "",
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

/**
 * Three-step checkout, with the current step in the URL.
 *
 * Putting the step in `?step=` is what makes browser Back walk the funnel
 * instead of leaving the site — the single most common way a hand-rolled
 * multi-step form loses an order. Navigation is shallow, so stepping forward
 * and back never refetches the page or discards what has been typed.
 *
 * Field values live in one piece of parent state rather than in the DOM, so
 * unmounting a step does not lose its input and the final submit can send
 * everything at once.
 */
export function CheckoutFlow({ total }: { total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [details, setDetails] = useState<CheckoutDetails>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const requested = searchParams.get("step") as StepId | null;
  const step: StepId =
    requested && STEPS.some((s) => s.id === requested) ? requested : "contact";
  const index = STEPS.findIndex((s) => s.id === step);

  const goTo = (next: StepId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", next);
    router.push(`/checkout?${params}`, { scroll: false });
  };

  const set = (key: keyof CheckoutDetails) => (value: string) =>
    setDetails((prev) => ({ ...prev, [key]: value }));

  const canAdvance =
    step === "contact"
      ? /^\S+@\S+\.\S+$/.test(details.email)
      : step === "shipping"
        ? Boolean(
            details.name &&
              details.address &&
              details.city &&
              details.state &&
              /^\d{6}$/.test(details.pincode),
          )
        : true;

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await placeOrder(details);
      // A successful placeOrder redirects and never returns.
      if (result && !result.ok) setError(result.error);
    });
  };

  return (
    <div>
      <ol className="flex items-center gap-2" aria-label="Checkout progress">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              // Only completed steps are navigable — jumping ahead to payment
              // with an empty address just produces a validation dead end.
              disabled={i > index}
              onClick={() => goTo(s.id)}
              className={cn(
                "text-[0.8125rem] transition-colors",
                i === index
                  ? "font-medium text-content"
                  : i < index
                    ? "text-content-muted hover:text-content"
                    : "text-content-subtle",
              )}
            >
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <span className="h-px flex-1 overflow-hidden bg-content/12">
                <motion.span
                  className="block h-full bg-accent"
                  initial={false}
                  animate={{ scaleX: i < index ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="relative mt-8 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === "contact" && (
              <Fieldset title="Where should we send the receipt?">
                <Field
                  label="Email"
                  type="email"
                  value={details.email}
                  onChange={set("email")}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                <Field
                  label="Phone (optional)"
                  type="tel"
                  value={details.phone}
                  onChange={set("phone")}
                  autoComplete="tel"
                  placeholder="For delivery updates"
                />
              </Fieldset>
            )}

            {step === "shipping" && (
              <Fieldset title="Delivery address">
                <Field
                  label="Full name"
                  value={details.name}
                  onChange={set("name")}
                  autoComplete="name"
                />
                <Field
                  label="Address"
                  value={details.address}
                  onChange={set("address")}
                  autoComplete="street-address"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="City"
                    value={details.city}
                    onChange={set("city")}
                    autoComplete="address-level2"
                  />
                  <Field
                    label="State"
                    value={details.state}
                    onChange={set("state")}
                    autoComplete="address-level1"
                  />
                </div>
                <Field
                  label="PIN code"
                  value={details.pincode}
                  onChange={(v) => set("pincode")(v.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="560001"
                />
              </Fieldset>
            )}

            {step === "payment" && (
              <Fieldset title="Payment">
                <div className="rounded-2xl border border-dashed border-hairline-strong bg-surface-sunken p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Lock size={14} />
                    Demo checkout
                  </div>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-content-muted">
                    No payment gateway is connected and no card details are
                    collected. Placing the order writes a confirmation you can
                    view, and nothing is charged or shipped.
                  </p>
                </div>

                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-content-muted">Sending to</dt>
                    <dd className="truncate pl-4">{details.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-content-muted">Delivering to</dt>
                    <dd className="truncate pl-4">
                      {details.city}, {details.state} {details.pincode}
                    </dd>
                  </div>
                </dl>
              </Fieldset>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-blush-400">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center gap-3">
        {index > 0 && (
          <button
            type="button"
            onClick={() => goTo(STEPS[index - 1].id)}
            className="flex h-12 items-center gap-1.5 rounded-full border border-hairline-strong px-5 text-sm transition-colors hover:border-content/45"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        )}

        <button
          type="button"
          disabled={!canAdvance || pending}
          onClick={() =>
            step === "payment" ? submit() : goTo(STEPS[index + 1].id)
          }
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-content text-sm font-medium text-surface transition-transform active:scale-[0.99] disabled:opacity-40"
        >
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Placing order
            </>
          ) : step === "payment" ? (
            `Place order · ${formatMoney(total)}`
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-2 font-display text-xl tracking-[-0.02em]">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.ComponentPropsWithoutRef<"input">, "onChange" | "value">) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.8125rem] text-content-muted">{label}</span>
      <input
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-xl border border-hairline-strong bg-transparent px-4 text-[0.9375rem] outline-none transition-colors placeholder:text-content-subtle focus:border-content/50"
      />
    </label>
  );
}
