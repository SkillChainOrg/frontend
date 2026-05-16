export default function InstitutionsPage() {
  const institutions = [
    "National Textile Heritage Council",
    "Museum of Indigenous Craft",
    "UNESCO Cultural Preservation Network",
    "South Asian Artisan Cooperative",
  ];

  return (
    <div className="min-h-screen pt-28 bg-[#F0E7D3] text-[#2B1D16] dark:bg-[#0F0B08] dark:text-[#F5ECDE]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <p className="uppercase tracking-[0.35em] text-[11px] text-[#B8744F] mb-5">
            Institutional Network
          </p>

          <h1 className="font-serif text-6xl leading-tight max-w-4xl text-[#2B1D16] dark:text-[#F5ECDE]">
            Trusted infrastructure for preserving cultural provenance.
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {institutions.map((institution) => (
            <div
              key={institution}
              className="border border-[#d8c7ab] dark:border-[#3A2C21] bg-[#F7EFE1] dark:bg-[#16110D] p-10"
            >
              <div className="uppercase tracking-[0.3em] text-[10px] text-[#B8744F] mb-4">
                Onboarded Institution
              </div>

              <h2 className="font-serif text-3xl leading-snug text-[#2B1D16] dark:text-[#F5ECDE]">
                {institution}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
