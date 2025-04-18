import { Icon, IconDashboard, IconProps, IconUsers } from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const routeToTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/player-management": "Player Management",
  "/team-management": "Team Management",
  "/team-generation": "Team Generation",
};

interface RouteDataMapTypes {
  title: string;
  slug: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

export const routeDataMap: RouteDataMapTypes[] = [
  {
    title: "Dashboard",
    slug: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Player Management",
    slug: "/player-management",
    icon: IconUsers,
  },
  {
    title: "Team Management",
    slug: "/team-management",
    icon: IconUsers,
  },
  {
    title: "Team Generation",
    slug: "/team-generation",
    icon: IconUsers,
  },
];
