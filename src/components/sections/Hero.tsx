"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { TextReveal } from "@/components/motion/TextReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ProductRender } from "@/components/product/ProductRender";
import { ButtonLink } from "@/components/ui/Button";
import type { Product } from "@/lib/types";

/**
 * Opening viewport.
 *
 * Three depth planes move at different rates against scroll — the colour wash
 * furthest back, the floating vessels in the middle, the headline in front and
 * barely moving. That ordering is the whole illusion: foreground text drifting
 * as fast as the background would flatten it back into a single sheet.
 */
export function Hero({ products }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const washY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const vesselY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  const still = { y: undefined, opacity: undefined };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      {/* Plane 1 — colour wash */}
      <motion.div
        aria-hidden
        style={reduced ? still : { y: washY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -left-[18%] top-[-14%] h-[42rem] w-[42rem] rounded-full blur-[110px]"
          style={{ background: "oklch(0.86 0.07 168 / 0.3)" }}
        />
        <div
          className="absolute -right-[14%] top-[8%] h-[38rem] w-[38rem] rounded-full blur-[120px]"
          style={{ background: "oklch(0.88 0.06 42 / 0.28)" }}
        />
        <div
          className="absolute bottom-[-20%] left-[28%] h-[34rem] w-[34rem] rounded-full blur-[120px]"
          style={{ background: "oklch(0.87 0.05 300 / 0.24)" }}
        />
      </motion.div>

      {/* Plane 2 — floating vessels */}
      <motion.div
        aria-hidden
        style={reduced ? still : { y: vesselY }}
        className="pointer-events-none absolute inset-0 -z-[5]"
      >
        {products.slice(0, 4).map((product, i) => {
          const spots = [
            "left-[-2%] top-[10%] h-56 w-44 md:h-[26rem] md:w-80",
            "right-[-1%] top-[20%] h-52 w-40 md:h-96 md:w-72",
            "left-[11%] bottom-[2%] h-44 w-36 md:h-80 md:w-64",
            "right-[13%] bottom-[-2%] hidden h-40 w-32 md:block md:h-72 md:w-56",
          ];
          return (
            <motion.div
              key={product.id}
              className={`absolute ${spots[i]} overflow-hidden rounded-[2rem] opacity-80 md:opacity-100`}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 1 ? 6 : -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.35 + i * 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Idle bob — each vessel on its own period so they never
                  synchronise into a single pulsing mass. */}
              <motion.div
                animate={reduced ? {} : { y: [0, -14, 0] }}
                transition={{
                  duration: 7 + i * 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-full"
              >
                <ProductRender art={product.art} id={`hero-${product.id}`} />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Plane 3 — copy */}
      <motion.div
        style={reduced ? still : { y: copyY, opacity: copyOpacity }}
        className="shell relative z-10"
      >
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Formulated in Bengaluru
        </motion.p>

        <TextReveal
          as="h1"
          text="Skincare with the percentages on the front."
          className="mx-auto mt-5 max-w-[16ch] text-center font-display text-hero leading-[0.9] tracking-[-0.045em]"
          delay={0.2}
        />

        <motion.p
          className="mx-auto mt-7 max-w-[46ch] text-center text-base leading-relaxed text-content-muted md:text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          Twelve products. No ten-step routine, no proprietary complexes, and
          nothing in the formula that is there to look good on a label.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.86, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic>
            <ButtonLink href="/products" size="lg">
              Shop everything
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href="#ingredients" variant="secondary" size="lg">
              How it is made
            </ButtonLink>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Proof strip — fills the lower third, which otherwise reads as a gap
          between the call to action and the fold. */}
      <motion.dl
        className="absolute inset-x-0 bottom-20 z-10 hidden justify-center gap-12 md:flex lg:gap-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        {[
          { value: "12", label: "Products, total" },
          { value: "4.7", label: "Average rating" },
          { value: "7,100+", label: "Verified reviews" },
          { value: "24h", label: "Dispatch" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <dt className="font-display text-3xl tabular-nums tracking-[-0.03em]">
              {stat.value}
            </dt>
            <dd className="eyebrow mt-1.5">{stat.label}</dd>
          </div>
        ))}
      </motion.dl>

      <motion.a
        href="#featured"
        aria-label="Scroll to featured products"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-content-subtle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <motion.span
          animate={reduced ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ArrowDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
