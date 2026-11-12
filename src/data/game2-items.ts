export const MAKEUP_ITEMS: string[] = [
  "Pensil Alis",
  "Penjepit Bulu Mata",
  "Moisturizer",
  "Toner",
  "Serum",
  "BB Cream",
  "Concealer",
  "Blush On",
  "Sunscreen",
  "Lip Balm",
  "Mascara",
  "Setting Spray",
  "Foundation",
  "Eyeshadow Palette",
  "Lip Liner",
  "Highlighter",
  "Contour Stick",
  "Face Wash",
  "Micellar Water",
  "Lip Tint",
  "Cushion",
  "Primer",
  "Bronzer",
  "Brow Pomade",
  "Eyeliner",
];

export function getRandomItems(count: number): string[] {
  const shuffled = [...MAKEUP_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

