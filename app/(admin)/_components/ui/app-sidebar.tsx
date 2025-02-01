"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Store,
} from "lucide-react";

import { NavMain } from "@/app/(admin)/_components/ui/nav-main";
import { NavProjects } from "@/app/(admin)/_components/ui/nav-projects";
import { NavUser } from "@/app/(admin)/_components/ui/nav-user";
import { TeamSwitcher } from "@/app/(admin)/_components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Evil Corp.",
      logo: AudioWaveform,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Shops",
      url: "/dashboard/shop",
      icon: Store,
      items: [
        {
          title: "Shop",
          url: "/dashboard/shop",
        },
        {
          title: "Shop category",
          url: "/dashboard/shop/category",
        },
      ],
    },
    {
      title: "Products",
      url: "/dashboard/product",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "Product",
          url: "/dashboard/product",
        },
        {
          title: "Product category",
          url: "/dashboard/product/category",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile] = api.user.getMyProfile.useSuspenseQuery();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooter>
          <NavUser
            name={profile?.name as string}
            email={profile?.email as string}
            avatar={profile?.image as string}
          />
        </SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
