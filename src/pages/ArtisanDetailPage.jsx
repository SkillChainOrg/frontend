import { useParams } from "react-router-dom";
import ArtisanIdentityCard from "../components/ArtisanIdentityCard";
import artisans from "../data/artisansMockData";

export function ArtisanDetailPage() {
  const { artisanId } = useParams();

  const artisan = artisans.find((a) => a.id === artisanId);

  if (!artisan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5ecde] text-[#2d1c14]">
        <div className="text-center">
          <h1 className="font-serif text-5xl">Record not found</h1>
          <p className="mt-4 text-[#7a6457]">
            The requested registry record could not be located.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ecde] px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-[#b8744f]">
            Registry Archive
          </p>

          <h1 className="font-serif text-6xl text-[#2d1c14]">
            Provenance Record
          </h1>
        </div>

        <ArtisanIdentityCard artisan={artisan} />
      </div>
    </div>
  );
}