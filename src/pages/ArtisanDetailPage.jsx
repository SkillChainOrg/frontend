import { useParams, Link } from "react-router-dom";
import ArtisanIdentityCard from "../components/ArtisanIdentityCard";
import { ARTISANS_BY_ID, ARTWORKS_WITH_ARTISAN } from "../data/artisansMockData";

/**
 * ArtisanDetailPage  —  /artisans/:artisanId
 *
 * Archival / institutional feel. Artworks are primary.
 * No social metrics. No follower counts. No engagement stats.
 */
export function ArtisanDetailPage() {
  const { artisanId } = useParams();
  const artisan = ARTISANS_BY_ID[artisanId];

  if (!artisan) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-indigo-deep flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-deep-ink/40 dark:text-white/30 mb-3">
            Record not found
          </p>
          <Link to="/artisans/search" className="text-sm text-terracotta hover:underline">
            Return to registry search
          </Link>
        </div>
      </div>
    );
  }

  const linkedArtworks = ARTWORKS_WITH_ARTISAN.filter(
    (aw) => aw.artisanId === artisan.id
  );

  const isVerified = artisan.verificationStatus === "verified";

  return (
    <div className="min-h-screen bg-ivory dark:bg-indigo-deep">
      {/* ── Breadcrumb / nav ── */}
      <div className="border-b border-sandstone/30 dark:border-white/10 bg-parchment/40 dark:bg-white/[0.03]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-warm-gray">
          <Link to="/" className="hover:text-terracotta transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <Link to="/artisans/search" className="hover:text-terracotta transition-colors">Registry</Link>
          <span className="opacity-40">/</span>
          <span className="text-deep-ink dark:text-ivory">{artisan.displayName}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Identity card (full) ── */}
          <div className="lg:col-span-1">
            <ArtisanIdentityCard artisan={artisan} />

            {/* Accession metadata block */}
            <div className="mt-4 p-4 bg-parchment/40 dark:bg-white/[0.03] border border-sandstone/30 dark:border-white/10 rounded-xl">
              <p className="text-xs font-mono tracking-widest text-warm-gray uppercase mb-3">
                Registry Metadata
              </p>
              <dl className="space-y-2 text-sm">
                <MetaRow label="Record ID" value={artisan.id} mono />
                <MetaRow label="Registered" value={artisan.registrationYear} />
                <MetaRow
                  label="Status"
                  value={isVerified ? "Verified" : "Pending Review"}
                  valueClass={isVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}
                />
                <MetaRow label="Works on record" value={artisan.artworkIds.length} />
              </dl>
            </div>

            <div className="mt-4 p-4 bg-parchment/40 dark:bg-white/[0.03] border border-sandstone/30 dark:border-white/10 rounded-xl">
              <p className="text-xs font-mono tracking-widest text-warm-gray uppercase mb-2">
                Decentralised Identifier
              </p>
              <p className="font-mono text-[10px] text-deep-ink/50 dark:text-white/40 break-all leading-relaxed">
                {artisan.did}
              </p>
            </div>
          </div>

          {/* ── Right: Provenance & works ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Guild affiliation */}
            <section>
              <SectionLabel>Guild Affiliation</SectionLabel>
              <div className="heritage-card">
                <p className="font-serif text-lg font-semibold text-deep-ink dark:text-ivory">
                  {artisan.guild}
                </p>
                <p className="text-sm text-warm-gray mt-1">{artisan.craftSpecialization} · {artisan.region}</p>
              </div>
            </section>

            {/* Verified works — artworks are primary */}
            <section>
              <SectionLabel>
                Verified Works
                {isVerified && (
                  <span className="ml-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 tracking-widest">
                    ✦ ON-CHAIN
                  </span>
                )}
              </SectionLabel>

              {linkedArtworks.length === 0 ? (
                <p className="text-sm text-warm-gray italic">
                  No artworks indexed in this registry yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {linkedArtworks.map((aw) => (
                    <Link
                      key={aw.id}
                      to={`/artworks/${aw.id}`}
                      className="block heritage-card group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-semibold text-deep-ink dark:text-ivory group-hover:text-terracotta transition-colors">
                            {aw.title}
                          </h4>
                          <p className="text-xs text-warm-gray mt-1">{aw.medium} · {aw.year}</p>
                          {aw.provenance && (
                            <p className="text-xs text-warm-gray/70 mt-1 italic">{aw.provenance}</p>
                          )}
                        </div>
                        <svg
                          className="w-4 h-4 text-warm-gray/40 group-hover:text-terracotta transition-colors flex-shrink-0 mt-1"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Heritage statement if present */}
            {artisan.heritageStatement && (
              <section>
                <SectionLabel>Heritage Statement</SectionLabel>
                <blockquote className="heritage-card border-l-4 border-l-saffron/60 italic text-warm-gray leading-relaxed text-sm">
                  "{artisan.heritageStatement}"
                </blockquote>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Internal helpers ── */

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-mono tracking-[0.18em] text-terracotta uppercase mb-3 flex items-center gap-2">
      {children}
    </p>
  );
}

function MetaRow({ label, value, mono = false, valueClass = "" }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <dt className="text-warm-gray/70 flex-shrink-0">{label}</dt>
      <dd className={`text-right text-deep-ink dark:text-ivory ${mono ? "font-mono text-xs" : ""} ${valueClass}`}>
        {value}
      </dd>
    </div>
  );
}