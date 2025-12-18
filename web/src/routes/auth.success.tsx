import { createFileRoute } from "@tanstack/react-router";
import { AuthSuccess } from "@/app/auth";

export const Route = createFileRoute("/auth/success")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthSuccess />;
}
