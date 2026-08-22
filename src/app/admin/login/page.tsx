"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(
        "No pudimos iniciar sesión. Si todavía no has creado una contraseña para este panel, utiliza la opción de recuperar contraseña."
      );

      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  async function handlePasswordRecovery() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage(
        "Primero escribe tu correo electrónico en el campo de arriba."
      );
      return;
    }

    setRecovering(true);

    const supabase = createClient();

    const origin = window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${origin}/auth/callback?next=/admin/reset-password`,
      }
    );

    if (error) {
      setErrorMessage(
        "No fue posible enviar el correo de recuperación. Inténtalo nuevamente."
      );

      setRecovering(false);
      return;
    }

    setSuccessMessage(
      "Te enviamos un correo. Revisa tu bandeja de entrada y también la carpeta de spam."
    );

    setRecovering(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 py-12 text-white">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[160px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo/logo.png"
              alt="Playeras El Güero"
              width={120}
              height={120}
              className="mx-auto h-auto w-28 object-contain"
              priority
            />
          </Link>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.35em] text-red-500">
            Playeras El Güero
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide">
            Administración
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Acceso exclusivo para administradores autorizados.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-7 shadow-2xl"
        >
          <div>
            <label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500"
            />
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm leading-6 text-green-400">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || recovering}
            className="mt-7 w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Entrar al panel"}
          </button>

          <button
            type="button"
            onClick={handlePasswordRecovery}
            disabled={loading || recovering}
            className="mt-4 w-full rounded-xl border border-white/10 px-6 py-4 text-sm font-bold text-zinc-400 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {recovering
              ? "Enviando correo..."
              : "Crear o recuperar contraseña"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Volver a Playeras El Güero
          </Link>
        </div>
      </div>
    </main>
  );
}