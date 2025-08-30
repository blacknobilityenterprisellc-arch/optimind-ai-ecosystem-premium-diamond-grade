"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Bot, 
  FileText, 
  Bell,
  UserPlus,
  UserMinus,
  Send,
  Heart,
  Share2,
  Zap
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface ActivityItem {
  id: string;
  type: 'user_joined' | 'user_left' | 'message_sent' | 'ai_query' | 'system_event';
  description: string;
  timestamp: Date;
  userId?: string;
  data?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: Date;
}

export function ActivityFeed() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    // Receive initial data
    socketInstance.on("initial_data", (data) => {
      setActivities(data.activities || []);
      setUserCount(data.userCount || 0);
    });

    // Listen for new activities
    socketInstance.on("new_activity", (activity: ActivityItem) => {
      setActivities(prev => [activity, ...prev].slice(0, 50));
    });

    // Listen for user count updates
    socketInstance.on("user_count", (count: number) => {
      setUserCount(count);
    });

    // Listen for active users updates
    socketInstance.on("active_users", (users: User[]) => {
      setActiveUsers(users);
    });

    // Listen for user joined events
    socketInstance.on("user_joined", (user: User) => {
      setActiveUsers(prev => [...prev, user]);
    });

    // Listen for user left events
    socketInstance.on("user_left", (data) => {
      setActiveUsers(prev => prev.filter(user => user.id !== data.userId));
    });

    // Listen for notifications
    socketInstance.on("notification", (notification) => {
      // Show toast notification
      console.log("Notification:", notification);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleJoin = () => {
    if (socket && userName.trim() && userEmail.trim()) {
      socket.emit("user_join", {
        name: userName.trim(),
        email: userEmail.trim(),
      });
      setHasJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (socket && hasJoined) {
      const message = `Hello from ${userName}! This is a test message.`;
      socket.emit("message", {
        text: message,
        type: "user",
      });
    }
  };

  const handleSendAIQuery = () => {
    if (socket && hasJoined) {
      const query = `Can you help me understand the current system status?`;
      socket.emit("message", {
        text: query,
        type: "ai",
      });

      // Simulate AI response after a delay
      setTimeout(() => {
        socket.emit("ai_response", {
          queryId: Date.now().toString(),
          response: "I can help you understand the system status! Currently, there are " + userCount + " active users connected to the platform. The system is running smoothly with real-time updates enabled.",
        });
      }, 2000);
    }
  };

  const handleSendNotification = () => {
    if (socket && hasJoined) {
      socket.emit("system_notification", {
        title: "System Update",
        message: "New features have been added to the platform!",
        type: "success",
      });
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_joined':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'user_left':
        return <UserMinus className="w-4 h-4 text-red-500" />;
      case 'message_sent':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'ai_query':
        return <Bot className="w-4 h-4 text-purple-500" />;
      case 'system_event':
        return <Zap className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!hasJoined) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Join Real-time Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Name</label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
            />
          </div>
          <Button 
            onClick={handleJoin} 
            className="w-full"
            disabled={!userName.trim() || !userEmail.trim() || !isConnected}
          >
            {isConnected ? "Join Platform" : "Connecting..."}
          </Button>
          <div className="text-center">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Activity Feed
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Badge variant="secondary">
                {userCount} {userCount === 1 ? "User" : "Users"} Online
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Button onClick={handleSendMessage} variant="outline" size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button onClick={handleSendAIQuery} variant="outline" size="sm">
              <Bot className="w-4 h-4 mr-2" />
              AI Query
            </Button>
            <Button onClick={handleSendNotification} variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </div>
          
          {activeUsers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Active Users:</h4>
              <div className="flex flex-wrap gap-2">
                {activeUsers.map((user) => (
                  <Badge key={user.id} variant="outline">
                    {user.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No activities yet. Be the first to interact!
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}