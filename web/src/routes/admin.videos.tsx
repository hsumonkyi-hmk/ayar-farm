import AdminVideosPage from "@/app/admin/videos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/videos")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminVideosPage />;
}
