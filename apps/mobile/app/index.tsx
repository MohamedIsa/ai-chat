import { useEffect } from "react";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { AppLoader } from "@/components/ui";

export default function Index() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/(app)/conversations");
      } else {
        router.replace("/(auth)/login");
      }
    });
  }, []);

  return <AppLoader />;
}
