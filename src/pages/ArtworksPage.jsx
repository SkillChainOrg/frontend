import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowUpRight,
  Coins,
  Fingerprint,
} from "lucide-react";

const artworks = [
  {
    id: "art_001",
    title: "Handwoven Textile",
    region: "Kutch, India",
    price: "1.5 ALGO",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
    tx: "ALGOTX_7F3A91BC2",
  },
  {
    id: "art_002",
    title: "Ceremonial Clay Vessel",
    region: "Oaxaca, Mexico",
    price: "2.1 ALGO",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop",
    tx: "ALGOTX_91AC72DD4",
  },
  {
    id: "art_003",
    title: "Natural Indigo Fabric",
    region: "Kyoto, Japan",
    price: "1.2 ALGO",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    tx: "ALGOTX_72DE91AF8",
  },
];

export default function ArtworksPage() {
  return (
    <div className="min-h-screen bg-[#F0E7D3] text-[#2B1D16] overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative px-6 pt-40 pb-24 border-b border-[#dbc9ad] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />

        <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#D8B38A]/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <div className="flex items-center gap-2 mb-6 uppercase tracking-[0.3em] text-xs text-[#9B5E38]">
              <ShieldCheck size={14} />
              Provenance Registry
            </div>

            <h1 className="font-serif text-[4rem] md:text-[6rem] leading-[0.92] tracking-[-0.04em] max-w-5xl mb-10">
              Authenticated cultural artifacts with immutable ownership history.
            </h1>

            <p className="text-xl leading-relaxed text-[#5C4636] max-w-3xl font-light">
              Browse blockchain-certified artisan works secured through
              decentralized identity, provenance anchoring, and x402-native
              acquisition infrastructure.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="px-6 pb-24">
  <div className="max-w-7xl mx-auto border border-[#d8c7ab] bg-[#F7EFE1] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

    <div className="grid lg:grid-cols-2">
      {/* IMAGE */}
      <div className="relative min-h-[720px] bg-[#d8c7ab] overflow-hidden">
        <img
          src={artworks[0].image}
          alt={artworks[0].title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-8 left-8 bg-[#0f0b08]/80 backdrop-blur-md border border-[#3e2d20] px-5 py-3 text-[#F0E7D3] uppercase tracking-[0.25em] text-[10px]">
          Featured Registry Artifact
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-12 lg:p-16 flex flex-col justify-between">
        <div>
          <div className="uppercase tracking-[0.3em] text-[11px] text-[#9B5E38] mb-6">
            Immutable Provenance
          </div>

          <h2 className="font-serif text-6xl leading-[0.95] tracking-[-0.04em] mb-8">
            {artworks[0].title}
          </h2>

          <p className="text-lg leading-relaxed text-[#5C4636] mb-10">
            This authenticated cultural artifact is anchored through
            decentralized identity, blockchain provenance,
            and tamper-resistant archival infrastructure.
          </p>

          <div className="space-y-6">
            <div>
              <div className="uppercase tracking-[0.25em] text-[10px] text-[#8A674F] mb-2">
                Artisan DID
              </div>

              <div className="font-mono text-sm break-all text-[#4E3C31]">
                did:pkh:algo:artisan-13k8f7w
              </div>
            </div>

            <div>
              <div className="uppercase tracking-[0.25em] text-[10px] text-[#8A674F] mb-2">
                Blockchain Anchor
              </div>

              <div className="font-mono text-sm break-all text-[#4E3C31]">
                {artworks[0].tx}
              </div>
            </div>

            <div>
              <div className="uppercase tracking-[0.25em] text-[10px] text-[#8A674F] mb-2">
                Acquisition Infrastructure
              </div>

              <div className="text-[#4E3C31]">
                x402-enabled ownership transfer
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-[#d8c7ab] pt-8">
          <div>
            <div className="uppercase tracking-[0.2em] text-[10px] text-[#8A674F] mb-2">
              Registry Status
            </div>

            <div className="text-[#2B1D16] font-serif text-2xl">
              Verified & Active
            </div>
          </div>

          <Link
            to={`/artworks/${artworks[0].id}`}
            className="px-8 py-4 bg-[#B56A3E] text-white uppercase tracking-[0.2em] text-xs hover:bg-[#9f5730] transition"
          >
            Explore Provenance
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ================= ARCHIVAL REGISTRY ROWS ================= */}
        <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto space-y-10">
            {artworks.slice(1).map((artwork, index) => (
            <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
            >
                <Link
                to={`/artworks/${artwork.id}`}
                className="group block border border-[#d8c7ab] bg-[#F7EFE1] overflow-hidden hover:bg-[#f3e7d5] transition duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
                >
                <div className="grid lg:grid-cols-[340px_1fr] gap-0">
                    {/* ================= IMAGE ================= */}
                    <div className="relative h-[340px] overflow-hidden bg-[#d9c6a7]">
                    <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"
                    />

                    {/* VERIFIED BADGE */}
                    <div className="absolute top-5 left-5 bg-[#0f0b08]/80 text-[#F0E7D3] px-4 py-2 uppercase tracking-[0.25em] text-[10px] backdrop-blur-md border border-[#3e2d20] flex items-center gap-2">
                        <ShieldCheck size={12} />
                        Verified Artifact
                    </div>

                    {/* x402 BADGE */}
                    <div className="absolute bottom-5 left-5 bg-[#B56A3E] text-white px-4 py-2 uppercase tracking-[0.25em] text-[10px] flex items-center gap-2 shadow-lg">
                        <Coins size={12} />
                        x402 Enabled
                    </div>
                    </div>

                    {/* ================= CONTENT ================= */}
                    <div className="p-10 lg:p-12 flex flex-col justify-between">
                    <div>
                        {/* TOP META */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="uppercase tracking-[0.3em] text-[10px] text-[#9B5E38]">
                            {artwork.region}
                        </div>

                        <div className="uppercase tracking-[0.25em] text-[10px] text-[#6b5748] border border-[#d8c7ab] px-3 py-1 bg-[#efe4d3] flex items-center gap-2">
                            <Fingerprint size={11} />
                            DID Bound
                        </div>

                        <div className="uppercase tracking-[0.25em] text-[10px] text-white px-3 py-1 bg-[#B56A3E]">
                            Immutable Provenance
                        </div>
                        </div>

                        {/* TITLE */}
                        <h2 className="font-serif text-5xl leading-[1] tracking-[-0.03em] mb-8 text-[#2B1D16] group-hover:text-[#9B5E38] transition">
                        {artwork.title}
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="text-[#5C4636] leading-relaxed text-lg max-w-3xl mb-10">
                        This authenticated cultural artifact is anchored through
                        decentralized identity infrastructure and blockchain-based
                        provenance verification to preserve ownership integrity across
                        generations.
                        </p>

                        {/* METADATA GRID */}
                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                        {/* BLOCKCHAIN */}
                        <div className="border border-[#d8c7ab] bg-[#efe4d3] p-5">
                            <div className="uppercase tracking-[0.25em] text-[10px] text-[#8A674F] mb-3">
                            Blockchain Anchor
                            </div>

                            <div className="font-mono text-xs break-all text-[#5C4636]">
                            {artwork.tx}
                            </div>
                        </div>

                        {/* CLASSIFICATION */}
                        <div className="border border-[#d8c7ab] bg-[#efe4d3] p-5">
                            <div className="uppercase tracking-[0.25em] text-[10px] text-[#8A674F] mb-3">
                            Registry Classification
                            </div>

                            <div className="text-[#5C4636]">
                            Cultural Preservation Artifact
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* ================= FOOTER ================= */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-t border-[#d8c7ab] pt-8">
                        {/* PRICE / ACQUISITION */}
                        <div>
                        <div className="uppercase tracking-[0.2em] text-[10px] text-[#8A674F] mb-2">
                            Acquisition Infrastructure
                        </div>

                        <div className="font-serif text-2xl text-[#2B1D16]">
                            {artwork.price}
                        </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <div className="uppercase tracking-[0.2em] text-[10px] text-[#8A674F] mb-2">
                            Registry Status
                            </div>

                            <div className="text-[#2B1D16]">
                            Verified & Active
                            </div>
                        </div>

                        <div className="flex items-center gap-3 uppercase tracking-[0.25em] text-[10px] text-[#B56A3E] group-hover:translate-x-1 transition">
                            Explore Provenance
                            <ArrowUpRight size={16} />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </Link>
            </motion.div>
            ))}
        </div>
        </section>
    </div>
  );
}
