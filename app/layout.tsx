import "../ui/styles.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/utils";
import localFont from "next/font/local";
import type { CssVariable } from "next/dist/compiled/@next/font";
import Providers from "@/app/(providers)/external-providers";
import { Maintanance } from "@/app/maintanance";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fira = localFont<CssVariable>({
  display: "swap",
  src: "../public/fonts/fira.ttf",
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "Numos",
  description: "Simplifying the creation of dynamic digital assets",
  keywords: [
    "Numos",
    "NFT",
    "Dynamic NFT",
    "NFTs",
    "Dynamic NFTs",
    "NFT Studio",
  ],
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintanance = false;
  
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${fira.variable}`}
      suppressHydrationWarning
    >
      <body className={cn(outfit.className, "relative bg-background")}>
        {maintanance ? (
          <Maintanance />
        ) : (
          <>
            <Providers>
              {children}
              <Toaster position="bottom-right" richColors />
            </Providers>
          </>
        )}
      </body>
    </html>
  );
}
