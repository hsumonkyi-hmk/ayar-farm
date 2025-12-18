import { createFileRoute, Navigate } from "@tanstack/react-router";
import AdminFisheriesPage from "@/app/categories/fisheries-page";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/category/fisheries")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.user_type !== "ADMIN") {
    return <Navigate to="/auth/unauthorized" />;
  }

  return <AdminFisheriesPage />;
}
