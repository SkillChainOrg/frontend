import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

// ─── HTTP 402 status card ────────────────────────────────────────────────────
const HttpStatusCard = ({ artworkTitle, price }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, duration: 0.5 }}
    className="font-mono text-xs bg-[#1C1410] border border-[#3a2a1e] rounded-sm overflow-hidden"
  >
    {/* Terminal header */}
    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#251a12] border-b border-[#3a2a1e]">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <span className="text-[#6b5040] ml-2 tracking-wider">HTTP RESPONSE</span>
    </div>

    {/* Status line */}
    <div className="px-4 py-3 border-b border-[#3a2a1e]">
      <span className="text-[#B56A3E]">HTTP/1.1 </span>
      <span className="text-[#e8c97a] font-bold text-sm">402 Payment Required</span>
    </div>

    {/* Headers */}
    <div className="px-4 py-3 space-y-1 border-b border-[#3a2a1e]">
      {[
        ["Content-Type", "application/json"],
        ["X-Payment-Required", "true"],
        ["X-Price-ALGO", price],
        ["X-Asset-ID", "SkillChain/Artwork"],
        ["X-Payment-Network", "Algorand Testnet"],
      ].map(([key, val]) => (
        <div key={key} className="flex gap-2">
          <span className="text-[#7a9fbd]">{key}:</span>
          <span className="text-[#c8a97a]">{val}</span>
        </div>
      ))}
    </div>

    {/* Body */}
    <div className="px-4 py-3 text-[#8a7060]">
      <span className="text-[#6b5040]">{"{ "}</span>
      <div className="pl-4 space-y-0.5">
        <div>
          <span className="text-[#9fbd7a]">"message"</span>
          <span className="text-[#6b5040]">: </span>
          <span className="text-[#c8a97a]">"{artworkTitle} requires payment to acquire ownership"</span>
          <span className="text-[#6b5040]">,</span>
        </div>
        <div>
          <span className="text-[#9fbd7a]">"protocol"</span>
          <span className="text-[#6b5040]">: </span>
          <span className="text-[#c8a97a]">"x402"</span>
          <span className="text-[#6b5040]">,</span>
        </div>
        <div>
          <span className="text-[#9fbd7a]">"provenance_event"</span>
          <span className="text-[#6b5040]">: </span>
          <span className="text-[#c8a97a]">"ownership_transfer_pending"</span>
        </div>
      </div>
      <span className="text-[#6b5040]">{" }"}</span>
    </div>
  </motion.div>
);

// ─── Copy helper ─────────────────────────────────────────────────────────────
const InlineCopy = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-2 text-[#9A5A38] hover:text-[#B56A3E] transition">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
};

// ─── Step indicators ──────────────────────────────────────────────────────────
const STEPS = ["402 Challenge", "Authorize", "Processing", "Ownership Transferred"];

const StepBar = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center">
          <div
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium transition-all duration-300 ${
              i < current
                ? "bg-emerald-700 border-emerald-700 text-white"
                : i === current
                ? "bg-[#B56A3E] border-[#B56A3E] text-white"
                : "bg-transparent border-[#c9b594] text-[#9A5A38]"
            }`}
          >
            {i < current ? <Check size={12} /> : i + 1}
          </div>
          <span
            className={`mt-1.5 text-[9px] uppercase tracking-[0.18em] whitespace-nowrap ${
              i === current ? "text-[#B56A3E]" : "text-[#a08870]"
            }`}
          >
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`flex-1 h-[1px] mx-1 mb-5 transition-all duration-500 ${
              i < current ? "bg-emerald-700" : "bg-[#d0baa0]"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Main modal ───────────────────────────────────────────────────────────────
export const X402ChallengeModal = ({
  artwork,
  onClose,
  onSuccess,
  collectorName,
  collectorEmail,
}) => {
  const [step, setStep] = useState(0); // 0=challenge, 1=authorize, 2=processing, 3=success
  const [walletAddress, setWalletAddress] = useState("");
  const [txResult, setTxResult] = useState(null);
  const price = artwork?.price_algo ?? "1.5";

  // Auto-advance from processing after simulated delay
  // In production: replace with actual api.acquireArtwork call
  const handleAuthorize = async () => {
    if (!walletAddress.trim() && !collectorEmail) return;
    setStep(2); // processing

    try {
      // Replace this block with your real x402 acquire endpoint call:
      // const { data } = await api.acquireArtwork({
      //   artwork_id: artwork.id,
      //   collector_name: collectorName,
      //   collector_email: collectorEmail,
      //   wallet_address: walletAddress,
      // });
      // setTxResult(data);

      // Simulated delay — remove when wiring real API
      await new Promise((r) => setTimeout(r, 2200));
      setTxResult({
        tx_id: "SIMULATED_TX_" + Math.random().toString(36).slice(2, 10).toUpperCase(),
        new_owner: walletAddress || collectorEmail,
        provenance_event: "ownership_transfer",
      });
      setStep(3);
    } catch {
      setStep(1); // fall back to authorize on error
    }
  };

  const handleSuccess = () => {
    onSuccess?.(txResult);
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#1a0f08]/70 backdrop-blur-sm"
      />

      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-xl bg-[#F7F0E1] border border-[#d8c6aa] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#e2d4bc]">
            <div>
              <div className="flex items-center gap-2 uppercase tracking-[0.28em] text-[9px] text-[#9A5A38] mb-1.5">
                <Zap size={10} />
                x402 Protocol
              </div>
              <h2 className="font-serif text-2xl text-[#2B1D16]">Artwork Acquisition</h2>
            </div>
            {step < 2 && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full border border-[#d8c6aa] flex items-center justify-center text-[#9A5A38] hover:bg-[#e8dcc8] transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="px-7 py-6">
            <StepBar current={step} />

            {/* ── STEP 0: 402 challenge ── */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="challenge"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-5">
                    <p className="text-[#5C4636] leading-relaxed mb-1">
                      This artwork is gated behind an{" "}
                      <span className="font-mono text-sm text-[#B56A3E] bg-[#f0e4d0] px-1">HTTP 402</span>{" "}
                      payment challenge. Ownership transfers natively through payment.
                    </p>
                  </div>

                  <HttpStatusCard
                    artworkTitle={artwork?.title ?? "Artwork"}
                    price={`${price} ALGO`}
                  />

                  <div className="mt-5 p-4 border border-[#d8c6aa] bg-[#fffaf1] flex items-center justify-between">
                    <div>
                      <div className="uppercase tracking-[0.2em] text-xs text-[#9A5A38] mb-1">
                        Acquisition price
                      </div>
                      <div className="font-serif text-2xl text-[#2B1D16]">{price} ALGO</div>
                    </div>
                    <div className="flex items-center gap-2 text-[#9A5A38]">
                      <Lock size={18} />
                      <span className="text-xs uppercase tracking-wider">Ownership locked</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="mt-5 w-full bg-[#B56A3E] hover:bg-[#9f5730] text-white py-4 tracking-wide transition duration-300 flex items-center justify-center gap-2"
                  >
                    Respond to Challenge
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* ── STEP 1: authorize ── */}
              {step === 1 && (
                <motion.div
                  key="authorize"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[#5C4636] leading-relaxed mb-5">
                    Authorize the payment to satisfy the 402 challenge. Settlement
                    confirmation becomes a permanent provenance event on Algorand.
                  </p>

                  <div className="space-y-4 mb-5">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-2">
                        Wallet Address (Algorand)
                      </label>
                      <div className="flex gap-2">
                        <Wallet size={16} className="shrink-0 mt-[14px] text-[#9A5A38]" />
                        <input
                          className="flex-1 px-4 py-3 border border-[#cfb99d] bg-[#fffaf1] outline-none focus:border-[#B56A3E] transition font-mono text-sm"
                          placeholder="ALGO wallet address or leave blank for demo"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-4 border border-[#d8c6aa] bg-[#fffaf1] space-y-2 text-sm">
                      {[
                        ["Collector", collectorName || "Anonymous"],
                        ["Network", "Algorand Testnet"],
                        ["Amount", `${price} ALGO`],
                        ["Protocol", "x402 / HTTP 402 Payment Required"],
                        ["Provenance event", "ownership_transfer"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">{k}</span>
                          <span className="text-[#2B1D16] font-medium text-xs">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          setStep(2);

                          // simulate network/payment processing
                          await new Promise((resolve) =>
                            setTimeout(resolve, 2200)
                          );

                          setStep(4);

                          // simulate provenance update
                          if (onOwnershipTransferred) {
                            await onOwnershipTransferred();
                          }

                          // auto close after success
                          setTimeout(() => {
                            onClose();
                          }, 2500);

                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="flex-1 bg-[#B56A3E] hover:bg-[#9f5b34] text-white py-5 transition duration-300"
                    >
                      Authorize Payment
                  </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: processing ── */}
              {step === 2 && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="py-8 text-center"
                >
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#B56A3E]"
                    />
                    <div className="absolute inset-2 rounded-full border border-[#d8c6aa] flex items-center justify-center">
                      <Zap size={20} className="text-[#B56A3E]" />
                    </div>
                  </div>

                  <div className="font-serif text-2xl mb-3">Anchoring on Algorand</div>

                  <div className="space-y-2 mt-6 text-left max-w-xs mx-auto">
                    {[
                      { label: "Submitting payment proof", delay: 0 },
                      { label: "Broadcasting to Algorand network", delay: 0.6 },
                      { label: "Writing provenance event", delay: 1.2 },
                    ].map(({ label, delay }) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay, duration: 0.4 }}
                        className="flex items-center gap-3 text-sm text-[#5C4636]"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ delay, duration: 0.4 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#B56A3E]"
                        />
                        {label}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: success ── */}
              {step === 3 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="flex justify-center mb-5"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-emerald-700 bg-emerald-700/8 flex items-center justify-center">
                      <Unlock size={30} className="text-emerald-700" />
                    </div>
                  </motion.div>

                  <div className="text-center mb-6">
                    <div className="uppercase tracking-[0.28em] text-xs text-emerald-700 mb-2">
                      Ownership Transferred
                    </div>
                    <h3 className="font-serif text-3xl text-[#2B1D16]">
                      You now own this artwork
                    </h3>
                    <p className="text-[#5C4636] mt-2 leading-relaxed">
                      Settlement is recorded as a permanent provenance event. The ownership
                      chain has been updated on Algorand.
                    </p>
                  </div>

                  {txResult?.tx_id && (
                    <div className="p-4 border border-emerald-700/20 bg-emerald-700/5 space-y-3 text-sm mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">Transaction</span>
                        <div className="flex items-center font-mono text-xs text-[#2B1D16]">
                          {txResult.tx_id.slice(0, 18)}...
                          <InlineCopy text={txResult.tx_id} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">Event</span>
                        <span className="text-emerald-700 font-medium text-xs">ownership_transfer ✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">Provenance</span>
                        <span className="text-emerald-700 font-medium text-xs">Updated ✓</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {txResult?.tx_id && (
                      <a
                        href={`https://testnet.explorer.perawallet.app/tx/${txResult.tx_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3.5 border border-[#d8c6aa] text-[#B56A3E] hover:bg-[#ece4d4] transition text-sm"
                      >
                        View on chain <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={handleSuccess}
                      className="flex-1 bg-[#2B1D16] hover:bg-black text-[#F7F0E1] py-3.5 tracking-wide transition duration-300 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      View Provenance
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};