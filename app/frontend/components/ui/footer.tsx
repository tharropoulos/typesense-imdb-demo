import { Footer, FooterBottom, FooterColumn, FooterContent } from "@/components/ui/foot";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function FooterSection() {
  return (
    <footer className="bg-background w-full px-4">
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <LaunchUI />
                <h3 className="text-xl font-bold">Launch UI</h3>
              </div>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Product</h3>
              <a href="/" className="text-muted-foreground text-sm">
                Changelog
              </a>
              <a href="/" className="text-muted-foreground text-sm">
                Documentation
              </a>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Company</h3>
              <a href="/" className="text-muted-foreground text-sm">
                About
              </a>
              <a href="/" className="text-muted-foreground text-sm">
                Careers
              </a>
              <a href="/" className="text-muted-foreground text-sm">
                Blog
              </a>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Contact</h3>
              <a href="/" className="text-muted-foreground text-sm">
                Discord
              </a>
              <a href="/" className="text-muted-foreground text-sm">
                Twitter
              </a>
              <a href="/" className="text-muted-foreground text-sm">
                Github
              </a>
            </FooterColumn>
          </FooterContent>
          <FooterBottom>
            <div>© 2025 Mikołaj Dobrucki. All rights reserved</div>
            <div className="flex items-center gap-4">
              <a href="/">Privacy Policy</a>
              <a href="/">Terms of Service</a>
              <ModeToggle />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
