import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
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
          className="font-serif text-2xl tracking-wide"
        >
          SkillChain
        </Link>

        {/* LINKS */}
        <div className="flex items-center gap-10 text-sm tracking-[0.18em] uppercase">
          <Link
            to="/verify"
            className="hover:text-[#B56A3E] transition"
          >
            Verify
          </Link>

          <Link
            to="/artworks"
            className="hover:text-[#B56A3E] transition"
          >
            Artworks
          </Link>

          <Link
            to="/artisan"
            className="hover:text-[#B56A3E] transition"
          >
            Artisans
          </Link>

          <Link
            to="/institutions"
            className="hover:text-[#B56A3E] transition"
          >
            Institutions
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
