"use client";

import { motion } from "motion/react";
import { Check, Truck } from "lucide-react";
import { formatMoney } from "@/lib/utils";

/**
 * Progress toward the free-shipping threshold.
 *
 * The bar animates from its previous width because the number moving is the
 * feedback — a bar that simply appears at the new width tells you the state
 * but not that your last action changed it.
 */
export function ShippingMeter({
  remaining,
  percent,
  qualified,
}: {
  remaining: number;
  percent: number;
  qualified: boolean;
}) {
  return (
    <div className="rounded-2xl bg-surface-sunken px-4 py-3.5">
      <div className="flex items-center gap-2 text-[0.8125rem]">
        {qualified ? (
          <>
            <Check size={15} className="shrink-0 text-accent" />
            <span className="font-medium">Free delivery unlocked</span>
          </>
        ) : (
          <>
            <Truck size={15} className="shrink-0 text-content-muted" />
            <span className="text-content-muted">
              <span className="font-medium text-content">
                {formatMoney(remaining)}
              </span>{" "}
              away from free delivery
            </span>
          </>
        )}
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-content/10">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
