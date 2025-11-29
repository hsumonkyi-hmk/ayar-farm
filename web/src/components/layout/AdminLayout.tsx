import { Outlet } from 'react-router-dom';
import { Home, Users, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AccessDenied } from '../AccessDenied';
import { USER_TYPES } from '../../constants/user';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../ui/sidebar';

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: Home },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Notifications', url: '/admin/notifications', icon: Bell },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  if (user?.user_type !== USER_TYPES.ADMIN) {
    return <AccessDenied />;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="/admin">
                  <span className="text-base font-semibold text-green-600">AyarFarm Admin</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser 
            user={{ 
              name: user?.name || '', 
              email: user?.email || undefined,
              avatar: user?.profile_picture || undefined 
            }} 
            onLogout={logout} 
          />
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-8 w-full">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
