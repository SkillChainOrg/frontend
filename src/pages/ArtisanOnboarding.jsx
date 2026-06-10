import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getAuthMe, registerArtisan } from "../api/api";
import { useToast } from "../context/ToastContext";

const PLACEHOLDER_AVATAR =
  "https://ui-avatars.com/api/?name=Artisan&background=B56A3E&color=fff";

export default function ArtisanOnboarding() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    profile_image: "",
    craft_type: "",
    location: "",
    bio: "",
    years_of_experience: "",
  });

  useEffect(() => {
    const guard = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        return;
      }

      try {
        const { data } = await getAuthMe();
        if (data.has_profile) {
          navigate("/artisan", { replace: true });
          return;
        }
      } catch (err) {
        console.error(err);
        addToast("Could not verify your account", "error");
        navigate("/", { replace: true });
        return;
      } finally {
        setCheckingAuth(false);
      }
    };

    guard();
  }, [navigate, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        craft_type: form.craft_type.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        years_of_experience: Number(form.years_of_experience),
      };

      const imageUrl = form.profile_image.trim();
      if (imageUrl) {
        payload.profile_image = imageUrl;
      }

      await registerArtisan(payload);
      addToast("Profile submitted — awaiting admin approval", "success");
      navigate("/artisan", { replace: true });
    } catch (err) {
      console.error(err);
      addToast(
        err?.response?.data?.error || "Failed to save profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0E7D3] dark:bg-[#0F0B08]">
        Loading...
      </div>
    );
  }

  const previewName = form.name.trim() || "Artisan";
  const avatarSrc =
    form.profile_image.trim() ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(previewName)}&background=B56A3E&color=fff`;

  return (
    <div className="min-h-screen bg-[#F0E7D3] dark:bg-[#0F0B08] text-[#2B1D16] dark:text-[#F5ECDE] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <img
            src={avatarSrc}
            alt=""
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-[#B56A3E] object-cover"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_AVATAR;
            }}
          />
          <h1 className="font-serif text-4xl mb-2">Complete Your Profile</h1>
          <p className="text-[#5C4636] dark:text-[#CBB9A6]">
            Tell us about your craft. Your profile will be reviewed before
            identity activation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#F7EFE1] dark:bg-[#16110D] border border-[#d8c7ab] dark:border-[#2e241d] p-8 space-y-6"
        >
          <div>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
              Display Name
            </label>
            <input
              className="w-full px-4 py-3 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] outline-none focus:border-[#B56A3E]"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name as it appears publicly"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
              Profile Image URL <span className="normal-case tracking-normal text-[#8B694D]/70">(optional)</span>
            </label>
            <input
              type="url"
              className="w-full px-4 py-3 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] outline-none focus:border-[#B56A3E]"
              value={form.profile_image}
              onChange={(e) =>
                setForm({ ...form, profile_image: e.target.value })
              }
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
              Craft Type
            </label>
            <input
              className="w-full px-4 py-3 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] outline-none focus:border-[#B56A3E]"
              required
              value={form.craft_type}
              onChange={(e) =>
                setForm({ ...form, craft_type: e.target.value })
              }
              placeholder="e.g. Handloom Weaving"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
              Location
            </label>
            <input
              className="w-full px-4 py-3 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] outline-none focus:border-[#B56A3E]"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City, State"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
              Bio
            </label>
            <textarea
              className="w-full px-4 py-3 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] outline-none focus:border-[#B56A3E] min-h-[120px]"
              required
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Describe your craft and practice"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#8B694D] mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-3 border border-[#cfb99d] dark:border-[#2e241d] bg-white dark:bg-[#1A1410] outline-none focus:border-[#B56A3E]"
              required
              value={form.years_of_experience}
              onChange={(e) =>
                setForm({ ...form, years_of_experience: e.target.value })
              }
              placeholder="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B56A3E] hover:bg-[#9f5730] transition text-white py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <UserPlus size={18} />
            {loading ? "Submitting..." : "Submit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
