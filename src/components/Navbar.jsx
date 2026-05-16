import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const navLinks = [
    { to: "/verify", label: t("nav_verify") },
    { to: "/artworks", label: t("nav_artworks") },
    { to: "/artisan", label: t("nav_artisans") },
    { to: "/institutions", label: t("nav_institutions") },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="
fixed top-0 left-0 w-full z-50
backdrop-blur-md
border-b
bg-[#F0E7D3]/80
dark:bg-[#0F0B08]/80
border-[#d8c7ab]
dark:border-[#2e241d]
text-[#2B1D16]
dark:text-[#F5ECDE]
"
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className={`font-serif text-2xl ${
            i18n.language === "hi"
              ? "tracking-normal"
              : "tracking-wide"
          }`}
        >
          {t("brand_name")}
        </Link>

        {/* LINKS */}
        <div className="flex items-center gap-6 lg:gap-10 text-sm tracking-[0.18em] uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-[#B56A3E] transition whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}

          <div
            className="flex items-center gap-2 text-[11px] tracking-[0.22em] text-[#7A6150] dark:text-[#D9CAB8]"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              className={`transition ${
                i18n.language === "en"
                  ? "text-[#B56A3E]"
                  : "hover:text-[#B56A3E]"
              }`}
            >
              {t("lang_en")}
            </button>

            <span className="text-[#B56A3E]/70">|</span>

            <button
              type="button"
              onClick={() => i18n.changeLanguage("hi")}
              className={`font-serif normal-case tracking-normal transition ${
                i18n.language === "hi"
                  ? "text-[#B56A3E]"
                  : "hover:text-[#B56A3E]"
              }`}
            >
              {t("lang_hi")}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}