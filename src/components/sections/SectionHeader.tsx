import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export function SectionHeader({
  eyebrow,
  title,
  blurb,
  href,
  linkLabel = "View all",
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <TextReveal
          text={title}
          className="mt-3 font-display text-display leading-[0.98] tracking-[-0.04em]"
        />
        {blurb && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-content-muted">
              {blurb}
            </p>
          </Reveal>
        )}
      </div>

      {href && (
        <Reveal delay={0.16}>
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium"
          >
            {linkLabel}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
