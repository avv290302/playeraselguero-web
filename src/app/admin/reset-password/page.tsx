"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    async function verifySession() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthorized(false);
        setCheckingSession(false);
        return;
      }

      setAuthorized(true);
      setCheckingSession(false);
    }

    verifySession();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Las dos contraseñas no coinciden."
      );
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setErrorMessage(
        "No fue posible guardar la contraseña. Solicita un nuevo enlace de recuperación."
      );

      setLoading(false);
      return;
    }

    setSuccessMessage(
      "Contraseña creada correctamente. Entrando al panel..."
    );

    setTimeout(() => {
      router.replace("/admin");
      router.refresh();
    }, 1200);
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
        <p className="text-zinc-400">
          Verificando enlace...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 text-center">
          <h1 className="text-2xl font-bold">
            Enlace no válido o vencido
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Regresa al inicio de sesión y solicita
            nuevamente el correo de recuperación.
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace("/admin/login")
            }
            className="mt-7 rounded-xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wider"
          >
            Volver al login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 py-12 text-white">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[160px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/images/logo/logo.png"
            alt="Playeras El Güero"
            width={110}
            height={110}
            className="mx-auto h-auto w-24 object-contain"
          />

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            Playeras El Güero
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase">
            Nueva contraseña
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Crea la contraseña que utilizarás para
            acceder al panel de administración.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-7"
        >
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Nueva contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-red-500"
            />
          </div>

          <div className="mt-6">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Confirmar contraseña
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-red-500"
            />
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wider transition hover:bg-red-500 disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </main>
  );
}