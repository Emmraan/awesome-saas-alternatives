import { FolderX } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CategoryNotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
      <EmptyState
        title="Category not found"
        description="We couldn't find that category — it may have been renamed or removed."
        action={{ label: "Browse all categories", href: "/categories" }}
        icon={FolderX}
      />
    </div>
  );
}