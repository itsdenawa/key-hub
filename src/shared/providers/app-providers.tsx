"use client";

import { ThemeProvider } from "@/features/theme/theme-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ToastProvider } from "@/shared/ui/toast";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
