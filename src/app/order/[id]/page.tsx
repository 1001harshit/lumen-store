import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readOrder } from "@/lib/orders";
import { OrderCelebration } from "@/components/checkout/OrderCelebration";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await readOrder(id);

  // No matching order for this browser — a guessed or expired id gets a 404
  // rather than a page that leaks whether that order number exists.
  if (!order) notFound();

  const placed = new Date(order.placedAt);

  return (
    <div className="shell pt-36">
      <OrderCelebration />

      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Order {order.id}</p>
        <h1 className="mt-4 font-display text-display leading-[0.98] tracking-[-0.04em]">
          Thank you, {order.name.split(" ")[0]}.
        </h1>
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-content-muted">
          A confirmation is on its way to{" "}
          <span className="text-content">{order.email}</span>. This is a demo
          storefront, so nothing has been charged and nothing will ship.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-xl rounded-[var(--radius-card)] border border-hairline bg-surface-raised p-6">
        <div className="flex items-center justify-between text-xs text-content-muted">
          <span>
            Placed{" "}
            {placed.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>
            {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
          </span>
        </div>

        <ul className="mt-5 flex flex-col divide-y divide-[var(--hairline)]">
          {order.lines.map((line) => (
            <li
              key={`${line.name}-${line.option}`}
              className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem]">{line.name}</p>
                <p className="mt-0.5 text-xs text-content-muted">
                  {line.option} · Qty {line.quantity}
                </p>
              </div>
              <span className="shrink-0 text-[0.9375rem] tabular-nums">
                {formatMoney(line.total)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 flex flex-col gap-2 border-t border-hairline pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-content-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatMoney(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-content-muted">Delivery</dt>
            <dd className="tabular-nums">
              {order.shipping === 0 ? "Free" : formatMoney(order.shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-hairline pt-3 text-base font-medium">
            <dt>Paid</dt>
            <dd className="tabular-nums">{formatMoney(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/products"
          className="rounded-full border border-hairline-strong px-7 py-3 text-sm transition-colors hover:border-content/45"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
