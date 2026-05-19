import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Entrar — NEXUS STUDY" }] }),
});

function LoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/" />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Conta criada. Entrando...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta.");
      }
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Falha ao entrar");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Falha ao entrar com Google");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="nx-shell">
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div className="nx-orb nx-o1" />
      <div className="nx-orb nx-o2" />
      <div className="nx-grid" />
      <div className="nx-vignette" />

      <div className="nx-card">
        <div className="nx-accent" />

        <header className="nx-hdr">
          <div className="nx-brand">
            <div className="nx-logo">NX</div>
            <div>
              <div className="nx-title">OPERAÇÃO APROVAÇÃO</div>
              <div className="nx-sub">NEXUS STUDY · Universal</div>
            </div>
          </div>
          <div className="nx-counter">
            {mode === "signin" ? "ACESSO" : "NOVA CONTA"}
          </div>
        </header>

        <div className="nx-body">
          <div className="nx-phase">{mode === "signin" ? "Etapa 1 · Identificação" : "Etapa 1 · Cadastro"}</div>

          <h1 className="nx-h1">
            {mode === "signin" ? "Acesse seu painel" : "Crie sua conta"}
          </h1>
          <p className="nx-lead">
            {mode === "signin"
              ? "Continue sua jornada de aprovação. Seus dados ficam sincronizados em todos os dispositivos."
              : "Em segundos. Salve seu progresso na nuvem e estude de qualquer lugar."}
          </p>

          <button className="nx-google" onClick={onGoogle} disabled={busy} type="button">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.1 44 24c0-1.3-.1-2.4-.4-3.5z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="nx-divider"><span>OU COM E-MAIL</span></div>

          <form onSubmit={onSubmit} className="nx-form">
            {mode === "signup" && (
              <label className="nx-field">
                <span>Nome</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos te chamar?" />
              </label>
            )}
            <label className="nx-field">
              <span>E-mail</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
            </label>
            <label className="nx-field">
              <span>Senha</span>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </label>

            <button className="nx-cta" disabled={busy} type="submit">
              <span>{busy ? "PROCESSANDO..." : mode === "signin" ? "ENTRAR" : "CRIAR CONTA"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </form>

          <button
            type="button"
            className="nx-switch"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Primeira vez aqui? Criar conta gratuita"
              : "Já tenho conta · Entrar"}
          </button>
        </div>

        <footer className="nx-foot">
          <span className="nx-foot-dot" />
          <span>SISTEMA SEGURO · DADOS CRIPTOGRAFADOS</span>
        </footer>
      </div>
    </div>
  );
}

const styles = `
:root{
  --nx-s0:#05070E; --nx-s1:#090C17; --nx-s2:#0E1120; --nx-s3:#131728; --nx-s4:#1A2035;
  --nx-bd:#1A2438; --nx-bd-strong:#263050;
  --nx-gold:#E8B84B; --nx-gold-bright:#F5CC6A; --nx-gold-deep:#7A5E1F;
  --nx-blue:#4D9FFF;
  --nx-text:#C8D0E0; --nx-muted:#4A5A70; --nx-dim:#28344A;
  --nx-fd:'Bebas Neue',sans-serif; --nx-fb:'IBM Plex Sans',system-ui,sans-serif; --nx-fm:'IBM Plex Mono',monospace;
}
.nx-shell{position:fixed;inset:0;background:var(--nx-s0);color:var(--nx-text);font-family:var(--nx-fb);display:flex;align-items:center;justify-content:center;overflow:hidden;padding:16px}
.nx-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(90px)}
.nx-o1{width:480px;height:480px;background:rgba(232,184,75,0.10);top:-200px;left:-200px;animation:nxOrb 18s ease-in-out infinite alternate}
.nx-o2{width:380px;height:380px;background:rgba(77,159,255,0.06);bottom:-160px;right:-160px;animation:nxOrb 24s ease-in-out infinite alternate-reverse}
@keyframes nxOrb{0%{transform:translate(0,0) scale(1)}100%{transform:translate(28px,18px) scale(1.05)}}
.nx-grid{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(232,184,75,0.09) 1px,transparent 1px);background-size:36px 36px;opacity:.28;pointer-events:none}
.nx-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 30%,rgba(5,7,14,.7) 100%);pointer-events:none}

.nx-card{position:relative;z-index:1;width:min(480px,100%);background:var(--nx-s1);border:1px solid var(--nx-bd);border-radius:22px;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(232,184,75,.05);display:flex;flex-direction:column;overflow:hidden;animation:nxIn .48s cubic-bezier(.16,1,.3,1)}
@keyframes nxIn{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}

.nx-accent{height:3px;background:linear-gradient(90deg,var(--nx-gold-deep),var(--nx-gold),var(--nx-gold-bright),var(--nx-gold));background-size:200% 100%;animation:nxShim 3s linear infinite}
@keyframes nxShim{0%{background-position:200% 0}100%{background-position:-200% 0}}

.nx-hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 26px 0}
.nx-brand{display:flex;align-items:center;gap:12px}
.nx-logo{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--nx-gold),var(--nx-gold-deep));display:flex;align-items:center;justify-content:center;font-family:var(--nx-fd);font-size:13px;color:var(--nx-s0);box-shadow:0 4px 14px rgba(232,184,75,.3);letter-spacing:1px}
.nx-title{font-family:var(--nx-fd);font-size:15px;letter-spacing:2.5px;color:var(--nx-gold);line-height:1}
.nx-sub{font-size:9px;color:var(--nx-muted);letter-spacing:1.8px;text-transform:uppercase;margin-top:5px}
.nx-counter{font-family:var(--nx-fm);font-size:10px;color:var(--nx-muted);letter-spacing:1.5px;border:1px solid var(--nx-bd);padding:5px 10px;border-radius:6px}

.nx-body{padding:22px 28px 16px}
.nx-phase{font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--nx-dim);margin-bottom:8px}
.nx-h1{font-family:var(--nx-fd);font-size:34px;letter-spacing:1.5px;margin:0 0 6px;color:#fff;line-height:1.05}
.nx-lead{color:var(--nx-muted);font-size:13px;margin:0 0 22px;line-height:1.55}

.nx-google{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--nx-s2);border:1px solid var(--nx-bd-strong);color:var(--nx-text);padding:12px;border-radius:9px;font-weight:500;cursor:pointer;font-size:13px;font-family:var(--nx-fb);transition:all .18s}
.nx-google:hover{background:var(--nx-s3);border-color:var(--nx-gold);box-shadow:0 0 0 3px rgba(232,184,75,.07)}
.nx-google:disabled{opacity:.5;cursor:not-allowed}

.nx-divider{display:flex;align-items:center;gap:14px;color:var(--nx-dim);font-size:9px;letter-spacing:2.5px;font-family:var(--nx-fm);margin:18px 0}
.nx-divider::before,.nx-divider::after{content:"";flex:1;height:1px;background:var(--nx-bd)}

.nx-form{display:flex;flex-direction:column;gap:14px}
.nx-field{display:flex;flex-direction:column;gap:6px}
.nx-field span{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--nx-muted);font-weight:700;font-family:var(--nx-fm)}
.nx-field input{width:100%;padding:11px 13px;background:var(--nx-s2);border:1px solid var(--nx-bd-strong);border-radius:9px;color:var(--nx-text);font-family:var(--nx-fb);font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s}
.nx-field input:focus{border-color:var(--nx-gold);box-shadow:0 0 0 3px rgba(232,184,75,.07)}
.nx-field input::placeholder{color:var(--nx-dim)}

.nx-cta{margin-top:8px;display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,var(--nx-gold),var(--nx-gold-bright));color:var(--nx-s0);border:0;padding:13px;border-radius:10px;font-weight:700;font-size:12px;letter-spacing:2.5px;cursor:pointer;transition:all .18s;font-family:var(--nx-fb);text-transform:uppercase;box-shadow:0 4px 18px rgba(232,184,75,.18)}
.nx-cta:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(232,184,75,.32),0 0 0 1px var(--nx-gold-bright)}
.nx-cta:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
.nx-cta svg{transition:transform .18s}
.nx-cta:hover svg{transform:translateX(3px)}

.nx-switch{margin-top:18px;width:100%;background:transparent;border:0;color:var(--nx-muted);font-size:12px;cursor:pointer;font-family:var(--nx-fb);letter-spacing:.3px;padding:6px;transition:color .18s}
.nx-switch:hover{color:var(--nx-gold)}

.nx-foot{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 26px;border-top:1px solid var(--nx-bd);font-family:var(--nx-fm);font-size:9px;letter-spacing:2px;color:var(--nx-dim);background:var(--nx-s0)}
.nx-foot-dot{width:6px;height:6px;border-radius:50%;background:#2ECC71;box-shadow:0 0 8px #2ECC71;animation:nxPulse 2s ease-in-out infinite}
@keyframes nxPulse{0%,100%{opacity:1}50%{opacity:.4}}
`;
