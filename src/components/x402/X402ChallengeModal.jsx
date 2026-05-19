import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import {
  X,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const peraWallet = new PeraWalletConnect({
  chainId: 416002,
});

const algodClient = new algosdk.Algodv2(
  "",
  import.meta.env.VITE_ALGOD_URL,
  ""
);

const acquireMethod = algosdk.ABIMethod.fromSignature("acquire(string)bool");
const stringAbiType = algosdk.ABIType.from("string");
const textEncoder = new TextEncoder();
const testnetExplorerBase = "https://testnet.explorer.perawallet.app/tx/";

const getChallengeNonce = (challenge) => {
  if (!challenge) return "";
  if (typeof challenge === "string") return challenge;

  return challenge.nonce || challenge.challenge || challenge.value || "";
};

const getRequiredBoxNames = (payload) =>
  payload?.required_box_names ||
  payload?.required_boxes ||
  payload?.box_names ||
  [];

const decodeBase64 = (value) =>
  Uint8Array.from(window.atob(value), (char) => char.charCodeAt(0));

const toBoxNameBytes = (boxName) => {
  if (boxName instanceof Uint8Array) return boxName;

  if (typeof boxName === "string") {
    return textEncoder.encode(boxName);
  }

  if (boxName?.encoding === "base64" && typeof boxName?.value === "string") {
    return decodeBase64(boxName.value);
  }

  if (typeof boxName?.base64 === "string") {
    return decodeBase64(boxName.base64);
  }

  if (typeof boxName?.bytes === "string") {
    return decodeBase64(boxName.bytes);
  }

  if (typeof boxName?.name === "string") {
    return textEncoder.encode(boxName.name);
  }

  throw new Error("Unsupported box name format returned by backend");
};

const toBoxReference = (boxName, appId) => ({
  appIndex: Number(appId),
  name: toBoxNameBytes(boxName),
});

const connectPeraWallet = async (selectedAccount) => {
  const existingAccounts = await peraWallet.reconnectSession();

  if (existingAccounts.length) {
    return existingAccounts[0];
  }

  const newAccounts = await peraWallet.connect(
    selectedAccount ? { selectedAccount } : undefined
  );

  return newAccounts[0];
};

const HttpStatusCard = ({ artworkTitle, price }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, duration: 0.5 }}
    className="font-mono text-xs bg-[#1C1410] border border-[#3a2a1e] rounded-sm overflow-hidden"
  >
    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#251a12] border-b border-[#3a2a1e]">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <span className="text-[#6b5040] ml-2 tracking-wider">HTTP RESPONSE</span>
    </div>

    <div className="px-4 py-3 border-b border-[#3a2a1e]">
      <span className="text-[#B56A3E]">HTTP/1.1 </span>
      <span className="text-[#e8c97a] font-bold text-sm">402 Payment Required</span>
    </div>

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

const StepBar = ({ current, steps }) => (
  <div className="flex items-center gap-0 mb-8">
    {steps.map((label, i) => (
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
        {i < steps.length - 1 && (
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

export const X402ChallengeModal = ({
  artwork,
  onClose,
  onSuccess,
  onOwnershipTransferred,
  collectorName,
  collectorEmail,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [txResult, setTxResult] = useState(null);
  const price = artwork?.price_algo ?? "1.5";
  const resolvedArtworkId = artwork?.id;
  console.log("Resolved artwork id:", resolvedArtworkId);
  console.log("Artwork object in modal:", artwork);


  useEffect(() => {
    let mounted = true;

    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (mounted && accounts.length) {
          setWalletAddress(accounts[0]);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const handleAuthorize = async () => {
    try {
      setStep(2);

      const initialResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/acquire-artwork`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artwork_id: parseInt(String(resolvedArtworkId).replace("art_", ""), 10),
            collector_name: collectorName || "Anonymous",
            collector_email: collectorEmail || "",
          }),
        }
      );

      const initialData = await initialResponse.json();
      console.log("402 RESPONSE", initialData);

      if (initialResponse.ok) {
        const resolvedTxId = initialData.tx_id || "";

        setTxResult({
          tx_id: resolvedTxId,
          provenance_event:
            initialData.provenance_event || "ownership_transfer",
          explorer_url:
            initialData.explorer_url ||
            `${testnetExplorerBase}${resolvedTxId}`,
          new_owner:
            initialData.new_owner ||
            walletAddress ||
            collectorEmail ||
            "Anonymous",
          network: initialData.network || "Algorand Testnet",
        });

        if (onOwnershipTransferred) {
          await onOwnershipTransferred();
        }

        setStep(3);
        return;
      }

      if (initialResponse.status !== 402) {
        throw new Error(initialData?.error || "Acquisition failed");
      }

      const requirements = initialData?.payment_requirements || {};

      const challengeNonce = getChallengeNonce(
        requirements.challenge_nonce
      );
      const amount = BigInt(requirements.amount ?? 0);
      const appId = Number(
        requirements.app_id ||
        import.meta.env.VITE_ARTWORK_MARKETPLACE_APP_ID
      );
      const receiver = requirements.receiver;
      const requiredBoxes = requirements.boxes || [];

      if (!challengeNonce) {
        throw new Error("Missing x402 challenge nonce");
      }

      if (!amount) {
        throw new Error("Missing Testnet payment amount");
      }

      if (!appId) {
        throw new Error("Missing marketplace app id");
      }

      if (!receiver) {
        throw new Error("Missing treasury receiver address");
      }

      if (!import.meta.env.VITE_ALGOD_URL) {
        throw new Error("Missing VITE_ALGOD_URL");
      }

      const connectedAddress = await connectPeraWallet(walletAddress);
      setWalletAddress(connectedAddress);

      const suggestedParams = await algodClient.getTransactionParams().do();
      const note = textEncoder.encode(challengeNonce);
      const artworkIdArg = String(resolvedArtworkId);

      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: connectedAddress,
        receiver,
        amount,
        note,
        suggestedParams,
      });

      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: connectedAddress,
        appIndex: appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          acquireMethod.getSelector(),
          stringAbiType.encode(artworkIdArg),
        ],
        foreignApps: [appId],
        boxes: [
          {
            appIndex: appId,
            name: new TextEncoder().encode("owner:art_001"),
          },
          {
            appIndex: appId,
            name: new TextEncoder().encode("price:art_001"),
          },
        ],
          suggestedParams,
        });

      algosdk.assignGroupID([paymentTxn, appCallTxn]);

      const signedGroup = await peraWallet.signTransaction([
        [
          { txn: paymentTxn },
          { txn: appCallTxn },
        ],
      ]);
      const appCallTxId = appCallTxn.txID();

      await algodClient.sendRawTransaction(signedGroup).do();
      console.log("Grouped transaction submitted:", appCallTxId);
      console.log("RAW TRANSACTION SUBMITTED");
      console.log("APP CALL TX ID:", appCallTxId);

      

      await algosdk.waitForConfirmation(algodClient, appCallTxId, 10);
      console.log("Transaction confirmed:", appCallTxId);

      const verificationResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/acquire-artwork`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artwork_id: parseInt(String(resolvedArtworkId).replace("art_", ""), 10),
            collector_name: collectorName || "Anonymous",
            collector_email: collectorEmail || "",
            tx_id: appCallTxId,
            wallet_address: connectedAddress,
            challenge: challengeNonce,
            challenge_nonce: challengeNonce,
          }),
        }
      );

      const verificationData = await verificationResponse.json();

      if (!verificationResponse.ok) {
        throw new Error(
          verificationData?.error || "Backend could not verify grouped transaction"
        );
      }

      setTxResult({
        tx_id: verificationData.tx_id || appCallTxId,
        provenance_event:
          verificationData.provenance_event || "ownership_transfer",
        explorer_url:
          verificationData.explorer_url ||
          `${testnetExplorerBase}${verificationData.tx_id || appCallTxId}`,
        new_owner:
          verificationData.new_owner ||
          connectedAddress ||
          collectorEmail ||
          "Anonymous",
        network: verificationData.network || "Algorand Testnet",
      });

      if (onOwnershipTransferred) {
        await onOwnershipTransferred();
      }

      setStep(3);
    } catch (err) {
      console.error("x402 acquisition failed", err);
      setStep(1);
      alert(
        err?.message ||
          "Could not complete ownership transfer."
      );
    }
  };

  const handleSuccess = () => {
    onSuccess?.(txResult);
    onClose();
  };

  const stepLabels = [
    t("x402_step_challenge"),
    t("x402_step_authorize"),
    t("x402_step_processing"),
    t("ownership_transferred"),
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#1a0f08]/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
      >
        <div
          className="pointer-events-auto my-auto w-full max-w-xl max-h-[calc(100vh-2rem)] bg-[#F7F0E1] dark:bg-[#17120E] border border-[#d8c6aa] dark:border-[#3A2C21] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#e2d4bc] dark:border-[#3A2C21]">
            <div>
              <div className="flex items-center gap-2 uppercase tracking-[0.28em] text-[9px] text-[#9A5A38] mb-1.5">
                <Zap size={10} />
                x402 Protocol
              </div>
              <h2 className="font-serif text-2xl text-[#2B1D16] dark:text-[#F5ECDE]">Artwork Acquisition</h2>
            </div>
            {step < 2 && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full border border-[#d8c6aa] dark:border-[#3A2C21] flex items-center justify-center text-[#9A5A38] hover:bg-[#e8dcc8] dark:hover:bg-[#211913] transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="px-7 py-6 overflow-y-auto max-h-[calc(100vh-9rem)]">
            <StepBar current={step} steps={stepLabels} />

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
                    <p className="text-[#5C4636] dark:text-[#D7C6B4] leading-relaxed mb-1">
                      This artwork is gated behind an{" "}
                      <span className="font-mono text-sm text-[#B56A3E] bg-[#f0e4d0] px-1">HTTP 402</span>{" "}
                      payment challenge. Ownership transfers natively through payment.
                    </p>
                  </div>

                  <HttpStatusCard
                    artworkTitle={artwork?.title ?? "Artwork"}
                    price={`${price} ALGO`}
                  />

                  <div className="mt-5 p-4 border border-[#d8c6aa] dark:border-[#3A2C21] bg-[#fffaf1] dark:bg-[#1E1712] flex items-center justify-between gap-4">
                    <div>
                      <div className="uppercase tracking-[0.2em] text-xs text-[#9A5A38] mb-1">
                        Acquisition price
                      </div>
                      <div className="font-serif text-2xl text-[#2B1D16] dark:text-[#F5ECDE]">{price} ALGO</div>
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
                    {t("x402_step_challenge")}
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="authorize"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[#5C4636] dark:text-[#D7C6B4] leading-relaxed mb-5">
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
                          className="flex-1 px-4 py-3 border border-[#cfb99d] dark:border-[#3A2C21] bg-[#fffaf1] dark:bg-[#1E1712] outline-none focus:border-[#B56A3E] transition font-mono text-sm break-all dark:text-[#F5ECDE]"
                          placeholder="Pera Wallet address"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-4 border border-[#d8c6aa] dark:border-[#3A2C21] bg-[#fffaf1] dark:bg-[#1E1712] space-y-2 text-sm">
                      {[
                        ["Collector", collectorName || "Anonymous"],
                        ["Network", "Algorand Testnet"],
                        ["Amount", `${price} ALGO`],
                        ["Protocol", "x402 / HTTP 402 Payment Required"],
                        ["Provenance event", "ownership_transfer"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-4">
                          <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">{k}</span>
                          <span className="text-[#2B1D16] dark:text-[#F5ECDE] font-medium text-xs break-all text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAuthorize}
                      className="flex-1 bg-[#B56A3E] hover:bg-[#9f5b34] text-white py-5 transition duration-300"
                    >
                      {t("authorize_payment")}
                    </button>
                  </div>
                </motion.div>
              )}

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

                  <div className="font-serif text-2xl mb-3 text-[#2B1D16] dark:text-[#F5ECDE]">Anchoring on Algorand</div>

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
                        className="flex items-center gap-3 text-sm text-[#5C4636] dark:text-[#D7C6B4]"
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
                      {t("ownership_transferred")}
                    </div>
                    <h3 className="font-serif text-3xl text-[#2B1D16] dark:text-[#F5ECDE]">
                      You now own this artwork
                    </h3>
                    <p className="text-[#5C4636] dark:text-[#D7C6B4] mt-2 leading-relaxed">
                      Settlement is recorded as a permanent provenance event. The ownership
                      chain has been updated on Algorand.
                    </p>
                  </div>

                  {txResult?.tx_id && (
                    <div className="p-4 border border-emerald-700/20 bg-emerald-700/5 space-y-3 text-sm mb-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">{t("transaction_hash")}</span>
                        <div className="flex items-center font-mono text-xs text-[#2B1D16] dark:text-[#F5ECDE] break-all text-right">
                          {txResult.tx_id}
                          <InlineCopy text={txResult.tx_id} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">Event</span>
                        <span className="text-emerald-700 font-medium text-xs">ownership_transfer ✓</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#9A5A38] uppercase tracking-[0.15em] text-xs">Provenance</span>
                        <span className="text-emerald-700 font-medium text-xs">Updated ✓</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {txResult?.tx_id && (
                      <a
                        href={txResult?.explorer_url}
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
