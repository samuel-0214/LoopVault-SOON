"use client";
import { ReactNode } from "react";

import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { WalletProviders } from "./wallet-provider";
import React from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <WalletProviders>{children}</WalletProviders>
      </ThemeProvider>
    </>
  );
};
