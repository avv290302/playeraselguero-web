import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Collections from "@/components/sections/Collections";
import Catalog from "@/components/sections/Catalog";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Collections />
      <Catalog />
    </main>
  );
}