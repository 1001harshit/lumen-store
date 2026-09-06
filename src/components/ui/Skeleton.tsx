import { cn } from "@/lib/utils";

/**
 * Loading placeholder.
 *
 * Shapes mirror the real content's dimensions so the page does not reflow when
 * data lands — a skeleton that is the wrong size is worse than no skeleton,
 * because it promises a layout it then breaks.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-content/8", className)}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-4/5 rounded-[var(--radius-card)]" />
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-14" />
      </div>
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
