"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Building2, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      Hello
      <h1>Hello</h1>
      <h2>Hello</h2>
    </div>
  );
}

// interface OverviewCardProps {
//   title: string;
//   value: number;
//   growth: string;
//   icon: React.ReactNode;
//   period: string;
// }

// function OverviewCard({
//   title,
//   value,
//   growth,
//   icon,
//   period,
// }: OverviewCardProps) {
//   const growthValue = parseFloat(growth);
//   const isPositive = growthValue >= 0;
//   const growthColor = isPositive ? "text-green-600" : "text-red-600";
//   const GrowthIcon = isPositive ? TrendingUp : TrendingDown;

//   return (
//     <Card className="overflow-hidden rounded">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         <div className="p-2 bg-background rounded-full">{icon}</div>
//       </CardHeader>
//       <CardContent className="pt-4">
//         <div className="text-3xl font-bold mb-2">{value}</div>
//         <div className={`flex items-center text-sm ${growthColor}`}>
//           <GrowthIcon className="mr-1 h-4 w-4" />
//           <span className="font-medium">{growth}%</span>
//           <span className="ml-1 text-muted-foreground">from last {period}</span>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
