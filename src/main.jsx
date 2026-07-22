import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Menu,
  X,
  ArrowRight,
  Play,
  Search,
  Star,
  Clock,
  BookOpen,
  Users,
  Trophy,
  Flame,
  CalendarDays,
  BarChart3,
  Home,
  GraduationCap,
  Dumbbell,
  ChevronDown,
  CheckCircle2,
  Video,
  ShieldCheck,
  Target,
  Zap,
  Heart,
  WifiOff,
  School,
  UserPlus,
  LogOut,
  UserRound,
  BadgeTurkishLira,
  MessageCircle,
  Flag,
} from "lucide-react";
import "./styles.css";
import "./lesson-images.css";
import "./video-library.css";
import "./video-topics.css";
import "./profile-area.css";
import "./pricing.css";
import "./demo.css";
import "./registered-schools.css";
import "./junior-referee.css";
import { refereeVideoMap } from "./referee-videos";
import { appConfig } from "./config.js";
import { trainingVideos, videoTopics } from "./video-library.js";
const Instagram = Heart,
  Youtube = Play,
  Linkedin = Users;

const coaches = [
  ["Ece Yalın", "Başantrenör", "Milli takım deneyimi • 14 yıl"],
  ["Mert Aksoy", "Hücum Antrenörü", "Smaç ve hücum sistemleri"],
  ["Selin Arı", "Servis Uzmanı", "Plaj ve salon voleybolu"],
  ["Can Demir", "Taktik Analisti", "Pasör gelişimi • 11 yıl"],
  ["Derya Işık", "Savunma Antrenörü", "Libero ve mental performans"],
  ["Ozan Şen", "Atletik Performans", "Kuvvet ve sakatlık önleme"],
];
const courseCategories = [
  "Voleybola giriş ve temel kurallar",
  "Parmak pas",
  "Manşet",
  "Servis teknikleri",
  "Smaç",
  "Blok",
  "Savunma teknikleri",
  "Hücum organizasyonları",
  "Pozisyon bilgisi",
  "Pasör eğitimi",
  "Libero eğitimi",
  "Orta oyuncu eğitimi",
  "Smaçör eğitimi",
  "Pasör çaprazı eğitimi",
  "Takım rotasyonları",
  "Maç analizi",
  "Taktik ve oyun zekâsı",
  "Kondisyon ve kuvvet",
  "Sıçrama geliştirme",
  "Hız ve çeviklik",
  "Esneklik ve mobilite",
  "Isınma ve soğuma",
  "Sakatlık önleme",
  "Sporcu beslenmesi",
  "Mental hazırlık",
  "Plaj voleybolu temelleri",
];
const courseImages = courseCategories.map((_, i) =>
  i === 1
    ? "./course-covers/course-02.webp"
    : `./course-covers/course-${String(i + 1).padStart(2, "0")}.png`,
);
const courseDescriptions = {
  "Voleybola giriş ve temel kurallar":
    "Saha ölçüleri, sayı sistemi, temel pozisyonlar ve oyun akışını öğren.",
  "Parmak pas":
    "El yerleşimi, top kontrolü ve farklı hücum tempoları için doğru pas tekniğini geliştir.",
  Manşet:
    "Dengeli platform, ayak çalışması ve servis karşılama kontrolünü güçlendir.",
  "Servis teknikleri":
    "Tenis servis, floater ve sıçrayarak serviste hedef ve istikrar kazan.",
  Smaç: "Yaklaşma adımları, sıçrama, kol salınımı ve güvenli inişi birlikte geliştir.",
  Blok: "Rakibi okuma, doğru zamanlama ve file üzerinde alan kapatma becerisi kazan.",
  "Savunma teknikleri":
    "Pozisyon alma, reaksiyon ve zor topları oyunda tutma becerilerini ilerlet.",
  "Hücum organizasyonları":
    "Hücum temposu, kombinasyonlar ve takım içi koordinasyonu öğren.",
  "Pozisyon bilgisi":
    "Sahadaki görevleri, geçişleri ve pozisyonlara göre sorumlulukları kavra.",
  "Pasör eğitimi": "Karar verme, tempo yönetimi ve hücum dağılımında uzmanlaş.",
  "Libero eğitimi":
    "Servis karşılama, alan savunması ve oyun kurulumunda güven kazan.",
  "Orta oyuncu eğitimi":
    "Hızlı hücum, blok takibi ve geçiş adımlarını geliştir.",
  "Smaçör eğitimi":
    "Karşılama ile hücumu birleştir, farklı toplarda etkili bitiriş yap.",
  "Pasör çaprazı eğitimi":
    "Yüksek top hücumu, arka alan saldırısı ve blok görevlerini geliştir.",
  "Takım rotasyonları":
    "5-1 ve 6-2 sistemlerinde dizilişleri ve geçiş düzenlerini öğren.",
  "Maç analizi":
    "Video üzerinden rakip eğilimlerini ve takım performansını doğru yorumla.",
  "Taktik ve oyun zekâsı":
    "Baskı altında doğru karar ver, boş alanları ve rakip düzenini oku.",
  "Kondisyon ve kuvvet":
    "Voleybola özgü kuvvet, dayanıklılık ve patlayıcı güç temeli oluştur.",
  "Sıçrama geliştirme":
    "Pliometrik çalışmalarla güvenli ve etkili sıçrama kapasiteni artır.",
  "Hız ve çeviklik":
    "Kısa mesafe hızlanma, yön değiştirme ve reaksiyon süreni geliştir.",
  "Esneklik ve mobilite":
    "Omuz, kalça ve ayak bileği hareket açıklığını voleybola uygun geliştir.",
  "Isınma ve soğuma":
    "Antrenmana güvenli hazırlanmayı ve doğru toparlanma rutinini öğren.",
  "Sakatlık önleme":
    "Yük yönetimi, doğru hareket kalıpları ve koruyucu egzersizleri uygula.",
  "Sporcu beslenmesi":
    "Antrenman, maç ve toparlanma dönemleri için temel beslenme planı oluştur.",
  "Mental hazırlık":
    "Odaklanma, özgüven ve baskı yönetimi için maç rutinleri geliştir.",
  "Plaj voleybolu temelleri":
    "Kumda hareket, ikili iletişim ve plaj voleybolu oyun düzenini öğren.",
};
const lessonCounts = {
  "Voleybola giriş ve temel kurallar": 34,
  "Parmak pas": 31,
  Manşet: 35,
  "Servis teknikleri": 25,
  Smaç: 30,
};
const courses = courseCategories.map((title, i) => [
  `course-${i + 1}`,
  title,
  courseDescriptions[title],
  title,
  ["Başlangıç", "Orta", "İleri"][i % 3],
  "",
  `${2 + (i % 4)}s ${String((i * 5) % 60).padStart(2, "0")}dk`,
  lessonCounts[title] || 8 + (i % 9),
  0,
  Number((4.6 + (i % 4) * 0.1).toFixed(1)),
  courseImages[i],
]);
const nav = [
  ["home", "Ana Sayfa", Home],
  ["courses", "Dersler", BookOpen],
  ["videos", "Eğitim Videoları", Video],
  ["exams", "Sınavlar", CheckCircle2],
  ["junior-referee", "Junior Hakem", Flag],
  ["demo", "Demo", Play],
  ["pricing", "Ücretler", BadgeTurkishLira],
  ["register", "Kayıt", UserPlus],
  ["profiles", "Giriş Yap", UserRound],
];

const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const readAthletes = () => {
  try { return JSON.parse(localStorage.getItem("volleyballAthletes") || "[]"); }
  catch { return []; }
};
const readSchools = () => {
  try { return JSON.parse(localStorage.getItem("volleyballSchools") || "[]"); }
  catch { return []; }
};
const isAthleteActive = (athlete) => athlete.online === true && Date.now() - new Date(athlete.lastSeen || 0).getTime() < ACTIVE_WINDOW_MS;
const readActiveAthletes = () => readAthletes().filter(isAthleteActive);

const registrationValue = (row, key) => String(row?.[key] ?? "").trim();
const registrationBoolean = (value) => ["true", "evet", "1", "aktif"].includes(String(value || "").trim().toLocaleLowerCase("tr"));
async function fetchRegistrationSheet(sheet) {
  if (!registrationApi) return [];
  const separator = registrationApi.includes("?") ? "&" : "?";
  const response = await fetch(`${registrationApi}${separator}sheet=${encodeURIComponent(sheet)}&_=${Date.now()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Kayıt bilgileri alınamadı (${response.status})`);
  const result = await response.json();
  if (result.ok === false) throw new Error(result.error || "Kayıt bilgileri alınamadı.");
  return Array.isArray(result.data) ? result.data : [];
}
function syncRegistrationStorage(schoolRows, athleteRows) {
  const localSchools = readSchools();
  const localAthletes = readAthletes();
  const schoolKey = (value) => String(value || "").trim().toLocaleLowerCase("tr");
  const teamLogoBySchool = new Map();
  schoolRows.forEach((row) => {
    const logo = registrationValue(row, "Takım Logosu (Manuel)");
    const schoolName = registrationValue(row, "Okul Adı");
    if (logo && schoolName) teamLogoBySchool.set(schoolKey(schoolName), logo);
  });
  athleteRows.forEach((row) => {
    const logo = registrationValue(row, "Takım Logosu (Manuel)");
    const schoolName = registrationValue(row, "Okul Adı");
    if (logo && schoolName) teamLogoBySchool.set(schoolKey(schoolName), logo);
  });
  localAthletes.forEach((athlete) => {
    if (athlete.teamLogo && athlete.schoolName && !teamLogoBySchool.has(schoolKey(athlete.schoolName)))
      teamLogoBySchool.set(schoolKey(athlete.schoolName), athlete.teamLogo);
  });
  const schools = schoolRows.map((row) => {
    const id = registrationValue(row, "Kayıt ID");
    const local = localSchools.find((item) => item.id === id) || {};
    return {
      ...local,
      id,
      schoolName: registrationValue(row, "Okul Adı"),
      phone: registrationValue(row, "Telefon"),
      code: registrationValue(row, "6 Haneli Kod"),
      status: registrationValue(row, "Onay Durumu"),
      createdAt: registrationValue(row, "Kayıt Tarihi"),
      approvedAt: registrationValue(row, "Onay Tarihi"),
      managerNote: registrationValue(row, "Yönetici Notu"),
      teamLogo: registrationValue(row, "Takım Logosu (Manuel)") || teamLogoBySchool.get(schoolKey(registrationValue(row, "Okul Adı"))) || local.teamLogo || "",
      source: "google-sheets",
    };
  }).filter((school) => school.id && school.schoolName);
  const athletes = athleteRows.map((row) => {
    const id = registrationValue(row, "Sporcu ID");
    const local = localAthletes.find((item) => item.id === id) || {};
    return {
      ...local,
      id,
      schoolId: registrationValue(row, "Okul Kayıt ID"),
      schoolName: registrationValue(row, "Okul Adı"),
      schoolCode: registrationValue(row, "Okul Kodu"),
      name: registrationValue(row, "Sporcu Adı"),
      avatar: registrationValue(row, "Profil Kodu") || local.avatar || profileChoices[0].id,
      teamLogo: registrationValue(row, "Takım Logosu (Manuel)") || teamLogoBySchool.get(schoolKey(registrationValue(row, "Okul Adı"))) || local.teamLogo || "",
      online: registrationBoolean(registrationValue(row, "Çevrim İçi")),
      lastSeen: registrationValue(row, "Son Görülme"),
      createdAt: registrationValue(row, "Kayıt Tarihi"),
      source: "google-sheets",
    };
  }).filter((athlete) => athlete.id && athlete.name);
  localStorage.setItem("volleyballSchools", JSON.stringify(schools));
  localStorage.setItem("volleyballAthletes", JSON.stringify(athletes));
  return { schools, athletes };
}

function App() {
  const [page, setPage] = useState("home");
  const [menu, setMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [onlineAthletes, setOnlineAthletes] = useState(() => {
    return readActiveAthletes();
  });
  const [currentAthlete, setCurrentAthlete] = useState(() => {
    const currentId = localStorage.getItem("volleyballCurrentAthleteId");
    return readAthletes().find((athlete) => athlete.id === currentId) || null;
  });
  const [currentClub, setCurrentClub] = useState(() => {
    try { return JSON.parse(localStorage.getItem("volleyballCurrentClub") || "null"); }
    catch { return null; }
  });
  const [authNotice, setAuthNotice] = useState("");
  const [, setRegistrationRevision] = useState(0);
  useEffect(() => {
    if (!registrationApi) return;
    let disposed = false;
    let active = false;
    const refreshRegistrations = async () => {
      if (active || disposed) return;
      active = true;
      try {
        const [schoolRows, athleteRows] = await Promise.all([
          fetchRegistrationSheet("Okul Kayitlari"),
          fetchRegistrationSheet("Sporcu Kayitlari"),
        ]);
        if (disposed) return;
        const synced = syncRegistrationStorage(schoolRows, athleteRows);
        const currentAthleteId = localStorage.getItem("volleyballCurrentAthleteId");
        const syncedAthlete = synced.athletes.find((item) => item.id === currentAthleteId) || null;
        if (currentAthleteId) setCurrentAthlete(syncedAthlete);
        setOnlineAthletes(synced.athletes.filter(isAthleteActive));
        setCurrentClub((current) => current ? synced.schools.find((item) => item.id === current.id) || current : current);
        setRegistrationRevision((value) => value + 1);
      } catch (error) {
        console.warn("Kayıt bilgileri yenilenemedi:", error);
      } finally {
        active = false;
      }
    };
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refreshRegistrations(); };
    refreshRegistrations();
    const timer = window.setInterval(refreshRegistrations, 15000);
    window.addEventListener("focus", refreshRegistrations);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshRegistrations);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);
  useEffect(() => {
    const refreshActivity = () => {
      const currentId = localStorage.getItem("volleyballCurrentAthleteId");
      const athletes = readAthletes().map((athlete) => currentId === athlete.id ? { ...athlete, online:true, lastSeen:new Date().toISOString() } : athlete);
      localStorage.setItem("volleyballAthletes", JSON.stringify(athletes));
      setOnlineAthletes(athletes.filter(isAthleteActive));
    };
    refreshActivity();
    const timer = setInterval(refreshActivity, 30000);
    const leave = () => {
      const currentId = localStorage.getItem("volleyballCurrentAthleteId");
      if (!currentId) return;
      localStorage.setItem("volleyballAthletes", JSON.stringify(readAthletes().map((athlete) => athlete.id === currentId ? { ...athlete, online:false } : athlete)));
    };
    addEventListener("beforeunload", leave);
    return () => { clearInterval(timer); removeEventListener("beforeunload", leave); };
  }, []);
  const go = (p, course) => {
    if (["dashboard", "training", "performance"].includes(p)) p = "courses";
    if (["courses", "course", "lesson", "videos", "exams"].includes(p) && !currentAthlete && !currentClub) {
      setAuthNotice("Derslere, eğitim videolarına ve sınavlara erişmek için kayıtlı hesabınızla giriş yapın.");
      p = "profiles";
    }
    if (course) setSelectedCourse(course);
    setPage(p);
    setMenu(false);
    scrollTo(0, 0);
  };
  const logoutAthlete = () => {
    const currentId = localStorage.getItem("volleyballCurrentAthleteId");
    localStorage.removeItem("volleyballCurrentAthleteId");
    if (currentId) {
      localStorage.setItem("volleyballAthletes", JSON.stringify(readAthletes().map((athlete) => athlete.id === currentId ? { ...athlete, online:false } : athlete)));
    }
    setCurrentAthlete(null);
    setCurrentClub(null);
    localStorage.removeItem("volleyballCurrentClub");
    setOnlineAthletes(readActiveAthletes());
    go("home");
  };
  const handleMainClick = (e) => {
    const b = e.target.closest("button");
    if (b?.textContent.includes("Eğitime Başla") && page === "course")
      go("lesson", selectedCourse);
  };
  return (
    <>
      <Header page={page} go={go} menu={menu} setMenu={setMenu} account={currentAthlete || currentClub} isAuthenticated={Boolean(currentAthlete || currentClub)} onLogout={logoutAthlete} />
      {onlineAthletes.length > 0 && <OnlineTeamStrip athletes={onlineAthletes} />}
      <main onClick={handleMainClick}>
        {page === "home" ? (
          <HomePage go={go} isAuthenticated={Boolean(currentAthlete || currentClub)} />
        ) : page === "courses" ? (
          <Courses go={go} />
        ) : page === "course" ? (
          <CourseDetail course={selectedCourse} go={go} />
        ) : page === "lesson" ? (
          <LessonPage course={selectedCourse} go={go} />
        ) : page === "exams" ? (
          <ExamPage initialCourse={selectedCourse} />
        ) : page === "junior-referee" ? (
          <JuniorRefereePage />
        ) : page === "videos" ? (
          <TrainingVideosPage />
        ) : page === "register" ? (
          <RegistrationPage go={go} onAthleteOnline={(athlete) => { localStorage.removeItem("volleyballCurrentClub"); setCurrentClub(null); setCurrentAthlete(athlete); setOnlineAthletes((items) => [...items.filter((x) => x.id !== athlete.id), athlete]); go("profiles"); }} />
        ) : page === "registered-schools" ? (
          <RegisteredSchoolsPage go={go} />
        ) : page === "pricing" ? (
          <PricingPage />
        ) : page === "demo" ? (
          <DemoPage go={go} />
        ) : page === "profiles" ? (
          <ProfilesPage initialNotice={authNotice} onActivityChange={() => setOnlineAthletes(readActiveAthletes())} onSessionChange={(session) => { setAuthNotice(""); if (session?.type === "club") { setCurrentClub(session.school); setCurrentAthlete(null); } else { setCurrentAthlete(session?.athlete || null); setCurrentClub(null); } }} />
        ) : (
          <InfoPage title={page} />
        )}
      </main>
      <MobileNav page={page} go={go} isAuthenticated={Boolean(currentAthlete || currentClub)} isAthlete={Boolean(currentAthlete)} />
      <Footer go={go} />
    </>
  );
}

const registrationApi = import.meta.env.VITE_REGISTRATION_API_URL || appConfig.registrationApiUrl || import.meta.env.VITE_SHEETS_API_URL || "";
const profileChoices = [
  { id:"kadin-voleybolcu-1", name:"Topla hazır kadın voleybolcu", image:"/profile-volleyball-women.png", x:"0%", y:"0%" },
  { id:"kadin-voleybolcu-2", name:"Savunmaya hazır kadın voleybolcu", image:"/profile-volleyball-women.png", x:"50%", y:"0%" },
  { id:"kadin-voleybolcu-3", name:"Kadın pasör", image:"/profile-volleyball-women.png", x:"100%", y:"0%" },
  { id:"kadin-voleybolcu-4", name:"Kadın libero", image:"/profile-volleyball-women.png", x:"0%", y:"100%" },
  { id:"kadin-voleybolcu-5", name:"Manşet pozisyonunda kadın voleybolcu", image:"/profile-volleyball-women.png", x:"50%", y:"100%" },
  { id:"kadin-voleybolcu-6", name:"Kadın takım kaptanı", image:"/profile-volleyball-women.png", x:"100%", y:"100%" },
  { id:"erkek-voleybolcu-1", name:"Topla hazır erkek voleybolcu", image:"/profile-volleyball-men.png", x:"0%", y:"0%" },
  { id:"erkek-voleybolcu-2", name:"Savunmaya hazır erkek voleybolcu", image:"/profile-volleyball-men.png", x:"50%", y:"0%" },
  { id:"erkek-voleybolcu-3", name:"Erkek pasör", image:"/profile-volleyball-men.png", x:"100%", y:"0%" },
  { id:"erkek-voleybolcu-4", name:"Erkek smaçör", image:"/profile-volleyball-men.png", x:"0%", y:"100%" },
  { id:"erkek-voleybolcu-5", name:"Erkek libero", image:"/profile-volleyball-men.png", x:"50%", y:"100%" },
  { id:"erkek-voleybolcu-6", name:"Erkek takım kaptanı", image:"/profile-volleyball-men.png", x:"100%", y:"100%" },
];
const profileById = (id) => profileChoices.find((item) => item.id === id) || profileChoices[0];
function AthleteAvatar({ id, className="" }) { const item=profileById(id); return <i className={`athlete-avatar ${className}`} style={{"--avatar-image":`url(${item.image})`,"--avatar-x":item.x,"--avatar-y":item.y}} aria-label={item.name} />; }
function TeamLogo({ src, name, className="" }) {
  if (!src) return null;
  return <img className={`team-logo ${className}`} src={src} alt={`${name || "Takım"} logosu`} loading="lazy" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.hidden = true; }} />;
}

function SearchableSchoolPicker({ value, onChange, options, logoFor, label="Kulüp adı", placeholder="Okul adını yazın veya listeden seçin" }) {
  const [open, setOpen] = useState(false);
  const normalized = String(value || "").trim().toLocaleLowerCase("tr");
  const filtered = options.filter((school) => !normalized || school.toLocaleLowerCase("tr").includes(normalized));
  return <label className="club-picker-label">{label}<div className={`club-picker searchable ${open ? "open" : ""}`}>
    <div className="club-picker-input">
      <span className="club-option-logo">{logoFor(value) ? <TeamLogo src={logoFor(value)} name={value}/> : <School/>}</span>
      <input name="schoolName" value={value} required autoComplete="off" placeholder={placeholder} aria-expanded={open} aria-controls="school-picker-options" onFocus={()=>setOpen(true)} onChange={(event)=>{onChange(event.target.value);setOpen(true)}}/>
      <button type="button" aria-label={open ? "Okul listesini kapat" : "Tüm okulları göster"} onClick={()=>setOpen((current)=>!current)}><ChevronDown/></button>
    </div>
    {open&&<div id="school-picker-options" className="club-picker-menu" role="listbox" aria-label="Kayıtlı spor okulları">
      {filtered.length ? filtered.map((school)=><button type="button" role="option" aria-selected={value===school} className={value===school?"selected":""} key={school} onClick={()=>{onChange(school);setOpen(false)}}><span className="club-option-logo">{logoFor(school)?<TeamLogo src={logoFor(school)} name={school}/>:<School/>}</span><span><b>{school}</b><small>{logoFor(school)?"Kulüp logosu mevcut":"Kayıtlı spor okulu"}</small></span>{value===school&&<CheckCircle2/>}</button>) : <div className="club-picker-no-result">Eşleşen okul bulunamadı. Okul adını elle yazmaya devam edebilirsiniz.</div>}
    </div>}
  </div></label>;
}
async function avatarDataUrl(id) {
  const item=profileById(id), image=new Image();
  image.src=item.image; await image.decode();
  const column=item.x==="50%"?1:item.x==="100%"?2:0, row=item.y==="100%"?1:0;
  const width=image.naturalWidth/3, height=image.naturalHeight/2;
  const canvas=document.createElement("canvas"); canvas.width=160; canvas.height=160;
  canvas.getContext("2d").drawImage(image,column*width,row*height,width,height,0,0,160,160);
  return canvas.toDataURL("image/png");
}

async function sendRegistration(payload) {
  if (!registrationApi) return { ok: true, demo: true };
  const response = await fetch(registrationApi, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error("Kayıt servisine ulaşılamadı.");
  return response.json();
}

function OnlineTeamStrip({ athletes }) {
  return <section className="online-team" aria-label="Derste olan sporcular">
    <div className="online-team-title"><i /> <span><b>Derste olanlar</b><small>{athletes.length} sporcu çevrim içi</small></span></div>
    <div className="online-athletes">{athletes.slice(0, 8).map((athlete) => <div className="online-athlete-chip" key={athlete.id} title={athlete.name}><TeamLogo src={athlete.teamLogo} name={athlete.schoolName} className="team-logo-mini"/><AthleteAvatar id={athlete.avatar}/><span className="online-athlete-copy"><b>{athlete.name.split(" ")[0]}</b></span></div>)}</div>
  </section>;
}

function RegistrationPage({ go, onAthleteOnline }) {
  const [type, setType] = useState("school");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [avatar, setAvatar] = useState(profileChoices[0].id);
  const [athleteSchool, setAthleteSchool] = useState("");
  const approvedSchools = readSchools()
    .filter((school) => String(school.status || "").trim().toLocaleUpperCase("tr") === "ONAYLANDI")
    .sort((a, b) => String(a.schoolName).localeCompare(String(b.schoolName), "tr"));
  const registrationSchoolLogo = (schoolName) => {
    const key = String(schoolName || "").trim().toLocaleLowerCase("tr");
    return readSchools().find((school) => String(school.schoolName || "").trim().toLocaleLowerCase("tr") === key && school.teamLogo)?.teamLogo
      || readAthletes().find((athlete) => String(athlete.schoolName || "").trim().toLocaleLowerCase("tr") === key && athlete.teamLogo)?.teamLogo
      || "";
  };
  const submitSchool = async (event) => {
    event.preventDefault(); setBusy(true); setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    let phone = String(data.get("phone") || "").replace(/\D/g, "");
    if (phone.length === 11 && phone.startsWith("0")) phone = `90${phone.slice(1)}`;
    else if (phone.length === 10) phone = `90${phone}`;
    if (phone.length < 10) { setNotice("Geçerli bir telefon numarası girin."); setBusy(false); return; }
    const school = { action:"registerSchool", id:`OKL-${Date.now()}`, schoolName:String(data.get("schoolName")).trim(), phone, status:"BEKLİYOR", createdAt:new Date().toISOString() };
    try {
      const result = await sendRegistration(school);
      const saved = { ...school, id: result.id || school.id, code: result.code || String(Math.floor(100000 + Math.random() * 900000)) };
      localStorage.setItem("volleyballSchools", JSON.stringify([...JSON.parse(localStorage.getItem("volleyballSchools") || "[]"), saved]));
      setNotice("Başvurunuz alındı. Yönetici onayından sonra 6 haneli giriş kodunuz WhatsApp üzerinden iletilecek."); form.reset();
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  };
  const submitAthlete = async (event) => {
    event.preventDefault(); setBusy(true); setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedProfile=profileById(avatar);
    const athlete = { action:"registerAthlete", id:`SPR-${Date.now()}`, schoolName:String(data.get("schoolName")).trim(), schoolCode:String(data.get("schoolCode")).trim(), name:String(data.get("athleteName")).trim(), avatar, avatarName:selectedProfile.name, avatarDataUrl:await avatarDataUrl(avatar), online:true, lastSeen:new Date().toISOString() };
    if (!athlete.schoolName) { setNotice("Kayıtlı spor okulunu seçin."); setBusy(false); return; }
    if (!/^\d{6}$/.test(athlete.schoolCode)) { setNotice("Okul kodu 6 haneli olmalıdır."); setBusy(false); return; }
    if (!/^@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}$/.test(athlete.name)) { setNotice("Sporcu adı @ ile başlamalı; boşluk içermemeli ve en az 2 karakter olmalıdır."); setBusy(false); return; }
    const normalizedName = athlete.name.toLocaleLowerCase("tr");
    if (readAthletes().some((item) => String(item.name || "").trim().toLocaleLowerCase("tr") === normalizedName)) { setNotice("Bu sporcu adı alınmış. Lütfen başka bir ad seçin."); setBusy(false); return; }
    try {
      const result = await sendRegistration(athlete);
      if (result.ok === false) throw new Error(result.error || "Okul bilgileri doğrulanamadı.");
      const inheritedTeamLogo = readSchools().find((item) => item.schoolName.toLocaleLowerCase("tr") === athlete.schoolName.toLocaleLowerCase("tr") && item.teamLogo)?.teamLogo
        || readAthletes().find((item) => item.schoolName.toLocaleLowerCase("tr") === athlete.schoolName.toLocaleLowerCase("tr") && item.teamLogo)?.teamLogo
        || "";
      const savedAthlete = { ...athlete, id: result.id || athlete.id, teamLogo: result.teamLogo || inheritedTeamLogo };
      const athletes = [...readAthletes().filter((item) => item.id !== savedAthlete.id), savedAthlete];
      localStorage.setItem("volleyballAthletes", JSON.stringify(athletes));
      localStorage.setItem("volleyballCurrentAthleteId", savedAthlete.id);
      onAthleteOnline(savedAthlete);
      setNotice("Sporcu profili oluşturuldu ve derste olanlar alanına eklendi."); form.reset();
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  };
  return <div className="page registration-page">
    <div className="registration-intro"><span className="eyebrow"><ShieldCheck size={15}/> GÜVENLİ KAYIT</span><h1>Takımını akademiye taşı.</h1><p>Önce okul başvurusu yapılır. Yönetici onayından sonra okulun 6 haneli davet kodu WhatsApp ile iletilir; sporcular bu kodla kendi profillerini oluşturur.</p><nav className="registration-local-nav" aria-label="Kayıt sayfası menüsü"><button type="button" onClick={()=>go("registered-schools")}><span><School/><b>Kayıtlı Okullar</b><small>Akademimizdeki spor okullarını incele</small></span><ArrowRight/></button></nav></div>
    <section className="registration-card">
      <div className="registration-tabs"><button className={type==="school"?"active":""} onClick={()=>{setType("school");setNotice("")}}><School/> Okul kaydı</button><button className={type==="athlete"?"active":""} onClick={()=>{setType("athlete");setNotice("")}}><UserPlus/> Sporcu kaydı</button></div>
      {type === "school" ? <form onSubmit={submitSchool} className="registration-form"><div className="form-heading"><School/><span><b>Okul başvurusu</b><small>Başvurunuz yönetici onayından sonra etkinleştirilir.</small></span></div><label>Okul adı<input name="schoolName" required minLength="3" placeholder="Örn. İzmir Gençlik Voleybol Okulu" /></label><label>WhatsApp telefon numarası<input name="phone" required inputMode="tel" placeholder="05XX XXX XX XX" /></label><button className="btn" disabled={busy}>{busy?"Kaydediliyor…":"Başvuruyu gönder"}<ArrowRight/></button></form>
      : <form onSubmit={submitAthlete} className="registration-form"><div className="form-heading"><UserPlus/><span><b>Sporcu profili</b><small>Kayıtlı okul ve onaylanmış 6 haneli kod gereklidir.</small></span></div><div className="form-grid athlete-school-grid"><SearchableSchoolPicker value={athleteSchool} onChange={(school)=>{setAthleteSchool(school);setNotice("")}} options={approvedSchools.map((school)=>school.schoolName)} logoFor={registrationSchoolLogo} label="Spor okulu"/><label>6 haneli okul kodu<input name="schoolCode" required inputMode="numeric" maxLength="6" pattern="[0-9]{6}" /></label></div><label>Sporcu adı<input name="athleteName" required defaultValue="@" minLength="3" maxLength="31" pattern="@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}" autoCapitalize="none" spellCheck="false" aria-describedby="athlete-name-help"/><small id="athlete-name-help" className="field-help">Örnek: @eda10 — boşluk kullanmayın.</small></label><fieldset><legend>Voleybolcu profilini seç</legend><small className="avatar-help">6 kadın ve 6 erkek voleybolcu profili</small><div className="avatar-choices">{profileChoices.map((choice)=><button type="button" key={choice.id} className={avatar===choice.id?"active":""} onClick={()=>setAvatar(choice.id)} aria-label={`${choice.name} profilini seç`} title={choice.name}><AthleteAvatar id={choice.id}/></button>)}</div></fieldset><button className="btn" disabled={busy||approvedSchools.length===0||!athleteSchool}>{busy?"Profil oluşturuluyor…":"Sporcu profilini oluştur"}<ArrowRight/></button></form>}
      {notice && <div className="registration-notice" role="status"><CheckCircle2/>{notice}</div>}
    </section>
  </div>;
}

function RegisteredSchoolsPage({ go }) {
  const schools = Array.from(readSchools()
    .filter((school) => String(school.status || "").trim().toLocaleUpperCase("tr") === "ONAYLANDI")
    .reduce((items, school) => {
      const key = String(school.schoolName || "").trim().toLocaleLowerCase("tr");
      if (key && !items.has(key)) items.set(key, school);
      return items;
    }, new Map()).values())
    .sort((a, b) => String(a.schoolName).localeCompare(String(b.schoolName), "tr"));

  return <div className="registered-schools-page">
    <section className="registered-schools-hero">
      <div>
        <button className="schools-back" type="button" onClick={()=>go("register")}><ArrowRight/> Kayıt sayfasına dön</button>
        <span className="eyebrow"><School size={16}/> VOLEYBOL OKULLARI AĞI</span>
        <h1>Sahada birlikte<br/><em>büyüyen okullar.</em></h1>
        <p>Online Voleybol Akademisi’ne katılan ve yönetici onayı tamamlanan spor okullarını keşfedin.</p>
      </div>
      <div className="schools-count" aria-label={`${schools.length} kayıtlı spor okulu`}><b>{schools.length}</b><span>Kayıtlı<br/>spor okulu</span></div>
    </section>
    {schools.length ? <section className="registered-schools-grid" aria-label="Kayıtlı spor okulları">
      {schools.map((school, index)=><article className="registered-school" key={school.id || school.schoolName}>
        <span className="registered-school-number">{String(index + 1).padStart(2, "0")}</span>
        <div className="registered-school-logo">{school.teamLogo ? <TeamLogo src={school.teamLogo} name={school.schoolName}/> : <School/>}</div>
        <div><small>AKADEMİ ÜYESİ</small><h2>{school.schoolName}</h2><span><CheckCircle2/> Kaydı onaylandı</span></div>
      </article>)}
    </section> : <section className="registered-schools-empty"><School/><h2>Kayıtlı okul bulunamadı</h2><p>Onaylanan spor okulları burada logoları ve adlarıyla görüntülenecek.</p><button className="btn" onClick={()=>go("register")}>Okul kaydı oluştur <ArrowRight/></button></section>}
  </div>;
}

const whatsappPhone = "905557924758";
function PricingPage() {
  const plans = [
    {
      name: "Aylık Akademi",
      price: "1.200",
      period: "aylık",
      description: "Esnek başlangıç yapmak isteyen spor okulları için.",
      badge: "AYLIK PLAN",
      featured: false,
    },
    {
      name: "Yıllık Akademi",
      price: "10.000",
      period: "yıllık",
      description: "Tüm sezon boyunca kesintisiz akademi erişimi.",
      badge: "4.400 TL AVANTAJ",
      featured: true,
    },
  ];
  const whatsappLink = (plan) => `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Merhaba, Online Voleybol Akademisi ${plan.name} (${plan.price} TL ${plan.period}) hakkında bilgi almak istiyorum.`)}`;
  return <div className="pricing-page">
    <section className="pricing-hero">
      <span className="eyebrow"><BadgeTurkishLira/> SPOR OKULLARINA ÖZEL</span>
      <h1>Tek ücret,<br/><em>sınırsız öğrenci.</em></h1>
      <p>Spor okulunuzdaki tüm öğrencileri ekleyin; derslere, eğitim videolarına ve sınavlara tek üyelikle erişin.</p>
      <div className="unlimited-students"><Users/><span><b>Sınırsız öğrenci kaydı</b><small>Öğrenci başına ek ücret yok</small></span></div>
    </section>
    <section className="pricing-grid" aria-label="Üyelik seçenekleri">
      {plans.map((plan)=><article className={`pricing-card ${plan.featured?"featured":""}`} key={plan.name}>
        <div className="pricing-card-top"><span>{plan.badge}</span>{plan.featured&&<Trophy/>}</div>
        <h2>{plan.name}</h2>
        <p>{plan.description}</p>
        <div className="pricing-price"><b>{plan.price}</b><span>TL<small>/{plan.period}</small></span></div>
        <ul>
          <li><CheckCircle2/> Sınırsız öğrenci</li>
          <li><CheckCircle2/> Tüm voleybol dersleri</li>
          <li><CheckCircle2/> Eğitim videoları ve sınavlar</li>
          <li><CheckCircle2/> Kulüp ve sporcu profilleri</li>
          <li><CheckCircle2/> Mobil, tablet ve masaüstü erişimi</li>
        </ul>
        <a className="pricing-whatsapp" href={whatsappLink(plan)} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp ile iletişime geç <ArrowRight/></a>
      </article>)}
    </section>
    <section className="pricing-contact">
      <span><MessageCircle/><b>WhatsApp destek hattı</b></span>
      <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer">0555 792 47 58</a>
    </section>
  </div>;
}

function DemoPage({ go }) {
  const [section, setSection] = useState("lesson");
  const [answer, setAnswer] = useState(null);
  const sampleVideo = trainingVideos[0];
  const demoTabs = [
    ["lesson", BookOpen, "Örnek Ders"],
    ["video", Video, "Örnek Video"],
    ["exam", CheckCircle2, "Örnek Sınav"],
  ];
  return <div className="demo-page">
    <section className="demo-hero">
      <span className="eyebrow"><Play/> ÜCRETSİZ AKADEMİ DEMOSU</span>
      <h1>Akademiyi<br/><em>yakından incele.</em></h1>
      <p>Bir ders anlatımını oku, eğitim videosunu izle ve örnek sınav sorusunu cevapla.</p>
    </section>
    <nav className="demo-tabs" aria-label="Demo bölümleri">
      {demoTabs.map(([key, Icon, label])=><button key={key} className={section===key?"active":""} onClick={()=>setSection(key)}><Icon/><span>{label}</span></button>)}
    </nav>
    <section className="demo-stage">
      {section === "lesson" && <article className="demo-lesson">
        <div className="demo-media"><img src="./lesson-images/parmak-pas-01.webp" alt="Parmak pas hazır pozisyonu teknik anlatımı"/><span>ÜCRETSİZ ÖRNEK</span></div>
        <div className="demo-content"><small>DERS 01 • PARMAK PAS</small><h2>Parmak pasın temel mantığı</h2><p>Parmak pasın amacı topa vurmak değil, topun hızını parmaklarla kontrol ederek onu istenilen hedefe yönlendirmektir.</p><ul><li><CheckCircle2/> Topun geliş yönünü takip et.</li><li><CheckCircle2/> Ayaklarını omuz genişliğinde aç.</li><li><CheckCircle2/> Topla alnının önünde kısa süreli temas kur.</li><li><CheckCircle2/> Hareketi bacaklardan başlayarak tamamla.</li></ul></div>
      </article>}
      {section === "video" && <article className="demo-video">
        <div className="demo-video-frame"><iframe src={sampleVideo.preview} title={`Demo video: ${sampleVideo.title}`} allow="autoplay; fullscreen" allowFullScreen/></div>
        <div className="demo-video-info"><span><Video/> ÖRNEK EĞİTİM VİDEOSU</span><h2>{sampleVideo.title}</h2><p>{sampleVideo.topic} kategorisindeki bu kısa çalışmayı izleyerek video kütüphanesinin kullanımını deneyebilirsin.</p></div>
      </article>}
      {section === "exam" && <article className="demo-exam">
        <span><Target/> ÖRNEK SINAV SORUSU</span><h2>Parmak pasta topa temas noktası nerede olmalıdır?</h2>
        <div className="demo-options">{["Göğüs hizasında", "Alnın önünde", "Bel hizasında", "Başın arkasında"].map((option,index)=><button key={option} className={answer===index?(index===1?"correct":"wrong"):""} onClick={()=>setAnswer(index)}><i>{String.fromCharCode(65+index)}</i>{option}{answer===index&&(index===1?<CheckCircle2/>:<X/>)}</button>)}</div>
        {answer!==null&&<div className={`demo-answer ${answer===1?"correct":"wrong"}`}>{answer===1?<><CheckCircle2/><span><b>Doğru cevap!</b><p>Topla temas, kontrol ve yönlendirme için alnın hemen önünde yapılır.</p></span></>:<><X/><span><b>Tekrar düşün.</b><p>Doğru temas noktası alnın hemen önüdür.</p></span></>}</div>}
      </article>}
    </section>
    <section className="demo-cta"><span><small>DEVAM ETMEYE HAZIR MISIN?</small><h2>Tüm akademinin kilidini aç.</h2></span><button className="btn" onClick={()=>go("register")}>Spor okulunu kaydet <ArrowRight/></button></section>
  </div>;
}

function Header({ page, go, menu, setMenu, account, isAuthenticated, onLogout }) {
  const isAthleteAccount = Boolean(account?.avatar);
  const visibleNav = isAuthenticated
    ? nav.filter(([key]) => key !== "profiles" && (!isAthleteAccount || !["demo", "pricing", "register"].includes(key)))
    : nav.filter(([key]) => ["home", "junior-referee", "demo", "pricing", "register", "profiles"].includes(key));
  const accountTeamLogo = account?.schoolName && !account?.avatar
    ? readSchools().find((school) => school.schoolName === account.schoolName && school.teamLogo)?.teamLogo
      || readAthletes().find((athlete) => athlete.schoolName === account.schoolName && athlete.teamLogo)?.teamLogo || ""
    : "";
  return (
    <header className="header">
      <button
        className="brand"
        onClick={() => go("home")}
        aria-label="Ana sayfa"
      >
        <img className="ball" src="./brand-logo.png" alt="" aria-hidden="true" />
        <span>
          VOLEYBOL
          <br />
          <b>AKADEMİSİ</b>
        </span>
      </button>
      <nav className={menu ? "nav open" : "nav"} aria-label="Ana menü">
        {visibleNav.map(([k, v, Icon]) => (
          <button
            className={page === k ? "active" : ""}
            onClick={() => go(k)}
            key={k}
          >
            <Icon aria-hidden="true" /> <span>{v}</span>
          </button>
        ))}
        {isAuthenticated && <button onClick={() => go("courses")} className="btn small">
          Derslere Başla
        </button>}
        {isAuthenticated && account && <div className="header-account">
          <button className="account-profile" onClick={() => go("profiles")} aria-label="Hesap profilini aç"><span className="account-visual">{account.avatar ? <AthleteAvatar id={account.avatar}/> : accountTeamLogo ? <TeamLogo src={accountTeamLogo} name={account.schoolName}/> : <UserRound/>}</span><span><small>HESABIM</small>{account.name || account.schoolName}</span></button>
          <button className="account-logout" onClick={onLogout} aria-label="Web sitesinden çıkış yap"><LogOut/><span>Çıkış Yap</span></button>
        </div>}
      </nav>
      <button
        className="menu-btn"
        onClick={() => setMenu(!menu)}
        aria-label="Menüyü aç"
      >
        {menu ? <X /> : <Menu />}
      </button>
    </header>
  );
}
function HomePage({ go, isAuthenticated }) {
  const schoolCount = new Set(readSchools().map((school) => String(school.schoolName || "").trim().toLocaleLowerCase("tr")).filter(Boolean)).size;
  const athleteCount = readAthletes().length;
  return (
    <>
      <section className="hero">
        <div className="court-lines" />
        <div className="hero-copy">
          <span className="eyebrow">
            <Zap size={15} /> ONLINE VOLEYBOL AKADEMİSİ
          </span>
          <h1>
            Voleybol ailesi
            <br />
            <em>birlikte gelişir.</em>
          </h1>
          <p>
            Spor okulunu akademiye kaydet veya sporcu hesabınla giriş yap.
            Derslere, eğitim videolarına ve sınavlara tek noktadan ulaş.
          </p>
          <div className="actions">
            <button className="btn" onClick={() => go(isAuthenticated ? "courses" : "register")}>
              {isAuthenticated ? "Derslere Başla" : "Spor Okulu Kaydı"} <ArrowRight size={18} />
            </button>
            <button className="btn ghost" onClick={() => go(isAuthenticated ? "videos" : "profiles")}>
              <UserRound size={18} /> {isAuthenticated ? "Eğitim Videoları" : "Sporcu Girişi"}
            </button>
          </div>
          <div className="proof">
            <span><b>{schoolCount}</b><br/>spor okulu</span>
            <span><b>{athleteCount}</b><br/>kayıtlı sporcu</span>
            <span><b>{trainingVideos.length}</b><br/>eğitim videosu</span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="./volleyball-family-hero.webp"
            alt="Voleybol topu tutan yetişkin erkek, erkek çocuk, yetişkin kadın ve kız çocuk"
          />
        </div>
      </section>
      {isAuthenticated ? <><section className="section">
        <Title
          eyebrow="EĞİTİM KÜTÜPHANESİ"
          title="26 kurs, tek hedef: daha iyi voleybol."
          text="Temel tekniklerden ileri taktiğe kadar tüm voleybol eğitimleri burada."
        />
        <div className="course-grid">
          {courses.map((c) => (
            <CourseCard key={c[0]} c={c} go={go} />
          ))}
        </div>
      </section>
      <Categories go={go} /></> : null}
    </>
  );
}
function Stats({ schoolCount, athleteCount }) {
  return (
    <section className="stats">
      {[
        [School, schoolCount, "Kayıtlı spor okulu"],
        [Users, athleteCount, "Kayıtlı sporcu"],
        [Video, trainingVideos.length, "Eğitim videosu"],
        [BookOpen, courses.length, "Voleybol dersi"],
      ].map(([I, n, t]) => (
        <div key={t}>
          <I />
          <b>{n}</b>
          <span>{t}</span>
        </div>
      ))}
    </section>
  );
}
function Title({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
function CourseCard({ c, go }) {
  const isPreparing = !sheetBackedCourses.has(c[1]);
  return (
    <article className="course-card">
      <div className="cover">
        <img
          loading="lazy"
          src={c[10]}
          alt={`${c[1]} dersi kapak görseli`}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <span>{c[4]}</span>
        {isPreparing && <strong className="course-status">Hazırlanıyor</strong>}
        <button aria-label="Favoriye ekle">
          <Heart />
        </button>
      </div>
      <div className="card-body">
        <span className="tag">{c[3]}</span>
        <h3>{c[1]}</h3>
        <p>{c[2]}</p>
        <div className="meta">
          <span>
            <BookOpen /> {c[7]} bölüm
          </span>
        </div>
        {c[8] > 0 && (
          <div className="mini-progress">
            <span style={{ width: c[8] + "%" }} />
            <small>%{c[8]} tamamlandı</small>
          </div>
        )}
        <button className="card-link" onClick={() => go("course", c)}>
          Derse Git <ArrowRight />
        </button>
      </div>
    </article>
  );
}
function Categories({ go }) {
  let icons = [
    Target,
    GraduationCap,
    ShieldCheck,
    Zap,
    Flame,
    BarChart3,
    Dumbbell,
    Heart,
  ];
  return (
    <section className="section pale">
      <Title
        eyebrow="26 VOLEYBOL EĞİTİM KATEGORİSİ"
        title="Gelişimin için ne gerekiyorsa."
        text="Temel tekniklerden pozisyona özel eğitime, fiziksel gelişimden oyun zekâsına kadar yalnızca voleybola odaklanan programlar."
      />
      <div className="category-grid category-topics">
        {courseCategories.map((t, i) => {
          const I = icons[i % icons.length];
          return (
            <button onClick={() => go("courses")} key={t}>
              <I />
              <span>
                <small>KATEGORİ {String(i + 1).padStart(2, "0")}</small>
                <b>{t}</b>
              </span>
              <ArrowRight />
            </button>
          );
        })}
      </div>
    </section>
  );
}
function How() {
  return (
    <section className="section">
      <Title eyebrow="NASIL ÇALIŞIR?" title="Üç adımda sahaya hazır." />
      <div className="steps">
        {[
          [
            "01",
            "Hedefini belirle",
            "Seviyeni, pozisyonunu ve gelişim hedeflerini seç.",
          ],
          [
            "02",
            "Programını uygula",
            "Video dersleri izle, antrenmanlarını tamamla.",
          ],
          [
            "03",
            "Gelişimini izle",
            "Performans verilerini ve başarılarını tek yerde gör.",
          ],
        ].map((x) => (
          <article key={x[0]}>
            <b>{x[0]}</b>
            <h3>{x[1]}</h3>
            <p>{x[2]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function Testimonials() {
  return (
    <section className="section pale">
      <Title eyebrow="SPORCULAR ANLATIYOR" title="Birlikte yükseliyoruz." />
      <div className="quotes">
        {[
          [
            "“Manşet eğitimindeki küçük düzeltmeler servis karşılamamı tamamen değiştirdi.”",
            "İrem K.",
            "Libero • U18",
          ],
          [
            "“Programlar yoğun okul temposunda bile sürdürülebilir. İlerlememi net görüyorum.”",
            "Arda T.",
            "Smaçör • U20",
          ],
          [
            "“Antrenör geri bildirimleri kısa, anlaşılır ve doğrudan sahada uygulanabilir.”",
            "Elif S.",
            "Pasör • Bölgesel Lig",
          ],
        ].map((q) => (
          <blockquote key={q[1]}>
            <div>★★★★★</div>
            <p>{q[0]}</p>
            <footer>
              <b>{q[1]}</b>
              <span>{q[2]}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
function FAQ() {
  let [open, setOpen] = useState(0),
    qs = [
      [
        "Derslere ne kadar süre erişebilirim?",
        "Kayıt olduğun kurslara üyeliğin boyunca dilediğin zaman ve cihazdan erişebilirsin.",
      ],
      [
        "Eğitimler hangi seviyelere uygun?",
        "Başlangıç, orta ve ileri seviyelere özel programlar bulunur. Filtrelerle sana uygun içeriği kolayca seçebilirsin.",
      ],
      [
        "Antrenörlere soru sorabilir miyim?",
        "Evet. Ders ekranından sorunu iletebilir ve antrenör geri bildirimlerini panelinden takip edebilirsin.",
      ],
      [
        "Programı telefonumdan kullanabilir miyim?",
        "Evet. Tüm ekranlar telefon, tablet ve masaüstü için optimize edilmiştir.",
      ],
    ];
  return (
    <section className="section faq">
      <Title eyebrow="MERAK ETTİKLERİN" title="Sık sorulan sorular" />
      <div>
        {qs.map((q, i) => (
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            key={q[0]}
            aria-expanded={open === i}
          >
            <span>
              <b>{q[0]}</b>
              {open === i && <p>{q[1]}</p>}
            </span>
            <ChevronDown className={open === i ? "rotate" : ""} />
          </button>
        ))}
      </div>
    </section>
  );
}
function Courses({ go }) {
  const [q, setQ] = useState(""),
    [level, setLevel] = useState("Tümü"),
    [category, setCategory] = useState("Tüm kategoriler");
  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          (level === "Tümü" || c[4] === level) &&
          (category === "Tüm kategoriler" || c[3] === category) &&
          (c[1] + c[2] + c[3] + c[5])
            .toLocaleLowerCase("tr")
            .includes(q.toLocaleLowerCase("tr")),
      ),
    [q, level, category],
  );
  const hasFilters =
    q.trim() || level !== "Tümü" || category !== "Tüm kategoriler";
  return (
    <div className="page">
      <div className="page-head">
        <span className="eyebrow">26 VOLEYBOL DERSİ</span>
        <h1>Oyunun her yönünü geliştir.</h1>
        <p>
          Yalnızca voleybola yönelik, uygulamalı ve ayrıntılı dersler.
        </p>
      </div>
      <section className="filter-panel" aria-label="Ders filtreleri">
        <div className="filter-panel-head">
          <div>
            <span className="filter-kicker">DERS KÜTÜPHANESİ</span>
            <h2>Dersini hızlıca bul</h2>
            <p>Konu ve seviyeni seç, sana uygun içeriğe hemen ulaş.</p>
          </div>
          <div className="filter-result" aria-live="polite">
            <b>{filtered.length}</b>
            <span>ders bulundu</span>
          </div>
        </div>
        <div className="filter-fields">
          <label className="filter-field" htmlFor="category">
            <span>Ders konusu</span>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Tüm kategoriler</option>
              {courseCategories.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="filter-field search-field">
            <span>Ders veya konu ara</span>
            <div>
              <Search />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Örn. servis, smaç, manşet"
              />
            </div>
          </label>
        </div>
        <div className="filter-bottom">
          <div className="level-segments" aria-label="Seviye seçimi">
            {["Tümü", "Başlangıç", "Orta", "İleri"].map((x) => (
              <button
                className={level === x ? "active" : ""}
                onClick={() => setLevel(x)}
                aria-pressed={level === x}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          {hasFilters && (
            <button
              className="clear-filters"
              onClick={() => {
                setQ("");
                setLevel("Tümü");
                setCategory("Tüm kategoriler");
              }}
            >
              <X /> Filtreleri temizle
            </button>
          )}
        </div>
      </section>
      {filtered.length ? (
        <div className="course-grid">
          {filtered.map((c) => (
            <CourseCard c={c} go={go} key={c[0]} />
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
}
function Dashboard({ go }) {
  return (
    <div className="dashboard page">
      <div className="dash-hello">
        <div>
          <span className="eyebrow">20 TEMMUZ, PAZARTESİ</span>
          <h1>Tekrar hoş geldin, Deniz! 👋</h1>
          <p>Serini korumak için bugünkü 25 dakikalık çalışman hazır.</p>
        </div>
        <button className="btn" onClick={() => go("courses")}>
          <Play /> Derse Devam Et
        </button>
      </div>
      <div className="metric-grid">
        {[
          [Target, "72%", "Toplam ilerleme", "+8% bu ay"],
          [CheckCircle2, "28", "Tamamlanan ders", "4 bu hafta"],
          [Clock, "18s 40dk", "İzleme süresi", "+2s 15dk"],
          [Trophy, "7", "Kazanılan rozet", "1 yeni"],
        ].map(([I, n, t, s]) => (
          <article key={t}>
            <I />
            <span>
              <b>{n}</b>
              <small>{t}</small>
            </span>
            <em>{s}</em>
          </article>
        ))}
      </div>
      <div className="dash-grid">
        <section className="next card">
          <div className="card-title">
            <span>
              <small>SIRADAKİ DERS</small>
              <h2>Smaçta kol salınımı</h2>
            </span>
            <span className="pill">12 dk</span>
          </div>
          <div className="video-thumb">
            <img src={courses[1][10]} alt="Smaç dersi" />
            <button aria-label="Dersi oynat">
              <Play />
            </button>
          </div>
          <div className="mini-progress">
            <span style={{ width: "46%" }} />
            <small>%46 kurs ilerlemesi</small>
          </div>
          <button className="btn wide">
            Derse Devam Et <ArrowRight />
          </button>
        </section>
        <section className="card today">
          <div className="card-title">
            <span>
              <small>BUGÜNKÜ ANTRENMAN</small>
              <h2>Alt vücut & sıçrama</h2>
            </span>
            <Dumbbell />
          </div>
          {[
            ["Dinamik ısınma", "8 dk"],
            ["Pliometrik sıçrama", "12 dk"],
            ["Tek bacak kuvvet", "10 dk"],
            ["Mobilite ve soğuma", "7 dk"],
          ].map((x, i) => (
            <div className="workout" key={x[0]}>
              <i>{i + 1}</i>
              <span>
                <b>{x[0]}</b>
                <small>{x[1]}</small>
              </span>
              <input type="checkbox" aria-label={`${x[0]} tamamlandı`} />
            </div>
          ))}
          <button className="btn ghost wide" onClick={() => go("training")}>
            Programı Gör
          </button>
        </section>
        <ProgressChart />
        <section className="card announcements">
          <div className="card-title">
            <h2>Duyurular</h2>
            <button>Tümünü gör</button>
          </div>
          {[
            ["Canlı Ders", "Servis karşılama analizi", "Bugün • 20:00"],
            ["Yeni Kurs", "Blok zamanlaması yayında", "Dün"],
            ["Program", "Haftalık planın güncellendi", "2 gün önce"],
          ].map((x, i) => (
            <article key={x[1]}>
              <i className={"an" + i}>
                {i === 0 ? (
                  <Video />
                ) : i === 1 ? (
                  <BookOpen />
                ) : (
                  <CalendarDays />
                )}
              </i>
              <span>
                <small>{x[0]}</small>
                <b>{x[1]}</b>
                <em>{x[2]}</em>
              </span>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
function ProgressChart() {
  return (
    <section className="card chart">
      <div className="card-title">
        <span>
          <small>HAFTALIK GELİŞİM</small>
          <h2>Çalışma süresi</h2>
        </span>
        <b>3s 45dk</b>
      </div>
      <div className="bars">
        {[35, 62, 48, 80, 70, 92, 55].map((h, i) => (
          <div key={i}>
            <span style={{ height: h + "%" }} />
            <small>{["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"][i]}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
function Training() {
  let days = [
    "Pzt 20",
    "Sal 21",
    "Çar 22",
    "Per 23",
    "Cum 24",
    "Cmt 25",
    "Paz 26",
  ];
  return (
    <div className="page">
      <div className="page-head">
        <span className="eyebrow">KİŞİSEL PROGRAM</span>
        <h1>Antrenman planın</h1>
        <p>Teknik, kuvvet ve dinlenme dengesini koru; her çalışmayı kaydet.</p>
      </div>
      <div className="week">
        {days.map((d, i) => (
          <button className={i === 0 ? "active" : ""} key={d}>
            <b>{d.split(" ")[0]}</b>
            <span>{d.split(" ")[1]}</span>
            {[0, 2, 4, 5].includes(i) && <i />}
          </button>
        ))}
      </div>
      <section className="training-list">
        {[
          ["09:00", "Teknik", "Servis Karşılama & Manşet", "45 dk", "Orta"],
          ["15:30", "Kuvvet", "Alt Vücut ve Sıçrama", "40 dk", "Zor"],
          ["18:00", "Mobilite", "Omuz & Kalça Mobilitesi", "20 dk", "Kolay"],
        ].map((w, i) => (
          <article key={w[2]}>
            <time>{w[0]}</time>
            <div className={"work-icon wi" + i}>
              {i === 0 ? <Target /> : i === 1 ? <Dumbbell /> : <Heart />}
            </div>
            <span>
              <small>{w[1]}</small>
              <h3>{w[2]}</h3>
              <p>
                {i === 0
                  ? "Top, duvar, direnç bandı"
                  : i === 1
                    ? "Kutu, mini bant, mat"
                    : "Mat, direnç bandı"}
              </p>
            </span>
            <div className="work-meta">
              <b>{w[3]}</b>
              <em>{w[4]}</em>
            </div>
            <button className="btn small">Başla</button>
          </article>
        ))}
      </section>
    </div>
  );
}
function Performance() {
  let metrics = [
    ["Servis başarısı", 78, "+6"],
    ["Manşet doğruluğu", 84, "+4"],
    ["Pas kalitesi", 71, "+9"],
    ["Smaç başarısı", 66, "+5"],
    ["Blok başarısı", 62, "+3"],
    ["Antrenman devamlılığı", 91, "+8"],
  ];
  return (
    <div className="page">
      <div className="page-head">
        <span className="eyebrow">PERFORMANS & GELİŞİM</span>
        <h1>Veriler gelişimini anlatsın.</h1>
        <p>Son 30 gündeki çalışmalarına göre güncel beceri görünümün.</p>
      </div>
      <div className="performance-grid">
        {metrics.map((m) => (
          <article key={m[0]}>
            <div>
              <span>{m[0]}</span>
              <em>↗ %{m[2]}</em>
            </div>
            <b>%{m[1]}</b>
            <div className="skill">
              <span style={{ width: m[1] + "%" }} />
            </div>
            <small>Son değerlendirmeye göre</small>
          </article>
        ))}
      </div>
      <div className="card insight">
        <Target />
        <div>
          <small>ANTRENÖR İÇGÖRÜSÜ</small>
          <h2>Manşet platformun istikrarlı gelişiyor.</h2>
          <p>
            Bir sonraki odağın kısa servise öne adım ve platformu erken
            sabitlemek olsun.
          </p>
        </div>
        <button className="btn ghost">Detayı Gör</button>
      </div>
    </div>
  );
}
const courseCurriculum = {
  "Voleybola giriş ve temel kurallar": [
    "Saha ölçüleri, file ve oyun alanı",
    "Ralli puanlama ve temas kuralları",
    "Rotasyon, oyuncu rolleri ve güvenlik",
  ],
  "Parmak pas": [
    "Parmak pasın tanımı",
    "Öne parmak pas",
    "Öne pasta hız kontrolü ve yön",
    "Geriye parmak pas",
    "Sıçrayarak parmak pas",
    "Parmak pas analizi",
    "Genel pas uygulaması",
    "Duvarda parmak pas çalışması",
    "Kendi attığı topa parmak pas",
    "Oturarak ikili parmak pas",
    "Karşılıklı parmak pas",
    "Dörtlü parmak pas",
    "Kayma adımlı parmak pas",
    "Üçlü parmak pas",
    "File önü parmak pas",
    "Merkez ve koni etrafı pas",
  ],
  Manşet: [
    "Platform oluşturma ve temas noktası",
    "Topa hareket, açı ve hedef kontrolü",
    "Servis karşılama uygulamaları",
  ],
  "Servis teknikleri": [
    "Servis rutini ve istikrarlı temas",
    "Ayakta floater servis",
    "Sıçrayarak servis ve hedef bölgeler",
  ],
  Smaç: [
    "Yaklaşma ritmi ve son iki adım",
    "Sıçrama ile kol salınımı",
    "Yön, hız ve güvenli iniş",
  ],
  Blok: [
    "Hazır pozisyon ve file hareketi",
    "Okuma, zamanlama ve el yerleşimi",
    "İkili blok kapatma çalışmaları",
  ],
  "Savunma teknikleri": [
    "Savunma duruşu ve rakibi okuma",
    "Kazma, yuvarlanma ve dalış",
    "Blok arkası alan paylaşımı",
  ],
  "Hücum organizasyonları": [
    "Pasör hedefi ve hücuma geçiş",
    "Hızlı, yüksek ve arka alan hücumu",
    "Kombinasyon ve hücum dengesi",
  ],
  "Pozisyon bilgisi": [
    "Altı saha bölgesi ve rotasyon",
    "Ön–arka hat sorumlulukları",
    "Geçiş ve uzmanlaşma ilkeleri",
  ],
  "Pasör eğitimi": [
    "Hedefe geçiş ve dengeli duruş",
    "Top kalitesine göre karar verme",
    "Hücumcuları oyuna dağıtma",
  ],
  "Libero eğitimi": [
    "Libero kuralları ve yerleşim",
    "Servis karşılama liderliği",
    "Alan savunması ve ikinci top",
  ],
  "Orta oyuncu eğitimi": [
    "Blok okuma ve yan adımlar",
    "Hızlı hücum yaklaşması",
    "Bloktan hücuma geçiş",
  ],
  "Smaçör eğitimi": [
    "Karşılama sonrası hücuma çıkış",
    "Sol kanat yaklaşma açıları",
    "Blok dışı ve blok arası bitiriş",
  ],
  "Pasör çaprazı eğitimi": [
    "Sağ kanat hücum mekaniği",
    "Yüksek top ve arka alan hücumu",
    "Rakip smaçöre karşı blok",
  ],
  "Takım rotasyonları": [
    "Servis sırası ve başlangıç dizilişi",
    "5-1 sisteminde geçişler",
    "Rotasyon hatalarını önleme",
  ],
  "Maç analizi": [
    "Ralli kodlama ve gözlem",
    "Servis–karşılama eğilimleri",
    "Maç planı ve set arası uyarlama",
  ],
  "Taktik ve oyun zekâsı": [
    "Rakip dizilişini okuma",
    "Risk, skor ve hedef seçimi",
    "Oyun içi iletişim ve karar",
  ],
  "Kondisyon ve kuvvet": [
    "Voleybola özgü hareket taraması",
    "Alt–üst vücut kuvvet temeli",
    "Yük planlama ve toparlanma",
  ],
  "Sıçrama geliştirme": [
    "İniş mekaniği ve kuvvet emme",
    "Pliometrik temel ve kol katkısı",
    "Yaklaşmalı sıçrama ölçümü",
  ],
  "Hız ve çeviklik": [
    "İlk adım ve reaksiyon",
    "Yanal hareket ve yön değiştirme",
    "Saha içi çeviklik parkuru",
  ],
  "Esneklik ve mobilite": [
    "Omuz ve göğüs kafesi hareketi",
    "Kalça ve ayak bileği mobilitesi",
    "Antrenman öncesi hareket akışı",
  ],
  "Isınma ve soğuma": [
    "Kademeli dinamik ısınma",
    "Omuz aktivasyonu ve top çalışması",
    "Nabız düşürme ve toparlanma",
  ],
  "Sakatlık önleme": [
    "Omuz yükünü güvenli yönetme",
    "Diz ve ayak bileği stabilitesi",
    "İniş, dalış ve toparlanma tekniği",
  ],
  "Sporcu beslenmesi": [
    "Antrenman öncesi enerji",
    "Sıvı ve elektrolit dengesi",
    "Maç sonrası toparlanma tabağı",
  ],
  "Mental hazırlık": [
    "Nefes ve dikkat kontrolü",
    "Servis öncesi performans rutini",
    "Hata sonrası yeniden odaklanma",
  ],
  "Plaj voleybolu temelleri": [
    "Kum sahası ve oyun farkları",
    "İkili takımda alan paylaşımı",
    "Rüzgâr, servis ve hücum taktiği",
  ],
};
function getEquipment(title) {
  if (/kuvvet|Sıçrama|Hız|mobilite|Isınma|Sakatlık/.test(title))
    return ["Egzersiz matı", "Mini direnç bandı", "Koni veya işaretleyici"];
  if (/beslenme/i.test(title))
    return ["Su şişesi", "Antrenman günlüğü", "Örnek öğün planı"];
  if (/Mental|analizi|Taktik/.test(title))
    return ["Not defteri", "Maç videosu", "Performans takip formu"];
  return ["Voleybol topu", "File veya hedef şeridi", "Saha işaretleyicileri"];
}
const introLessonDetails = [
  {
    title: "Voleybolun doğuşu ve gelişimi",
    body: "Voleybol 1895 yılında William G. Morgan tarafından Amerika Birleşik Devletleri’nde geliştirildi ve ilk adı “mintonette” idi. Spor, 1913 Manila Uzak Asya Oyunları ile uluslararası organizasyonda yer aldı; altı oyunculu sistem Japonya’da uygulandı. FIVB 1947’de Paris’te kuruldu ve voleybol 1964 Tokyo Olimpiyatları’nda olimpik branş oldu. Türkiye’de voleybol 1919’dan itibaren Selim Sırrı Tarcan ve beden eğitimi öğretmenleri aracılığıyla okullarda yayıldı; Türkiye Voleybol Federasyonu 1958’de kuruldu.",
  },
  {
    title: "Saha, file ve oyuncu yerleşimi",
    body: "Standart salon sahası 18 metre uzunluğunda ve 9 metre genişliğindedir. File sahayı iki eşit alana ayırır; hücum çizgisi fileden 3 metre uzaktadır. Erkeklerde file yüksekliği 2,43 metre, kadınlarda 2,24 metredir. Her takım sahada altı oyuncuyla yer alır. Bölgeler 1’den 6’ya numaralandırılır; servis hakkı kazanıldığında oyuncular saat yönünde bir pozisyon döner.",
  },
  {
    title: "Oyunun amacı, sayı ve temel kurallar",
    body: "Amaç topu file üzerinden rakip alana düşürmek ve rakibin aynı şeyi yapmasını engellemektir. Bir takım blok teması dışında topa en fazla üç kez vurabilir; oyuncu normal koşullarda art arda iki temas yapamaz. Oyun servisle başlar. Ralliyi kazanan takım sayı alır; servis karşılayan takım ralliyi kazanırsa hem sayı hem servis hakkı kazanır. İlk dört set 25, karar seti 15 sayı üzerinden ve en az iki sayı farkla tamamlanır.",
  },
  {
    title: "Ön hat, arka hat ve temel ihlaller",
    body: "Ön hat oyuncuları hücum çizgisinin önünde blok ve hücum yapabilir. Arka hat oyuncusu file üstündeki topa hücum edecekse 3 metre çizgisinin gerisinden sıçramalıdır. Servis sekiz saniye içinde kullanılmalı; top çizgiye değdiğinde içeride kabul edilir. Fileye oyun sırasında temas, dört vuruş, rotasyon hatası ve topu tutma veya taşıma rakibe sayı kazandıran temel ihlallerdendir.",
  },
];
const examBank = {
  "Voleybola giriş ve temel kurallar": [
    {
      q: "Voleybolu 1895 yılında geliştiren kişi kimdir?",
      o: [
        "William G. Morgan",
        "James Naismith",
        "Selim Sırrı Tarcan",
        "Karch Kiraly",
      ],
      a: 0,
      e: "Voleybol, William G. Morgan tarafından “mintonette” adıyla geliştirildi.",
    },
    {
      q: "Voleybol ilk kez hangi olimpiyatlarda olimpik branş olarak yer aldı?",
      o: ["1952 Helsinki", "1960 Roma", "1964 Tokyo", "1972 Münih"],
      a: 2,
      e: "Voleybol 1964 Tokyo Olimpiyatları’nda olimpik programa girdi.",
    },
    {
      q: "Bir takım blok teması dışında topa en fazla kaç kez vurabilir?",
      o: ["2", "3", "4", "5"],
      a: 1,
      e: "Takım, topu rakip alana göndermeden önce en fazla üç temas kullanabilir.",
    },
    {
      q: "Standart salon voleybolu sahasının ölçüsü nedir?",
      o: ["12 × 6 m", "16 × 8 m", "18 × 9 m", "20 × 10 m"],
      a: 2,
      e: "Standart saha 18 metre uzunluğunda ve 9 metre genişliğindedir.",
    },
  ],
  "Parmak pas": [
    {
      q: "Parmak pasta topa temas ağırlıklı olarak nerede gerçekleşir?",
      o: [
        "Avuç içinde",
        "Parmak uçlarında ve alın önünde",
        "Ön kolda",
        "Omuzda",
      ],
      a: 1,
      e: "Top alın önünde, parmakların oluşturduğu dengeli yüzeyle kontrol edilir.",
    },
    {
      q: "Parmak pasın temel amacı nedir?",
      o: [
        "Topu tutmak",
        "Hücuma kontrollü ikinci temas hazırlamak",
        "Servisi engellemek",
        "Blok yapmak",
      ],
      a: 1,
      e: "Pasör çoğunlukla ikinci teması kullanarak hücumcuya uygun top hazırlar.",
    },
  ],
  Manşet: [
    {
      q: "Manşette doğru temas yüzeyi hangisidir?",
      o: ["Birleşik ön kollar", "Avuç içleri", "Dirsekler", "Omuzlar"],
      a: 0,
      e: "Kollar birleştirilerek düz ve sabit bir platform oluşturulur.",
    },
    {
      q: "Servis karşılamada açıyı en çok ne belirler?",
      o: [
        "Başın yönü",
        "Platformun açısı",
        "Ayakkabının rengi",
        "File yüksekliği",
      ],
      a: 1,
      e: "Topun hedefe yönü büyük ölçüde ön kol platformunun açısıyla kontrol edilir.",
    },
  ],
  "Servis teknikleri": [
    {
      q: "Servis oyundaki hangi işlevi taşır?",
      o: [
        "Yalnızca oyunu durdurur",
        "Oyunu başlatan ilk hücumdur",
        "Sadece savunmadır",
        "Oyuncu değiştirir",
      ],
      a: 1,
      e: "Servis, oyunu başlatan hareket ve takımın ilk hücumudur.",
    },
    {
      q: "Servis düdükten sonra kaç saniye içinde kullanılmalıdır?",
      o: ["5", "6", "8", "12"],
      a: 2,
      e: "Servis hakem düdüğünden sonra sekiz saniye içinde atılmalıdır.",
    },
  ],
  Smaç: [
    {
      q: "Smaç hareketinin doğru sırası hangisidir?",
      o: [
        "Vuruş–yaklaşma–iniş",
        "Yaklaşma–sıçrama–vuruş–iniş",
        "İniş–vuruş–sıçrama",
        "Blok–servis–vuruş",
      ],
      a: 1,
      e: "Smaç; yaklaşma, sıçrama, havada açılma, vuruş ve güvenli iniş aşamalarından oluşur.",
    },
    {
      q: "Arka hat oyuncusu hücum için nereden sıçramalıdır?",
      o: [
        "File altından",
        "3 metre çizgisinin gerisinden",
        "Orta çizgiden",
        "Servis bölgesi dışından",
      ],
      a: 1,
      e: "Arka hat oyuncusu 3 metre çizgisinin gerisinden sıçramalıdır.",
    },
  ],
  Blok: [
    {
      q: "Blok teması takımın üç vuruş hakkından sayılır mı?",
      o: [
        "Her zaman sayılır",
        "Sayılmaz",
        "Yalnız tekli blokta sayılır",
        "Yalnız ikili blokta sayılır",
      ],
      a: 1,
      e: "Blok teması takımın izin verilen üç temasından biri olarak sayılmaz.",
    },
    {
      q: "Etkili blokta eller nasıl kullanılmalıdır?",
      o: [
        "Geri çekilerek",
        "File üzerinden rakip alana yönlendirilerek",
        "Bel hizasında",
        "Birbirinden tamamen uzak",
      ],
      a: 1,
      e: "Eller file üstünde alan kapatmalı ve topu rakip sahaya yönlendirmelidir.",
    },
  ],
  "Savunma teknikleri": [
    {
      q: "Plonjon hangi durumda kullanılır?",
      o: [
        "Kolay ve yüksek toplarda",
        "Ulaşılamayan alçak ve uzak toplarda",
        "Servis atarken",
        "Blok yaparken",
      ],
      a: 1,
      e: "Plonjon, normal savunma duruşuyla ulaşılamayan zor topları oyunda tutmak için kullanılır.",
    },
    {
      q: "Plonjonda güvenlik için hangi aşama önemlidir?",
      o: [
        "Kontrolsüz düşmek",
        "Temas sonrası güvenli kayma veya yuvarlanma",
        "Dizleri kilitlemek",
        "Fileye tutunmak",
      ],
      a: 1,
      e: "Hamle, temas, kayma/yuvarlanma ve ayağa kalkma doğru sırayla uygulanmalıdır.",
    },
  ],
  "Takım rotasyonları": [
    {
      q: "Servis hakkı kazanıldığında oyuncular hangi yönde döner?",
      o: ["Saat yönünde", "Saat yönünün tersine", "Çapraz", "Dönüş yapılmaz"],
      a: 0,
      e: "Servis karşılayan takım ralliyi kazandığında oyuncular saat yönünde bir pozisyon döner.",
    },
  ],
  "Hücum organizasyonları": [
    {
      q: "5-1 oyun sisteminde kaç ana pasör bulunur?",
      o: ["1", "2", "3", "5"],
      a: 0,
      e: "5-1 sisteminde bir pasör ve beş hücum oyuncusu bulunur.",
    },
    {
      q: "4-2 sisteminin temel özelliği nedir?",
      o: [
        "Dört libero kullanılması",
        "Dört smaçör ve iki pasör kullanılması",
        "Servis kullanılmaması",
        "Tek oyuncuyla oynanması",
      ],
      a: 1,
      e: "4-2 sisteminde dört smaçör ve iki pasör çapraz yerleşir.",
    },
  ],
  "Pasör eğitimi": [
    {
      q: "Pasörün temel görevi nedir?",
      o: [
        "Her topa smaç vurmak",
        "İkinci teması hücumcuya hazırlamak",
        "Sadece blok yapmak",
        "Yalnız servis karşılamak",
      ],
      a: 1,
      e: "Pasör ikinci teması yönetir ve hücum seçimini yapar.",
    },
  ],
  "Libero eğitimi": [
    {
      q: "Libero hangi bölgede uzmanlaşır?",
      o: [
        "Arka alan savunması ve karşılama",
        "Ön hat bloğu",
        "Smaç servisi",
        "Orta oyuncu hücumu",
      ],
      a: 0,
      e: "Libero takımın savunma ve servis karşılama uzmanıdır.",
    },
  ],
  "Taktik ve oyun zekâsı": [
    {
      q: "Taktik karar öncesinde ilk olarak ne okunmalıdır?",
      o: [
        "Seyirci sayısı",
        "Rakibin yerleşimi ve eğilimleri",
        "Forma rengi",
        "Salon ışıkları",
      ],
      a: 1,
      e: "Etkili karar, rakibin blok-savunma düzenini ve zayıf alanlarını okumaya dayanır.",
    },
  ],
};
function questionsFor(title) {
  if (examBank[title]) return examBank[title];
  const parts = courseCurriculum[title] || [
    "Temel teknik",
    "Uygulama",
    "Oyun kullanımı",
  ];
  return parts.map((p, i) => ({
    q: `${title} dersinde ${i + 1}. eğitim adımı hangisidir?`,
    o: [p, "Futbol top sürme", "Basketbol şut tekniği", "Yüzme çıkışı"],
    a: 0,
    e: `Doğru cevap “${p}”dir; bu adım ${title} dersinin müfredatında yer alır.`,
  }));
}
function ExamPage({ initialCourse }) {
  const [title, setTitle] = useState(initialCourse?.[1] || courseCategories[0]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const qs = questionsFor(title);
  const choose = (n) => setAnswers({ ...answers, [index]: n });
  const reset = (t) => {
    if (t) setTitle(t);
    setIndex(0);
    setAnswers({});
    setDone(false);
  };
  const score = qs.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0);
  return (
    <div className="exam-page page">
      <div className="page-head">
        <span className="eyebrow">ÖLÇME & DEĞERLENDİRME</span>
        <h1>Voleybol sınavları</h1>
        <p>
          Her dersin anlatımına uygun hazırlanmış çoktan seçmeli sınavlar.
        </p>
      </div>
      <label className="exam-select">
        Sınav konusu
        <select value={title} onChange={(e) => reset(e.target.value)}>
          {courseCategories.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      {!done ? (
        <div className="exam-card">
          <div className="exam-progress">
            <span>
              SORU {index + 1} / {qs.length}
            </span>
            <div>
              <i style={{ width: `${((index + 1) / qs.length) * 100}%` }} />
            </div>
          </div>
          <h2>{qs[index].q}</h2>
          <div className="exam-options">
            {qs[index].o.map((o, i) => (
              <button
                className={answers[index] === i ? "selected" : ""}
                onClick={() => choose(i)}
                key={o}
              >
                <i>{String.fromCharCode(65 + i)}</i>
                {o}
              </button>
            ))}
          </div>
          <div className="exam-actions">
            <button
              className="btn ghost"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              Önceki
            </button>
            {index < qs.length - 1 ? (
              <button
                className="btn"
                disabled={answers[index] === undefined}
                onClick={() => setIndex(index + 1)}
              >
                Sonraki <ArrowRight />
              </button>
            ) : (
              <button
                className="btn"
                disabled={answers[index] === undefined}
                onClick={() => setDone(true)}
              >
                Sınavı Bitir
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="exam-result">
          <Trophy />
          <span>SINAV TAMAMLANDI</span>
          <h2>
            {score} / {qs.length}
          </h2>
          <p>
            Başarı oranın %{Math.round((score / qs.length) * 100)}. Yanıtların
            açıklamalarını aşağıda inceleyebilirsin.
          </p>
          <button className="btn" onClick={() => reset()}>
            Tekrar Dene
          </button>
          <div>
            {qs.map((q, i) => (
              <article
                className={answers[i] === q.a ? "correct" : "wrong"}
                key={q.q}
              >
                <b>
                  {i + 1}. {q.q}
                </b>
                <p>{q.e}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
const fingerPassDetails = [
  {
    title: "Parmak pasın tanımı",
    body: "Topu istenilen noktaya eller ve parmakların yardımıyla göndermeye parmak pas denir (48 ve 49. görseller). Parmak pas, voleybolda topu hedeflenen noktaya gönderebilmek için kullanılan etkili bir yoldur.",
    corrects: ["Topun altına erken yerleş", "Hedefe dönük dengeli duruş al"],
    errors: [
      "Topu avuç içinde tutmak",
      "Top gelmeden hedef kontrolünü kaybetmek",
    ],
  },
  {
    title: "Öne parmak pas",
    body: "Bir ayak önde ve vücut dengeli olacak şekilde ayaklar arasında aralık olmalıdır. Kollar dirseklerden bükülü, eller yüze yakın, dirseklerin açıklığı omuz genişliği kadar olmalı ve bileklere doğru üçgen olacak şekilde tutulmalıdır. Pas yapılırken top, alın hizasında olmalıdır. Vücut bacakların yardımıyla hafifçe öne doğru eğilmelidir. Pas yapılırken parmakların ilk boğumları topa temas etmelidir.",
    corrects: [
      "Topu alın hizasında karşıla",
      "Dirsek açıklığını omuz genişliğinde tut",
      "Kollar, bacaklar ve bütün vücutla ileri-yukarı uzan",
    ],
    errors: [
      "Topu başın arkasında karşılamak",
      "Dirsekleri aşırı kapatmak veya açmak",
      "Yalnız kollarla itmek",
    ],
  },
  {
    title: "Öne pasta hız kontrolü ve yön",
    body: "Topa pas yapılacağı sırada eller, bileklerin yardımıyla hafifçe geriye bükülerek topun geliş hızı düşürülmelidir. Top karşıya kollar, bacaklar ve bütün vücudun ileri ve yukarı hareketi ile gönderilir. Parmak pasta hareket, topu göndermek istediğiniz yöne doğru yapılmalıdır (50. görsel).",
    corrects: [
      "Bileklerle topun hızını yumuşat",
      "Vücut hareketini hedefe yönelt",
    ],
    errors: [
      "Topa sert ve kontrolsüz vurmak",
      "Vücudu hedeften farklı yöne çevirmek",
    ],
  },
  {
    title: "Geriye parmak pas",
    body: "Topun altına doğru girerken ağırlık arka ayağa aktarılır, kalça öne gelir. Bu sırada vücut ve baş arkaya doğru bükülür. Kol ve omuzlar topun geldiği yöndedir. Bu pas şeklinin amacı, bloku yanıltıp etkili ve rahat bir hücum yapılmasını sağlamaktır (51. görsel).",
    corrects: [
      "Ağırlığı arka ayağa aktar",
      "Kalçayı öne getir ve topun altına gir",
    ],
    errors: ["Topun altına geç kalmak", "Omuzları erken hedef dışına çevirmek"],
  },
  {
    title: "Sıçrayarak parmak pas",
    body: "Gelen topun konumuna göre iyi bir zamanlama ve sıçrama ile ayakların yere değmeden topun elden çıkarılmasıdır. Bu pas hareketinde vücudun ağırlık merkezinin yönünü değiştirme imkânı yoktur. Sıçrama anında bir an havada asılı kalma, denge açısından çok önemlidir. Sıçrayarak parmak pas, rakip takımda blok yapan oyuncuları şaşırtmak, onları tereddüde düşürüp hücum eden smaçörlere rahat top kullanma imkânı vermek amacıyla kullanılır. Sıçrayarak parmak pas öne ve geriye yapılır (52 ve 53. görsel).",
    corrects: [
      "Topu havadayken elden çıkar",
      "Sıçrama zamanlamasını topun konumuna göre ayarla",
    ],
    errors: ["Topu yere indikten sonra çıkarmak", "Havada dengeyi kaybetmek"],
  },
  {
    title: "Parmak pas analizi",
    body: "Aşağıdaki parmak pas görselleri karışık bir şekilde verilmiştir. Görselleri sıralayarak bunların ifade ettiği pas aşamalarının özelliklerini boş bırakılan yerlere yazınız.",
    corrects: [
      "Hareket aşamalarını doğru sırala",
      "Her aşamada vücut ve top ilişkisini gözlemle",
    ],
    errors: [
      "Yalnız temas anına odaklanmak",
      "Hazır duruş ve takip hareketini atlamak",
    ],
  },
  {
    title: "Genel pas uygulaması",
    body: "Pas çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• Duvarda pas çalışması yapınız.\n• Karşılıklı iki kişi parmak pası öne, geriye ve sıçrayarak çalışınız.\n• İki kişi, kısa ve uzun pas çalışınız.\n• Karşılıklı iki kişi pas kontrol çalışması yapınız.\n• Sağa ve sola deplaseli pas çalışması yapınız.\n• Aralarında 4-5 m mesafe olacak şekilde karşılıklı iki grup oluşturunuz.\n• Pasınızı attıktan sonra karşı grubun arkasına geçiniz.\n• Uygulamaya durarak ve sıçrayarak pas şeklinde çalışarak devam ediniz.\nÜçgen grupta pas çalışması.\n• Her oyuncu pas attığı grubun arkasına geçsin.\n• Durarak pas, sıçrayarak pas yapınız (Alıştırmayı iki topla da yapılabilirsiniz).\n• Dörtlü çalışmada yer değiştiriniz.\n• Oturarak ikili, üçlü ve dörtlü çalışmaları yapınız.",
    corrects: [
      "Sıra ve hak kavramını gözet",
      "Durarak ve sıçrayarak pası dönüşümlü uygula",
    ],
    errors: [
      "Pas sonrası yer değiştirmemek",
      "Mesafeye göre kuvveti ayarlamamak",
    ],
  },
  {
    title: "Duvarda parmak pas çalışması",
    body: "55. görseldeki gibi duvara yakın mesafede (10-15 cm) seri şekilde temel duruşunuzu bozmadan parmak pas çalışması yapınız.",
    corrects: [
      "Temel duruşu seri tekrar boyunca koru",
      "Topu alın hizasında kontrol et",
    ],
    errors: [
      "Duvara gereğinden fazla yaklaşmak",
      "Seri tekrarda dirsek ve el şeklini bozmak",
    ],
  },
  {
    title: "Kendi attığı topa parmak pas",
    body: "KENDİ ATTIĞI TOPA PARMAK PAS ÇALIŞMASI\n57. görseldeki gibi kendi etrafınızda dönerek parmak pas çalışması yapınız.",
    corrects: ["Dönüşten sonra dengeyi yeniden kur", "Gözünü toptan ayırma"],
    errors: ["Dönüşü kontrolsüz hızlandırmak", "Topun altına geç kalmak"],
  },
  {
    title: "Oturarak ikili parmak pas",
    body: "58. görseldeki gibi öğretmeninizin belirleyeceği mesafede iki kişi karşılıklı oturarak parmak pası yapınız.",
    corrects: ["Ellerin üçgen konumunu koru", "Teması alın hizasında yap"],
    errors: ["Topu avuç içinde taşımak", "Gövde dengesini kaybetmek"],
  },
  {
    title: "Karşılıklı parmak pas",
    body: "59. görseldeki uygulama çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• Öğretmeniniz tarafından belirlenen mesafede arkadaşınızla karşılıklı parmak pası yapınız.\n• Paslaşma esnasında öğretmeninizin vereceği komutlar doğrultusunda yer değiştiriniz ve paslaşmaya devam ediniz.",
    corrects: [
      "Hareket ederken hedefe yeniden dön",
      "İletişim kur ve topun altına yerleş",
    ],
    errors: [
      "Yer değiştirmede top takibini bırakmak",
      "Hedef kontrolü olmadan pas vermek",
    ],
  },
  {
    title: "Dörtlü parmak pas",
    body: "60. görseldeki uygulama çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• İki grup olarak karşılıklı parmak pas yapınız.\n• Parmak pas vuruşunuzu yapıp kendi grubunuzun arkasına geçiniz.\n• Öğretmenin ikinci bir uyarısına kadar çalışmayı tekrar ediniz.",
    corrects: [
      "Pas sonrası sıranın arkasına geç",
      "Top akışını kesmeden devam et",
    ],
    errors: [
      "Aynı yerde kalarak sırayı bozmak",
      "Hazır olmayan oyuncuya pas vermek",
    ],
  },
  {
    title: "Kayma adımlı parmak pas",
    body: "61. görseldeki uygulama çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• 1, 2 ve 3 numaralı öğrencilerde birer top bulunsun.\n• 1 numaralı öğrenci topu 4 numaralı öğrenciye göndersin.\n• 4 numaralı öğrenci topu parmak pasla tekrar 1 numaralı öğrenciye göndersin, kayma adımı ile 2 numaralı öğrencinin karşısına gelsin. 2 numaralı öğrenciden atılan topu parmak pasla 2 numaralı öğrenciye tekrar göndersin. Yine kayma adımı ile 3 numaralı öğrencinin karşısına gelsin ve aynı paslaşmayı yapsın.\n• 1, 2 ve 3 numaralı öğrenciler saat yönünde bir sıra dönerek aynı çalışmayı tekrarlasın.",
    corrects: ["Önce ayaklarla topun arkasına geç", "Temas öncesi dengeyi kur"],
    errors: [
      "Kolları uzatarak topa yetişmeye çalışmak",
      "Ayakları çaprazlayıp dengeyi bozmak",
    ],
  },
  {
    title: "Üçlü parmak pas",
    body: "62. görseldeki uygulama çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• Ortada bulunan 1 numaralı öğrenci, topu 2 numaralı öğrenciye atarak çalışmayı başlatsın.\n• 2 numaralı öğrenci, gelen topu parmak pasla 3 numaralı öğrenciye göndersin.\n• Ortadaki 1 numaralı öğrenci, topu attıktan sonra her seferinde topun geleceği yöne dönerek top beklesin.\n• 3 numaralı öğrenci, gelen topu 1 numaralı öğrenciye göndersin.\n• 1 numaralı öğrenci, topu tekrar 3 numaralı öğrenciye göndersin.\n• 3 numaralı öğrenci, topu parmak pasla 2 numaralı öğrenciye göndersin.\n• 2 numaralı öğrenci, gelen topu 1 numaralı öğrenciye aktarıp topun geriye gelmesini beklesin.\n• Öğretmenin ikinci bir uyarısına kadar çalışmayı devam ettiriniz.",
    corrects: ["Pas yönünü önceden belirle", "Pas sonrası yeni konuma geç"],
    errors: ["Hareketsiz kalmak", "Sıra dışındaki oyuncuya pas vermek"],
  },
  {
    title: "File önü parmak pas",
    body: "63. görseldeki uygulama çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• 3 m çizgisinde bulunan 1 numaralı öğrencinin ön bölgesine öğretmenin topu atmasıyla uygulama çalışmasına başlayınız.\n• Paslaşma fileye paralel olacağı için file önüne koşu yapınız.\n• 1 numaralı öğrenci, fileye paralel olarak parmak pas ile topu 3 numaralı öğrencinin ön bölgesine atsın ve kendi grubundaki 2 numaralı öğrencinin arkasına geçsin.\n• 3 numaralı öğrenci gelen pası tekrar fileye paralel olarak 2 numaralı öğrencinin ön bölgesine göndersin.\n• 2 numaralı öğrenci, gelen pası fileye paralel olarak parmak pas ile 4 numaralı öğrencinin önüne atsın.\n• Çalışmaya yer değiştirmelerle sıra ve hak kavramını gözeterek devam ediniz.\n• Gruplardaki öğrenci sayılarını artırılabilirsiniz.",
    corrects: [
      "Fileye temas etmeden paralel hareket et",
      "Topu oyuncunun ön bölgesine gönder",
    ],
    errors: [
      "File altına veya üstüne sürüklenmek",
      "Topu oyuncunun arkasına bırakmak",
    ],
  },
  {
    title: "Merkez ve koni etrafı pas",
    body: "MERKEZ ODAKLI PARMAK PAS ÇALIŞMASI\n65. görseldeki uygulama çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• File dibinde duran 1 numaralı arkadaşınızın karşısına paralel olarak diziliniz.\n• Sıra ile temel parmak pas kurallarına uygun olarak onunla paslaşınız.\n\nKONİ ETRAFINDAN DÖNEREK PAS ÇALIŞMASI\n66. görseldeki uygulama çalışmasını öğretmen rehberliğinde, yönergeyi takip ederek uygulayınız.\n• 1 numaralı öğrenci topu 2 numaralı öğrenciye attıktan sonra önce sağ yanında duran koninin etrafında kayma adımlarla beraber yer değiştirsin sonra 2 numaralı öğrenciden geri gelen pası tekrar 2 numaraya atsın.\n• 1 numaralı öğrenci her parmak pasından sonra koni etrafında sıra ile dönüp pas atsın.",
    corrects: [
      "Koni dönüşü sonrası temel duruşu kur",
      "Merkez oyuncuyla göz teması ve iletişim kullan",
    ],
    errors: [
      "Dönüşten sonra acele temas etmek",
      "Topun geliş yönünü geç okumak",
    ],
  },
].map((item, i) => ({
  ...item,
  body: item.body
    .replace(/\s*\(\d+(?:\s+ve\s+\d+)?\.\s*görseller?\)\.?/gi, ".")
    .replace(/\d+\.\s*görseldeki\s+(?:gibi\s+)?/gi, "")
    .replace(/^./, (letter) => letter.toLocaleUpperCase("tr-TR")),
  image: `./lesson-images/parmak-pas-${String(i + 1).padStart(2, "0")}.webp`,
}));
function makeLessonSteps(course) {
  if (course[1] === "Voleybola giriş ve temel kurallar")
    return introLessonDetails;
  if (course[1] === "Parmak pas") return fingerPassDetails;
  return (courseCurriculum[course[1]] || []).map((title, i) => ({
    title,
    body: `${title}, ${course[1]} dersinin ${i + 1}. eğitim adımıdır. ${courseDescriptions[course[1]]} Önce doğru hazır duruş ve hareket sırası incelenir; ardından düşük tempoda kontrollü tekrar yapılır. Teknik istikrar sağlandığında hedef, yön veya karar baskısı eklenerek uygulama oyun koşuluna taşınır.`,
  }));
}
const lessonSheetId =
  import.meta.env.VITE_GOOGLE_SHEET_ID ||
  "1HdtNXLR5x_nhdHNnH4eST-1q7JEavdp0jnKxdD9J-Qk";
const lessonSheetTab = import.meta.env.VITE_GOOGLE_SHEET_TAB || "Parmak pas";
const sheetBackedCourses = new Set(courseCategories);
const normalizeSheetText = (value) =>
  (value || "").toLocaleLowerCase("tr-TR").trim().replace(/\s+/g, " ");
function parseSheetResponse(source) {
  const start = source.indexOf("{"),
    end = source.lastIndexOf("}");
  if (start < 0 || end < start)
    throw new Error("Ders bilgileri okunamadı");
  const data = JSON.parse(source.slice(start, end + 1));
  const table = data.table || {};
  let headers = (table.cols || []).map((x) => normalizeSheetText(x.label));
  let rows = table.rows || [];
  if (headers.every((header) => !header) && rows.length) {
    headers = (rows[0].c || []).map((cell) =>
      normalizeSheetText(cell?.f ?? cell?.v ?? ""),
    );
    rows = rows.slice(1);
  }
  return rows
    .map((row) => {
      const values = (row.c || []).map((cell) => cell?.f ?? cell?.v ?? "");
      return Object.fromEntries(
        headers.map((header, index) => [header, values[index] ?? ""]),
      );
    })
    .filter((row) => Object.values(row).some(Boolean));
}
function useLessonSheet(tabName, enabled) {
  const [state, setState] = useState({ status: "idle", rows: [] });
  useEffect(() => {
    if (!enabled) return;
    const controllers = new Set();
    let requestActive = false;
    setState({ status: "loading", rows: [] });
    const refresh = () => {
      if (requestActive) return;
      requestActive = true;
      const controller = new AbortController();
      controllers.add(controller);
      const url = `https://docs.google.com/spreadsheets/d/${lessonSheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}&t=${Date.now()}`;
      fetch(url, { signal: controller.signal, cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error("Sheet bağlantısı başarısız");
          return response.text();
        })
        .then((text) =>
          setState({ status: "ready", rows: parseSheetResponse(text) }),
        )
        .catch((error) => {
          if (error.name !== "AbortError")
            setState((current) =>
              current.rows.length
                ? current
                : { status: "error", rows: [] },
            );
        })
        .finally(() => {
          requestActive = false;
          controllers.delete(controller);
        });
    };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      controllers.forEach((controller) => controller.abort());
    };
  }, [enabled, tabName]);
  return state;
}
function cleanSheetMarkdown(lines) {
  return lines
    .map((line) =>
      line
        .replace(/^\s*[-*]\s+/, "• ")
        .replace(/^\s*>\s?/, "")
        .replace(/\*\*/g, "")
        .replace(/`{3}(?:text)?/g, ""),
    )
    .filter((line) => !/^\s*\|?\s*:?-{3,}/.test(line) && line.trim() !== "---")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
function parseMarkdownLessons(markdown, base, level = "Genel") {
  const lines = String(markdown).replace(/\r\n?/g, "\n").split("\n");
  const sections = [];
  let current = null;
  let currentLevel = level;
  const push = () => {
    if (!current) return;
    const body = cleanSheetMarkdown(current.lines);
    if (body) sections.push({ ...current, body });
    current = null;
  };
  for (const line of lines) {
    const heading = line.match(/^(#{1,2})\s+(.+?)\s*$/);
    if (heading) {
      push();
      if (heading[1].length === 1) {
        const sectionName = normalizeSheetText(heading[2]);
        if (/^(1\.?\s*)?başlangıç\s+seviyesi/.test(sectionName))
          currentLevel = "Başlangıç Seviyesi";
        else if (/^(2\.?\s*)?orta\s+seviyesi/.test(sectionName))
          currentLevel = "Orta Seviye";
        else if (/^(3\.?\s*)?ileri\s+seviyesi/.test(sectionName))
          currentLevel = "İleri Seviye";
        else if (
          sectionName.includes("doğru teknik") ||
          sectionName.includes("yaygın hata") ||
          sectionName.includes("teknik hataları") ||
          sectionName.includes("kuralları öğreten")
        )
          currentLevel = "Teknik Analiz ve Düzeltme";
        else if (
          sectionName.includes("antrenman programı") ||
          sectionName.includes("ders programı")
        )
          currentLevel = "Antrenman Programı";
      }
      current = {
        title: heading[2].replace(/^Ders\s+\d+\s*:\s*/i, "").trim(),
        level: currentLevel,
        lines: [],
      };
      continue;
    }
    if (!current && line.trim())
      current = { title: "Parmak Pas Tekniğine Giriş", lines: [] };
    if (current) current.lines.push(line);
  }
  push();
  return sections.map((section, index) => {
    const exact = base.find(
      (item) =>
        normalizeSheetText(item.title) === normalizeSheetText(section.title),
    );
    const keyword = base.find((item) =>
      normalizeSheetText(section.title)
        .split(" ")
        .some(
          (word) =>
            word.length > 5 && normalizeSheetText(item.title).includes(word),
        ),
    );
    return {
      ...section,
      level: section.level || level,
      image: `./lesson-images/sheet-parmak-pas-${String(index + 1).padStart(2, "0")}.png`,
      corrects: exact?.corrects,
      errors: exact?.errors,
    };
  });
}
function sheetLessonLevel(column) {
  const key = normalizeSheetText(column).replace(/^#+\s*/, "");
  if (key.includes("başlangıç")) return "Başlangıç Seviyesi";
  if (key.includes("orta seviye")) return "Orta Seviye";
  if (key.includes("ileri seviye")) return "İleri Seviye";
  if (key.includes("kazanım")) return "Dersin Kazanımları";
  if (key.includes("doğru teknik") || key.includes("teknik hata"))
    return "Teknik Analiz ve Düzeltme";
  if (key.includes("antrenman")) return "Antrenman Programı";
  return "Genel Tanıtım";
}
function prepareSheetMarkdown(column, value) {
  const text = String(value || "").trim();
  if (/^#{1,6}\s+/m.test(text)) return text;
  const key = normalizeSheetText(column).replace(/^#+\s*/, "");
  const lines = text.split("\n");
  const lessonIndex = lines.findIndex((line) => /^\s*Ders\s+\d+\s*:/i.test(line));
  if (
    lessonIndex >= 0 &&
    (key.includes("başlangıç") ||
      key.includes("orta seviye") ||
      key.includes("ileri seviye"))
  ) {
    const intro = lines
      .slice(0, lessonIndex)
      .filter(
        (line) =>
          line.trim() &&
          !/^(?:\d+\.?\s*)?(başlangıç|orta|ileri)\s+seviyesi$/i.test(
            line.trim(),
          ),
      );
    return [
      lines[lessonIndex],
      ...intro,
      ...lines.slice(lessonIndex + 1),
    ]
      .map((line) =>
        /^\s*Ders\s+\d+\s*:/i.test(line) ? `## ${line.trim()}` : line,
      )
      .join("\n");
  }
  if (key.includes("antrenman")) {
    return lines
      .map((line) =>
        /^(?:\d+\.?\s*)?(başlangıç|orta|ileri)\s+seviyesi$/i.test(line.trim())
          ? `## ${line.trim()}`
          : line,
      )
      .join("\n");
  }
  if (key.includes("açıklama")) {
    const first = lines.findIndex((line) => line.trim());
    if (first >= 0)
      return `# ${lines[first].trim()}\n${lines.slice(first + 1).join("\n")}`;
  }
  const heading = column.replace(/^#+\s*/, "").trim();
  return `# ${heading}\n${text}`;
}
function mergeSheetLessons(base, rows, courseTitle = "Parmak pas", courseImage) {
  const usable = rows
    .map((row) => ({
      title: String(row.konu || ""),
      body: String(row["açıklama"] || row.aciklama || ""),
    }))
    .filter((row) => row.body.trim());
  if (!rows.length) return base;
  const course = usable.find(
    (row) => normalizeSheetText(row.title) === normalizeSheetText(courseTitle),
  ) || usable[0];
  if (course || rows.length) {
    const sourceRow =
      rows.find(
        (row) =>
          normalizeSheetText(row.konu) === normalizeSheetText(courseTitle),
      ) || rows[0];
    const descriptionEntry = Object.entries(sourceRow || {}).find(([key]) =>
      normalizeSheetText(key).includes("açıklama"),
    );
    const descriptionText = String(descriptionEntry?.[1] || "");
    const courseKeyword = normalizeSheetText(courseTitle).split(" ")[0];
    if (
      descriptionText &&
      !normalizeSheetText(descriptionText).includes(courseKeyword)
    )
      return [];
    const sourceSections = Object.entries(sourceRow || {})
      .filter(
        ([key, value]) =>
          key !== "konu" && String(value || "").trim(),
      )
      .map(([key, value]) => {
        const markdown = prepareSheetMarkdown(key, value);
        return parseMarkdownLessons(markdown, base, sheetLessonLevel(key));
      });
    const parsed = sourceSections.flat();
    const unique = parsed.filter(
      (lesson, index, list) =>
        list.findIndex(
          (item) =>
            normalizeSheetText(item.title) ===
            normalizeSheetText(lesson.title),
        ) === index,
    );
    if (unique.length) {
      return unique.map((lesson, index) => ({
        ...lesson,
        image:
          courseTitle === "Parmak pas"
            ? `./lesson-images/sheet-parmak-pas-${String(index + 1).padStart(2, "0")}.png`
            : courseImage,
      }));
    }
    return [];
  }
  const direct = new Map(
    usable.map((row) => [normalizeSheetText(row.title), row.body]),
  );
  return base.map((item) =>
    direct.has(normalizeSheetText(item.title))
      ? { ...item, body: direct.get(normalizeSheetText(item.title)) }
      : item,
  );
}
function ImportantText({ children }) {
  const parts = String(children || "").split(
    /(Başarı hedefi|Çalışma|Hedef|Doğru|Dikkat|Önemli|Dinlenme|\d+\s*[×x]\s*\d+|\d+\s*(?:set|tekrar|saniye|dakika))/gi,
  );
  return parts.map((part, index) =>
    /^(Başarı hedefi|Çalışma|Hedef|Doğru|Dikkat|Önemli|Dinlenme|\d+\s*[×x]\s*\d+|\d+\s*(?:set|tekrar|saniye|dakika))$/i.test(
      part,
    ) ? (
      <strong className="lesson-emphasis" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    ),
  );
}
function FormattedLessonBody({ text, compact = false }) {
  const normalizedText = String(text || "")
    .replace(/\s*#{3,6}\s+/g, "\n\n")
    .replace(/\s+•\s+/g, "\n• ")
    .replace(/\s+[-*]\s+(?=[A-ZÇĞİÖŞÜ])/g, "\n• ")
    .replace(/\s+(Düzeltme|Çözüm|Öneri|Antrenör notu):\s*/gi, "\n\n$1: ")
    .replace(/#{3,6}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const blocks = normalizedText
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const isHeading = (line) =>
    line.length < 75 && !/[.!?;:]$/.test(line) && !/^\d+[.)]\s/.test(line);
  return (
    <div className={`formatted-lesson ${compact ? "compact" : ""}`}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const listLines = lines.filter((line) => /^(?:•|[-*]|\d+[.)])\s*/.test(line));
        const metricLines = lines.filter((line) => /^[^:]{2,35}:\s*.+/.test(line));
        if (lines.every((line) => line.startsWith("|")))
          return (
            <pre className="lesson-table" key={blockIndex}>{lines.join("\n")}</pre>
          );
        if (listLines.length) {
          const firstList = lines.findIndex((line) =>
            /^(?:•|[-*]|\d+[.)])\s*/.test(line),
          );
          const lastList = lines.reduce(
            (found, line, index) =>
              /^(?:•|[-*]|\d+[.)])\s*/.test(line) ? index : found,
            firstList,
          );
          const before = lines.slice(0, firstList);
          const items = lines
            .slice(firstList, lastList + 1)
            .filter((line) => /^(?:•|[-*]|\d+[.)])\s*/.test(line));
          const after = lines.slice(lastList + 1);
          return (
            <section className="lesson-topic-block" key={blockIndex}>
              {before.map((line, index) =>
                index === before.length - 1 && (isHeading(line) || /:$/.test(line)) ? (
                  <h2 key={index}>
                    <ImportantText>{line.replace(/:$/, "")}</ImportantText>
                  </h2>
                ) : (
                  <p className="lesson-paragraph" key={index}>
                    <ImportantText>{line}</ImportantText>
                  </p>
                ),
              )}
              <ul className="lesson-check-list">
                {items.map((line, index) => (
                  <li key={index}>
                    <CheckCircle2 />
                    <span>
                      <ImportantText>
                        {line.replace(/^(?:•|[-*]|\d+[.)])\s*/, "")}
                      </ImportantText>
                    </span>
                  </li>
                ))}
              </ul>
              {after.map((line, index) => (
                <p className="lesson-correction" key={index}>
                  <ImportantText>{line}</ImportantText>
                </p>
              ))}
            </section>
          );
        }
        if (listLines.length === lines.length)
          return (
            <ul className="lesson-check-list" key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index}>
                  <CheckCircle2 />
                  <span><ImportantText>{line.replace(/^(?:•|[-*]|\d+[.)])\s*/, "")}</ImportantText></span>
                </li>
              ))}
            </ul>
          );
        if (metricLines.length === lines.length)
          return (
            <div className="lesson-metrics" key={blockIndex}>
              {lines.map((line, index) => {
                const split = line.indexOf(":");
                return (
                  <p key={index}>
                    <b>{line.slice(0, split)}</b>
                    <span><ImportantText>{line.slice(split + 1).trim()}</ImportantText></span>
                  </p>
                );
              })}
            </div>
          );
        if (lines.length > 1 && isHeading(lines[0]))
          return (
            <section className="lesson-topic-block" key={blockIndex}>
              <h2><ImportantText>{lines[0]}</ImportantText></h2>
              <ul className="lesson-check-list">
                {lines.slice(1).map((line, index) => (
                  <li key={index}>
                    <CheckCircle2 />
                    <span><ImportantText>{line.replace(/^(?:•|[-*]|\d+[.)])\s*/, "")}</ImportantText></span>
                  </li>
                ))}
              </ul>
            </section>
          );
        if (lines.length === 1 && isHeading(lines[0]))
          return (
            <h2 className="lesson-subheading" key={blockIndex}>
              <ImportantText>{lines[0]}</ImportantText>
            </h2>
          );
        return (
          <p className="lesson-paragraph" key={blockIndex}>
            <ImportantText>{lines.join(" ")}</ImportantText>
          </p>
        );
      })}
    </div>
  );
}
function LessonPage({ course, go }) {
  const [step, setStep] = useState(0);
  const hasSheet = sheetBackedCourses.has(course[1]);
  const sheet = useLessonSheet(course[1], hasSheet);
  const content = useMemo(
    () => {
      if (!hasSheet) return makeLessonSteps(course);
      if (sheet.status === "ready")
        return mergeSheetLessons(
          makeLessonSteps(course),
          sheet.rows,
          course[1],
          course[10],
        );
      if (sheet.status === "error") return makeLessonSteps(course);
      return [];
    },
    [course, hasSheet, sheet.rows, sheet.status],
  );
  useEffect(() => {
    if (step >= content.length) setStep(Math.max(0, content.length - 1));
  }, [content.length, step]);
  const active = content[step] || content[0] || {
    title: "Ders içeriği bulunamadı",
    body: "Bu düzeyin ders içeriği hazırlanıyor.",
  };
  const activeImage = active.image || course[10];
  return (
    <div className="lesson-page">
      <header className="lesson-top">
        <button onClick={() => go("course", course)}>
          ← Ders detayına dön
        </button>
        <div>
          <span>{course[1]}</span>
          <b>
            Adım {step + 1} / {content.length}
          </b>
        </div>
      </header>
      <div className="lesson-shell">
        <aside className="lesson-nav">
          <img src={activeImage} alt={`${course[1]} ders görseli`} />
          <small>DERS İÇERİĞİ • {content.length} BÖLÜM</small>
          {content.map((x, i) => (
            <React.Fragment key={`${x.level}-${x.title}`}>
              {(i === 0 || content[i - 1]?.level !== x.level) && (
                <h3 className="lesson-level-title">{x.level}</h3>
              )}
              <button
                className={step === i ? "active" : ""}
                onClick={() => setStep(i)}
              >
                <i>{i < step ? <CheckCircle2 /> : i + 1}</i>
                <span>{x.title}</span>
              </button>
            </React.Fragment>
          ))}
        </aside>
        <article className="lesson-reading">
          <span className="eyebrow">
            {active.level || "DERS"} • ADIM {String(step + 1).padStart(2, "0")}
          </span>
          <h1>{active.title}</h1>
          <img
            className="lesson-detail-image"
            src={activeImage}
            alt={`${active.title} teknik anlatım görseli`}
          />
          <FormattedLessonBody text={active.body} />
          {active.corrects && (
            <section className="technique-feedback">
              <div className="correct-box">
                <h2>
                  <CheckCircle2 /> Doğru uygulama
                </h2>
                {active.corrects.map((x) => (
                  <p key={x}>{x}</p>
                ))}
              </div>
              <div className="error-box">
                <h2>
                  <X /> Yaygın hatalar
                </h2>
                {active.errors.map((x) => (
                  <p key={x}>{x}</p>
                ))}
              </div>
            </section>
          )}
          <section className="practice-box">
            <Target />
            <div>
              <small>UYGULAMA</small>
              <h2>Gözlemle, uygula, kontrol et</h2>
              <p>
                Önce anlatımdaki kritik noktaları not et. Hareketi düşük tempoda
                uygula; doğru yapılan tekrarları kaydet ve hatalı noktaları bir
                sonraki tekrarda düzelt.
              </p>
            </div>
          </section>
          <section>
            <h2>Bilgi kontrolü</h2>
            <ol className="check-questions">
              <li>{active.title} için en kritik iki teknik nokta nedir?</li>
              <li>Bu adımda topa temas ve vücut yönü nasıl olmalıdır?</li>
              <li>Yaygın hatalardan birini nasıl düzeltirsin?</li>
            </ol>
          </section>
          <div className="lesson-actions">
            <button
              className="btn ghost"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              Önceki adım
            </button>
            {step < content.length - 1 ? (
              <button className="btn" onClick={() => setStep(step + 1)}>
                Sonraki adım <ArrowRight />
              </button>
            ) : (
              <button className="btn" onClick={() => go("exams", course)}>
                <CheckCircle2 /> Ders Sınavına Geç
              </button>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
function CourseDetail({ course, go }) {
  const [open, setOpen] = useState(0);
  const hasSheet = sheetBackedCourses.has(course[1]);
  const sheet = useLessonSheet(course[1], hasSheet);
  const lessonItems = useMemo(
    () => {
      if (!hasSheet) return makeLessonSteps(course);
      if (sheet.status === "ready")
        return mergeSheetLessons(
            makeLessonSteps(course),
            sheet.rows,
            course[1],
            course[10],
          );
      if (sheet.status === "error") return makeLessonSteps(course);
      return [];
    },
    [course, hasSheet, sheet.rows, sheet.status],
  );
  const equipment = getEquipment(course[1]);
  return (
    <div className="course-detail">
      <section className="detail-hero">
        <button className="back-link" onClick={() => go("courses")}>
          ← Kurslara dön
        </button>
        <div className="detail-hero-grid">
          <div>
            <span className="eyebrow">
              {course[3]} • {course[4]}
            </span>
            <h1>{course[1]}</h1>
            <p>{course[2]}</p>
            <div className="detail-stats">
              <span>
                <BookOpen /> {lessonItems.length} ders
              </span>
              <span>
                <Clock /> {course[6]}
              </span>
              <span>
                <Star /> {course[9]} puan
              </span>
            </div>
            <button className="btn">
              <Play /> Eğitime Başla
            </button>
          </div>
          <img src={course[10]} alt={`${course[1]} teknik eğitim çizimi`} />
        </div>
      </section>
      <div className="detail-layout">
        <div>
          <section className="detail-block">
            <span className="eyebrow">KURS HAKKINDA</span>
            <h2>Sahaya aktarılabilir bir öğrenme planı</h2>
            <p>
              Bu kurs, yüklenen “Voleybol: Başarıya Giden Adımlar” kaynağındaki
              basamaklı öğrenme yaklaşımından yararlanılarak hazırlandı. Önce
              tekniğin nedenini öğrenir, ardından kontrollü uygulamalarla
              ilerler ve başarı kontrolüyle oyun ortamına geçersin.
            </p>
          </section>
          <section className="detail-block">
            <h2>Öğrenme hedefleri</h2>
            <div className="objectives">
              {[
                `${course[1]} için doğru başlangıç pozisyonunu ve temel hareket sırasını uygulamak`,
                `${course[1]} sırasında top, vücut ve saha ilişkisini doğru yönetmek`,
                "Kontrollü alıştırmadan maç koşuluna kademeli geçmek",
                "Kendi performansını başarı ölçütleriyle değerlendirmek",
              ].map((x) => (
                <div key={x}>
                  <CheckCircle2 />
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="detail-block">
            <div className="curriculum-heading">
              <div>
                <span className="eyebrow">GÜNCEL DERS İÇERİĞİ</span>
                <h2>Ders müfredatı</h2>
              </div>
              <b>{lessonItems.length} konu</b>
            </div>
            <div className="curriculum">
              {lessonItems.map((lesson, i) => (
                <React.Fragment key={`${lesson.level}-${lesson.title}-${i}`}>
                  {(i === 0 || lessonItems[i - 1]?.level !== lesson.level) && (
                    <h3 className="curriculum-level">{lesson.level}</h3>
                  )}
                  <article>
                    <button
                      onClick={() => setOpen(open === i ? -1 : i)}
                      aria-expanded={open === i}
                    >
                      <i>{String(i + 1).padStart(2, "0")}</i>
                      <span>
                        <small>{lesson.level || `BÖLÜM ${i + 1}`}</small>
                        <b>{lesson.title}</b>
                      </span>
                      <ChevronDown className={open === i ? "rotate" : ""} />
                    </button>
                    {open === i && (
                      <div>
                        <FormattedLessonBody text={lesson.body} compact />
                      </div>
                    )}
                  </article>
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>
        <aside className="detail-side">
          <div className="card">
            <h3>Bu kursta</h3>
            {[
              "Teknik anlatımlar",
              "Uygulama alıştırmaları",
              "Başarı kontrolleri",
              "İlerleme takibi",
            ].map((x) => (
              <p key={x}>
                <CheckCircle2 /> {x}
              </p>
            ))}
          </div>
          <div className="card">
            <h3>Gerekli ekipmanlar</h3>
            {equipment.map((x) => (
              <p key={x}>
                <Dumbbell /> {x}
              </p>
            ))}
          </div>
          <div className="card">
            <h3>Ön koşullar</h3>
            <p>
              Temel hareketleri güvenli şekilde yapabilecek fiziksel uygunluk.
              Başlangıç kurslarında voleybol deneyimi gerekmez.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
function ProfilesPage({ initialNotice="", onActivityChange, onSessionChange }) {
  const [type, setType] = useState("club");
  const [selectedClub, setSelectedClub] = useState("");
  const [session, setSession] = useState(() => {
    const currentId = localStorage.getItem("volleyballCurrentAthleteId");
    const athlete = readAthletes().find((item) => item.id === currentId);
    if (athlete) return { type:"athlete", athlete };
    try {
      const school = JSON.parse(localStorage.getItem("volleyballCurrentClub") || "null");
      return school ? { type:"club", school } : null;
    } catch { return null; }
  });
  const [notice, setNotice] = useState(initialNotice);
  const getSchools = () => { try { return JSON.parse(localStorage.getItem("volleyballSchools") || "[]"); } catch { return []; } };
  const clubOptions = [...new Set(getSchools()
    .filter((school) => String(school.status || "").trim().toLocaleUpperCase("tr") === "ONAYLANDI")
    .map((school) => school.schoolName)
    .filter(Boolean))]
    .sort((a,b) => a.localeCompare(b,"tr"));
  const clubLogo = (club) => {
    const key = String(club || "").trim().toLocaleLowerCase("tr");
    return getSchools().find((school) => String(school.schoolName || "").trim().toLocaleLowerCase("tr") === key && school.teamLogo)?.teamLogo
      || readAthletes().find((athlete) => String(athlete.schoolName || "").trim().toLocaleLowerCase("tr") === key && athlete.teamLogo)?.teamLogo
      || "";
  };
  const submit = (event) => {
    event.preventDefault(); setNotice("");
    const data = new FormData(event.currentTarget);
    const schoolName = String(data.get("schoolName") || "").trim();
    const schoolCode = String(data.get("schoolCode") || "").trim();
    if (!/^\d{6}$/.test(schoolCode)) { setNotice("Kullanıcı kodu 6 haneli olmalıdır."); return; }
    if (type === "club") {
      const school = getSchools().find((item) => item.schoolName.toLocaleLowerCase("tr") === schoolName.toLocaleLowerCase("tr") && String(item.code) === schoolCode);
      if (!school) { setNotice("Kulüp adı veya kullanıcı kodu eşleşmedi."); return; }
      localStorage.setItem("volleyballCurrentClub", JSON.stringify(school));
      localStorage.removeItem("volleyballCurrentAthleteId");
      const clubSession = { type:"club", school };
      setSession(clubSession); onSessionChange(clubSession);
    } else {
      const athleteName = String(data.get("athleteName") || "").trim();
      const athlete = readAthletes().find((item) => item.schoolName.toLocaleLowerCase("tr") === schoolName.toLocaleLowerCase("tr") && item.schoolCode === schoolCode && item.name.toLocaleLowerCase("tr") === athleteName.toLocaleLowerCase("tr"));
      if (!athlete) { setNotice("Sporcu adı, kulüp adı veya kullanıcı kodu eşleşmedi."); return; }
      localStorage.setItem("volleyballCurrentAthleteId", athlete.id);
      localStorage.removeItem("volleyballCurrentClub");
      const active = { ...athlete, online:true, lastSeen:new Date().toISOString() };
      localStorage.setItem("volleyballAthletes", JSON.stringify(readAthletes().map((item) => item.id === active.id ? active : item)));
      const athleteSession = { type:"athlete", athlete:active };
      setSession(athleteSession); onSessionChange(athleteSession); onActivityChange();
    }
  };
  const logout = () => {
    if (session?.type === "athlete") {
      const id=session.athlete.id;
      localStorage.removeItem("volleyballCurrentAthleteId");
      localStorage.setItem("volleyballAthletes", JSON.stringify(readAthletes().map((item) => item.id === id ? { ...item, online:false } : item)));
      onActivityChange();
    }
    localStorage.removeItem("volleyballCurrentClub");
    onSessionChange(null); setSession(null); setNotice("");
  };
  if (session?.type === "club") {
    const members = readAthletes().filter((athlete) => athlete.schoolName.toLocaleLowerCase("tr") === session.school.schoolName.toLocaleLowerCase("tr") && athlete.schoolCode === String(session.school.code));
    const teamLogo = session.school.teamLogo || members.find((athlete) => athlete.teamLogo)?.teamLogo || "";
    return <div className="page profile-area"><section className="profile-hero-card"><div className={`club-emblem ${teamLogo ? "has-logo" : ""}`}>{teamLogo ? <TeamLogo src={teamLogo} name={session.school.schoolName}/> : <School/>}</div><span><small>KULÜP PROFİLİ</small><h1>{session.school.schoolName}</h1><p>Kullanıcı kodu: <b>{session.school.code}</b></p></span><button className="btn ghost" onClick={logout}>Çıkış yap</button></section><div className="profile-summary"><article><Users/><span><b>{members.length}</b><small>Kayıtlı sporcu</small></span></article><article><WifiOff/><span><b>{members.filter(isAthleteActive).length}</b><small>Şu anda aktif</small></span></article><article><ShieldCheck/><span><b>{session.school.status === "ONAYLANDI" ? "Onaylı" : "Bekliyor"}</b><small>Kulüp durumu</small></span></article></div><section className="member-panel"><div className="member-heading"><span><small>TAKIM KADROSU</small><h2>Kulübe kayıtlı sporcular</h2></span></div>{members.length ? <div className="member-list">{members.map((athlete)=><article key={athlete.id}><AthleteAvatar id={athlete.avatar}/><span><b>{athlete.name}</b><small>{athlete.id}</small></span><em className={isAthleteActive(athlete)?"active":"offline"}>{isAthleteActive(athlete)?"Derste":"Çevrim dışı"}</em></article>)}</div> : <div className="member-empty"><Users/><h3>Henüz sporcu kaydı yok</h3><p>Sporcular kulüp adı ve 6 haneli kodla kayıt olduğunda burada listelenir.</p></div>}</section></div>;
  }
  if (session?.type === "athlete") {
    const athlete=session.athlete;
    return <div className="page profile-area athlete-profile"><section className="profile-hero-card"><AthleteAvatar id={athlete.avatar} className="profile-large-avatar"/><span><small>SPORCU PROFİLİ</small><h1>{athlete.name}</h1><p>{athlete.schoolName}</p></span><button className="btn ghost" onClick={logout}>Çıkış yap</button></section><div className="athlete-profile-grid"><article><small>KULÜP KODU</small><b>{athlete.schoolCode}</b></article><article><small>AKTİFLİK</small><b className="green-text">Derste</b></article><article><small>PROFİL KİMLİĞİ</small><b>{athlete.id}</b></article></div><div className="profile-info-note"><CheckCircle2/><span><b>Profilin aktif</b><p>Bu sayfa açık kaldığı sürece üst menüde “Derste olanlar” bölümünde görünürsün. Çıkış yaptığında otomatik kaldırılırsın.</p></span></div></div>;
  }
  return <div className="page profile-login-page"><div className="profile-login-intro"><span className="eyebrow"><ShieldCheck/> KİŞİSEL PROFİL ALANI</span><h1>Kulübüne ve profiline güvenle eriş.</h1><p>Kulüpler kendi kadrolarını görür; sporcular kendi profillerine girerek derse aktif olarak katılır.</p></div><section className="profile-login-card"><div className="registration-tabs"><button className={type==="club"?"active":""} onClick={()=>{setType("club");setNotice("")}}><School/> Kulüp profili</button><button className={type==="athlete"?"active":""} onClick={()=>{setType("athlete");setNotice("")}}><UserPlus/> Sporcu profili</button></div><form className="registration-form" onSubmit={submit}><div className="form-heading">{type==="club"?<School/>:<UserPlus/>}<span><b>{type==="club"?"Kulüp girişi":"Sporcu girişi"}</b><small>Okul adını yazın veya kayıtlı takımlardan seçin.</small></span></div><SearchableSchoolPicker value={selectedClub} onChange={(club)=>{setSelectedClub(club);setNotice("")}} options={clubOptions} logoFor={clubLogo}/>{type==="athlete"&&<label>Sporcu adı<input name="athleteName" required placeholder="@kullaniciadi" autoCapitalize="none" spellCheck="false"/></label>}<label>6 haneli kullanıcı kodu<input name="schoolCode" required inputMode="numeric" maxLength="6" pattern="[0-9]{6}" placeholder="000000"/></label><button className="btn" disabled={clubOptions.length===0||!selectedClub}>Profile giriş yap <ArrowRight/></button></form>{notice&&<div className="profile-login-error" role="alert"><WifiOff/>{notice}</div>}</section></div>;
}

function TrainingVideosPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Tümü");
  const [selected, setSelected] = useState(trainingVideos[0]);
  const [visible, setVisible] = useState(12);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");
    return trainingVideos.filter((video) => (topic === "Tümü" || video.topic === topic) && (!term || video.title.toLocaleLowerCase("tr").includes(term) || video.topic.toLocaleLowerCase("tr").includes(term) || String(video.number) === term));
  }, [query, topic]);
  const choose = (video) => {
    setSelected(video);
    requestAnimationFrame(() => document.querySelector(".video-player-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  return <div className="video-library-page">
    <section className="video-library-hero">
      <div><span className="eyebrow"><Video size={16}/> VİDEO KÜTÜPHANESİ</span><h1>Hareketi izle,<br/><em>sahada uygula.</em></h1><p>{trainingVideos.length} teknik çalışma, tek ve mobil uyumlu bir eğitim kütüphanesinde.</p><div className="video-hero-stats"><span><b>{trainingVideos.length}</b> eğitim videosu</span><span><b>Güncel</b> eğitim içeriği</span></div></div>
      <div className="video-hero-mark" aria-hidden="true"><Play/><i/><i/><i/></div>
    </section>
    <section className="video-library-content">
      <div className="video-player-panel">
        <div className="video-player-heading"><span><small>ŞİMDİ İZLENİYOR</small><h2>{selected.title}</h2></span></div>
        <div className="drive-player"><iframe key={selected.id} src={selected.preview} title={selected.title} allow="autoplay; fullscreen" allowFullScreen /></div>
        <p>Video otomatik başlar ve tamamlandığında yeniden oynatılır. Tarayıcı otomatik oynatmayı engellerse oynat düğmesine bir kez dokunun.</p>
      </div>
      <div className="video-topic-bar" aria-label="Video konuları"><button className={topic==="Tümü"?"active":""} onClick={()=>{setTopic("Tümü");setVisible(12)}}><span>Tüm videolar</span><b>{trainingVideos.length}</b></button>{videoTopics.map((item)=><button key={item.name} className={topic===item.name?"active":""} onClick={()=>{setTopic(item.name);setVisible(12)}}><span>{item.name}</span><b>{item.count}</b></button>)}</div>
      <div className="video-library-toolbar"><div><span className="eyebrow">VİDEO ARŞİVİ</span><h2>Tüm eğitim videoları</h2></div><label className="video-search"><Search/><span className="sr-only">Video ara</span><input value={query} onChange={(event)=>{setQuery(event.target.value);setVisible(12)}} placeholder="Video adı veya numarası ara"/></label></div>
      {filtered.length ? <div className="training-video-grid">{filtered.slice(0,visible).map((video)=><article className={selected.id===video.id?"training-video-card active":"training-video-card"} key={video.id}><button className="video-card-preview" onClick={()=>choose(video)} aria-label={`${video.title} videosunu oynat`}><img src={video.thumbnail} alt={`${video.title} video görüntüsü`} loading="lazy" onError={(event)=>{event.currentTarget.onerror=null;event.currentTarget.src=video.fallback}}/><span className="video-number">#{String(video.number).padStart(2,"0")}</span><span className="video-topic-label">{video.topic}</span><span className="video-play"><Play/></span></button><div><small>{video.topic.toLocaleUpperCase("tr")}</small><h3>{video.title}</h3><button onClick={()=>choose(video)}>Videoyu izle <ArrowRight/></button></div></article>)}</div> : <div className="video-empty"><Search/><h2>Video bulunamadı</h2><p>Arama numarasını veya konuyu değiştirin.</p></div>}
      {visible < filtered.length && <button className="btn ghost video-load-more" onClick={()=>setVisible((value)=>value+12)}>Daha fazla video göster <ChevronDown/></button>}
    </section>
  </div>;
}

function InfoPage() {
  return (
    <div className="page empty-page">
      <ShieldCheck />
      <h1>Bu alan yakında hazır.</h1>
      <p>
        İlk sürüm için sayfa altyapısı oluşturuldu. Demo kullanıcı rolü ve
        güvenli kimlik doğrulama bağlantısı sonraki aşamada etkinleştirilebilir.
      </p>
      <button className="btn" onClick={() => history.back()}>
        Geri Dön
      </button>
    </div>
  );
}
function Empty() {
  return (
    <div className="empty">
      <Search />
      <h2>Aramana uygun kurs bulunamadı</h2>
      <p>Farklı bir kelime dene veya filtreleri temizle.</p>
    </div>
  );
}
function MobileNav({ page, go, isAuthenticated, isAthlete }) {
  let xs = [
    ["home", Home, "Ana Sayfa"],
    ["courses", BookOpen, "Dersler"],
    ["videos", Video, "Videolar"],
    ["exams", CheckCircle2, "Sınavlar"],
    ["junior-referee", Flag, "Junior Hakem"],
    ["demo", Play, "Demo"],
    ["pricing", BadgeTurkishLira, "Ücretler"],
    ["register", UserPlus, "Kayıt"],
    ["profiles", Users, isAuthenticated ? "Hesabım" : "Giriş Yap"],
  ];
  if (!isAuthenticated) xs = xs.filter(([key]) => ["home", "junior-referee", "demo", "pricing", "register", "profiles"].includes(key));
  if (isAthlete) xs = xs.filter(([key]) => !["demo", "pricing", "register"].includes(key));
  return (
    <nav className="mobile-nav">
      {xs.map(([k, I, t]) => (
        <button
          className={page === k ? "active" : ""}
          onClick={() => go(k)}
          key={k}
        >
          <I />
          <span>{t}</span>
        </button>
      ))}
    </nav>
  );
}
const refereeDocumentId = "1ZqSdQGsJ8tXVjq5tgf53tb0drCZ4GdGjWI9IOjcWQtA";
const refereeDocumentUrl = `https://docs.google.com/document/d/${refereeDocumentId}/edit`;
const refereeTextUrl = `https://docs.google.com/document/d/${refereeDocumentId}/export?format=txt`;
const handbookDocumentId = "1fTI6mJB5BqkNCLOs_xpbBy24jYpxd61BOmPjwcAiUeY";
const handbookTextUrl = `https://docs.google.com/document/d/${handbookDocumentId}/export?format=txt`;
function parseRefereeDocument(raw) {
  const lines = String(raw || "").replace(/\r/g, "").split("\n").map((line)=>line.replace(/\s+/g," ").trim()).filter(Boolean);
  const start = lines.findIndex((line, index)=>index > 20 && /^BÖLÜM 1\s*[–-]\s*KATILIMCILAR$/i.test(line));
  const content = start >= 0 ? lines.slice(start) : lines;
  const sections = [];
  let section = null, topic = null, currentCase = null, inDecision = false;
  const flushCase = () => {
    if (currentCase && topic) {
      currentCase.question = currentCase.questionParts.join(" ").trim();
      currentCase.decision = currentCase.decisionParts.join(" ").trim();
      currentCase.title = currentCase.question || "Örnek olay ve hakem kararı";
      currentCase.rules = currentCase.ruleParts.join(" • ");
      delete currentCase.questionParts;
      delete currentCase.decisionParts;
      delete currentCase.ruleParts;
      topic.cases.push(currentCase);
    }
    currentCase = null;
    inDecision = false;
  };
  for (const line of content) {
    const sectionMatch = line.match(/^BÖLÜM\s+(\d+)\s*[–-]\s*(.+)$/i);
    if (sectionMatch) { flushCase(); section={number:sectionMatch[1],title:sectionMatch[2].trim(),topics:[]}; sections.push(section); topic=null; continue; }
    if (/^EK\b/i.test(line)) { flushCase(); break; }
    if (!section) continue;
    const caseMatch = line.match(/^(\d+\.\d+(?:\.\d+)?)\s*(.*)$/);
    if (caseMatch && !/^Kural/i.test(line)) {
      flushCase();
      if (!topic) { topic={title:section.title, cases:[]}; section.topics.push(topic); }
      const videoLabel=(caseMatch[2].match(/VIDEO(?:\s*\d)?(?:\s*VIDEO\s*\d)?/i)||[])[0]||"";
      const firstText=caseMatch[2].replace(/VIDEO(?:\s*\d)?(?:\s*VIDEO\s*\d)?/ig,"").trim();
      const videoUrls=Object.entries(refereeVideoMap).filter(([key])=>key===caseMatch[1]||key.startsWith(`${caseMatch[1]}-`)).map(([,url])=>url);
      currentCase={id:caseMatch[1],title:"",question:"",decision:"",questionParts:firstText?[firstText]:[],decisionParts:[],ruleParts:[],hasVideo:Boolean(videoLabel)||videoUrls.length>0,videoLabel,videoUrls};
      continue;
    }
    const isTopic = line.length < 72 && line === line.toLocaleUpperCase("tr") && /[A-ZÇĞİÖŞÜ]/.test(line) && !/^(KARAR|VIDEO|KURAL|BÖLÜM|\d+)$/.test(line);
    if (isTopic) { flushCase(); topic={title:line,cases:[]}; section.topics.push(topic); continue; }
    if (!currentCase) continue;
    if (/^Karar$/i.test(line)) { inDecision=true; continue; }
    if (/^(Kural|Kurallar|D\d|Şekil)\b/i.test(line)) { currentCase.ruleParts.push(line); continue; }
    if (/^VIDEO(?:\s*\d)?/i.test(line)) {
      currentCase.hasVideo=true;
      currentCase.videoLabel=currentCase.videoLabel||line;
      continue;
    }
    if (inDecision) currentCase.decisionParts.push(line);
    else currentCase.questionParts.push(line);
  }
  flushCase();
  return sections.map((item)=>({...item,topics:item.topics.filter((entry)=>entry.cases.length)})).filter((item)=>item.topics.length);
}
function parseHandbookDocument(raw) {
  const lines=String(raw||"").replace(/\r/g,"").split("\n").map((line)=>line.replace(/[\u00a0\t]+/g," ").replace(/\s+/g," ").trim()).filter(Boolean);
  const refereeHeadings=["Giriş","1. Hakem Atamaları","2. Atama Sonrası Hazırlık","2.1. Kılık Kıyafet ve İlişkiler","2.2. Hakem Malzemeleri","3. Maç Öncesi Yapılacaklar","3.1. Maç Öncesi Toplantı","3.2. Oyun Alanının Kontrolü","3.3. Takım Listeleri, Sahaya Giriş Belgeleri ve Lisanslar","3.4. Maçın Zamanında Başlaması","3.5. Maç Zaman Çizelgesi","3.6. Resmi Oyun Protokolü","4. Maç Esnasında Hakemler","4.1. Baş Hakem","4.2. Yardımcı Hakem","4.3. Yazı Hakemi","4.4. Skor Hakemi","4.5. Çizgi Hakemi","5. Hatalı Davranış ve Yaptırımları","Kart Gösterme Prosedürü","Notlar","6. Raporlar","6.1. Takımın Lisansları da Oyuncuları da Yok ise","6.2. Takımın Oyuncuları Mevcut, Lisansları Yok ise","6.3. Takımın Lisansları Mevcut, Oyuncuları Yok ise","6.4. Takım Eksik İlan Edilirse","6.6. İstisnai Oyuncu Değişikliğinde","6.7. Müsabakada Meydana Gelen Olaylara İstinaden","6.8. Liberonun Yeniden Belirlenmesi Durumunda","Formlar","1. Maç Anons Talimatı","2. Seyircilerin Centilmenlik Dışı Davranışlarına Karşı Yaptırımlar"];
  const observerHeadings=["Giriş","1. BÖLÜM - GENEL HÜKÜMLER","Amaç","Kapsam","Dayanak","Tanımlar","2. BÖLÜM - GÖZLEMCİ","Gözlemci Olma Şartları","Gözlemci Klasmanlarının Belirlenmesi","Gözlemci Görev Tanımı","Gözlemciliğin Amaçları","Gözlemci Görev ve Sorumlulukları","Görev Onaylama","Görev Onaylandıktan Sonra Gözlemci","Maçtan Önce Gözlemci","Maç Esnasında Gözlemci","Maç Sonunda Gözlemci","Yapılan Hataların Değerlendirilmesi","Maç Sonrası Toplantı","Hakem Değerlendirme Formunun Doldurulması","Özel Durumlar","3. BÖLÜM - PLAJ VOLEYBOLU GÖZLEMCİSİ","Plaj Voleybolu Gözlemcisi Olma Şartları","Görev Tanımı","Plaj Voleybolu Gözlemcisi Görev ve Sorumlulukları","Görev Onaylandıktan Sonra Gözlemci","Organizasyon Öncesi Hazırlık Aşamasında Gözlemci","Müsabakalardan Önce Gözlemci","Müsabakalar Esnasında Gözlemci","Organizasyon Bittikten Sonra Gözlemci","EK-1: Salon Denetleme ve Değerlendirme Kontrol Formu","EK-2: Müsabaka Güvenlik Tutanağı","EK-3: TVF Müsabaka İdari ve Teknik Değerlendirme Formu","EK-4: Hakem Değerlendirme Formu","EK-5: Görüntü Değerlendirme Sistemi Takip Formu","EK-6: Kort Denetimi Kontrol Listesi","EK-7: Plaj Voleybolu Günlük Hakem Performans Formu"];
  const normalize=(value)=>value.toLocaleLowerCase("tr").replace(/giriş\s*:?/g,"giriş").replace(/\b(bölüm|ek)\s*[-.:]?\s*/g,"$1 ").replace(/^(\d+(?:\.\d+)*)[.)-]?\s*/,"$1 ").replace(/[^a-zçğıöşü0-9]+/g," ").trim();
  const ignored=/^(?:MHGK Hakem ve Gözlemci El Kitabı|\d+ MHGK Hakem ve Gözlemci El Kitabı|HAKEM EL KİTABI|GÖZLEMCİ EL KİTABI|İÇİNDEKİLER|TÜRKİYE VOLEYBOL FEDERASYONU)/i;
  const toBlocks=(entries)=>{
    const blocks=[];
    const expandedEntries=entries.flatMap((entry)=>{
      const parts=entry.split(/(?=(?:^|\s)\d+\.\s*[A-ZÇĞİÖŞÜ])/u).map((part)=>part.trim()).filter(Boolean);
      return parts.length>1?parts:[entry];
    });
    for(const entry of expandedEntries){
      const text=entry.replace(/^[-•]\s*/,"").trim();
      const numbered=text.match(/^(\d+)\.\s*(.+)$/u);
      const isBullet=/^[-•]/.test(entry);
      const isForm=/^(?:EK-\d+|FORM|SALON ADI|TARİH|SAAT|LİG|TAKIMLAR|BAŞ ?HAKEM|YRD\.? ?HAKEM|GÖZLEMCİ|İMZA|OPERATÖR|DEĞERLENDİRME PUANI|DÜŞÜNCELER VE NOTLAR)/i.test(text)||/[.…]{4,}/.test(text);
      const isSubheading=!isBullet&&!isForm&&text.length<70&&(/:$/.test(text)||text===text.toLocaleUpperCase("tr"));
      const type=numbered?"numbered":isBullet?"bullet":isForm?"form":isSubheading?"subheading":"paragraph";
      const previous=blocks[blocks.length-1];
      if(type==="paragraph"&&previous?.type==="paragraph")previous.text+=` ${text}`;
      else blocks.push(numbered?{type,text:numbered[2].trim(),marker:numbered[1]}:{type,text});
    }
    return blocks;
  };
  const locateOrdered=(headings,startAt,stopAt,category)=>{
    const found=[];
    let cursor=startAt;
    headings.forEach((title,index)=>{
      const target=normalize(title);
      const position=lines.findIndex((line,lineIndex)=>lineIndex>=cursor&&lineIndex<stopAt&&!ignored.test(line)&&normalize(line)===target);
      if(position>=0){found.push({title,position,category,isSection:/BÖLÜM|^Formlar$/i.test(title)});cursor=position+1}
    });
    return found.map((item,index)=>{
      const end=found[index+1]?.position??stopAt;
      const entries=lines.slice(item.position+1,end).filter((line)=>!ignored.test(line));
      return {...item,blocks:toBlocks(entries)};
    });
  };
  const tocIndexes=lines.map((line,index)=>line==="İÇİNDEKİLER"?index:-1).filter((index)=>index>=0);
  const refereeStart=lines.findIndex((line,index)=>index>(tocIndexes[0]??0)&&normalize(line)==="giriş");
  const observerToc=tocIndexes[1]??lines.length;
  const observerStart=lines.findIndex((line,index)=>index>observerToc&&normalize(line)==="giriş");
  const refereeChapters=locateOrdered(refereeHeadings,refereeStart,observerToc,"Hakem El Kitabı");
  const observerChapters=locateOrdered(observerHeadings,observerStart,lines.length,"Gözlemci El Kitabı");
  return [...refereeChapters,...observerChapters];
}
function JuniorRefereePage() {
  const [sections, setSections] = useState([]);
  const [library, setLibrary] = useState("casebook");
  const [handbookChapters, setHandbookChapters] = useState([]);
  const [handbookState, setHandbookState] = useState("loading");
  const [openSection, setOpenSection] = useState("1");
  const [openCase, setOpenCase] = useState("");
  const [openHandbook, setOpenHandbook] = useState("");
  const [sourceState, setSourceState] = useState("loading");
  useEffect(()=>{ let active=true; fetch(`${refereeTextUrl}&t=${Date.now()}`,{cache:"no-store"}).then((response)=>{if(!response.ok)throw new Error("Belge okunamadı");return response.text()}).then((text)=>{if(active){setSections(parseRefereeDocument(text));setSourceState("ready")}}).catch(()=>{if(active)setSourceState("error")}); return()=>{active=false}; },[]);
  useEffect(()=>{let active=true;fetch(`${handbookTextUrl}&t=${Date.now()}`,{cache:"no-store"}).then((response)=>{if(!response.ok)throw new Error("El kitabı okunamadı");return response.text()}).then((text)=>{if(active){setHandbookChapters(parseHandbookDocument(text));setHandbookState("ready")}}).catch(()=>{if(active)setHandbookState("error")});return()=>{active=false}},[]);
  const caseCount = sections.reduce((total,item)=>total+item.topics.reduce((sum,entry)=>sum+entry.cases.length,0),0);
  const videoCount = sections.reduce((total,item)=>total+item.topics.reduce((sum,entry)=>sum+entry.cases.filter((entryCase)=>entryCase.hasVideo).length,0),0);
  return <div className="junior-referee-page">
    <section className="junior-referee-hero">
      <div className="junior-referee-copy">
        <span className="eyebrow"><Flag/> JUNIOR HAKEM AKADEMİSİ</span>
        <h1>Oyunu bil.<br/><em>Kararı güvenle ver.</em></h1>
        <p>Voleybol hakemliğine ilk adımı atan gençler için sade, uygulamalı ve adım adım ilerleyen bir öğrenme alanı.</p>
        <div className={`junior-referee-note ${sourceState}`}><ShieldCheck/><span><b>{sourceState==="ready"?"Hakemlik içerikleri güncel":sourceState==="error"?"İçerikler yüklenemedi":"İçerikler güncelleniyor"}</b><small>{sourceState==="ready"?`${sections.length} bölüm • ${caseCount} örnek olay • ${videoCount} video`:sourceState==="error"?"Tekrar denemek için sayfayı yenileyin.":"Güncel hakemlik konuları hazırlanıyor."}</small></span></div>
      </div>
      <div className="junior-referee-visual"><img src="./junior-referees.png" alt="Voleybol hakemi kıyafetli bir kız ve bir erkek çocuk"/></div>
    </section>
    <section className="junior-referee-content">
      <div className="referee-library-cards" aria-label="Junior Hakem eğitim bölümleri">
        <button className={library==="casebook"?"active":""} onClick={()=>setLibrary("casebook")}><span><Play/></span><small>ÖRNEK OLAY ANALİZİ</small><h2>FIVB 2025 Örnek Olaylar Kitabı</h2><p>Saha içindeki gerçek karar örnekleri, kurallar, hakem kararları ve olay videoları.</p><b>{caseCount} örnek olay • {videoCount} video <ArrowRight/></b></button>
        <button className={library==="handbook"?"active":""} onClick={()=>setLibrary("handbook")}><span><BookOpen/></span><small>GÖREV VE UYGULAMA REHBERİ</small><h2>Hakem ve Gözlemci El Kitabı</h2><p>Atamalar, maç hazırlığı, hakem görevleri, raporlar ve gözlemci değerlendirme esasları.</p><b>{handbookChapters.length||"—"} konu <ArrowRight/></b></button>
      </div>
      {library==="casebook"?<>
      <div className="junior-referee-heading"><span><small>FIVB 2025 ÖRNEK OLAYLAR KİTABI</small><h2>Hakemlik konuları</h2></span><p>Güncel örnek olaylar, karar açıklamaları ve eğitim videoları.</p></div>
      {sourceState==="loading"?<div className="referee-loading"><span/><span/><span/></div>:sourceState==="error"?<div className="referee-source-error"><WifiOff/><h3>Hakemlik verisi yüklenemedi</h3></div>:<div className="referee-accordion">{sections.map((item)=><section className={openSection===item.number?"open":""} key={item.number}><button className="referee-section-trigger" onClick={()=>setOpenSection(openSection===item.number?"":item.number)}><span>{String(item.number).padStart(2,"0")}</span><div><small>BÖLÜM {item.number}</small><h3>{item.title}</h3><p>{item.topics.length} konu • {item.topics.reduce((sum,entry)=>sum+entry.cases.length,0)} örnek olay</p></div><ChevronDown/></button>{openSection===item.number&&<div className="referee-topic-list">{item.topics.map((entry)=><article key={`${item.number}-${entry.title}`}><h4>{entry.title}</h4><div>{entry.cases.map((entryCase)=>{const key=`${item.number}-${entryCase.id}`;return <section className={`referee-case ${openCase===key?"open":""}`} key={key}><button onClick={()=>setOpenCase(openCase===key?"":key)}><b>{entryCase.id}</b><span>{entryCase.question||entryCase.title}</span>{entryCase.hasVideo&&<em><Play/> {entryCase.videoLabel||"VIDEO"}</em>}<ChevronDown/></button><p className="referee-case-preview">{entryCase.decision||"Bu olayın ayrıntılı açıklaması hazırlanıyor."}</p>{openCase===key&&<div className="referee-case-detail"><small>OLAY AÇIKLAMASI</small><p>{entryCase.question||entryCase.title}</p><small>HAKEM KARARI</small><p>{entryCase.decision||"Karar açıklaması hazırlanıyor."}</p>{entryCase.rules&&<strong>{entryCase.rules}</strong>}{entryCase.videoUrls?.length>0&&<div className="referee-video-player"><div className="referee-video-title"><Play/><span><b>Olay videosu</b><small>FIVB Academy eğitim görüntüsü</small></span></div>{entryCase.videoUrls.map((videoUrl)=><video key={videoUrl} controls playsInline preload="metadata"><source src={videoUrl} type="video/mp4"/>Tarayıcınız video oynatmayı desteklemiyor.</video>)}</div>}</div>}</section>})}</div></article>)}</div>}</section>)}</div>}
      </>:<>
        <div className="junior-referee-heading"><span><small>TVF HAKEM VE GÖZLEMCİ EL KİTABI</small><h2>Görev ve uygulama rehberi</h2></span><p>Hakem ve gözlemcilerin müsabaka öncesi, sırası ve sonrasındaki görevleri.</p></div>
        {handbookState==="loading"?<div className="referee-loading"><span/><span/><span/></div>:handbookState==="error"?<div className="referee-source-error"><WifiOff/><h3>El kitabı yüklenemedi</h3></div>:<div className="handbook-accordion">{handbookChapters.map((chapter,index)=>{const key=`handbook-${index}`;const startsCategory=index===0||handbookChapters[index-1]?.category!==chapter.category;return <React.Fragment key={key}>{startsCategory&&<div className="handbook-category"><BookOpen/><span><small>ANA BÖLÜM</small><h3>{chapter.category}</h3></span></div>}<article className={`${openHandbook===key?"open":""} ${chapter.isSection?"section-heading":""}`}><button onClick={()=>setOpenHandbook(openHandbook===key?"":key)}><span>{String(index+1).padStart(2,"0")}</span><h3>{chapter.title}</h3><ChevronDown/></button>{openHandbook===key&&<div className="handbook-content">{chapter.blocks.length===0?<p className="handbook-empty">Bu ana bölümün konuları aşağıdaki başlıklarda sıralanmıştır.</p>:chapter.blocks.map((block,blockIndex)=>{if(block.type==="numbered")return <div className="handbook-numbered" key={blockIndex}><b>{block.marker}</b><p>{block.text}</p></div>;if(block.type==="bullet")return <p className="handbook-check" key={blockIndex}><CheckCircle2/><span>{block.text}</span></p>;if(block.type==="subheading")return <h4 key={blockIndex}>{block.text}</h4>;if(block.type==="form"){const separator=block.text.indexOf(":");const label=separator>0?block.text.slice(0,separator):block.text;const value=separator>0?block.text.slice(separator+1).replace(/[.…]+/g," ").trim():"Doldurulacak alan";return <div className="handbook-form-row" key={blockIndex}><b>{label}</b><span>{value||"Doldurulacak alan"}</span></div>}return <p key={blockIndex}>{block.text}</p>})}</div>}</article></React.Fragment>})}</div>}
      </>}
    </section>
  </div>;
}
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="footer-brand-block">
        <div className="brand inverse">
          <img className="ball" src="./brand-logo.png" alt="" aria-hidden="true" />
          <span>
            VOLEYBOL
            <br />
            <b>AKADEMİSİ</b>
          </span>
        </div>
        <p>
          Bilimsel yaklaşım, uzman antrenörler ve sahaya dönük eğitimlerle
          voleybol gelişiminin dijital adresi.
        </p>
        <div className="social" aria-label="Sosyal medya">
          <span aria-label="Instagram"><Instagram /></span>
          <span aria-label="YouTube"><Youtube /></span>
          <span aria-label="Topluluk"><Linkedin /></span>
        </div>
      </div>
      <div className="footer-links">
        <b>Akademi</b>
        <button onClick={() => go("courses")}>Dersler</button>
        <button onClick={() => go("coaches")}>Eğitmenler</button>
        <button onClick={() => go("live")}>Canlı dersler</button>
      </div>
      <div className="footer-links">
        <b>Destek</b>
        <button onClick={() => go("help")}>Yardım merkezi</button>
        <button onClick={() => go("contact")}>İletişim</button>
        <button onClick={() => go("privacy")}>Gizlilik</button>
      </div>
      <div className="footer-data-card">
        <b>Veri durumu</b>
        <span className="status">
          <ShieldCheck /> Canlı bağlantı aktif
        </span>
        <small>Ders verileri 15 saniyede bir otomatik yenilenir.</small>
      </div>
      <div className="footer-bottom"><p className="copyright">© 2026 Online Voleybol Akademisi</p><span>Voleybola özel dijital eğitim platformu</span></div>
    </footer>
  );
}
const rootElement = document.getElementById("root");
const appRoot = rootElement.__reactRoot || createRoot(rootElement);
rootElement.__reactRoot = appRoot;
appRoot.render(<App />);
