import { createFileRoute } from "@tanstack/react-router";
import { AuthError } from "@/app/auth";

export const Route = createFileRoute("/auth/error")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthError />;
}
