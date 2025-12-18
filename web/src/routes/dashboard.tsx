import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Navigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider.tsx";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.user_type !== "ADMIN") {
    return <Navigate to="/auth/unauthorized" />;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Quick Actions Section */}
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">
                        User Management
                      </h3>
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage users, roles, and permissions
                    </p>
                    <button
                      onClick={() => router.navigate({ to: "/admin/users" })}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Users
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">
                        Video Content
                      </h3>
                      <div className="p-2 bg-green-500 rounded-lg">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage promotional videos
                    </p>
                    <button
                      onClick={() => router.navigate({ to: "/admin/videos" })}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Manage Videos
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">
                        Applications
                      </h3>
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage mobile & desktop apps
                    </p>
                    <button
                      onClick={() =>
                        router.navigate({ to: "/admin/applications" })
                      }
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Manage Apps
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">Settings</h3>
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      System configuration
                    </p>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Manage Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
