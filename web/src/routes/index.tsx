import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider";
import HomePage from "@/app/home";
import LoadingSpinner from "@/components/LoadingSpinner";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <HomePage />;
}
