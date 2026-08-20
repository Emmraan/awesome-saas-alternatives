import { ProductLogo } from "@/components/ui/ProductLogo";

const LOGOS = ["Vercel", "Notion", "Zapier", "Datadog", "Auth0", "Figma", "Slack", "Airtable"];

export function LogoWall() {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Trusted by developers swapping
          </p>
          <div className="relative flex w-full items-center gap-3 overflow-hidden sm:w-auto sm:gap-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-muted/20 to-transparent sm:hidden" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-muted/20 to-transparent sm:hidden" aria-hidden="true" />
            <div className="flex items-center gap-3 sm:gap-5">
              {LOGOS.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-1.5 grayscale opacity-60 transition hover:grayscale-0 hover:opacity-100"
                  title={name}
                >
                  <ProductLogo name={name} size="sm" />
                  <span className="hidden text-xs font-medium text-muted-foreground sm:inline">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
