import AdminApplicationsPage from "@/app/admin/applications";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/applications")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminApplicationsPage />;
}
