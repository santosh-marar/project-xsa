"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Settings2,
  Shirt,
  SquareTerminal,
  Store,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
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
      url: "/seller",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/seller",
        },
      ],
    },
    {
      title: "Shops",
      url: "/seller/shop",
      icon: Store,
      items: [
        {
          title: "Shop",
          url: "/seller/shop",
        },
      ],
    },
    {
      title: "Products",
      url: "/seller/product",
      icon: Shirt,
      items: [
        {
          title: "Product",
          url: "/seller/product",
        },
        {
          title: "Product Variation",
          url: "/seller/product/variation",
        },
      ],
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
