import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtisanIdentityCard from "../components/ArtisanIdentityCard";
import { ProvenanceTimeline } from "../components/provenance/ProvenanceTimeline";
import api from "../api/api";

export function ArtisanDetailPage() {
  const { artisanId } = useParams();

  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArtisan = async () => {
      try {
        setLoading(true);

        // Replace with your real endpoint if different
        const response = await api.getArtisan(artisanId);

        setArtisan(response.data || response);
      } catch (err) {
        console.error(err);
        setError("Unable to load artisan provenance record.");
      } finally {
        setLoading(false);
      }
    };

    loadArtisan();
  }, [artisanId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5ecde] text-[#2d1c14]">
        <div className="text-center">
          <div className="mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[#b8744f] border-t-transparent mx-auto" />
          <h1 className="font-serif text-4xl">Loading Provenance Record</h1>
          <p className="mt-3 text-[#7a6457]">
            Fetching decentralized identity and provenance data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5ecde] text-[#2d1c14]">
        <div className="text-center">
          <h1 className="font-serif text-5xl">Record not found</h1>

          <p className="mt-4 text-[#7a6457]">
            {error ||
              "The requested registry record could not be located."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ecde] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-[#b8744f]">
            Registry Archive
          </p>

          <h1 className="font-serif text-6xl text-[#2d1c14]">
            Provenance Record
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#6d584c]">
            Verified artisan identity, blockchain-backed provenance,
            ownership certification, and authenticity history anchored on
            Algorand.
          </p>
        </div>

        {/* Identity Card */}
        <div className="mb-12">
          <ArtisanIdentityCard artisan={artisan} />
        </div>

        {/* Provenance Timeline */}
        <ProvenanceTimeline
          events={artisan?.provenance_history || []}
          artisan={{
            name: artisan?.name,
            did: artisan?.did,
          }}
          artwork={{
            title: artisan?.featured_artwork || "Certified Artwork",
            tx_id: artisan?.tx_id,
            created_at: artisan?.created_at,
          }}
        />
      </div>
    </div>
  );
}