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
  Package,
  PieChart,
  Settings2,
  Shirt,
  SquareTerminal,
  Store,
  User,
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
      icon: Shirt,
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
      title: "Users",
      url: "/dashboard/user",
      icon: User,
      items: [
        {
          title: "User",
          url: "/dashboard/user",
        },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/order",
      icon: Package,
      items: [
        {
          title: "Order",
          url: "/dashboard/order",
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
