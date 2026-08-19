import { Fragment } from "react";
import { Check, Minus } from "lucide-react";
import type { Feature, Product } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ComparisonTable({
  products,
  features,
  className,
}: {
  products: Product[];
  features: Feature[];
  className?: string;
}) {
  const groups = Array.from(new Set(features.map((f) => f.group)));

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">
          Feature comparison of {products.map((p) => p.name).join(", ")}
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 border-b border-border bg-background px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
            >
              Feature
            </th>
            {products.map((product) => (
              <th
                key={product.slug}
                scope="col"
                className="border-b border-border px-3 py-2.5 text-center text-xs font-medium text-muted-foreground"
              >
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <Fragment key={group}>
              <tr>
                <th
                  colSpan={products.length + 1}
                  scope="row"
                  className="border-b border-border bg-muted px-3 py-1.5 text-left text-xs font-medium text-muted-foreground"
                >
                  {group}
                </th>
              </tr>
              {features
                .filter((feature) => feature.group === group)
                .map((feature) => (
                  <tr key={feature.id}>
                    <td
                      className="sticky left-0 z-10 border-b border-border/60 bg-background px-3 py-2 font-medium text-foreground"
                      title={feature.description}
                    >
                      {feature.name}
                    </td>
                    {products.map((product) => {
                      const has = product.features.includes(feature.id);
                      return (
                        <td
                          key={product.slug}
                          className="border-b border-border/60 px-3 py-2 text-center"
                        >
                          <span className="sr-only">
                            {product.name}: {feature.name} —{" "}
                            {has ? "yes" : "no"}
                          </span>
                          {has ? (
                            <Check
                              className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          ) : (
                            <Minus
                              className="mx-auto h-4 w-4 text-muted-foreground/40"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}