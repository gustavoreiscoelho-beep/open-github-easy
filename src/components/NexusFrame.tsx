import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function NexusFrame() {
  const { user, signOut } = useAuth();
  const db = supabase as any;
  const ref = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "syncing" | "saved">("loading");
  const lastSnapshot = useRef<string>("");
  const hydratedFor = useRef<string | null>(null);
  const iframeBusy = useRef(false);

  // Keys we must never touch — they belong to Supabase auth or other infra
  // and live in the same-origin localStorage shared with the parent app.
  const isAppKey = (k: string) =>
    !k.startsWith("sb-") &&
    !k.startsWith("supabase.") &&
    k !== "supabase.auth.token";

  const isLegacyCfoSnapshot = (snap: Record<string, string> | null) => {
    if (!snap) return false;
    const schedule = snap.nexus_schedule_v1 || "";
    const edital = snap.nexus_edital_v2 || "";
    const profile = snap.nexus_onboarding_profile || "";
    return /CFO PMDF 2026|PMDF = JMU|02\/05 a 15\/05 · CPM e CPPM/i.test(`${schedule} ${edital} ${profile}`);
  };

  // Snapshot all localStorage of iframe and persist if changed
  const pushState = async () => {
    const win = ref.current?.contentWindow;
    if (!win || !user || iframeBusy.current) return;
    try {
      const ls = win.localStorage;
      const snap: Record<string, string> = {};
      for (let i = 0; i < ls.length; i++) {
        const k = ls.key(i);
        if (k && isAppKey(k)) snap[k] = ls.getItem(k) ?? "";
      }
      const json = JSON.stringify(snap);
      if (json === lastSnapshot.current) return;
      setStatus("syncing");
      const { error } = await db
        .from("user_app_state")
        .upsert({ user_id: user.id, state: snap as any });
      if (error) throw error;
      lastSnapshot.current = json;
      setStatus("saved");
      setTimeout(() => setStatus("ready"), 1500);
    } catch (e: any) {
      console.error("sync fail", e);
      toast.error("Falha ao sincronizar");
      setStatus("ready");
    }
  };

  // Load remote state, write to iframe localStorage, then load the app
  const onLoad = async () => {
    const win = ref.current?.contentWindow;
    if (!win || !user) return;

    // First load (per user): hydrate from cloud, exactly once
    if (hydratedFor.current !== user.id) {
      hydratedFor.current = user.id;
      const { data } = await db
        .from("user_app_state")
        .select("state")
        .eq("user_id", user.id)
        .maybeSingle();
      const remote = (data?.state as Record<string, string> | null) || null;
      const remoteAppKeys = remote
        ? Object.entries(remote).filter(([k]) => isAppKey(k))
        : [];
      if (isLegacyCfoSnapshot(remote)) {
        await db.from("user_app_state").delete().eq("user_id", user.id);
        const ls = win.localStorage;
        const toRemove: string[] = [];
        for (let i = 0; i < ls.length; i++) {
          const k = ls.key(i);
          if (k && isAppKey(k)) toRemove.push(k);
        }
        toRemove.forEach((k) => ls.removeItem(k));
        lastSnapshot.current = "{}";
        setStatus("ready");
        win.location.reload();
        return;
      }

      if (remoteAppKeys.length > 0) {
        const isBusy = iframeBusy.current || win.sessionStorage.getItem("nexus_pdf_extraction_busy") === "1";
        if (isBusy) {
          setStatus("ready");
          return;
        }
        try {
          // Remove only app keys (preserve sb-* auth tokens)
          const ls = win.localStorage;
          const toRemove: string[] = [];
          for (let i = 0; i < ls.length; i++) {
            const k = ls.key(i);
            if (k && isAppKey(k)) toRemove.push(k);
          }
          toRemove.forEach((k) => ls.removeItem(k));
          for (const [k, v] of remoteAppKeys) {
            win.localStorage.setItem(k, v);
          }
          lastSnapshot.current = JSON.stringify(
            Object.fromEntries(remoteAppKeys),
          );
          // reload iframe so the app reads the restored state
          win.location.reload();
          return;
        } catch (e) {
          console.error("hydrate fail", e);
        }
      } else {
        // capture initial empty snapshot
        const ls = win.localStorage;
        const snap: Record<string, string> = {};
        for (let i = 0; i < ls.length; i++) {
          const k = ls.key(i);
          if (k && isAppKey(k)) snap[k] = ls.getItem(k) ?? "";
        }
        lastSnapshot.current = JSON.stringify(snap);
      }
      setStatus("ready");
    }
  };

  // Periodic + visibility-based sync
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(pushState, 15000);
    const onHide = () => { if (document.hidden) pushState(); };
    const onMessage = (event: MessageEvent) => {
      if (event.source !== ref.current?.contentWindow) return;
      if (event.data?.type === "nexus:busy") {
        iframeBusy.current = Boolean(event.data.value);
        if (iframeBusy.current) setStatus("ready");
        return;
      }
      if (event.data?.type === "nexus:logout") {
        (async () => {
          try {
            iframeBusy.current = true;
            await signOut();
          } catch (e) {
            console.error("logout fail", e);
          }
        })();
        return;
      }
      if (event.data?.type === "nexus:reset" && user) {
        // wipe remote snapshot so next hydrate starts empty
        (async () => {
          try {
            // Pause local sync loop so a stale push can't repopulate cloud
            iframeBusy.current = true;
            // Delete the row entirely; upsert empty is also fine, but delete
            // guarantees no leftover keys survive.
            await db
              .from("user_app_state")
              .delete()
              .eq("user_id", user.id);
            lastSnapshot.current = "{}";
            hydratedFor.current = null;
            setStatus("ready");
            // Ack iframe so it can safely reload
            ref.current?.contentWindow?.postMessage(
              { type: "nexus:reset:done" },
              "*",
            );
            // Re-enable sync after reload completes
            setTimeout(() => { iframeBusy.current = false; }, 2000);
          } catch (e) {
            console.error("reset remote fail", e);
            ref.current?.contentWindow?.postMessage(
              { type: "nexus:reset:done" },
              "*",
            );
          }
        })();
        return;
      }
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", pushState);
    window.addEventListener("message", onMessage);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", pushState);
      window.removeEventListener("message", onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0c" }}>
      <iframe
        ref={ref}
        src="/nexus/index.html"
        title="NEXUS STUDY"
        onLoad={onLoad}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
