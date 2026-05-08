import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ArtisanIdentityCard from "../components/ArtisanIdentityCard";
import artisans from "../data/artisansMockData";

export function ArtisanSearchPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return [];

    return artisans.filter((artisan) => {
      const value = query.toLowerCase();

      return (
        artisan.name.toLowerCase().includes(value) ||
        artisan.guild.toLowerCase().includes(value) ||
        artisan.specialization.toLowerCase().includes(value)
      );
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f5ecde] px-6 py-20 text-[#2d1c14]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-28 text-center">
          <p className="mb-6 text-[11px] uppercase tracking-[0.45em] text-[#b8744f]">
            SkillChain Registry
          </p>

          <h1 className="font-serif text-6xl leading-none md:text-7xl">
            Search the Registry
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-[#70584a]">
            Records are intentionally discoverable through lineage,
            guild affiliation, and verified provenance.
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#ddc7b2] bg-[#f9f2e9] p-6 shadow-[0_20px_60px_rgba(76,48,28,0.08)]">
          <div className="flex items-center gap-4">
            <Search className="text-[#b8744f]" size={24} />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query by preferred name, guild, or lineage"
              className="w-full bg-transparent text-lg outline-none placeholder:text-[#9c8373]"
            />
          </div>
        </div>

        <div className="mt-24 space-y-12">
          {filtered.map((artisan, index) => (
            <div
              key={artisan.id}
              className={index % 2 === 0 ? "md:ml-0" : "md:ml-24"}
            >
              <ArtisanIdentityCard artisan={artisan} />
            </div>
          ))}

          {query && filtered.length === 0 && (
            <div className="pt-20 text-center">
              <p className="font-serif text-4xl text-[#6f5647]">
                No archival record located
              </p>

              <p className="mt-4 text-[#8a7161]">
                Registry access requires intentional and accurate search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}