export default function ArtifactRegistrationPage() {
  return (
    <div className="min-h-screen bg-[#F6EFE5] text-[#1F1A17] px-6 py-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* LEFT PANEL */}
        <div className="space-y-6">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#8B694D] mb-3">
              SkillChain Provenance
            </p>
            <h1 className="text-5xl font-serif leading-tight">
              Register a Cultural Artifact
            </h1>
          </div>

          <p className="text-lg text-[#5E5147] leading-relaxed">
            Verified artisans can register artworks with identity-backed
            provenance anchored to decentralized infrastructure.
          </p>

          <div className="border border-[#D9C8B5] bg-white rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-xl font-semibold">Verified Identity</h2>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-[#8B694D] mb-1">Artisan Name</div>
                <div className="font-medium">Ramesh Ghodke</div>
              </div>

              <div>
                <div className="text-[#8B694D] mb-1">Craft</div>
                <div className="font-medium">Bidriware</div>
              </div>

              <div>
                <div className="text-[#8B694D] mb-1">DID</div>
                <div className="font-mono text-xs break-all bg-[#F6EFE5] p-3 rounded-lg">
                  did:algo:testnet:KHU5NLEZ235YQGCIVKGFMSVAKD66HKIZSK7KF6QNE5OOU45BERY6WWNK3Y:ba7816bf8f01cfea
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#E9F7EF] text-[#1F7A4D] px-4 py-2 rounded-full text-sm font-medium">
              ✓ Verified Artisan Identity
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="border border-[#D9C8B5] bg-white rounded-2xl p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-serif mb-2">
              Artifact Registration
            </h2>
            <p className="text-[#6A5C52]">
              Upload the artwork and attach provenance metadata.
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Artwork Image
              </label>

              <div className="border-2 border-dashed border-[#D9C8B5] rounded-2xl p-10 text-center bg-[#FBF8F4]">
                <p className="text-[#6A5C52] text-sm">
                  Upload artwork image
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Traditional Bidri Vase"
                className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the artwork, process, symbolism, or history..."
                className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Materials
                </label>
                <input
                  type="text"
                  placeholder="Silver, Zinc, Copper"
                  className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Region
                </label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Workshop / Guild
              </label>
              <input
                type="text"
                placeholder="Bidar Heritage Cluster"
                className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
              />
            </div>

            <button
              type="button"
              className="w-full bg-[#B56A3E] hover:bg-[#9A5730] text-white py-4 rounded-xl text-lg font-medium transition"
            >
              Register Artifact Provenance
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
