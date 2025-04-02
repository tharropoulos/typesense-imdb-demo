import type { ReactNode } from "react";
import { FooterSection } from "@/components/footer";
import { MainNav } from "@/components/main-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Head } from "@inertiajs/react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Head title="Typesense IMDb" />
      <MainNav />
      <main className="bg-background my-12 min-h-screen">{children}</main>
      <FooterSection />
    </ThemeProvider>
  );
}

export { Layout };
