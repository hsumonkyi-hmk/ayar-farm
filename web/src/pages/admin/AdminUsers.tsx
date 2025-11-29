import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { USER_TYPES } from "@/constants/user";
import usersService from "@/services/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
  const { user, token } = useAuth();
  const { socket } = useSocket(token || undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersService.getAll();
        setUsers(res.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_type === USER_TYPES.ADMIN) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("get-online-users");

    socket.on("online-users", (userIds: string[]) => {
      setOnlineUsers(new Set(userIds));
    });

    socket.on("user-online", (userId: string) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on("user-offline", (userId: string) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.off("online-users");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [socket, users]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button disabled size="sm" className="bg-foreground text-background">
          <Spinner />
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      onlineUsers.has(u.id) ? "bg-green-500" : "bg-gray-300"
                    }`}
                    title={onlineUsers.has(u.id) ? "Online" : "Offline"}
                  />
                </TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.phone_number}</TableCell>
                <TableCell>{u.email || "-"}</TableCell>
                <TableCell>{u.user_type}</TableCell>
                <TableCell>{u.isVerified ? "✓" : "✗"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
