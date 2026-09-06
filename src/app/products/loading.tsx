import { Skeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="shell pt-32">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-14 w-full max-w-xl" />
      <Skeleton className="mt-4 h-4 w-full max-w-lg" />
      <Skeleton className="mt-12 h-[4.5rem] w-full rounded-none" />
      <div className="mt-14">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
