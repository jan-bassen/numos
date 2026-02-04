import "../ui/styles.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/utils";
import localFont from "next/font/local";
import type { CssVariable } from "next/dist/compiled/@next/font";
import { Suspense } from "react";
import PostHogPageView from "@/lib/posthog/posthog-pageview";
import Providers from "@/app/(providers)/external-providers";
import CookieBanner from "@/lib/posthog/cookie-banner";
import { Maintanance } from "@/app/maintanance";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { User } from "@/lib/auth";

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

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    user = session?.user ?? null;
  } catch {
    // no-op: allow rendering without auth configured
  }
  
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
            <Providers user={user}>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              {children}
              <CookieBanner isLoggedIn={!!user} />
              <Toaster position="bottom-right" richColors />
            </Providers>
          </>
        )}
      </body>
    </html>
  );
}
