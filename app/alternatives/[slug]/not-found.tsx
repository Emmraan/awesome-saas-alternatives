import { PackageX } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductNotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
      <EmptyState
        title="Product not found"
        description="We couldn't find that product in the directory — it may have been renamed or removed."
        action={{ label: "Browse all alternatives", href: "/alternatives" }}
        icon={PackageX}
      />
    </div>
  );
}