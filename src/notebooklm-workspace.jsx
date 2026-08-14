import { useEffect, useMemo, useState } from "react";
import { Bot, ExternalLink, MessageCircleQuestion, ShieldCheck, Volleyball } from "lucide-react";
import { notebookLmConfig } from "./notebooklm.config.js";

const isNotebookLmUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["notebook.google.com", "notebooklm.google.com"].includes(url.hostname);
  } catch {
    return false;
  }
};

export function AIWorkspaceHeader() {
  return (
    <header className="notebooklm-hero">
      <div className="notebooklm-hero-copy">
        <span><Bot aria-hidden="true" /> ONLINE VOLEYBOL AKADEMİSİ</span>
        <h1>VOLEYBOL AI ASİSTANI</h1>
        <p>Voleybol eğitim içeriklerimizden yararlanarak sorularınızı sorun, teknik bilgileri inceleyin ve teorik eğitiminizi geliştirin.</p>
      </div>
      <div className="notebooklm-hero-mark" aria-hidden="true">
        <Volleyball />
        <i><MessageCircleQuestion /></i>
      </div>
    </header>
  );
}

export function AIWorkspaceInfo() {
  return (
    <aside className="notebooklm-info">
      <ShieldCheck aria-hidden="true" />
      <p>Bu AI çalışma alanı yalnızca eğitim amaçlıdır ve Voleybol Okulları eğitim kaynakları üzerinden hazırlanmıştır.</p>
    </aside>
  );
}

export function NotebookLMFallback({ url, configured, reason = "" }) {
  return (
    <section className="notebooklm-fallback" aria-labelledby="notebooklm-fallback-title">
      <div className="notebooklm-fallback-icon"><Bot aria-hidden="true" /></div>
      <div>
        <span>RESMÎ NOTEBOOKLM DENEYİMİ</span>
        <h2 id="notebooklm-fallback-title">Voleybol AI Çalışma Alanı</h2>
        <p>Voleybol eğitim kaynaklarımız üzerinden hazırlanan NotebookLM çalışma alanına giriş yapabilirsiniz.</p>
        {configured ? (
          <a className="notebooklm-open-button" href={url} target="_blank" rel="noopener noreferrer">
            AI ÇALIŞMA ALANINI AÇ <ExternalLink aria-hidden="true" />
          </a>
        ) : (
          <span className="notebooklm-not-configured">NotebookLM paylaşım bağlantısı henüz eklenmedi.</span>
        )}
        {reason && <small>{reason}</small>}
      </div>
    </section>
  );
}

export function NotebookLMWorkspace() {
  const { url, iframeEnabled, iframeLoadTimeoutMs } = notebookLmConfig;
  const configured = useMemo(() => isNotebookLmUrl(url), [url]);
  const [frameState, setFrameState] = useState("loading");

  useEffect(() => {
    if (!configured || !iframeEnabled) return undefined;
    setFrameState("loading");
    const timeout = window.setTimeout(() => setFrameState("failed"), iframeLoadTimeoutMs);
    return () => window.clearTimeout(timeout);
  }, [configured, iframeEnabled, iframeLoadTimeoutMs, url]);

  if (!configured || !iframeEnabled || frameState === "failed") {
    const reason = configured && frameState === "failed"
      ? "Google çalışma alanının bu sayfa içinde açılmasına izin vermedi. Güvenli bağlantı yeni sekmede açılır."
      : "Çalışma alanı Google'ın resmî paylaşım bağlantısı üzerinden yeni sekmede açılır.";
    return <NotebookLMFallback url={url} configured={configured} reason={reason} />;
  }

  return (
    <section className="notebooklm-frame-shell" aria-labelledby="notebooklm-frame-title">
      <header>
        <div>
          <span>ÇALIŞMA ALANI</span>
          <h2 id="notebooklm-frame-title">Voleybolla ilgili sorunuzu sorun.</h2>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer">Yeni sekmede aç <ExternalLink aria-hidden="true" /></a>
      </header>
      <div className="notebooklm-frame-wrap">
        {frameState === "loading" && <p className="notebooklm-frame-loading" role="status">Çalışma alanı yükleniyor…</p>}
        <iframe
          src={url}
          title="NotebookLM Voleybol AI çalışma alanı"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setFrameState("ready")}
          onError={() => setFrameState("failed")}
        />
      </div>
    </section>
  );
}

export default function NotebookLMWorkspacePage() {
  return (
    <main className="notebooklm-page">
      <AIWorkspaceHeader />
      <section className="notebooklm-content">
        <AIWorkspaceInfo />
        <NotebookLMWorkspace />
      </section>
    </main>
  );
}
