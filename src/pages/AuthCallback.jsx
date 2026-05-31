import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import * as api from "../api/api";

export default function AuthCallback() {

  const navigate = useNavigate();

  useEffect(() => {

    const finishLogin = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const storedForm = localStorage.getItem(
        "artisan_registration"
      );

      if (!storedForm) {
        navigate("/");
        return;
      }

      const form = JSON.parse(storedForm);

      try {

        await api.registerArtisan({
          ...form,
          email: user.email,
          supabase_id: user.id,
        });

        localStorage.removeItem(
          "artisan_registration"
        );

        navigate("/artisan-dashboard");

      } catch (err) {
        console.error(err);
      }
    };

    finishLogin();

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  );
}