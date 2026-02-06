"use client";

import { TooltipProvider } from "@repo/ui/components/tooltip";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { SecondarySidebarProvider } from "@repo/ui/components/sidebar-secondary";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
    }
  }, [setTheme]);


  return (
      <ThemeProvider attribute="class" defaultTheme={"system"}>
        <TooltipProvider delayDuration={500} skipDelayDuration={500}>
          <SidebarProvider>
            <SecondarySidebarProvider defaultOpen>
              {children}
            </SecondarySidebarProvider>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
  );
}
