import React from "react";
import { motion } from "framer-motion";
import {
  Fingerprint,
  ShieldCheck,
  ArrowRight,
  Wallet,
  ExternalLink,
  Clock,
  Sparkles,
  User,
  CheckCircle2,
} from "lucide-react";

// ─── Event type config ────────────────────────────────────────────────────────
const EVENT_CONFIG = {
  creation: {
    icon: Sparkles,
    label: "Artwork Created",
    color: "#B56A3E",
    bg: "bg-[#f5ece0]",
    border: "border-[#d4a07a]",
    dot: "bg-[#B56A3E]",
  },
  certification: {
    icon: ShieldCheck,
    label: "Certified on Algorand",
    color: "#2563eb",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  ownership_transfer: {
    icon: ArrowRight,
    label: "Ownership Transferred",
    color: "#059669",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-600",
  },
  acquisition: {
    icon: Wallet,
    label: "Acquired",
    color: "#059669",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-600",
  },
  verification: {
    icon: CheckCircle2,
    label: "Verified",
    color: "#7c3aed",
    bg: "bg-purple-50",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
};

const resolveConfig = (eventType) => {
  const key = Object.keys(EVENT_CONFIG).find((k) =>
    (eventType || "").toLowerCase().includes(k)
  );
  return EVENT_CONFIG[key] || EVENT_CONFIG.creation;
};

// ─── Format date nicely ───────────────────────────────────────────────────────
const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const shorten = (v, n = 12) =>
  v && v.length > n * 2 + 3 ? `${v.slice(0, n)}…${v.slice(-6)}` : v;

// ─── Single event node ────────────────────────────────────────────────────────
const EventNode = ({ event, index, isLast }) => {
  const cfg = resolveConfig(
    event.provenance_event_type || event.event_type || ""
  );
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="flex gap-4"
    >
      {/* ── Timeline spine ── */}
      <div className="flex flex-col items-center shrink-0">
        {/* Icon circle */}
        <div
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-sm ${cfg.bg} ${cfg.border}`}
        >
          <Icon size={15} style={{ color: cfg.color }} />
        </div>

        {/* Connector line */}
        {!isLast && (
          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-[#d8c6aa] to-transparent min-h-[28px]" />
        )}
      </div>

      {/* ── Event card ── */}
      <div className={`flex-1 min-w-0 mb-5 p-4 border ${cfg.border} ${cfg.bg} transition-all`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="uppercase tracking-[0.18em] text-[9px] font-semibold"
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </span>

              {/* Most recent badge */}
              {index === 0 && (
                <span className="px-1.5 py-0.5 bg-[#2B1D16] text-[#F7F0E1] text-[8px] uppercase tracking-wider">
                  Latest
                </span>
              )}
            </div>

            {/* Actor / owner */}
            {(event.new_owner || event.actor || event.collector_name) && (
              <div className="flex items-center gap-1.5 text-sm text-[#2B1D16] font-medium mb-2">
                <User size={11} className="text-[#9A5A38]" />
                {event.new_owner || event.actor || event.collector_name}
              </div>
            )}

            {/* Transaction hash */}
            {event.tx_id && (
              <div className="flex items-center gap-1.5 font-mono text-xs text-[#7a6555] min-w-0">
                <span className="text-[#9A5A38] uppercase tracking-wider text-[9px]">
                  TX
                </span>
                <span className="break-all">{event.tx_id}</span>
                <a
                  href={`https://testnet.explorer.perawallet.app/tx/${event.tx_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B56A3E] hover:text-[#9f5730] transition"
                >
                  <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>

          {/* Timestamp */}
          {(event.created_at || event.timestamp) && (
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-[#9A5A38]">
                <Clock size={10} />
                <span className="text-[10px]">
                  {formatDate(event.created_at || event.timestamp)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * ProvenanceTimeline
 *
 * Props:
 *   events   - array of provenance event objects from the API
 *   artisan  - { name, did } for the creation node
 *   artwork  - { title, tx_id, created_at } for the anchor node
 */
export const ProvenanceTimeline = ({ events = [], artisan, artwork }) => {
  // Build a canonical sorted list: API events (newest first) + creation anchor at end
  const sorted = [...events].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  // Inject synthetic creation event if not present
  const hasCreation = sorted.some((e) =>
    (e.provenance_event_type || e.event_type || "").toLowerCase().includes("creation")
  );

  const allEvents = [
    ...sorted,
    ...(!hasCreation && artwork
      ? [
          {
            id: "__creation__",
            provenance_event_type: "creation",
            actor: artisan?.name || "Verified Artisan",
            artisan_did: artisan?.did,
            tx_id: artwork?.tx_id,
            created_at: artwork?.created_at,
          },
        ]
      : []),
  ];

  if (allEvents.length === 0) {
    return (
      <div className="py-8 text-center text-[#9A5A38] border border-dashed border-[#d8c6aa] dark:border-[#3A2C21] bg-[#fffaf1] dark:bg-[#1E1712]">
        <Fingerprint size={24} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No provenance events recorded yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header stat */}
      <div className="flex items-center gap-5 mb-6 pb-4 border-b border-[#e2d4bc] dark:border-[#3A2C21]">
        <div className="text-center">
          <div className="font-serif text-3xl text-[#2B1D16] dark:text-[#F5ECDE]">{allEvents.length}</div>
          <div className="uppercase tracking-[0.18em] text-[9px] text-[#9A5A38] mt-0.5">
            Events
          </div>
        </div>
        <div className="h-8 w-px bg-[#d8c6aa] dark:bg-[#3A2C21]" />
        <div className="text-center">
          <div className="font-serif text-3xl text-[#2B1D16] dark:text-[#F5ECDE]">
            {allEvents.filter((e) =>
              (e.provenance_event_type || e.event_type || "")
                .toLowerCase()
                .includes("ownership")
            ).length}
          </div>
          <div className="uppercase tracking-[0.18em] text-[9px] text-[#9A5A38] mt-0.5">
            Transfers
          </div>
        </div>
        <div className="h-8 w-px bg-[#d8c6aa] dark:bg-[#3A2C21]" />
        <div className="flex-1 text-right">
          <div className="uppercase tracking-[0.2em] text-[9px] text-[#9A5A38] mb-1">
            Chain
          </div>
          <div className="font-mono text-xs text-[#B56A3E]">Algorand Testnet</div>
        </div>
      </div>

      {/* Event nodes */}
      <div>
        {allEvents.map((event, i) => (
          <EventNode
            key={event.id || i}
            event={event}
            index={i}
            isLast={i === allEvents.length - 1}
          />
        ))}
      </div>

      {/* Creation anchor footer */}
      <div className="mt-2 px-4 py-3 bg-[#1C1410] border border-[#3a2a1e] flex items-center gap-3">
        <Fingerprint size={14} className="text-[#B56A3E] shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#6b5040]">
            Provenance origin ·{" "}
          </span>
          <span className="font-mono text-xs text-[#c8a97a] break-all">
            {artisan?.did || "DID not resolved"}
          </span>
        </div>
        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
      </div>
    </div>
  );
};
