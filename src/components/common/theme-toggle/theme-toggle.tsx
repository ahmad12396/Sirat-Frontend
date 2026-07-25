"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { THEMES } from "@/constants/theme";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === THEMES.DARK;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? THEMES.LIGHT : THEMES.DARK)}
    >
      {/* Both icons render always; CSS (driven by the .dark class next-themes
          sets on <html>) picks the right one — avoids a JS-driven mounted
          state, which would need setState-in-effect and still flash on
          hydration. */}
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  );
}
