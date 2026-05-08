import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  const [acquiring, setAcquiring] = useState(false);

  const [showArtisan, setShowArtisan] = useState(false);

  const id = useMemo(() => Number(artworkId), [artworkId]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);

        const { data } = await api.getArtwork(id);

        if (!mounted) return;

        setArtwork(data.artwork);
        setProvenance(data.provenance_events || []);
        setOwnership(data.ownership || null);
      } catch (e) {
        addToast("Could not load artwork record", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (Number.isFinite(id)) run();

    return () => {
      mounted = false;
    };
  }, [id, addToast]);

  const handleAcquire = async () => {
    try {
      if (!collector.name.trim() || !collector.email.trim()) {
        addToast(
          "Collector name and email are required",
          "error"
        );
        return;
      }

      setAcquiring(true);

      const ok = await loadRazorpay();

      if (!ok) {
        addToast("Could not initialize acquisition flow", "error");
        return;
      }

      const { data } = await api.createPaymentOrder({
        artwork_id: id,
        collector_name: collector.name,
        collector_email: collector.email,
      });

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "SkillChain",
        description: "Acquire authenticated cultural work",
        order_id: data.order_id,

        method: {
          upi: true,
        },

        prefill: {
          name: collector.name,
          email: collector.email,
        },

        theme: {
          color: "#B56A3E",
        },

        handler: async (resp) => {
          const verify = await api.verifyPayment({
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
            artwork_id: id,
          });

          if (verify?.data?.success) {
            addToast(
              "Acquisition Recorded • Provenance Updated",
              "success"
            );

            const refreshed = await api.getArtwork(id);

            setProvenance(refreshed.data.provenance_events || []);
            setOwnership(refreshed.data.ownership || null);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (e) {
      addToast("Acquisition flow failed", "error");
    } finally {
      setAcquiring(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4EBDC] text-[#2B1D16] flex items-center justify-center">
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
                Acquisition Registry
              </p>

              <h2 className="font-serif text-4xl mb-4">
                Acquire Artwork
              </h2>

              <p className="text-[#6E5A4B] leading-relaxed mb-8">
                Settlement confirmation becomes a permanent provenance event.
              </p>

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
                  onClick={handleAcquire}
                  disabled={acquiring}
                  className="w-full bg-[#B56A3E] hover:bg-[#9f5b34] text-white py-4 transition duration-300"
                >
                  {acquiring
                    ? "Preparing acquisition…"
                    : "Acquire Artwork"}
                </button>

              </div>
            </div>

            {/* PROVENANCE */}

            <div className="bg-[#F7F0E1] border border-[#DCCAB5] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

              <p className="uppercase tracking-[0.3em] text-[11px] text-[#B56A3E] mb-5">
                Provenance Timeline
              </p>

              <div className="space-y-4">

                {provenance.length === 0 ? (
                  <div className="text-[#6E5A4B]">
                    No provenance events recorded.
                  </div>
                ) : (
                  provenance.map((ev) => (
                    <div
                      key={ev.id}
                      className="border border-[#DCCAB5] bg-[#FFF9F0] p-4"
                    >

                      <div className="flex items-center justify-between">

                        <div className="uppercase tracking-[0.18em] text-[10px] text-[#9A7156]">
                          {ev.provenance_event_type || ev.event_type}
                        </div>

                        <div className="text-xs text-[#7A6555]">
                          {ev.created_at}
                        </div>

                      </div>

                      <div className="mt-3 text-sm">
                        {ev.event_type}
                      </div>

                    </div>
                  ))
                )}

              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};