import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ArtisanIdentityCard from "../components/ArtisanIdentityCard";
import { ARTISANS } from "../data/artisansMockData";

/**
 * ArtisanSearchPage  —  /artisans/search
 *
 * Intentional-search-only. No open directory, no trending, no feed.
 * Artisans are discoverable only via explicit query.
 * Feels like a cultural registry search interface, not a marketplace.
 */
export function ArtisanSearchPage() {
  const [query, setQuery] = useState("");
  const [craftFilter, setCraftFilter] = useState("");
  const [guildFilter, setGuildFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Derive unique filter options from mock data
  const craftOptions = useMemo(
    () => [...new Set(ARTISANS.map((a) => a.craftSpecialization))].sort(),
    []
  );
  const guildOptions = useMemo(
    () => [...new Set(ARTISANS.map((a) => a.guild))].sort(),
    []
  );

  const results = useMemo(() => {
    if (!hasSearched) return [];
    const q = query.trim().toLowerCase();
    return ARTISANS.filter((a) => {
      const nameMatch = q ? a.displayName.toLowerCase().includes(q) : true;
      const craftMatch = craftFilter ? a.craftSpecialization === craftFilter : true;
      const guildMatch = guildFilter ? a.guild === guildFilter : true;
      return nameMatch && craftMatch && guildMatch;
    });
  }, [query, craftFilter, guildFilter, hasSearched]);

  function handleSearch(e) {
    e.preventDefault();
    setHasSearched(true);
  }

  function handleReset() {
    setQuery("");
    setCraftFilter("");
    setGuildFilter("");
    setHasSearched(false);
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-indigo-deep">
      {/* ── Page header ── */}
      <div className="border-b border-sandstone/30 dark:border-white/10 bg-parchment/40 dark:bg-white/[0.03]">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-terracotta transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
            </svg>
            Return
          </Link>

          <div className="motif-border pb-4 mb-2">
            <p className="text-xs font-mono tracking-[0.2em] text-terracotta uppercase mb-3">
              SkillChain Registry
            </p>
            <h1 className="text-3xl font-serif font-bold text-deep-ink dark:text-ivory">
              Artisan Search
            </h1>
          </div>
          <p className="mt-5 text-warm-gray text-sm leading-relaxed max-w-xl">
            Search the registry by artisan name, guild affiliation, or craft
            specialization. Records are discoverable only through direct
            intentional query.
          </p>
        </div>
      </div>

      {/* ── Search form ── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSearch} className="heritage-card mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {/* Name search */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-mono tracking-widest text-warm-gray uppercase mb-1.5">
                Artisan Name
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter preferred name or partial name…"
                className="text-field"
              />
            </div>

            {/* Craft filter */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono tracking-widest text-warm-gray uppercase mb-1.5">
                Craft Specialization
              </label>
              <select
                value={craftFilter}
                onChange={(e) => setCraftFilter(e.target.value)}
                className="text-field appearance-none"
              >
                <option value="">All crafts</option>
                {craftOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Guild filter */}
            <div>
              <label className="block text-xs font-mono tracking-widest text-warm-gray uppercase mb-1.5">
                Guild / Collective
              </label>
              <select
                value={guildFilter}
                onChange={(e) => setGuildFilter(e.target.value)}
                className="text-field appearance-none"
              >
                <option value="">All guilds</option>
                {guildOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
              Search Registry
            </button>
            {hasSearched && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-warm-gray hover:text-terracotta transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* ── Results ── */}
        {!hasSearched && (
          <div className="text-center py-16 text-warm-gray/60">
            <svg className="w-10 h-10 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                d="M8 16l-4-4m0 0l4-4m-4 4h16M16 8l4 4m0 0l-4 4" />
            </svg>
            <p className="text-sm font-serif italic">
              Enter a query to search the artisan registry.
            </p>
          </div>
        )}

        {hasSearched && results.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif text-deep-ink/50 dark:text-white/30 text-lg italic">
              No records found.
            </p>
            <p className="text-sm text-warm-gray mt-2">
              Try a different name, craft, or guild.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="text-xs font-mono tracking-widest text-warm-gray uppercase mb-5">
              {results.length} record{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex flex-col gap-4">
              {results.map((artisan) => (
                <ArtisanIdentityCard
                  key={artisan.id}
                  artisan={artisan}
                  linkable
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}