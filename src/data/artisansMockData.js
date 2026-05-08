// Mock artisan registry records — no backend integration yet

export const ARTISANS = [
  {
    id: "artisan-001",
    did: "did:skillchain:0x7f3a9b1c2e4d5f6a8b9c0d1e2f3a4b5c",
    displayName: "Rukmabai Salve",
    photo: null, // replace with real URL when available
    guild: "Paithani Weavers Collective",
    craftSpecialization: "Silk Loom Weaving",
    region: "Yeola, Maharashtra",
    registrationYear: 2021,
    verificationStatus: "verified",
    heritageStatement:
      "Carrying forward a 200-year family tradition of Paithani zari weaving, each piece a record of inherited memory.",
    artworkIds: ["artwork-001", "artwork-002"],
  },
  {
    id: "artisan-002",
    did: "did:skillchain:0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    displayName: "Krishnadev Pattnaik",
    photo: null,
    guild: "Odisha Pattachitra Guild",
    craftSpecialization: "Pattachitra Painting",
    region: "Raghurajpur, Odisha",
    registrationYear: 2020,
    verificationStatus: "verified",
    heritageStatement:
      "Trained under my grandfather, the motifs in my work trace lineage to 12th-century Jagannath temple iconography.",
    artworkIds: ["artwork-003"],
  },
  {
    id: "artisan-003",
    did: "did:skillchain:0x9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f",
    displayName: "Zubeda Khatoon",
    photo: null,
    guild: "Kutch Embroidery Artisans",
    craftSpecialization: "Kutchi Mirrorwork Embroidery",
    region: "Bhuj, Gujarat",
    registrationYear: 2022,
    verificationStatus: "verified",
    heritageStatement:
      "My needlework maps the geometry of our desert landscape — each mirror a fragment of sky held in cloth.",
    artworkIds: ["artwork-004", "artwork-005"],
  },
  {
    id: "artisan-004",
    did: "did:skillchain:0x4d3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a",
    displayName: "Mohan Lal Suthar",
    photo: null,
    guild: "Rajasthan Carved Furniture Consortium",
    craftSpecialization: "Sheesham Wood Carving",
    region: "Barmer, Rajasthan",
    registrationYear: 2019,
    verificationStatus: "pending",
    heritageStatement: null,
    artworkIds: ["artwork-006"],
  },
  {
    id: "artisan-005",
    did: "did:skillchain:0x2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b",
    displayName: "Annapurna Devi",
    photo: null,
    guild: "Madhubani Heritage Circle",
    craftSpecialization: "Madhubani Painting",
    region: "Mithila, Bihar",
    registrationYear: 2021,
    verificationStatus: "verified",
    heritageStatement:
      "Every line I draw is a prayer — Madhubani is not decoration, it is documentation of the living cosmos.",
    artworkIds: ["artwork-007", "artwork-008"],
  },
];

// Indexed lookup by artisan ID
export const ARTISANS_BY_ID = Object.fromEntries(
  ARTISANS.map((a) => [a.id, a])
);

// Artworks mock — enough to support the artwork → artisan link
export const ARTWORKS_WITH_ARTISAN = [
  {
    id: "artwork-001",
    title: "Peacock Paithani in Gold Zari",
    artisanId: "artisan-001",
    year: 2023,
    medium: "Silk, Gold Zari Thread",
    provenance: "Commissioned by Pune Cultural Trust, 2023",
  },
  {
    id: "artwork-003",
    title: "Dashavatara Panel — Matsya to Kalki",
    artisanId: "artisan-002",
    year: 2022,
    medium: "Natural Pigments on Cloth",
    provenance: "Acquired by NGMA New Delhi, 2022",
  },
  {
    id: "artwork-004",
    title: "Banni Bridal Odhna",
    artisanId: "artisan-003",
    year: 2024,
    medium: "Cotton, Glass Mirrors, Silk Thread",
    provenance: "Private collection, exhibited at Crafts Museum Delhi",
  },
];