"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return (
      <Button type="button" variant="outline" size="icon-sm" aria-label="Theme">
        <Monitor />
      </Button>
    );
  }

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => setTheme(nextTheme)}
    >
      {theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <Monitor />}
    </Button>
  );
}
