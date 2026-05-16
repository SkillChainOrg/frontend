import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProvenanceTimeline } from "../components/provenance/ProvenanceTimeline";
import { X402ChallengeModal } from "../components/x402/X402ChallengeModal";
import {
  ShieldCheck,
  Fingerprint,
  ScrollText,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

import * as api from "../api/api";
import { useToast } from "../context/ToastContext";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

export const ArtworkDetailPage = () => {
  const { artworkId } = useParams();

  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [artwork, setArtwork] = useState(null);
  const [provenance, setProvenance] = useState([]);
  const [ownership, setOwnership] = useState(null);

  const [collector, setCollector] = useState({
    name: "",
    email: "",
  });



  const [showArtisan, setShowArtisan] = useState(false);
  const [showAcquireModal, setShowAcquireModal] = useState(false);

  const id = artworkId;

  useEffect(() => {
  let mounted = true;

  const run = async () => {
    try {
      setLoading(true);

      const { data } = await api.getArtwork(id);

      console.log("BACKEND RESPONSE", data);
      console.log("ARTWORK OBJECT", data.artwork);

      if (!mounted) return;

      setArtwork(data.artwork);

      setProvenance(
        data.provenance_history || []
      );

      setOwnership({
        owner_name: data.current_owner,
      });

    } catch (e) {

      console.error(
        "ARTWORK LOAD ERROR",
        e
      );

      addToast(
        "Could not load artwork record",
        "error"
      );

    } finally {

      if (mounted) setLoading(false);

    }
  };

  if (id) run();

  return () => {
    mounted = false;
  };

}, [id, addToast]);

  const handleOwnershipTransferred = async () => {
  try {
    const refreshed = await api.getArtwork(id);

    setArtwork(refreshed.data.artwork);
    setProvenance(
      refreshed.data.provenance_history || []
      );

    setOwnership({
      owner_name: refreshed.data.current_owner,
      });

    addToast(
      "Ownership transferred • Provenance updated",
      "success"
    );
  } catch (e) {
    addToast("Could not refresh provenance state", "error");
  }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4EBDC]">
        <div className="text-[#7A6555] text-lg">
          Preparing provenance object…
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-[#F4EBDC] text-[#2B1D16] flex items-center justify-center">
        <div>
          <p>This artwork record could not be resolved.</p>

          <Link
            to="/verify"
            className="mt-4 inline-block text-[#B56A3E]"
          >
            Return to verification
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EBDC] text-[#2B1D16]">
      <section className="px-6 pt-24 pb-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-16">

          {/* LEFT SIDE */}

          <div>

            <p className="uppercase tracking-[0.35em] text-xs text-[#B56A3E] mb-6">
              Certificate of Authenticity
            </p>

            <h1 className="font-serif text-6xl leading-none mb-8">
              {artwork.title || "Untitled Work"}
            </h1>

            <p className="text-xl leading-relaxed text-[#6E5A4B] max-w-2xl">
              {artwork.description ||
                "A verified cultural work archived through decentralized provenance infrastructure."}
            </p>

            {/* ARTWORK OBJECT */}

            <div className="mt-14 bg-[#F7F0E1] border border-[#D9C7B0] shadow-[0_25px_60px_rgba(0,0,0,0.08)] overflow-hidden">

              <div className="aspect-[4/3] bg-[#E8D8BF] flex items-center justify-center text-[#8A6B53]">
                Artwork Preview
              </div>

              <div className="p-8 border-t border-[#D9C7B0]">

                <div className="grid md:grid-cols-2 gap-4 text-sm">

                  <div className="bg-[#FFF9F0] border border-[#DDCCB6] p-4">
                    <div className="flex items-center gap-2 uppercase tracking-[0.18em] text-xs text-[#9A7156]">
                      <Fingerprint size={14} />
                      Registry Identity
                    </div>

                    <div className="mt-3 font-mono text-xs break-all">
                      {artwork.artisan_did}
                    </div>
                  </div>

                  <div className="bg-[#FFF9F0] border border-[#DDCCB6] p-4">
                    <div className="flex items-center gap-2 uppercase tracking-[0.18em] text-xs text-[#9A7156]">
                      <ShieldCheck size={14} />
                      Verification Status
                    </div>

                    <div className="mt-3">
                      {artwork.status || "verified"}
                    </div>
                  </div>

                  <div className="bg-[#FFF9F0] border border-[#DDCCB6] p-4">
                    <div className="flex items-center gap-2 uppercase tracking-[0.18em] text-xs text-[#9A7156]">
                      <ScrollText size={14} />
                      IPFS Record
                    </div>

                    <div className="mt-3 font-mono text-xs break-all">
                      {artwork.ipfs_cid || "—"}
                    </div>
                  </div>

                  <div className="bg-[#FFF9F0] border border-[#DDCCB6] p-4">
                    <div className="flex items-center gap-2 uppercase tracking-[0.18em] text-xs text-[#9A7156]">
                      <ExternalLink size={14} />
                      Chain Anchor
                    </div>

                    {artwork.tx_id ? (
                      <a
                        href={`https://algoexplorer.io/tx/${artwork.tx_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-[#B56A3E]"
                      >
                        View Transaction
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <div className="mt-3">—</div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* ARTISAN REVEAL */}

            <div className="mt-24 border-t border-[#DDCCB6] pt-16">

              <p className="uppercase tracking-[0.35em] text-xs text-[#B56A3E] mb-5">
                Crafted by a Verified Artisan
              </p>

              <button
                onClick={() => setShowArtisan(!showArtisan)}
                className="group"
              >

                <div className="bg-[#F7F0E1] border border-[#DCCAB5] px-8 py-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="uppercase tracking-[0.3em] text-[11px] text-[#B56A3E]">
                        Registry Linked Identity
                      </p>

                      <h2 className="mt-3 font-serif text-4xl">
                        Provenance Record
                      </h2>

                      <p className="mt-4 text-[#6E5A4B] max-w-xl">
                        This work is associated with a preserved cultural identity
                        archived through decentralized provenance infrastructure.
                      </p>

                    </div>

                    <ChevronDown
                      className={`transition duration-500 ${
                        showArtisan ? "rotate-180" : ""
                      }`}
                    />

                  </div>
                </div>
              </button>

              {showArtisan && (
                <div className="mt-10 bg-[#F7F0E1] border border-[#DCCAB5] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

                  <div className="grid md:grid-cols-[120px_1fr] gap-8">

                    <div className="h-[120px] w-[120px] rounded-full bg-[#E7D5BF]" />

                    <div>

                      <p className="uppercase tracking-[0.3em] text-[11px] text-[#B56A3E]">
                        Registry Verified
                      </p>

                      <h3 className="mt-3 font-serif text-5xl">
                        Artisan Identity
                      </h3>

                      <p className="mt-4 text-[#6E5A4B] leading-relaxed">
                        Trained through intergenerational lineage and linked
                        to preserved provenance records within the SkillChain archive.
                      </p>

                      <div className="mt-8 grid md:grid-cols-2 gap-6 text-sm">

                        <div>
                          <p className="uppercase tracking-[0.2em] text-[#A07B61] text-xs">
                            Guild Affiliation
                          </p>

                          <p className="mt-2">
                            Registered Cultural Guild
                          </p>
                        </div>

                        <div>
                          <p className="uppercase tracking-[0.2em] text-[#A07B61] text-xs">
                            Craft Specialization
                          </p>

                          <p className="mt-2">
                            Traditional Heritage Practice
                          </p>
                        </div>

                        <div>
                          <p className="uppercase tracking-[0.2em] text-[#A07B61] text-xs">
                            Registry Identifier
                          </p>

                          <p className="mt-2 font-mono text-xs break-all">
                            {artwork.artisan_did}
                          </p>
                        </div>

                        <div>
                          <p className="uppercase tracking-[0.2em] text-[#A07B61] text-xs">
                            Provenance Status
                          </p>

                          <p className="mt-2 text-[#3E7A58]">
                            Confirmed
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR */}

          <div className="space-y-8">

            {/* ACQUIRE */}

            <div className="bg-[#F7F0E1] border border-[#DCCAB5] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

              <p className="uppercase tracking-[0.3em] text-[11px] text-[#B56A3E] mb-5">
                Ownership Acquisition
              </p>

              <h2 className="font-serif text-4xl mb-4">
                Acquire Artwork
              </h2>

              <p className="text-[#6E5A4B] leading-relaxed mb-8">
                Ownership transfer is executed through a native HTTP 402
                payment challenge and permanently recorded as a provenance event.
              </p>

              {/* Ownership Status */}

              <div className="mb-8 bg-[#FFF9F0] border border-[#DDCCB6] p-5">

                <div className="uppercase tracking-[0.18em] text-[10px] text-[#9A7156] mb-3">
                  Current Ownership
                </div>

                <div className="text-lg text-[#2B1D16]">
                  {ownership?.owner_name || "Original Collector"}
                </div>

                <div className="mt-2 text-sm text-[#7A6555]">
                  Provenance-linked ownership state
                </div>

              </div>

              {/* Collector Inputs */}

              <div className="space-y-4">

                <input
                  className="w-full bg-[#FFF9F0] border border-[#D9C6AF] px-5 py-4 outline-none focus:border-[#B56A3E]"
                  placeholder="Collector name"
                  value={collector.name}
                  onChange={(e) =>
                    setCollector((c) => ({
                      ...c,
                      name: e.target.value,
                    }))
                  }
                />

                <input
                  className="w-full bg-[#FFF9F0] border border-[#D9C6AF] px-5 py-4 outline-none focus:border-[#B56A3E]"
                  placeholder="Collector email"
                  value={collector.email}
                  onChange={(e) =>
                    setCollector((c) => ({
                      ...c,
                      email: e.target.value,
                    }))
                  }
                />

                <button
                  onClick={() => setShowAcquireModal(true)}
                  className="w-full bg-[#B56A3E] hover:bg-[#9f5b34] text-white py-4 transition duration-300"
                >
                  Begin x402 Acquisition
                </button>

              </div>

              {/* Protocol explanation */}

              <div className="mt-8 border-t border-[#DDCCB6] pt-6">

                <div className="uppercase tracking-[0.18em] text-[10px] text-[#9A7156] mb-3">
                  Settlement Protocol
                </div>

                <p className="text-sm leading-relaxed text-[#6E5A4B]">
                  SkillChain uses payment-gated ownership transfer infrastructure
                  where acquisition events become permanent provenance records
                  anchored on Algorand.
                </p>

              </div>

            </div>

            {/* PROVENANCE */}

            <div className="bg-[#F7F0E1] border border-[#DCCAB5] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

              <p className="uppercase tracking-[0.3em] text-[11px] text-[#B56A3E] mb-6">
                Provenance Timeline
              </p>

              <ProvenanceTimeline
                events={provenance}
                artisan={{
                  name: artwork?.artisan_name || "Verified Artisan",
                  did: artwork?.artisan_did,
                }}
                artwork={{
                  title: artwork?.title,
                  tx_id: artwork?.tx_id,
                  created_at: artwork?.created_at,
                }}
              />

            </div>
          </div>
        </div>
      </section>
    
          {showAcquireModal && (
        <X402ChallengeModal
          artwork={artwork}
          onClose={() => setShowAcquireModal(false)}
          onOwnershipTransferred={handleOwnershipTransferred}
        />
      )}
    </div>  
  );
};