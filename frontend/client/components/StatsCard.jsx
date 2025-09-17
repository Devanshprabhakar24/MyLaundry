import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({ title, value, colorClass }) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
        <div className="text-sm text-laundry-gray">{title}</div>
      </CardContent>
    </Card>
  );
}