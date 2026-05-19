import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { NexusFrame } from "@/components/NexusFrame";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        position: "fixed", inset: 0, display: "grid", placeItems: "center",
        background: "#0a0a0c", color: "#9a9aa3",
        fontFamily: "'IBM Plex Sans',system-ui,sans-serif", fontSize: 13, letterSpacing: 1,
      }}>
        CARREGANDO...
      </div>
    );
  }

  if (!session) return <Navigate to="/login" />;

  return <NexusFrame />;
}
