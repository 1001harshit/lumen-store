/**
 * Catalog domain model.
 *
 * Deliberately flat and serialisable: every entity is plain JSON so the same
 * shapes cross the RSC boundary, sit in a route handler response, and persist
 * in the cart cookie without a mapping layer.
 */

export type OptionName = "Size" | "Formula";

export type VariantOptions = Partial<Record<OptionName, string>>;

export type Variant = {
  id: string;
  sku: string;
  options: VariantOptions;
  /** Integer paise. Never a float. */
  price: number;
  /** Strike-through reference price, when on offer. */
  compareAt?: number;
  stock: number;
};

export type Ingredient = {
  name: string;
  /** Concentration or role, e.g. "10%" or "humectant". */
  detail: string;
  blurb: string;
};

/** Drives the generated SVG product render — see components/product/Render. */
export type Artwork = {
  /** OKLCH hue angles for the bottle gradient stops. */
  hueFrom: number;
  hueTo: number;
  chroma: number;
  /** Silhouette of the vessel. */
  vessel: "dropper" | "pump" | "tube" | "jar" | "bottle";
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  collection: CollectionSlug;
  /** Short marketing flags rendered as pills on the card. */
  badges: string[];
  ingredients: Ingredient[];
  /** Ordered — the first is the default selection. */
  variants: Variant[];
  optionOrder: OptionName[];
  art: Artwork;
  rating: number;
  reviewCount: number;
  featured?: boolean;
};

export type CollectionSlug =
  | "cleanse"
  | "treat"
  | "hydrate"
  | "protect"
  | "ritual";

export type Collection = {
  slug: CollectionSlug;
  name: string;
  eyebrow: string;
  description: string;
  hueFrom: number;
  hueTo: number;
};

/** A line as persisted in the cart cookie — ids only, never prices. */
export type CartLineRef = {
  productId: string;
  variantId: string;
  quantity: number;
};

/** A line after it has been resolved against the catalog for display. */
export type CartLine = {
  product: Product;
  variant: Variant;
  quantity: number;
  lineTotal: number;
};

export type Cart = {
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
};
