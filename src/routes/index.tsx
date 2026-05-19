import { createFileRoute, Navigate } from "@tanstack/react-router";
import { NexusFrame } from "@/components/NexusFrame";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        CARREGANDO...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <NexusFrame />;
}
