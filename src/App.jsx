import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { VerificationPage } from "./pages/VerificationPage";
import { ArtisanDashboard } from "./pages/ArtisanDashboard";
import { ArtworkDetailPage } from "./pages/ArtworkDetailPage";
import { ArtisanSearchPage } from "./pages/ArtisanSearchPage";
import { ArtisanDetailPage } from "./pages/ArtisanDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Existing routes — untouched ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/artisan" element={<ArtisanDashboard />} />
        <Route path="/artworks/:artworkId" element={<ArtworkDetailPage />} />

        {/* ── New artisan registry routes ── */}
        <Route path="/artisans/search" element={<ArtisanSearchPage />} />
        <Route path="/artisans/:artisanId" element={<ArtisanDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
