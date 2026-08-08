export type Product = {
  slug: string;
  name: string;
  line: string;
  subtitle: string;
  image: string;
  color: string;
  sizes: string[];
  description: string;
};

const standardSizes = ["CH", "M", "G", "XG", "2XG"];

// ======================================================
// CATÁLOGO DE PLAYERAS EL GÜERO
// ======================================================

export const products: Product[] = [
  // ====================================================
  // BLANCOS
  // ====================================================

  {
    slug: "blancos-01",
    name: "Blancos 01",
    line: "Blancos",
    subtitle: "Red Pyle",
    image: "/images/products/blancos-01.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño Red Pyle con una composición moderna, limpia y exclusiva.",
  },

  // ====================================================
  // BROWN RED
  // ====================================================

  {
    slug: "brown-red-01",
    name: "Brown Red 01",
    line: "Brown Red",
    subtitle: "Brown Red",
    image: "/images/products/brown-red-01.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño inspirado en Brown Red con tonos intensos y una estética moderna.",
  },

  {
    slug: "brown-red-02",
    name: "Brown Red 02",
    line: "Brown Red",
    subtitle: "Gallo",
    image: "/images/products/brown-red-02.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Una propuesta gráfica de gran presencia inspirada en la identidad gallera.",
  },

  {
    slug: "brown-red-03",
    name: "Brown Red 03",
    line: "Brown Red",
    subtitle: "Warehouse",
    image: "/images/products/brown-red-03.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño Brown Red con una composición urbana, fuerte y contemporánea.",
  },

  // ====================================================
  // HATCH
  // ====================================================

  {
    slug: "hatch-01",
    name: "Hatch 01",
    line: "Hatch",
    subtitle: "Hatch McLean",
    image: "/images/products/hatch-01.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño inspirado en Hatch McLean con una estética intensa y exclusiva.",
  },

  {
    slug: "hatch-02",
    name: "Hatch 02",
    line: "Hatch",
    subtitle: "Hatch McLean",
    image: "/images/products/hatch-02.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Una composición gráfica Hatch con personalidad, carácter y presencia.",
  },

  {
    slug: "hatch-03",
    name: "Hatch 03",
    line: "Hatch",
    subtitle: "Hatch",
    image: "/images/products/hatch-03.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño Hatch con una combinación moderna de ilustración y tipografía.",
  },

  {
    slug: "hatch-04",
    name: "Hatch 04",
    line: "Hatch",
    subtitle: "Hatch",
    image: "/images/products/hatch-04.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Una propuesta Hatch de estilo urbano con una composición limpia y llamativa.",
  },

  {
    slug: "hatch-05",
    name: "Hatch 05",
    line: "Hatch",
    subtitle: "Yellow Leg",
    image: "/images/products/hatch-05.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño de gran detalle visual inspirado en la tradición Yellow Leg.",
  },

  // ====================================================
  // KELSO
  // ====================================================

  {
    slug: "kelso-01",
    name: "Kelso 01",
    line: "Kelso",
    subtitle: "Walter A. Kelso",
    image: "/images/products/kelso-01.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño inspirado en la línea Kelso con una estética fuerte, moderna y exclusiva.",
  },

  {
    slug: "kelso-02",
    name: "Kelso 02",
    line: "Kelso",
    subtitle: "White Kelso",
    image: "/images/products/kelso-02.png",
    color: "Blanco",
    sizes: standardSizes,
    description:
      "Diseño White Kelso sobre playera blanca con una estética moderna y diferente.",
  },

  // ====================================================
  // REGULAR GREY
  // ====================================================

  {
    slug: "regular-grey-01",
    name: "Regular Grey 01",
    line: "Regular Grey",
    subtitle: "Larry Romero",
    image: "/images/products/regular-grey-01.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño Regular Grey reinterpretado con una estética premium y contemporánea.",
  },

  {
    slug: "regular-grey-02",
    name: "Regular Grey 02",
    line: "Regular Grey",
    subtitle: "Regular Grey",
    image: "/images/products/regular-grey-02.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Una composición Regular Grey con efectos intensos y gran presencia visual.",
  },

  {
    slug: "regular-grey-03",
    name: "Regular Grey 03",
    line: "Regular Grey",
    subtitle: "Clement",
    image: "/images/products/regular-grey-03.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño inspirado en Clement con una composición azul de estilo moderno.",
  },

  {
    slug: "regular-grey-04",
    name: "Regular Grey 04",
    line: "Regular Grey",
    subtitle: "Giro",
    image: "/images/products/regular-grey-04.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño de estética urbana inspirado en el gallo giro y su identidad visual.",
  },

  // ====================================================
  // ROUND HEAD
  // ====================================================

  {
    slug: "round-head-01",
    name: "Round Head 01",
    line: "Round Head",
    subtitle: "Gary Gilliam",
    image: "/images/products/round-head-01.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Una propuesta visual fuerte y moderna inspirada en la línea Round Head.",
  },

  // ====================================================
  // SWEATER
  // ====================================================

  {
    slug: "sweater-01",
    name: "Sweater 01",
    line: "Sweater",
    subtitle: "Carol Nesmith",
    image: "/images/products/sweater-01.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño urbano inspirado en Sweater con una composición moderna y llamativa.",
  },

  {
    slug: "sweater-02",
    name: "Sweater 02",
    line: "Sweater",
    subtitle: "Johnny Jumper",
    image: "/images/products/sweater-02.png",
    color: "Negro",
    sizes: standardSizes,
    description:
      "Diseño inspirado en Sweater con una composición clásica reinterpretada en estilo urbano.",
  },
];