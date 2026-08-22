"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:border-red-500/40 hover:text-white"
    >
      Cerrar sesión
    </button>
  );
}