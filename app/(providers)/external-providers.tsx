"use client";

import { TooltipProvider } from "@repo/ui/components/tooltip";
import { ThemeProvider, useTheme } from "next-themes";
import { cookieConsentGiven } from "@/lib/posthog/cookie-banner";
import { posthog } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { SecondarySidebarProvider } from "@repo/ui/components/sidebar-secondary";
import type { User } from "@/lib/auth";

export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    if (
      !posthog.__loaded &&
      process.env.NEXT_PUBLIC_ENVIRONMENT !== "development"
    ) {
      const consent = cookieConsentGiven(!!user) === "yes";
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        persistence: consent ? "localStorage+cookie" : "memory",
        capture_pageview: false,
        capture_pageleave: true,
        loaded: (posthog) => {
          if (
            process.env.NODE_ENV === "development" ||
            process.env.ENVIRONMENT === "development"
          )
            console.log("posthog loaded");
        },
      });
      if (user) {
        posthog.identify(user.id, {
          email: user.email,
          name: user.name || null,
        });
      }
    }
  }, [user]);

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class" defaultTheme={"system"}>
        <TooltipProvider delayDuration={500} skipDelayDuration={500}>
          <SidebarProvider>
            <SecondarySidebarProvider defaultOpen>
              {children}
            </SecondarySidebarProvider>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </PostHogProvider>
  );
}
