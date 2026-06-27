import type { Product } from "@/lib/types";

/**
 * Seed catalog.
 *
 * This is the store's source of truth. It lives in-repo on purpose: the whole
 * point of this build is a storefront that deploys as one Next.js app with no
 * database to provision. `lib/catalog.ts` is the only module that reads it, so
 * swapping this for a CMS or a real API later means changing one file.
 *
 * Prices are integer paise.
 */
export const PRODUCTS: Product[] = [
  {
    id: "p_clarity_gel",
    slug: "clarity-gel-cleanser",
    name: "Clarity Gel Cleanser",
    tagline: "Amino-acid surfactants, pH 5.2",
    description:
      "A low-foam gel built on sodium cocoyl glycinate rather than sulfates. It clears sunscreen and the day's grime in one pass and rinses without the tight, squeaking finish that means you have just removed your own barrier lipids along with everything else.",
    collection: "cleanse",
    badges: ["Fragrance-free", "pH 5.2"],
    ingredients: [
      { name: "Sodium cocoyl glycinate", detail: "primary surfactant", blurb: "Amino-acid derived. Cleans at skin-compatible pH instead of forcing an alkaline swing." },
      { name: "Glycerin", detail: "6%", blurb: "Stays on the skin after rinse-off and pulls water back into the stratum corneum." },
      { name: "Panthenol", detail: "2%", blurb: "Pro-vitamin B5. Measurably reduces post-cleanse redness." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_clarity_150", sku: "LUM-CLR-150", options: { Size: "150 ml" }, price: 148000, stock: 42 },
      { id: "v_clarity_300", sku: "LUM-CLR-300", options: { Size: "300 ml" }, price: 239000, compareAt: 268000, stock: 18 },
    ],
    art: { hueFrom: 196, hueTo: 172, chroma: 0.07, vessel: "pump" },
    rating: 4.7,
    reviewCount: 318,
    featured: true,
  },
  {
    id: "p_milk_balm",
    slug: "milk-cleansing-balm",
    name: "Milk Cleansing Balm",
    tagline: "Melts to an oil, rinses to a milk",
    description:
      "A solid balm that liquefies at skin temperature and emulsifies on contact with water. Designed as the first step of a double cleanse: it lifts mineral sunscreen and long-wear makeup without the tugging that comes from wiping them off dry.",
    collection: "cleanse",
    badges: ["Double cleanse", "Sunscreen-safe"],
    ingredients: [
      { name: "Caprylic/capric triglyceride", detail: "base", blurb: "Fractionated coconut esters — light, stable, and non-comedogenic." },
      { name: "Polyglyceryl-4 oleate", detail: "emulsifier", blurb: "Turns the oil phase milky on contact with water so nothing is left behind." },
      { name: "Squalane", detail: "olive-derived", blurb: "Matches skin's own squalene closely enough to absorb without residue." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_balm_90", sku: "LUM-BLM-090", options: { Size: "90 ml" }, price: 189000, stock: 27 },
    ],
    art: { hueFrom: 72, hueTo: 46, chroma: 0.055, vessel: "jar" },
    rating: 4.8,
    reviewCount: 204,
  },
  {
    id: "p_niacinamide",
    slug: "niacinamide-10-serum",
    name: "Niacinamide 10 Serum",
    tagline: "10% niacinamide, 1% zinc PCA",
    description:
      "The concentration that trials actually support, in a water-light base that layers under anything. Expect visible change in sebum control and post-inflammatory marks across eight to twelve weeks — not overnight, and anyone promising otherwise is selling you something else.",
    collection: "treat",
    badges: ["10% active", "Layerable"],
    ingredients: [
      { name: "Niacinamide", detail: "10%", blurb: "Vitamin B3. Regulates sebum, supports ceramide synthesis, fades post-inflammatory pigment." },
      { name: "Zinc PCA", detail: "1%", blurb: "Paired with niacinamide for oil control without the flaking of a topical retinoid." },
      { name: "Beta-glucan", detail: "0.5%", blurb: "Oat-derived soother that offsets the flush some people get from B3." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_niac_30", sku: "LUM-NIA-030", options: { Size: "30 ml" }, price: 129000, stock: 64 },
      { id: "v_niac_50", sku: "LUM-NIA-050", options: { Size: "50 ml" }, price: 189000, compareAt: 215000, stock: 31 },
    ],
    art: { hueFrom: 58, hueTo: 32, chroma: 0.085, vessel: "dropper" },
    rating: 4.9,
    reviewCount: 1246,
    featured: true,
  },
  {
    id: "p_retinal",
    slug: "retinal-night-serum",
    name: "Retinal Night Serum",
    tagline: "0.1% retinaldehyde, encapsulated",
    description:
      "Retinaldehyde sits one conversion step from retinoic acid, which makes it markedly faster than retinol and markedly gentler than a prescription. Encapsulation slows the release over the night so the dose lands without the week-two peeling that makes most people quit.",
    collection: "treat",
    badges: ["Night use", "Encapsulated"],
    ingredients: [
      { name: "Retinaldehyde", detail: "0.1%", blurb: "One step from retinoic acid — roughly eleven times faster-converting than retinol." },
      { name: "Bisabolol", detail: "0.5%", blurb: "Chamomile-derived. Takes the edge off the adjustment period." },
      { name: "Ceramide NP", detail: "0.2%", blurb: "Replaces the barrier lipids that any retinoid temporarily disrupts." },
    ],
    optionOrder: ["Size", "Formula"],
    variants: [
      { id: "v_ret_30_ff", sku: "LUM-RET-030-FF", options: { Size: "30 ml", Formula: "Fragrance-free" }, price: 279000, stock: 22 },
      { id: "v_ret_30_sc", sku: "LUM-RET-030-SC", options: { Size: "30 ml", Formula: "Lightly scented" }, price: 279000, stock: 9 },
      { id: "v_ret_50_ff", sku: "LUM-RET-050-FF", options: { Size: "50 ml", Formula: "Fragrance-free" }, price: 398000, stock: 14 },
      { id: "v_ret_50_sc", sku: "LUM-RET-050-SC", options: { Size: "50 ml", Formula: "Lightly scented" }, price: 398000, stock: 0 },
    ],
    art: { hueFrom: 28, hueTo: 352, chroma: 0.075, vessel: "dropper" },
    rating: 4.8,
    reviewCount: 892,
    featured: true,
  },
  {
    id: "p_vitamin_c",
    slug: "vitamin-c-15-ascorbate",
    name: "Vitamin C 15 Ascorbate",
    tagline: "15% THD ascorbate in squalane",
    description:
      "Tetrahexyldecyl ascorbate rather than L-ascorbic acid: oil-soluble, stable at skin pH, and it does not oxidise into an orange mess by week three. Anhydrous base, so there is no water for the active to degrade in.",
    collection: "treat",
    badges: ["Anhydrous", "Stable"],
    ingredients: [
      { name: "THD ascorbate", detail: "15%", blurb: "Oil-soluble vitamin C ester. Penetrates further than L-ascorbic and stays stable." },
      { name: "Squalane", detail: "carrier", blurb: "Anhydrous base — no water phase means nothing for the ascorbate to oxidise in." },
      { name: "Tocopherol", detail: "1%", blurb: "Vitamin E. Regenerates oxidised vitamin C and extends the antioxidant window." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_vitc_30", sku: "LUM-VTC-030", options: { Size: "30 ml" }, price: 318000, stock: 37 },
    ],
    art: { hueFrom: 82, hueTo: 52, chroma: 0.1, vessel: "dropper" },
    rating: 4.6,
    reviewCount: 541,
  },
  {
    id: "p_ceramide_cream",
    slug: "ceramide-barrier-cream",
    name: "Ceramide Barrier Cream",
    tagline: "Ceramides at a 3:1:1 ratio",
    description:
      "Ceramide, cholesterol and free fatty acid in the proportion the skin actually assembles them in. Mismatched ratios can slow barrier recovery rather than speed it, which is why this one is printed on the carton.",
    collection: "hydrate",
    badges: ["3:1:1 ratio", "Barrier repair"],
    ingredients: [
      { name: "Ceramide NP + AP + EOP", detail: "3 parts", blurb: "The three species that dominate healthy stratum corneum lipid lamellae." },
      { name: "Cholesterol", detail: "1 part", blurb: "Without it, ceramides alone will not reassemble into ordered lamellae." },
      { name: "Linoleic acid", detail: "1 part", blurb: "The free fatty acid arm. Completes the physiological ratio." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_cer_50", sku: "LUM-CER-050", options: { Size: "50 ml" }, price: 219000, stock: 55 },
      { id: "v_cer_100", sku: "LUM-CER-100", options: { Size: "100 ml" }, price: 348000, compareAt: 398000, stock: 23 },
    ],
    art: { hueFrom: 238, hueTo: 262, chroma: 0.05, vessel: "jar" },
    rating: 4.9,
    reviewCount: 1573,
    featured: true,
  },
  {
    id: "p_hydration_essence",
    slug: "hyaluronic-hydration-essence",
    name: "Hyaluronic Hydration Essence",
    tagline: "Five molecular weights, 1.2% total",
    description:
      "Hyaluronic acid fractionated across five molecular weights so it hydrates at more than one depth. Used on damp skin and sealed with a cream — high-molecular-weight HA on dry skin in dry air will pull moisture the wrong way.",
    collection: "hydrate",
    badges: ["5 weights", "Layer damp"],
    ingredients: [
      { name: "Sodium hyaluronate", detail: "1.2% across 5 MW", blurb: "From 8 kDa to 1500 kDa — surface film through to deeper hydration." },
      { name: "Betaine", detail: "2%", blurb: "Osmolyte that holds water without HA's humidity dependence." },
      { name: "Trehalose", detail: "1%", blurb: "Protects membrane integrity through dehydration cycles." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_hya_100", sku: "LUM-HYA-100", options: { Size: "100 ml" }, price: 168000, stock: 71 },
      { id: "v_hya_200", sku: "LUM-HYA-200", options: { Size: "200 ml" }, price: 268000, stock: 34 },
    ],
    art: { hueFrom: 218, hueTo: 248, chroma: 0.065, vessel: "bottle" },
    rating: 4.7,
    reviewCount: 706,
  },
  {
    id: "p_mineral_spf",
    slug: "mineral-shield-spf-50",
    name: "Mineral Shield SPF 50",
    tagline: "Non-nano zinc, no white cast",
    description:
      "22% non-nano zinc oxide dispersed finely enough that it disappears on medium and deep skin — the single failure that makes most people abandon mineral sunscreen. Finishes matte, sits under makeup, and does not sting the eyes.",
    collection: "protect",
    badges: ["SPF 50", "PA++++", "Reef-safe"],
    ingredients: [
      { name: "Zinc oxide", detail: "22%, non-nano", blurb: "Broad-spectrum UVA and UVB in a single mineral filter." },
      { name: "Isoamyl laurate", detail: "dispersant", blurb: "Plant-derived ester that carries the zinc load without chalk or pilling." },
      { name: "Vitamin E", detail: "0.5%", blurb: "Mops up the free radicals that get past any filter." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_spf_50", sku: "LUM-SPF-050", options: { Size: "50 ml" }, price: 158000, stock: 88 },
    ],
    art: { hueFrom: 96, hueTo: 138, chroma: 0.06, vessel: "tube" },
    rating: 4.5,
    reviewCount: 963,
  },
  {
    id: "p_overnight_mask",
    slug: "overnight-resurfacing-mask",
    name: "Overnight Resurfacing Mask",
    tagline: "8% AHA + 2% PHA, weekly",
    description:
      "A leave-on acid mask for one or two nights a week. Gluconolactone moderates the glycolic sting and holds water while the AHA works, which is what keeps the morning after looking smooth rather than raw.",
    collection: "ritual",
    badges: ["Weekly", "8% AHA"],
    ingredients: [
      { name: "Glycolic acid", detail: "8%", blurb: "The smallest AHA. Loosens corneocyte adhesion at the surface." },
      { name: "Gluconolactone", detail: "2%", blurb: "A PHA — larger, slower, and a humectant in its own right." },
      { name: "Allantoin", detail: "0.5%", blurb: "Keeps the acid phase from tipping into visible irritation." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_mask_50", sku: "LUM-MSK-050", options: { Size: "50 ml" }, price: 198000, stock: 29 },
    ],
    art: { hueFrom: 324, hueTo: 356, chroma: 0.08, vessel: "jar" },
    rating: 4.6,
    reviewCount: 447,
  },
  {
    id: "p_facial_oil",
    slug: "facial-oil-no-7",
    name: "Facial Oil No. 7",
    tagline: "Seven cold-pressed oils, one ratio",
    description:
      "Blended toward a linoleic-dominant profile, which is what dry and acne-prone skin tends to be short of. Two or three drops pressed in over a damp cream, as the last step — an oil under a moisturiser is just a barrier the moisturiser has to cross.",
    collection: "ritual",
    badges: ["Linoleic-rich", "Cold-pressed"],
    ingredients: [
      { name: "Rosehip seed oil", detail: "34%", blurb: "High linoleic content plus trace trans-retinoic acid." },
      { name: "Evening primrose", detail: "18%", blurb: "Gamma-linolenic acid — anti-inflammatory and barrier-supportive." },
      { name: "Sea buckthorn", detail: "4%", blurb: "Carotenoid load gives the oil its colour. It will not stain a pillow." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_oil_30", sku: "LUM-OIL-030", options: { Size: "30 ml" }, price: 238000, stock: 41 },
    ],
    art: { hueFrom: 44, hueTo: 18, chroma: 0.095, vessel: "dropper" },
    rating: 4.8,
    reviewCount: 385,
  },
  {
    id: "p_amino_wash",
    slug: "amino-body-wash",
    name: "Amino Body Wash",
    tagline: "Body cleanser at facial-grade pH",
    description:
      "The same amino-acid surfactant system as the face cleanser, scaled up. Most body washes run alkaline and are the unexamined cause of tight, itchy shins every winter.",
    collection: "cleanse",
    badges: ["pH 5.5", "500 ml"],
    ingredients: [
      { name: "Sodium cocoyl alaninate", detail: "primary surfactant", blurb: "Mild enough for face, priced for body." },
      { name: "Glycerin", detail: "8%", blurb: "Higher load than the facial cleanser — body skin loses water faster." },
      { name: "Oat kernel extract", detail: "1%", blurb: "Colloidal oat. Long-standing evidence base for itch." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_amn_500", sku: "LUM-AMN-500", options: { Size: "500 ml" }, price: 118000, stock: 96 },
    ],
    art: { hueFrom: 178, hueTo: 202, chroma: 0.06, vessel: "pump" },
    rating: 4.4,
    reviewCount: 229,
  },
  {
    id: "p_body_lotion",
    slug: "ceramide-body-lotion",
    name: "Ceramide Body Lotion",
    tagline: "Barrier lipids, body scale",
    description:
      "The barrier cream's lipid system in a thinner, faster-absorbing base that you will actually use on your whole body after a shower. Pump bottle, because a jar of body cream never gets finished.",
    collection: "hydrate",
    badges: ["Fast-absorbing", "400 ml"],
    ingredients: [
      { name: "Ceramide NP", detail: "0.4%", blurb: "The dominant ceramide species, at a concentration that works over large areas." },
      { name: "Urea", detail: "5%", blurb: "Humectant and mild keratolytic — the reason this helps with rough upper arms." },
      { name: "Shea butter", detail: "3%", blurb: "Occlusive load kept low so it absorbs before you dress." },
    ],
    optionOrder: ["Size"],
    variants: [
      { id: "v_bdy_400", sku: "LUM-BDY-400", options: { Size: "400 ml" }, price: 148000, stock: 62 },
    ],
    art: { hueFrom: 252, hueTo: 276, chroma: 0.05, vessel: "pump" },
    rating: 4.7,
    reviewCount: 512,
  },
];
