"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type HeroSlide = {
  id: string;
  image_url: string;
  alt_text: string | null;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
};

const AUTOPLAY_TIME = 5000;

const FALLBACK_SLIDE: HeroSlide = {
  id: "fallback",
  image_url:
    "/images/hero/hero-shirt4.png",
  alt_text:
    "Playera personalizada Playeras El Güero",
};

export default function HeroCarousel({
  slides,
}: HeroCarouselProps) {
  const availableSlides =
    slides.length > 0
      ? slides
      : [FALLBACK_SLIDE];

  const [current, setCurrent] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const touchStartXRef =
    useRef<number | null>(
      null
    );

  /* ======================================================= */
  /* SEGURIDAD AL CAMBIAR LA CANTIDAD DE IMÁGENES */
  /* ======================================================= */

  useEffect(() => {
    if (
      current >=
      availableSlides.length
    ) {
      setCurrent(0);
    }
  }, [
    availableSlides.length,
    current,
  ]);

  /* ======================================================= */
  /* SIGUIENTE */
  /* ======================================================= */

  const nextSlide =
    useCallback(() => {
      setCurrent(
        (previous) =>
          (
            previous + 1
          ) %
          availableSlides.length
      );
    }, [
      availableSlides.length,
    ]);

  /* ======================================================= */
  /* ANTERIOR */
  /* ======================================================= */

  const previousSlide =
    useCallback(() => {
      setCurrent(
        (previous) =>
          (
            previous -
            1 +
            availableSlides.length
          ) %
          availableSlides.length
      );
    }, [
      availableSlides.length,
    ]);

  /* ======================================================= */
  /* AUTOPLAY */
  /* ======================================================= */

  useEffect(() => {
    if (
      availableSlides.length <=
        1 ||
      paused
    ) {
      return;
    }

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          nextSlide();
        },
        AUTOPLAY_TIME
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    availableSlides.length,
    nextSlide,
    paused,
  ]);

  /* ======================================================= */
  /* SWIPE MÓVIL */
  /* ======================================================= */

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartXRef.current =
      event.touches[0]?.clientX ??
      null;
  }

  function handleTouchEnd(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    const startX =
      touchStartXRef.current;

    const endX =
      event.changedTouches[0]
        ?.clientX;

    touchStartXRef.current =
      null;

    if (
      startX === null ||
      endX === undefined
    ) {
      return;
    }

    const distance =
      endX - startX;

    if (
      Math.abs(distance) <
      50
    ) {
      return;
    }

    if (distance < 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  }

  return (
    <div
      className="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl"
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      onFocusCapture={() =>
        setPaused(true)
      }
      onBlurCapture={() =>
        setPaused(false)
      }
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={
        handleTouchEnd
      }
    >
      {/* ================================================= */}
      {/* IMÁGENES */}
      {/* ================================================= */}

      {availableSlides.map(
        (
          slide,
          index
        ) => {
          const visible =
            index ===
            current;

          return (
            <img
              key={slide.id}
              src={
                slide.image_url
              }
              alt={
                slide.alt_text ||
                "Playera personalizada Playeras El Güero"
              }
              loading={
                index === 0
                  ? "eager"
                  : "lazy"
              }
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                visible
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-[1.02] opacity-0"
              }`}
            />
          );
        }
      )}

      {/* SOMBRA SUAVE */}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {/* ================================================= */}
      {/* FLECHAS */}
      {/* ================================================= */}

      {availableSlides.length >
        1 && (
        <>
          <button
            type="button"
            onClick={
              previousSlide
            }
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white backdrop-blur-md transition hover:border-white/40 hover:bg-black/80 sm:left-4"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={
              nextSlide
            }
            aria-label="Siguiente imagen"
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white backdrop-blur-md transition hover:border-white/40 hover:bg-black/80 sm:right-4"
          >
            ›
          </button>
        </>
      )}

      {/* ================================================= */}
      {/* DISEÑO EXCLUSIVO */}
      {/* ================================================= */}

      <div className="absolute bottom-3 left-3 z-20 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:px-4 sm:text-xs">
        Diseño exclusivo
      </div>

      {/* ================================================= */}
      {/* INDICADORES */}
      {/* ================================================= */}

      {availableSlides.length >
        1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
          {availableSlides.map(
            (
              slide,
              index
            ) => (
              <button
                key={
                  slide.id
                }
                type="button"
                onClick={() =>
                  setCurrent(
                    index
                  )
                }
                aria-label={`Ver imagen ${
                  index + 1
                }`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index ===
                  current
                    ? "w-7 bg-red-500"
                    : "w-2 bg-white/50 hover:bg-white"
                }`}
              />
            )
          )}
        </div>
      )}

      {/* CONTADOR */}

      {availableSlides.length >
        1 && (
        <div className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
          {current + 1} /{" "}
          {
            availableSlides.length
          }
        </div>
      )}
    </div>
  );
}