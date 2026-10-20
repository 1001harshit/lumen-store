/**
 * Checkout input validation.
 *
 * A server action is a public POST endpoint, so `placeOrder` can be called
 * with anything at all — not just what the form would send. This treats the
 * payload as unknown and only hands back details that are strings of a sane
 * length, trimmed. The lengths matter beyond tidiness: the order is written to
 * a cookie, and an oversized name would push it past the ~4 KB cookie limit.
 */

export type CheckoutDetails = {
  email: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type CheckoutValidation =
  | { ok: true; details: CheckoutDetails }
  | { ok: false; error: string };

const MAX_LENGTH: Record<keyof CheckoutDetails, number> = {
  email: 254,
  phone: 16,
  name: 80,
  address: 200,
  city: 60,
  state: 60,
  pincode: 6,
};

const REQUIRED: (keyof CheckoutDetails)[] = [
  "email",
  "name",
  "address",
  "city",
  "state",
  "pincode",
];

export function validateCheckout(input: unknown): CheckoutValidation {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<
    string,
    unknown
  >;

  const details = {} as CheckoutDetails;
  for (const field of Object.keys(MAX_LENGTH) as (keyof CheckoutDetails)[]) {
    const value = raw[field];
    details[field] = typeof value === "string" ? value.trim() : "";
  }

  if (REQUIRED.some((field) => !details[field])) {
    return { ok: false, error: "Some delivery details are still missing." };
  }

  for (const field of Object.keys(MAX_LENGTH) as (keyof CheckoutDetails)[]) {
    if (details[field].length > MAX_LENGTH[field]) {
      return { ok: false, error: `That ${field} is too long.` };
    }
  }

  if (!/^\S+@\S+\.\S+$/.test(details.email)) {
    return { ok: false, error: "That email address does not look right." };
  }

  if (!/^\d{6}$/.test(details.pincode)) {
    return { ok: false, error: "Enter a six-digit PIN code." };
  }

  // Optional, but if given it should at least be a phone number.
  if (details.phone && !/^\+?[\d\s-]{7,16}$/.test(details.phone)) {
    return { ok: false, error: "That phone number does not look right." };
  }

  return { ok: true, details };
}
