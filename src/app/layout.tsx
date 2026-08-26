import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";

import "./globals.css";

import { CartProvider } from "@/context/CartContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://playeraselguero.com"),

  title: {
    default: "Playeras El Güero | Playeras Personalizadas",
    template: "%s | Playeras El Güero",
  },

  description:
    "Playeras personalizadas y diseños exclusivos. Explora colecciones, elige tu diseño, talla y solicita tu cotización por WhatsApp.",

  keywords: [
    "Playeras El Güero",
    "playeras personalizadas",
    "playeras de gallos",
    "playeras gallos",
    "playeras galleras",
    "diseños de playeras",
    "playeras personalizadas México",
    "playeras Zacatecas",
    "Kelso",
    "Hatch",
    "Sweater",
    "Regular Grey",
    "Round Head",
    "Brown Red",
  ],

  authors: [
    {
      name: "Alejandro Venegas Villalobos",
    },
  ],

  creator: "Alejandro Venegas Villalobos",
  publisher: "Playeras El Güero",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "Playeras El Güero",
    title: "Playeras El Güero | Playeras de Gallos y Diseños Personalizados",
    description:
      "Playeras de gallos, diseños exclusivos y playeras personalizadas en México. Explora nuestro catálogo y cotiza por WhatsApp.",
    images: [
      {
        url: "/images/hero/hero-shirt.png",
        width: 1080,
        height: 1080,
        alt: "Playeras El Güero",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Playeras El Güero | Playeras de Gallos",
    description:
      "Diseños exclusivos, playeras de gallos y playeras personalizadas en México.",
    images: ["/images/hero/hero-shirt.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://playeraselguero.com/#organization",

      name: "Playeras El Güero",

      url: "https://playeraselguero.com",

      logo: {
        "@type": "ImageObject",
        url: "https://playeraselguero.com/images/logo/logo.png",
      },

      description:
        "Playeras de gallos, diseños exclusivos y playeras personalizadas en México.",

      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+52-492-223-0511",
        contactType: "sales",
        availableLanguage: ["Spanish"],
      },
    },

    {
      "@type": "WebSite",
      "@id": "https://playeraselguero.com/#website",

      url: "https://playeraselguero.com",

      name: "Playeras El Güero",

      description:
        "Catálogo de playeras de gallos, diseños exclusivos y playeras personalizadas.",

      inLanguage: "es-MX",

      publisher: {
        "@id": "https://playeraselguero.com/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body
        className={`${montserrat.variable} ${bebasNeue.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}