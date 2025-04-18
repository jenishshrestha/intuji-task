"use client";

import { usePathname } from "next/navigation";
import { routeDataMap } from "@/lib/routeToTitleMap";

/**
 * hooks/usePageTitle.ts
 * @returns title of route
 */
export const usePageTitle = () => {
  const pathname = usePathname();
  const routeData = routeDataMap.find((route) => route.slug === pathname);
  const title = routeData?.title || "";
  return title;
};
