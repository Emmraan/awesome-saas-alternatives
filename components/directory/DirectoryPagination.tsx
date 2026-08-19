"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { buildDirectoryUrl, type DirectoryState } from "@/lib/directory";

export function DirectoryPagination({
  state,
  totalPages,
  basePath = "/alternatives",
}: {
  state: DirectoryState;
  totalPages: number;
  basePath?: string;
}) {
  const router = useRouter();

  return (
    <Pagination
      page={state.page}
      totalPages={totalPages}
      onPageChange={(page) =>
        router.push(buildDirectoryUrl({ ...state, page }, basePath))
      }
    />
  );
}