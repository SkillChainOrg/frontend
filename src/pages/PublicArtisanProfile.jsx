import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Fingerprint } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getArtisanById } from "../api/api";
import { StatusBadge } from "../components/common/StatusBadge";
import { CopyButton } from "../components/common/CopyButton";

export default function PublicArtisanProfile() {
  const artisanId = useParams()["*"];
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!artisanId) {
      setError("Artisan not found.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const { data } = await getArtisanById(artisanId);
        setArtisan(data);
      } catch (err) {
        console.error(err);
        setError("Artisan not found.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [artisanId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0E7D3] dark:bg-[#0F0B08]">
        Loading...
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0E7D3] dark:bg-[#0F0B08] px-6">
        <p className="text-[#5C4636] dark:text-[#CBB9A6]">{error || "Artisan not found."}</p>
      </div>
    );
  }

  if (artisan.status !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0E7D3] dark:bg-[#0F0B08] px-6">
        <p className="text-[#5C4636] dark:text-[#CBB9A6] text-lg">
          Artisan profile is not publicly available.
        </p>
      </div>
    );
  }

  const artworks = artisan.artworks || [];

  return (
    <div className="min-h-screen bg-[#F0E7D3] dark:bg-[#0F0B08] text-[#2B1D16] dark:text-[#F5ECDE] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Fingerprint className="text-[#B56A3E]" size={24} />
              <h1 className="text-2xl font-serif">{artisan.name}</h1>
              <StatusBadge status="verified" text="Approved" />
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-1">Craft Type</div>
                  <div className="text-lg font-medium">{artisan.craft_type}</div>
                </div>
                <div className="p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-1">Location</div>
                  <div className="text-lg font-medium">{artisan.location}</div>
                </div>
              </div>

              {artisan.bio && (
                <div className="p-4 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8B694D] mb-1">Bio</div>
                  <div className="text-lg font-medium">{artisan.bio}</div>
                </div>
              )}

              {artisan.did && (
                <div className="flex items-center gap-3 p-3 bg-[#fffaf1] dark:bg-[#1A1410] border border-[#d8c7ab] dark:border-[#2e241d]">
                  <span className="text-sm text-[#8B694D] w-20">DID</span>
                  <code className="flex-1 font-mono text-sm truncate">{artisan.did}</code>
                  <CopyButton text={artisan.did} label="DID" />
                </div>
              )}

              {artisan.did && (
                <Link
                  to={`/verify?did=${encodeURIComponent(artisan.did)}`}
                  className="inline-block px-5 py-3 border border-[#B56A3E] text-[#B56A3E] rounded-lg hover:bg-[#B56A3E] hover:text-white transition"
                >
                  View Verified DID
                </Link>
              )}
            </div>
          </div>

          {artisan.did && (
            <div className="bg-[#E8D9BE] dark:bg-[#16110D] border border-[#d3bea0] dark:border-[#2e241d] shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center justify-center">
              <div className="p-3 bg-white dark:bg-[#1A1410] shadow-sm">
                <QRCodeSVG
                  value={`${window.location.origin}/verify?did=${artisan.did}`}
                  size={160}
                  level="H"
                />
              </div>
              <p className="text-xs text-[#8B694D] mt-4 text-center uppercase tracking-[0.18em]">
                Scan to verify identity
              </p>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-serif mb-6">Artworks</h2>
        {artworks.length === 0 ? (
          <div className="text-center py-12 text-[#8B694D] bg-[#F7EFE1] dark:bg-[#16110D] border border-dashed border-[#d8c7ab] dark:border-[#2e241d]">
            No artworks uploaded yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art, i) => (
              <div
                key={art.artwork_id || art.ipfs_cid || i}
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
                  <h3 className="font-serif text-xl mb-1">{art.title}</h3>
                  {art.description && (
                    <p className="text-sm text-[#6D5646] dark:text-[#CBB9A6] line-clamp-2 mb-3">{art.description}</p>
                  )}
                  {art.artwork_id && (
                    <Link
                      to={`/artworks/${art.artwork_id}`}
                      className="block w-full text-center bg-[#1C1A16] hover:bg-black transition text-[#F7F0E1] py-3 px-4 tracking-wide"
                    >
                      View Artwork
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
