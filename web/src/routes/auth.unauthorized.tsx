import { createFileRoute } from "@tanstack/react-router";
import { UnauthorizedPage } from "@/app/auth";

export const Route = createFileRoute("/auth/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UnauthorizedPage />;
}
