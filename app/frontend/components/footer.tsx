import { ModeToggle } from "@/components/mode-toggle";
import { Footer, FooterBottom, FooterColumn, FooterContent } from "@/components/ui/footer";
import { SiSlack, SiX } from "@icons-pack/react-simple-icons";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";

export function FooterSection() {
  return (
    <footer className="w-full border-t px-4 sm:px-6 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="max-w-container mx-auto">
        <Footer className="dark:bg-zinc-950">
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-2">
              <div className="flex flex-col items-start gap-2">
                <a
                  href="https://typesense.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="typesenseLink"
                  className="text-center text-2xl"
                >
                  type<b>sense</b>|
                </a>
                <p className="text-muted-foreground text-center text-sm">
                  Fast, open source, typo-tolerant search engine
                </p>
                <div className="mt-4 flex gap-2">
                  <a href="https://twitter.com/typesense" className="flex cursor-pointer items-center">
                    <SiX className="h-5" />
                  </a>
                  <a href="https://typesense.link/slack-community" className="flex cursor-pointer items-center">
                    <SiSlack className="h-5" />
                  </a>
                  <a href="https://www.linkedin.com/company/typesense" className="h-6 cursor-pointer">
                    <LinkedInLogoIcon className="h-full w-full" />
                  </a>
                </div>
              </div>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Open Source</h3>
              <a
                href="https://github.com/typesense/typesense"
                className="text-muted-foreground text-sm hover:underline"
              >
                GitHub Repo
              </a>
              <a
                href="https://typesense.org/docs/latest/api/"
                className="text-muted-foreground text-sm hover:underline"
              >
                Changelog
              </a>
              <a href="https://typesense.org/docs/" className="text-muted-foreground text-sm hover:underline">
                Documentation
              </a>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Typesense Cloud</h3>
              <a
                href="https://calendly.com/typesense-team/typesense-demo"
                className="text-muted-foreground text-sm hover:underline"
              >
                Schedule a Demo
              </a>
              <a
                href="https://cloud.typesense.org/support-plans"
                className="text-muted-foreground text-sm hover:underline"
              >
                Support
              </a>
              <a href="https://cloud.typesense.org/pricing" className="text-muted-foreground text-sm hover:underline">
                Pricing
              </a>
            </FooterColumn>
          </FooterContent>
          <FooterBottom className="flex justify-between">
            <div className="flex items-center gap-3">
              <p>{new Date().getFullYear()} </p>
              <div className="flex flex-col gap-1 border-l px-3">
                <p className="text-foreground font-semibold">Typesense, Inc. </p>
                <p>Houston, TX</p>
              </div>
            </div>
            <ModeToggle />
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
