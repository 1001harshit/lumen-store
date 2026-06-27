import type { Collection } from "@/lib/types";

export const COLLECTIONS: Collection[] = [
  {
    slug: "cleanse",
    name: "Cleanse",
    eyebrow: "Step one",
    description:
      "Surfactant systems chosen for what they leave behind, not what they strip. Every cleanser here finishes below pH 5.5.",
    hueFrom: 195,
    hueTo: 168,
  },
  {
    slug: "treat",
    name: "Treat",
    eyebrow: "Step two",
    description:
      "Actives at concentrations that have actually been trialled — printed on the front of the bottle, not buried in the INCI list.",
    hueFrom: 62,
    hueTo: 28,
  },
  {
    slug: "hydrate",
    name: "Hydrate",
    eyebrow: "Step three",
    description:
      "Humectants paired with the lipids that hold them in place. Water alone evaporates and takes yours with it.",
    hueFrom: 232,
    hueTo: 268,
  },
  {
    slug: "protect",
    name: "Protect",
    eyebrow: "Step four",
    description:
      "Broad-spectrum mineral filters in a base that does not turn chalky, pill under makeup, or sting.",
    hueFrom: 88,
    hueTo: 132,
  },
  {
    slug: "ritual",
    name: "Ritual",
    eyebrow: "Weekly",
    description:
      "The slower end of the routine. Masks, oils and resurfacing treatments meant for the night you have time.",
    hueFrom: 318,
    hueTo: 356,
  },
];

export const COLLECTION_BY_SLUG = new Map(COLLECTIONS.map((c) => [c.slug, c]));
