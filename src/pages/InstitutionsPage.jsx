export default function InstitutionsPage() {
  const institutions = [
    "National Textile Heritage Council",
    "Museum of Indigenous Craft",
    "UNESCO Cultural Preservation Network",
    "South Asian Artisan Cooperative",
  ];

  return (
    <div className="min-h-screen pt-28 bg-[#F0E7D3]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <p className="uppercase tracking-[0.35em] text-[11px] text-[#B8744F] mb-5">
            Institutional Network
          </p>

          <h1 className="font-serif text-6xl leading-tight max-w-4xl">
            Trusted infrastructure for preserving cultural provenance.
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {institutions.map((institution) => (
            <div
              key={institution}
              className="border border-[#3A2C21] bg-[#16110D] p-10"
            >
              <div className="uppercase tracking-[0.3em] text-[10px] text-[#B8744F] mb-4">
                Onboarded Institution
              </div>

              <h2 className="font-serif text-3xl leading-snug">
                {institution}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}