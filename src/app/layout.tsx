import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";

import "./globals.css";

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
    title: "Playeras El Güero | Diseños que representan tu pasión",
    description:
      "Diseños exclusivos y playeras personalizadas. Explora nuestro catálogo y cotiza directamente por WhatsApp.",
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
    title: "Playeras El Güero",
    description:
      "Diseños exclusivos y playeras personalizadas en México.",
    images: ["/images/hero/hero-shirt.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body
        className={`${montserrat.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}