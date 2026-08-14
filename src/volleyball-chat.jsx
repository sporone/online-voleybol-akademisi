import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MessageCircle,
  RefreshCw,
  Send,
  ShieldCheck,
  Users,
  WifiOff,
} from "lucide-react";
import { appConfig } from "./config.js";
import "./volleyball-chat.css";

const CHAT_API = import.meta.env.VITE_REGISTRATION_API_URL || appConfig.registrationApiUrl || import.meta.env.VITE_SHEETS_API_URL || "";
const CHAT_TOKEN_KEY = "volleyballProfileToken";
const LOCAL_CHAT_KEY = "volleyballChatPreviewMessages";
const CHAT_TTL = 24 * 60 * 60 * 1000;
const channels = [
  { id: "schools", label: "Spor Okulları", description: "Kulüp yönetimi ve okul topluluğu", icon: Building2 },
  { id: "trainers", label: "Antrenörler", description: "Antrenman ve takım iletişimi", icon: GraduationCap },
  { id: "athletes", label: "Sporcular", description: "Sporcu topluluğu ve saha paylaşımı", icon: Users },
];

const accountRole = (account) => account?.accountType || account?.type || (String(account?.id || "").startsWith("OKL-") ? "club" : String(account?.id || "").startsWith("ANT-") ? "trainer" : "athlete");
const channelForRole = (role) => ({ club: "schools", trainer: "trainers", athlete: "athletes" })[role] || "athletes";
const roleLabel = (role) => ({ club: "Spor Okulu", trainer: "Antrenör", athlete: "Sporcu" })[role] || "Üye";

function readLocalMessages() {
  try {
    const cutoff = Date.now() - CHAT_TTL;
    const messages = JSON.parse(localStorage.getItem(LOCAL_CHAT_KEY) || "[]").filter((item) => new Date(item.createdAt).getTime() > cutoff);
    localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(messages));
    return messages;
  } catch {
    return [];
  }
}

async function chatRequest(payload) {
  if (!CHAT_API) throw new Error("Sohbet servisi yapılandırılmamış.");
  const response = await fetch(CHAT_API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Sohbet servisine ulaşılamadı (${response.status}).`);
  const result = await response.json();
  if (result.ok === false) throw new Error(result.error || "Sohbet işlemi tamamlanamadı.");
  return result;
}

function messageClock(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Şimdi";
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function expiryText(value, now) {
  const remaining = new Date(value).getTime() + CHAT_TTL - now;
  if (remaining <= 0) return "Siliniyor";
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.max(1, Math.floor((remaining % 3600000) / 60000));
  return hours > 0 ? `${hours} sa ${minutes} dk sonra silinir` : `${minutes} dk sonra silinir`;
}

export default function VolleyballChatPage({ account }) {
  const role = accountRole(account);
  const [channel, setChannel] = useState(() => channelForRole(role));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [state, setState] = useState("loading");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [previewMode, setPreviewMode] = useState(false);
  const messageEndRef = useRef(null);
  const requestActive = useRef(false);
  const token = sessionStorage.getItem(CHAT_TOKEN_KEY) || "";

  const visibleMessages = useMemo(() => messages
    .filter((item) => item.channel === channel && new Date(item.createdAt).getTime() > now - CHAT_TTL)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), [messages, channel, now]);

  const counts = useMemo(() => Object.fromEntries(channels.map((item) => [item.id, messages.filter((message) => message.channel === item.id && new Date(message.createdAt).getTime() > now - CHAT_TTL).length])), [messages, now]);

  const loadMessages = useCallback(async (silent = false) => {
    if (requestActive.current) return;
    requestActive.current = true;
    if (!silent) setState("loading");
    try {
      const result = await chatRequest({ action: "listChatMessages", token });
      setMessages(Array.isArray(result.messages) ? result.messages : []);
      setPreviewMode(false);
      setState("ready");
      setNotice("");
    } catch (error) {
      if (import.meta.env.DEV) {
        setMessages(readLocalMessages());
        setPreviewMode(true);
        setState("ready");
        setNotice("Yerel ön izleme açık. Canlı ortak sohbet için güncel sohbet servisi yayınlanmalıdır.");
      } else {
        setState("error");
        setNotice(error.message || "Sohbetler yüklenemedi.");
      }
    } finally {
      requestActive.current = false;
    }
  }, [token]);

  useEffect(() => {
    loadMessages();
    const poll = window.setInterval(() => {
      setNow(Date.now());
      if (document.visibilityState === "visible") loadMessages(true);
    }, 10000);
    return () => window.clearInterval(poll);
  }, [loadMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [channel, visibleMessages.length]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = text.trim();
    if (!message || sending) return;
    setSending(true);
    setNotice("");
    try {
      if (previewMode) {
        const createdAt = new Date().toISOString();
        const localMessage = {
          id: `local-${Date.now()}`,
          channel,
          senderType: role,
          senderId: account?.id || "local",
          senderName: account?.name || account?.schoolName || "Kullanıcı",
          schoolName: account?.schoolName || "",
          profileCode: account?.avatar || "",
          teamLogo: account?.teamLogo || "",
          message,
          createdAt,
        };
        const next = [...readLocalMessages(), localMessage];
        localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(next));
        setMessages(next);
      } else {
        const result = await chatRequest({ action: "sendChatMessage", token, channel, message });
        setMessages((items) => [...items.filter((item) => item.id !== result.message?.id), result.message].filter(Boolean));
      }
      setText("");
    } catch (error) {
      setNotice(error.message || "Mesaj gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  const selected = channels.find((item) => item.id === channel) || channels[0];
  const SelectedIcon = selected.icon;

  return <div className="volleyball-chat-page">
    <section className="chat-hero">
      <div><span className="eyebrow"><MessageCircle/> VOLEYBOL TOPLULUĞU</span><h1>Sahadaki iletişim,<br/><em>tek sohbet alanında.</em></h1><p>Kayıtlı spor okulları, antrenörler ve sporcular güvenli profil adlarıyla iletişim kurar.</p></div>
      <aside><Clock3/><span><b>24 saatlik sohbet</b><small>Mesajlar gönderildikten 24 saat sonra otomatik silinir.</small></span></aside>
    </section>
    <section className="chat-info"><ShieldCheck/><span><b>Sabit ve düzenli kanallar</b><small>Kanal başlıkları korunur; yalnızca süresi dolan mesajlar temizlenir.</small></span><em><i/> Oturum açık</em></section>
    <section className="chat-shell">
      <nav className="chat-channels" aria-label="Sohbet bölümleri">
        <header><small>SOHBET BÖLÜMLERİ</small><b>Bir kanal seç</b></header>
        {channels.map(({ id, label, description, icon: Icon }) => <button key={id} className={channel === id ? "active" : ""} onClick={() => setChannel(id)}><Icon/><span><b>{label}</b><small>{description}</small></span><em>{counts[id] || 0}</em></button>)}
        <footer><Clock3/><span><b>Otomatik temizlik</b><small>24 saatten eski içerikler saklanmaz.</small></span></footer>
      </nav>
      <div className="chat-workspace">
        <header className="chat-workspace-head"><span className="chat-channel-icon"><SelectedIcon/></span><span><small>AKTİF SOHBET</small><h2>{selected.label}</h2><p>{selected.description}</p></span><button type="button" onClick={() => loadMessages()} aria-label="Mesajları yenile"><RefreshCw/></button></header>
        <div className="chat-messages" aria-live="polite">
          {state === "loading" ? <div className="chat-state"><span className="chat-loader"/><h3>Sohbetler yükleniyor</h3></div>
          : state === "error" ? <div className="chat-state error"><WifiOff/><h3>Sohbet bağlantısı kurulamadı</h3><p>{notice}</p><button onClick={() => loadMessages()}>Tekrar dene</button></div>
          : visibleMessages.length === 0 ? <div className="chat-state"><MessageCircle/><h3>İlk mesajı sen gönder</h3><p>{selected.label} bölümünde son 24 saate ait mesaj bulunmuyor.</p></div>
          : visibleMessages.map((item) => {
            const own = String(item.senderId) === String(account?.id);
            return <article className={`chat-message ${own ? "own" : ""}`} key={item.id}>
              <span className="chat-avatar">{String(item.senderName || "V").replace(/^@/, "").slice(0, 2).toLocaleUpperCase("tr")}</span>
              <div><header><b>{item.senderName}</b><em>{roleLabel(item.senderType)}</em><time>{messageClock(item.createdAt)}</time></header><p>{item.message}</p><small><Clock3/> {expiryText(item.createdAt, now)}</small></div>
            </article>;
          })}
          <div ref={messageEndRef}/>
        </div>
        <form className="chat-compose" onSubmit={sendMessage}>
          <label htmlFor="volleyball-chat-message">Mesajın</label>
          <div><textarea id="volleyball-chat-message" value={text} onChange={(event) => setText(event.target.value.slice(0, 500))} maxLength="500" rows="2" placeholder={`${selected.label} bölümüne mesaj yaz…`} required/><button type="submit" disabled={sending || !text.trim()}><Send/><span>{sending ? "Gönderiliyor" : "Gönder"}</span></button></div>
          <footer><span><CheckCircle2/> {account?.name || account?.schoolName} olarak yazıyorsun</span><small>{text.length}/500</small></footer>
        </form>
      </div>
    </section>
    {notice && state !== "error" && <p className="chat-notice" role="status">{notice}</p>}
  </div>;
}
