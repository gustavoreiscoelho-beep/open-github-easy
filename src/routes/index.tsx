import { createFileRoute } from "@tanstack/react-router";
import { NexusFrame } from "@/components/NexusFrame";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <NexusFrame />;
}
