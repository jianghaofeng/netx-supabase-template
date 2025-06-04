"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/react";
import I18nProvider from "@/lib/i18n-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </I18nProvider>
    </NextThemesProvider>
  );
}