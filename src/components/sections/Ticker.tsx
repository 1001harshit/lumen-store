import { Marquee } from "@/components/motion/Marquee";

const CLAIMS = [
  "Free delivery over ₹1,500",
  "Fragrance-free options on every formula",
  "Percentages printed on the front",
  "Dispatched within 24 hours",
  "Never tested on animals",
  "Formulated in Bengaluru",
  "30-day returns, opened or not",
];

/**
 * Thin value-prop band.
 *
 * Sits directly under the hero to break the long vertical run between the fold
 * and the first product grid — that stretch was reading as dead space. Inverse
 * colours make it a deliberate rule across the page rather than more of the
 * same cream field.
 */
export function Ticker() {
  return (
    <div className="mt-20 border-y border-hairline bg-surface-inverse py-3.5 text-content-inverse md:mt-24">
      <Marquee duration={38} pauseOnHover={false}>
        {CLAIMS.map((claim) => (
          <span
            key={claim}
            className="flex shrink-0 items-center gap-10 whitespace-nowrap text-[0.8125rem] tracking-tight"
          >
            {claim}
            <span aria-hidden className="text-accent">
              ✦
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
