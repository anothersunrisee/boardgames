export type MakeupItemDef = {
  name: string;
  category: 'skincare' | 'makeup' | 'haircare' | 'bodycare' | 'tools';
  aliases: string[];
  clue?: string;
};

export const MAKEUP_ITEMS_DEF: MakeupItemDef[] = [
  // ── Tools & Aplikator (15 Items) ──
  { name: 'Penjepit Bulu Mata', category: 'tools', aliases: ['penjepit bulu mata', 'eyelash curler', 'jepit bulu mata', 'curler'] },
  { name: 'Beauty Blender (Spons Makeup)', category: 'tools', aliases: ['beauty blender', 'spons makeup', 'sponge', 'beauty sponge'] },
  { name: 'Kuas Foundation Kabuki', category: 'tools', aliases: ['brush foundation', 'kuas foundation', 'kabuki brush'] },
  { name: 'Spoolie (Sikat Alis)', category: 'tools', aliases: ['spoolie', 'sikat alis', 'eyebrow brush'] },
  { name: 'Pinset Cabut Alis', category: 'tools', aliases: ['pinset', 'tweezer', 'pencabut bulu'] },
  { name: 'Puff Bedak Tabur Bulu', category: 'tools', aliases: ['powder puff', 'puff bedak', 'spons bedak'] },
  { name: 'Gunting Kuku Cantengan', category: 'tools', aliases: ['gunting kuku', 'nail clipper'] },
  { name: 'Roll Rambut Velcro', category: 'tools', aliases: ['roll rambut', 'hair roller', 'rolan poni'] },
  { name: 'Jedai Jepitan Badai', category: 'tools', aliases: ['jedai', 'jepit badai', 'jepitan rambut'] },
  { name: 'Kapas Wajah Bulat Tipis', category: 'tools', aliases: ['kapas', 'cotton pad', 'kapas wajah'] },
  { name: 'Catokan Rambut Lurus & Curly', category: 'tools', aliases: ['catokan', 'hair straightener', 'curler rambut'] },
  { name: 'Hair Dryer Angin Panas', category: 'tools', aliases: ['hair dryer', 'pengering rambut'] },
  { name: 'Cermin Rias Lampu LED', category: 'tools', aliases: ['kaca rias', 'cermin led', 'cermin makeup'] },
  { name: 'Pembersih Kuas Silikon', category: 'tools', aliases: ['brush cleaner', 'silicone cleaner', 'pad kuas'] },
  { name: 'Sisir Sasak Kayu', category: 'tools', aliases: ['sisir sasak', 'sisir kayu', 'sisir blow'] },

  // ── Makeup Face & Base (15 Items) ──
  { name: 'Cushion Glowing Dewy', category: 'makeup', aliases: ['cushion', 'bb cushion', 'bedak cushion'] },
  { name: 'Foundation Cair Matte', category: 'makeup', aliases: ['foundation', 'alas bedak', 'liquid foundation'] },
  { name: 'Concealer Tutup Mata Panda', category: 'makeup', aliases: ['concealer', 'penutup noda'] },
  { name: 'Bedak Tabur Loose Powder', category: 'makeup', aliases: ['loose powder', 'bedak tabur', 'translucent powder'] },
  { name: 'Setting Spray Pengunci Makeup', category: 'makeup', aliases: ['setting spray', 'spray makeup', 'face mist'] },
  { name: 'Primer Pori-Pori Wajah', category: 'makeup', aliases: ['primer', 'pore primer', 'base makeup'] },
  { name: 'Blush On Pipi Merona', category: 'makeup', aliases: ['blush on', 'blush', 'perona pipi'] },
  { name: 'Highlighter Kilau Glowing', category: 'makeup', aliases: ['highlighter', 'kilau pipi'] },
  { name: 'Contour Hidung Mancung', category: 'makeup', aliases: ['contour', 'contour stick', 'shading'] },
  { name: 'Bronzer Hangat Sun-Kissed', category: 'makeup', aliases: ['bronzer', 'warm bronze'] },
  { name: 'Color Corrector Hijau Jerawat', category: 'makeup', aliases: ['color corrector', 'corrector hijau'] },
  { name: 'BB Cream Harian Ringan', category: 'makeup', aliases: ['bb cream', 'cc cream'] },
  { name: 'Compact Powder Bedak Padat', category: 'makeup', aliases: ['compact powder', 'bedak padat', 'two way cake'] },
  { name: 'Cushion Tinted Sunscreen', category: 'makeup', aliases: ['tinted sunscreen', 'sunscreen cushion'] },
  { name: 'Baking Powder Kuning Langsat', category: 'makeup', aliases: ['banana powder', 'baking powder'] },

  // ── Makeup Mata & Bibir (18 Items) ──
  { name: 'Lip Tint Ombre Korea', category: 'makeup', aliases: ['lip tint', 'liptint', 'tint bibir'] },
  { name: 'Lip Matte Transferproof', category: 'makeup', aliases: ['lip cream', 'lip matte', 'matte lipstick'] },
  { name: 'Lip Gloss Bibir Basah Plumpy', category: 'makeup', aliases: ['lip gloss', 'lipgloss', 'gloss'] },
  { name: 'Pensil Alis Cokelat Natural', category: 'makeup', aliases: ['pensil alis', 'eyebrow pencil', 'alis'] },
  { name: 'Mascara Bulu Mata Lentik', category: 'makeup', aliases: ['mascara', 'maskara', 'waterproof mascara'] },
  { name: 'Eyeliner Spidol Hitam Pekat', category: 'makeup', aliases: ['eyeliner', 'eye liner', 'winged liner'] },
  { name: 'Eyeshadow Palette 9 Warna', category: 'makeup', aliases: ['eyeshadow', 'palette eyeshadow', 'shadow mata'] },
  { name: 'Lip Balm Lembab Strawberry', category: 'makeup', aliases: ['lip balm', 'lipbalm', 'pelembab bibir'] },
  { name: 'Lip Liner Pembingkai Bibir', category: 'makeup', aliases: ['lip liner', 'lipliner'] },
  { name: 'Browcara Gel Alis Berserat', category: 'makeup', aliases: ['browcara', 'brow gel', 'maskara alis'] },
  { name: 'Bulu Mata Palsu Natural', category: 'makeup', aliases: ['bulu mata palsu', 'fake eyelashes', 'falsies'] },
  { name: 'Lem Bulu Mata Bening', category: 'makeup', aliases: ['lem bulu mata', 'eyelash glue'] },
  { name: 'Glitter Eyeshadow Cair', category: 'makeup', aliases: ['glitter mata', 'liquid eyeshadow', 'shimmer'] },
  { name: 'Lip Oil Berry Glossy', category: 'makeup', aliases: ['lip oil', 'minyak bibir'] },
  { name: 'Tinted Lip Balm SPF', category: 'makeup', aliases: ['tinted lip balm', 'lip butter'] },
  { name: 'Pomade Alis Waterproof', category: 'makeup', aliases: ['brow pomade', 'pomade alis'] },
  { name: 'Pensil Mata Putih Bawah Mata', category: 'makeup', aliases: ['white eyeliner', 'eyeliner putih'] },
  { name: 'Lip Sleeping Mask Malam', category: 'makeup', aliases: ['lip mask', 'lip sleeping mask'] },

  // ── Skincare & Cleansing (20 Items) ──
  { name: 'Sunscreen Gel Dingin SPF 50', category: 'skincare', aliases: ['sunscreen', 'sunblock', 'tabir surya'] },
  { name: 'Serum Vitamin C Mencerahkan', category: 'skincare', aliases: ['serum vit c', 'serum', 'vitamin c'] },
  { name: 'Moisturizer Gel Ceramide', category: 'skincare', aliases: ['moisturizer', 'pelembab', 'krim pelembab'] },
  { name: 'Micellar Water Pembersih Makeup', category: 'skincare', aliases: ['micellar water', 'micellar', 'cleansing water'] },
  { name: 'Toner Eksfoliasi AHA BHA', category: 'skincare', aliases: ['toner', 'exfoliating toner', 'hydrating toner'] },
  { name: 'Facial Wash Sabun Muka Lembut', category: 'skincare', aliases: ['facial wash', 'face wash', 'sabun cuci muka'] },
  { name: 'Cleansing Balm Lilin Pembersih', category: 'skincare', aliases: ['cleansing balm', 'balm pembersih'] },
  { name: 'Sheet Mask Topeng Tissue Basah', category: 'skincare', aliases: ['sheet mask', 'masker tisu', 'masker wajah'] },
  { name: 'Clay Mask Lumpur Pori-Pori', category: 'skincare', aliases: ['clay mask', 'masker lumpur', 'mud mask'] },
  { name: 'Acne Patch Stiker Jerawat', category: 'skincare', aliases: ['acne patch', 'stiker jerawat', 'pimple patch'] },
  { name: 'Eye Cream Kantung Mata', category: 'skincare', aliases: ['eye cream', 'krim mata'] },
  { name: 'Serum Retinol Anti-Aging', category: 'skincare', aliases: ['retinol', 'serum retinol'] },
  { name: 'Serum Niacinamide Flek Hitam', category: 'skincare', aliases: ['niacinamide', 'serum niacinamide'] },
  { name: 'Serum Hyaluronic Acid Lembab', category: 'skincare', aliases: ['hyaluronic acid', 'serum ha'] },
  { name: 'Sunscreen Spray Semprot Praktis', category: 'skincare', aliases: ['sunscreen spray', 'sun spray'] },
  { name: 'Minyak Pembersih Cleansing Oil', category: 'skincare', aliases: ['cleansing oil', 'minyak pembersih'] },
  { name: 'Lulur Scrub Kopi Mandi', category: 'bodycare', aliases: ['body scrub', 'lulur', 'scrub badan'] },
  { name: 'Hair Serum Ujung Rambut Kering', category: 'haircare', aliases: ['hair serum', 'vitamin rambut', 'hair oil'] },
  { name: 'Dry Shampoo Semprot Rambut Lepek', category: 'haircare', aliases: ['dry shampoo', 'shampo kering'] },
  { name: 'Body Serum Wangi Vanilla', category: 'bodycare', aliases: ['body serum', 'body lotion', 'hand body'] },
];

export const MAKEUP_ITEMS: string[] = MAKEUP_ITEMS_DEF.map((item) => item.name);

export function getRandomItems(count: number): string[] {
  const shuffled = [...MAKEUP_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
