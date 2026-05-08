import { Link } from "react-router-dom";

/**
 * ArtisanIdentityCard
 *
 * Reusable archival identity card for a registered artisan.
 * Feels closer to a museum accession record or institutional credential
 * than a social-media profile. No engagement metrics. No follower counts.
 *
 * Props:
 *   artisan  — artisan record object from mock data / API
 *   compact  — boolean; renders a narrower inline variant for ArtworkDetailPage
 *   linkable — boolean; wraps card in a Link to /artisans/:id
 */
export default function ArtisanIdentityCard({
  artisan,
  compact = false,
  linkable = false,
}) {
  if (!artisan) return null;

  const {
    id,
    displayName,
    photo,
    guild,
    craftSpecialization,
    region,
    did,
    registrationYear,
    verificationStatus,
    heritageStatement,
  } = artisan;

  const isVerified = verificationStatus === "verified";
  const shortDID = did
    ? `${did.slice(0, 22)}…${did.slice(-6)}`
    : "—";

  const cardContent = (
    <div
      className={`
        relative bg-parchment/60 dark:bg-white/5 border border-sandstone/60
        dark:border-white/10 rounded-xl overflow-hidden
        transition-all duration-300
        ${compact ? "flex gap-4 p-4" : "p-6"}
        ${linkable ? "hover:border-saffron/50 hover:shadow-lg hover:shadow-terracotta/10 cursor-pointer" : ""}
      `}
    >
      {/* Corner registration mark — archival aesthetic */}
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 text-[9px] font-mono text-warm-gray/50 tracking-widest select-none"
      >
        SC·REG·{registrationYear}
      </span>

      {/* ── Photo / Monogram ── */}
      <div className={`flex-shrink-0 ${compact ? "self-start" : "mb-5 flex items-center gap-4"}`}>
        {photo ? (
          <img
            src={photo}
            alt={displayName}
            className={`
              object-cover rounded-full border-2 border-sandstone/60
              ${compact ? "w-14 h-14" : "w-20 h-20"}
            `}
          />
        ) : (
          <div
            className={`
              flex items-center justify-center rounded-full
              bg-terracotta/10 border-2 border-terracotta/20
              text-terracotta font-serif font-bold select-none
              ${compact ? "w-14 h-14 text-xl" : "w-20 h-20 text-3xl"}
            `}
          >
            {displayName?.charAt(0) ?? "?"}
          </div>
        )}

        {/* Verification badge — inline with photo on full card */}
        {!compact && (
          <div className="flex flex-col gap-1">
            <VerificationSeal verified={isVerified} />
          </div>
        )}
      </div>

      {/* ── Main record body ── */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <h3 className={`font-serif font-bold text-deep-ink dark:text-ivory leading-tight ${compact ? "text-base" : "text-xl"}`}>
          {displayName}
        </h3>

        {/* Craft + Guild */}
        <p className={`text-terracotta font-medium mt-0.5 ${compact ? "text-xs" : "text-sm"}`}>
          {craftSpecialization}
        </p>
        <p className={`text-warm-gray ${compact ? "text-xs mt-0.5" : "text-sm mt-1"}`}>
          {guild}
        </p>

        {/* Region */}
        <div className={`flex items-center gap-1.5 text-warm-gray mt-2 ${compact ? "text-xs" : "text-sm"}`}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" strokeWidth={1.8} />
          </svg>
          <span>{region}</span>
        </div>

        {/* Divider */}
        {!compact && (
          <div className="my-4 border-t border-sandstone/40 dark:border-white/10" />
        )}

        {/* DID — shown full on detail, abbreviated on card */}
        <div className={`${compact ? "mt-2" : ""}`}>
          <span className={`block font-mono text-warm-gray/70 dark:text-white/40 ${compact ? "text-[10px]" : "text-xs"}`}>
            DID
          </span>
          <span className={`font-mono text-deep-ink/60 dark:text-white/50 break-all ${compact ? "text-[10px]" : "text-xs"}`}>
            {shortDID}
          </span>
        </div>

        {/* Heritage statement — only on full card */}
        {!compact && heritageStatement && (
          <blockquote className="mt-4 pl-3 border-l-2 border-saffron/60 italic text-sm text-warm-gray leading-relaxed">
            "{heritageStatement}"
          </blockquote>
        )}

        {/* Compact verification badge */}
        {compact && (
          <div className="mt-2">
            <VerificationSeal verified={isVerified} compact />
          </div>
        )}
      </div>
    </div>
  );

  return linkable ? (
    <Link to={`/artisans/${id}`} className="block no-underline">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}

/* ─────────────────────────────────────────────
   VerificationSeal
   Subtle institutional badge, not a flashy icon
───────────────────────────────────────────── */
function VerificationSeal({ verified, compact = false }) {
  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}
        ${
          verified
            ? "border-emerald-600/30 bg-emerald-50/60 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
            : "border-amber-500/30 bg-amber-50/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
        }
        font-medium tracking-wide
      `}
    >
      {verified ? (
        <>
          {/* Subtle checkmark seal */}
          <svg className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Verified Artisan
        </>
      ) : (
        <>
          <svg className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Verification Pending
        </>
      )}
    </div>
  );
}