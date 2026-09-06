import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[78svh] flex-col items-center justify-center pt-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-hero leading-[0.9] tracking-[-0.045em]">
        Not here.
      </h1>
      <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-content-muted">
        The page you were after has moved, or never existed. The range is only
        twelve products, so it will not take long to find what you wanted.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="rounded-full bg-content px-7 py-3 text-sm font-medium text-surface"
        >
          Shop everything
        </Link>
        <Link
          href="/"
          className="rounded-full border border-hairline-strong px-7 py-3 text-sm transition-colors hover:border-content/45"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
