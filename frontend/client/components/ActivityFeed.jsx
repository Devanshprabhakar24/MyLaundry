import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, UserPlus, PackagePlus, Zap } from "lucide-react";

const iconMap = {
  new_user: <UserPlus className="h-4 w-4" />,
  new_order: <PackagePlus className="h-4 w-4" />,
  status_update: <Zap className="h-4 w-4" />,
};

const colorMap = {
  new_user: "bg-blue-100 text-blue-800",
  new_order: "bg-green-100 text-green-800",
  status_update: "bg-yellow-100 text-yellow-800",
};

export default function ActivityFeed({ activities, isLoading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-laundry-blue" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading activities...</p>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity._id} className="flex items-start gap-3">
                <Badge variant="secondary" className={colorMap[activity.type]}>
                  {iconMap[activity.type]}
                </Badge>
                <div>
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent activity to display.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}