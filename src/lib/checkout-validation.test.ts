import { describe, expect, it } from "vitest";
import { validateCheckout } from "@/lib/checkout-validation";

const valid = {
  email: "asha@example.com",
  phone: "+91 98765 43210",
  name: "Asha Rao",
  address: "12 MG Road",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
};

describe("validateCheckout", () => {
  it("accepts a complete, well-formed payload and trims it", () => {
    const result = validateCheckout({ ...valid, name: "  Asha Rao  " });
    expect(result).toEqual({ ok: true, details: valid });
  });

  it("treats the phone number as optional", () => {
    expect(validateCheckout({ ...valid, phone: "" }).ok).toBe(true);
  });

  it("rejects payloads that are not objects instead of throwing", () => {
    for (const input of [null, undefined, "x", 42, []]) {
      expect(validateCheckout(input).ok).toBe(false);
    }
  });

  it("rejects non-string fields instead of throwing", () => {
    expect(validateCheckout({ ...valid, name: 42 }).ok).toBe(false);
    expect(validateCheckout({ ...valid, email: { $ne: "" } }).ok).toBe(false);
  });

  it("rejects whitespace-only required fields", () => {
    expect(validateCheckout({ ...valid, city: "   " })).toMatchObject({
      ok: false,
      error: "Some delivery details are still missing.",
    });
  });

  it("rejects oversized fields that would overflow the order cookie", () => {
    expect(validateCheckout({ ...valid, name: "a".repeat(5000) })).toMatchObject({
      ok: false,
      error: "That name is too long.",
    });
  });

  it("rejects a malformed email, PIN code or phone", () => {
    expect(validateCheckout({ ...valid, email: "asha" }).ok).toBe(false);
    expect(validateCheckout({ ...valid, pincode: "5600" }).ok).toBe(false);
    expect(validateCheckout({ ...valid, phone: "call me" }).ok).toBe(false);
  });
});
