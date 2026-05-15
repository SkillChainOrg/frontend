import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import { VerificationPage } from "./pages/VerificationPage";
import { ArtisanDashboard } from "./pages/ArtisanDashboard";
import { ArtworkDetailPage } from "./pages/ArtworkDetailPage";

import { ArtisanSearchPage } from "./pages/ArtisanSearchPage";
import { ArtisanDetailPage } from "./pages/ArtisanDetailPage";

// Recommended upcoming pages
//import { ProvenanceExplorerPage } from "./pages/ProvenanceExplorerPage";
//import { InfrastructureStatusPage } from "./pages/InfrastructureStatusPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─────────────────────────────────────
            Core Product Routes
        ───────────────────────────────────── */}

        <Route path="/" element={<LandingPage />} />

        {/* Verification / authenticity */}
        <Route path="/verify" element={<VerificationPage />} />

        {/* Artisan onboarding/dashboard */}
        <Route path="/artisan" element={<ArtisanDashboard />} />

        {/* Artwork detail + provenance + x402 */}
        <Route
          path="/artworks/:artworkId"
          element={<ArtworkDetailPage />}
        />

        {/* ─────────────────────────────────────
            Artisan Registry
        ───────────────────────────────────── */}

        <Route
          path="/artisans/search"
          element={<ArtisanSearchPage />}
        />

        <Route
          path="/artisans/:artisanId"
          element={<ArtisanDetailPage />}
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;