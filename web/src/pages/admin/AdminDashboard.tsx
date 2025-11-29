import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { USER_TYPES } from '@/constants/user';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const { socket, connected } = useSocket(token || undefined);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket || user?.user_type !== USER_TYPES.ADMIN) return;

    socket.on('user:registered', (data: { user: { name: string; user_type: string } }) => {
      const notification: Notification = {
        id: Date.now().toString(),
        message: `New ${data.user.user_type} registered: ${data.user.name}`,
        timestamp: new Date(),
      };
      setNotifications((prev) => [notification, ...prev]);
      toast.success(`New ${data.user.user_type} registered`, {
        description: data.user.name,
      });
    });

    return () => {
      socket.off('user:registered');
    };
  }, [socket, user]);

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <span className={`px-3 py-1 rounded ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Real-time Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="border-l-4 border-green-500 bg-green-50 p-4">
                <p className="font-medium">{notif.message}</p>
                <p className="text-sm text-gray-500">{notif.timestamp.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
