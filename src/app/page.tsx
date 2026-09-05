import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import Collections from "@/components/sections/Collections";
import Catalog from "@/components/sections/Catalog";

import CustomizerGate from "@/components/sections/CustomizerGate";

import Benefits from "@/components/sections/Benefits";
import Gallery from "@/components/sections/Gallery";
import OrderProcess from "@/components/sections/OrderProcess";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

type HomePageProps = {
  searchParams: Promise<{
    line?: string | string[];
  }>;
};

export default async function Home({
  searchParams,
}: HomePageProps) {
  const params =
    await searchParams;

  const requestedLine =
    Array.isArray(
      params.line
    )
      ? params.line[0]
      : params.line;

  return (
    <main>
      <Navbar />

      <Hero />

      <Collections />

      <Catalog
        activeFilter={
          requestedLine
        }
      />

      {/* 
        IMPORTANTE:

        Ya NO importamos Customizer aquí.

        La página inicial solamente carga
        CustomizerGate, que es extremadamente
        ligero.

        Three.js, Fabric.js y el modelo 3D
        se cargarán únicamente cuando el
        usuario pulse "Abrir personalizador".
      */}

      <CustomizerGate />

      <Benefits />

      <Gallery />

      <OrderProcess />

      <About />

      <Contact />

      <Footer />
    </main>
  );
}