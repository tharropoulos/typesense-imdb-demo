import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} title={`Current theme: ${theme}. Click to toggle.`}>
      {/* Light mode icon */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "light" || (theme === "system" && document.documentElement.classList.contains("light")) ?
            "scale-100 rotate-0"
          : "absolute scale-0 rotate-90"
        }`}
      />

      {/* Dark mode icon */}
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark")) ?
            "scale-100 rotate-0"
          : "absolute scale-0 rotate-90"
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
