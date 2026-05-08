import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShieldCheck, ChevronDown } from "lucide-react";

export default function ArtisanIdentityCard({ artisan }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, rotate: -0.3 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[32px] border border-[#dcc8b4] bg-[#f7efe1] shadow-[0_20px_60px_rgba(86,55,32,0.12)]"
    >
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top,rgba(120,72,38,0.45),transparent_55%)]" />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex items-start gap-5">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-[#d8c3ae] bg-[#efe1cf]">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-[#b8744f]">
                Registry Verified
              </p>

              <h2 className="font-serif text-4xl text-[#2d1c14]">
                {artisan.name}
              </h2>

              <p className="mt-2 text-lg text-[#9f5f3d]">
                {artisan.specialization}
              </p>

              <div className="mt-3 flex items-center gap-2 text-[#7b5f4f]">
                <MapPin size={16} />
                <span>{artisan.region}</span>
              </div>
            </div>
          </div>

          <div className="ml-auto flex flex-col items-start md:items-end">
            <div className="rounded-full border border-[#d7b89d] px-5 py-2 text-sm text-[#8c5638] bg-[#f9f2e8]">
              {artisan.guild}
            </div>

            <div className="mt-6 flex items-center gap-2 text-[#3e7b57]">
              <ShieldCheck size={18} />
              <span className="text-sm tracking-wide">
                Provenance Confirmed
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#e1cfbd] pt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-[#9c6345] transition hover:text-[#6f3d25]"
          >
            Registry Record
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-[#b8744f]">
                      Heritage Statement
                    </p>

                    <blockquote className="border-l-2 border-[#c88a63] pl-5 font-serif text-xl italic leading-relaxed text-[#4a3427]">
                      “{artisan.statement}”
                    </blockquote>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#b8744f]">
                        Registry Identifier
                      </p>

                      <p className="mt-2 break-all text-sm text-[#6d5648]">
                        {artisan.did}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#b8744f]">
                        Verified Works
                      </p>

                      <p className="mt-2 text-2xl font-serif text-[#2d1c14]">
                        {artisan.works}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#b8744f]">
                        Guild Affiliation
                      </p>

                      <p className="mt-2 text-[#5f493c]">
                        {artisan.guild}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
