import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  ImagePlus,
  Fingerprint,
  ExternalLink,
  ScrollText,
  ShieldCheck,
  Landmark,
  CheckCircle2,
  Clock3,
  Database,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { FileUpload } from "../components/common/FileUpload";
import { CopyButton } from "../components/common/CopyButton";
import { StatusBadge } from "../components/common/StatusBadge";
import { useToast } from "../context/ToastContext";
import * as api from "../api/api";

export const ArtisanDashboard = () => {
  const [lookupDid, setLookupDid] = useState("");
  const [resolvedArtisan, setResolvedArtisan] = useState(null);
  const [showDidModal, setShowDidModal] = useState(false);
  const [didDocument, setDidDocument] = useState(null);
  const [loadingDid, setLoadingDid] = useState(false);
  const { t } = useTranslation();
  const [artisan, setArtisan] = useState(null);
  const refreshArtisanStatus = async () => {
    try {
      if (!artisan?.artisan_id) {
        addToast("Missing artisan ID", "error");
        return;
      }

      const { data } = await api.getArtisanById(
        artisan.artisan_id
      );

      setArtisan(data);

      if (data.did) {
        addToast("Identity approved and activated", "success");
      } else {
        addToast("Still pending review", "info");
      }

    } catch (err) {
      console.error(err);

      addToast(
        err?.response?.data?.error ||
        "Failed to refresh artisan",
        "error"
      );
    }
  };
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState({
    name: "",
    craft_type: "",
    cluster: "",
    location: "",
  });
  const [artworkForm, setArtworkForm] = useState({
    title: "",
    description: "",
    materials: "",
  });
  const [artworkFile, setArtworkFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const steps = [
    {
      title: t("artisan_step_1_title"),
      detail: t("artisan_step_1_detail"),
      icon: ScrollText,
    },
    {
      title: t("artisan_step_2_title"),
      detail: t("artisan_step_2_detail"),
      icon: Landmark,
    },
    {
      title: t("artisan_step_3_title"),
      detail: t("artisan_step_3_detail"),
      icon: Fingerprint,
    },
    {
      title: t("artisan_step_4_title"),
      detail: t("artisan_step_4_detail"),
      icon: ShieldCheck,
    },
  ];

  const trustPillars = [
    {
      title: t("artisan_pillar_1_title"),
      detail: t("artisan_pillar_1_detail"),
      icon: Fingerprint,
    },
    {
      title: t("artisan_pillar_2_title"),
      detail: t("artisan_pillar_2_detail"),
      icon: ScrollText,
    },
    {
      title: t("artisan_pillar_3_title"),
      detail: t("artisan_pillar_3_detail"),
      icon: LockKeyhole,
    },
    {
      title: t("artisan_pillar_4_title"),
      detail: t("artisan_pillar_4_detail"),
      icon: Database,
    },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.registerArtisan(form);
      setArtisan(data);
      setRegistered(true);
      addToast("Artisan record submitted for archival review", "success");
    } catch (err) {
      addToast("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async () => {
    try {
      const { data } = await api.getArtisan(lookupDid);

      setResolvedArtisan(data);

      addToast("Identity resolved", "success");

    } catch (err) {
      console.error(err);

      addToast(
        err?.response?.data?.error || "Resolution failed",
        "error"
      );
    }
  };
  const handleResolveDid = async () => {
    try {
      setLoadingDid(true);

      const result = await api.resolveDid(artisan.did);

      setDidDocument(result);
      setShowDidModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDid(false);
    }
  };


  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!artworkFile) return addToast("Please select an artwork file", "error");

    setLoading(true);
    const formData = new FormData();
    formData.append("artwork", artworkFile);
    formData.append("artisan_did", artisan.did);
    formData.append("title", artworkForm.title);
    formData.append("description", artworkForm.description);
    formData.append("materials", artworkForm.materials);

    try {
      const { data } = await api.addArtwork(formData);
      setArtisan((prev) => ({ ...prev, artworks: [...(prev.artworks || []), data] }));
      setArtworkForm({ title: "", description: "", materials: "" });
      setArtworkFile(null);
      addToast("Artwork provenance record created", "success");
    } catch (err) {
      addToast("Failed to add artwork", "error");
    } finally {
      setLoading(false);
    }
  };


  if (!registered) {
    return (
     <div className="min-h-screen bg-[#F0E7D3] dark:bg-[#0F0B08] text-[#2B1D16] dark:text-[#F5ECDE] transition-colors duration-500">
        <section className="relative px-6 pt-28 pb-20 border-b border-[#d8c7ab] dark:border-[#2e241d] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
          <div className="absolute top-[-140px] left-[-120px] w-[420px] h-[420px] rounded-full bg-[#D8B38A]/20 blur-3xl" />
          <div className="absolute bottom-[-160px] right-[-120px] w-[520px] h-[520px] rounded-full bg-[#A85B34]/10 blur-3xl" />

          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 uppercase tracking-[0.32em] text-xs text-[#9A5A38] mb-7">
                <ShieldCheck size={14} />
                {t("artisan_label")}
              </div>

              <h1 className="font-serif text-5xl md:text-7xl leading-[0.94] tracking-[-0.045em] mb-8">
                {t("artisan_heading_line_1")}
                <br />
                {t("artisan_heading_line_2")}
                <br />
                {t("artisan_heading_line_3")}
              </h1>

              <div className="w-28 h-[1px] bg-[#B56A3E] mb-8" />

              <p className="text-xl leading-relaxed text-[#5C4636] dark:text-[#CBB9A6] max-w-2xl mb-10">
                {t("artisan_intro")}
              </p>

              <div className="flex flex-wrap gap-4">
                {[
                  t("artisan_chip_1"),
                  t("artisan_chip_2"),
                  t("artisan_chip_3"),
                  t("artisan_chip_4"),
                ].map((item) => (
                  <div
                    key={item}
                    className="px-4 py-2 border border-[#c8b296] dark:border-[#2e241d] rounded-full text-sm tracking-wide bg-[#fffaf1]/65 dark:bg-[#16110D]/80 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: 3, y: 28 }}
              animate={{ opacity: 1, rotate: -2, y: 0 }}
              transition={{ duration: 0.95 }}
              className="relative"
            >
              <div className="relative bg-[#E8D9BE] dark:bg-[#16110D] border border-[#d3bea0] dark:border-[#2e241d] shadow-2xl p-8 md:p-10 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="uppercase tracking-[0.3em] text-xs text-[#8B694D] mb-3">
                        {t("artisan_registry_purpose")}
                      </div>
                      <h2 className="font-serif text-3xl leading-tight">
                        {t("artisan_registry_heading")}
                      </h2>
                    </div>

                    <div className="w-14 h-14 rounded-full border border-[#B56A3E]/30 flex items-center justify-center">
                      <Sparkles className="text-[#B56A3E]" size={22} />
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      {
                        icon: Fingerprint,
                        label: t("artisan_card_identity"),
                        value: t("artisan_card_identity_value"),
                      },
                      {
                        icon: ScrollText,
                        label: t("artisan_card_ownership"),
                        value: t("artisan_card_ownership_value"),
                      },
                      {
                        icon: Landmark,
                        label: t("artisan_card_institutional_trust"),
                        value: t("artisan_card_institutional_trust_value"),
                      },
                      {
                        icon: LockKeyhole,
                        label: t("artisan_card_permanence"),
                        value: t("artisan_card_permanence_value"),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between border-b border-[#d5c4a7] dark:border-[#2e241d] pb-4"
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className="text-[#B56A3E]" size={18} />
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-[#8B694D]">
                              {item.label}
                            </div>
                            <div className="text-[#2B1D16] dark:text-[#F5ECDE] mt-1">{item.value}</div>
                          </div>
                        </div>

                        <CheckCircle2 className="text-emerald-700" size={18} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto grid xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10"
            >
              <div className="uppercase tracking-[0.28em] text-xs text-[#9A5A38] mb-4">
                {t("artisan_registration_form")}
              </div>
              <h2 className="font-serif text-4xl mb-4">{t("artisan_registration_heading")}</h2>
              <p className="text-[#5C4636] dark:text-[#CBB9A6] leading-relaxed mb-8 max-w-2xl">
                {t("artisan_registration_body")}
              </p>

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
                    {t("artisan_name")}
                  </label>
                  <input
                    className="w-full px-4 py-4 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] text-black dark:text-[#F5ECDE] outline-none focus:border-[#B56A3E] transition"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("artisan_name_placeholder")}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
                      {t("artisan_craft_tradition")}
                    </label>
                    <input
                      className="w-full px-4 py-4 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] text-black dark:text-[#F5ECDE] outline-none focus:border-[#B56A3E] transition"
                      required
                      value={form.craft_type}
                      onChange={(e) => setForm({ ...form, craft_type: e.target.value })}
                      placeholder={t("artisan_craft_placeholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
                      {t("artisan_cluster")}
                    </label>
                    <input
                      className="w-full px-4 py-4 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] text-black dark:text-[#F5ECDE] outline-none focus:border-[#B56A3E] transition"
                      required
                      value={form.cluster}
                      onChange={(e) => setForm({ ...form, cluster: e.target.value })}
                      placeholder={t("artisan_cluster_placeholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
                    {t("artisan_place_of_practice")}
                  </label>
                  <input
                    className="w-full px-4 py-4 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] text-black dark:text-[#F5ECDE] outline-none focus:border-[#B56A3E] transition"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder={t("artisan_place_placeholder")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B56A3E] hover:bg-[#9f5730] transition duration-300 text-white py-5 text-lg tracking-wide shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <UserPlus size={18} />
                  {loading ? t("artisan_submit_loading") : t("artisan_submit")}
                </button>
              </form>
            </motion.div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#E8D9BE] dark:bg-[#16110D] border border-[#d3bea0] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8"
              >
                <div className="uppercase tracking-[0.28em] text-xs text-[#9A5A38] mb-4">
                  {t("artisan_did_identity")}
                </div>
                <h3 className="font-serif text-3xl mb-4">{t("artisan_did_heading")}</h3>
                <p className="text-[#5C4636] dark:text-[#CBB9A6] leading-relaxed">
                  {t("artisan_did_body")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8"
              >
                <div className="uppercase tracking-[0.28em] text-xs text-[#9A5A38] mb-4">
                  {t("artisan_provenance_ownership")}
                </div>
                <p className="text-[#5C4636] dark:text-[#CBB9A6] leading-relaxed">
                  {t("artisan_provenance_body")}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            <div className="bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10">
              <div className="uppercase tracking-[0.28em] text-xs text-[#9A5A38] mb-4">
                {t("artisan_trust_indicators")}
              </div>
              <h3 className="font-serif text-3xl mb-8">{t("artisan_trust_heading")}</h3>

              <div className="space-y-5">
                {trustPillars.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 border-b border-[#d9c7ac] dark:border-[#2e241d] pb-4"
                  >
                    <div className="w-11 h-11 rounded-full border border-[#B56A3E]/30 flex items-center justify-center shrink-0">
                      <item.icon className="text-[#B56A3E]" size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-lg mb-1">{item.title}</div>
                      <p className="text-[#5C4636] dark:text-[#CBB9A6] leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#E8D9BE] dark:bg-[#16110D] border border-[#d3bea0] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10">
              <div className="uppercase tracking-[0.28em] text-xs text-[#9A5A38] mb-4">
                {t("artisan_next_label")}
              </div>
              <h3 className="font-serif text-3xl mb-8">{t("artisan_next_heading")}</h3>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full border border-[#B56A3E]/30 flex items-center justify-center text-[#B56A3E]">
                        <step.icon size={18} />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-px flex-1 bg-[#d8c7ab] dark:bg-[#2e241d] mt-3" />
                      )}
                    </div>

                    <div className="pt-1 pb-3">
                      <div className="font-medium text-lg mb-1">{step.title}</div>
                      <p className="text-[#5C4636] dark:text-[#CBB9A6] leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10">
            <div className="uppercase tracking-[0.28em] text-xs text-[#9A5A38] mb-4">
              {t("artisan_institutional_references")}
            </div>
            <h3 className="font-serif text-3xl mb-4">{t("artisan_institutional_heading")}</h3>
            <p className="text-[#5C4636] dark:text-[#CBB9A6] max-w-4xl leading-relaxed">
              {t("artisan_institutional_body")}
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0E7D3] dark:bg-[#0F0B08] text-[#2B1D16] dark:text-[#F5ECDE] transition-colors duration-500 px-6 py-12">
      <div className="max-w-7xl mx-auto"></div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <Fingerprint className="text-[#B56A3E]" size={24} />
              <h2 className="text-3xl font-serif">Artisan Registry Record</h2>
              <StatusBadge status="pending" text="Pending Review" />
            </div>

            <p className="text-[#5C4636] dark:text-[#CBB9A6] leading-relaxed mb-6 max-w-2xl">
              The artisan identity has been entered into the registry and is now
              awaiting institutional approval before a DID and provenance-ready trust
              record are fully activated.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                <Clock3 className="text-[#B56A3E]" size={18} />
                <span className="text-sm uppercase tracking-[0.18em] text-[#8B694D] w-28">
                  Status
                </span>
                <span className="font-medium">Awaiting institutional verification</span>
              </div>
              <button
                onClick={refreshArtisanStatus}
                className="mt-6 px-5 py-3 bg-[#B56A3E] text-white rounded-lg hover:bg-[#9c5731] transition"
              >
                Check Approval Status
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-1">
                    Artisan Name
                  </div>
                  <div className="text-lg font-medium">{artisan.name}</div>
                </div>

                <div className="p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-1">
                    Craft Tradition
                  </div>
                  <div className="text-lg font-medium">{artisan.craft_type}</div>
                </div>

                <div className="p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-1">
                    Cluster / Guild
                  </div>
                  <div className="text-lg font-medium">{artisan.cluster}</div>
                </div>

                <div className="p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-1">
                    Place of Practice
                  </div>
                  <div className="text-lg font-medium">{artisan.location}</div>
                </div>
              </div>

              {artisan.artisan_id && (
                <div className="flex items-center gap-3 p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <span className="text-sm uppercase tracking-[0.18em] text-[#8B694D] w-28">
                    Registry ID
                  </span>
                  <code className="flex-1 font-mono text-sm break-all">{artisan.artisan_id}</code>
                  <CopyButton text={artisan.artisan_id} label="Registry ID" />
                </div>
              )}
            </div>
          </div>
        </div>
        

          <div className="bg-[#E8D9BE] dark:bg-[#16110D] border border-[#d3bea0] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 flex flex-col justify-between">
            <div>
              <div className="uppercase tracking-[0.28em] text-xs text-[#9A5A38] mb-4">
                Registry Note
              </div>
              <h3 className="font-serif text-3xl mb-4">Identity is issued after review</h3>
              <p className="text-[#5C4636] dark:text-[#CBB9A6] leading-relaxed">
                Once approved, this artisan record will receive a DID, a wallet-backed
                trust identity, and the ability to anchor artworks as verified works of origin.
              </p>
            </div>
            <div className="bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] p-8 mt-10">
              <h3 className="text-2xl font-serif mb-4">
                Resolve Artisan Identity
              </h3>

              <div className="flex gap-3">
                <input
                  value={lookupDid}
                  onChange={(e) => setLookupDid(e.target.value)}
                  placeholder="Enter DID"
                  className="flex-1 px-4 py-3 border border-[#cfb99d]"
                />

                <button
                  onClick={handleLookup}
                  className="px-5 py-3 bg-[#B56A3E] text-white"
                >
                  Resolve
                </button>
              </div>

              {resolvedArtisan && (
                <div className="mt-6 p-5 border border-[#d8c7ab]">
                  <div><strong>Name:</strong> {resolvedArtisan.name}</div>
                  <div><strong>Craft:</strong> {resolvedArtisan.craft_type}</div>
                  <div><strong>Cluster:</strong> {resolvedArtisan.cluster}</div>
                  <div><strong>Location:</strong> {resolvedArtisan.location}</div>
                  <div><strong>Status:</strong> {resolvedArtisan.status}</div>
                </div>
              )}
            </div>

                        <div className="mt-8 p-5 border border-[#d5c4a7] dark:border-[#2e241d] bg-[#f5ebdd] dark:bg-[#1A1410]">
                          <div className="uppercase tracking-[0.2em] text-xs text-[#8B694D] mb-2">
                            Approval prepares
                          </div>
                          <div className="space-y-2 text-[#5C4636] dark:text-[#CBB9A6]">
                            <div>DID identity issuance</div>
                            <div>Creator-authored provenance records</div>
                            <div>Blockchain-linked authenticity</div>
                          </div>
                        </div>
                      </div>
        

        {artisan.did ? (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="md:col-span-2 bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint className="text-[#B56A3E]" size={24} />
                  <h2 className="text-2xl font-serif">Verified Identity</h2>
                  <StatusBadge status="verified" text="Approved" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                    <span className="text-sm text-[#8B694D] w-20">DID</span>

                    <code className="flex-1 font-mono text-sm truncate">
                      {artisan.did}
                    </code>

                    <CopyButton text={artisan.did} label="DID" />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleResolveDid}
                      className="px-5 py-3 bg-[#B56A3E] text-white rounded-lg hover:bg-[#9c5731] transition"
                    >
                      {loadingDid ? "Resolving..." : "Resolve DID"}
                    </button>

                    <a
                      href={api.getDidViewerUrl(artisan.did)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 border border-[#B56A3E] text-[#B56A3E] rounded-lg hover:bg-[#B56A3E] hover:text-white transition"
                    >
                      View Identity Document
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#E8D9BE] dark:bg-[#16110D] border border-[#d3bea0] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center justify-center">
                <div className="p-3 bg-white dark:bg-[#1A1410] shadow-sm">
                  <QRCodeSVG value={`http://localhost:5173/verify?did=${artisan.did}`} size={160} level="H" />
                </div>
                <p className="text-xs text-[#8B694D] mt-4 text-center uppercase tracking-[0.18em]">
                  Scan to verify identity
                </p>
              </div>
            </div>

            <div className="bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10 mb-10">
              <h3 className="text-2xl font-serif mb-5 flex items-center gap-2">
                <ImagePlus size={20} className="text-[#B56A3E]" /> Register Artwork Provenance
              </h3>

              <form onSubmit={handleAddArtwork} className="space-y-5">
                <FileUpload
                  onFileSelect={setArtworkFile}
                  accept="image/*"
                  label="Upload artwork image"
                  sublabel="Register a work to this verified artisan identity"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="w-full px-4 py-4 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] text-black dark:text-[#F5ECDE] outline-none focus:border-[#B56A3E] transition"
                    placeholder="Artwork title"
                    required
                    value={artworkForm.title}
                    onChange={(e) => setArtworkForm({ ...artworkForm, title: e.target.value })}
                  />
                  <input
                    className="w-full px-4 py-4 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] text-black dark:text-[#F5ECDE] outline-none focus:border-[#B56A3E] transition"
                    placeholder="Materials used"
                    value={artworkForm.materials}
                    onChange={(e) => setArtworkForm({ ...artworkForm, materials: e.target.value })}
                  />
                </div>

                <textarea
                  className="w-full px-4 py-4 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] text-black dark:text-[#F5ECDE] outline-none focus:border-[#B56A3E] transition"
                  rows={4}
                  placeholder="Describe the work, its process, and its cultural significance..."
                  value={artworkForm.description}
                  onChange={(e) => setArtworkForm({ ...artworkForm, description: e.target.value })}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#B56A3E] hover:bg-[#9f5730] transition duration-300 text-white py-4 px-6 tracking-wide shadow-xl disabled:opacity-50 flex items-center gap-3"
                >
                  <ImagePlus size={18} /> Create Provenance Record
                </button>
              </form>
            </div>

            <h3 className="text-2xl font-serif mb-6">Registered Works</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {(artisan.artworks || []).map((art, i) => (
                  <motion.div
                    key={art.ipfs_cid || i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] overflow-hidden"
                  >
                    <div className="aspect-square bg-[#eadcc5] relative overflow-hidden">
                      {art.image_url ? (
                        <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8B694D]">
                          Artwork preview
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="font-serif text-xl mb-1">{art.title}</h4>
                      <p className="text-sm text-[#6D5646] dark:text-[#CBB9A6] line-clamp-2 mb-3">{art.description}</p>

                      {art.artwork_id ? (
                        <Link
                          to={`/artworks/${art.artwork_id}`}
                          className="block w-full text-center mb-4 bg-[#1C1A16] hover:bg-black transition duration-300 text-[#F7F0E1] py-3 px-4 tracking-wide shadow-xl"
                        >
                          View Provenance Object
                        </Link>
                      ) : (
                        <div className="w-full mb-4 text-xs text-[#8B694D] p-3 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                          This work is missing an internal id. Re-register to enable collector acquisition.
                        </div>
                      )}

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                          <span className="text-[#8B694D]">IPFS CID</span>
                          <div className="flex items-center gap-1 font-mono">
                            {art.ipfs_cid?.slice(0, 12)}... <CopyButton text={art.ipfs_cid} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                          <span className="text-[#8B694D]">Txn ID</span>
                          <a
                            href={`https://algoexplorer.io/tx/${art.txn_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#B56A3E] hover:underline"
                          >
                            View <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(artisan.artworks || []).length === 0 && (
                <div className="col-span-full text-center py-12 text-[#8B694D] bg-[#F7EFE1] dark:bg-[#16110D] border border-dashed border-[#d8c7ab] dark:border-[#2e241d]">
                  No artworks registered yet. Once approved, add the first work to this artisan identity.
                </div>
              )}
            </div>
        </>
        ) : null}

      {showDidModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-[#F4EBDC] dark:bg-[#16110D] w-full max-w-4xl rounded-2xl border border-[#d8c7ab] overflow-hidden shadow-2xl">

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8c7ab]/30">
              <div>
                <h2 className="font-serif text-2xl">
                  DID Resolution
                </h2>

                <p className="text-sm opacity-70 mt-1">
                  W3C DID Document Resolution
                </p>
              </div>

              <button
                onClick={() => setShowDidModal(false)}
                className="text-2xl"
              >
                Close
              </button>

            <div className="p-6 overflow-auto max-h-[75vh]">
              <pre className="text-xs whitespace-pre-wrap break-all bg-black text-green-400 rounded-xl p-5 overflow-auto">
                {JSON.stringify(didDocument, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}; 