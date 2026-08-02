import { Star } from "lucide-react";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";

type Review = {
  quote: string;
  author: string;
  product: string;
  rating: number;
};

const REVIEWS: Review[] = [
  { quote: "Four months in and the marks on my jawline have genuinely faded. First thing that has.", author: "Ananya R.", product: "Niacinamide 10", rating: 5 },
  { quote: "The only mineral SPF I have found that does not go grey on me. That is the whole review.", author: "Deepak M.", product: "Mineral Shield 50", rating: 5 },
  { quote: "Started at two nights a week as the box says. Zero peeling, which has never happened before.", author: "Priya S.", product: "Retinal Night Serum", rating: 5 },
  { quote: "My face no longer feels like it is shrinking after I wash it.", author: "Kabir N.", product: "Clarity Gel Cleanser", rating: 4 },
  { quote: "Bought it for the ratio being printed on the carton. Stayed because my eczema patches settled.", author: "Meera J.", product: "Ceramide Barrier Cream", rating: 5 },
  { quote: "Absorbs before I have finished getting dressed. Sounds small, it is not.", author: "Rohan T.", product: "Ceramide Body Lotion", rating: 4 },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col gap-4 rounded-[var(--radius-card)] border border-hairline bg-surface-raised p-6 md:w-[23rem]">
      <div className="flex gap-0.5" aria-label={`${review.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={
              i < review.rating
                ? "fill-accent text-accent"
                : "text-content-subtle/40"
            }
          />
        ))}
      </div>
      <blockquote className="text-[0.9375rem] leading-relaxed">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-auto text-xs text-content-muted">
        <span className="text-content">{review.author}</span> · {review.product}
      </figcaption>
    </figure>
  );
}

/**
 * Two counter-running rows. Opposing directions read as motion rather than as
 * one long strip sliding by, and they let twice the content sit in the same
 * vertical space without either row moving fast enough to be unreadable.
 */
export function ReviewMarquee() {
  const [top, bottom] = [REVIEWS.slice(0, 3), REVIEWS.slice(3)];

  return (
    <section id="reviews" className="mt-32 overflow-hidden py-4">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">4.7 average · 7,100+ reviews</p>
        </Reveal>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <Marquee duration={46}>
          {top.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </Marquee>
        <Marquee duration={52} reverse>
          {bottom.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
