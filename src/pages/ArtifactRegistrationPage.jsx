import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addArtwork } from "../api/api";

export default function ArtifactRegistrationPage() {
  const location = useLocation();
  const artisanFromState = location.state?.artisan || null;
  const [lookupDid, setLookupDid] = useState('');
  const [artisan, setArtisan] = useState(artisanFromState);
  const [resolving, setResolving] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [region, setRegion] = useState('');
  const [workshop, setWorkshop] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const handleResolveDid = async () => {
    try {
      if (!lookupDid) return;

      setResolving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/artisan/${encodeURIComponent(lookupDid)}`
      );

      if (!response.ok) {
        throw new Error('DID not found');
      }

      const data = await response.json();
      console.log(data);

      setArtisan(data);

    } catch (err) {
      console.error(err);
      alert('Failed to resolve DID');
    } finally {
      setResolving(false);
    }
  };

  const handleRegisterArtifact = async () => {
    try {
      if (!image) {
        alert('Please upload an artwork image');
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append('artwork', image);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('materials', materials);
      formData.append('region', region);
      formData.append('workshop', workshop);

      formData.append('artisan_did', artisan.did);
      formData.append('artisan_name', artisan.name);

      const response = await addArtwork(formData);

      console.log('Artwork registration response:', response.data);

      setResult(response.data);

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.error ||
        'Artifact registration failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EFE5] text-[#1F1A17] px-6 py-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">

      {/* DID RESOLVE PANEL */}
      <div className="border border-[#D9C8B5] bg-white rounded-2xl p-6 shadow-sm mb-8 lg:col-span-2">

        <h2 className="text-2xl font-serif mb-4">
          Resolve Artisan DID
        </h2>

        <div className="flex gap-3">

          <input
            value={lookupDid}
            onChange={(e) => setLookupDid(e.target.value)}
            placeholder="Enter approved artisan DID"
            className="flex-1 border border-[#D9C8B5] rounded-xl px-4 py-3"
          />

          <button
            onClick={handleResolveDid}
            className="px-5 py-3 bg-[#B56A3E] text-white rounded-xl"
          >
            {resolving ? 'Resolving...' : 'Resolve'}
          </button>
        </div>
      </div>

      {artisan && (
        <>

        {/* LEFT PANEL */}
        <div className="space-y-6">

          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#8B694D] mb-3">
              SkillChain Provenance
            </p>

            <h1 className="text-5xl font-serif leading-tight">
              Register a Cultural Artifact
            </h1>
          </div>

          <p className="text-lg text-[#5E5147] leading-relaxed">
            Verified artisans can register artworks with identity-backed
            provenance anchored to decentralized infrastructure.
          </p>
          <div className="border border-[#D9C8B5] bg-white rounded-2xl p-6 shadow-sm mb-8">

            <h2 className="text-2xl font-serif mb-4">
              Resolve Artisan DID
            </h2>

            <div className="flex gap-3">

              <input
                value={lookupDid}
                onChange={(e) => setLookupDid(e.target.value)}
                placeholder="Enter approved artisan DID"
                className="flex-1 border border-[#D9C8B5] rounded-xl px-4 py-3"
              />

              <button
                onClick={handleResolveDid}
                className="px-5 py-3 bg-[#B56A3E] text-white rounded-xl"
              >
                {resolving ? 'Resolving...' : 'Resolve'}
              </button>
            </div>
          </div>

          <div className="border border-[#D9C8B5] bg-white rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-xl font-semibold">
              Verified Identity
            </h2>

            <div className="space-y-3 text-sm">

              <div>
                <div className="text-[#8B694D] mb-1">
                  Artisan Name
                </div>

                <div className="font-medium">
                  {artisan.name}
                </div>
              </div>

              <div>
                <div className="text-[#8B694D] mb-1">
                  Craft
                </div>

                <div className="font-medium">
                  {artisan.craft_type}
                </div>
              </div>

              <div>
                <div className="text-[#8B694D] mb-1">
                  DID
                </div>

                <div className="font-mono text-xs break-all bg-[#F6EFE5] p-3 rounded-lg">
                  {artisan.did}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#E9F7EF] text-[#1F7A4D] px-4 py-2 rounded-full text-sm font-medium">
              ✓ Verified Artisan Identity
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="border border-[#D9C8B5] bg-white rounded-2xl p-8 shadow-sm">

          <div className="mb-8">
            <h2 className="text-3xl font-serif mb-2">
              Artifact Registration
            </h2>

            <p className="text-[#6A5C52]">
              Upload the artwork and attach provenance metadata.
            </p>
          </div>

          <form className="space-y-6">

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Artwork Image
              </label>

              <div className="border-2 border-dashed border-[#D9C8B5] rounded-2xl p-10 text-center bg-[#FBF8F4]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full"
                />
              </div>
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Traditional Bidri Vase"
                className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the artwork, process, symbolism, or history..."
                className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
              />
            </div>

            {/* MATERIALS + REGION */}
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Materials
                </label>

                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Silver, Zinc, Copper"
                  className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Region
                </label>

                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Karnataka"
                  className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
                />
              </div>
            </div>

            {/* WORKSHOP */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Workshop / Guild
              </label>

              <input
                type="text"
                value={workshop}
                onChange={(e) => setWorkshop(e.target.value)}
                placeholder="Bidar Heritage Cluster"
                className="w-full border border-[#D9C8B5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B56A3E]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="button"
              onClick={handleRegisterArtifact}
              disabled={loading}
              className="w-full bg-[#B56A3E] hover:bg-[#9A5730] text-white py-4 rounded-xl text-lg font-medium transition disabled:opacity-50"
            >
              {loading
                ? 'Registering...'
                : 'Register Artifact Provenance'}
            </button>
          </form>

          {/* RESULT */}
          {result && (
            <div className="mt-10 border border-[#D9C8B5] rounded-2xl p-6 bg-[#FBF8F4]">

              <h3 className="text-2xl font-serif mb-5">
                Provenance Registered
              </h3>

              <div className="space-y-3 text-sm">

                <div>
                  <strong>Artwork ID:</strong>

                  <div className="font-mono break-all">
                    {result.artwork_id}
                  </div>
                </div>

                <div>
                  <strong>Creator DID:</strong>

                  <div className="font-mono break-all">
                    {artisan.did}
                  </div>
                </div>

                <div>
                  <div>
                    <strong>Blockchain Transaction:</strong>

                    {result.explorer_url ? (
                      <div className="mt-1">
                        <a
                          href={result.explorer_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B56A3E] underline break-all"
                        >
                          View Verified Blockchain Record
                        </a>
                      </div>
                    ) : (
                      <div className="font-mono break-all">
                        Pending
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}