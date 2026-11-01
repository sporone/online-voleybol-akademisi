import React, { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Copy, KeyRound, LogOut, UserRound } from "lucide-react";
import { appConfig } from "./config.js";

const TOKEN = "volleyballProfileToken";
const ACTIVITY = "volleyballUserLastActivity";
const IDLE = 15 * 60 * 1000;
export async function userRequest(payload) {
  const api = import.meta.env.VITE_REGISTRATION_API_URL || appConfig.registrationApiUrl;
  if (!api) throw new Error("Kayıt servisine ulaşılamıyor.");
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(api, { method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify(payload), signal:controller.signal });
    if (!response.ok) throw new Error("Kayıt servisine ulaşılamıyor.");
    const result = await response.json();
    if (result.ok !== true) throw new Error(result.error || "İşlem tamamlanamadı.");
    return result;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Sunucu yanıt vermedi. Lütfen tekrar deneyin.");
    throw error;
  } finally { window.clearTimeout(timer); }
}

export function useUserSession() {
  const [account, setAccount] = useState(null);
  const [checking, setChecking] = useState(true);
  const accept = (result) => {
    if (result.account?.type !== "user" || !result.token) throw new Error("Geçerli kullanıcı oturumu alınamadı.");
    sessionStorage.setItem(TOKEN, result.token);
    sessionStorage.setItem(ACTIVITY, String(Date.now()));
    setAccount(result.account);
  };
  const logout = () => {
    const token = sessionStorage.getItem(TOKEN);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(ACTIVITY);
    setAccount(null);
    if (token) userRequest({action:"logoutProfile", token}).catch(() => {});
  };
  useEffect(() => {
    // Discard obsolete browser caches without collecting or migrating personal data.
    ["volleyballSchools","volleyballAthletes","volleyballTrainers","volleyballClubTeams","volleyballCurrentClub","volleyballCurrentAthleteId","volleyballCurrentTrainerId","volleyballLoggedOutAthleteIds","volleyballExamAttempts"].forEach(key => localStorage.removeItem(key));
    const token = sessionStorage.getItem(TOKEN);
    if (!token) { setChecking(false); return; }
    let disposed = false;
    userRequest({action:"validateProfileSession",token}).then(result => {
      if (!disposed && result.account?.type === "user") setAccount(result.account);
      else if (!disposed) logout();
    }).catch(() => { if (!disposed) logout(); }).finally(() => { if (!disposed) setChecking(false); });
    return () => { disposed = true; };
  }, []);
  useEffect(() => {
    if (!account) return;
    let timer;
    const schedule = () => {
      window.clearTimeout(timer);
      const elapsed = Date.now() - Number(sessionStorage.getItem(ACTIVITY) || 0);
      if (elapsed >= IDLE) logout();
      else timer = window.setTimeout(logout, IDLE - elapsed);
    };
    const activity = () => { sessionStorage.setItem(ACTIVITY,String(Date.now())); schedule(); };
    const refresh = () => {
      if (Date.now() - Number(sessionStorage.getItem(ACTIVITY) || 0) >= IDLE) { logout(); return; }
      userRequest({action:"validateProfileSession",token:sessionStorage.getItem(TOKEN)}).catch(logout);
    };
    const events = ["pointerdown","keydown","scroll"];
    events.forEach(event => window.addEventListener(event,activity,{passive:true}));
    const interval = window.setInterval(refresh,60000);
    schedule();
    return () => { window.clearTimeout(timer); window.clearInterval(interval); events.forEach(event => window.removeEventListener(event,activity)); };
  }, [account?.id]);
  return {account,checking,accept,logout};
}

export function UserRegistration({go,onSession}) {
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState("");
  const [created,setCreated] = useState(null);
  const submit = async event => {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const data = new FormData(event.currentTarget);
      const result = await userRequest({action:"registerUser",userName:data.get("userName")});
      if (!result.code || !result.token || result.account?.type !== "user") throw new Error("Kayıt doğrulanamadı.");
      setCreated(result);
    } catch(error) { setNotice(error.message); } finally { setBusy(false); }
  };
  return <div className="page registration-page">
    <div className="registration-intro"><span className="eyebrow"><UserRound size={16}/> KAYIT</span><h1>Voleybolu kendi hızında öğren.</h1><p>Kullanıcı hesabını oluştur; derslere, videolara ve sınavlara tek hesabınla ulaş.</p></div>
    <section className="registration-card">
      {created ? <div className="registration-form"><CheckCircle2/><h2>Hesabın hazır, {created.account.name}</h2><p>Giriş kodun yalnızca bu ekranda gösterilir. Güvenli bir yerde sakla; sonraki girişlerde kullanıcı adınla birlikte kullanacaksın.</p><output className="user-access-code" aria-label="Yeni giriş kodun">{created.code}</output><button className="btn ghost" onClick={async()=>{try{await navigator.clipboard.writeText(created.code);setNotice("Giriş kodu kopyalandı.")}catch{setNotice("Kodu seçerek kopyalayabilirsin.")}}}><Copy/> Kodu kopyala</button><button className="btn" onClick={()=>{onSession(created);setCreated(null);go("profiles")}}>Kodumu kaydettim, devam et <ArrowRight/></button></div>
      : <form className="registration-form" onSubmit={submit}><div className="form-heading"><UserRound/><span><b>Kullanıcı hesabı</b><small>Okul, takım veya antrenör kodu gerekmez.</small></span></div><label>Kullanıcı adı<input name="userName" required minLength={3} maxLength={31} pattern="@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}" defaultValue="@" autoCapitalize="none" spellCheck="false" autoComplete="username" aria-describedby="username-help"/><small id="username-help">Örnek: @voleybolcu — boşluk kullanma.</small></label><button className="btn" disabled={busy}>{busy?"Hesap oluşturuluyor…":"Kayıt ol"}<ArrowRight/></button><button type="button" className="btn ghost" onClick={()=>go("profiles")}>Hesabım var, giriş yap</button></form>}
      {notice&&<p role="status" className="registration-notice">{notice}</p>}
    </section>
  </div>;
}

export function UserProfile({account,checking,go,onSession,onLogout,initialNotice=""}) {
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState("");
  const login = async event => {
    event.preventDefault();setBusy(true);setNotice("");
    const data = new FormData(event.currentTarget);
    try { onSession(await userRequest({action:"profileLogin",userName:data.get("userName"),code:data.get("code")})); }
    catch(error){setNotice(error.message)} finally{setBusy(false)}
  };
  if(checking) return <div className="page" role="status">Oturum kontrol ediliyor…</div>;
  if(account) return <div className="page profile-area"><section className="profile-hero-card"><UserRound size={54}/><span><small>KULLANICI HESABI</small><h1>{account.name}</h1><p>Kişisel eğitim alanın</p></span><button className="btn ghost" onClick={onLogout}><LogOut/> Çıkış yap</button></section><section className="user-learning-links">{[["courses","Dersler"],["videos","Eğitim videoları"],["exams","Sınavlar"],["technical-cards","Teknik kartlar"],["ready365-library","Eğitim kütüphanesi"],["bulletins","Eğitim bültenleri"]].map(([page,label])=><button key={page} className="btn ghost" onClick={()=>go(page)}><BookOpen/>{label}<ArrowRight/></button>)}</section></div>;
  return <div className="page registration-page"><div className="registration-intro"><span className="eyebrow"><KeyRound size={16}/> GİRİŞ</span><h1>Eğitimine kaldığın yerden devam et.</h1><p>Kayıt sırasında aldığın giriş kodunu ve kullanıcı adını kullan.</p></div><section className="registration-card"><form className="registration-form" onSubmit={login}><label>Kullanıcı adı<input name="userName" required defaultValue="@" maxLength={31} autoComplete="username" autoCapitalize="none" spellCheck="false"/></label><label>Giriş kodu<input name="code" type="password" required minLength={32} maxLength={32} autoComplete="current-password"/></label><button className="btn" disabled={busy}>{busy?"Kontrol ediliyor…":"Giriş yap"}<ArrowRight/></button><button type="button" className="btn ghost" onClick={()=>go("register")}>Hesabım yok, kayıt ol</button></form>{(notice||initialNotice)&&<p role="status" className="registration-notice">{notice||initialNotice}</p>}</section></div>;
}
