import { AuthButton } from "@/components/auth-button";
import { Autocomplete } from "@/components/autocomplete";
import { client } from "@/lib/typesense";
import { cn } from "@/lib/utils";

function MainNav() {
  return (
    <header
      className={cn(
        "bg-background/80 border-muted fixed top-0 right-0 left-0 z-50 border-b border-dashed backdrop-blur-sm",
      )}
    >
      <div className="flex max-w-screen items-center justify-between px-4 py-2.5 sm:px-6">
        <a
          href="https://typesense.org/"
          target="_blank"
          rel="noopener noreferrer"
          id="typesenseLink"
          className="text-foreground text-center text-xl transition-colors"
        >
          t<b>s</b>|
        </a>
        <Autocomplete client={client} />
        <AuthButton />
      </div>
    </header>
  );
}

export { MainNav };
