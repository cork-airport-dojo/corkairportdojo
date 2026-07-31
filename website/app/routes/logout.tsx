import { useEffect } from "react";
import { supabase } from "~/lib/supabase/browser";

export default function LogoutRoute() {
  useEffect(() => {
    supabase.auth.signOut().then(() => {
      window.location.assign("/");
    });
  }, []);
  return null;
}