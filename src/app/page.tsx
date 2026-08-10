import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import Collections from "@/components/sections/Collections";
import Catalog from "@/components/sections/Catalog";
import Customizer from "@/components/sections/Customizer";
import Benefits from "@/components/sections/Benefits";
import Gallery from "@/components/sections/Gallery";
import OrderProcess from "@/components/sections/OrderProcess";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />
      <Collections />
      <Catalog />

      <Customizer />

      <Benefits />
      <Gallery />
      <OrderProcess />
      <About />
      <Contact />

      <Footer />
    </main>
  );
}