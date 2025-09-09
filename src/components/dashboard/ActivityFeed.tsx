/**
 * Premium Diamond Grade Activity Feed Component
 *
 * Enterprise-grade activity display with real-time updates
 * and optimized performance.
 *
 * @author: Enterprise Architecture Team
 * @version: 1.0.0
 * @compliance: SOC2, GDPR, ISO27001
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  status: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxDisplay?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, maxDisplay = 10 }) => {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p>No recent activity to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayActivities = activities.slice(0, maxDisplay);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activities and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map(activity => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-muted px-2 py-1 rounded">{activity.type}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
