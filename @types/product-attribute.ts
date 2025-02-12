interface BaseAttributes {
  id: string;
  productVariationId: string;
}

interface TShirtAttributes extends BaseAttributes {
  sleeveType: string; // "long" | "short" | "3/4" | "full" | "none"
  collarType: string; // "round" | "v-neck" | "polo" | "square" | "none"
  fit: string; // "regular" | "slim" | "oversized"
  fabricWeight?: string; // "light" | "medium" | "heavy" | "very heavy"
  careInstructions?: string;
  stretchability?: string; // "non-stretch" | "little-stretch" | "medium-stretch" | "super-stretch" | "other"
  pattern?: string; // "solid" | "striped" | "printed" | "logo-only" | "back-printed-only" | "front-printed-only" | "other"
}

interface PantAttributes extends BaseAttributes {
  waistType?: string; // "low" | "mid" | "high", "others"
  stretchType: string; // "non-stretch" | "little-stretch" | "medium-stretch" | "super-stretch" | "other"
  washType: string; // "dark-wash" | "medium-wash" | "distressed" | "other"
  legStyle: string; // "skinny" | "slim" |"straight" | "regular" | "bootcut" | "wide" | "other"
  pantType: string; // "full pant" | "half pant" | "low-pant" | "3/4" | "other"
  inseam?: number; // In inches (28, 30, 32)
  pocketTypes: string[]; // ["front", "back", "coin"]
}

interface ShoeAttributes extends BaseAttributes {
  width?: string; // "narrow" | "medium" | "wide"
  shoeType: string; // "sneakers" | "boots" | "sandals" | "sport" | "dress-shoes" | "loafers" | "flats" | "ankle-boots" | "ballet-flats" | "slipper" | "sandals" | "formal-shoes" | "other"
  closureType: string; // "laces" | "velcro" | "slip-on" | "buckle" | "zipper" | "none"
  outsole?: string; // "rubber" | "eva" | "tup" | "leather" | "other" | "none"
  insole?: string; // "memory foam" | "ortholite" |"other" | "none"
  occasion: string; // "casual" | "sports" | "formal"
}

interface ShirtAttributes extends BaseAttributes {
  collarType: string; // "spread" | "button-down" | "mandarin" | "wing" | "club" | "other" | "none"
  sleeveLength: string; // "short" | "half" | "long" | "full" | "none" | "3/4"
  fit: string; // "slim" | "regular" | "relaxed" | "oversized" | "loose" | "other"
  pocketStyle: string; // "chest" | "no pockets"
  placketType: string; // "hidden" | "buttoned"
  pattern: string; // "solid" | "striped" | "checked" | "printed" | "logo-only" | "back-printed-only" | "front-printed-only" | "other"
}

interface JacketAttributes extends BaseAttributes {
  closureType: string; // "zipper" | "buttons" | "snap" | "none"
  insulation?: string; // "down" | "synthetic" | "fleece" | "none"
  hooded: boolean;
  pocketTypes: string[]; // chest | side | interior
  waterproof: boolean;
  weightClass?: string; // "light" | "medium" | "heavy" | "very heavy"
}

interface HoodieAttributes extends BaseAttributes {
  fit: string; // "regular" | "slim" | "oversized"
  hoodType?: string; // "fitted" | "adjustable" | "oversized"
  pocketStyle: string; // "kangaroo" | "zippered" | "split"
  fabricWeight?: string; // "light" | "medium" | "heavy" | "very heavy"
  sleeveStyle?: string; // "raglan" | "set-in" | "other"
  drawString?: string; // "cotton" | "nylon"
}

interface UndergarmentAttributes extends BaseAttributes {
  type: string; // boxers | briefs | trunks | thong | bikini | other
  waistband: string; // elastic | ribbed  | covered-elastic | drawstring
  breathability?: string; // moisture-wicking | cotton
  supportLevel?: string; // "light" | "medium" | "high"
  legLength: string; // "short" | "medium" | "long"
}

interface GenericAttributes extends BaseAttributes {
  attributes: Record<string, any>;
}
