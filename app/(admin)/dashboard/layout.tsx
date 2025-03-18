import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(admin)/_components/ui/app-sidebar";
import DashboardHeader from "@/components/custom/dashboard/dashboard-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="">
          <DashboardHeader />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
