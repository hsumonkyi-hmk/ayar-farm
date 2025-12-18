import { createFileRoute } from "@tanstack/react-router";
import { AuthConfirm } from "@/app/auth";

export const Route = createFileRoute("/auth/confirm")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthConfirm />;
}