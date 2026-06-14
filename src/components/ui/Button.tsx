import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-content text-surface hover:bg-content/90 active:bg-content/80 shadow-[var(--shadow-lift)]",
  secondary:
    "bg-surface-raised text-content border border-hairline-strong hover:border-content/40 hover:bg-surface-sunken",
  ghost: "text-content hover:bg-content/5 active:bg-content/10",
  inverse:
    "bg-surface text-content hover:bg-surface/90 shadow-[var(--shadow-lift)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-[0.9375rem]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-medium tracking-tight " +
  "transition-[background-color,border-color,color,transform,opacity] duration-[var(--duration-fast)] " +
  "ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 " +
  "whitespace-nowrap select-none";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: BaseProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: BaseProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}
