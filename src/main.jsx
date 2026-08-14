import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Copy,
  Share2,
  Flag,
  LockKeyhole,
  Award,
  ClipboardCheck,
  RotateCcw,
  CircleDot,
  Newspaper,
  CircleHelp,
  GripVertical,
  Eye,
  Settings,
  Save,
  KeyRound,
  Download,
  FileText,
  Library,
} from "lucide-react";
import "./styles.css";
import "./lesson-images.css";
import "./video-library.css";
import "./video-native-player.css";
import "./video-layout-fix.css";
import "./video-topics.css";
import "./profile-area.css";
import "./pricing.css";
import "./demo.css";
import "./demo-access.css";
import "./registered-schools.css";
import "./junior-referee.css";
import "./blog.css";
import "./admin.css";
import "./privacy.css";
import "./coaches.css";
import "./technical-cards.css";
import "./bulletins.css";
import "./ready365-library.css";
import "./quality-fixes.css";
import "./home-modern.css";
import "./home-stats.css";
import "./page-titles-modern.css";
import "./contact-messenger.css";
import "./notebooklm-workspace.css";
import { refereeVideoMap } from "./referee-videos";
import { appConfig } from "./config.js";
import { trainingVideos, videoTopics } from "./video-library.js";
import { individualTrainingVideos, individualVideoTopics } from "./individual-video-library.js";
import { technicalCards, technicalCardCategories } from "./technical-cards.js";
import { applyBulletinManagement } from "./bulletins.js";
import { SITE_URL, resolveRoute, routeFor, seoFor } from "./seo.js";
import { initAnalytics } from "./analytics.js";
import { registerPwa } from "./pwa.js";
const totalVideoCount = trainingVideos.length + individualTrainingVideos.length;
const VolleyballAIPage = React.lazy(() => import("./volleyball-ai.jsx"));
const NotebookLMWorkspacePage = React.lazy(() => import("./notebooklm-workspace.jsx"));
const VolleyballChatPage = React.lazy(() => import("./volleyball-chat.jsx"));
const BulletinsPage = React.lazy(() => import("./bulletins.jsx"));
const Ready365LibraryPage = React.lazy(() => import("./ready365-library.jsx"));
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
    ? "/course-covers/course-02.webp"
    : `/course-covers/course-${String(i + 1).padStart(2, "0")}.webp`,
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
  ["blog", "Blog", Newspaper],
  ["notebooklm-ai", "Voleybol AI", MessageCircle],
  ["chat", "Voleybol Chat", MessageCircle],
  ["demo", "Demo", Play],
  ["pricing", "Ücretler", BadgeTurkishLira],
  ["register", "Kayıt", UserPlus],
  ["profiles", "Giriş Yap", UserRound],
];

const readAthletes = () => {
  try { return JSON.parse(localStorage.getItem("volleyballAthletes") || "[]"); }
  catch { return []; }
};
const readSchools = () => {
  try { return JSON.parse(localStorage.getItem("volleyballSchools") || "[]"); }
  catch { return []; }
};
const readTrainers = () => {
  try { return JSON.parse(localStorage.getItem("volleyballTrainers") || "[]"); }
  catch { return []; }
};
const readTeams = () => {
  try { return JSON.parse(localStorage.getItem("volleyballClubTeams") || "[]"); }
  catch { return []; }
};
const readLoggedOutAthleteIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem("volleyballLoggedOutAthleteIds") || "[]")); }
  catch { return new Set(); }
};
const setAthleteLoggedOut = (id, loggedOut) => {
  if (!id) return;
  const ids = readLoggedOutAthleteIds();
  if (loggedOut) ids.add(id); else ids.delete(id);
  localStorage.setItem("volleyballLoggedOutAthleteIds", JSON.stringify([...ids]));
};
const SESSION_ACTIVITY_KEY = "volleyballSessionLastActivity";
const SESSION_IDLE_LIMIT = 15 * 60 * 1000;
const PRESENCE_HEARTBEAT_INTERVAL = 10000;
const PRESENCE_STALE_AFTER = 45000;
const SCHOOL_LIST_REFRESH_INTERVAL = 3000;
const RELATED_REGISTRATION_REFRESH_INTERVAL = 15000;
// Hızlı giriş kuralı: aynı veri sekmesi için eş zamanlı istekler tek ağ isteğini paylaşır.
const REGISTRATION_REQUEST_DEDUP_WINDOW = 2500;
const registrationSheetRequests = new Map();
const markSessionActivity = () => localStorage.setItem(SESSION_ACTIVITY_KEY, String(Date.now()));
const clearSessionActivity = () => localStorage.removeItem(SESSION_ACTIVITY_KEY);
const presenceTime = (value) => {
  if (!value) return 0;
  const native = new Date(value).getTime();
  if (Number.isFinite(native)) return native;
  const match = String(value).match(/^(\d{1,2})[.\/]\s*(\d{1,2})[.\/]\s*(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  return match ? new Date(Number(match[3]), Number(match[2])-1, Number(match[1]), Number(match[4]||0), Number(match[5]||0), Number(match[6]||0)).getTime() : 0;
};
const isAthleteActive = (athlete) => {
  if (athlete.online !== true) return false;
  if (athlete.id === localStorage.getItem("volleyballCurrentAthleteId")) return true;
  const seenAt = presenceTime(athlete.lastSeen);
  return seenAt > 0 && Date.now() - seenAt <= PRESENCE_STALE_AFTER;
};
const activeAthleteKey = (athlete) => {
  const school = String(athlete.schoolName || "").trim().toLocaleLowerCase("tr-TR");
  const name = String(athlete.name || "")
    .trim()
    .replace(/^@+/, "")
    .toLocaleLowerCase("tr-TR");
  return `${school}::${name}`;
};
const dedupeActiveAthletes = (athletes) => {
  const currentId = localStorage.getItem("volleyballCurrentAthleteId");
  const unique = new Map();
  athletes.filter(isAthleteActive).forEach((athlete) => {
    const key = activeAthleteKey(athlete);
    const existing = unique.get(key);
    if (!existing) {
      unique.set(key, athlete);
      return;
    }
    const athleteIsCurrent = athlete.id === currentId;
    const existingIsCurrent = existing.id === currentId;
    const athleteTime = new Date(athlete.lastSeen || 0).getTime() || 0;
    const existingTime = new Date(existing.lastSeen || 0).getTime() || 0;
    if (
      athleteIsCurrent ||
      (!existingIsCurrent && athleteTime > existingTime) ||
      (!existingIsCurrent && athleteTime === existingTime && String(athlete.name || "").startsWith("@"))
    ) unique.set(key, athlete);
  });
  return [...unique.values()];
};
const readActiveAthletes = () => dedupeActiveAthletes(readAthletes());

const registrationValue = (row, key) => String(row?.[key] ?? "").trim();
const registrationBoolean = (value) => ["true", "evet", "1", "aktif"].includes(String(value || "").trim().toLocaleLowerCase("tr"));
function syncTeamStorage(teamRows) {
  const localTeams = readTeams();
  const teams = teamRows.map((row) => {
    const id = registrationValue(row, "Takım ID");
    const local = localTeams.find((item) => item.id === id) || {};
    return {
      ...local,
      id,
      schoolId: registrationValue(row, "Okul Kayıt ID"),
      schoolName: registrationValue(row, "Okul Adı"),
      name: registrationValue(row, "Takım Adı"),
      status: registrationValue(row, "Durum") || "AKTİF",
      order: Number(registrationValue(row, "Sıra")) || local.order || 0,
      createdAt: registrationValue(row, "Oluşturma Tarihi") || local.createdAt || "",
      source: "google-sheets",
    };
  }).filter((team) => team.id && team.schoolId && team.name);
  localStorage.setItem("volleyballClubTeams", JSON.stringify(teams));
  return teams;
}
const teamsForSchool = (teams, school) => {
  const schoolId = String(school?.id || school?.schoolId || "");
  const schoolName = String(school?.schoolName || school || "").trim().toLocaleLowerCase("tr");
  return teams.filter((team) => {
    const active = String(team.status || "AKTİF").toLocaleUpperCase("tr") === "AKTİF";
    return active && (schoolId ? String(team.schoolId) === schoolId : String(team.schoolName || "").trim().toLocaleLowerCase("tr") === schoolName);
  }).sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999)||String(a.name).localeCompare(String(b.name),"tr"));
};
async function fetchRegistrationSheet(sheet) {
  if (!registrationApi) return [];
  const existingRequest = registrationSheetRequests.get(sheet);
  if (existingRequest && Date.now() - existingRequest.startedAt < REGISTRATION_REQUEST_DEDUP_WINDOW) return existingRequest.promise;
  const separator = registrationApi.includes("?") ? "&" : "?";
  const promise = (async () => {
    let lastError;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(`${registrationApi}${separator}sheet=${encodeURIComponent(sheet)}&_=${Date.now()}-${attempt}`, {
          cache: "no-store",
          credentials: "omit",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Kayıt bilgileri alınamadı (${response.status})`);
        const result = await response.json();
        if (result.ok === false) throw new Error(result.error || "Kayıt bilgileri alınamadı.");
        return Array.isArray(result.data) ? result.data : [];
      } catch (error) {
        lastError = error;
        if (attempt === 0) await new Promise((resolve) => window.setTimeout(resolve, 150));
      }
    }
    throw lastError;
  })();
  registrationSheetRequests.set(sheet, { startedAt:Date.now(), promise });
  promise.catch(() => registrationSheetRequests.delete(sheet));
  return promise;
}
function syncSchoolStorage(schoolRows) {
  const localSchools = readSchools();
  const schoolKey = (value) => String(value || "").trim().toLocaleLowerCase("tr");
  const teamLogoBySchool = new Map();
  schoolRows.forEach((row) => {
    const logo = registrationValue(row, "Takım Logosu (Manuel)");
    const schoolName = registrationValue(row, "Okul Adı");
    if (logo && schoolName) teamLogoBySchool.set(schoolKey(schoolName), logo);
  });
  readAthletes().forEach((athlete) => {
    if (athlete.teamLogo && athlete.schoolName && !teamLogoBySchool.has(schoolKey(athlete.schoolName)))
      teamLogoBySchool.set(schoolKey(athlete.schoolName), athlete.teamLogo);
  });
  const schools = schoolRows.map((row) => {
    const id = registrationValue(row, "Kayıt ID");
    const local = localSchools.find((item) => item.id === id) || {};
    const schoolName = registrationValue(row, "Okul Adı");
    return {
      ...local,
      id,
      schoolName,
      phone: registrationValue(row, "Telefon") || local.phone || "",
      code: registrationValue(row, "6 Haneli Kod") || local.code || "",
      status: registrationValue(row, "Onay Durumu"),
      createdAt: registrationValue(row, "Kayıt Tarihi"),
      approvedAt: registrationValue(row, "Onay Tarihi"),
      managerNote: registrationValue(row, "Yönetici Notu"),
      teamLogo: registrationValue(row, "Takım Logosu (Manuel)") || teamLogoBySchool.get(schoolKey(schoolName)) || local.teamLogo || "",
      source: "google-sheets",
    };
  }).filter((school) => school.id && school.schoolName);
  localStorage.setItem("volleyballSchools", JSON.stringify(schools));
  return schools;
}
function syncRegistrationStorage(schoolRows, athleteRows) {
  const localSchools = readSchools();
  const localAthletes = readAthletes();
  const currentAthleteId = localStorage.getItem("volleyballCurrentAthleteId");
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
      phone: registrationValue(row, "Telefon") || local.phone || "",
      code: registrationValue(row, "6 Haneli Kod") || local.code || "",
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
    const hasActiveLocalSession = id === currentAthleteId && local.online === true;
    return {
      ...local,
      id,
      schoolId: registrationValue(row, "Okul Kayıt ID"),
      schoolName: registrationValue(row, "Okul Adı"),
      schoolCode: registrationValue(row, "Okul Kodu") || local.schoolCode || "",
      name: registrationValue(row, "Sporcu Adı"),
      avatar: registrationValue(row, "Profil Kodu") || local.avatar || profileChoices[0].id,
      teamLogo: registrationValue(row, "Takım Logosu (Manuel)") || teamLogoBySchool.get(schoolKey(registrationValue(row, "Okul Adı"))) || local.teamLogo || "",
      // Sunucudaki durum cihazlar arasındaki tek doğruluk kaynağıdır. Bu
      // tarayıcıda daha önce çıkış yapılmış olması, başka bir telefondan yeniden
      // giriş yapan sporcunun takım sayfasında gizlenmesine neden olmamalıdır.
      online: hasActiveLocalSession || registrationBoolean(registrationValue(row, "Çevrim İçi")),
      lastSeen: hasActiveLocalSession ? local.lastSeen : registrationValue(row, "Son Görülme"),
      createdAt: registrationValue(row, "Kayıt Tarihi"),
      teamId: registrationValue(row, "Takım ID") || local.teamId || "",
      teamName: registrationValue(row, "Takım Adı") || local.teamName || "",
      source: "google-sheets",
    };
  }).filter((athlete) => athlete.id && athlete.name);
  localStorage.setItem("volleyballSchools", JSON.stringify(schools));
  localStorage.setItem("volleyballAthletes", JSON.stringify(athletes));
  return { schools, athletes };
}
const splitTeamList = (value) => String(value || "").split("|").map((item) => item.trim()).filter(Boolean);
  const trainerTeamMemberships = (trainer = {}) => {
  if (Array.isArray(trainer.teams) && trainer.teams.length) return trainer.teams.filter((team) => team?.id).map((team) => ({ id:String(team.id), name:String(team.name || ""), code:String(team.code || "") }));
  const ids = Array.isArray(trainer.teamIds) ? trainer.teamIds : splitTeamList(trainer.teamId);
  const names = Array.isArray(trainer.teamNames) ? trainer.teamNames : splitTeamList(trainer.teamName);
  const codes = Array.isArray(trainer.teamCodes) ? trainer.teamCodes : [];
  return ids.map((id, index) => ({ id, name:names[index] || trainer.teamName || "", code:codes[index] || "" }));
};
function syncTrainerStorage(trainerRows) {
  const localTrainers = readTrainers();
  const trainers = trainerRows.map((row) => {
    const id = registrationValue(row, "Antrenör ID");
    const local = localTrainers.find((item) => item.id === id) || {};
    const teamIds = splitTeamList(registrationValue(row, "Takım ID") || local.teamId);
    const teamNames = splitTeamList(registrationValue(row, "Takım Adı") || local.teamName);
    const teamCodes = splitTeamList(registrationValue(row, "Takım Kodu"));
    const trainerCode = registrationValue(row, "Antrenör Kodu") || local.trainerCode || local.teamCode || local.schoolCode || "";
    const memberships = teamIds.map((teamId, index) => ({ id:teamId, name:teamNames[index] || "", code:teamCodes[index] || "" }));
    return {
      ...local,
      id,
      schoolId: registrationValue(row, "Okul Kayıt ID"),
      schoolName: registrationValue(row, "Okul Adı"),
      schoolCode: trainerCode,
      trainerCode,
      name: registrationValue(row, "Antrenör Adı"),
      title: registrationValue(row, "Görev") || "Antrenör",
      avatar: registrationValue(row, "Profil Kodu") || local.avatar || trainerProfileChoices[0].id,
      avatarName: registrationValue(row, "Profil Görseli") || local.avatarName || "",
      teamLogo: registrationValue(row, "Takım Logosu (Manuel)") || local.teamLogo || "",
      status: registrationValue(row, "Durum") || "AKTİF",
      createdAt: registrationValue(row, "Kayıt Tarihi"),
      teamId: teamIds[0] || "",
      teamName: teamNames[0] || "",
      teamCode: trainerCode,
      teamIds,
      teamNames,
      teamCodes,
      teams: memberships.length ? memberships : trainerTeamMemberships(local),
      source: "google-sheets",
    };
  }).filter((trainer) => trainer.id && trainer.name && trainer.schoolName);
  localStorage.setItem("volleyballTrainers", JSON.stringify(trainers));
  return trainers;
}

function App() {
  const initialRoute = useMemo(() => {
    const restored = sessionStorage.getItem("spaPath");
    if (restored) sessionStorage.removeItem("spaPath");
    return resolveRoute(restored || window.location.pathname, courses);
  }, []);
  const allowStoredSession = import.meta.env.DEV || Boolean(sessionStorage.getItem("volleyballProfileToken"));
  const [page, setPage] = useState(initialRoute.page);
  const [menu, setMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(initialRoute.course || courses[0]);
  const [onlineAthletes, setOnlineAthletes] = useState(() => {
    return readActiveAthletes();
  });
  const [currentAthlete, setCurrentAthlete] = useState(() => {
    if (!allowStoredSession) return null;
    const currentId = localStorage.getItem("volleyballCurrentAthleteId");
    return readAthletes().find((athlete) => athlete.id === currentId) || null;
  });
  const [currentClub, setCurrentClub] = useState(() => {
    if (!allowStoredSession) return null;
    try { return JSON.parse(localStorage.getItem("volleyballCurrentClub") || "null"); }
    catch { return null; }
  });
  const [currentTrainer, setCurrentTrainer] = useState(() => {
    if (!allowStoredSession) return null;
    const currentId = localStorage.getItem("volleyballCurrentTrainerId");
    return readTrainers().find((trainer) => trainer.id === currentId) || null;
  });
  const [authNotice, setAuthNotice] = useState("");
  const [, setRegistrationRevision] = useState(0);
  useEffect(() => {
    const token = sessionStorage.getItem(PROFILE_TOKEN_KEY);
    if (!token) {
      if (!import.meta.env.DEV) {
        localStorage.removeItem("volleyballCurrentAthleteId");
        localStorage.removeItem("volleyballCurrentClub");
        localStorage.removeItem("volleyballCurrentTrainerId");
      }
      return;
    }
    let disposed = false;
    sendRegistration({ action:"validateProfileSession", token }).then((result) => {
      if (disposed || !result.account) return;
      const account = result.account;
      if (account.type === "athlete") setCurrentAthlete((current) => ({ ...current, ...account }));
      if (account.type === "trainer") setCurrentTrainer((current) => ({ ...current, ...account }));
      if (account.type === "club") setCurrentClub((current) => ({ ...current, ...account }));
    }).catch(() => {
      if (disposed) return;
      sessionStorage.removeItem(PROFILE_TOKEN_KEY);
      localStorage.removeItem("volleyballCurrentAthleteId");
      localStorage.removeItem("volleyballCurrentClub");
      localStorage.removeItem("volleyballCurrentTrainerId");
      setCurrentAthlete(null); setCurrentTrainer(null); setCurrentClub(null);
      setAuthNotice("Güvenli profil oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
    });
    return () => { disposed = true; };
  }, []);
  useEffect(() => {
    const onPopState = () => {
      const next = resolveRoute(window.location.pathname, courses);
      if (next.course) setSelectedCourse(next.course);
      setPage(next.page);
      setMenu(false);
      scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    if (page === "blog" && /^\/voleybol-blog\/[^/]+\/?$/.test(window.location.pathname)) return;
    const seo = seoFor(page, selectedCourse);
    const setMeta = (selector, attribute, value) => {
      const element = document.head.querySelector(selector);
      if (element) element.setAttribute(attribute, value);
    };
    document.title = seo.title;
    setMeta('meta[name="description"]', "content", seo.description);
    setMeta('meta[name="robots"]', "content", seo.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta('meta[name="googlebot"]', "content", seo.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta('meta[property="og:title"]', "content", seo.title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:url"]', "content", `${SITE_URL}${seo.path}`);
    setMeta('meta[name="twitter:title"]', "content", seo.title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
    setMeta('link[rel="canonical"]', "href", `${SITE_URL}${seo.path}`);
  }, [page, selectedCourse]);
  useEffect(() => {
    const protectedPages = ["courses", "course", "lesson", "videos", "exams", "technical-cards", "chat"];
    if (page === "bulletins" && !currentClub) {
      setAuthNotice("Eğitim bültenleri yalnızca spor okulu hesabıyla kullanılabilir.");
      setPage("profiles");
      window.history.replaceState({ page: "profiles" }, "", routeFor("profiles"));
      return;
    }
    if (page === "ready365-library" && !currentClub && !currentTrainer) {
      setAuthNotice("Bu eğitim kütüphanesi yalnızca spor okulu ve antrenör hesaplarına açıktır.");
      setPage("profiles");
      window.history.replaceState({ page: "profiles" }, "", routeFor("profiles"));
      return;
    }
    if (protectedPages.includes(page) && !currentAthlete && !currentClub && !currentTrainer) {
      setAuthNotice("Derslere, eğitim videolarına ve sınavlara erişmek için kayıtlı hesabınızla giriş yapın.");
      setPage("profiles");
      window.history.replaceState({ page: "profiles" }, "", routeFor("profiles"));
    }
  }, [page, currentAthlete, currentClub, currentTrainer]);
  useEffect(() => {
    if (!registrationApi) return;
    let disposed = false;
    let active = false;
    const refreshRegistrations = async () => {
      if (active || disposed) return;
      active = true;
      try {
        const [schoolRows, athleteRows, teamRows, trainerRows] = await Promise.all([
          fetchRegistrationSheet("Okul Kayitlari"),
          fetchRegistrationSheet("Sporcu Kayitlari"),
          fetchRegistrationSheet("Takimlar").catch(() => null),
          fetchRegistrationSheet("Antrenor Kayitlari").catch(() => null),
        ]);
        if (disposed) return;
        const synced = syncRegistrationStorage(schoolRows, athleteRows);
        const currentAthleteId = localStorage.getItem("volleyballCurrentAthleteId");
        const syncedAthlete = synced.athletes.find((item) => item.id === currentAthleteId) || null;
        if (currentAthleteId) setCurrentAthlete(syncedAthlete);
        setOnlineAthletes(dedupeActiveAthletes(synced.athletes));
        setCurrentClub((current) => {
          if (!current) return current;
          const refreshedClub = synced.schools.find((item) => item.id === current.id);
          if (refreshedClub) return refreshedClub;
          localStorage.removeItem("volleyballCurrentClub");
          sessionStorage.removeItem(PROFILE_TOKEN_KEY);
          return null;
        });
        if (Array.isArray(teamRows)) syncTeamStorage(teamRows);
        if (Array.isArray(trainerRows)) syncTrainerStorage(trainerRows);
        setRegistrationRevision((value) => value + 1);
      } catch (error) {
        console.warn("Kayıt bilgileri yenilenemedi:", error);
      } finally {
        active = false;
      }
    };
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refreshRegistrations(); };
    refreshRegistrations();
    const refreshInterval = currentAthlete || currentClub || currentTrainer ? 15000 : 60000;
    const timer = window.setInterval(refreshRegistrations, refreshInterval);
    window.addEventListener("focus", refreshRegistrations);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshRegistrations);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [currentAthlete?.id, currentClub?.id, currentTrainer?.id]);
  useEffect(() => {
    const hasSession = Boolean(currentAthlete || currentClub || currentTrainer);
    if (!hasSession) return undefined;
    let idleTimer;
    const currentId = localStorage.getItem("volleyballCurrentAthleteId");
    const setLocalPresence = (online) => {
      if (!currentId) return;
      setAthleteLoggedOut(currentId, !online);
      const athletes = readAthletes().map((athlete) => athlete.id === currentId
        ? { ...athlete, online, lastSeen:new Date().toISOString() }
        : athlete);
      localStorage.setItem("volleyballAthletes", JSON.stringify(athletes));
      setOnlineAthletes(dedupeActiveAthletes(athletes));
    };
    const expireSession = () => {
      setLocalPresence(false);
      sendAthletePresenceBeacon(currentId, false);
      closeProfileServerSession();
      localStorage.removeItem("volleyballCurrentAthleteId");
      localStorage.removeItem("volleyballCurrentClub");
      localStorage.removeItem("volleyballCurrentTrainerId");
      clearSessionActivity();
      setCurrentAthlete(null);
      setCurrentClub(null);
      setCurrentTrainer(null);
      setAuthNotice("15 dakika işlem yapılmadığı için oturumunuz kapatıldı. Lütfen tekrar giriş yapın.");
      go("profiles");
    };
    const scheduleExpiry = () => {
      window.clearTimeout(idleTimer);
      const lastActivity = Number(localStorage.getItem(SESSION_ACTIVITY_KEY)) || Date.now();
      const remaining = SESSION_IDLE_LIMIT - (Date.now() - lastActivity);
      if (remaining <= 0) expireSession();
      else idleTimer = window.setTimeout(expireSession, remaining);
    };
    const registerActivity = () => {
      markSessionActivity();
      scheduleExpiry();
    };
    const heartbeat = () => {
      if (Date.now() - (Number(localStorage.getItem(SESSION_ACTIVITY_KEY)) || 0) >= SESSION_IDLE_LIMIT) {
        expireSession();
        return;
      }
      setLocalPresence(true);
      sendAthletePresence(currentId, true);
    };
    const returnToPage = () => {
      if (document.visibilityState !== "visible") return;
      scheduleExpiry();
      if (Date.now() - (Number(localStorage.getItem(SESSION_ACTIVITY_KEY)) || 0) < SESSION_IDLE_LIMIT) heartbeat();
    };
    const leavePage = () => {
      if (currentId) sendAthletePresenceBeacon(currentId, false);
    };
    if (!localStorage.getItem(SESSION_ACTIVITY_KEY)) markSessionActivity();
    scheduleExpiry();
    heartbeat();
    const heartbeatTimer = window.setInterval(heartbeat, PRESENCE_HEARTBEAT_INTERVAL);
    const activityEvents = ["pointerdown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, registerActivity, { passive:true }));
    document.addEventListener("visibilitychange", returnToPage);
    window.addEventListener("pagehide", leavePage);
    return () => {
      window.clearInterval(heartbeatTimer);
      window.clearTimeout(idleTimer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, registerActivity));
      document.removeEventListener("visibilitychange", returnToPage);
      window.removeEventListener("pagehide", leavePage);
    };
  }, [currentAthlete?.id, currentClub?.id, currentTrainer?.id]);
  const go = (p, course) => {
    if (["dashboard", "training", "performance"].includes(p)) p = "courses";
    if (["courses", "course", "lesson", "videos", "exams", "chat"].includes(p) && !currentAthlete && !currentClub && !currentTrainer) {
      setAuthNotice("Derslere, eğitim videolarına ve sınavlara erişmek için kayıtlı hesabınızla giriş yapın.");
      p = "profiles";
    }
    if (p === "bulletins" && !currentClub) {
      setAuthNotice("Eğitim bültenleri yalnızca spor okulu hesabıyla kullanılabilir.");
      p = "profiles";
    }
    if (p === "ready365-library" && !currentClub && !currentTrainer) {
      setAuthNotice("Bu eğitim kütüphanesi yalnızca spor okulu ve antrenör hesaplarına açıktır.");
      p = "profiles";
    }
    if (course) setSelectedCourse(course);
    const nextCourse = course || selectedCourse;
    const nextPath = routeFor(p, nextCourse);
    if (window.location.pathname !== nextPath) window.history.pushState({ page: p }, "", nextPath);
    setPage(p);
    setMenu(false);
    scrollTo(0, 0);
  };
  const logoutAthlete = () => {
    closeProfileServerSession();
    const currentId = localStorage.getItem("volleyballCurrentAthleteId");
    localStorage.removeItem("volleyballCurrentAthleteId");
    if (currentId) {
      setAthleteLoggedOut(currentId, true);
      localStorage.setItem("volleyballAthletes", JSON.stringify(readAthletes().map((athlete) => athlete.id === currentId ? { ...athlete, online:false } : athlete)));
      sendAthletePresence(currentId, false);
    }
    setCurrentAthlete(null);
    setCurrentClub(null);
    setCurrentTrainer(null);
    localStorage.removeItem("volleyballCurrentClub");
    localStorage.removeItem("volleyballCurrentTrainerId");
    clearSessionActivity();
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
      <Header page={page} go={go} menu={menu} setMenu={setMenu} account={currentAthlete || currentTrainer || currentClub} isAuthenticated={Boolean(currentAthlete || currentTrainer || currentClub)} onLogout={logoutAthlete} />
      {onlineAthletes.length > 0 && <OnlineTeamStrip athletes={onlineAthletes} />}
      <main onClick={handleMainClick}>
        <React.Suspense fallback={<div className="page route-loading" role="status" aria-live="polite"><span/><p>İçerik hazırlanıyor…</p></div>}>
        {page === "home" ? (
          <HomePage go={go} isAuthenticated={Boolean(currentAthlete || currentTrainer || currentClub)} />
        ) : page === "courses" ? (
          <Courses go={go} />
        ) : page === "technical-cards" ? (
          <TechnicalCardsPage account={currentAthlete || currentTrainer || currentClub} />
        ) : page === "bulletins" ? (
          <BulletinsPage club={currentClub} go={go} />
        ) : page === "ready365-library" ? (
          <Ready365LibraryPage account={currentClub || currentTrainer} go={go} />
        ) : page === "course" ? (
          <CourseDetail course={selectedCourse} go={go} />
        ) : page === "lesson" ? (
          <LessonPage course={selectedCourse} go={go} />
        ) : page === "exams" ? (
          <ExamPage
            initialCourse={selectedCourse}
            account={currentAthlete
              ? { ...currentAthlete, accountType: "athlete" }
              : currentTrainer
                ? { ...currentTrainer, accountType: "trainer" }
                : currentClub
                  ? { ...currentClub, accountType: "club" }
                  : null}
          />
        ) : page === "junior-referee" ? (
          <JuniorRefereePage />
        ) : page === "blog" ? (
          <BlogPage />
        ) : page === "volleyball-ai" ? (
          <VolleyballAIPage courses={courses} go={go} />
        ) : page === "notebooklm-ai" ? (
          <NotebookLMWorkspacePage />
        ) : page === "chat" ? (
          <VolleyballChatPage account={currentAthlete
            ? { ...currentAthlete, accountType: "athlete" }
            : currentTrainer
              ? { ...currentTrainer, accountType: "trainer" }
              : currentClub
                ? { ...currentClub, accountType: "club" }
                : null} />
        ) : page === "admin" ? (
          <AdminPage />
        ) : page === "faq" ? (
          <FAQPage go={go} />
        ) : page === "privacy" ? (
          <PrivacyPage go={go} />
        ) : page === "coaches" ? (
          <CoachesPage />
        ) : page === "videos" ? (
          <TrainingVideosPage />
        ) : page === "register" ? (
          <RegistrationPage go={go} onAthleteOnline={(athlete) => { localStorage.removeItem("volleyballCurrentClub"); setCurrentClub(null); setCurrentTrainer(null); setCurrentAthlete(athlete); setOnlineAthletes((items) => dedupeActiveAthletes([...items.filter((x) => x.id !== athlete.id), athlete])); go("profiles"); }} onTrainerRegistered={(trainer) => { localStorage.removeItem("volleyballCurrentClub"); localStorage.removeItem("volleyballCurrentAthleteId"); setCurrentClub(null); setCurrentAthlete(null); setCurrentTrainer(trainer); go("profiles"); }} />
        ) : page === "registered-schools" ? (
          <RegisteredSchoolsPage go={go} />
        ) : page === "pricing" ? (
          <PricingPage />
        ) : page === "demo" ? (
          <DemoPage go={go} />
        ) : page === "profiles" ? (
          <ProfilesPage go={go} initialNotice={authNotice} onActivityChange={() => setOnlineAthletes(readActiveAthletes())} onSessionChange={(session) => { setAuthNotice(""); if (session?.type === "club") { setCurrentClub(session.school); setCurrentAthlete(null); setCurrentTrainer(null); } else if (session?.type === "trainer") { setCurrentTrainer(session.trainer); setCurrentAthlete(null); setCurrentClub(null); } else { setCurrentAthlete(session?.athlete || null); setCurrentTrainer(null); setCurrentClub(null); } }} />
        ) : (
          <InfoPage title={page} />
        )}
        </React.Suspense>
      </main>
      <MobileNav page={page} go={go} isAuthenticated={Boolean(currentAthlete || currentTrainer || currentClub)} isAthlete={Boolean(currentAthlete)} />
      <ContactMessenger />
      <Footer go={go} />
    </>
  );
}

const registrationApi = import.meta.env.VITE_REGISTRATION_API_URL || appConfig.registrationApiUrl || import.meta.env.VITE_SHEETS_API_URL || "";
const PROFILE_TOKEN_KEY = "volleyballProfileToken";
const ADMIN_CLIENT_KEY = "volleyballAdminClientId";
const getStableClientId = () => {
  let value = sessionStorage.getItem(ADMIN_CLIENT_KEY);
  if (!value) {
    value = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(ADMIN_CLIENT_KEY, value);
  }
  return value;
};
const profileChoices = [
  { id:"kadin-voleybolcu-1", name:"Topla hazır kadın voleybolcu", image:"/profile-volleyball-women.webp", x:"0%", y:"0%" },
  { id:"kadin-voleybolcu-2", name:"Savunmaya hazır kadın voleybolcu", image:"/profile-volleyball-women.webp", x:"50%", y:"0%" },
  { id:"kadin-voleybolcu-3", name:"Kadın pasör", image:"/profile-volleyball-women.webp", x:"100%", y:"0%" },
  { id:"kadin-voleybolcu-4", name:"Kadın libero", image:"/profile-volleyball-women.webp", x:"0%", y:"100%" },
  { id:"kadin-voleybolcu-5", name:"Manşet pozisyonunda kadın voleybolcu", image:"/profile-volleyball-women.webp", x:"50%", y:"100%" },
  { id:"kadin-voleybolcu-6", name:"Kadın takım kaptanı", image:"/profile-volleyball-women.webp", x:"100%", y:"100%" },
  { id:"erkek-voleybolcu-1", name:"Topla hazır erkek voleybolcu", image:"/profile-volleyball-men.webp", x:"0%", y:"0%" },
  { id:"erkek-voleybolcu-2", name:"Savunmaya hazır erkek voleybolcu", image:"/profile-volleyball-men.webp", x:"50%", y:"0%" },
  { id:"erkek-voleybolcu-3", name:"Erkek pasör", image:"/profile-volleyball-men.webp", x:"100%", y:"0%" },
  { id:"erkek-voleybolcu-4", name:"Erkek smaçör", image:"/profile-volleyball-men.webp", x:"0%", y:"100%" },
  { id:"erkek-voleybolcu-5", name:"Erkek libero", image:"/profile-volleyball-men.webp", x:"50%", y:"100%" },
  { id:"erkek-voleybolcu-6", name:"Erkek takım kaptanı", image:"/profile-volleyball-men.webp", x:"100%", y:"100%" },
];
const profileById = (id) => profileChoices.find((item) => item.id === id) || profileChoices[0];
function AthleteAvatar({ id, className="" }) { const item=profileById(id); return <i className={`athlete-avatar ${className}`} style={{"--avatar-image":`url(${item.image})`,"--avatar-x":item.x,"--avatar-y":item.y}} role="img" aria-label={item.name} />; }
const trainerProfileChoices = [
  { id:"kadin-antrenor-1", name:"Topla kadın voleybol antrenörü", image:"/profile-volleyball-coaches-women.png", x:"0%", y:"0%" },
  { id:"kadin-antrenor-2", name:"Kadın takım antrenörü", image:"/profile-volleyball-coaches-women.png", x:"50%", y:"0%" },
  { id:"kadin-antrenor-3", name:"Taktik anlatan kadın voleybol antrenörü", image:"/profile-volleyball-coaches-women.png", x:"100%", y:"0%" },
  { id:"kadin-antrenor-4", name:"Düdüklü kadın voleybol antrenörü", image:"/profile-volleyball-coaches-women.png", x:"0%", y:"100%" },
  { id:"kadin-antrenor-5", name:"Taktik panolu kadın voleybol antrenörü", image:"/profile-volleyball-coaches-women.png", x:"50%", y:"100%" },
  { id:"kadin-antrenor-6", name:"Kıdemli kadın voleybol antrenörü", image:"/profile-volleyball-coaches-women.png", x:"100%", y:"100%" },
  { id:"erkek-antrenor-1", name:"Erkek takım antrenörü", image:"/profile-volleyball-coaches-men.png", x:"0%", y:"0%" },
  { id:"erkek-antrenor-2", name:"Taktik panolu erkek voleybol antrenörü", image:"/profile-volleyball-coaches-men.png", x:"50%", y:"0%" },
  { id:"erkek-antrenor-3", name:"Topla taktik anlatan erkek voleybol antrenörü", image:"/profile-volleyball-coaches-men.png", x:"100%", y:"0%" },
  { id:"erkek-antrenor-4", name:"Erkek voleybol antrenörü", image:"/profile-volleyball-coaches-men.png", x:"0%", y:"100%" },
  { id:"erkek-antrenor-5", name:"Kıdemli erkek voleybol antrenörü", image:"/profile-volleyball-coaches-men.png", x:"50%", y:"100%" },
  { id:"erkek-antrenor-6", name:"Toplu erkek voleybol antrenörü", image:"/profile-volleyball-coaches-men.png", x:"100%", y:"100%" },
];
const trainerProfileById = (id) => trainerProfileChoices.find((item) => item.id === id) || trainerProfileChoices[0];
function TrainerAvatar({ id, className="" }) { const item=trainerProfileById(id); return <i className={`athlete-avatar trainer-avatar ${className}`} style={{"--avatar-image":`url(${item.image})`,"--avatar-x":item.x,"--avatar-y":item.y}} role="img" aria-label={item.name} />; }
function ProfileAvatar({ id, className="" }) { return trainerProfileChoices.some((item)=>item.id===id) ? <TrainerAvatar id={id} className={className}/> : <AthleteAvatar id={id} className={className}/>; }
function googleDriveImageId(source="") {
  const value=String(source).trim();
  return value.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i)?.[1]
    || value.match(/drive\.google\.com\/(?:open|uc|thumbnail)[^#]*[?&]id=([^&#]+)/i)?.[1]
    || value.match(/lh\d*\.googleusercontent\.com\/d\/([^=/?#]+)/i)?.[1]
    || "";
}
function publicLogoUrl(source="") {
  const value=String(source).trim(), driveId=googleDriveImageId(value);
  return driveId ? `https://lh3.googleusercontent.com/d/${driveId}=w1000` : value;
}
function TeamLogo({ src, name, className="" }) {
  const driveId=googleDriveImageId(src);
  const sources=driveId ? [`https://lh3.googleusercontent.com/d/${driveId}=w1000`,`https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`] : [String(src||"").trim()];
  const [sourceIndex,setSourceIndex]=useState(0);
  useEffect(()=>setSourceIndex(0),[src]);
  if (!src) return null;
  return <img className={`team-logo ${className}`} src={sources[Math.min(sourceIndex,sources.length-1)]} alt={`${name || "Takım"} logosu`} loading="lazy" referrerPolicy="no-referrer" onError={(event) => { if(sourceIndex<sources.length-1)setSourceIndex(sourceIndex+1);else event.currentTarget.hidden=true; }} />;
}

const transparentLogoCache = new Map();
function transparentLogoFallback(name="Spor Okulu") {
  const canvas = document.createElement("canvas");
  canvas.width = 180; canvas.height = 180;
  const context = canvas.getContext("2d");
  const initials = name.split(/\s+/).filter(Boolean).slice(0,3).map((word)=>word[0]).join("").toLocaleUpperCase("tr");
  context.fillStyle = "#b9c4ce";
  context.font = "800 52px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(initials || "VO", 90, 92);
  return canvas.toDataURL("image/png");
}
function TransparentTeamLogo({ src, name }) {
  const [pngSrc, setPngSrc] = useState(() => transparentLogoCache.get(src) || src);
  useEffect(() => {
    if (!src || transparentLogoCache.has(src)) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const size = 180;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d", { willReadFrequently:true });
        context.clearRect(0, 0, size, size);
        const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const offsetX = Math.round((size - width) / 2);
        const offsetY = Math.round((size - height) / 2);
        context.drawImage(image, offsetX, offsetY, width, height);
        const pixels = context.getImageData(0, 0, size, size);
        const data = pixels.data;
        const border = [];
        const right = offsetX + width - 1;
        const bottom = offsetY + height - 1;
        const corners = [offsetY * size + offsetX, offsetY * size + right, bottom * size + offsetX, bottom * size + right];
        const hasTransparency = corners.filter((index) => data[index * 4 + 3] < 40).length >= 3;
        for (let x = offsetX; x <= right; x += 1) border.push(offsetY * size + x, bottom * size + x);
        for (let y = offsetY + 1; y < bottom; y += 1) border.push(y * size + offsetX, y * size + right);
        const buckets = new Map();
        border.forEach((index) => {
          if (hasTransparency) return;
          const point = index * 4;
          if (data[point + 3] < 20) return;
          const key = `${data[point] >> 4}-${data[point + 1] >> 4}-${data[point + 2] >> 4}`;
          const item = buckets.get(key) || { count:0, r:0, g:0, b:0 };
          item.count += 1; item.r += data[point]; item.g += data[point + 1]; item.b += data[point + 2];
          buckets.set(key, item);
        });
        const background = [...buckets.values()].sort((a,b) => b.count - a.count)[0];
        if (background) {
          const base = [background.r / background.count, background.g / background.count, background.b / background.count];
          const visited = new Uint8Array(size * size);
          const queue = [...border];
          let cursor = 0;
          while (cursor < queue.length) {
            const index = queue[cursor++];
            if (visited[index]) continue;
            visited[index] = 1;
            const point = index * 4;
            const distance = Math.hypot(data[point] - base[0], data[point + 1] - base[1], data[point + 2] - base[2]);
            if (distance > 72) continue;
            const matte = Math.max(0, Math.min(1, (distance - 18) / 54));
            data[point + 3] = Math.round(data[point + 3] * matte);
            const x = index % size;
            const y = Math.floor(index / size);
            if (x > 0) queue.push(index - 1);
            if (x < size - 1) queue.push(index + 1);
            if (y > 0) queue.push(index - size);
            if (y < size - 1) queue.push(index + size);
          }
          context.putImageData(pixels, 0, 0);
        }
        const transparentPng = canvas.toDataURL("image/png");
        transparentLogoCache.set(src, transparentPng);
        if (!cancelled) setPngSrc(transparentPng);
      } catch {
        if (!cancelled) setPngSrc(src);
      }
    };
    image.onerror = () => { if (!cancelled) setPngSrc(transparentLogoFallback(name)); };
    image.src = src;
    return () => { cancelled = true; };
  }, [src]);
  return <TeamLogo key={pngSrc} src={pngSrc} name={name} className="transparent-team-logo"/>;
}

function SearchableSchoolPicker({ value, onChange, options, logoFor, label="Kulüp adı", placeholder="Okul adını yazın veya listeden seçin" }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useRef(`school-picker-${Math.random().toString(36).slice(2)}`).current;
  const normalized = String(value || "").trim().toLocaleLowerCase("tr");
  const filtered = options.filter((school) => !normalized || school.toLocaleLowerCase("tr").includes(normalized));
  useEffect(()=>setActiveIndex(-1),[normalized]);
  const chooseSchool = (school) => { onChange(school); setOpen(false); setActiveIndex(-1); };
  const handleKeyDown = (event) => {
    if (event.key === "Escape") { setOpen(false); setActiveIndex(-1); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); setOpen(true);
      setActiveIndex((current) => event.key === "ArrowDown" ? Math.min(current + 1, filtered.length - 1) : Math.max(current - 1, 0));
    }
    if (event.key === "Enter" && open && activeIndex >= 0 && filtered[activeIndex]) {
      event.preventDefault(); chooseSchool(filtered[activeIndex]);
    }
  };
  return <label className="club-picker-label">{label}<div className={`club-picker searchable ${open ? "open" : ""}`} onBlur={(event)=>{if(!event.currentTarget.contains(event.relatedTarget))setOpen(false)}}>
    <div className="club-picker-input">
      <span className="club-option-logo">{logoFor(value) ? <TeamLogo src={logoFor(value)} name={value}/> : <School/>}</span>
      <input name="schoolName" value={value} required autoComplete="off" placeholder={placeholder} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeIndex>=0?`${listId}-option-${activeIndex}`:undefined} onKeyDown={handleKeyDown} onFocus={()=>setOpen(true)} onChange={(event)=>{onChange(event.target.value);setOpen(true)}}/>
      <button type="button" aria-label={open ? "Okul listesini kapat" : "Tüm okulları göster"} onClick={()=>setOpen((current)=>!current)}><ChevronDown/></button>
    </div>
    {open&&<div id={listId} className="club-picker-menu" role="listbox" aria-label="Kayıtlı spor okulları">
      {filtered.length ? filtered.map((school,index)=><button id={`${listId}-option-${index}`} type="button" role="option" aria-selected={value===school} className={`${value===school?"selected":""} ${activeIndex===index?"keyboard-active":""}`} key={school} onMouseEnter={()=>setActiveIndex(index)} onClick={()=>chooseSchool(school)}><span className="club-option-logo">{logoFor(school)?<TeamLogo src={logoFor(school)} name={school}/>:<School/>}</span><span><b>{school}</b><small>{logoFor(school)?"Kulüp logosu mevcut":"Kayıtlı spor okulu"}</small></span>{value===school&&<CheckCircle2/>}</button>) : <div className="club-picker-no-result">Eşleşen okul bulunamadı. Okul adını elle yazmaya devam edebilirsiniz.</div>}
    </div>}
  </div></label>;
}
async function sendRegistration(payload) {
  if (!registrationApi) throw new Error("Kayıt servisi yapılandırılmamış. İşlem kaydedilmedi.");
  const response = await fetch(registrationApi, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error("Kayıt servisine ulaşılamadı.");
  const result = await response.json();
  if (result?.ok === false) throw new Error(result.error || "Kayıt işlemi tamamlanamadı.");
  return result;
}
function closeProfileServerSession() {
  const token = sessionStorage.getItem(PROFILE_TOKEN_KEY);
  sessionStorage.removeItem(PROFILE_TOKEN_KEY);
  if (token && registrationApi) sendRegistration({ action:"logoutProfile", token }).catch(() => {});
}

function OnlineTeamStrip({ athletes }) {
  return <section className="online-team" aria-label="Derste olan sporcular">
    <div className="online-athletes">{athletes.slice(0, 8).map((athlete) => <div className="online-athlete-chip" key={athlete.id} title={athlete.name}><span className="online-avatar-wrap"><AthleteAvatar id={athlete.avatar}/><TeamLogo src={athlete.teamLogo} name={athlete.schoolName} className="team-logo-mini"/></span><span className="online-athlete-copy"><b><i className="online-state" aria-label="Çevrim içi" />{athlete.name.split(" ")[0]}</b></span></div>)}</div>
  </section>;
}
async function sendAthletePresence(id, online) {
  if (!registrationApi || !id) return;
  const token = sessionStorage.getItem(PROFILE_TOKEN_KEY);
  if (!token && import.meta.env.PROD) return;
  try { await sendRegistration({ action:"updateAthletePresence", id, online, token, lastSeen:new Date().toISOString() }); }
  catch (error) { console.warn("Sporcu çevrim içi durumu güncellenemedi:", error); }
}
function sendAthletePresenceBeacon(id, online) {
  if (!registrationApi || !id) return;
  const token = sessionStorage.getItem(PROFILE_TOKEN_KEY);
  if (!token && import.meta.env.PROD) return;
  const body = JSON.stringify({ action:"updateAthletePresence", id, online, token, lastSeen:new Date().toISOString() });
  const payload = new Blob([body], { type:"text/plain;charset=UTF-8" });
  if (navigator.sendBeacon?.(registrationApi, payload)) return;
  fetch(registrationApi, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body, keepalive:true }).catch(() => {});
}

function RegistrationPage({ go, onAthleteOnline, onTrainerRegistered }) {
  const [type, setType] = useState("school");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [avatar, setAvatar] = useState(profileChoices[0].id);
  const [athleteSchool, setAthleteSchool] = useState("");
  const [athleteTeamId, setAthleteTeamId] = useState("");
  const [trainerAvatar, setTrainerAvatar] = useState(trainerProfileChoices[0].id);
  const [trainerSchool, setTrainerSchool] = useState("");
  const [teams, setTeams] = useState(() => readTeams());
  useEffect(() => {
    if (!registrationApi) return;
    let disposed = false;
    fetchRegistrationSheet("Takimlar").then((rows) => {
      if (!disposed) setTeams(syncTeamStorage(rows));
    }).catch(() => { /* Takım sekmesi yayımlanana kadar mevcut listeyi koru. */ });
    return () => { disposed = true; };
  }, []);
  const approvedSchools = readSchools()
    .filter((school) => String(school.status || "").trim().toLocaleUpperCase("tr") === "ONAYLANDI")
    .sort((a, b) => String(a.schoolName).localeCompare(String(b.schoolName), "tr"));
  const registrationSchoolLogo = (schoolName) => {
    const key = String(schoolName || "").trim().toLocaleLowerCase("tr");
    return readSchools().find((school) => String(school.schoolName || "").trim().toLocaleLowerCase("tr") === key && school.teamLogo)?.teamLogo
      || readAthletes().find((athlete) => String(athlete.schoolName || "").trim().toLocaleLowerCase("tr") === key && athlete.teamLogo)?.teamLogo
      || "";
  };
  const athleteSchoolRecord = approvedSchools.find((school) => String(school.schoolName).toLocaleLowerCase("tr") === athleteSchool.toLocaleLowerCase("tr"));
  const athleteTeams = teamsForSchool(teams, athleteSchoolRecord || athleteSchool);
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
    const athlete = { action:"registerAthlete", id:`SPR-${Date.now()}`, schoolName:String(data.get("schoolName")).trim(), teamId:String(data.get("teamId")||"").trim(), teamCode:String(data.get("teamCode")||"").trim(), name:String(data.get("athleteName")).trim(), avatar, avatarName:selectedProfile.name };
    if (!athlete.schoolName) { setNotice("Kayıtlı spor okulunu seçin."); setBusy(false); return; }
    if (!athlete.teamId) { setNotice("Kayıt olacağınız takımı seçin."); setBusy(false); return; }
    if (!/^\d{6}$/.test(athlete.teamCode)) { setNotice("Takım kodu 6 haneli olmalıdır."); setBusy(false); return; }
    if (!/^@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}$/.test(athlete.name)) { setNotice("Sporcu adı @ ile başlamalı; boşluk içermemeli ve en az 2 karakter olmalıdır."); setBusy(false); return; }
    const normalizedName = athlete.name.toLocaleLowerCase("tr");
    if (readAthletes().some((item) => String(item.name || "").trim().toLocaleLowerCase("tr") === normalizedName)) { setNotice("Bu sporcu adı alınmış. Lütfen başka bir ad seçin."); setBusy(false); return; }
    try {
      const result = await sendRegistration(athlete);
      if (result.ok === false) throw new Error(result.error || "Okul bilgileri doğrulanamadı.");
      const inheritedTeamLogo = readSchools().find((item) => item.schoolName.toLocaleLowerCase("tr") === athlete.schoolName.toLocaleLowerCase("tr") && item.teamLogo)?.teamLogo
        || readAthletes().find((item) => item.schoolName.toLocaleLowerCase("tr") === athlete.schoolName.toLocaleLowerCase("tr") && item.teamLogo)?.teamLogo
        || "";
      const selectedTeam = athleteTeams.find((team)=>team.id===athlete.teamId);
      const savedAthlete = { ...athlete, ...result.account, id: result.id || athlete.id, teamName:result.teamName||selectedTeam?.name||"", schoolCode:athlete.teamCode, teamLogo: result.teamLogo || inheritedTeamLogo, online:true, lastSeen:new Date().toISOString() };
      if (result.profileToken) sessionStorage.setItem(PROFILE_TOKEN_KEY, result.profileToken);
      const athletes = [...readAthletes().filter((item) => item.id !== savedAthlete.id), savedAthlete];
      localStorage.setItem("volleyballAthletes", JSON.stringify(athletes));
      localStorage.setItem("volleyballCurrentAthleteId", savedAthlete.id);
      markSessionActivity();
      setAthleteLoggedOut(savedAthlete.id, false);
      sendAthletePresence(savedAthlete.id, true);
      onAthleteOnline(savedAthlete);
      setNotice("Sporcu profili oluşturuldu ve derste olanlar alanına eklendi."); form.reset();
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  };
  const submitTrainer = async (event) => {
    event.preventDefault(); setBusy(true); setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedProfile = trainerProfileById(trainerAvatar);
    const trainerCode = String(data.get("trainerCode") || "").trim();
    const trainer = { action:"registerTrainer", id:`ANT-${Date.now()}`, schoolName:String(data.get("schoolName") || "").trim(), trainerCode, name:String(data.get("trainerName") || "").trim(), title:String(data.get("trainerTitle") || "Voleybol Antrenörü").trim(), avatar:trainerAvatar, avatarName:selectedProfile.name };
    if (!trainer.schoolName) { setNotice("Kayıtlı spor okulunu seçin."); setBusy(false); return; }
    if (!/^\d{6}$/.test(trainerCode)) { setNotice("Antrenör kayıt kodu 6 haneli olmalıdır."); setBusy(false); return; }
    if (!/^@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}$/.test(trainer.name)) { setNotice("Antrenör adı @ ile başlamalı ve boşluk içermemelidir."); setBusy(false); return; }
    if (trainer.title.length < 3) { setNotice("Antrenör görevini yazın."); setBusy(false); return; }
    const duplicate = readTrainers().some((item) => String(item.schoolName || "").trim().toLocaleLowerCase("tr") === trainer.schoolName.toLocaleLowerCase("tr") && String(item.name || "").trim().toLocaleLowerCase("tr") === trainer.name.toLocaleLowerCase("tr"));
    if (duplicate) { setNotice("Bu antrenör adı seçilen okulda zaten kayıtlı."); setBusy(false); return; }
    try {
      const result = await sendRegistration(trainer);
      if (result.ok === false) throw new Error(result.error || "Okul bilgileri doğrulanamadı.");
      const inheritedTeamLogo = readSchools().find((item) => item.schoolName.toLocaleLowerCase("tr") === trainer.schoolName.toLocaleLowerCase("tr") && item.teamLogo)?.teamLogo || "";
      const memberships = Array.isArray(result.account?.teams) ? result.account.teams : [];
      const savedTrainer = { ...trainer, ...result.account, id:result.id || trainer.id, teamId:memberships[0]?.id||"", teamName:memberships[0]?.name||"", teamCode:result.trainerCode||trainerCode, trainerCode:result.trainerCode||trainerCode, teamIds:memberships.map((team)=>team.id), teamNames:memberships.map((team)=>team.name), teamCodes:[], teams:memberships, schoolCode:result.trainerCode||trainerCode, teamLogo:result.teamLogo || inheritedTeamLogo, status:"AKTİF", createdAt:new Date().toISOString() };
      if (result.profileToken) {
        sessionStorage.setItem(PROFILE_TOKEN_KEY, result.profileToken);
        sendRegistration({ action:"syncSchoolRoster", token:result.profileToken }).catch(() => {});
      }
      localStorage.setItem("volleyballTrainers", JSON.stringify([...readTrainers().filter((item)=>item.id!==savedTrainer.id), savedTrainer]));
      localStorage.setItem("volleyballCurrentTrainerId", savedTrainer.id);
      localStorage.removeItem("volleyballCurrentAthleteId");
      localStorage.removeItem("volleyballCurrentClub");
      markSessionActivity();
      onTrainerRegistered(savedTrainer);
      setNotice("Antrenör profili oluşturuldu. Takım ataması kulüp yöneticisi tarafından yapılacaktır.");
      form.reset();
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  };
  return <div className="page registration-page">
    <div className="registration-intro"><span className="eyebrow"><ShieldCheck size={15}/> GÜVENLİ KAYIT</span><h1>Takımını akademiye taşı.</h1><p>Okul onaylandıktan sonra kulüp yöneticisi takımlarını oluşturur. Sporcular takım koduyla, antrenörler ise kulübün ayrı antrenör koduyla kayıt olur.</p><nav className="registration-local-nav" aria-label="Kayıt sayfası menüsü"><button type="button" onClick={()=>go("registered-schools")}><span><School/><b>Kayıtlı Okullar</b><small>Akademimizdeki spor okullarını incele</small></span><ArrowRight/></button></nav></div>
    <section className="registration-card">
      <div className="registration-tabs"><button className={type==="school"?"active":""} onClick={()=>{setType("school");setNotice("")}}><School/> Okul kaydı</button><button className={type==="athlete"?"active":""} onClick={()=>{setType("athlete");setNotice("")}}><UserPlus/> Sporcu kaydı</button><button className={type==="trainer"?"active":""} onClick={()=>{setType("trainer");setNotice("")}}><GraduationCap/> Antrenör kaydı</button></div>
      {type === "school" ? <form onSubmit={submitSchool} className="registration-form"><div className="form-heading"><School/><span><b>Okul başvurusu</b><small>Başvurunuz yönetici onayından sonra etkinleştirilir.</small></span></div><label>Okul adı<input name="schoolName" required minLength="3" placeholder="Örn. İzmir Gençlik Voleybol Okulu" /></label><label>WhatsApp telefon numarası<input name="phone" required inputMode="tel" placeholder="05XX XXX XX XX" /></label><button className="btn" disabled={busy}>{busy?"Kaydediliyor…":"Başvuruyu gönder"}<ArrowRight/></button></form>
      : type === "athlete" ? <form onSubmit={submitAthlete} className="registration-form"><div className="form-heading"><UserPlus/><span><b>Sporcu profili</b><small>Kulübünüzü ve takımınızı seçip takım koduyla kayıt olun.</small></span></div><SearchableSchoolPicker value={athleteSchool} onChange={(school)=>{setAthleteSchool(school);setAthleteTeamId("");setNotice("")}} options={approvedSchools.map((school)=>school.schoolName)} logoFor={registrationSchoolLogo} label="Spor okulu"/><div className="form-grid athlete-school-grid"><label>Takım<select name="teamId" required value={athleteTeamId} onChange={(event)=>setAthleteTeamId(event.target.value)} disabled={!athleteSchool}><option value="">{athleteSchool?(athleteTeams.length?"Takımınızı seçin":"Bu kulüp henüz takım oluşturmadı"):"Önce spor okulunu seçin"}</option>{athleteTeams.map((team)=><option key={team.id} value={team.id}>{team.name}</option>)}</select></label><label>6 haneli takım kodu<input name="teamCode" required inputMode="numeric" maxLength="6" pattern="[0-9]{6}" placeholder="000000" /></label></div><label>Sporcu adı<input name="athleteName" required defaultValue="@" minLength="3" maxLength="31" pattern="@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}" autoCapitalize="none" spellCheck="false" aria-describedby="athlete-name-help"/><small id="athlete-name-help" className="field-help">Örnek: @eda10 — boşluk kullanmayın.</small></label><fieldset><legend>Voleybolcu profilini seç</legend><small className="avatar-help">6 kadın ve 6 erkek voleybolcu profili</small><div className="avatar-choices">{profileChoices.map((choice)=><button type="button" key={choice.id} className={avatar===choice.id?"active":""} onClick={()=>setAvatar(choice.id)} aria-label={`${choice.name} profilini seç`} title={choice.name}><AthleteAvatar id={choice.id}/></button>)}</div></fieldset><button className="btn" disabled={busy||approvedSchools.length===0||!athleteSchool||!athleteTeamId}>{busy?"Profil oluşturuluyor…":"Sporcu profilini oluştur"}<ArrowRight/></button></form>
      : <form onSubmit={submitTrainer} className="registration-form"><div className="form-heading"><GraduationCap/><span><b>Antrenör profili</b><small>Kulübünüzü seçip antrenör koduyla kayıt olun. Takım atamasını kulüp yöneticisi yapar.</small></span></div><SearchableSchoolPicker value={trainerSchool} onChange={(school)=>{setTrainerSchool(school);setNotice("")}} options={approvedSchools.map((school)=>school.schoolName)} logoFor={registrationSchoolLogo} label="Spor okulu"/><div className="trainer-assignment-info"><ShieldCheck/><span><b>Takım seçimi kulüp yöneticisine aittir</b><small>Kayıt tamamlandıktan sonra kulübünüz sizi bir veya daha fazla takıma atayabilir.</small></span></div><label>6 haneli antrenör kayıt kodu<input name="trainerCode" required inputMode="numeric" maxLength="6" pattern="[0-9]{6}" placeholder="000000"/><small className="field-help">Bu kod kulüp giriş kodundan ve sporcu takım kodlarından ayrıdır. Kulüp yöneticinizden alın.</small></label><div className="form-grid"><label>Antrenör kullanıcı adı<input name="trainerName" required defaultValue="@" minLength="3" maxLength="31" pattern="@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}" autoCapitalize="none" spellCheck="false"/><small className="field-help">Örnek: @antrenorayse</small></label><label>Görev<input name="trainerTitle" required minLength="3" maxLength="60" defaultValue="Voleybol Antrenörü"/></label></div><fieldset><legend>Antrenör profilini seç</legend><small className="avatar-help">6 kadın ve 6 erkek çizim antrenör profili</small><div className="avatar-choices">{trainerProfileChoices.map((choice)=><button type="button" key={choice.id} className={trainerAvatar===choice.id?"active":""} onClick={()=>setTrainerAvatar(choice.id)} aria-label={`${choice.name} profilini seç`} title={choice.name}><TrainerAvatar id={choice.id}/></button>)}</div></fieldset><button className="btn" disabled={busy||approvedSchools.length===0||!trainerSchool}>{busy?"Profil oluşturuluyor…":"Antrenör profilini oluştur"}<ArrowRight/></button></form>}
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
  const sampleCourse = courses[0];
  const sampleLesson = makeLessonSteps(sampleCourse)[0];
  const sampleVideo = trainingVideos[0];
  const sampleQuestion = questionsFor(sampleCourse[1])[0];
  const isCorrect = answer === sampleQuestion.a;
  const demoTabs = [
    ["lesson", BookOpen, "Dersler"],
    ["video", Video, "Eğitim Videoları"],
    ["exam", CheckCircle2, "Sınavlar"],
  ];
  return <div className="demo-page">
    <section className="demo-hero">
      <span className="eyebrow"><Play/> ÜCRETSİZ AKADEMİ DEMOSU</span>
      <h1>Akademiyi<br/><em>yakından incele.</em></h1>
      <p>Gerçek kullanıcı ekranlarını deneyin. Her bölümde yalnızca ilk çalışma ücretsiz olarak açıktır.</p>
    </section>
    <nav className="demo-tabs" aria-label="Demo bölümleri">
      {demoTabs.map(([key, Icon, label])=><button key={key} className={section===key?"active":""} onClick={()=>{setSection(key);setAnswer(null)}}><Icon/><span>{label}</span></button>)}
    </nav>
    <div className="demo-access-bar">
      <span><UserRound/><i><small>GERÇEK KULLANICI GÖRÜNÜMÜ</small><b>İlk çalışma ücretsiz açık</b></i></span>
      <em><LockKeyhole/> Devam içerikleri gizli</em>
    </div>
    <section className="demo-stage">
      {section === "lesson" && <article className="demo-lesson">
        <div className="demo-media"><img src={sampleCourse[10]} alt={`${sampleCourse[1]} ders kapağı`}/><span>1. ÇALIŞMA AÇIK</span></div>
        <div className="demo-content"><small>DERS 01 • {sampleCourse[1].toLocaleUpperCase("tr-TR")}</small><h2>{sampleLesson.title}</h2><p>{sampleLesson.body}</p><div className="demo-locked-continuation"><LockKeyhole/><span><b>Sonraki çalışmalar gizli</b><small>Devam etmek için kayıtlı hesabınızla giriş yapın.</small></span></div></div>
      </article>}
      {section === "video" && <article className="demo-video">
        <div className="demo-video-frame"><iframe src={sampleVideo.preview} title={`Demo video: ${sampleVideo.title}`} allow="autoplay; fullscreen" allowFullScreen/></div>
        <div className="demo-video-info"><span><Video/> 1. VİDEO AÇIK</span><h2>{sampleVideo.title}</h2><p>{sampleVideo.topic} kategorisindeki bu çalışmayı gerçek kullanıcı oynatıcısıyla izleyebilirsiniz.</p><div className="demo-locked-continuation"><LockKeyhole/><span><b>Diğer videolar gizli</b><small>Oynatma listesinin devamı yalnızca kayıtlı kullanıcılara açıktır.</small></span></div></div>
      </article>}
      {section === "exam" && <article className="demo-exam">
        <span><Target/> 1. SINAV ÇALIŞMASI AÇIK</span><h2>{sampleQuestion.q}</h2>
        <div className="demo-options">{sampleQuestion.o.map((option,index)=><button key={option} className={answer===index?(index===sampleQuestion.a?"correct":"wrong"):""} onClick={()=>setAnswer(index)}><i>{String.fromCharCode(65+index)}</i>{option}{answer===index&&(index===sampleQuestion.a?<CheckCircle2/>:<X/>)}</button>)}</div>
        {answer!==null&&<div className={`demo-answer ${isCorrect?"correct":"wrong"}`}>{isCorrect?<><CheckCircle2/><span><b>Doğru cevap!</b><p>{sampleQuestion.e}</p></span></>:<><X/><span><b>Tekrar düşün.</b><p>{sampleQuestion.e}</p></span></>}</div>}
        <div className="demo-locked-continuation"><LockKeyhole/><span><b>Sonraki sorular gizli</b><small>Sınavın devamı kayıtlı kullanıcı hesabında açılır.</small></span></div>
      </article>}
    </section>
    <section className="demo-cta"><span><small>DEVAM ETMEYE HAZIR MISIN?</small><h2>Tüm akademinin kilidini aç.</h2></span><button className="btn" onClick={()=>go("register")}>Spor okulunu kaydet <ArrowRight/></button></section>
  </div>;
}

const blogCategories = ["Tümü", "Eğitim", "Teknik", "Taktik", "Pozisyonlar", "Atletik Performans", "Sağlık", "Beslenme", "Mental Gelişim", "Spor Okulları", "Rehber", "Plaj Voleybolu"];
const blogPosts = [
  { id:"servis-karsilama", category:"Teknik", title:"Servis karşılamada platform açısını nasıl kontrol edersin?", excerpt:"Manşet platformu, ayak yerleşimi ve hedef çizgisini bir araya getiren uygulamalı bir teknik rehber.", date:"28 Temmuz 2026", read:"8 dk", image:"/blog/servis-karsilama.webp", keywords:["servis karşılama", "manşet tekniği", "platform açısı"], body:"Servis karşılamanın temeli topa yalnız kollarla uzanmak değil, erken okuyup dengeli bir platform oluşturmaktır. Omuzlar hedefe yönelirken dirsekler kilitlenmeden uzatılır; temas iki ön kolun düz yüzeyinde gerçekleşir." },
  { id:"voleybolda-video-ile-oz-degerlendirme", category:"Eğitim", title:"Voleybolda video ile teknik öz değerlendirme nasıl yapılır?", excerpt:"Antrenman görüntülerini doğru açıdan kaydet, hareketi ölçütlerle incele ve bir sonraki çalışmaya uygulanabilir hedef çıkar.", date:"15 Ağustos 2026", read:"12 dk", image:"/blog/hucum-temposu.webp", keywords:["voleybol video analizi", "teknik öz değerlendirme", "voleybol öğrenme yöntemi"], body:"Video, sporcunun hareket sırasında hissedemediği zamanlama ve konum ayrıntılarını görünür hâle getirir. Ancak gelişim, yalnızca görüntüyü tekrar izlemekle değil; önceden belirlenmiş teknik ölçütleri kullanmak, tek bir öncelik seçmek ve yeni uygulamayı yeniden kaydetmekle sağlanır." },
  { id:"voleybol-antrenman-gunlugu", category:"Eğitim", title:"Voleybol antrenman günlüğüyle gelişimini nasıl takip edersin?", excerpt:"Hedef, antrenman yükü, teknik gözlem ve toparlanma notlarını sade bir haftalık sistemde birleştir.", date:"12 Ağustos 2026", read:"11 dk", image:"/blog/baski-altinda-odak.webp", featured:true, keywords:["voleybol antrenman günlüğü", "sporcu gelişim takibi", "voleybol antrenman planı"], body:"Antrenman günlüğü yalnızca kaç dakika çalışıldığını yazdığın bir defter değildir. Sporcuya neyi amaçladığını, çalışmada ne olduğunu, vücudunun nasıl tepki verdiğini ve sonraki antrenmanda neyi değiştireceğini gösteren düzenli bir öğrenme aracıdır." },
  { id:"hucum-temposu", category:"Taktik", title:"Hücum temposu: Pasör ile hücumcu arasındaki zamanlama", excerpt:"Birinci, ikinci ve yüksek top temposunda yaklaşma başlangıcını doğru planla.", date:"25 Temmuz 2026", read:"9 dk", image:"/blog/hucum-temposu.webp", keywords:["voleybol hücum temposu", "pasör zamanlaması", "smaç yaklaşması"], body:"Etkili hücum organizasyonu pasörün topa temas anı ile hücumcunun yaklaşma ritmini eşleştirir. Hücumcu karşılama kalitesini okuyarak rotasını ayarlar; pasör ise blok yerleşimine göre hız ve yüksekliği seçer." },
  { id:"libero-alan-savunmasi", category:"Pozisyonlar", title:"Liberonun alan savunmasında doğru başlangıç konumu", excerpt:"Blok yönüne göre açı kapatma, hücumcuyu okuma ve ikinci top sorumluluğu.", date:"22 Temmuz 2026", read:"8 dk", image:"/blog/libero-alan-savunmasi.webp", keywords:["libero eğitimi", "alan savunması", "voleybol savunma pozisyonu"], body:"Libero sabit bir noktayı değil, blok ve hücum yönünün oluşturduğu olası top koridorunu savunur. Hazır pozisyonda ağırlık ayakların ön bölümündedir." },
  { id:"sicrama-yuku", category:"Atletik Performans", title:"Sıçrama antrenmanında kaliteyi koruyan yük planlaması", excerpt:"Tekrar sayısından önce iniş kalitesini ve patlayıcı kuvvet üretimini takip et.", date:"19 Temmuz 2026", read:"10 dk", image:"/blog/sicrama-yuku.webp", keywords:["voleybol sıçrama antrenmanı", "pliometrik çalışma", "güvenli iniş"], body:"Pliometrik çalışmalarda amaç yalnız çok sıçramak değil, her tekrarda hızlı kuvvet üretirken güvenli inişi korumaktır. Diz-kalça-ayak hizası ve tekrar kalitesi yük planının merkezindedir." },
  { id:"omuz-koruma", category:"Sağlık", title:"Voleybolcularda omuz sağlığını koruyan temel alışkanlıklar", excerpt:"Servis ve smaç yükünü dengeleyen hareketlilik, kuvvet ve toparlanma ilkeleri.", date:"16 Temmuz 2026", read:"9 dk", image:"/blog/omuz-koruma.webp", keywords:["voleybol omuz sağlığı", "smaç sakatlığı önleme", "rotator manşet"], body:"Omuz sağlığı yalnız rotator manşet egzersizleriyle korunmaz. Göğüs omurgası hareketliliği, kürek kemiği kontrolü ve toplam vuruş yükü birlikte değerlendirilir." },
  { id:"mac-gunu-beslenme", category:"Beslenme", title:"Maç günü enerji ve sıvı planı nasıl hazırlanır?", excerpt:"Maç öncesi öğünden set aralarındaki sıvı alımına kadar uygulanabilir öneriler.", date:"13 Temmuz 2026", read:"8 dk", image:"/blog/mac-gunu-beslenme.webp", keywords:["voleybolcu beslenmesi", "maç öncesi beslenme", "sporcu sıvı planı"], body:"Maç günü planı ilk kez maç sabahı denenmemelidir. Sporcunun alışık olduğu, sindirimi kolay karbonhidrat kaynakları seçilir; protein ve sıvı planı maç saatine göre düzenlenir." },
  { id:"baski-altinda-odak", category:"Mental Gelişim", title:"Baskı altında bir sonraki sayıya odaklanmak", excerpt:"Hata sonrası kısa rutinlerle dikkati geçmiş sayıdan yeni göreve taşı.", date:"10 Temmuz 2026", read:"7 dk", image:"/blog/baski-altinda-odak.webp", keywords:["voleybolda mental hazırlık", "maç odağı", "hata sonrası rutin"], body:"Mental dayanıklılık hatasız oynamak değil, hatadan sonra doğru göreve hızla dönebilmektir. Kısa bir nefes, net bir anahtar kelime ve bir sonraki pozisyon görevi dikkati yeniden düzenler." },
  { id:"kumda-hareket", category:"Plaj Voleybolu", title:"Kumda dengeli hareket ve ikili takım iletişimi", excerpt:"Kum zemine uyum sağlayan adımlar, savunma paylaşımı ve çağrı sistemi.", date:"7 Temmuz 2026", read:"9 dk", image:"/blog/kumda-hareket.webp", keywords:["plaj voleybolu teknikleri", "kumda hareket", "ikili takım iletişimi"], body:"Kum zeminde uzun ve sert adımlar enerji kaybettirir. Sporcu ağırlık merkezini kontrollü tutup kısa ayarlama adımları kullanır; ikili düzende görevler her ralliden önce paylaşılır." },
  { id:"voleybol-egitimleri-rehberi", category:"Eğitim", title:"Voleybol eğitimleri: Temelden ileri seviyeye gelişim rehberi", excerpt:"Teknik, taktik, fiziksel ve zihinsel gelişimi birlikte planlayan kapsamlı voleybol eğitimi rehberi.", date:"30 Temmuz 2026", read:"11 dk", image:"/blog/hucum-temposu.webp", keywords:["voleybol eğitimleri", "online voleybol eğitimi", "voleybol dersleri"], body:"Voleybol eğitimi yalnız topa vurmayı öğrenmek değildir. Doğru program; temel hareket becerilerini, teknik uygulamayı, oyun bilgisini, fiziksel hazırlığı ve güvenli yüklenmeyi sporcunun yaşına ve seviyesine göre bir araya getirir." },
  { id:"baslangic-orta-ileri-seviye-voleybol", category:"Eğitim", title:"Başlangıç, orta ve ileri seviye voleybol dersleri nasıl planlanır?", excerpt:"Her seviyede öğrenme hedefleri, teknik öncelikler ve bir üst aşamaya geçiş ölçütleri.", date:"30 Temmuz 2026", read:"10 dk", image:"/blog/sicrama-yuku.webp", keywords:["başlangıç voleybol dersleri", "orta seviye voleybol", "ileri seviye voleybol"], body:"Voleybolda seviye yalnız yaşa veya kaç yıl oynandığına göre belirlenmez. Top kontrolü, hareket kalitesi, karar verme, oyun kurallarını uygulama ve baskı altında tekniği koruma birlikte değerlendirilmelidir." },
  { id:"parmak-pas-manset-servis-smac-blok", category:"Teknik", title:"Parmak pas, manşet, servis, smaç ve blok teknikleri", excerpt:"Voleybolun beş temel tekniğini doğru uygulama sırası, yaygın hatalar ve çalışma önerileriyle öğrenin.", date:"30 Temmuz 2026", read:"14 dk", image:"/blog/servis-karsilama.webp", keywords:["parmak pas tekniği", "manşet nasıl yapılır", "servis smaç blok rehberi"], body:"Parmak pas, manşet, servis, smaç ve blok birbirinden ayrı görünse de hazır pozisyon, topu erken okuma, doğru temas noktası ve dengeli bitiriş ilkelerini paylaşır. Teknik öğrenme basitten karmaşığa ve düşük hızdan oyun hızına ilerlemelidir." },
  { id:"online-voleybol-egitimi-nasil-calisir", category:"Eğitim", title:"Online voleybol eğitimi nasıl çalışır?", excerpt:"Ders, video, sınav ve saha uygulamasını birleştiren çevrim içi voleybol öğrenme modelini keşfedin.", date:"30 Temmuz 2026", read:"8 dk", image:"/blog/baski-altinda-odak.webp", keywords:["online voleybol eğitimi", "çevrim içi voleybol dersi", "voleybol eğitim platformu"], body:"Online voleybol eğitimi, sporcunun tekniği görsel olarak incelemesini, aşamalı konu anlatımını takip etmesini ve bilgisini sınavlarla ölçmesini sağlar. En iyi sonuç, dijital öğrenmenin antrenör gözetimindeki saha uygulamasıyla birleştirilmesiyle alınır." },
  { id:"voleybol-egitimine-kimler-katilabilir", category:"Eğitim", title:"Voleybol eğitimine kimler katılabilir?", excerpt:"Yeni başlayan çocuklardan aktif sporculara ve antrenörlere kadar eğitim yollarını karşılaştırın.", date:"30 Temmuz 2026", read:"7 dk", image:"/blog/libero-alan-savunmasi.webp", keywords:["kimler voleybol oynayabilir", "çocuk voleybol eğitimi", "yetişkin voleybol kursu"], body:"Voleybol farklı yaş ve deneyim düzeylerine uyarlanabilen bir takım sporudur. Eğitimin içeriği; sporcunun gelişim yaşı, sağlık durumu, hareket deneyimi, hedefi ve mevcut teknik seviyesi dikkate alınarak seçilmelidir." },
  { id:"voleybol-yas-gruplari", category:"Eğitim", title:"Voleybol yaş grupları ve yaşa uygun eğitim yaklaşımı", excerpt:"Çocukluk, ergenlik ve yetişkinlik dönemlerinde güvenli ve etkili voleybol eğitimi nasıl değişir?", date:"30 Temmuz 2026", read:"10 dk", image:"/blog/sicrama-yuku.webp", keywords:["voleybol yaş grupları", "çocuklar için voleybol", "kaç yaşında voleybola başlanır"], body:"Voleybola başlamak için tek bir ideal yaş yoktur; ancak öğretim yöntemi gelişim dönemine uygun olmalıdır. Küçük yaşlarda oyun ve koordinasyon, ilerleyen dönemlerde teknik istikrar, karar verme ve bireyselleştirilmiş performans gelişimi öne çıkar." },
  { id:"voleybol-antrenoru-ve-uzman-secimi", category:"Rehber", title:"Voleybol antrenörü ve uzman profili nasıl değerlendirilir?", excerpt:"Eğitim, deneyim, iletişim, çocuk güvenliği ve gelişim takibi açısından doğru uzmanı seçme rehberi.", date:"30 Temmuz 2026", read:"9 dk", image:"/blog/omuz-koruma.webp", keywords:["voleybol antrenörü", "voleybol uzmanı", "iyi antrenör nasıl seçilir"], body:"İyi bir voleybol antrenörü yalnız teknik bilgi aktaran kişi değildir. Güvenli öğrenme ortamı kurar, yaşa uygun iletişim kullanır, gelişimi ölçer ve sporcunun uzun vadeli sağlığını kısa vadeli sonuçların önünde tutar." },
  { id:"voleybol-egitimi-sik-sorulan-sorular", category:"Rehber", title:"Voleybol eğitimi hakkında sık sorulan sorular", excerpt:"Derse başlama yaşı, ekipman, antrenman sıklığı, online eğitim ve ilerleme hakkında kısa yanıtlar.", date:"30 Temmuz 2026", read:"9 dk", image:"/blog/servis-karsilama.webp", keywords:["voleybol sık sorulan sorular", "voleybol kursu soruları", "voleybol eğitimi"], body:"Voleybol eğitimine başlamadan önce aileler ve sporcular yaş, ekipman, antrenman sıklığı ve gelişim süresi hakkında benzer sorular sorar. Yanıtlar kişiye göre değişse de güvenli ve düzenli öğrenmenin temel ilkeleri ortaktır." },
  { id:"uyelik-ve-egitim-sistemi", category:"Rehber", title:"Online Voleybol Akademisi üyelik ve eğitim sistemi", excerpt:"Spor okulu kaydı, sporcu erişimi, dersler, videolar ve sınavların nasıl kullanıldığını adım adım görün.", date:"30 Temmuz 2026", read:"7 dk", image:"/blog/baski-altinda-odak.webp", keywords:["voleybol akademisi üyelik", "spor okulu kayıt sistemi", "online voleybol dersleri"], body:"Online Voleybol Akademisi spor okullarını, sporcuları ve antrenörleri aynı eğitim düzeninde buluşturur. Kayıtlı kullanıcılar ders içeriklerine, eğitim videolarına ve konu sınavlarına profilleri üzerinden erişebilir." },
  { id:"istanbul-ilce-voleybol-okullari", category:"Spor Okulları", title:"İstanbul ve ilçe bazlı voleybol spor okulları rehberi", excerpt:"Ataşehir ve İstanbul’un diğer ilçelerinde voleybol okulu seçerken konumun ötesinde değerlendirilecek ölçütler.", date:"30 Temmuz 2026", read:"11 dk", image:"/blog/hucum-temposu.webp", keywords:["İstanbul voleybol okulları", "Ataşehir voleybol kursu", "yakınımdaki voleybol okulu"], body:"İlçe bazlı voleybol okulu aramasında yalnız mesafeye göre karar vermek yeterli değildir. Antrenör niteliği, yaş grubu düzeni, salon güvenliği, ders kapasitesi, iletişim ve gelişim takibi birlikte değerlendirilmelidir." },
  { id:"voleybol-terimleri-sozlugu", category:"Rehber", title:"Voleybol terimleri sözlüğü: Temel kavramlar ve anlamları", excerpt:"Rotasyon, ralli, side-out, libero, pipe, plase ve daha birçok voleybol terimini anlaşılır biçimde öğrenin.", date:"30 Temmuz 2026", read:"12 dk", image:"/blog/libero-alan-savunmasi.webp", keywords:["voleybol terimleri", "voleybol sözlüğü", "voleybol kavramları"], body:"Voleybol terminolojisini bilmek, antrenör komutlarını anlamayı ve oyunu daha hızlı okumayı kolaylaştırır. Bu sözlük saha bölgelerinden pozisyonlara, tekniklerden taktik kavramlara kadar sık kullanılan ifadeleri sade Türkçeyle açıklar." },
];

const blogArticleDetails = {
  "servis-karsilama":[
    {title:"Servis karşılamada doğru hazır pozisyon",text:"Ayaklar omuz genişliğine yakın, dizler yumuşak ve gövde hafif önde olmalıdır. Ağırlık topuklara değil ayakların ön bölümüne dağıtılır. Sporcu servis atan oyuncunun top atışını, omuz yönünü ve vuruş kolunu izleyerek ilk hareket ipucunu yakalar.",points:["Topun uçuşunu erken oku.","Kolları birleştirmeden önce ayaklarla topun arkasına geç.","Temas sırasında başı ve gövdeyi dengede tut."]},
    {title:"Manşet platform açısı ve hedef kontrolü",text:"Topun çıkış yönü büyük ölçüde ön kolların oluşturduğu platform açısıyla belirlenir. Omuzlar hedefe döner, bilekler yan yana tutulur ve temas vücudun önünde yapılır. Kolları yukarı savurmak yerine bacaklardan gelen kontrollü yükselme kullanılır.",points:["Platformu son anda çevirmeyin.","Topu dirseğe veya ellere değil iki ön kolun düz yüzeyine alın.","Pas yüksekliğini hedef bölgeye göre ayarlayın."]},
    {title:"Sık yapılan servis karşılama hataları",text:"Geç hareket etmek, kolları erken kilitlemek ve topa doğru kontrolsüz sallanmak en sık görülen sorunlardır. Antrenmanda kısa servis, derin servis ve yüzen servis ayrı senaryolarla çalışılmalıdır.",points:["Tekrarları yalnız başarı sayısıyla değil hedef isabetiyle değerlendirin.","Sağ-sol hareketlerde önce dengeyi koruyun.","Zor toplarda mükemmel pas yerine oynanabilir top hedefleyin."]},
  ],
  "voleybolda-video-ile-oz-degerlendirme":[
    {title:"Kayıttan önce tek bir gözlem hedefi belirle",text:"Bir videoda aynı anda ayakları, kolları, topu, rakibi ve sonucu değerlendirmeye çalışmak sporcunun dikkatini dağıtır. Çekimden önce yalnızca bir teknik soruya karar verilmelidir: Serviste top atışım aynı noktaya geliyor mu, manşette temas vücudumun önünde mi, smaçta son iki adımım hızlanıyor mu? Net soru, görüntünün yararlı bilgiye dönüşmesini sağlar.",points:["Her video için yalnızca bir ana teknik ölçüt seç.","Ölçütü gözlenebilir ve anlaşılır bir cümleyle yaz.","Başarıyı yalnız topun sayı olmasıyla değerlendirme."]},
    {title:"Doğru kamera açısı ve kısa kayıt düzeni",text:"Kamera, hareketin incelenecek bölümünü kapatmayacak güvenli bir noktaya sabitlenmelidir. Ayak çalışması için tüm vücudu ve zemini gösteren yan veya çapraz açı; kol ve temas noktası için ön-yan açı daha kullanışlıdır. Tek bir uzun video yerine aynı çalışmadan beş ile sekiz kontrollü tekrar kaydetmek karşılaştırmayı kolaylaştırır.",points:["Telefonu saha ve top trafiğinin dışında sabitle.","Sporcunun ayaklarından topun en yüksek noktasına kadar tüm hareketi kadraja al.","Yakın plan ile tüm vücut görüntüsünü aynı değerlendirmede karıştırma."]},
    {title:"Görüntüyü sonuçtan bağımsız teknik ölçütlerle incele",text:"İlk izlemede hareketin tamamı normal hızda görülür. İkinci izlemede hazırlık, temas ve bitiriş aşamaları ayrı ayrı değerlendirilir. Topun hedefe gitmesi her zaman tekniğin doğru olduğu anlamına gelmez; benzer şekilde iyi hazırlanmış bir hareket tek bir başarısız sonuç nedeniyle yanlış kabul edilmemelidir. Birden fazla tekrar içindeki ortak davranış aranmalıdır.",points:["Hazırlık pozisyonu, zamanlama, temas noktası ve dengeyi ayrı değerlendir.","En az beş tekrarda tekrar eden örüntüyü bul.","Bir doğru davranış ve geliştirilecek bir davranış kaydet."]},
    {title:"Analizi antrenman hedefine dönüştür",text:"Video değerlendirmesinin sonunda uzun bir hata listesi yerine bir sonraki antrenmana taşınacak tek bir görev seçilir. Örneğin ‘manşetim kötü’ yerine ‘temastan önce iki kısa ayarlama adımıyla topun arkasına geçeceğim’ gibi uygulanabilir bir hedef yazılır. Aynı çalışma daha sonra aynı açıdan yeniden kaydedilerek değişim karşılaştırılır.",points:["Hedefi olumlu, kısa ve yapılabilir biçimde yaz.","Düzeltmeyi önce düşük hızda ve kontrollü tekrarlarla uygula.","Görüntüleri paylaşırken sporcu ve takım gizliliğini koru; çocukların kayıtlarında veli ve kulüp kurallarına uy."]},
  ],
  "voleybol-antrenman-gunlugu":[
    {title:"Her antrenmana amaç yazarak başla",text:"Günlük kaydı antrenmandan sonra hatırlananlarla sınırlı kalmamalıdır. Çalışma öncesinde bir teknik, bir fiziksel veya bir zihinsel amaç belirlemek sporcunun dikkatini yönlendirir. ‘Daha iyi oynamak’ yerine ‘servis karşılamada ilk hareketimi topun yönüne göre erken başlatmak’ gibi ölçülebilir bir görev seçilmelidir.",points:["Antrenmanın ana hedefini tek cümlede yaz.","Hedefi takım programı ve antrenör göreviyle uyumlu tut.","Aynı gün çok sayıda gelişim hedefi belirleme."]},
    {title:"Çalışma sonrasında kısa ve düzenli kayıt tut",text:"Antrenmanın hemen ardından süre, ana çalışma, algılanan zorluk ve teknik gözlem kaydedilir. Uzun paragraflar yerine her gün aynı dört soruyu yanıtlamak devamlılığı artırır: Bugün ne çalıştım, ne iyi gitti, nerede zorlandım ve bir sonraki adımım ne? Ağrı, aşırı yorgunluk veya beklenmeyen performans düşüşü ayrıca belirtilmelidir.",points:["Antrenman süresi ile algılanan zorluğu 1–10 arasında kaydet.","Başarılı bir davranış ve geliştireceğin bir davranış yaz.","Ağrıyı normal yorgunluk gibi yorumlama; antrenöre ve gerektiğinde sağlık uzmanına bildir."]},
    {title:"Toparlanma bilgilerini gelişimle birlikte izle",text:"Uyku, sıvı alımı, okul yoğunluğu ve genel enerji durumu antrenman kalitesini etkileyebilir. Günlük bu alanları tıbbi tanı koymak için değil, tekrar eden ilişkileri fark etmek için kullanır. Örneğin birkaç hafta boyunca düşük uyku sonrasında odak ve sıçrama kalitesinin düştüğü görülüyorsa program ve dinlenme düzeni antrenörle değerlendirilir.",points:["Uyku süresi ve sabah dinçlik durumunu kısa biçimde kaydet.","Yoğun okul, yolculuk ve maç günlerini işaretle.","Tek bir kötü güne göre karar verme; haftalık eğilime bak."]},
    {title:"Haftalık değerlendirme ve antrenör geri bildirimi",text:"Haftanın sonunda günlük kayıtları beş dakikalık bir özetle birleştirmek gelişimi görünür kılar. Sporcu tamamladığı hedefi, devam eden sorunu ve gelecek haftanın önceliğini belirler. Bu özet antrenörle paylaşıldığında sporcunun kendi algısıyla saha gözlemi karşılaştırılabilir ve daha gerçekçi bir çalışma hedefi oluşturulabilir.",points:["Haftanın en tutarlı teknik kazanımını seç.","Zorlandığın durumu örnek bir antrenman veya ralliyle açıkla.","Gelecek hafta için tek ana hedef ve bir kontrol ölçütü belirle."]},
  ],
  "hucum-temposu":[
    {title:"Voleybolda hücum temposu nedir?",text:"Hücum temposu, pasörün topa temas anı ile hücumcunun sıçrama ve vuruş penceresi arasındaki zaman ilişkisidir. Tempo ne kadar hızlanırsa pasör ile hücumcunun ortak referansları o kadar net olmalıdır.",points:["Birinci tempo orta oyuncu için hızlı ve alçak pası ifade eder.","İkinci tempo hızlı kanat hücumunda kullanılır.","Yüksek top bozuk karşılama ve zorunlu hücumlarda güvenli seçenektir."]},
    {title:"Pasör ve smaçör zamanlaması nasıl çalışılır?",text:"Hücumcu topa değil, pasörün top altına girişine ve takımın belirlediği tempo çağrısına göre yaklaşmayı başlatır. Pasör karşılama kalitesi ile rakip bloğun yerleşimini birlikte değerlendirir.",points:["Aynı başlangıç noktası ve yaklaşma rotasını kullanın.","Önce topsuz ritim, sonra kontrollü pasla çalışın.","Pas yüksekliği değiştiğinde hücumcunun son iki adımı uyarlanmalıdır."]},
    {title:"Tempo antrenmanında ölçülebilir hedefler",text:"Başarı yalnız topun yere düşmesi değildir. Pas konumu, hücumcunun vuruş yüksekliği, blok karşısındaki seçenek ve top kaybı oranı birlikte izlenmelidir.",points:["10 tekrar içinde vuruş penceresine gelen pas sayısını kaydedin.","Çapraz, paralel ve blok aut seçeneklerini dönüşümlü uygulayın.","Yorgunlukta ritim bozuluyorsa çalışma yoğunluğunu azaltın."]},
  ],
  "libero-alan-savunmasi":[
    {title:"Libero başlangıç pozisyonunu neye göre seçer?",text:"Başlangıç noktası blok planı, rakip hücumcunun yaklaşma açısı, pasın fileye uzaklığı ve takım savunma sistemiyle belirlenir. Libero her hücumda aynı noktada beklemez.",points:["Blok çizgiyi kapatıyorsa çapraz koridoru önceliklendirin.","Pas fileden açıldığında derin hücum ihtimalini okuyun.","Plase ve blok arkası için öne hareket etmeye hazır olun."]},
    {title:"Hücumcuyu okuma ve ayarlama adımları",text:"Omuz çizgisi, kol salınımı ve topun vuruş omzuna göre konumu hücum yönü hakkında ipucu verir. Büyük çapraz adımlar yerine kısa ve dengeli ayarlama adımları kullanılır.",points:["Temas anında hareket hâlinde kalmayın.","Ağırlığı iki ayağa dengeli dağıtın.","Savunma sonrası ikinci hareketi hemen başlatın."]},
    {title:"Libero iletişimi ve ikinci top sorumluluğu",text:"Libero blokçuların göremediği arka alanı yönetir. Kısa top, çizgi, çapraz ve serbest top çağrıları erken ve anlaşılır yapılmalıdır.",points:["Pasör ilk topu savunduğunda ikinci top sorumluluğunu önceden belirleyin.","Çakışan toplarda tek ve güçlü çağrı kullanın.","Her ralli sonrası savunma yerleşimini kısa biçimde değerlendirin."]},
  ],
  "sicrama-yuku":[
    {title:"Voleybol sıçrama antrenmanında temel ilke",text:"Sıçrama geliştirme çalışmaları kuvvet, hız ve teknik kalitenin birleşimidir. Çok tekrar yapmak yerine yüksek kaliteli kuvvet üretimi ve kontrollü iniş hedeflenmelidir.",points:["Isınmadan maksimum sıçramaya geçmeyin.","İnişte diz, kalça ve ayak hizasını koruyun.","Setler arasında yeterli dinlenme verin."]},
    {title:"Pliometrik yük nasıl artırılır?",text:"Önce düşük şiddetli çift ayak sıçramaları, ardından yön değiştirme ve tek ayak varyasyonları kullanılır. Yük; temas sayısı, yükseklik, hız ve haftalık sıklıkla birlikte değerlendirilir.",points:["Yeni başlayanlarda düşük hacimle başlayın.","Maç yoğun haftalarda sıçrama hacmini azaltın.","Yüksekliğin belirgin düştüğü sette çalışmayı durdurun."]},
    {title:"Güvenli iniş ve performans takibi",text:"Sessiz ve dengeli iniş, kuvvetin eklemler arasında paylaşılmasına yardım eder. Ağrı veya asimetri görülürse çalışma ilerletilmemeli ve uzman değerlendirmesi alınmalıdır.",points:["Video ile sağ-sol farkını izleyin.","Sıçrama yüksekliği kadar iniş kontrolünü de kaydedin.","Kuvvet antrenmanı ile saha yükünü aynı haftada planlayın."]},
  ],
  "omuz-koruma":[
    {title:"Servis ve smaçta omuz yükü",text:"Tekrarlayan baş üstü vuruşlar omuz çevresindeki dokulara yüksek hızda yük bindirir. Risk yalnız tekniğe değil toplam vuruş sayısına, toparlanmaya ve gövde kuvvetine bağlıdır.",points:["Antrenman ve maç vuruşlarını birlikte takip edin.","Ani hacim artışından kaçının.","Ağrıyla servis veya smaç çalışmasına devam etmeyin."]},
    {title:"Kürek kemiği kontrolü ve hareketlilik",text:"Kürek kemiğinin kontrollü yukarı rotasyonu kolun güvenli biçimde yükselmesine yardım eder. Göğüs omurgası hareketliliği ve gövde rotasyonu vuruş yükünü yalnız omuza bırakmaz.",points:["Bantla dış rotasyonu düşük dirençle uygulayın.","Hareket boyunca omzu kulağa çekmeyin.","Isınmada kontrollü omuz ve gövde hareketleri kullanın."]},
    {title:"Ne zaman sağlık uzmanına başvurulmalı?",text:"Gece ağrısı, güç kaybı, tekrarlayan sıkışma hissi veya hareket kısıtlılığı normal antrenman yorgunluğu değildir. Tanı ve tedavi bireysel sağlık değerlendirmesi gerektirir.",points:["Belirtiyi saklamayın ve erken bildirin.","İnternetteki egzersizleri tedavi yerine kullanmayın.","Sahaya dönüşü basamaklı ve uzman onaylı planlayın."]},
  ],
  "mac-gunu-beslenme":[
    {title:"Maç öncesi öğün nasıl olmalı?",text:"Ana öğün maç saatinden yaklaşık 3–4 saat önce, sporcunun alışık olduğu ve sindirimi kolay yiyeceklerden oluşturulur. Karbonhidrat enerji desteği sağlar; protein dengeli tutulur.",points:["Yeni yiyecekleri maç gününde denemeyin.","Aşırı yağlı ve çok lifli öğünlerden kaçının.","Porsiyonu sporcunun yaşı ve ihtiyacına göre belirleyin."]},
    {title:"Voleybol maçında sıvı planı",text:"Sıvı ihtiyacı terleme hızı, salon sıcaklığı, maç süresi ve kişisel toleransa göre değişir. Susamayı beklemek yerine küçük ve düzenli aralıklarla sıvı alınır.",points:["Maça iyi hidrate başlayın.","Set aralarında küçük miktarlar tercih edin.","Uzun ve sıcak etkinliklerde uzman önerisiyle elektrolit planlayın."]},
    {title:"Maç sonrası toparlanma",text:"Toparlanma öğünü karbonhidrat, kaliteli protein ve sıvıyı birlikte içermelidir. Amaç enerji depolarını yenilemek ve kas onarımını desteklemektir.",points:["Takip eden maç varsa toparlanmayı geciktirmeyin.","İdrar rengi ve vücut ağırlığı değişimini takip edin.","Genç sporcularda takviye yerine dengeli beslenmeyi temel alın."]},
  ],
  "baski-altinda-odak":[
    {title:"Hata sonrası dikkat neden dağılır?",text:"Sporcu geçmiş sayıyı zihninde tekrar ettiğinde çevredeki yeni oyun ipuçlarını kaçırabilir. Amaç duyguyu bastırmak değil, dikkati kontrol edilebilir bir sonraki göreve taşımaktır.",points:["Hatanın ardından tek ve yavaş nefes alın.","Kısa bir anahtar kelime kullanın.","Yeni pozisyon görevinizi sesli veya zihinsel olarak belirleyin."]},
    {title:"Voleybolda kısa odak rutini",text:"Etkili rutin birkaç saniye sürer ve her rallide uygulanabilir. Sporcu servis hedefi, blok görevi veya savunma başlangıç konumu gibi somut bir işarete yönelir.",points:["Rutini önce antrenmanda prova edin.","Olumsuz sonuç cümlesi yerine görev cümlesi kurun.","Takım arkadaşlarıyla destekleyici iletişim kullanın."]},
    {title:"Baskı antrenmanda nasıl çalışılır?",text:"Puan hedefi, süre sınırı veya servis baskısı gibi kontrollü senaryolar sporcunun rutinini gerçekçi ortamda denemesini sağlar. Ceza odaklı aşırı baskı öğrenmeyi zayıflatabilir.",points:["Zorluk seviyesini kademeli artırın.","Sonuç kadar karar kalitesini değerlendirin.","Antrenman sonrası hangi rutinin işe yaradığını kaydedin."]},
  ],
  "kumda-hareket":[
    {title:"Plaj voleybolunda kumda hareket tekniği",text:"Kum, zemine uygulanan kuvvetin bir bölümünü emer. Bu nedenle kısa, ritmik ve dengeli adımlar enerji kaybını azaltır. Sporcu gereksiz dikleşmeden merkezini kontrol eder.",points:["İlk adımı kısa ve yönlü kullanın.","Topa yaklaşırken son adımları ayarlayın.","Çıplak ayakta güvenli ve temiz saha koşullarını kontrol edin."]},
    {title:"İkili takımda görev paylaşımı",text:"İki oyunculu düzende her sporcu geniş alan savunur. Servis hedefi, blok yönü, kısa top ve serbest top sorumlulukları ralliden önce netleştirilir.",points:["Blok işaretlerini iki oyuncu da doğrulasın.","Top arası iletişimi kısa ve erken yapın.","Savunmadan hücuma geçiş rotasını önceden belirleyin."]},
    {title:"Kumda kondisyon ve yük yönetimi",text:"Kumda hareket enerji maliyetini artırabilir. Çalışma süresi, sıcaklık ve güneş koşulları dikkate alınmalı; teknik kalite düşmeden dinlenme verilmelidir.",points:["Günün serin saatlerini tercih edin.","Sıvı ve güneşten korunma planı oluşturun.","Salon temposunu doğrudan kuma taşımayın; uyum süresi verin."]},
  ],
  "voleybol-egitimleri-rehberi":[
    {title:"Voleybol eğitiminin dört temel bileşeni",text:"Etkili eğitim teknik beceri, oyun anlayışı, fiziksel hazırlık ve zihinsel becerileri aynı gelişim planında birleştirir. Bir bileşeni diğerlerinden bağımsız ve aşırı yüklemek kalıcı öğrenmeyi sınırlar.",points:["Teknik hareketi önce kontrollü ortamda öğrenin.","Karar verme görevlerini küçük oyunlarla geliştirin.","Kuvvet, hareketlilik ve toparlanmayı haftalık plana ekleyin."]},
    {title:"Ders sırası nasıl oluşturulur?",text:"Program hazır pozisyon ve top kontrolüyle başlar; parmak pas, manşet ve servis temellerinden smaç, blok, pozisyon ve takım organizasyonlarına ilerler. Her yeni görev önceki becerinin üzerine kurulmalıdır.",points:["Önce doğruluk, sonra hız ve baskı ekleyin.","Her bölüm için gözlenebilir başarı ölçütü belirleyin.","Hata düzeltmesini kısa, açık ve uygulanabilir tutun."]},
    {title:"Gelişim nasıl takip edilir?",text:"Tek bir maç sonucu gelişimi göstermez. Antrenmana devamlılık, hedef isabeti, teknik kalite, doğru karar yüzdesi ve sporcunun öz değerlendirmesi birlikte izlenmelidir.",points:["Aylık teknik hedef belirleyin.","Video ve sınav sonuçlarını saha gözlemiyle karşılaştırın.","Programı yaşa, role ve güncel ihtiyaca göre güncelleyin."]},
  ],
  "baslangic-orta-ileri-seviye-voleybol":[
    {title:"Başlangıç seviyesi",text:"Başlangıç döneminde amaç topu güçlü vurmak değil; dengeli hazır pozisyon, topun uçuşunu izleme, temel temas ve saha güvenliğini öğrenmektir.",points:["Parmak pas ve manşette doğru temas yüzeyini kurun.","Alttan servisle kontrollü başlangıç yapın.","Temel rotasyon ve üç temas kuralını öğrenin."]},
    {title:"Orta seviye",text:"Orta seviyede teknikler hareket, hedef ve karar verme ile birleştirilir. Sporcu servis karşılama düzenini, hücum yaklaşmasını ve blok-savunma ilişkisini uygulamaya başlar.",points:["Farklı servis türlerine karşı pas kalitesini koruyun.","Pozisyona özgü görevleri çalışın.","Oyun hızında iletişim ve geçiş becerisi geliştirin."]},
    {title:"İleri seviye",text:"İleri seviyede amaç baskı altında tutarlılık, rakip analizi ve taktik esnekliktir. Yük planı bireyselleştirilir ve performans verileriyle izlenir.",points:["Rakibe göre servis ve hücum hedefi seçin.","Birden fazla hücum temposunda oynayın.","Teknik kaliteyi yorgunluk altında koruyun."]},
  ],
  "parmak-pas-manset-servis-smac-blok":[
    {title:"Parmak pas ve manşet",text:"Parmak pasta top alın önünde, iki elin dengeli temasıyla yönlendirilir. Manşette iki ön kol tek platform oluşturur; çıkış açısı omuz ve gövde yönüyle kontrol edilir.",points:["Topa ulaşmak için önce ayakları kullanın.","Temas noktasını vücudun önünde tutun.","Kollarla aşırı savurma yerine bacak-gövde uyumu kurun."]},
    {title:"Servis ve smaç",text:"Serviste tutarlı top atışı vuruş kalitesinin temelidir. Smaçta yaklaşma ritmi, son iki adım, çift ayak dengesi, kol çekişi ve yüksek temas birbirini tamamlar.",points:["Servis top atışını her tekrarda aynı bölgede tutun.","Smaçta topun altına kaçmadan vuruş omzunu hazırlayın.","Vuruş sonrası dengeli iniş yapın."]},
    {title:"Blok",text:"Blok yalnız sıçrama değildir; pasörü ve hücumcuyu okuma, file boyunca hızlı hareket, elleri rakip alana yönlendirme ve savunmayla ortak alan kapatma becerisidir.",points:["Sıçrama zamanını hücumcunun kol hareketine göre ayarlayın.","Eller arasındaki boşluğu kapatın.","İnişte fileye temas etmeden dengeyi koruyun."]},
  ],
  "online-voleybol-egitimi-nasil-calisir":[
    {title:"Dijital ders akışı",text:"Sporcu önce konu anlatımını okur, ilgili hareketin videosunu izler ve önemli teknik ipuçlarını not eder. Ardından hareketi güvenli bir saha ortamında uygular.",points:["Dersi sırayla takip edin.","Videoyu yavaşlatarak temas ve ayak hareketini inceleyin.","Her çalışmada tek bir teknik hedef seçin."]},
    {title:"Sınav ve geri bildirim",text:"Konu sınavları kuralları ve teknik kararları anlamayı ölçer. Sonuçlar öğrenme eksiklerini gösterir; saha performansının tek başına yerine geçmez.",points:["Yanlış cevapların açıklamasını okuyun.","Eksik konuyu yeniden çalışın.","Antrenörden saha uygulaması hakkında geri bildirim alın."]},
    {title:"Online eğitimin sınırı",text:"Dijital içerik öğretimi destekler; sağlık değerlendirmesi, bireysel yük planlaması ve karmaşık teknik düzeltmeler için nitelikli antrenör veya sağlık uzmanı gerekir.",points:["Ağrı sırasında çevrim içi egzersizi sürdürmeyin.","Çocuklarda uygulamayı yetişkin gözetiminde yapın.","Dijital planı kulüp antrenmanıyla uyumlu tutun."]},
  ],
  "voleybol-egitimine-kimler-katilabilir":[
    {title:"Yeni başlayanlar ve çocuklar",text:"Temel hareket becerilerini geliştirmek isteyen çocuklar ve voleybola yeni başlayanlar, yaşa uygun top, file yüksekliği ve oyun alanıyla eğitime katılabilir.",points:["Oyun temelli ve kısa çalışmalar kullanın.","Başarıyı yalnız skorla ölçmeyin.","Güvenli iniş ve saha farkındalığını önceliklendirin."]},
    {title:"Aktif sporcular",text:"Kulüp sporcuları pozisyona özgü teknik, taktik karar, video analizi ve performans destek içeriklerinden yararlanabilir.",points:["Kulüp programıyla çakışan ek yük oluşturmaktan kaçının.","Bireysel hedefleri antrenörle paylaşın.","Toparlanma ve antrenman yoğunluğunu birlikte izleyin."]},
    {title:"Antrenörler ve ebeveynler",text:"Antrenörler eğitim içeriğini planlama desteği olarak, ebeveynler ise güvenli spor ortamını ve gelişim sürecini anlamak için kullanabilir.",points:["İçeriği sporcunun gelişim düzeyine uyarlayın.","Tıbbi içeriği teşhis yerine kullanmayın.","Uzun vadeli gelişimi kısa vadeli galibiyetin önünde tutun."]},
  ],
  "voleybol-yas-gruplari":[
    {title:"6–9 yaş: Hareket ve oyun",text:"Bu dönemde amaç erken uzmanlaşma değil; koşma, sıçrama, denge, yakalama ve topa uyum gibi temel becerileri eğlenceli oyunlarla geliştirmektir.",points:["Hafif top ve alçak file kullanın.","Bekleme süresini azaltın.","Çok yönlü hareket deneyimi sunun."]},
    {title:"10–13 yaş: Teknik temel",text:"Koordinasyon gelişirken parmak pas, manşet, servis ve yaklaşma ritmi doğru örneklerle pekiştirilir. Büyüme hızındaki değişimler dikkate alınır.",points:["Hareket kalitesini sonuçtan önce değerlendirin.","Tek pozisyona erken sınırlandırmayın.","Yüksek hacimli sıçramayı kontrollü artırın."]},
    {title:"14 yaş ve üzeri: Rol ve performans",text:"Pozisyon görevleri, takım sistemleri, kuvvet ve kondisyon daha planlı hale gelir. Yine de biyolojik gelişim ve antrenman geçmişi bireysel olarak değerlendirilmelidir.",points:["Pozisyona özgü becerileri genel teknikle dengeleyin.","Haftalık yük ve toparlanmayı izleyin.","Yetişkin yeni başlayanlarda da kademeli ilerleyin."]},
  ],
  "voleybol-antrenoru-ve-uzman-secimi":[
    {title:"Yetkinlik ve deneyim",text:"Antrenörün eğitim geçmişi, voleybol branşındaki deneyimi, çalıştığı yaş grubu ve güncel gelişim yaklaşımı açıkça görülebilmelidir.",points:["Belge ve deneyimi doğrulayın.","Çalışılan yaş grubuna özgü deneyim sorun.","Program hedeflerinin nasıl ölçüldüğünü öğrenin."]},
    {title:"İletişim ve güvenlik",text:"Antrenör açık, saygılı ve gelişim odaklı iletişim kurmalı; fiziksel ve duygusal güvenlik için net kurallar uygulamalıdır.",points:["Aşağılayıcı ve korku temelli iletişimi kabul etmeyin.","Çocuk koruma ve acil durum yaklaşımını sorun.","Veli iletişim sürecinin şeffaf olmasını bekleyin."]},
    {title:"Uzman desteği ne zaman gerekir?",text:"Ağrı, sakatlık, beslenme sorunu veya psikolojik güçlüklerde antrenör ilgili lisanslı uzmana yönlendirmelidir.",points:["Antrenörün uzmanlık sınırlarını gözetin.","Sağlık tanısını yalnız sağlık profesyonelinden alın.","Antrenör, fizyoterapist ve diyetisyen iletişimini destekleyin."]},
  ],
  "voleybol-egitimi-sik-sorulan-sorular":[
    {title:"Voleybola kaç yaşında başlanır?",text:"Tek bir zorunlu başlangıç yaşı yoktur. Çocuk hazır olduğunda oyun temelli, güvenli ve yaşa uygun programlarla başlayabilir.",points:["Programı yaşa değil gelişim düzeyine de göre seçin.","Küçük yaşta özel ekipman kullanın.","Erken dönemde eğlence ve temel hareketi öne çıkarın."]},
    {title:"Haftada kaç antrenman yapılmalı?",text:"Sıklık yaşa, deneyime, okul programına, maç yüküne ve toparlanmaya göre değişir. Kaliteli ve düzenli çalışma, kontrolsüz yüksek hacimden daha değerlidir.",points:["Dinlenme günlerini planlayın.","Ağrı ve sürekli yorgunluğu takip edin.","Ek çalışmaların kulüp yüküyle uyumunu kontrol edin."]},
    {title:"Hangi ekipmanlar gerekir?",text:"Başlangıç için uygun boyutta top, kaymayan salon ayakkabısı, rahat spor kıyafeti ve su şişesi genellikle yeterlidir. Dizlik ihtiyacı çalışma ortamına göre değerlendirilir.",points:["Ayakkabının zemine uygun olmasına dikkat edin.","Hasarlı top ve güvenli olmayan file kullanmayın.","Kişisel ekipmanı temiz ve düzenli tutun."]},
  ],
  "uyelik-ve-egitim-sistemi":[
    {title:"Spor okulu, takım ve kullanıcı kaydı",text:"Spor okulu kayıt başvurusu yapar ve onaylanan kulüp kendi koduyla sisteme giriş yapar. Sporcular takım koduyla, antrenörler ise kulübün ayrı antrenör koduyla kayıt olur. Antrenörün takım görevlendirmesini kulüp yöneticisi yapar.",points:["Kulüp, antrenör ve sporcu takım kodlarını ayrı tutun.","Takım kodunu yalnızca ilgili sporcu kadrosuyla paylaşın.","Antrenör takım atamalarını kulüp profilinden yönetin."]},
    {title:"Eğitim içeriklerine erişim",text:"Giriş yapan kullanıcı dersleri, eğitim videolarını ve sınavları rolüne uygun biçimde görüntüler. İçerikler voleybol konu başlıklarına göre düzenlenir.",points:["Ders anlatımını tamamladıktan sonra videoya geçin.","Sınav sonucuyla eksik konuyu belirleyin.","Profil üzerinden ilerlemeyi takip edin."]},
    {title:"Kulüp kullanım modeli",text:"Üyelik spor okullarının sınırsız öğrenciyle eğitim ortamını kullanmasına göre tasarlanmıştır. Güncel ücret ve kapsam bilgisi ücretler sayfasında yer alır.",points:["Güncel üyelik koşullarını inceleyin.","Kulüp yöneticisi kullanıcı listesini düzenli kontrol etsin.","Erişim sorunlarında destek kanalıyla iletişime geçin."]},
  ],
  "istanbul-ilce-voleybol-okullari":[
    {title:"İlçe bazlı voleybol okulu arama",text:"Ataşehir, Üsküdar, Ümraniye, Çekmeköy, Kartal ve diğer ilçelerde ulaşım süresi önemlidir; ancak program kalitesi ve güvenlik ölçütleriyle birlikte değerlendirilmelidir.",points:["Antrenman salonunun açık adresini doğrulayın.","Yaş ve seviye grubunun uygunluğunu sorun.","Deneme dersi ve veli bilgilendirmesi hakkında bilgi alın."]},
    {title:"Spor okulu seçim kontrol listesi",text:"Antrenör yetkinliği, grup büyüklüğü, salon zemini, acil durum planı, ders süresi ve gelişim geri bildirimi karşılaştırılmalıdır.",points:["Antrenör başına düşen sporcu sayısını öğrenin.","Salon ve ekipman güvenliğini gözlemleyin.","Ücret, iptal ve telafi koşullarını yazılı alın."]},
    {title:"Kayıtlı okul profilleri",text:"Platformdaki kayıtlı spor okulları isim ve logolarıyla ayrı sayfada listelenir. Profil görünürlüğü tek başına resmi federasyon onayı veya kalite garantisi anlamına gelmez; aileler bilgileri doğrudan okuldan doğrulamalıdır.",points:["Kulübün resmi bilgilerini kontrol edin.","Güncel iletişim ve program saatlerini teyit edin.","Çocuğun ihtiyaçlarına uygun ortamı yerinde değerlendirin."]},
  ],
  "voleybol-terimleri-sozlugu":[
    {title:"Oyun ve saha terimleri",text:"Ralli, servisle başlayıp topun oyun dışı kalmasına kadar süren oyun dizisidir. Rotasyon, servis hakkı kazanıldığında oyuncuların saat yönünde bir pozisyon ilerlemesidir. Side-out, servis karşılayan takımın ralliyi kazanarak servis hakkını almasıdır.",points:["Ön alan: 2, 3 ve 4 numaralı bölgeler.","Arka alan: 1, 6 ve 5 numaralı bölgeler.","Anten: Topun geçiş alanının yan sınırını belirleyen çubuk."]},
    {title:"Teknik ve hücum terimleri",text:"Set veya pas, hücumcuya vuruş imkânı hazırlayan ikinci temastır. Pipe, arka orta bölgeden yapılan hızlı hücumdur. Plase, topu güç yerine kontrolle boş alana yönlendiren vuruştur.",points:["Ace: Rakibin oyuna sokamadığı doğrudan servis sayısı.","Tool: Hücumun blok ellerine çarpıp dışarı çıkması.","Tip: Parmaklarla kontrollü kısa hücum dokunuşu."]},
    {title:"Pozisyon ve savunma terimleri",text:"Libero arka alan savunması ve servis karşılamada uzmanlaşan farklı formalı oyuncudur. Pasör hücumu organize eder; orta oyuncu hızlı hücum ve blokta, smaçör karşılama ve kanat hücumunda, pasör çaprazı ise yüksek top hücumunda önemli rol üstlenir.",points:["Blok-out: Topun bloktan dışarı çıkması.","Dig: Güçlü hücumun savunmayla oyunda tutulması.","Cover: Hücumcunun bloktan dönen topuna yapılan destek savunması."]},
  ],
};

const loadBlogExportImage = (src) => new Promise((resolve) => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => resolve(image);
  image.onerror = () => resolve(null);
  image.src = new URL(src, window.location.origin).href;
});

function drawBlogCover(context, image, x, y, width, height) {
  if (!image) {
    const fallback = context.createLinearGradient(x, y, x + width, y + height);
    fallback.addColorStop(0, "#071b33");
    fallback.addColorStop(1, "#ff6b1a");
    context.fillStyle = fallback;
    context.fillRect(x, y, width, height);
    return;
  }
  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  context.drawImage(image, (image.width - sourceWidth) / 2, (image.height - sourceHeight) / 2, sourceWidth, sourceHeight, x, y, width, height);
}

function drawBlogWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width <= maxWidth || !line) line = next;
    else { lines.push(line); line = word; }
  });
  if (line) lines.push(line);
  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = visible[maxLines - 1];
    while (last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    visible[maxLines - 1] = `${last.trim()}…`;
  }
  visible.forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
  return y + visible.length * lineHeight;
}

async function downloadBlogInstagramCard(post) {
  await document.fonts?.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Görsel oluşturulamadı.");
  const [cover, logo] = await Promise.all([
    loadBlogExportImage(post.image),
    loadBlogExportImage("/brand-logo-transparent.png"),
  ]);

  context.fillStyle = "#f6f8fa";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawBlogCover(context, cover, 0, 0, 1080, 610);
  const coverShade = context.createLinearGradient(0, 220, 0, 610);
  coverShade.addColorStop(0, "rgba(7,27,51,0)");
  coverShade.addColorStop(1, "rgba(7,27,51,.74)");
  context.fillStyle = coverShade;
  context.fillRect(0, 220, 1080, 390);
  context.fillStyle = "#ff6b1a";
  context.fillRect(0, 0, 18, 1350);

  context.fillStyle = "#ff6b1a";
  context.font = '900 24px Arial, sans-serif';
  context.beginPath();
  context.roundRect(68, 62, Math.min(430, 74 + context.measureText(post.category.toUpperCase()).width), 58, 29);
  context.fill();
  context.fillStyle = "#fff";
  context.letterSpacing = "2px";
  context.fillText(post.category.toUpperCase(), 98, 100);
  context.letterSpacing = "0px";

  if (logo) context.drawImage(logo, 70, 655, 88, 88);
  context.fillStyle = "#071b33";
  context.font = '900 29px Arial, sans-serif';
  context.fillText("VOLEYBOL", 178, 689);
  context.letterSpacing = "5px";
  context.fillText("AKADEMİSİ", 178, 728);
  context.letterSpacing = "0px";

  context.fillStyle = "#071b33";
  context.font = '900 70px "Barlow Condensed", Arial, sans-serif';
  const titleBottom = drawBlogWrappedText(context, post.title, 70, 830, 940, 74, 3);
  context.fillStyle = "#52677e";
  context.font = '400 30px Arial, sans-serif';
  drawBlogWrappedText(context, post.excerpt, 72, titleBottom + 22, 920, 44, 3);

  const footerY = 1248;
  context.fillStyle = "#dce5eb";
  context.fillRect(70, footerY - 26, 940, 2);
  context.fillStyle = "#ff6b1a";
  context.font = '900 25px Arial, sans-serif';
  context.fillText("voleybolokullari.com.tr", 70, footerY + 28);
  context.fillStyle = "#647386";
  context.font = '700 23px Arial, sans-serif';
  context.textAlign = "right";
  context.fillText(`${post.date}  •  ${post.read} okuma`, 1010, footerY + 28);
  context.textAlign = "left";

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG dosyası oluşturulamadı.");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${post.id}-instagram-4x5.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const blogMonthNumbers = {
  Ocak: 0, Şubat: 1, Mart: 2, Nisan: 3, Mayıs: 4, Haziran: 5,
  Temmuz: 6, Ağustos: 7, Eylül: 8, Ekim: 9, Kasım: 10, Aralık: 11,
};

function blogDateValue(dateText) {
  const [day, month, year] = String(dateText || "").split(/\s+/);
  return new Date(Number(year), blogMonthNumbers[month] ?? 0, Number(day)).getTime();
}

function BlogPage() {
  const [category, setCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [exportingPostId, setExportingPostId] = useState("");
  const [exportNotice, setExportNotice] = useState("");
  const postFromPath = () => blogPosts.find((post)=>window.location.pathname.replace(/\/+$/,"").endsWith(`/voleybol-blog/${post.id}`)) || null;
  const [selectedPost, setSelectedPost] = useState(postFromPath);
  const featured = blogPosts.find((post) => post.featured) || blogPosts[0];
  const normalizedQuery = query.trim().toLocaleLowerCase("tr");
  const orderedPosts = [...blogPosts].sort((first, second) => blogDateValue(second.date) - blogDateValue(first.date));
  const categoryCounts = Object.fromEntries(blogCategories.map((item) => [item, item === "Tümü" ? blogPosts.length : blogPosts.filter((post) => post.category === item).length]));
  const filteredPosts = orderedPosts.filter((post) => (category === "Tümü" || post.category === category)
    && (!normalizedQuery || `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase("tr").includes(normalizedQuery)));
  const openPost = (post) => { window.history.pushState({page:"blog",post:post.id},"",`/voleybol-blog/${post.id}/`); setSelectedPost(post); window.scrollTo(0,0); };
  const closePost = () => { window.history.pushState({page:"blog"},"","/voleybol-blog/"); setSelectedPost(null); window.scrollTo(0,0); };
  const exportPost = async (post) => {
    if (exportingPostId) return;
    setExportingPostId(post.id);
    setExportNotice("");
    try {
      await downloadBlogInstagramCard(post);
      setExportNotice("Instagram 4:5 görseli PNG olarak indirildi.");
    } catch (error) {
      setExportNotice(error.message || "Görsel indirilemedi. Tekrar deneyin.");
    } finally {
      setExportingPostId("");
    }
  };
  useEffect(()=>{const onPop=()=>setSelectedPost(postFromPath());window.addEventListener("popstate",onPop);return()=>window.removeEventListener("popstate",onPop)},[]);
  useEffect(()=>{
    if(!selectedPost)return;
    const viewKey=`blog-view:${selectedPost.id}`;
    if(!sessionStorage.getItem(viewKey)){
      sessionStorage.setItem(viewKey,"1");
      sendRegistration({action:"trackBlogView",postId:selectedPost.id,title:selectedPost.title}).catch(()=>sessionStorage.removeItem(viewKey));
    }
    document.title=`${selectedPost.title} | Voleybol Blog`;
    const description=document.head.querySelector('meta[name="description"]');
    const canonical=document.head.querySelector('link[rel="canonical"]');
    if(description)description.setAttribute("content",selectedPost.excerpt);
    if(canonical)canonical.setAttribute("href",`${SITE_URL}/voleybol-blog/${selectedPost.id}/`);
    const schema=document.createElement("script");schema.id="blog-article-schema";schema.type="application/ld+json";schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:selectedPost.title,description:selectedPost.excerpt,image:`${SITE_URL}${selectedPost.image}`,datePublished:"2026-07-29",author:{"@type":"Organization",name:"Online Voleybol Akademisi"},publisher:{"@type":"Organization",name:"Online Voleybol Akademisi"},mainEntityOfPage:`${SITE_URL}/voleybol-blog/${selectedPost.id}/`,keywords:selectedPost.keywords?.join(", ")});document.head.appendChild(schema);
    return()=>schema.remove();
  },[selectedPost]);
  if (selectedPost) return <div className="blog-page blog-article-page"><button className="blog-back" onClick={closePost}>← Blog yazılarına dön</button><article className="blog-article"><div className="blog-article-cover"><img src={selectedPost.image} alt={`${selectedPost.title} konulu gerçekçi voleybol fotoğrafı`}/><span>{selectedPost.category}</span></div><header><small>{selectedPost.date} • {selectedPost.read} okuma</small><h1>{selectedPost.title}</h1><p>{selectedPost.excerpt}</p><div className="blog-keywords">{selectedPost.keywords?.map((keyword)=><span key={keyword}>{keyword}</span>)}</div></header><div className="blog-article-body"><p className="blog-lead">{selectedPost.body}</p>{blogArticleDetails[selectedPost.id]?.map((section)=><section key={section.title}><h2>{section.title}</h2><p>{section.text}</p><ul>{section.points.map((point)=><li key={point}><CheckCircle2/>{point}</li>)}</ul></section>)}<aside><Target/><span><b>Sahaya taşı</b><small>Konuyu okuduktan sonra tek bir teknik hedef seç ve antrenmanda kontrollü tekrarlarla uygula.</small></span></aside></div></article></div>;
  return <div className="blog-page">
    <section className="blog-hero"><div><span className="eyebrow"><Newspaper/> VOLEYBOL BİLGİ MERKEZİ</span><h1>Sahayı daha iyi oku,<br/><em>oyununu geliştir.</em></h1><p>Teknik, taktik, performans ve sporcu sağlığına dair uygulanabilir voleybol içerikleri.</p></div><div className="blog-hero-mark"><span>V</span><i/><small>AKADEMİ BLOG</small></div></section>
    <section className="blog-featured"><div className="blog-featured-image"><img src={featured.image} alt={`${featured.title} kapak görseli`}/><span>ÖNE ÇIKAN YAZI</span><button className="blog-instagram-pin" onClick={()=>exportPost(featured)} disabled={exportingPostId===featured.id} aria-label={`${featured.title} Instagram görselini indir`} title="Instagram 4:5 PNG indir"><Download/></button></div><div><small>{featured.category} • {featured.read} okuma</small><h2>{featured.title}</h2><p>{featured.excerpt}</p><button className="btn" onClick={()=>openPost(featured)}>Yazıyı oku <ArrowRight/></button></div></section>
    <section className="blog-library"><header><div><small>GÜNCEL İÇERİKLER</small><h2>Voleybol blog yazıları</h2></div><label><Search/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Blogda ara" aria-label="Blog yazılarında ara"/></label></header>{exportNotice&&<p className="blog-export-notice" role="status">{exportNotice}</p>}<nav className="blog-categories" aria-label="Blog kategorileri">{blogCategories.map((item)=><button key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}><span>{item}</span><b>{categoryCounts[item]}</b></button>)}</nav>{filteredPosts.length?<div className="blog-grid">{filteredPosts.map((post)=><article className="blog-card" key={post.id}><div><img loading="lazy" src={post.image} alt={`${post.title} konulu gerçekçi voleybol fotoğrafı`}/><span>{post.category}</span><button className="blog-instagram-pin" onClick={()=>exportPost(post)} disabled={exportingPostId===post.id} aria-label={`${post.title} Instagram görselini indir`} title="Instagram 4:5 PNG indir"><Download/></button></div><section><small><CalendarDays/> {post.date}<i>•</i><Clock/> {post.read}</small><h3>{post.title}</h3><p>{post.excerpt}</p><button onClick={()=>openPost(post)}>Devamını oku <ArrowRight/></button></section></article>)}</div>:<div className="blog-empty"><Search/><h3>Yazı bulunamadı</h3><p>Arama kelimesini değiştir veya başka bir kategori seç.</p><button onClick={()=>{setQuery("");setCategory("Tümü")}}>Filtreleri temizle</button></div>}</section>
  </div>;
}

function Header({ page, go, menu, setMenu, account, isAuthenticated, onLogout }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const courseMenuRef = useRef(null);
  const visibleNav = isAuthenticated
    ? nav.filter(([key]) => !["profiles", "demo", "pricing", "register"].includes(key))
    : nav.filter(([key]) => ["home", "junior-referee", "blog", "notebooklm-ai", "demo", "pricing", "register", "profiles"].includes(key));
  const accountTeamLogo = account?.schoolName && !account?.avatar
    ? readSchools().find((school) => school.schoolName === account.schoolName && school.teamLogo)?.teamLogo
      || readAthletes().find((athlete) => athlete.schoolName === account.schoolName && athlete.teamLogo)?.teamLogo || ""
    : "";
  const accountSchool = account?.id?.startsWith?.("OKL-")
    ? account
    : readSchools().find((school) => school.id === account?.schoolId || school.schoolName === account?.schoolName);
  const belongsToAccountSchool = (person) => accountSchool && (person.schoolId && accountSchool.id
    ? String(person.schoolId) === String(accountSchool.id)
    : person.schoolName === accountSchool.schoolName);
  const accountAthleteCount = readAthletes().filter(belongsToAccountSchool).length;
  const accountTrainerCount = readTrainers().filter(belongsToAccountSchool).length;
  useEffect(() => {
    const close = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) setAccountOpen(false);
      if (!courseMenuRef.current?.contains(event.target)) setCourseMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <header className="header">
      <button
        className="brand"
        onClick={() => go("home")}
        aria-label="Ana sayfa"
      >
        <img className="ball" src="/brand-logo-transparent.png" alt="" aria-hidden="true" />
        <span>
          VOLEYBOL
          <br />
          <b>AKADEMİSİ</b>
        </span>
      </button>
      <nav className={menu ? "nav open" : "nav"} aria-label="Ana menü">
        {visibleNav.map(([k, v, Icon]) => k === "courses" ? <div className={`course-nav-menu ${courseMenuOpen ? "open" : ""}`} ref={courseMenuRef} key={k}><button className={["courses","course","lesson","technical-cards"].includes(page)?"active":""} onClick={()=>setCourseMenuOpen((value)=>!value)} aria-expanded={courseMenuOpen}><Icon aria-hidden="true"/><span>{v}</span><ChevronDown/></button>{courseMenuOpen&&<div className="course-nav-dropdown"><button onClick={()=>{setCourseMenuOpen(false);go("courses")}}><BookOpen/><span><b>Tüm Dersler</b><small>Voleybol eğitim kütüphanesi</small></span></button><button onClick={()=>{setCourseMenuOpen(false);go("technical-cards")}}><FileText/><span><b>Teknik Kartlar</b><small>A4 eğitim belgeleri</small></span></button></div>}</div> : (
          <button className={page === k ? "active" : ""} onClick={() => go(k)} key={k}><Icon aria-hidden="true"/><span>{v}</span></button>
        ))}
        {isAuthenticated && account && <div className={`header-account ${accountOpen ? "open" : ""}`} ref={accountMenuRef}>
          <button className="account-profile" onClick={() => setAccountOpen((value) => !value)} aria-label="Hesap menüsünü aç" aria-expanded={accountOpen}><span className="account-visual">{account.avatar ? <ProfileAvatar id={account.avatar}/> : accountTeamLogo ? <TeamLogo src={accountTeamLogo} name={account.schoolName}/> : <UserRound/>}</span><span className="account-label"><small>HESABIM</small></span><ChevronDown className="account-chevron"/></button>
          {accountOpen && <div className="account-dropdown">
            <header><span className="account-dropdown-logo">{account.avatar ? <ProfileAvatar id={account.avatar}/> : accountTeamLogo ? <TeamLogo src={accountTeamLogo} name={account.schoolName}/> : <UserRound/>}</span><span><small>AKTİF HESAP</small><b>{account.name || account.schoolName}</b><em>{accountSchool?.schoolName || account.schoolName || "Voleybol Akademisi"}</em></span></header>
            <div className="account-dropdown-stats"><span><Users/><b>{accountAthleteCount}</b><small>Sporcu</small></span><span><GraduationCap/><b>{accountTrainerCount}</b><small>Antrenör</small></span></div>
            <button className="account-dropdown-profile" onClick={() => { setAccountOpen(false); go("profiles"); }}><UserRound/><span><b>Profil</b><small>Hesap ve kulüp bilgilerini aç</small></span><ArrowRight/></button>
            <button className="account-dropdown-logout" onClick={() => { setAccountOpen(false); onLogout(); }}><LogOut/> Çıkış Yap</button>
          </div>}
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
  const referenceScrollRef = useRef(null);
  const referenceDragRef = useRef({ active:false, startX:0, scrollLeft:0 });
  const registeredSchools = readSchools();
  const schoolCount = new Set(registeredSchools.map((school) => String(school.schoolName || "").trim().toLocaleLowerCase("tr")).filter(Boolean)).size;
  const referenceSchools = [...new Map(registeredSchools.filter((school)=>school.teamLogo).map((school)=>[String(school.schoolName||"").trim().toLocaleLowerCase("tr"),school])).values()];
  const referenceLogoPng = (source) => { const publicSource=publicLogoUrl(source); return /^https?:\/\//i.test(publicSource) ? `https://images.weserv.nl/?url=${encodeURIComponent(publicSource)}&w=160&h=160&fit=contain&output=png` : publicSource; };
  const startReferenceDrag = (event) => { const area=referenceScrollRef.current; if(!area)return; referenceDragRef.current={active:true,startX:event.clientX,scrollLeft:area.scrollLeft}; area.setPointerCapture?.(event.pointerId); area.classList.add("dragging"); };
  const moveReferenceDrag = (event) => { const area=referenceScrollRef.current; if(!area||!referenceDragRef.current.active)return; area.scrollLeft=referenceDragRef.current.scrollLeft-(event.clientX-referenceDragRef.current.startX); };
  const stopReferenceDrag = () => { referenceDragRef.current.active=false; referenceScrollRef.current?.classList.remove("dragging"); };
  const athleteCount = readAthletes().length;
  const trainerCount = new Set(readTrainers()
    .filter((trainer) => String(trainer.status || "AKTİF").toLocaleUpperCase("tr") === "AKTİF")
    .map((trainer) => trainer.id || `${trainer.schoolName || ""}:${trainer.name || ""}`)
    .filter(Boolean)).size;
  const teamCount = new Set(readTeams()
    .filter((team) => String(team.status || "AKTİF").toLocaleUpperCase("tr") === "AKTİF")
    .map((team) => team.id || `${team.schoolId || team.schoolName || ""}:${team.name || ""}`)
    .filter(Boolean)).size;
  const lessonCount = courses.reduce((total, course) => total + Number(course[7] || 0), 0);
  const quickLinks = isAuthenticated
    ? [[BookOpen,"Dersler","courses"],[Video,"Videolar","videos"],[ClipboardCheck,"Sınavlar","exams"]]
    : [[Play,"Demoyu İncele","demo"],[BadgeTurkishLira,"Ücretler","pricing"],[UserRound,"Giriş Yap","profiles"]];
  return (
    <>
      <main className="home-modern">
        <section className="home-modern-hero">
          <div className="home-modern-copy">
            <div className="home-modern-kicker"><Zap/><span>ONLINE VOLEYBOL AKADEMİSİ</span><i>2026</i></div>
            <h1><span>Tekniğini çalış.</span><strong>Oyunu oku.</strong><em>Sahada fark yarat.</em></h1>
            <p>Spor okulları, antrenörler ve sporcular için ders, video ve değerlendirmeyi tek bir gelişim sisteminde buluşturuyoruz.</p>
            <div className="home-modern-actions">
              <button className="btn" onClick={() => go(isAuthenticated ? "courses" : "register")}>
                {isAuthenticated ? "Derslere Başla" : "Spor Okulunu Kaydet"}<ArrowRight/>
              </button>
              {!isAuthenticated && <button className="home-modern-login" onClick={() => go("profiles")}><UserRound/> Sporcu Girişi</button>}
            </div>
          </div>
          <div className="home-modern-stage">
            <span className="home-modern-stage-label">EĞİTİM · GELİŞİM · VOLEYBOL</span>
            <img src="/volleyball-family-hero-transparent.png" alt="Voleybol toplarıyla farklı yaş gruplarından kadın ve erkek sporcular"/>
          </div>
        </section>
        <section className="home-modern-data" aria-label="Platform bilgileri">
          {[[School,schoolCount,"Spor Okulu"],[Users,athleteCount,"Kayıtlı Sporcu"],[GraduationCap,trainerCount,"Kayıtlı Antrenör"],[UserRound,teamCount,"Kayıtlı Takım"],[Video,totalVideoCount,"Toplam Video"],[BookOpen,lessonCount,"Ders Bölümü"]].map(([Icon,value,label])=><span key={label}><Icon/><b>{value}</b><small>{label}</small></span>)}
        </section>
        <section className="home-modern-rail">
          {referenceSchools.length>0&&<div className="home-reference-strip" aria-label="Kayıtlı spor okulları"><small>REFERANSLAR · KAYITLI SPOR OKULLARI</small><div className="home-reference-window" ref={referenceScrollRef} onPointerDown={startReferenceDrag} onPointerMove={moveReferenceDrag} onPointerUp={stopReferenceDrag} onPointerCancel={stopReferenceDrag} onPointerLeave={stopReferenceDrag}><div className="home-reference-track">{referenceSchools.map((school)=><span key={school.id||school.schoolName} title={school.schoolName}><TransparentTeamLogo src={referenceLogoPng(school.teamLogo)} name={school.schoolName}/></span>)}</div></div></div>}
          <div className="home-modern-rail-copy"><small>DİJİTAL GELİŞİM ALANI</small><h2>Öğrenmek tek yönlü değildir.<br/><em>İzle, uygula, ölç.</em></h2></div>
          <div className="home-modern-rail-side">
            <nav aria-label="Hızlı erişim">{quickLinks.map(([Icon,label,page],index)=><button key={page} onClick={()=>go(page)}><i>0{index+1}</i><Icon/><span>{label}</span><ArrowRight/></button>)}</nav>
          </div>
        </section>
      </main>
      {isAuthenticated ? <><section className="section home-modern-library">
        <Title
          eyebrow="EĞİTİM KÜTÜPHANESİ"
          title="26 ders. Tek hedef: daha iyi voleybol."
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
        [Video, totalVideoCount, "Toplam video"],
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
  const hasSheet = sheetBackedCourses.has(c[1]);
  const sheet = useLessonSheet(c[1], hasSheet);
  const baseLessons = useMemo(() => makeLessonSteps(c), [c]);
  const currentLessons = useMemo(() => {
    if (!hasSheet || sheet.status !== "ready") return baseLessons;
    return mergeSheetLessons(baseLessons, sheet.rows, c[1], c[10]);
  }, [baseLessons, c, hasSheet, sheet.rows, sheet.status]);
  const sectionCount = currentLessons.length;
  const isPreparing = sheet.status === "ready" && sectionCount === 0;
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
        {!isPreparing && <div className="meta">
          <span>
            <BookOpen /> {sectionCount} bölüm
          </span>
        </div>}
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

const detailedFaqGroups = [
  { category:"Kayıt ve giriş", intro:"Spor okulu, sporcu ve antrenör hesaplarının oluşturulması ve kullanılması.", items:[
    ["Spor okulu kaydı nasıl yapılır?","Kayıt sayfasında okul adı ve telefon numarasıyla başvuru yapılır. Başvuru yönetici tarafından onaylandıktan sonra okul için altı haneli kullanıcı kodu oluşturulur ve kayıtlı iletişim numarasına iletilir.",{image:"/faq/okul-kaydi.png",alt:"Spor okulu kayıt formunun ekran görüntüsü",caption:"Spor okulu başvuru ekranı",steps:["Kayıt menüsünü açın ve Okul kaydı sekmesini seçin.","Spor okulunun resmi adını ve iletişim kurulacak telefon numarasını yazın.","Başvuruyu gönderin ve yönetici onayını bekleyin.","Onaylanan 6 haneli kullanıcı kodunu güvenli biçimde saklayın."]}],
    ["Sporcu hesabı nasıl oluşturulur?","Sporcu, kayıtlı spor okulunu ve bağlı olduğu takımı seçer; takımın altı haneli kodunu ve @ ile başlayan benzersiz kullanıcı adını girer. Ardından profil görsellerinden birini seçerek hesabını oluşturur.",{image:"/faq/sporcu-kaydi.png",alt:"Sporcu profili oluşturma ekranının görüntüsü",caption:"Sporcu kayıt ve profil seçimi ekranı",steps:["Sporcu kaydı sekmesine geçin.","Bağlı olduğunuz spor okulunu ve takımı seçin.","Takımın 6 haneli kodunu ve @ ile başlayan benzersiz sporcu adını girin.","Voleybolcu profil görselinizi seçip Sporcu profilini oluştur düğmesine basın."]}],
    ["Kulüp hesabına nasıl giriş yapılır?","Kulüp girişinde kayıtlı spor okulunun adı seçilir ve yönetici onayında oluşturulan altı haneli kullanıcı kodu girilir. Bilgiler doğrulandığında kulüp profili ve bağlı kullanıcılar görüntülenir.",{image:"/faq/kulup-girisi.png",alt:"Kulüp hesabı giriş ekranının görüntüsü",caption:"Kulüp profili giriş ekranı",steps:["Giriş Yap sayfasında Kulüp sekmesini seçin.","Kulübünüzü adı veya logosuyla listeden bulun.","6 haneli kulüp kullanıcı kodunu girin.","Profile giriş yap düğmesine basın."]}],
    ["Sporcu hesabına nasıl giriş yapılır?","Sporcu girişinde bağlı olunan kulüp ve takım seçilir. Kayıt sırasında belirlenen @ kullanıcı adı ile takıma ait 6 haneli kod kullanılarak sporcu profiline erişilir.",{image:"/faq/sporcu-girisi.png",alt:"Sporcu hesabı giriş ekranının görüntüsü",caption:"Sporcu profili giriş ekranı",steps:["Giriş Yap sayfasında Sporcu sekmesini açın.","Kayıtlı spor okulunuzu ve takımınızı seçin.","Sporcu kullanıcı adınızı ve takım kodunu girin.","Profile giriş yap düğmesiyle kişisel alanınızı açın."]}],
    ["Antrenör hesabı bir takıma bağlı olmak zorunda mı?","Antrenör kayıt sırasında takım seçmez. Kulübünü ve ayrı antrenör kodunu kullanarak profilini oluşturur; bir veya daha fazla takım atamasını daha sonra kulüp yöneticisi yapar.",{image:"/faq/antrenor-girisi.png",alt:"Antrenör hesabı giriş ekranının görüntüsü",caption:"Kulübe bağlı antrenör girişi",steps:["Kayıt sayfasında Antrenör kaydı sekmesini seçin.","Bağlı olduğunuz kulübü seçin.","Antrenör kullanıcı adınızı ve kulübün paylaştığı antrenör kodunu yazın.","Kayıttan sonra kulüp yöneticisinin takım atamasını bekleyin."]}],
    ["Kullanıcı adım daha önce alınmışsa ne olur?","Sistem aynı @ kullanıcı adının ikinci kez kullanılmasına izin vermez ve adın daha önce alındığını bildirir. Farklı bir kullanıcı adı seçmeniz gerekir."],
    ["Kodumu unutursam ne yapmalıyım?","Kulüp yöneticinizden veya platform destek hattından kodun yeniden paylaşılmasını isteyin. Güvenlik nedeniyle kullanıcı kodunuzu herkese açık alanlarda paylaşmayın."],
  ]},
  { category:"Dersler ve içerikler", intro:"Derslere erişim, seviyeler, konu sırası ve gelişim takibi.", items:[
    ["Dersleri kimler görüntüleyebilir?","Dersler yalnız kayıtlı ve giriş yapmış sporcu, antrenör veya kulüp hesaplarına açıktır. Giriş yapmayan ziyaretçiler tanıtım ve demo alanlarını görebilir."],
    ["Dersler hangi seviyelere göre hazırlanmıştır?","İçerikler başlangıç, orta ve ileri seviye olarak düzenlenir. Başlangıçta temel hareket ve temas, orta seviyede hareketli uygulama ve karar verme, ileri seviyede baskı altında teknik ve taktik kullanım ele alınır."],
    ["Bir derse hangi sırayla çalışmalıyım?","Önce konu anlatımını okuyun, doğru teknik ve yaygın hataları inceleyin, ardından ilgili eğitim videosunu izleyin. Saha uygulamasından sonra konu sınavını çözerek eksiklerinizi belirleyin."],
    ["Ders içerikleri telefonda kullanılabilir mi?","Evet. Ders sayfaları telefon, tablet ve masaüstüne uyumludur. Görseller, konu menüsü ve açıklamalar ekran genişliğine göre düzenlenir."],
    ["Sağlık ve sakatlık içerikleri tıbbi tavsiye yerine geçer mi?","Hayır. İçerikler genel eğitim amaçlıdır. Ağrı, hareket kaybı veya sakatlık şüphesinde antrenmanı durdurup yetkili sağlık profesyoneline başvurun."],
  ]},
  { category:"Eğitim videoları", intro:"Video oynatma, bireysel çalışmalar ve konu kategorileri.", items:[
    ["Eğitim videoları nasıl gruplandırılır?","Videolar parmak pas, manşet, servis, smaç, blok, savunma ve diğer voleybol konularına göre ayrılır. Bireysel antrenman videoları ana eğitim video arşivinden ayrı oynatma listesinde gösterilir."],
    ["Videolar otomatik tekrar oynatılır mı?","Evet. Desteklenen videolar tamamlandığında yeniden başlar. Böylece hareketi kesintisiz izleyebilir ve uygulama sırasında tekrar takip edebilirsiniz."],
    ["Video kartında hangi bilgiler bulunur?","Uygun videolarda sporcu sayısı, top sayısı, çalışmanın amacı ve antrenör önerisi gösterilir. Bu bilgiler çalışmayı saha ortamında doğru kurmanıza yardımcı olur."],
    ["Video açılmıyorsa ne yapmalıyım?","İnternet bağlantınızı kontrol edin, sayfayı yenileyin ve farklı bir tarayıcıda deneyin. Sorun sürerse video başlığıyla birlikte destek ekibine bildirin."],
  ]},
  { category:"Sınavlar ve puanlama", intro:"Konu sınavları, geçme sistemi ve sonuç kayıtları.", items:[
    ["Sınavlar hangi derslere göre hazırlanır?","Her sınav ilgili dersin konu anlatımı, teknik uygulaması, doğru-hata örnekleri ve temel oyun bilgisiyle uyumludur. Sorular çoktan seçmeli ve açıklamalı olarak hazırlanır."],
    ["Bir sonraki sınav ne zaman açılır?","Sporcu veya antrenör mevcut sınavdan belirlenen geçme puanını aldığında sıradaki sınavın kilidi açılır. Kulüp hesabı kontrol amacıyla sınavları kilitsiz görüntüleyebilir."],
    ["Sınav puanı nasıl hesaplanır?","Doğru cevapların toplam soruya oranı yüz puan üzerinden hesaplanır. Sonuç ekranında doğru ve yanlış sayısı, puan ve geçme durumu gösterilir."],
    ["Aynı sınava tekrar girebilir miyim?","Evet. Öğrenme amacıyla sınav tekrar çözülebilir. Katılımcı geçmişinde aynı kişi tek profil altında gösterilir; sınav denemeleri ilgili sınav sonuçlarıyla ilişkilendirilir."],
    ["Sınav sonuçlarını kulübüm görebilir mi?","Kulüp hesabı kendi okuluna bağlı sporcu ve antrenörlerin girdikleri sınavları, puanlarını ve geçme durumlarını kontrol alanında görebilir."],
  ]},
  { category:"Üyelik ve kullanım", intro:"Erişim süresi, cihazlar, oturum ve destek süreçleri.", items:[
    ["Üyelik sınırsız öğrenci içeriyor mu?","Spor okulu üyelik seçenekleri sınırsız öğrenci erişimi için hazırlanmıştır. Güncel aylık ve yıllık ücretler Ücretler sayfasında gösterilir."],
    ["Aynı hesaba farklı cihazlardan erişilebilir mi?","Platform telefon, tablet ve bilgisayarda çalışır. Hesap güvenliği için kullanıcı kodunun yalnız yetkili kişi tarafından kullanılması önerilir."],
    ["Hareketsiz kalınca neden çıkış yapılıyor?","Hesap güvenliği için 15 dakika işlem yapılmadığında oturum sonlandırılabilir. Devam etmek için kulüp ve kullanıcı bilgilerinizle yeniden giriş yapmanız gerekir."],
    ["Daha fazla yardım nasıl alabilirim?","Kayıt, giriş veya içerik sorunlarında İletişim sayfasındaki destek kanalını kullanabilirsiniz. Sorunu bildirirken kullandığınız cihazı, sayfa adını ve gördüğünüz hata mesajını ekleyin."],
  ]},
];

function FAQPage({go}) {
  const [query,setQuery]=useState("");
  const [open,setOpen]=useState("0-0");
  const normalized=query.trim().toLocaleLowerCase("tr-TR");
  const groups=detailedFaqGroups.map((group)=>({...group,items:group.items.filter((item)=>!normalized||`${item[0]} ${item[1]}`.toLocaleLowerCase("tr-TR").includes(normalized))})).filter((group)=>group.items.length);
  useEffect(()=>{
    const schema=document.createElement("script");
    schema.id="faq-page-schema"; schema.type="application/ld+json";
    schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:detailedFaqGroups.flatMap((group)=>group.items).map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))});
    document.head.appendChild(schema);
    return()=>document.getElementById("faq-page-schema")?.remove();
  },[]);
  return <div className="faq-page">
    <section className="faq-page-hero"><span className="eyebrow"><CircleHelp/> YARDIM VE BİLGİ</span><h1>Sık sorulan<br/><em>sorular.</em></h1><p>Kayıttan derslere, eğitim videolarından sınav sonuçlarına kadar akademi hakkında merak edilenleri açık ve anlaşılır biçimde yanıtladık.</p><label><Search/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Sorularda ara" aria-label="Sık sorulan sorularda ara"/></label></section>
    <section className="faq-page-content">
      {groups.length?groups.map((group,groupIndex)=><article className="faq-group" key={group.category}><header><span>{String(groupIndex+1).padStart(2,"0")}</span><div><h2>{group.category}</h2><p>{group.intro}</p></div></header><div>{group.items.map((item,itemIndex)=>{const key=`${groupIndex}-${itemIndex}`,guide=item[2];return <section className={open===key?"open":""} key={item[0]}><button onClick={()=>setOpen(open===key?"":key)} aria-expanded={open===key}><span>{item[0]}</span><ChevronDown/></button>{open===key&&<div className="faq-answer"><p>{item[1]}</p>{guide&&<figure className="faq-guide"><div className="faq-guide-image"><img src={guide.image} alt={guide.alt} loading="lazy"/></div><figcaption><strong>{guide.caption}</strong><ol>{guide.steps.map((step,index)=><li key={step}><span>{index+1}</span><p>{step}</p></li>)}</ol></figcaption></figure>}</div>}</section>})}</div></article>):<div className="faq-no-result"><Search/><h2>Sonuç bulunamadı</h2><p>Farklı bir kelimeyle tekrar arayın.</p><button onClick={()=>setQuery("")}>Aramayı temizle</button></div>}
    </section>
    <section className="faq-support"><div><small>YANIT BULAMADINIZ MI?</small><h2>Size yardımcı olalım.</h2><p>Kayıt ve kullanım sorunlarınız için destek ekibimize ulaşın.</p></div><button className="btn light" onClick={()=>go("contact")}>İletişime geç <ArrowRight/></button></section>
  </div>;
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
  "__ortaOyuncuSinavTaslagi": [
    {
      q: "Orta oyuncunun ralli içindeki temel görev bütünü hangisidir?",
      o: ["Yalnızca servis karşılamak", "Merkez bloğu yönetmek, kanatlara yardım etmek ve birinci tempo tehdidi oluşturmak", "Sadece arka alan savunması yapmak", "Her ikinci topu pas olarak kullanmak"],
      a: 1,
      e: "Orta oyuncu savunmada file merkezini kontrol edip iki kanada blok yardımı yapar; hücumda pasörün önünde veya arkasında hızlı hücum tehdidi oluşturur.",
    },
    {
      q: "File önünde doğru orta oyuncu hazır pozisyonu nasıldır?",
      o: ["Fileye yapışık, dizler kilitli ve eller belde", "Ayaklar omuz genişliğinde, dizler bükülü, ağırlık önde ve eller omuzların önünde", "Sırt fileye dönük ve ağırlık topuklarda", "Ayaklar çapraz, kollar gövdenin arkasında"],
      a: 1,
      e: "Dengeli ve hareket edebilir duruş hem hızlı orta hücumuna sıçramayı hem de iki kanada gecikmeden hareket etmeyi sağlar.",
    },
    {
      q: "Orta oyuncu kısa ve uzun blok geçişlerinde hangi ayak çalışmasını seçmelidir?",
      o: ["Her mesafede yalnız koşu adımı", "Kısa düzeltmede yan adım, daha uzun kanat geçişinde çapraz adım", "Kısa mesafede çapraz, uzun mesafede ayakları sabitleme", "Mesafeden bağımsız tek ayak sıçraması"],
      a: 1,
      e: "Yan adım yakın ve hızlı düzeltmelerde kullanılır. Uzun geçişte çapraz adım hız kazandırır; son adım fileye paralel kapanıp iki ayaklı dengeli sıçramayı hazırlar.",
    },
    {
      q: "Rakip pasörün pas yönünü daha erken okuyabilmek için orta oyuncu hangi ipuçlarını birlikte değerlendirmelidir?",
      o: ["Yalnızca top pasörün elinden çıktıktan sonraki yörüngeyi", "İlk temasın fileye uzaklığını, pasörün omuz-el konumunu ve hücumcuların yaklaşmasını", "Seyirci hareketlerini ve skor tabelasını", "Yalnız rakip orta oyuncunun boyunu"],
      a: 1,
      e: "Okuma top pasörün elinden çıktıktan sonra başlamaz. İlk temasın kalitesi seçenekleri sınırlar; pasörün vücudu ve hücumcuların zamanlaması yön hakkında erken bilgi verir.",
    },
    {
      q: "Orta oyuncu kanada ulaştığında ikili blokta en önemli kapanış hedefi nedir?",
      o: ["Kanat blokçusundan olabildiğince uzak sıçramak", "Kanat blokçusunun iç omzuna yaklaşarak aradaki top geçecek boşluğu kapatmak", "Fileden geriye doğru sıçramak", "Ellerini yalnız kendi başının üzerinde tutmak"],
      a: 1,
      e: "İkili blok homojen bir yüzey oluşturmalıdır. Son iki adımda gövde fileye paralel hale gelir ve orta oyuncu kanat blokçusunun iç omzuna kontrollü biçimde kapanır.",
    },
    {
      q: "Etkili blokta eller ve gövde nasıl yerleştirilmelidir?",
      o: ["Eller yalnız yukarı, kalça geride ve parmaklar kapalı", "Eller file üzerinden rakip alana uzanmış, parmaklar açık ve gövde dengeli", "Bir el aşağıda, bir el arkada", "Kollar dirsekten bükülü ve avuçlar kendi sahasına dönük"],
      a: 1,
      e: "Ellerin file düzlemini geçerek rakip sahaya uzanması blok alanını ve top kontrolünü artırır. Dış el saha içine yönlendirilir, inişte file teması önlenir.",
    },
    {
      q: "Birinci tempo hücumunda orta oyuncunun doğru zamanlaması hangisidir?",
      o: ["Pasör topu bıraktıktan sonra yaklaşmaya başlamak", "İlk temas hedefe giderken yaklaşmak ve pasör teması öncesinde ya da temas anında yükselmek", "Top tepe noktasına çıktıktan sonra son iki adımı atmak", "Pasın düşmesini bekleyip tek adımla sıçramak"],
      a: 1,
      e: "Birinci tempo, pas çıktıktan sonra başlatılamayacak kadar hızlıdır. Biyomekanik araştırmalar da hızlı orta hücumunda yaklaşmanın pas veya karşılamaya göre zamanlandığını belirtir.",
    },
    {
      q: "Birinci tempo hücumunun rakip blok düzenine temel taktik etkisi nedir?",
      o: ["Rakip orta blokçuyu merkez tehdidine bağlayarak kanatlarda çoklu blok kurulmasını zorlaştırmak", "Rakibin servis atmasını engellemek", "Arka alan savunmasını tamamen ortadan kaldırmak", "Her hücumun mutlaka merkezden yapılmasını sağlamak"],
      a: 0,
      e: "Hızlı merkez tehdidi rakip orta blokçunun merkeze tepki vermesini gerektirir; bu durum kanat hücumcularına karşı zamanında birleşik blok kurulmasını zorlaştırabilir.",
    },
    {
      q: "Pasör önündeki hızlı hücumda doğru uygulama hangisidir?",
      o: ["Yaklaşma hattını pasörün koşu yoluyla çakıştırmak", "Topu fileye yapıştırıp her durumda sert vurmak", "Pasöre güvenli mesafe bırakıp topu vuruş omzunun önünde karşılamak", "Yönü yalnız sıçramadan önce belli etmek"],
      a: 2,
      e: "Orta oyuncu pasöre çok yaklaşmadan ayrı koridor kullanır. Vuruş yönü blok arasına, savunma boşluğuna veya bloğun dış eline göre son anda değiştirilebilir.",
    },
    {
      q: "Pasör arkasındaki hızlı hücumda neden ortak başlangıç noktası ve tempo önceden belirlenmelidir?",
      o: ["Pasörün görüşü sınırlı olabileceği ve oyuncuların yaklaşma yollarının çakışmaması gerektiği için", "Orta oyuncunun servis kullanabilmesi için", "Rakip liberonun fileye yaklaşması için", "Topun mutlaka yüksek gönderilmesi için"],
      a: 0,
      e: "Pasör arkası hücumda yaklaşma ayrı bir koridordan ilerler ve son adım pasör temasından önce tamamlanır. Ortak tempo, çarpışmayı ve vurulamaz pası önler.",
    },
    {
      q: "Orta oyuncu bloktan indikten sonra hücuma geçişte ne yapmalıdır?",
      o: ["File altında kalıp topu izlemek", "İki ayakla dengeli inip fileden açılarak hücum başlangıç mesafesini kazanmak", "Doğrudan arka çizgiye koşmak", "Bir sonraki düdüğe kadar blok yerinde beklemek"],
      a: 1,
      e: "Bloktan sonra hızlı açılma, top ve pasörü görüşte tutarak yeniden birinci tempo tehdidi oluşturmayı sağlar; bozuk topta ise oyuncu koruma görevine geçer.",
    },
    {
      q: "Savunmadan çıkan top fileden çok uzaktaysa orta oyuncunun en doğru geçiş kararı nedir?",
      o: ["Körü körüne tam birinci tempo koşusu yapmak", "Kanat hücumuna alan açıp hücum korumasına hazırlanmak", "Pasörü fileye doğru itmek", "Rakip sahaya geçmek"],
      a: 1,
      e: "Top kalitesi hızlı hücum seçeneğini belirler. Fileden çok uzak top birinci tempoyu güvenilmez kılar; orta oyuncu tehdit veya koruma görevini seçerek takım düzenini korur.",
    },
    {
      q: "Servis kullandıktan sonra orta oyuncunun fileye geçişinde doğru öncelik sırası hangisidir?",
      o: ["Topu izlemeden doğrudan fileye koşmak", "Savunma sorumluluğunu korumak, geçiş yollarını kesmemek ve rakip hücum seçeneğine göre fileye yerleşmek", "Arka alan oyuncularının önünde durmak", "Yalnızca rakip servis karşılayıcısını izlemek"],
      a: 1,
      e: "Servis sonrası geçiş rotasyona bağlıdır. Orta oyuncu savunma görevini erken terk etmez, takım arkadaşlarının görüş ve geçiş yolunu kapatmaz, rakip hızlı hücumu varsa merkezi önceliklendirir.",
    },
    {
      q: "Bilimsel maç yükü verileri orta oyuncu antrenmanında hangi özelliğin özellikle geliştirilmesini destekler?",
      o: ["Uzun süre hareketsiz beklemeyi", "Tekrarlı blok ve hücum sıçramaları arasında hızlı toparlanma ve yeniden görev almayı", "Yalnızca servis karşılamayı", "Her sıçramayı mutlaka kişisel maksimum yükseklikte yapmayı"],
      a: 1,
      e: "Elit maç verilerinde orta oyuncuların sıçramalarının büyük bölümü blok eylemlerinden oluşur. Bu nedenle tekrar sıçrama, iniş dengesi ve blok-hücum geçişi pozisyona özgü önem taşır.",
    },
    {
      q: "Orta oyuncunun blok başarısını en kapsamlı değerlendiren ölçüt hangisidir?",
      o: ["Yalnız doğrudan blok sayısı", "Sadece sıçrama yüksekliği", "Doğrudan sayılarla birlikte yumuşatılan, saha içine yönlendirilen toplar ve doğru kapanış", "Fileye temas sayısı"],
      a: 2,
      e: "Etkili blok her zaman doğrudan sayı olmaz. Hücumu yavaşlatan veya savunulabilir alana yönlendiren temaslar ve blok bütünlüğü takım savunmasına ölçülebilir katkı sağlar.",
    },
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
      e: "Voleybol, 1895 yılında William G. Morgan tarafından 'Mintonette' adıyla geliştirildi. Oyunun adı daha sonra topun yere değmeden karşılıklı oynanmasını anlatan 'volley ball' ifadesinden türetildi.",
    },
    {
      q: "FIVB kurallarına göre standart salon voleybolu sahasının ölçüsü nedir?",
      o: ["12 × 6 metre", "16 × 8 metre", "18 × 9 metre", "20 × 10 metre"],
      a: 2,
      e: "Oyun alanı 18 metre uzunluğunda ve 9 metre genişliğindedir. Orta çizgi sahayı 9 × 9 metrelik iki eşit oyun alanına böler.",
    },
    {
      q: "Hücum çizgisinin arka kenarı, orta çizginin ekseninden kaç metre uzaktadır?",
      o: ["2 metre", "3 metre", "4 metre", "4,5 metre"],
      a: 1,
      e: "Her oyun alanındaki hücum çizgisinin arka kenarı, orta çizginin ekseninden 3 metre uzaktadır ve ön bölgeyi sınırlar.",
    },
    {
      q: "Resmî file yüksekliği kadınlar ve erkekler için sırasıyla hangisidir?",
      o: ["2,20 m / 2,35 m", "2,24 m / 2,43 m", "2,30 m / 2,45 m", "2,43 m / 2,24 m"],
      a: 1,
      e: "FIVB kurallarında file yüksekliği kadınlarda 2,24 metre, erkeklerde 2,43 metredir. Ölçüm oyun alanının merkezinden yapılır.",
    },
    {
      q: "Bir takım oyun sırasında sahada kaç oyuncuyla yer alır?",
      o: ["5", "6", "7", "8"],
      a: 1,
      e: "Sahada her takımın altı oyuncusu bulunur. Başlangıç dizilişi, oyuncuların set boyunca izlemesi gereken rotasyon sırasını belirler.",
    },
    {
      q: "Bir takım blok temasının dışında, topu rakip alana göndermek için en fazla kaç vuruş yapabilir?",
      o: ["2", "3", "4", "5"],
      a: 1,
      e: "Takımın topu geri göndermek için en fazla üç vuruş hakkı vardır. Blok teması bu üç takım vuruşundan biri olarak sayılmaz.",
    },
    {
      q: "Bir oyuncu blokta topa temas ettikten sonra takımının kaç vuruş hakkı kalır ve ilk vuruşu kim yapabilir?",
      o: [
        "İki vuruş kalır; blokçu dokunamaz",
        "Üç vuruş kalır; blokçu ilk vuruşu yapabilir",
        "Üç vuruş kalır; yalnız libero dokunabilir",
        "Ralli blok temasıyla sona erer",
      ],
      a: 1,
      e: "Blok teması takım vuruşu sayılmaz. Bu nedenle takımın üç vuruş hakkı devam eder ve blok temasını yapan oyuncu bloktan sonraki ilk vuruşu da yapabilir.",
    },
    {
      q: "Servis karşılayan takım ralliyi kazanırsa aşağıdakilerden hangisi gerçekleşir?",
      o: [
        "Yalnızca servis hakkı kazanır",
        "Sayı alır, servis hakkını kazanır ve saat yönünde döner",
        "Sayı alır fakat aynı dizilişte kalır",
        "Rakip takım rotasyon yapar",
      ],
      a: 1,
      e: "Ralli sayı sisteminde karşılayan takım ralliyi kazandığında bir sayı ve servis hakkı kazanır. Servise geçmeden önce oyuncuları saat yönünde bir pozisyon döner.",
    },
    {
      q: "Saat yönündeki rotasyonda 2 numaralı pozisyondaki oyuncu hangi pozisyona geçer?",
      o: ["1 numaralı sağ arka", "3 numaralı orta ön", "5 numaralı sol arka", "6 numaralı orta arka"],
      a: 0,
      e: "Servis hakkı kazanıldığında rotasyon sırası 2'den 1'e, 1'den 6'ya, 6'dan 5'e, 5'ten 4'e, 4'ten 3'e ve 3'ten 2'ye doğrudur.",
    },
    {
      q: "Karar seti dışındaki bir setin kazanılması için hangi koşul gereklidir?",
      o: [
        "En az iki sayı farkla 21 sayıya ulaşmak",
        "Rakipten önce 25 sayıya ulaşmak",
        "En az iki sayı farkla 25 sayıya ulaşmak",
        "Tam olarak 25-24 kazanmak",
      ],
      a: 2,
      e: "İlk dört set 25 sayı üzerinden oynanır ve seti kazanmak için en az iki sayı fark gerekir. Skor 24-24 olursa oyun iki sayılık fark oluşana kadar sürer.",
    },
    {
      q: "Maç 2-2 olduğunda oynanan karar seti hangi sayı ve fark kuralıyla tamamlanır?",
      o: [
        "15 sayı ve en az iki sayı fark",
        "21 sayı ve tek sayı fark",
        "25 sayı ve en az iki sayı fark",
        "15 sayı ve tek sayı fark",
      ],
      a: 0,
      e: "Beşinci ve karar seti 15 sayı üzerinden oynanır; ancak diğer setlerde olduğu gibi kazanan takımın en az iki sayı farkı bulunmalıdır.",
    },
    {
      q: "Bir voleybol maçını kazanmak için bir takım kaç set kazanmalıdır?",
      o: ["2 set", "3 set", "4 set", "5 set"],
      a: 1,
      e: "Maçı üç set kazanan takım kazanır. Bu nedenle maçlar 3-0, 3-1 veya 3-2 sonuçlanabilir.",
    },
    {
      q: "Başhakemin servis düdüğünden sonra servis atan oyuncu topa kaç saniye içinde vurmalıdır?",
      o: ["5 saniye", "6 saniye", "8 saniye", "10 saniye"],
      a: 2,
      e: "Servis atan oyuncu, başhakemin servis için çaldığı düdükten sonra sekiz saniye içinde topa vurmalıdır.",
    },
    {
      q: "Servis atan oyuncu topa vurduğu veya sıçrayarak servis için yerden ayrıldığı anda hangisini yaparsa ayak hatası oluşur?",
      o: [
        "Vuruştan sonra oyun alanına basarsa",
        "Topu tek eliyle havaya atarsa",
        "Bitiş çizgisine ya da servis bölgesi dışındaki zemine basarsa",
        "Servisten önce topu elinde hareket ettirirse",
      ],
      a: 2,
      e: "Servis vuruşu veya sıçrayışın kalkış anında oyuncu oyun alanına, bitiş çizgisine ya da servis bölgesi dışına basamaz. Vuruştan sonra oyun alanına basmasına veya düşmesine izin verilir.",
    },
    {
      q: "Topun çok küçük bir bölümü bile sınır çizgisine temas ederse hakemin kararı ne olmalıdır?",
      o: ["Dışarı", "İçeride", "Ralli tekrarı", "Yalnız çizgi hakemi karar verir"],
      a: 1,
      e: "Sınır çizgileri oyun alanının içindedir. Topun zemine temas eden herhangi bir bölümü çizgiye değerse top içeride kabul edilir.",
    },
  ],
  "Parmak pas": [
    {
      q: "Ders anlatımına göre parmak pasın temel işlevi hangisidir?",
      o: [
        "Topu yalnızca yükseltmek",
        "Topu eller ve parmaklarla istenilen noktaya yönlendirmek",
        "Topu avuç içinde tutup hedefi beklemek",
        "Rakibin hücumunu file üzerinde durdurmak",
      ],
      a: 1,
      e: "Parmak pas, topun hızını ve yönünü eller ile parmakların kontrollü temasıyla düzenleyerek topu hedeflenen noktaya göndermek için kullanılır.",
    },
    {
      q: "Öne parmak pas için doğru hazır duruş hangisidir?",
      o: [
        "Ayaklar bitişik, dizler kilitli ve kollar aşağıda",
        "Bir ayak önde, vücut dengeli, dirsekler bükülü ve eller yüze yakın",
        "Ağırlık yalnız arka ayakta ve eller bel hizasında",
        "Gövde geride, dirsekler tamamen kapalı",
      ],
      a: 1,
      e: "Dengeli duruşta ayaklar arasında açıklık bulunur ve bir ayak öndedir. Kollar dirseklerden bükülür, eller yüze yakın hazırlanır.",
    },
    {
      q: "Öne parmak pasta top hangi bölgede karşılanmalı ve elin hangi kısmı temas etmelidir?",
      o: [
        "Göğüs hizasında ve avuç içleriyle",
        "Başın arkasında ve bileklerle",
        "Alın hizasında ve parmakların ilk boğumlarıyla",
        "Bel hizasında ve ön kollarla",
      ],
      a: 2,
      e: "Ders içeriğinde topun alın hizasında karşılanması ve temasın parmakların ilk boğumlarıyla yapılması öğretilir. Top avuç içinde tutulmaz veya taşınmaz.",
    },
    {
      q: "Öne parmak pasta dirsek açıklığı ve ellerin biçimi nasıl olmalıdır?",
      o: [
        "Dirsekler bitişik, eller yumruk",
        "Dirsekler omuz genişliğinde, eller bileklere doğru üçgen oluşturacak biçimde",
        "Dirsekler tamamen geride, avuçlar aşağı bakacak biçimde",
        "Kollar çapraz, eller omuzlara temas edecek biçimde",
      ],
      a: 1,
      e: "Dirseklerin omuz genişliğindeki açıklığı ve ellerin oluşturduğu dengeli üçgen, topun iki el arasında simetrik ve kontrollü karşılanmasına yardım eder.",
    },
    {
      q: "Uzak hedefe kontrollü bir parmak pas göndermek için kuvvet üretimi nasıl yapılmalıdır?",
      o: [
        "Yalnız parmakları sertçe açarak",
        "Yalnız omuzları yukarı kaldırarak",
        "Bacaklardan başlayıp gövde, kollar ve ellerle ileri-yukarı uzanarak",
        "Topu avuç içinde daha uzun tutarak",
      ],
      a: 2,
      e: "Ders anlatımındaki bütün-vücut hareketi bilimsel biyomekanik bulgularla uyumludur: hedef mesafesi arttıkça alt ekstremite hareketi kuvvete daha fazla katkı sağlar.",
    },
    {
      q: "Hızlı gelen topun hızını düşürüp pas yönünü kontrol etmek için hangisi uygulanmalıdır?",
      o: [
        "Eller ve bilekler hafifçe geriye uyumlanmalı, ardından hareket hedefe yöneltilmeli",
        "Dizler kilitlenip topa avuç içiyle vurulmalı",
        "Gözler kapatılıp yalnız kollar kullanılmalı",
        "Top başın arkasında bekletilmeli",
      ],
      a: 0,
      e: "Ellerin bileklerle hafifçe geriye uyumlanması geliş hızını yumuşatır. Sonraki ileri-yukarı hareketin hedef yönünde yapılması topun çıkış yönünü kontrol eder.",
    },
    {
      q: "Geriye parmak pasın hazırlığında doğru ağırlık ve gövde kullanımı hangisidir?",
      o: [
        "Ağırlık ön ayağa aktarılır ve gövde öne kapanır",
        "Ağırlık arka ayağa aktarılır, kalça öne gelir, vücut ve baş geriye uyumlanır",
        "İki diz kilitlenir ve omuzlar yana çevrilir",
        "Ağırlık yalnız parmak uçlarına alınır ve gövde sabit tutulur",
      ],
      a: 1,
      e: "Geriye pasta oyuncu topun altına girerken ağırlığını arka ayağa aktarır; kalçanın öne gelmesi ve gövdenin geriye uyumlanması pas yönünü oluşturur.",
    },
    {
      q: "Geriye parmak pasın taktik amacı ders içinde nasıl açıklanmıştır?",
      o: [
        "Servis hızını artırmak",
        "Savunmacıyı ön bölgeye taşımak",
        "Rakip bloku yanıltıp hücumcuya daha rahat top kullanma olanağı sağlamak",
        "Topu mümkün olduğunca fileden uzaklaştırmak",
      ],
      a: 2,
      e: "Geriye pas, pas yönünü son ana kadar belirsiz tutarak blokçuların kararını zorlaştırabilir ve hücum organizasyonunda farklı bir seçenek yaratır.",
    },
    {
      q: "Bir hareketin sıçrayarak parmak pas sayılması için top ne zaman elden çıkarılmalıdır?",
      o: [
        "Sıçramadan hemen önce",
        "Ayaklar yerden kesilmişken",
        "İki ayak yere indikten sonra",
        "Yalnız en yüksek noktadan sonra",
      ],
      a: 1,
      e: "Ders tanımına göre sıçrayarak pasta top, ayaklar yere değmeden elden çıkarılır. Topun konumuna uygun sıçrama zamanlaması ve havadaki denge belirleyicidir.",
    },
    {
      q: "Sıçrayarak parmak pasta denge açısından özellikle vurgulanan davranış hangisidir?",
      o: [
        "Havada yönü sürekli değiştirmek",
        "Bir an havada dengeli kalıp topu zamanında çıkarmak",
        "Topu inişe kadar elde bekletmek",
        "Sıçrarken gözleri hedeften ayırmak",
      ],
      a: 1,
      e: "Havadayken ağırlık merkezinin yönünü değiştirme olanağı sınırlıdır. Bu nedenle zamanlama ve kısa süreli dengeli kalış, doğru temas için önem taşır.",
    },
    {
      q: "Duvarda parmak pas çalışmasının ders içeriğindeki temel uygulama ölçütü hangisidir?",
      o: [
        "Duvara 3 metre uzaktan tek tekrar yapmak",
        "Duvara 10-15 cm yakınlıkta, temel duruşu bozmadan seri pas yapmak",
        "Topu önce yere sektirerek duvara vurmak",
        "Yalnız tek elle pas yapmak",
      ],
      a: 1,
      e: "Duvarda çalışma 10-15 cm yakın mesafede seri uygulanır. Amaç tekrar sayısı artarken temel duruş, alın hizası ve el biçimini korumaktır.",
    },
    {
      q: "Karşılıklı parmak pas sırasında öğretmenin yer değiştirme komutu geldiğinde oyuncu ne yapmalıdır?",
      o: [
        "Top takibini bırakıp doğrudan yeni yere koşmalı",
        "Yer değiştirip hedefe yeniden dönerek paslaşmayı sürdürmeli",
        "Topu tutup çalışmayı durdurmalı",
        "Yalnızca kollarını hedefe çevirmeli",
      ],
      a: 1,
      e: "Hareketli pas çalışmasında ayaklarla yeni konuma geçildikten sonra denge kurulmalı, hedefe yeniden dönülmeli ve top takibi kesilmemelidir.",
    },
    {
      q: "Kayma adımlı parmak pas çalışmasının temel teknik amacı hangisidir?",
      o: [
        "Topa uzanmak için kolları olabildiğince ileri açmak",
        "Ayakları çaprazlayarak en hızlı biçimde dönmek",
        "Ayaklarla topun arkasına geçip temas öncesinde dengeli pozisyon kurmak",
        "Her pası sıçrayarak yapmak",
      ],
      a: 2,
      e: "Kayma adımı oyuncunun gövdesini hedefe dönük tutarak yana hareket etmesine yardım eder. Temas kalitesi için önce topun arkasına geçmek ve dengeyi kurmak gerekir.",
    },
    {
      q: "Üçlü parmak pas çalışmasında ortadaki oyuncunun topu attıktan sonraki görevi nedir?",
      o: [
        "Sırtını topa dönüp beklemek",
        "Her seferinde topun geleceği yöne dönerek hazır beklemek",
        "Sahanın dışına çıkmak",
        "Aynı oyuncuya arka arkaya iki top atmak",
      ],
      a: 1,
      e: "Üçlü çalışmada ortadaki oyuncu değişen pas yönünü erken okumalı, topun geleceği yöne dönmeli ve yeni temas için hazır pozisyon almalıdır.",
    },
    {
      q: "File önü parmak pas çalışmasında topun ve oyuncunun doğru hareket yönü hangisidir?",
      o: [
        "Top fileye dik, oyuncu geriye doğru hareket eder",
        "Top fileye paralel gönderilir, pas veren oyuncu sıra düzenine göre yer değiştirir",
        "Top file üzerinden rakibe atılır, oyuncu yerinde kalır",
        "Top oyuncunun arkasına bırakılır, oyuncu file altından geçer",
      ],
      a: 1,
      e: "Ders uygulamasında oyuncu file önüne koşar, pası fileye paralel olarak sıradaki oyuncunun ön bölgesine gönderir ve ardından belirtilen sıraya geçer.",
    },
  ],
  Manşet: [
    {
      q: "Ders anlatımına göre manşetin temel amacı hangisidir?",
      o: [
        "Topu yalnızca mümkün olduğunca yükseğe kaldırmak",
        "Topu ön kollardan oluşan platformla doğru yükseklik ve açıyla hedefe yönlendirmek",
        "Topu ellerle tutup pasörü beklemek",
        "Rakibin hücumunu file üzerinde durdurmak",
      ],
      a: 1,
      e: "Manşet; servis karşılama, savunma ve oyun kurmada topu ön kollarla kontrol eder. Başarı ölçütü yalnız topun yükselmesi değil, hedefe uygun açı ve yükseklikte gitmesidir.",
    },
    {
      q: "Manşet için doğru hazır bekleme pozisyonu hangisidir?",
      o: [
        "Ayaklar bitişik, dizler kilitli ve ağırlık topuklarda",
        "Ayaklar omuz genişliğinden biraz açık, dizler bükülü, gövde hafif önde ve ağırlık ayakların ön bölümünde",
        "Kalça önde, gövde geride ve kollar baş üzerinde",
        "Dizler düz, omuzlar yukarıda ve topuklar havada",
      ],
      a: 1,
      e: "Alçak ve dengeli hazır duruş, sporcunun sağa, sola, öne veya geriye küçük düzeltme adımlarıyla hızla hareket edebilmesini sağlar.",
    },
    {
      q: "Düz ve simetrik bir manşet platformu oluştururken hangisi yapılmamalıdır?",
      o: [
        "Başparmakları yan yana ve aynı hizada tutmak",
        "Bilekleri aşağı bastırmak",
        "Parmakları birbirine geçirip başparmakları üst üste koymak",
        "Dirsekleri düzleştirip ön kolları aynı seviyeye getirmek",
      ],
      a: 2,
      e: "Parmakların birbirine geçirilmesi ve başparmakların üst üste gelmesi platformda asimetri oluşturabilir. Ders iki farklı el birleştirme yöntemine izin verir; ortak ölçüt düz ve dengeli platformdur.",
    },
    {
      q: "Topun manşette karşılanması gereken ideal temas bölgesi neresidir?",
      o: [
        "Avuç içleri",
        "Dirseklere yakın üst kol bölgesi",
        "Bileklerin biraz üzerindeki düz ve etli ön kol bölgesi",
        "Parmakların ilk boğumları",
      ],
      a: 2,
      e: "Top, iki ön kolun bileklerin biraz üzerinde kalan düz bölgesine temas etmelidir. Eller veya dirseğe yakın düzensiz yüzeyler topun yön kontrolünü azaltır.",
    },
    {
      q: "Manşetten çıkan topun yönünü en doğrudan belirleyen teknik değişken hangisidir?",
      o: [
        "Platformun hedefe göre açısı",
        "Oyuncunun boy uzunluğu",
        "Topun rengi",
        "Ellerin ne kadar sıkıldığı",
      ],
      a: 0,
      e: "Top, temas ettiği yüzeyin açısına göre yön değiştirir. Bu nedenle omuzlar ve düz ön kol platformu hedefe göre ayarlanmalı, temas sonrasında kısa süre korunmalıdır.",
    },
    {
      q: "Yavaş gelen bir top ile hızlı gelen bir top karşılanırken kuvvet kullanımı nasıl değişmelidir?",
      o: [
        "Her iki topa da kollarla aynı sertlikte vurulmalıdır",
        "Yavaş topta bacak desteği artırılmalı; hızlı topta platform sabit tutulup gereksiz kuvvet azaltılmalıdır",
        "Hızlı topta kollar daha büyük açıyla savrulmalıdır",
        "Yavaş top yalnız tek kolla karşılanmalıdır",
      ],
      a: 1,
      e: "Yavaş top ek yönlendirme kuvveti gerektirebilir ve bu kuvvet kontrollü diz açılmasıyla üretilir. Hızlı top zaten yüksek kinetik enerji taşıdığı için sabit platform ve küçük hareket daha iyi kontrol sağlar.",
    },
    {
      q: "Ders içeriğindeki doğru manşet hareket sırası hangisidir?",
      o: [
        "Platformu oluşturma → ayaklarla yerleşme → topu izleme → temas",
        "Ayaklarla yerleşme → dizleri bükme → platformu oluşturma → temas → dizlerle yükselme → hedefe yönlendirme",
        "Kolları savurma → topa koşma → dizleri kilitleme → temas",
        "Topu tutma → hedefi seçme → platformu oluşturma → fırlatma",
      ],
      a: 1,
      e: "Teknik, önce topun arkasına ayaklarla yerleşip dengeli taban kurmayı; sonra platformu oluşturup teması bacak desteğiyle hedefe yönlendirmeyi öğretir.",
    },
    {
      q: "Hareketli bir topa giderken elleri çok erken birleştirmenin temel sakıncası nedir?",
      o: [
        "Topun daha yavaş gelmesine neden olur",
        "Oyuncunun ayak hareketini ve denge düzeltmesini kısıtlar",
        "Servis atan oyuncunun görüşünü kapatır",
        "Platformu otomatik olarak fazla açar",
      ],
      a: 1,
      e: "Ders sıralamasında önce ayaklarla topun arkasına geçilir, son küçük düzeltmeler yapılıp denge kurulduktan sonra eller birleştirilir. Erken birleşme hareket serbestliğini azaltabilir.",
    },
    {
      q: "Sağa veya sola gelen top için yeterli zaman varsa öncelikli çözüm hangisidir?",
      o: [
        "Yalnız kolları yana uzatmak",
        "Ayaklarla topun arkasına geçip omuz ve platformu hedefe yöneltmek",
        "Topu vücudun arkasında karşılamak",
        "Dizleri düzleştirip gövdeyi ters yöne çevirmek",
      ],
      a: 1,
      e: "En güvenilir kontrol, vücudu topun arkasına taşımaktır. Zaman yetersizse omuz seviyesi ve platform açısı kullanılarak yan top hedefe yönlendirilir.",
    },
    {
      q: "Servis karşılamanın hücum organizasyonu açısından doğru amacı hangisidir?",
      o: [
        "Topu herhangi bir şekilde oyunda tutmak",
        "Topu doğrudan rakip alana göndermek",
        "Topu pasörün hedef bölgesine göndererek hücum seçeneklerini açık tutmak",
        "Topu fileye olabildiğince yaklaştırmak",
      ],
      a: 2,
      e: "FIVB eğitim yaklaşımında servis karşılama hücumun ilk adımıdır. Kaliteli karşılama, pasörün topun peşinden koşmadan farklı hücum seçeneklerini kullanabilmesini sağlar.",
    },
    {
      q: "Servis karşılama öncesinde yön tahmini için hangi ipuçları birlikte izlenmelidir?",
      o: [
        "Yalnız skor tabelası",
        "Servisçinin top atışı, omuz açısı, vuruş yönü ve topun uçuş çizgisi",
        "Rakip takımın forma numaraları",
        "Sadece pasörün bulunduğu yer",
      ],
      a: 1,
      e: "Topa vurulmadan önce servisçinin başlangıç konumu, top atışı, omuz ve kol hareketi erken bilgi sağlar; vuruştan sonra topun hızı ve uçuşu değerlendirilir.",
    },
    {
      q: "Topa en iyi açıyla ulaşan oyuncunun servis karşılamada yapması gereken doğru iletişim hangisidir?",
      o: [
        "Sessiz kalıp son anda topa gitmek",
        "Yüksek ve net biçimde 'Bende!' diyerek sorumluluk almak",
        "Top yere yaklaştığında 'Bırak!' demek",
        "Yalnız el işareti kullanmak",
      ],
      a: 1,
      e: "Erken, yüksek ve net iletişim iki oyuncunun aynı topa yönelmesini veya hiç kimsenin sorumluluk almamasını önler. Ders içeriğinde 'Bende, sende, bırak, kısa, uzun, yardım' komutları kullanılır.",
    },
    {
      q: "Hedefe manşet çalışmasında 10 topun tamamı doğrudan hedef alanına giderse sporcu kaç puan alır?",
      o: ["10", "20", "25", "30"],
      a: 3,
      e: "Doğrudan hedef alanına gelen her top 3 puandır. On başarılı top 10 × 3 = 30 puan eder ve bu çalışmanın maksimum puanıdır.",
    },
    {
      q: "Kısa servis ile uzun servise hareket ederken doğru teknik eşleştirme hangisidir?",
      o: [
        "Kısa serviste geriye çapraz; uzun serviste öne uzun adım",
        "Kısa serviste öne hızlı ve sonlarda küçük adımlar; uzun serviste geriye kontrollü veya çapraz adımlar",
        "Her ikisinde de kollar önceden birleştirilerek koşu",
        "Her ikisinde de topun vücudun arkasına düşmesini bekleme",
      ],
      a: 1,
      e: "Kısa topa ilerlerken son adımlar küçültülerek alçak denge kurulur. Uzun top erken okunur, geriye kontrollü hareket edilir ve topun vücudun arkasına geçmesi engellenir.",
    },
    {
      q: "Smaç savunmasında hızlı gelen topu kontrol etmek için en uygun uygulama hangisidir?",
      o: [
        "Kolları topa doğru büyük bir hızla savurmak",
        "Dizleri bükülü tutup sabit platformla topun enerjisini açı üzerinden yönlendirmek",
        "Platformu son anda tamamen açmak",
        "Topu gövdeye çok yakın beklemek",
      ],
      a: 1,
      e: "Smaç topu servis karşılamadan daha hızlıdır. Büyük kol salınımı çıkış hızını artırıp kontrolü bozabilir; alçak duruş, kararlı ön kol platformu ve doğru açı top enerjisinin yönetilmesini sağlar.",
    },
  ],
  "Servis teknikleri": [
    {
      q: "Ders anlatımına göre servisin oyundaki temel teknik ve taktik işlevi hangisidir?",
      o: [
        "Yalnızca topu oyuna sokmak",
        "Oyunu başlatırken rakibin hücum düzenini bozabilen ilk kontrollü hücum eylemi olmak",
        "Sadece savunma yerleşimini değiştirmek",
        "Oyuncu değişikliğini başlatmak",
      ],
      a: 1,
      e: "Servis tamamen sporcunun kontrolünde başlayan bir beceridir. Hedef yalnız topu geçirmek değil; zayıf karşılayıcıyı, boş alanı veya rakibin hücum hazırlığını hedeflemektir.",
    },
    {
      q: "Sağ elini kullanan bir sporcunun alttan servis başlangıç pozisyonu nasıl olmalıdır?",
      o: [
        "Sağ ayak önde, ağırlık ön ayakta ve top sağ elde",
        "Sol ayak önde, sağ ayak geride, top sol elde ve başlangıç ağırlığı arka ayakta",
        "Ayaklar bitişik, dizler kilitli ve top baş üzerinde",
        "Sol ayak geride, gövde tamamen fileye sırtı dönük",
      ],
      a: 1,
      e: "Sağ elini kullanan sporcu vuruş elinin tersindeki sol ayağı öne alır. Bu düzen, ağırlığın arka ayaktan ön ayağa aktarılmasına ve kolun hedefe doğru salınmasına yardım eder.",
    },
    {
      q: "Alttan serviste top bırakma için doğru uygulama hangisidir?",
      o: [
        "Topu baş üstüne yüksek ve dönüşlü atmak",
        "Topu bel hizasında önde tutup vuruş noktasına kısa mesafede bırakmak",
        "Topu vücudun arkasına doğru bırakmak",
        "Topu yere sektirdikten sonra vurmak",
      ],
      a: 1,
      e: "Alttan serviste yüksek bir top atışı gerekmez. Kısa ve tekrarlanabilir bırakış, temas noktasını sabitler ve sporcunun topa koşmak zorunda kalmasını önler.",
    },
    {
      q: "Alttan serviste topun hangi bölümüne, nerede temas edilmelidir?",
      o: [
        "Topun üstüne, başın arkasında",
        "Topun alt-arka bölümüne, bel hizasının önünde",
        "Topun yanına, gövdenin arkasında",
        "Topun merkezine, dizlerin arkasında",
      ],
      a: 1,
      e: "Topun alt-arka bölümüne vücudun önünde yapılan kısa ve net temas, topa ileri-yukarı bir çıkış verir. Tam altına vurmak topu gereğinden fazla yükseltebilir.",
    },
    {
      q: "Serviste verimli kuvvet aktarım sırası hangisidir?",
      o: [
        "El → kol → omuz → gövde → kalça → ayak",
        "Arka ayak → ön ayak → kalça → gövde → omuz → kol → el",
        "Omuz → el → diz → gövde → ön ayak",
        "Yalnız omuz → kol → el",
      ],
      a: 1,
      e: "Servis bir kinetik zincir hareketidir. Kuvvetin yerden başlayıp alt ekstremite, gövde ve üst ekstremite boyunca sırayla aktarılması yalnız kolla vurmaya göre daha verimli ve tekrarlanabilirdir.",
    },
    {
      q: "Alttan servis hedef çalışmasında doğru gelişim sıralaması hangisidir?",
      o: [
        "Dar çizgi hedefi → smaç servis → fileyi geçirme",
        "Fileyi geçirme → oyun alanına düşürme → arka yarı → sağ/sol bölge → pozisyon hedefi",
        "Yalnız maksimum hız → yalnız dip çizgi",
        "Önce sıçrama → sonra top bırakma",
      ],
      a: 1,
      e: "Ders, başarıyı kademeli zorlaştırır: önce servis geçerliliği, ardından derinlik, yön ve numaralı saha bölgesine isabet geliştirilir.",
    },
    {
      q: "Üstten serviste tutarlı top atışının doğru konumu hangisidir?",
      o: [
        "Başın arkasında ve olabildiğince yüksek",
        "Vuruş omzunun biraz önünde, benzer yükseklik ve konumda, mümkün olduğunca dönüşsüz",
        "Vuruş omzunun uzağında ve yana doğru",
        "Gövdenin tam arkasında ve alçak",
      ],
      a: 1,
      e: "Tekrarlanabilir top atışı servis doğruluğunun temelidir. Dersin testinde 10 atışın en az 8'inin vuruş omzunun biraz önündeki hedef alana düşmesi beklenir.",
    },
    {
      q: "Üstten servis temasında doğru teknik hangisidir?",
      o: [
        "Topa başın arkasında, bükülü dirsekle temas etmek",
        "Kolu yüksek noktaya uzatıp topun arkasına açık ve sert avuç içiyle temas etmek",
        "Topa parmak uçlarıyla yumuşak ve uzun temas etmek",
        "Bileği gevşek bırakıp topun altına vurmak",
      ],
      a: 1,
      e: "Top başın üzerinde ve vuruş omzunun biraz önünde karşılanır. Yüksek temas noktası ve sert el yüzeyi, kuvvetin topa kontrollü aktarılmasını sağlar.",
    },
    {
      q: "Yüzen serviste topun dönüşünü azaltmak için hangi teknik birleşim kullanılmalıdır?",
      o: [
        "Topun altına uzun temas ve bileği hızlı kapatma",
        "Arka merkeze kısa-net temas, sert açık el ve sabit bilek",
        "Topun yanına parmak uçlarıyla temas",
        "Elin topu uzun süre takip etmesi",
      ],
      a: 1,
      e: "Arka merkeze kısa temas ve bileğin sabit kalması açısal dönüşü azaltır. Düşük dönüşlü top, hava akımı etkileri nedeniyle alıcı için öngörülmesi güç sapmalar gösterebilir.",
    },
    {
      q: "Yüzen servis topu sürekli dönüyorsa ders verisine göre ilk kontrol edilmesi gereken hata grubu hangisidir?",
      o: [
        "Top atışındaki dönüş, hareketli bilek, merkez dışı temas ve uzun takip hareketi",
        "Dizlerin fazla bükülmesi ve iki ayakla iniş",
        "Hedef bölgenin geniş seçilmesi",
        "Servis sonrası savunmaya erken geçilmesi",
      ],
      a: 0,
      e: "Yüzen servis için topun atıştan başlayarak düşük dönüşlü olması gerekir. Merkez dışı temas, bilek kapanması veya elin topa eşlik etmesi topa istenmeyen dönüş kazandırabilir.",
    },
    {
      q: "Servisi çapraz hedefe yönlendirmenin doğru yolu hangisidir?",
      o: [
        "Başlangıçta gövdeyi düz tutup yalnız son anda bileği çevirmek",
        "Ayak, kalça ve omuzları çapraz hedefe göre ayarlayıp kol hareketini hedef yönünde tamamlamak",
        "Topu yana atıp gözleri kapatmak",
        "Temas noktasını başın arkasına taşımak",
      ],
      a: 1,
      e: "Yön; ayaklar, kalça, omuzlar, temas noktası ve kol yolu tarafından birlikte oluşturulur. Yalnız bilekle son anda yön vermek tutarlılığı azaltır.",
    },
    {
      q: "Sıçrayarak yüzen servisin ayakta yüzen servise göre sağladığı temel mekanik avantaj hangisidir?",
      o: [
        "Topa daha alçak noktada temas etmek",
        "Daha yüksek temas noktası ve daha düz başlangıç açısı oluşturmak",
        "Topa mutlaka üst dönüş vermek",
        "Yaklaşma ritmini ortadan kaldırmak",
      ],
      a: 1,
      e: "Ders içeriği sıçramanın temas yüksekliğini artırdığını öğretir. Biyomekanik araştırmalar da yüksek temasın daha düz çıkış açısı ve daha yüksek başlangıç hızı sağlayabildiğini göstermektedir.",
    },
    {
      q: "Sağ elini kullanan sporcu için derste verilen sıçrayarak servis yaklaşma örneği hangisidir?",
      o: [
        "Sağ → sol → sağ → sıçrama",
        "Sol → sağ → sol → sıçrama → vuruş",
        "Sol → sol → sağ → tek ayak iniş",
        "Sağ → sağ → sol → duruş",
      ],
      a: 1,
      e: "Örnek ritim sol-sağ-sol adımlarından sonra sıçrama ve vuruştur. Adım sayısı kişiye göre değişebilse de top atışı ile yaklaşma ritminin uyumu korunmalıdır.",
    },
    {
      q: "Smaç serviste topa üst dönüş kazandırıp topun hızlı uçuş sonrası rakip sahaya düşmesini sağlayan uygulama hangisidir?",
      o: [
        "Topun altına vurup bileği sabit tutmak",
        "Topun üst-arka bölümüne yüksek temas edip eli topun üzerinden geçirerek bileği öne kapatmak",
        "Topun yanına açık olmayan elle vurmak",
        "Teması başın arkasında yapmak",
      ],
      a: 1,
      e: "Üst-arka temas ve öne kapanan bilek topa ileri dönüş kazandırır. Magnus etkisiyle ilişkili bu dönüş, hızlı topun uçuşunun ilerleyen bölümünde aşağı yönlü sapmasına yardım eder.",
    },
    {
      q: "Kritik sayıda servis seçimi için dersin risk yönetimi ilkesi hangisidir?",
      o: [
        "Her koşulda en yüksek hızlı smaç servisi kullanmak",
        "Servis güvenliği ile rakibi zorlayacak kaliteyi, sporcunun başarı yüzdesi ve hedef genişliğine göre dengelemek",
        "Rakibin dizilişini dikkate almadan rastgele hedef seçmek",
        "Servis sonrası sahaya girmeden sonucu beklemek",
      ],
      a: 1,
      e: "Taktik servis kararı skor, sporcunun başarı yüzdesi ve rakip dizilişine göre verilir. Geniş hedef daha düşük risk; dar çizgi, maksimum hız veya smaç servis daha yüksek risk taşır.",
    },
  ],
  Smaç: [
    {
      q: "Ders anlatımına göre başarılı bir smaç tekniğinin temel amacı hangisidir?",
      o: [
        "Her durumda topa mümkün olan en sert şekilde vurmak",
        "Yaklaşma, sıçrama, kol hareketi ve yüksek teması birleştirerek topu uygun hedefe yönlendirmek",
        "Yalnızca rakip blok oyuncusuna vurmak",
        "Topa file seviyesinin altında temas etmek",
      ],
      a: 1,
      e: "Smaç yalnız kuvvet üretimi değildir. Zamanlama, temas yüksekliği, yön kontrolü ve rakip blok-savunmaya göre karar verme aynı hareket zincirinin parçalarıdır.",
    },
    {
      q: "Smaç yaklaşmasına başlamadan önce doğru hazır pozisyon ve görsel takip hangisidir?",
      o: [
        "Dik ve hareketsiz durup yalnız topu izlemek",
        "Dizler hafif bükülü ve ağırlık önde; servis karşılamayı, pasörü ve yaklaşma alanını takip etmek",
        "Fileye sırtı dönük biçimde pası beklemek",
        "Kollar baş üzerinde kilitli olarak beklemek",
      ],
      a: 1,
      e: "Hücumcu yalnız topu değil oyun akışını okur. Karşılama kalitesi ve pasörün topa yaklaşımı, pasın olası yüksekliği ve yönü hakkında erken bilgi verir.",
    },
    {
      q: "Sağ elini kullanan bir sporcu için üç adımlı smaç yaklaşması hangisidir?",
      o: ["Sağ → sol → sağ → sıçrama", "Sol → sağ → sol → sıçrama", "Sol → sol → sağ → sıçrama", "Sağ → sağ → sol → sıçrama"],
      a: 1,
      e: "Sağ elini kullanan sporcuda üç adımlı sıra sol-sağ-sol şeklindedir. Sol elini kullanan sporcu bunun tersini uygular.",
    },
    {
      q: "Üç adımlı yaklaşmanın doğru hız ritmi hangisidir?",
      o: ["En hızlı → hızlı → yavaş → sıçrama", "Bütün adımlar aynı hızda", "Yavaş → hızlı → en hızlı → sıçrama", "Yavaş → duruş → yavaş → sıçrama"],
      a: 2,
      e: "İlk adım zamanlama ve yönlendirme içindir; son iki adım yaklaşma hızını artırır, frenleme ve sıçrama hazırlığını birleştirir.",
    },
    {
      q: "Yaklaşma sırasında iki kolun geriden öne-yukarı savrulmasının temel işlevi nedir?",
      o: ["Topun dönüşünü azaltmak", "Sıçrama yüksekliğine katkı sağlamak ve vücut dengesini desteklemek", "Yaklaşma hızını tamamen durdurmak", "Fileye yatay hareketi artırmak"],
      a: 1,
      e: "Ders içeriği kol savurmanın sıçramaya yardım ettiğini öğretir. Elit voleybolcularla yapılan biyomekanik çalışmada da kol savurmanın karşı-hareket sıçrama yüksekliğini anlamlı biçimde artırdığı gösterilmiştir.",
    },
    {
      q: "Son iki yaklaşma adımının smaç sıçramasındaki mekanik görevi hangisidir?",
      o: ["Yatay hızı kontrol ederek yukarı yönlü sıçramaya dönüştürmek", "Sporcuyu doğrudan fileye taşımak", "Diz ve kalçayı tamamen kilitlemek", "Sıçramayı tek ayakla tamamlamak"],
      a: 0,
      e: "Hızlı ve birbirine yakın son adımlar ile diz-kalça bükülmesi yaklaşma momentumunun dikey sıçramaya aktarılmasına yardım eder. Sıçrama fileye değil mümkün olduğunca yukarı yönelmelidir.",
    },
    {
      q: "Sıçrama sırasında doğru vuruş kolu hazırlığı hangisidir?",
      o: ["Dirsek omuz altında, el kapalı ve omuz önde", "Dirsek omuz seviyesinin üzerinde, omuz geriye açık ve el rahat-açık", "İki dirsek gövdeye yapışık ve eller belde", "Vuruş kolu tamamen önde ve bilek kapalı"],
      a: 1,
      e: "Yüksek dirsek ve geriye açılan omuz, vuruş kolunun hızlanacağı hareket mesafesini hazırlar. Diğer kol top takibine ve havadaki dengeye yardım eder.",
    },
    {
      q: "Smaçta doğru topa temas noktası ve el hareketi hangisidir?",
      o: ["Başın arkasında, topun altına sert yumrukla temas", "Mümkün olan yüksek noktada ve vücudun biraz önünde; açık elle üst-arka bölgeye temas ve bileği öne kapatma", "Göğüs hizasında parmak uçlarıyla uzun temas", "Top vücudun tam üzerindeyken bileği sabit bırakma"],
      a: 1,
      e: "Yüksek ve öndeki temas kuvvet aktarımını ve saha görüşünü geliştirir. Elin topun üst-arka bölümünden geçmesi ve bileğin kapanması topu ileri-aşağı yönlendirir.",
    },
    {
      q: "Smaç topu sürekli saha dışına gidiyorsa dersin hata analizine göre en olası teknik birleşim hangisidir?",
      o: ["Üst-arka temas ve bileğin kapanması", "Topun altına veya başın arkasında temas ve bileğin kapanmaması", "Topa yüksek noktada ve önde temas", "Gözlerin temasa kadar topu izlemesi"],
      a: 1,
      e: "Topun altına ya da başın arkasında vurmak çıkış açısını yükseltir; bileğin kapanmaması üst dönüşü azaltır. Düzeltme, teması öne-yukarı taşıyıp eli topun üzerinden geçirmektir.",
    },
    {
      q: "Güvenli bir smaç inişinde hangi uygulama doğrudur?",
      o: ["Tek ayakta ve diz kilitli iniş", "İki ayağın ön bölümüyle temas edip diz-kalçayı kontrollü bükmek ve dizlerin içeri kapanmasını önlemek", "Fileye doğru düşerken ayakları çaprazlamak", "Topukları bitiştirip gövdeyi geriye atmak"],
      a: 1,
      e: "İki ayaklı, kontrollü bükülmeli iniş yükün emilmesine ve dengenin korunmasına yardım eder. Araştırmalar smaç iniş mekaniğinin özellikle diz yaralanma riski açısından önemli olduğunu göstermektedir.",
    },
    {
      q: "Yüksek kanat pasında dersin temel zamanlama ilkesi hangisidir?",
      o: ["Top yükselirken sıçra, düşerken yaklaş", "Top yükselirken yaklaş, düşmeye başlarken sıçra ve yüksek noktada vur", "Pasör topa dokunmadan sıçra ve havada bekle", "Top fileye değdikten sonra yaklaş"],
      a: 1,
      e: "Yaklaşma pasın uçuş süresine göre ayarlanır. Yüksek pasta yaklaşma daha geç hızlanabilir; hızlı hücumda ise hücumcu pasörün temasından önce harekete başlar.",
    },
    {
      q: "Bileğin topun üzerinden öne kapanması topun uçuşunu nasıl etkiler?",
      o: ["Topa üst dönüş vererek hızlı uçuş sonrası aşağı yönlü düşüşü destekler", "Topun tamamen dönüşsüz uçmasını sağlar", "Topu yalnızca yukarı yönlendirir", "Top hızını sıfırlar"],
      a: 0,
      e: "Üst-arka temas ve ileri bilek hareketi topa üst dönüş kazandırır. Bu dönüş, topun güçlü ilerlerken rakip saha içine doğru daha erken düşmesine yardım eder.",
    },
    {
      q: "Plase veya kontrollü hücum hangi oyun durumunda tam kuvvetli smaçtan daha uygun olabilir?",
      o: ["Pas fileden uzakken, blok iyi yerleşmişken veya savunmada boş alan varken", "Her pas kusursuz ve blok yokken zorunlu olarak", "Sporcu dengeli ve geniş çapraz tamamen boşken", "Yalnız maçın ilk sayısında"],
      a: 0,
      e: "Plase gelişigüzel yavaş vuruş değildir. Smaç görüntüsü korunarak blok arkası veya savunma boşluğu kısa ve kontrollü temasla hedeflenir.",
    },
    {
      q: "Rakip blok çizgi yönünü kapatıyorsa hücumcunun değerlendirebileceği en mantıklı seçenek hangisidir?",
      o: ["Aynı kapalı alana gözleri kapalı vurmak", "Çapraz alanı, blok dışını veya uygun savunma boşluğunu hedeflemek", "Topu mutlaka üçlü bloğa tam kuvvet göndermek", "Topu tutup yeni karar vermek"],
      a: 1,
      e: "İleri seviye hücumcu blok sayısını, ellerin yönünü ve arka alan savunmasını temas öncesinde okur. Karar, açık kalan bölge ve pas kalitesine göre verilir.",
    },
    {
      q: "Arka alan oyuncusunun kurallara uygun hücum yapması için sıçrama anında hangi koşul sağlanmalıdır?",
      o: ["Hücum çizgisinin önünde iki ayakla sıçramalıdır", "Hücum çizgisinin gerisinden sıçramalı ve çizgiye basmamalıdır; vuruştan sonra ön bölgeye inebilir", "Yalnız tek ayakla sıçramalıdır", "Top file seviyesinin altında olmalıdır"],
      a: 1,
      e: "Ders içeriğine ve FIVB kuralına göre arka hat oyuncusunun kalkış noktası hücum çizgisinin gerisinde olmalıdır. Havada topa vurduktan sonra ön bölgeye inmesi serbesttir.",
    },
  ],
  Blok: [
    {
      q: "Ders anlatımına göre bloğun temel savunma amacı hangisidir?",
      o: [
        "Yalnız doğrudan sayı kazanmak",
        "Rakip hücumu durdurmak veya hücum koridorunu daraltarak topu savunmacılara yönlendirmek",
        "Rakip pasörün fileye yaklaşmasını engellemek",
        "Servis karşılamayı başlatmak",
      ],
      a: 1,
      e: "Blok ilk savunma hattıdır. Başarılı blok yalnız sayı değildir; hücum açısını kapatmak, topun hızını azaltmak veya topu arka alan savunmasının bulunduğu koridora yönlendirmek de etkili sonuçtur.",
    },
    {
      q: "Doğru blok hazır pozisyonu hangisidir?",
      o: [
        "Fileye yaslanmış, dizler düz ve eller belde",
        "Fileye yaklaşık bir kol mesafesinde, ayaklar omuz genişliğinde, dizler hafif bükülü ve eller file seviyesine yakın",
        "Fileden üç metre uzakta, ağırlık yalnız tek ayakta",
        "Ayaklar çapraz, gövde fileye sırtı dönük",
      ],
      a: 1,
      e: "Bir kol mesafesi oyuncuya dikey yükselme ve elleri kontrollü biçimde rakip alana uzatma alanı sağlar. Dengeli ağırlık dağılımı ilk yana hareketi hızlandırır.",
    },
    {
      q: "Blok sıçraması ve inişinin doğru hareket örüntüsü hangisidir?",
      o: [
        "Tek ayakla fileye doğru sıçrayıp sert dizlerle inmek",
        "İki ayakla mümkün olduğunca dikey sıçrayıp iki ayakta yumuşak diz bükümüyle inmek",
        "İleri savrularak orta çizgiye basmak",
        "Sıçrama sırasında gövdeyi yana çevirmek",
      ],
      a: 1,
      e: "Dikey çift ayak sıçrama file temasını ve rakip alanına kontrolsüz geçişi azaltır. İki ayakta kontrollü diz bükümü iniş yükünü karşılamaya ve bir sonraki göreve geçmeye yardım eder.",
    },
    {
      q: "Etkili blokta el ve parmak yerleşimi nasıl olmalıdır?",
      o: [
        "Eller omuzlardan dar, parmaklar kapalı ve avuçlar oyuncuya dönük",
        "Eller omuz genişliğinden biraz açık, parmaklar gergin-aralıklı ve avuçlar rakip sahaya dönük",
        "Bir el yukarıda, diğer el bel hizasında",
        "Başparmaklar dışarı, parmaklar gevşek",
      ],
      a: 1,
      e: "Simetrik ve güçlü el yüzeyi topun geçebileceği alanı küçültür. Ders ölçütünde 10 sıçramanın en az 8'inde ellerin aynı yükseklikte ve simetrik olması beklenir.",
    },
    {
      q: "FIVB eğitim yaklaşımında 'blok penetrasyonu' olarak açıklanan doğru uygulama hangisidir?",
      o: [
        "Ellerin yalnız dikey biçimde yükselmesi",
        "Fileye değmeden elleri file üzerinden rakip alanın içine ve topun geçiş yoluna uzatmak",
        "Gövdenin orta çizgiyi geçmesi",
        "Kolları temas öncesinde geriye çekmek",
      ],
      a: 1,
      e: "Eller yalnız yukarı uzandığında top blokçu ile file arasından veya ellerden aşağı sapabilir. Rakip alana kontrollü uzanma etkili kapatma alanını büyütür; rakibin oyununa müdahale edilmemelidir.",
    },
    {
      q: "Kısa mesafede yan adımla blok hareketinin doğru özelliği hangisidir?",
      o: [
        "Ayakları birbirine çarptırarak ilerlemek",
        "Omuzları fileye paralel tutup son adımda iki ayağı dengeli yerleştirmek",
        "Fileye sırtı dönerek koşmak",
        "Hareketi tek ayak sıçramasıyla bitirmek",
      ],
      a: 1,
      e: "Yan adım kısa mesafede gövdenin fileye dönük kalmasını sağlar. Sıçrama öncesindeki dengeli çift ayak tabanı dikey kuvvet üretimi için gereklidir.",
    },
    {
      q: "Daha uzun mesafede çapraz adımla kanada geçiş nasıl tamamlanmalıdır?",
      o: [
        "Omuzlar fileden çevrilip tek ayakla sıçranarak",
        "İlk ayak yön tarafına açılıp diğer ayak çapraz geçerek ve son adım fileye paralel kapanarak",
        "Ayaklar hiç çaprazlanmadan küçük adımlarla",
        "Son iki adım hızlandırılmadan doğrudan fileye koşularak",
      ],
      a: 1,
      e: "Çapraz adım uzun mesafeyi daha hızlı kapatır. Ancak sıçramadan önce son basışta omuzlar ve iki ayak yeniden fileye paralel ve dengeli konuma getirilmelidir.",
    },
    {
      q: "Rakip pasörü okurken dersin önerdiği bilgi sırası hangisidir?",
      o: [
        "Hücumcu → skor → hakem → top",
        "Karşılama kalitesi → pasörün geliş yönü → omuz/kalça yönü → topun çıkış açısı → hücumcu yaklaşması",
        "Yalnız topun en yüksek noktası",
        "Pasörün forma numarası → file yüksekliği",
      ],
      a: 1,
      e: "Blokçu tek bir ipucuna bağlı kalmaz. Karşılamadan başlayıp pasörün vücut konumu ve top çıkışı üzerinden hücumcunun yaklaşmasına geçen sıra, olası hücum yönünü aşamalı daraltır.",
    },
    {
      q: "Blok sıçrama zamanlaması yüksek ve hızlı hücumlarda nasıl değişmelidir?",
      o: [
        "Her iki durumda da top pasördeyken sıçranır",
        "Yüksek topta hücumcuyla birlikte; hızlı hücumda daha erken tepki verilerek yükselinir",
        "Yüksek topta çok erken, hızlı hücumda çok geç sıçranır",
        "Pas yüksekliği zamanlamayı etkilemez",
      ],
      a: 1,
      e: "Blokçu hücumcunun son iki adımını ve top-hücumcu buluşma noktasını okur. Hızlı tempo daha kısa karar süresi yarattığından tepki daha erken başlar.",
    },
    {
      q: "İkili blokta eller arasından top geçmesini önlemek için doğru koordinasyon hangisidir?",
      o: [
        "İki blokçunun farklı zamanlarda ve farklı koridorlara uzanması",
        "Kanat blokçunun yönü belirlemesi, orta blokçunun yaklaşıp omuz-dirsek-el boşluğunu kapatması ve birlikte yükselmeleri",
        "Orta blokçunun kanat oyuncusundan uzak durması",
        "İki oyuncunun dış ellerini birbirinden uzaklaştırması",
      ],
      a: 1,
      e: "İkili blokta bireysel el alanlarının tek bir kapalı yüzeye dönüşmesi gerekir. Ders başarı hedefi, 10 ikili bloğun en az 8'inde eller arasında koridor bırakmamaktır.",
    },
    {
      q: "Çizgi bloğunda dış elin temel görevi nedir?",
      o: [
        "Anten dışındaki alanı açmak",
        "Antene yakın çizgi koridorunu kapatıp topu saha içine yönlendirecek açı oluşturmak",
        "Çapraz savunmacının görüşünü kapatmak",
        "Fileden geriye çekilmek",
      ],
      a: 1,
      e: "Çizgi görevinde dış el antene yakın alanı kapatır. El rakip alana ve hafifçe saha içine çevrilmezse top bloktan dışarı sapabilir.",
    },
    {
      q: "Hızlı hücuma karşı okuma bloğunun tahmin bloğundan temel farkı nedir?",
      o: [
        "Top oynanmadan rastgele bir hücumcuya sıçramak",
        "Pasörün elleri, karşılamanın kalitesi ve orta hücumcunun yaklaşmasını hızla işleyerek karar vermek",
        "Yalnız rakip servisçiyi izlemek",
        "Sıçramadan fileden uzaklaşmak",
      ],
      a: 1,
      e: "Okuma bloğunda amaç erken tahmin etmek değil, kullanılabilir görsel bilgileri kısa sürede birleştirip doğru hücumcuya yetişmektir.",
    },
    {
      q: "Yumuşak blok dokunuşunun savunma açısından yararı hangisidir?",
      o: [
        "Topu mutlaka rakip sahaya geri göndermek",
        "Topun hızını azaltarak arka alan savunmasına oynanabilir bir top kazandırmak",
        "Blok temasını görünmez yapmak",
        "Takımın sonraki topa dokunmasını engellemek",
      ],
      a: 1,
      e: "Her blok doğrudan sayı olmaz. Kontrollü temas topun enerjisini azaltıp yönünü okunabilir hâle getirerek savunmanın ralliyi sürdürmesine yardım eder.",
    },
    {
      q: "Üçlü blokta doğru kapanma düzeni hangisidir?",
      o: [
        "Her oyuncunun farklı yöne uzanması",
        "Dış blokçunun anten tarafını belirlemesi, iç oyuncuların boşluğu kapatması ve ellerin aynı hücum koridoruna uzanması",
        "Oyuncuların birbirinin ayağına basarak yükselmesi",
        "Orta blokçunun tek başına sıçraması",
      ],
      a: 1,
      e: "Üçlü blok yüksek ve öngörülebilir hücumlarda kurulabilir. Geçiş yolları ve iniş alanları önceden paylaşılmalı, blok yüzeyi tek bir koridoru kapatmalıdır.",
    },
    {
      q: "Blok-savunma koordinasyonunun temel taktik ilkesi hangisidir?",
      o: [
        "Blok ve arka alanın aynı koridoru tamamen boş bırakması",
        "Blok bir hücum koridorunu kapatırken savunmacıların açık kalan alanlara yerleşmesi",
        "Savunmacıların blok görevinden bağımsız rastgele yerleşmesi",
        "Blokçuların inişten sonra oyunu izlememesi",
      ],
      a: 1,
      e: "Blok takım savunmasını yönlendiren bir araçtır. Kapalı ve açık koridorlar kısa iletişimle paylaşılır; blokçu inişte topu bulup savunma ya da yeni hücum görevine geçer.",
    },
  ],
  "Savunma teknikleri": [
    {
      q: "Ders anlatımına göre savunmanın temel amacı hangisidir?",
      o: [
        "Topu yalnızca havaya kaldırmak",
        "Rakip hücumunun yere temasını önleyip kontrollü karşı hücum fırsatı hazırlamak",
        "Her topu doğrudan rakip alana göndermek",
        "Yalnız refleksle ve yerleşim olmadan hareket etmek",
      ],
      a: 1,
      e: "Savunma yalnız topu kurtarmak değildir. Top vurulmadan önce bilgi toplama, doğru alana yerleşme, kontrollü temas ve ardından hücuma geçiş birlikte değerlendirilir.",
    },
    {
      q: "Doğru savunma hazır pozisyonu hangisidir?",
      o: [
        "Ayaklar bitişik, dizler düz ve ağırlık topuklarda",
        "Ayaklar omuz genişliğinden biraz açık, kalça alçak, gövde kontrollü önde ve ağırlık ayakların ön bölümünde",
        "Gövde geride, kollar platform biçiminde kilitli",
        "Ağırlık tek ayakta ve gözler zeminde",
      ],
      a: 1,
      e: "Alçak ve öne yüklenmiş dengeli duruş, farklı yönlere hızlı ilk adım atmayı sağlar. Kollar top gelmeden kilitlenmez; hareket serbestliği korunur.",
    },
    {
      q: "Savunmada ulaşılabilir bir top için ilk teknik öncelik hangisidir?",
      o: [
        "Ayakları kullanmadan kolları topa uzatmak",
        "Hızlı ilk adımla topun arkasına yerleşip temas noktasında yeniden dengelenmek",
        "Doğrudan yere atlamak",
        "Platformu önceden kilitleyerek koşmak",
      ],
      a: 1,
      e: "Dersin temel ilkesi önce ayaklarla topun arkasına girmektir. Yakın toplarda kısa ayarlama, yan toplarda itiş adımı kullanılır ve temas öncesi iki ayak yeniden dengelenir.",
    },
    {
      q: "Savunma manşetinde doğru platform ve temas davranışı hangisidir?",
      o: [
        "Dirsekler bükülü, topa ellerle vurulur",
        "Dirsekler düz, başparmaklar yan yana; top geniş ön kol yüzeyinde karşılanıp enerji hedefe yönlendirilir",
        "Omuzlar yukarı çekilip platform temas anında döndürülür",
        "Kollar topa doğru büyük açıyla savrulur",
      ],
      a: 1,
      e: "Sabit ve simetrik ön kol platformu topun geliş enerjisini öngörülebilir biçimde yönlendirir. Temas anındaki ani bilek veya kol dönüşü çıkış açısını bozar.",
    },
    {
      q: "Önden gelen sert topu savunurken doğru kuvvet kullanımı hangisidir?",
      o: [
        "Kolları topa doğru sertçe savurmak",
        "Topu gövdenin önünde, sabit platformla karşılayıp gelen hızdan yararlanmak",
        "Topu gövdeye değene kadar beklemek",
        "Dizleri tamamen düzleştirerek yukarı vurmak",
      ],
      a: 1,
      e: "Sert hücum zaten yüksek hız taşır. Büyük kol hareketi topa gereksiz ek hız verir; sabit platform ve uygun açı topu fileden 2-3 metre uzaktaki güvenli pasör bölgesine yönlendirebilir.",
    },
    {
      q: "Kısa topa öne hareketin doğru sırası hangisidir?",
      o: [
        "Büyük ilk adım → dik duruş → geç platform",
        "Topu erken fark et → küçük ve hızlı adımlar → son adımda alçal → platformu topun altına getir → yeniden ayağa kalk",
        "Platformu kilitle → geriye adım → tek kol temas",
        "Doğrudan plonjon → yerde bekle",
      ],
      a: 1,
      e: "Kısa topa ilk hareket hızlı fakat kontrollüdür. Küçük adımlar frenleme ve doğru temas noktasına ince ayar sağlar; plonjon ancak ayakla ulaşılamayan durumda düşünülür.",
    },
    {
      q: "Savunmacının hücum öncesi doğru okuma sırası hangisidir?",
      o: [
        "Yalnız top → skor → hakem",
        "Karşılama kalitesi → pasör seçenekleri → hücumcunun yaklaşma açısı → blok yönü → açık alan",
        "Yalnız hücumcunun forma numarası",
        "Bloktan sonra pasörün yönü",
      ],
      a: 1,
      e: "Savunma kararı tek bir görsel ipucuna dayanmaz. Pasör, hücumcu ve blok yerleşiminin birlikte okunması olası vuruş koridorunu temas öncesinde daraltır.",
    },
    {
      q: "Blok çizgi hücumunu kapatıyorsa arka alan savunması nasıl yerleşmelidir?",
      o: [
        "Bütün savunmacılar çizgiye yığılmalıdır",
        "Çapraz ve derin açık alanlar paylaşılmalı, aynı koridorda iki oyuncu gereksiz yere kalmamalıdır",
        "Blok arkasındaki kısa alan tamamen boş bırakılmalıdır",
        "Savunmacılar blok görevini dikkate almamalıdır",
      ],
      a: 1,
      e: "Blok-savunma sistemi kapalı koridora göre açık alanları paylaşır. Blok çizgiyi kapattığında savunma çapraz, derin ve kısa boşluk sorumluluklarını düzenler.",
    },
    {
      q: "Yana uzanma sonrası güvenli yuvarlanma sırası hangisidir?",
      o: [
        "Dirsek → diz → baş",
        "Kalça → yan gövde → omuz; baş korunur ve çene göğse yaklaşır",
        "Baş → omuz → diz",
        "Eller sabitlenir ve bütün ağırlık bileğe verilir",
      ],
      a: 1,
      e: "Kuvvetin geniş vücut yüzeylerine sırayla dağıtılması sert eklem temasını azaltır. Hareket önce minder üzerinde topsuz, sonra kontrollü topla aşamalı öğretilir.",
    },
    {
      q: "Hücumcunun tam kol salınımı yapmaması veya elini topun altına getirmesi hangi savunma kararını destekler?",
      o: [
        "Sert çapraz smaç için geriye kaçmayı",
        "Plase olasılığını okuyup blok arkasındaki kısa alana çıkmayı",
        "Savunmayı tamamen bırakmayı",
        "Yalnız çizgi dışına yerleşmeyi",
      ],
      a: 1,
      e: "Kol hızının azalması ve elin topun altına girmesi kontrollü kısa vuruşun önemli ipuçlarıdır. Blok arkası savunmacısı bir adım önde ve kısa topa hazır kalır.",
    },
    {
      q: "Bloktan seken toplara hazırlanırken en doğru denge stratejisi hangisidir?",
      o: [
        "Ağırlığı vuruştan önce tamamen tek yöne aktarmak",
        "Blok ellerini izleyip dengede kalmak ve yön değişince kısa adımlarla topa yaklaşmak",
        "Top bloktan çıkana kadar gözleri kapatmak",
        "Platformu tek yönde sabitlemek",
      ],
      a: 1,
      e: "Blok teması topun hız ve yönünü ani biçimde değiştirebilir. Ağırlığı nötr tutmak ve kısa düzeltme adımları, beklenmeyen sekmeye tepki süresini destekler.",
    },
    {
      q: "Sert smaç savunmasında topu oynanabilir alana yönlendiren temel değişken hangisidir?",
      o: [
        "Büyük kol salınımı",
        "Gövdenin önündeki sabit platformun pasör hedef bölgesine göre açısı",
        "Ellerin temas anında ayrılması",
        "Topa mümkün olduğunca geç bakmak",
      ],
      a: 1,
      e: "Yüksek hızlı topun momentumu platform tarafından yeniden yönlendirilir. Dersin ileri seviye ölçütü, 20 sert hücumun en az 14'ünü takımın ikinci temas yapabileceği alana taşımaktır.",
    },
    {
      q: "Tek kol savunması hangi durumda tercih edilmelidir?",
      o: [
        "İki kollu dengeli platform mümkünken her zaman",
        "İki kolla ulaşılamayan acil durumda, topu oyunda tutmak için",
        "Bütün servis karşılamalarda",
        "Top doğrudan vücudun önüne gelirken",
      ],
      a: 1,
      e: "Tek kol, yumruk veya el sırtı temel platformun yerine geçmez; erişim sınırındaki top için acil çözümdür. Omuz kontrolsüz gerilmemeli ve düşüş alanı güvenli olmalıdır.",
    },
    {
      q: "Öne plonjonun öğretim ve kullanım ilkesi hangisidir?",
      o: [
        "Her kısa top için ilk seçenektir",
        "Normal adım ve uzanmayla ulaşılamayan top için son seçenektir; minder ve antrenör gözetimiyle aşamalı öğrenilir",
        "Sert zeminde doğrudan oyun hızında başlanır",
        "Temastan sonra eller yere sabitlenip bütün ağırlık bileklere verilir",
      ],
      a: 1,
      e: "Plonjon yüksek riskli bir acil durum tekniğidir. Topsuz kayma ve diz üstü uzanma basamakları öğrenilmeden oyun hızına geçilmez; uygun zemin ve boş iniş alanı gerekir.",
    },
    {
      q: "Savunmadan hücuma geçişin doğru zinciri hangisidir?",
      o: [
        "Savunma teması → yerde kalıp topu izleme",
        "Savunma teması → topun yönünü takip → pasör dışındakilerin hücum yollarını açması → yaklaşma → vuruş sonrası koruma",
        "Savunma teması → herkesin aynı noktaya koşması",
        "Savunma teması → rallinin bittiğini varsayma",
      ],
      a: 1,
      e: "Kaliteli savunma karşı hücumu başlatır. Temas yapan oyuncu ayağa kalkar; diğer oyuncular pasör hedefini, yaklaşma yolunu ve hücum korumasını eş zamanlı kurar.",
    },
  ],
  "__eskiTakımRotasyonlarıSorusu": [
    {
      q: "Servis hakkı kazanıldığında oyuncular hangi yönde döner?",
      o: ["Saat yönünde", "Saat yönünün tersine", "Çapraz", "Dönüş yapılmaz"],
      a: 0,
      e: "Servis karşılayan takım ralliyi kazandığında oyuncular saat yönünde bir pozisyon döner.",
    },
  ],
  "Hücum organizasyonları": [
    {
      q: "Ders anlatımına göre hücum organizasyonu neyi ifade eder?",
      o: [
        "Yalnız son smaç vuruşunu",
        "İlk temastan başlayarak topun planlı hücum vuruşuna dönüştürülmesini ve hücum sonrası geçişi",
        "Sadece pasörün topa dokunmasını",
        "Rakibin servis düzenini",
      ],
      a: 1,
      e: "Hücum organizasyonu karşılama veya savunma, pas, hücum yaklaşmaları, vuruş kararı, koruma ve savunmaya dönüşten oluşan bağlantılı bir takım sürecidir.",
    },
    {
      q: "İdeal üç temaslı hücum zincirinin doğru sırası ve görevi hangisidir?",
      o: [
        "Hücum → pas → karşılama",
        "İlk temas pasör alanına → ikinci temas hücumcuya uygun pas → üçüncü temas hücum vuruşu",
        "İlk temas doğrudan rakibe → ikinci temas blok",
        "Üç oyuncunun da aynı anda topa yaklaşması",
      ],
      a: 1,
      e: "Voleybolun ardışık yapısında sonraki eylemin kalitesi önceki temasa bağlıdır. Araştırmalar da karşılama kalitesinin pas seçeneklerini ve hücum verimini etkilediğini göstermektedir.",
    },
    {
      q: "Pasör hedef alanına gelen kaliteli ilk temas hücuma hangi avantajı sağlar?",
      o: [
        "Pasörü fileye kontrolsüz biçimde sürükler",
        "Pasörün dengeli yerleşip öne-geriye daha fazla hücum seçeneği kullanmasını sağlar",
        "Bütün hücumcuların aynı koridora girmesini sağlar",
        "Yalnız yüksek sol kanat pasına izin verir",
      ],
      a: 1,
      e: "Fileye yakın fakat güvenli uzaklıktaki hedef alan, pasörün topun altına dengeli girmesine ve rakip orta blokçuyu farklı bölgeler arasında karar vermeye zorlamasına yardım eder.",
    },
    {
      q: "Hücumcuların hazırlık konumlarında doğru alan paylaşımı hangisidir?",
      o: [
        "Bütün hücumcular pasörün önünden aynı çizgide geçer",
        "Smaçör sol, pasör çaprazı sağ, orta oyuncu merkez yaklaşma yolunu açar ve yollar çakışmaz",
        "Hücum etmeyen oyuncular hareketsiz kalır",
        "Oyuncular fileye olabildiğince yakın bekler",
      ],
      a: 1,
      e: "Ayrı başlangıç noktaları ve yaklaşma koridorları çarpışmayı önler. Hücum etmeyen oyuncular da bloktan dönen top için koruma görevine yerleşir.",
    },
    {
      q: "Başlangıç seviyesinde yüksek kanat hücumunun güvenli bir seçenek olmasının nedeni nedir?",
      o: [
        "Rakip bloğa hiç zaman vermemesi",
        "Hücumcuya yaklaşma, topu değerlendirme ve dengeli temas için daha fazla süre tanıması",
        "Karşılama kalitesinden tamamen bağımsız olması",
        "Yalnız arka hat oyuncularınca kullanılabilmesi",
      ],
      a: 1,
      e: "Yüksek pas hızlı hücuma göre daha uzun uçuş süresine sahiptir. Bu süre hücumcunun yaklaşma ritmini ve vuruş seçimini düzenlemesini kolaylaştırır; rakip bloğa da yerleşme zamanı verir.",
    },
    {
      q: "Hücum korumasının doğru görevi hangisidir?",
      o: [
        "Smaç vurulunca rallinin bittiğini varsaymak",
        "Bloktan geri dönebilecek top için hücumcunun çevresinde kısa, orta ve derin katmanlar oluşturmak",
        "Bütün oyuncuları dip çizgiye taşımak",
        "Pasörü koruma dışında bırakmak",
      ],
      a: 1,
      e: "Pasör kısa korumayı, diğer oyuncular orta ve derin koridorları paylaşabilir. Ders hedefi kontrollü blok dönüşlerinin 10'da en az 7'sini yeniden oyuna kazandırmaktır.",
    },
    {
      q: "Hücum temposu neyi tanımlar?",
      o: [
        "Servis ile karşılama arasındaki süreyi",
        "Pasörün topa teması ile hücumcunun sıçrama-vuruş anı arasındaki zaman ilişkisini",
        "Sadece topun uçuş hızını",
        "Ralli sonrasındaki dinlenme süresini",
      ],
      a: 1,
      e: "Tempo ortak zamanlama dilidir. Yüksek tempoda hücumcu pas çıktıktan sonra hazırlanır; orta tempoda yaklaşma pasör temasıyla ilerler; hızlı tempoda hazırlık daha erken başlar.",
    },
    {
      q: "Birinci tempo orta hücumunda doğru zamanlama hangisidir?",
      o: [
        "Orta oyuncu pasör topa temas ettikten uzun süre sonra yaklaşır",
        "Orta oyuncu son adımını pasör temasından önce tamamlar ve kısa pasla buluşur",
        "Orta oyuncu top düşmeye başladıktan sonra sıçrar",
        "Hücumcu yalnız yüksek kanat pasını bekler",
      ],
      a: 1,
      e: "Birinci tempoda hücumcu topu beklemez; pasör hedefe gelirken yaklaşmasını tamamlar. Bu hızlı buluşma rakip orta blokçunun zamanını ve yardım mesafesini azaltır.",
    },
    {
      q: "Ön ve arka hızlı hücumun birlikte kullanılmasının taktik amacı hangisidir?",
      o: [
        "Rakip orta blokçuyu merkezde tutup kanat yardımını geciktirmek ve pas yönünü belirsizleştirmek",
        "Bütün hücumcuları aynı noktada toplamak",
        "Pasörün yalnız öne pas vermesini sağlamak",
        "Hücum temposunu tamamen yavaşlatmak",
      ],
      a: 0,
      e: "Benzer başlangıçtan pasörün önü veya arkasına giden hızlı hücumlar rakip orta blokçunun yön kararını zorlaştırır ve kanatta daha uygun eşleşme oluşturabilir.",
    },
    {
      q: "Karşılama fileden 2-3 metre uzakta kaldığında derse göre en uygun hücum yaklaşımı hangisidir?",
      o: [
        "Her koşulda birinci tempo zorlamak",
        "Orta veya yüksek kanat ya da uygun arka alan hücumunu seçmek",
        "Topu fileye kontrolsüz tek elle itmek",
        "Bütün hücumcuların yaklaşmayı bırakması",
      ],
      a: 1,
      e: "Hedef dışı karşılama pasörün hızlı orta seçeneğini sınırlar. Pas kalitesine uygun daha yüksek ve kontrollü pas, hücumun sürdürülebilirliğini artırır.",
    },
    {
      q: "4-2 hücum sisteminin temel yapısı hangisidir?",
      o: [
        "Tek pasör altı rotasyon boyunca oyunu kurar",
        "İki pasör çapraz yerleşir ve ön hatta bulunan pasör oyunu kurar",
        "Arka hattaki iki pasör aynı anda topa gider",
        "Altı oyuncunun tamamı yalnız hücumcu olur",
      ],
      a: 1,
      e: "4-2 temel organizasyon öğretimine uygundur. Ön hat pasörü oyunu kurduğu için takım çoğunlukla iki ana ön hat hücumcusuyla oynar ve hücum çeşitliliği daha sınırlı olabilir.",
    },
    {
      q: "5-1 sisteminde pasörün ön ve arka hat konumu hücumcu sayısını nasıl etkiler?",
      o: [
        "Pasör arka hattayken üç, ön hattayken iki ön hat hücumcusu bulunur",
        "Her iki durumda da yalnız bir hücumcu bulunur",
        "Pasör ön hattayken dört ön hat hücumcusu bulunur",
        "Pasörün konumu hücum organizasyonunu etkilemez",
      ],
      a: 0,
      e: "5-1'de tek pasör süreklilik sağlar. Pasör arka sıradayken üç ön hat hücumcusu vardır; ön sıradayken arka alan hücumu ek seçenek olarak dengeyi artırabilir.",
    },
    {
      q: "6-2 sisteminde oyunu hangi pasör kurar ve bu sistemin hücum avantajı nedir?",
      o: [
        "Ön hat pasörü kurar; iki hücumcu kalır",
        "Arka hat pasörü kurar; ön hat pasörü hücumcuya dönüşür ve üç ön hat hücumcusu korunur",
        "İki pasör aynı topa pas verir",
        "Pasör kullanılmaz; altı hücumcu doğrudan vurur",
      ],
      a: 1,
      e: "6-2 iki pasörün hücum ve blok becerisi gerektiren, rol değişimi yüksek bir sistemdir. Arka hat pasörü hedefe geçerken ön hat pasörü hücum seçeneklerine katılır.",
    },
    {
      q: "Kombine hücumun asıl taktik amacı hangisidir?",
      o: [
        "Hareketi yalnızca karmaşık göstermek",
        "Farklı bölge ve tempolardaki tehditlerle rakip blokta bire bir eşleşme veya kapanma boşluğu oluşturmak",
        "Bütün topları orta oyuncuya vermek",
        "Hücumcuların yaklaşma yollarını çakıştırmak",
      ],
      a: 1,
      e: "Birinci tempo tehdidi, kanat veya arka alan seçeneğiyle eşlendiğinde blokçular bölünür. Etkili kombinasyon için yollar ayrılmalı ve pasör-hücumcu zamanlaması ortak olmalıdır.",
    },
    {
      q: "Kritik sayıda hücum dağılımı yaparken en doğru risk yönetimi hangisidir?",
      o: [
        "Karşılama kötü olsa bile en hızlı ve gösterişli oyunu zorlamak",
        "Karşılama kalitesi, hücumcu ritmi, blok eşleşmesi ve skoru değerlendirip en yüksek yüzdeli hazırlanmış seçeneği kullanmak",
        "Önceki rallileri ve rakip yerleşimini göz ardı etmek",
        "Her topu aynı oyuncuya aynı tempoda vermek",
      ],
      a: 1,
      e: "Hücum dağılımı yalnız alışkanlık değildir. Bilimsel oyun analizleri karşılama, pas bölgesi ve tempo değişkenlerinin pas ve hücum verimiyle ilişkili olduğunu göstermektedir.",
    },
  ],
  "Pozisyon bilgisi": [
    {
      q: "Ders anlatımına göre pozisyon bilgisi oyuncuya ne öğretir?",
      o: [
        "Yalnız servis öncesinde nerede duracağını",
        "Rotasyon sırasını, ralli başladıktan sonraki uzmanlık geçişini ve her oyun aşamasındaki sorumluluğunu",
        "Sadece forma numarasını",
        "Yalnız hücum vuruş tekniğini",
      ],
      a: 1,
      e: "Pozisyon bilgisi sabit bir yer ezberi değildir. Oyuncu servis anındaki yasal dizilişi, top oyuna girdikten sonraki uzmanlık alanını ve hücum-savunma geçiş görevlerini birlikte öğrenir.",
    },
    {
      q: "Altı saha bölgesinin doğru konum eşleştirmesi hangisidir?",
      o: [
        "1 sağ arka, 2 sağ ön, 3 orta ön, 4 sol ön, 5 sol arka, 6 orta arka",
        "1 sol ön, 2 orta ön, 3 sağ ön, 4 sağ arka, 5 orta arka, 6 sol arka",
        "1 orta arka, 2 sol arka, 3 sağ arka, 4 orta ön, 5 sağ ön, 6 sol ön",
        "1 sağ ön, 2 sağ arka, 3 orta arka, 4 sol arka, 5 sol ön, 6 orta ön",
      ],
      a: 0,
      e: "Bölge 1 servis bölgesine yakın sağ arka alandır. Ön hat 4-3-2, arka hat ise 5-6-1 sıralamasıyla tanımlanır.",
    },
    {
      q: "Takım servis hakkını kazandığında doğru saat yönü rotasyon sırası hangisidir?",
      o: [
        "1 → 2 → 3 → 4 → 5 → 6",
        "2 → 1 → 6 → 5 → 4 → 3 → 2",
        "1 → 6 → 3 → 2 → 5 → 4",
        "4 → 1 → 3 → 6 → 2 → 5",
      ],
      a: 1,
      e: "Servis karşılayan takım ralliyi kazanıp servis hakkını aldığında oyuncular bir pozisyon saat yönünde döner. Bölge 2 oyuncusu 1'e geçerek yeni servisçi olur.",
    },
    {
      q: "Ön ve arka hat oyuncularını doğru ayıran seçenek hangisidir?",
      o: [
        "Ön hat 1-6-5, arka hat 2-3-4",
        "Ön hat 4-3-2, arka hat 5-6-1",
        "Ön hat 1-2-3, arka hat 4-5-6",
        "Ön ve arka hat yalnız oyuncu boyuna göre belirlenir",
      ],
      a: 1,
      e: "File önündeki 4, 3 ve 2 ön hat; dip alandaki 5, 6 ve 1 arka hat bölgeleridir. Bu ayrım blok ve hücum yetkilerini etkiler.",
    },
    {
      q: "Arka hat oyuncusunun hücum ve blok sınırlaması hangisidir?",
      o: [
        "Ön bölgede blok yapabilir ve her yerden hücum edebilir",
        "Blok yapamaz; top file üst seviyesindeyken hücumu tamamlayacaksa hücum çizgisinin gerisinden sıçramalıdır",
        "Arka alanda topa hiç dokunamaz",
        "Yalnız servis kullanabilir",
      ],
      a: 1,
      e: "Arka hat oyuncusu blok tamamlayamaz. Arka alan hücumunda kalkış hücum çizgisinin gerisinden yapılır; oyuncu vuruştan sonra ön bölgeye inebilir.",
    },
    {
      q: "Rotasyon bölgesi ile uzmanlık pozisyonu arasındaki fark nedir?",
      o: [
        "İkisi her zaman aynı sabit konumdur",
        "Rotasyon bölgesi servis anındaki sırayı, uzmanlık pozisyonu ralli başladıktan sonra teknik rolün uygulandığı alanı gösterir",
        "Uzmanlık pozisyonu yalnız forma numarasıdır",
        "Rotasyon bölgesi yalnız libero için geçerlidir",
      ],
      a: 1,
      e: "Örneğin pasör bölge 5'te rotasyona başlayabilir; top oyuna girdikten sonra takım arkadaşlarının yolunu kapatmadan file yakınındaki pasör hedef alanına geçer.",
    },
    {
      q: "Pozisyon geçişinde iletişim için 'çizgi' ve 'çapraz' komutları neyi bildirir?",
      o: [
        "Servis sırasını",
        "Blok ve arka alan savunmasının hangi hücum koridorunu paylaşacağını",
        "Oyuncu değişikliği isteğini",
        "Topun dışarı çıktığını",
      ],
      a: 1,
      e: "Kısa ve erken iletişim görev çakışmasını azaltır. Blok bir koridoru kapatırken savunmacılar açık kalan çizgi, çapraz veya kısa alanı paylaşır.",
    },
    {
      q: "Pasörün servis sonrası doğru görev sırası hangisidir?",
      o: [
        "Karşılayıcının yolunu kes → topu bekle → yalnız aynı hücumcuya pas ver",
        "Hedefe güvenli geç → karşılama kalitesini değerlendir → bloğu ve hücumcuları kontrol et → tempo seç → korumaya geç",
        "Doğrudan blok pozisyonuna geç → ikinci topu bırak",
        "Servisten sonra arka alanda sabit kal",
      ],
      a: 1,
      e: "Pasör ikinci topu yönetir ancak geçiş yolu takımın ilk temasını bozmamalıdır. Pas sonrası da savunma veya hücum korumasında yeni görev alır.",
    },
    {
      q: "Smaçör ile pasör çaprazının temel rol farkı hangisidir?",
      o: [
        "Smaçör çoğunlukla bölge 4/6 ve karşılama; çapraz bölge 2/1 hücumu ve rakip smaçöre blok görevindedir",
        "İki oyuncu yalnız libero görevi yapar",
        "Pasör çaprazı her zaman servis karşılamanın merkezindedir",
        "Smaçör blok ve savunmaya katılmaz",
      ],
      a: 0,
      e: "Smaçör sol kanat hücumuyla birlikte sıkça servis karşılar. Pasör çaprazı sağ kanat ve arka alan skor yükünü taşır, ön hatta rakip smaçöre karşı blok kurar.",
    },
    {
      q: "Orta oyuncunun ralli içindeki doğru görev zinciri hangisidir?",
      o: [
        "Dip çizgide bekle → yalnız servis karşıla",
        "File merkezine geç → pasör ve karşılamayı oku → kanada blok yardımı yap → inişten sonra birinci tempo yaklaşmasına geç",
        "Her topu arka alandan hücum et",
        "Bloktan sonra oyundan çık",
      ],
      a: 1,
      e: "Orta oyuncu file boyunca en hızlı blok geçişini yapar ve hücumda pasörle birinci tempo bağlantısı kurar. Görevler arasında hızlı yön değiştirir.",
    },
    {
      q: "Liberonun pozisyon bilgisi açısından doğru tanımı hangisidir?",
      o: [
        "Ön hatta blok ve hızlı hücum uzmanıdır",
        "Farklı formayla oynayan, servis karşılama ve arka alan savunmasında uzmanlaşan oyuncudur",
        "Her rallide ana pasör olmak zorundadır",
        "Yalnız servis atan oyuncudur",
      ],
      a: 1,
      e: "Libero arka alan yerleşimini ve iletişimi güçlendirir; sert hücum, plase ve blok arkası kısa toplarda görev alır. Pasör ilk topu oynadığında ikinci top desteği de verebilir.",
    },
    {
      q: "Üç kişilik temel servis karşılama dizilişinde doğru görev paylaşımı hangisidir?",
      o: [
        "Pasör, libero ve orta oyuncu bütün alanı paylaşır",
        "İki smaçör sağ/sol veya orta koridorları, libero en geniş ve zor alanı paylaşır; pasör hedefe geçiş yolunu açık tutar",
        "Bütün oyuncular aynı topa yönelir",
        "Hücumcular yaklaşma alanlarını kapatır",
      ],
      a: 1,
      e: "Karşılama düzeni servis yönü ve karşılayıcı gücüne göre ayarlanır. Amaç sorumluluk çakışmasını önlerken pasörün geçişini ve hücumcuların yaklaşmasını açık tutmaktır.",
    },
    {
      q: "4-2, 5-1 ve 6-2 sistemlerini doğru karşılaştıran seçenek hangisidir?",
      o: [
        "4-2'de iki ön hat pasörü dönüşümlü; 5-1'de tek pasör; 6-2'de arka hattaki iki pasörden biri oyunu kurar",
        "Üç sistemde de pasör kullanılmaz",
        "5-1'de beş pasör bulunur",
        "6-2'de ön hat pasörü her zaman oyunu kurar",
      ],
      a: 0,
      e: "4-2 temel ve daha sade geçişler sunar. 5-1 tek pasörle tempo sürekliliği sağlar. 6-2'de arka hat pasörü kurar, ön hat pasörü hücumcu olarak üç ön hat hücumcusunu korur.",
    },
    {
      q: "Servis anında üst üste binme hatasını önlemek için oyuncu hangi ilişkileri kontrol etmelidir?",
      o: [
        "Yalnız fileye uzaklığını",
        "Sağ-sol komşusunu ve kendisine karşılık gelen ön-arka oyuncuyla konum ilişkisini",
        "Yalnız servisçinin ayaklarını",
        "Rakibin forma dizilişini",
      ],
      a: 1,
      e: "Oyuncu bütün sahayı ezberlemek yerine komşuluk ilişkilerini kontrol eder. Servis vuruşuna kadar sıra korunur; sonrasında uzmanlık geçişi yapılabilir.",
    },
    {
      q: "Ralli içinde takım dengesini koruyan doğru geçiş davranışı hangisidir?",
      o: [
        "Oyuncuların önceki görevlerinde sabit kalması",
        "Pasörün hedefe, hücumcuların ayrı yaklaşma yollarına, hücum etmeyenlerin korumaya ve top rakibe geçince herkesin savunmaya geçmesi",
        "Bütün oyuncuların yalnız topun bulunduğu noktaya koşması",
        "Blokçuların inişten sonra oyunu bırakması",
      ],
      a: 1,
      e: "Voleybol sürekli bir geçiş oyunudur. Uzman pozisyonlar ayrı olsa da takım şekli karşılama, hücum, koruma, blok ve savunma aşamalarına göre birlikte değişir.",
    },
  ],
  "Pasör eğitimi": [
    {
      q: "Pasör, top karşı sahadayken hangi hazır pozisyonu kullanmalıdır?",
      o: ["Dizler hafif bükülü, ağırlık ayakların önünde ve baş yukarıda", "Dizler kilitli, ağırlık topuklarda ve eller aşağıda", "Gövde geride, ayaklar bitişik ve bakış yalnızca filede", "Sürekli sıçrayarak ve kolları yukarıda"],
      a: 0,
      e: "Dengeli ve alçak hazır pozisyon ilk adımı hızlandırır; pasör aynı anda topu, karşılayıcıyı ve hedef bölgesini izleyebilir.",
    },
    {
      q: "Pasör hedef bölgesine giderken dengeyi koruyan doğru ayak çalışması hangisidir?",
      o: ["İlk adımları yavaş, son adımı mümkün olduğunca uzun atmak", "Topun yanından geçip geriye doğru dönmek", "İlk adımları hızlı, son iki adımı küçük ve kontrollü yapmak", "Fileye ulaşana kadar tek ayak üzerinde ilerlemek"],
      a: 2,
      e: "Pasör ilk temasın açısını erken okuyup hızlı hareket eder; son iki adımı küçülterek topun altında dengelenir ve fileden güvenli mesafe bırakır.",
    },
    {
      q: "Parmak pasla set verirken doğru temas noktası ve el biçimi nasıldır?",
      o: ["Top avuç içine alınır ve göğüs hizasından itilir", "Top alnın biraz önünde, açık ve simetrik parmaklarla karşılanır", "Top başın arkasına düşürülüp bileklerle savrulur", "Top yalnızca baskın elin parmak uçlarıyla yönlendirilir"],
      a: 1,
      e: "Eller topun biçimine uygun açılır, başparmaklar birbirine bakar ve iki el topa alnın biraz önünde eş zamanlı kuvvet uygular.",
    },
    {
      q: "Pasın mesafe ve yüksekliğini tutarlı üretmek için kuvvet hangi sırayla aktarılmalıdır?",
      o: ["Yalnızca parmaklardan", "Bileklerden omuzlara, sonra dizlere", "Diz ve kalçadan gövdeye, dirseklere ve parmaklara", "Sadece dirsekleri hızla kilitleyerek"],
      a: 2,
      e: "Ders içeriğindeki kuvvet zinciri diz ve kalçanın açılmasıyla başlar; gövde, dirsek ve parmakların uyumlu uzanışıyla top hedefe yönelir.",
    },
    {
      q: "Hedeften uzak ve dengesiz bir ilk temasta pasörün önceliği ne olmalıdır?",
      o: ["Her durumda birinci tempo oynamak", "Topu fileye mümkün olduğunca yaklaştırmak", "Hücum edilebilir, yüksek ve takım dengesini koruyan güvenli bir pas üretmek", "İkinci topu doğrudan rakip bloğa göndermek"],
      a: 2,
      e: "Araştırmalar karşılama kalitesinin pas etkinliğini sınırladığını gösterir. Ders de kötü ilk temasta hızlı hücumu zorlamak yerine güvenli kanat veya uygun arka alan seçimini öğretir.",
    },
    {
      q: "Öne ve geriye pasın rakip blok tarafından erken okunmasını azaltan uygulama hangisidir?",
      o: ["Geriye pasta beli temastan çok önce geriye açmak", "Her iki yönde hazırlık görüntüsünü mümkün olduğunca benzer tutmak", "Öne pasta topu göğüs hizasına indirmek", "Geriye pasta topu başın arkasında bekletmek"],
      a: 1,
      e: "Benzer hazırlık duruşu pas yönünü gizler. Geriye pasta temas yine alın hizasında yapılır; top başın arkasına düşürülmez ve bel aşırı çukurlaştırılmaz.",
    },
    {
      q: "Orta oyuncuyla birinci tempo hücumunda doğru zamanlama hangisidir?",
      o: ["Orta oyuncu pasör topu bıraktıktan sonra yaklaşmaya başlar", "Pasör topu yüksek gönderir, orta oyuncu tepe noktasını bekler", "Orta oyuncu pasör temasından önce sıçrama hazırlığına girer ve top yükselirken ellerden çıkar", "Kötü karşılamada da aynı hızlı pas mutlaka uygulanır"],
      a: 2,
      e: "Birinci tempoda orta oyuncunun son adımı ile pasörün teması birlikte okunur; hücumcu yükselirken kısa yörüngeli pas vuruş eline yönelir.",
    },
    {
      q: "Sıçrayarak pas hangi durumda doğru bir seçimdir?",
      o: ["Pasör topun altına erken gelmiş ve iki ayakla dengeli sıçrayabiliyorsa", "Pasör topa geç kalmış ve fileye temas riski varsa", "Top pasörün çok gerisinde ve denge kurulmamışsa", "Her bozuk topta hücumu hızlandırmak için"],
      a: 0,
      e: "Sıçrayarak pas temas noktasını yükseltip tempoyu hızlandırabilir; ancak yalnızca erken yerleşme, temiz temas ve güvenli iniş mümkünse kullanılmalıdır.",
    },
    {
      q: "Pasör rakip bloğu okurken aşağıdaki bilgilerden hangisini özellikle değerlendirmelidir?",
      o: ["Yalnızca tribündeki seyirci sayısını", "Orta blokçunun başlangıç yeri, omuz-kalça yönü ve ilk hareketini", "Sadece kendi formasının numarasını", "Yalnızca servis atan oyuncunun boyunu"],
      a: 1,
      e: "Rakip orta blokçunun başlangıç mesafesi ve ilk hareketi, kanat blokçularının konumu ve savunmada açık kalan alan hücum tercihini belirleyen görsel ipuçlarıdır.",
    },
    {
      q: "Pasör için ‘hücumcuları dengeli kullanmak’ ne anlama gelir?",
      o: ["Her hücumcuya mutlaka eşit sayıda top vermek", "Topları sırayla ve değişmez düzende dağıtmak", "Karşılama kalitesi, hücumcu ritmi, blok eşleşmesi ve skora göre dağılım yapmak", "Yalnızca en uzun oyuncuya pas vermek"],
      a: 2,
      e: "Dengeli dağılım matematiksel eşitlik değildir; amaç seçenekleri canlı tutup rakip bloğu kararsız bırakırken en yüksek başarı olasılığına sahip hücumu seçmektir.",
    },
    {
      q: "İyi bir karşılamada orta oyuncu tehdidini canlı tutmak neden önemlidir?",
      o: ["Rakip orta blokçuyu merkeze bağlayıp kanatlarda daha elverişli eşleşme oluşturabilir", "Pasörün savunma yapmasını tamamen engeller", "Topun fileye temas etmesini zorunlu kılar", "Her rallinin mutlaka orta hücumla bitmesini sağlar"],
      a: 0,
      e: "Birinci tempo seçeneğinin kullanılabilir olması rakip orta blokçunun kararını zorlaştırır; böylece kanat ve arka alan hücumları için blok yapısı ayrıştırılabilir.",
    },
    {
      q: "Bilimsel bulgulara göre genç oyuncularda pas etkinliğini güçlü biçimde öngören değişkenler hangileridir?",
      o: ["Forma rengi, seyirci sayısı ve mola süresi", "Karşılama etkinliği, pas tekniği ve pas temposu", "Yalnızca pasörün boyu ve yaşı", "Sadece maçın oynandığı salon"],
      a: 1,
      e: "Genç erkek ve kadın voleybolcularda yapılan performans analizi, karşılama etkinliği ile pas tekniği ve temposunun pas etkinliğinin temel yordayıcıları olduğunu göstermiştir.",
    },
    {
      q: "Pasörün ikinci top hücumunu seçmesi için en uygun oyun durumu hangisidir?",
      o: ["Rakip savunmada boş alan varken pasör dengeli ve top güvenli yükseklikteyse", "Top fileye çok yakın ve rakip blok hazırsa", "Pasör dengesizken ve fileye temas riski altındayken", "Kritik sayıda boş alanı görmeden sürpriz yapmak istediğinde"],
      a: 0,
      e: "İkinci top hücumu, boş alan görülüp top kontrol altındayken anlamlıdır; pasör sayı olasılığını takımın düzenini bozma ve doğrudan hata riskiyle birlikte değerlendirmelidir.",
    },
    {
      q: "Set sonundaki kritik bir sayıda pasör hangi karar sürecini kullanmalıdır?",
      o: ["Önceki planı koşullar ne olursa olsun tekrarlamak", "Sadece en son sayı alan oyuncuya pas vermek", "Skor, ilk temas kalitesi, hücumcunun güncel ritmi ve rakip blok eşleşmesini birlikte değerlendirmek", "Hücumculara bakmadan en hızlı pası vermek"],
      a: 2,
      e: "Kritik sayıda güvenilir hücum ile uygun eşleşme bir araya getirilir; bozuk ilk temasta risk azaltılır ve karar verildikten sonra pas doğru tempoyla uygulanır.",
    },
    {
      q: "Pasör topu gönderdikten sonra rallideki doğru devam davranışı nedir?",
      o: ["Pası izleyerek bulunduğu yerde kalmak", "Hemen saha dışına çıkmak", "Hücum korumasına veya belirlenen savunma görevine geçmek", "File dibinde sırtı oyuna dönük beklemek"],
      a: 2,
      e: "Pasörün görevi temasla bitmez; pas sonrasında hücum koruması ya da savunma pozisyonuna geçmesi bloktan dönen topların oyunda tutulması için gereklidir.",
    },
  ],
  "Libero eğitimi": [
    {
      q: "Liberonun takım içindeki temel uzmanlık görevi hangisidir?",
      o: ["Ön hatta blok ve hızlı hücum yapmak", "Arka alan savunmasını ve servis karşılama düzenini yönetmek", "Yalnızca servis atmak", "Her rallide ikinci hakemle iletişim kurmak"],
      a: 1,
      e: "Libero ilk teması pasörün hücum kurabileceği kaliteye taşır, arka alan savunmasını yönlendirir ve topun oyunda kalmasına katkı sağlar.",
    },
    {
      q: "FIVB 2025–2028 kurallarına göre libero için doğru ifade hangisidir?",
      o: ["Ön hatta blok tamamlayabilir", "Top file üstündeyken her konumdan hücum tamamlayabilir", "Arka hat oyuncusudur; blok yapamaz veya blok girişiminde bulunamaz", "Takım arkadaşlarından farklı forma giymesi gerekmez"],
      a: 2,
      e: "Libero arka hat uzmanıdır, ayırt edici forma giyer ve blok yapamaz ya da blok girişiminde bulunamaz. Hücum ve pas davranışlarında da özel sınırlamaları vardır.",
    },
    {
      q: "Libero kendi ön bölgesinden parmak pas verdiğinde takım arkadaşı bu topa nasıl hücum edebilir?",
      o: ["Top tamamen file üstündeyken hücumu tamamlayamaz", "Topun yüksekliğine bakılmadan serbestçe smaç vurabilir", "Yalnızca arka çizginin gerisinden sıçrarsa vurabilir", "Topa yalnız libero yeniden temas edebilir"],
      a: 0,
      e: "FIVB kuralına göre liberonun ön bölgeden yaptığı parmak pasından gelen top tamamen file üstündeyken hücum vuruşu tamamlanamaz; aynı hareket ön bölge dışından yapılırsa bu sınırlama uygulanmaz.",
    },
    {
      q: "Servis karşılamada doğru libero hazır duruşu hangisidir?",
      o: ["Ayaklar bitişik, dizler kilitli ve ağırlık topuklarda", "Ayaklar dengeli açık, dizler bükülü, gövde hafif önde ve eller ayrı", "Kollar önceden birleşmiş, gövde dik ve hareketsiz", "Bir ayak havada, eller başın üzerinde"],
      a: 1,
      e: "Alçak ve hareket edebilir duruş tepki süresini destekler. Kolları çok erken birleştirmemek, kısa ayırma adımıyla farklı yönlere çıkmayı kolaylaştırır.",
    },
    {
      q: "Manşetle servis karşılamada topun yönünü kontrol eden temel unsur nedir?",
      o: ["Kolları temas anında sertçe yukarı savurmak", "Topa yalnız bileklerle vurmak", "Sabit ön kol platformunun açısını hedefe yöneltmek", "Dirsekleri bükerek topu avuçlarda taşımak"],
      a: 2,
      e: "Topun çıkış yönünü büyük ölçüde platform açısı belirler. Eller sabitlenir, ön kollar dengeli temas yüzeyi oluşturur ve bacaklarla topun arkasına gelinir.",
    },
    {
      q: "Kısa servise hareket ederken doğru uygulama hangisidir?",
      o: ["Gövdeyi öne atıp ilk anda tek elle uzanmak", "Küçük ve hızlı adımlarla topun arkasına geçip alçak son adımla dengelenmek", "Top yere yaklaşana kadar yerinde beklemek", "Uzun çapraz adımla topun yanından geçmek"],
      a: 1,
      e: "Libero kısa topu temas sonrasında okur, küçük adımlarla ilerler ve mümkünse iki kollu platform kullanır. Tek el yalnız yetişilemeyen top için son çözümdür.",
    },
    {
      q: "Derin servise karşı liberonun geriye yaslanmak yerine yapması gereken nedir?",
      o: ["Geri ve yana adımlarla alan açıp teması vücudun önünde yapmak", "Kolları erken birleştirip yalnız üst gövdeyi geriye kaçırmak", "Platformu doğrudan fileye çevirmek", "Topu omuz hizasında tek elle durdurmak"],
      a: 0,
      e: "Geri-yan veya çapraz geri adım topun arkasında alan oluşturur. Böylece gövde devrilmeden, platform pasör hedef alanına dönükken kontrollü temas yapılabilir.",
    },
    {
      q: "Blok çizgi yönünü kapatmıyorsa libero savunmada nereye öncelik vermelidir?",
      o: ["Blokçunun tam arkasındaki kapalı alana", "Dış omuz hattına yakın çizgi koridoruna", "File dibinde orta oyuncunun yanına", "Sahanın dışına"],
      a: 1,
      e: "Savunma konumu ezberlenmiş sabit bir nokta değildir. Libero kendi bloğunun açık bıraktığı koridoru görmeli; çizgi kapanmamışsa çizgi tehdidine göre yerleşmelidir.",
    },
    {
      q: "Blok çizgiyi etkili biçimde kapattığında liberonun sorumluluğu nasıl değişir?",
      o: ["Çapraz hücum koridoruna yönelik sorumluluğu büyür", "Savunma görevi tamamen sona erer", "Blok yapmak için ön hatta geçer", "Yalnızca kısa servis bekler"],
      a: 0,
      e: "Blok-savunma sistemi alan paylaşımına dayanır. Çizgi blokla kapatıldığında libero, blok ellerinin dışından çıkan derin çapraz açıya göre konumlanır.",
    },
    {
      q: "Bir hücumun plase olabileceğini düşündüren erken ipucu hangisidir?",
      o: ["Hücumcunun son adımlarında hızın azalması ve kolun tam geriye açılmaması", "Hücumcunun yaklaşma hızının sürekli artması ve kolun tam açılması", "Topun servis çizgisinden atılması", "Blokçunun iki ayakla sıçraması"],
      a: 0,
      e: "Yaklaşmanın yavaşlaması, dirsek ve avuç yönü ile kolun tam kurulmayışı plaseyi haber verebilir. Libero yine de sert top konumunu çok erken terk etmemelidir.",
    },
    {
      q: "Pasör ilk topu aldığında liberonun doğru ikinci top yönetimi hangisidir?",
      o: ["Sessiz kalıp başka bir oyuncunun karar vermesini beklemek", "‘Bende’ komutuyla sorumluluk alıp kurala uygun teknikle hücum edilebilir pas üretmek", "Topu her durumda doğrudan karşı alana göndermek", "Pasörün yerine ön hatta blok yapmak"],
      a: 1,
      e: "Libero sorumluluğunu erken bildirir, hücum seçeneklerini kontrol eder ve özellikle hedef dışı toplarda güvenli yüksek kanat pasını önceliklendirir.",
    },
    {
      q: "Libero savunma iletişiminin etkili olması için komutlar nasıl verilmelidir?",
      o: ["Topa temas edildikten sonra uzun cümlelerle", "Erken, kısa ve tek anlamlı biçimde", "Yalnızca mola sırasında", "Sadece el işaretiyle ve sessizce"],
      a: 1,
      e: "‘Benim’, ‘bırak’, ‘kısa’, ‘uzun’, ‘çizgi’, ‘çapraz’ ve ‘plase’ gibi komutlar temas öncesinde verilerek sorumluluk karışıklığını azaltır.",
    },
    {
      q: "Zor top sonrasında güvenli yan yuvarlanma sırası hangisidir?",
      o: ["Dizler üzerine sert düşüp başı geriye bırakmak", "Temastan sonra avuçlar üzerinde durup ralliyi izlemek", "Topa yakın ayakla alçalmak, teması öne-yukarı yapmak ve omuz üzerinden çapraz yuvarlanmak", "Topa uzandıktan sonra sırt üstü hareketsiz kalmak"],
      a: 2,
      e: "Yuvarlanma darbeyi kalça yanı ve omuz hattı boyunca dağıtır; baş-boyun korunur ve libero hızla ayağa kalkarak sonraki savunma görevine katılır.",
    },
    {
      q: "Bilimsel maç analizlerinde liberonun en sık yaptığı ve oyun devamlılığına en çok hizmet eden eylemler hangileridir?",
      o: ["Servis ve blok", "Smaç ve blok", "Servis karşılama ve alan savunması", "Yalnızca ikinci top hücumu"],
      a: 2,
      e: "Üst düzey kadın voleybolunda 1.597 libero eylemini inceleyen çalışma, en yüksek katılımın servis karşılama ve savunmada olduğunu; en iyi performansların karşılama ve sette görüldüğünü bildirmiştir.",
    },
    {
      q: "Liberonun performansını yalnızca gösterişli kurtarış sayısıyla değerlendirmek yerine hangi ölçüt daha anlamlıdır?",
      o: ["Yere düşme sayısı", "Topa temas ederken çıkardığı ses", "Pasör hedef çevresine ulaşan ilk temaslar ve oyunda tutulan savunma topları", "Forma değişikliği sayısı"],
      a: 2,
      e: "Dersin başarı yaklaşımı, ilk temasın hücum kurulabilir kaliteye ulaşmasını ve savunma topunun kontrollü biçimde oyunda tutulmasını esas alır.",
    },
  ],
  "Orta oyuncu eğitimi": courseCurriculum.__ortaOyuncuSinavTaslagi,
  "Smaçör eğitimi": [
    {
      q: "Smaçörün takım içindeki çift yönlü rolünü en doğru açıklayan seçenek hangisidir?",
      o: ["Yalnızca ön hatta hücum etmek", "Servis karşılama ve savunmayı hücum ile blok görevleriyle birleştirmek", "Sadece pasörün yerine ikinci topu kullanmak", "Yalnızca arka alanda oynamak"],
      a: 1,
      e: "Smaçör ön hatta sol kanat hücumu ve blok; arka hatta servis karşılama, savunma ve gerektiğinde arka alan hücumu görevlerini üstlenir.",
    },
    {
      q: "Servis karşılama yerleşiminde smaçörün doğru sorumluluk paylaşımı hangisidir?",
      o: ["Ara topları servis atıldıktan sonra kararlaştırmak", "Pasörün yolunu kapatıp tüm topları almak", "Libero ile ara ve kısa top sorumluluğunu servis öncesinde netleştirmek", "Kolları önceden birleştirip hareketsiz beklemek"],
      a: 2,
      e: "Karşılama düzeni servis öncesinde paylaşılır. Smaçör pasörün geçiş yolunu açık bırakır, libero ile ara top sorumluluğunu konuşur ve hareket edebilir duruşunu korur.",
    },
    {
      q: "Bilimsel servis karşılama araştırmalarına göre karşılama etkinliğini en güçlü etkileyen unsurlardan biri hangisidir?",
      o: ["Seyircinin bulunduğu tribün", "Karşılayıcının başlangıç konumu ve topa giderken yaptığı yer değiştirme", "Formanın kol uzunluğu", "Set arasındaki müzik"],
      a: 1,
      e: "Yüksek düzey oyuncularla yapılan üç boyutlu analiz, karşılayıcının başlangıç konumu ve hareketinin kullanılan tekniği ve karşılama etkinliğini güçlü biçimde etkilediğini göstermiştir.",
    },
    {
      q: "Smaçör karşılamayı yaptıktan sonra hücuma nasıl geçmelidir?",
      o: ["Topu bulunduğu yerde izlemelidir", "File altında pası beklemelidir", "Temastan sonra dışa-geriye açılıp pasör ve topu görüşünde tutmalıdır", "Doğrudan sahanın merkezine koşmalıdır"],
      a: 2,
      e: "Karşılamadan hemen sonra hücum başlangıç mesafesi kazanılır. Yüksek pas için ritim bekletilir, hızlı pas için yaklaşma daha erken başlatılır.",
    },
    {
      q: "Sol kanat hücumunda hafif çapraz yaklaşma açısının temel avantajı nedir?",
      o: ["Smaçörün yalnız çizgi yönünü görmesini sağlar", "Topu, bloğu ve savunma alanını aynı görüş içinde tutarak seçenekleri artırır", "File altına doğru daha hızlı sürükler", "Tek ayakla inişi kolaylaştırır"],
      a: 1,
      e: "Fileye düz koşmak vuruş seçeneklerini azaltır. Uygun çapraz açı, top vuruş omzunun önünde kalırken çizgi, çapraz ve blok seçeneklerinin görülmesini sağlar.",
    },
    {
      q: "Smaç yaklaşmasının son iki adımında doğru ritim hangisidir?",
      o: ["İki eşit ve yavaş adım", "Kısa ilk adım ve çok uzun son adım", "Uzun ve alçaltıcı sondan bir önceki adım, ardından kısa kapatıcı son adım", "Son adımda tek ayak üzerinde durma"],
      a: 2,
      e: "Sondan bir önceki adım yatay hızı kontrol ederek kalçayı alçaltır; kısa kapatıcı adım ve kol savuruşu bu hızı iki ayaklı dikey sıçramaya dönüştürür.",
    },
    {
      q: "Güç ve yön kontrolü için ideal smaç temas noktası neresidir?",
      o: ["Başın arkasında ve alçakta", "Vuruş omzunun önünde, ulaşılabilen yüksek noktada", "Göğüs hizasında ve gövdeye yakın", "File altındayken iki elle"],
      a: 1,
      e: "Topa vuruş omzunun önünde ve yüksek noktada temas etmek kol hızının topa aktarılmasını, yön kontrolünü ve güvenli inişi destekler.",
    },
    {
      q: "Rakip ikili blokta dış blokçunun dış eli uygun açıyla duruyorsa smaçör hangi seçeneği değerlendirebilir?",
      o: ["Topu doğrudan antene vurmayı", "Bloğun dış kenarına kontrollü temasla blok aut üretmeyi", "Topu kendi sahasına bırakmayı", "Her durumda blok arasına vurmayı"],
      a: 1,
      e: "Blok autta amaç topu doğrudan dışarı atmak değil, dış elin dış kenarını kontrollü kullanarak topun blok temasından saha dışına yönelmesini sağlamaktır.",
    },
    {
      q: "İkili blok tamamen kapanmışsa smaçörün en uygun karar yaklaşımı hangisidir?",
      o: ["Aynı kapalı aralığa daha sert vurmak", "Dış el, savunma boşluğu veya kontrollü plase seçeneğine geçmek", "Topu tutup tekrar sıçramak", "Vuruştan tamamen vazgeçip fileye temas etmek"],
      a: 1,
      e: "Blok arası yalnız gerçek bir boşluk varsa kullanılır. Blok kapalıysa dış el, kısa/derin plase veya saha içi kontrollü hücum hata riskini azaltır.",
    },
    {
      q: "Plase hangi durumda taktik olarak doğru bir hücum seçeneğidir?",
      o: ["Savunmanın blok arkası, merkez veya derin köşede boşluk bıraktığı durumda", "Rakip sahanın tamamı doluyken rastgele", "Smaçör topu hiç görmediğinde", "Her iyi pasta sert hücum yerine otomatik olarak"],
      a: 0,
      e: "Plase, sert hücum görüntüsü korunarak savunmanın boş bıraktığı alana gönderilir. Seçim blok ve savunma yerleşimine dayanmalı, alışkanlıkla yapılmamalıdır.",
    },
    {
      q: "Fileden 2–3 metre uzakta gelen yüksek topta smaçörün önceliği ne olmalıdır?",
      o: ["Her koşulda keskin açıya tam güç vurmak", "Pas mesafesi ve blok sayısına göre sayı, blok aut veya kontrollü hücum arasında risk yönetmek", "Topu fileye yaklaştırmak için rakip bloğa doğru itmek", "Yaklaşmayı pasın yüksekliğinden bağımsız başlatmak"],
      a: 1,
      e: "Yüksek ve fileden uzak top çoğunlukla iki veya üçlü blokla karşılaşır. Araştırmalar hücum temposu ve blokçu sayısının hücum etkinliğini etkilediğini gösterir; doğrudan hatadan kaçınmak önemlidir.",
    },
    {
      q: "Arka hat smaçörü için kurala uygun hücum hangisidir?",
      o: ["Üç metre çizgisine basarak sıçrayıp topu file üstünden tamamlamak", "Üç metre çizgisinin gerisinden sıçrayıp hücumu tamamlamak", "Ön bölgede blok yaparak topa vurmak", "File önünde ayakta durarak her topu tamamlamak"],
      a: 1,
      e: "Arka hat oyuncusu, top tamamen file üstündeyken hücumu tamamlayacaksa sıçrama anında üç metre çizgisinin gerisinde olmalıdır; iniş ön bölgeye yapılabilir.",
    },
    {
      q: "Ön hatta blok yapan smaçör, bloktan indikten sonra hangi geçişi uygulamalıdır?",
      o: ["File altında kalıp ralliyi izlemek", "Dengeli inip dışa-geriye açılmak ve top kalitesine göre yaklaşma temposu seçmek", "Arka çizgiye dönüp servis beklemek", "Pasörün koşu yolunu kapatmak"],
      a: 1,
      e: "Blok–hücum geçişi kesintisiz olmalıdır. Smaçör iki ayakla inip başlangıç mesafesini kazanır; hücum mümkün değilse koruma veya savunma görevini sürdürür.",
    },
    {
      q: "22-22 gibi kritik bir sayıda smaçör hücum kararını hangi bilgilere dayandırmalıdır?",
      o: ["Yalnız önceki vuruşun sonucuna", "Pas kalitesi, blok sayısı ve elleri, savunma yerleşimi, skor ve kendi denge durumuna", "Sadece tribünden gelen sese", "Her koşulda en sert vuruşa"],
      a: 1,
      e: "Kritik top yönetimi sürprizden önce uygulanabilirliği değerlendirir. İyi pas ve tekli blok güçlü hücumu; uzak pas ve çoklu blok ise düşük riskli hedefi öne çıkarabilir.",
    },
    {
      q: "Smaçörün hücum performansını en doğru değerlendiren yaklaşım hangisidir?",
      o: ["Yalnız toplam sayı", "Yalnız vuruş hızı", "Sayı, hata, blokta kalan top ve kontrollü devam sonucunu birlikte değerlendirmek", "Sadece sıçrama yüksekliği"],
      a: 2,
      e: "Hücum etkinliği yalnız bitirilen toplardan oluşmaz. Doğrudan hata oranı ve zor koşullarda takımın yeniden savunabileceği kontrollü toplar karar kalitesini gösterir.",
    },
  ],
  "Pasör çaprazı eğitimi": [
    {
      q: "Pasör çaprazının temel hücum ve blok bölgeleri hangileridir?",
      o: ["Ön hatta bölge 2, arka hatta bölge 1 hücumu ve rakip smaçöre blok", "Ön hatta yalnız bölge 4 ve arka hatta bölge 5", "Sadece bölge 3 hızlı hücumu", "Yalnız servis karşılama ve libero savunması"],
      a: 0,
      e: "Pasör çaprazı ön hatta çoğunlukla bölge 2’den, arka hatta bölge 1’den hücum eder; sağ ön blokta rakibin sol kanat smaçörünü karşılar.",
    },
    {
      q: "Pasör ön hattayken pasör çaprazının takım hücumundaki durumu hangisidir?",
      o: ["Takımın iki ön hat hücumcusundan biridir", "Arka alan liberoya dönüşür", "Hücum sorumluluğu tamamen sona erer", "Yalnız orta oyuncuya pas verir"],
      a: 0,
      e: "Pasör ön hattayken ön hatta iki hücumcu bulunur ve pasör çaprazı ana bitirici sorumluluğunu taşır; pasör arka hattayken üç ön hat hücumcusundan biridir.",
    },
    {
      q: "Sağ kanat yaklaşmasının doğru başlangıç ve hareket ilkesi hangisidir?",
      o: ["Antene yapışık başlayıp topa düz koşmak", "Anten ve fileden güvenli mesafe bırakıp çizgi ile çaprazı gören açılı yaklaşmak", "File altında bekleyip tek adımla sıçramak", "Sahanın dışından yaklaşarak anten dışına geçmek"],
      a: 1,
      e: "Açılı yaklaşma topun vuruş omzu önünde kalmasını ve çizgi/çapraz seçeneklerinin korunmasını sağlar; son adımlar yatay hızı dikey sıçramaya çevirir.",
    },
    {
      q: "Sağ kanatta solak ve sağlak pasör çaprazı için doğru uyarlama hangisidir?",
      o: ["Her iki oyuncuya tamamen aynı pas konumu zorunludur", "Solak oyuncu doğal vuruş kolunu dıştan daha rahat açabilir; sağlak oyuncu topun arkasına geçecek yaklaşma açısına daha çok ihtiyaç duyar", "Sağlak oyuncu topu daima anten dışından almalıdır", "Solak oyuncu yalnız çapraz vurabilir"],
      a: 1,
      e: "Baskın el başlangıç noktasını ve vuruş penceresini etkiler. Her iki durumda da amaç topu vuruş omzu önünde tutmak ve file altına sürüklenmemektir.",
    },
    {
      q: "Yüksek sağ kanat pasında doğru yaklaşma zamanlaması hangisidir?",
      o: ["Pas çıkar çıkmaz tam hız koşup topun altında beklemek", "Pasın yüksekliğini okuyup başlangıçta sabırlı kalmak, top tepeye yaklaşırken son iki adımı hızlandırmak", "Top düşmeye başladıktan sonra geriye koşmak", "Pasın fileye uzaklığını dikkate almamak"],
      a: 1,
      e: "Erken koşu topun altında kalmaya yol açar. Bekle–hızlan ritmi, yüksek pasın tepe noktası ve fileye uzaklığına göre ayarlanır.",
    },
    {
      q: "Çizgi vuruşunda rakip dış blokçu çizgiyi tamamen kapatmışsa en uygun karar nedir?",
      o: ["Anten dışına daha sert vurmak", "Dış el veya açık çapraz seçeneğine geçmek", "Topu filede tutmak", "Yaklaşmayı durdurup topa temas etmemek"],
      a: 1,
      e: "Çizgi vuruşu blok hattına göre seçilir. Çizgi kapanmışsa bloğun dış kenarını kontrollü kullanmak veya açık çapraz hedefe yönelmek doğrudan hata riskini azaltır.",
    },
    {
      q: "Kontrollü çapraz vuruşun yönü nasıl oluşturulmalıdır?",
      o: ["Yalnız bileği son anda sertçe çevirerek", "Yaklaşma açısı, omuz dönüşü, yüksek temas ve el yönlendirmesini birlikte kullanarak", "Topa başın arkasında temas ederek", "Gözleri kapatıp tam güç vurarak"],
      a: 1,
      e: "Çapraz yön yalnız bilekle üretilmez. Benzer yaklaşma görüntüsünden sonra gövde ve el birlikte hedefe yönelir; keskin açı kapalıysa derin çapraz seçilir.",
    },
    {
      q: "Bölge 1 arka alan hücumunda kurala uygun sıçrama hangisidir?",
      o: ["Son basış üç metre çizgisinin üzerinde", "Sıçrama üç metre çizgisinin gerisinden, iniş ise ön bölgeye yapılabilir", "Sıçrama ön bölgeden, iniş arka bölgeye", "Çizgi kuralı pasör çaprazına uygulanmaz"],
      a: 1,
      e: "Arka hat oyuncusu hücumu file üstünde tamamlayacaksa sıçrama anında üç metre çizgisinin gerisinde olmalıdır. Çizginin üzerine basmak ön bölge basışı sayılır.",
    },
    {
      q: "Fileden 2–3 metre uzakta ve üçlü blok karşısındaki bozuk top için en güvenli çözüm hangisidir?",
      o: ["Her durumda keskin açıya tam güç vurmak", "Yüksek temasla blok üstü, dış el veya savunma boşluğuna kontrollü hücum seçmek", "Topu antene doğru itmek", "Gözünü bloktan ayırıp rastgele vurmak"],
      a: 1,
      e: "Pasör çaprazı zor koşullarda sıkça kompakt iki veya üçlü blokla karşılaşır. Pas mesafesi, denge ve blok görüntüsüne göre kontrollü çözüm üretmek etkinliği korur.",
    },
    {
      q: "Bilimsel bölge analizleri pasör çaprazının rolü hakkında hangi sonucu destekler?",
      o: ["Yalnız ideal karşılamalarda hücum ettiğini", "Bölge 2 ve 1’den, özellikle kötü ilk temas ve karşı hücum sonrasında zor topları yüksek blok karşısında yönetmesi gerektiğini", "Servis karşılamadan sonra hiç hücum etmediğini", "Sadece tekli blokla karşılaştığını"],
      a: 1,
      e: "Elit erkek voleybolu analizleri, pasör çaprazlarının ideal olmayan paslardan ve karşı hücumda sıkça kompakt çift/üçlü blok karşısında hücum ettiğini vurgular.",
    },
    {
      q: "Rakip smaçöre blokta pasör çaprazının dış eli nasıl kullanılmalıdır?",
      o: ["Saha dışına açık bırakılmalıdır", "File üzerinden rakip alana uzatılıp topu kendi sahasının içine yönlendirecek açıya çevrilmelidir", "Gövdenin arkasında tutulmalıdır", "Parmaklar gevşek bırakılmalıdır"],
      a: 1,
      e: "Dış elin içe açılan kontrollü konumu rakibin blok aut kullanmasını zorlaştırır ve temas eden topun savunulabilir saha alanına yönelme olasılığını artırır.",
    },
    {
      q: "Pasör çaprazı bloktan indikten sonra hücuma nasıl geçmelidir?",
      o: ["File altında topu izleyerek kalmalı", "İki ayakla dengeli inip dışa-geriye açılmalı, top kalitesine göre yaklaşma temposunu seçmeli", "Doğrudan servis çizgisine yürümeli", "Pasörün önünde beklemeli"],
      a: 1,
      e: "Blok sonrası üç hızlı açılma adımı sağ kanat hücum mesafesini kazandırır. İyi topa daha hızlı, bozuk yüksek topa sabırlı yaklaşılır.",
    },
    {
      q: "Pasör çaprazının servis ve savunma sorumluluğu için doğru ifade hangisidir?",
      o: ["Karşılama yükü azsa servis ve savunma görevi de yoktur", "Servisle rakip düzenini bozmalı ve ardından rotasyondaki çizgi, çapraz veya blok arkası savunmasına geçmelidir", "Servis sonrası file dışında beklemelidir", "Yalnız kendi hücumunu düşünmelidir"],
      a: 1,
      e: "Pasör çaprazının servis karşılama yükü sınırlı olabilir; fakat hedef servis, bölge 1 savunması, bloktan seken top ve geçiş hücumu sorumluluğu sürer.",
    },
    {
      q: "22-22 gibi kritik bir sayıda pasör çaprazı hücum riskini neye göre ayarlamalıdır?",
      o: ["Yalnız topa daha sert vurarak", "Pas kalitesi, blok sayısı, önceki vuruşlar, savunma boşluğu ve skor bağlamını birlikte değerlendirerek", "Her zaman aynı çizgi vuruşunu tekrarlayarak", "Sadece seyircinin tepkisine göre"],
      a: 1,
      e: "Tekli blok güçlü hücumu destekleyebilir; çoklu blok veya fileden uzak pas ise dış el, derin hedef ya da kontrollü hücumu daha yüksek yüzdeli seçenek yapabilir.",
    },
    {
      q: "Pasör çaprazının hücum performansını kapsamlı biçimde değerlendiren ölçüt hangisidir?",
      o: ["Yalnız toplam sayı", "Sadece vuruş hızı", "Sayı, doğrudan hata ve oyunda kalan kontrollü topların birlikte değerlendirilmesi", "Yalnız sıçrama yüksekliği"],
      a: 2,
      e: "Pozisyon özellikle zor topları yönetir. Bu nedenle sayı üretimi kadar doğrudan hatadan kaçınma ve takımın savunabileceği kontrollü top oluşturma da karar kalitesini gösterir.",
    },
  ],
  "Takım rotasyonları": [
    {
      q: "Bir takım hangi durumda saat yönünde bir bölge rotasyon yapar?",
      o: ["Servis atan takım her sayı kazandığında", "Servis karşılayan takım ralliyi kazanıp servis hakkını aldığında", "Her mola sonrasında", "Rakip oyuncu değişikliği yaptığında"],
      a: 1,
      e: "Karşılayan takım ralliyi kazanarak servis hakkını aldığında oyuncular saat yönünde bir bölge ilerler. Servis atan takım sayı alırsa aynı diziliş ve servisçi devam eder.",
    },
    {
      q: "Saat yönündeki doğru bölge dönüş sırası hangisidir?",
      o: ["1 → 2 → 3 → 4 → 5 → 6 → 1", "1 → 6 → 5 → 4 → 3 → 2 → 1", "1 → 5 → 3 → 2 → 4 → 6 → 1", "1 → 3 → 5 → 2 → 6 → 4 → 1"],
      a: 1,
      e: "Bölge 2 oyuncusu servis için 1'e, 1'deki 6'ya, 6'daki 5'e, 5'teki 4'e, 4'teki 3'e ve 3'teki 2'ye geçer.",
    },
    {
      q: "Saha bölgeleri ve hatlar için doğru eşleştirme hangisidir?",
      o: ["1 ön sağ, 2 arka sağ, 3 arka orta", "1 arka sağ; 2 ön sağ; 3 ön orta; 4 ön sol; 5 arka sol; 6 arka orta", "1 arka sol; 2 ön sol; 5 arka sağ", "1 ön orta; 3 arka orta; 6 ön sağ"],
      a: 1,
      e: "Bölgeler oyuncunun uzmanlık görevini değil, rotasyondaki başlangıç konumunu belirtir. Ön hat 2-3-4, arka hat 1-6-5 bölgeleridir.",
    },
    {
      q: "‘Başlangıç dizilişi’ ile ‘oyun dizilişi’ arasındaki temel fark nedir?",
      o: ["İkisi tamamen aynıdır", "Başlangıç dizilişi servis anındaki rotasyon ilişkilerini, oyun dizilişi ise top oyuna girdikten sonraki uzmanlık konumlarını gösterir", "Oyun dizilişi yalnız mola sırasında kullanılır", "Başlangıç dizilişi sadece liberoya aittir"],
      a: 1,
      e: "Oyuncular servis anında rotasyon ilişkilerine uyar; top oyuna girdikten sonra pasör, hücumcu, blokçu ve savunmacılar görev alanlarına geçebilir.",
    },
    {
      q: "Servis anında ön ve arka hat oyuncuları arasındaki doğru göreli konum hangisidir?",
      o: ["Bölge 1 oyuncusu bölge 2 oyuncusundan daha önde olmalıdır", "Bölge 6 oyuncusu bölge 3 oyuncusundan daha geride olmalıdır", "Bölge 5 oyuncusu bölge 4 oyuncusundan daha önde olmalıdır", "Tüm oyuncular aynı yatay çizgide durmalıdır"],
      a: 1,
      e: "Eşleşen arka hat oyuncuları, orta çizgiye göre karşılarındaki ön hat oyuncularından daha geride konumlanır: 1-2, 6-3 ve 5-4 ilişkileri korunur.",
    },
    {
      q: "Aynı hattaki sağ-sol ilişkilerinden hangisi doğrudur?",
      o: ["Bölge 2, bölge 3'ün sağında; bölge 4 ise bölge 3'ün solundadır", "Bölge 2, bölge 3'ün solundadır", "Bölge 1, bölge 6'nın solundadır", "Bölge 5, bölge 6'nın sağındadır"],
      a: 0,
      e: "Ön hatta 2 sağda, 3 ortada, 4 soldadır; arka hatta 1 sağda, 6 ortada ve 5 soldadır. Kontrol, ayakların zeminle temas eden konumuna göre yapılır.",
    },
    {
      q: "Servis karşılama dizilişi kurulurken pasör için temel planlama nedir?",
      o: ["Pasörün hedefe geçiş yolunu karşılayıcılarla kapatmak", "Rotasyon ilişkilerini korurken pasörün ön sağ hedef bölgesine geçiş koridorunu açık bırakmak", "Pasörü mutlaka servis karşılamaya zorlamak", "Hücumcuların yaklaşma yollarını aynı koridorda birleştirmek"],
      a: 1,
      e: "Karşılama düzeni güçlü karşılayıcıları topa açarken pasörün yolunu boş bırakır. Hücumcuların yaklaşma koridorları da servis öncesinde ayrılır.",
    },
    {
      q: "4-2 oyun sisteminde pasörlerin temel rotasyon görevi hangisidir?",
      o: ["İki pasör yan yana ön hatta oynar", "Pasörler çaprazdır ve ön hatta bulunan pasör hücumu yönetir", "Arka hat pasörü her zaman blok yapar", "Her rotasyonda iki libero pas verir"],
      a: 1,
      e: "4-2 sisteminde iki pasör çapraz yerleşir. Ön hat pasörü hedef bölgesine geçerek hücumu kurar; arka hat pasörü savunma ve ikinci top desteği verir.",
    },
    {
      q: "5-1 sistemini 4-2 sisteminden ayıran temel özellik nedir?",
      o: ["Altı rotasyon boyunca aynı uzman pasörün hücumu yönetmesi", "Hiç pasör kullanılmaması", "Her rotasyonda farklı liberonun pas vermesi", "Yalnız iki hücumcunun sahada bulunması"],
      a: 0,
      e: "5-1 sisteminde tek pasör altı rotasyon boyunca oyunu yönetir. Bu devamlılık tempo ve karar dilini sabit tutar; pasörün ön/arka hat durumu hücumcu sayısını değiştirir.",
    },
    {
      q: "5-1 sisteminde pasör ön hattayken hücum seçenekleri nasıl değişir?",
      o: ["Üç ön hat hücumcusu bulunur", "Genellikle iki ön hat hücumcusu kalır; arka alan hücumu üçüncü tehdit sağlayabilir", "Hiç blokçu kalmaz", "Pasör arka hat oyuncusu sayılır"],
      a: 1,
      e: "Pasör 2, 3 veya 4'teyken ön hat oyuncusudur. Bu durumda iki ön hat hücumcusu bulunur; arka alan bağlantısı hücum çeşitliliğini artırabilir.",
    },
    {
      q: "5-1 sisteminde pasör arka hattayken doğru hücum düzeni hangisidir?",
      o: ["Pasör hedefe geçemez", "Ön hatta üç hücumcu bulunur ve iyi karşılamada orta, sol ve sağ kanat birlikte kullanılabilir", "Yalnız tek kanat hücum eder", "Pasör ön hatta blok yapmak zorundadır"],
      a: 1,
      e: "Pasör 1, 6 veya 5'teyken arka hattan hedefe geçer. Üç ön hat hücumcusunun koridorları açık tutulursa tüm file genişliği tehdit oluşturur.",
    },
    {
      q: "Libero ile orta oyuncu arasındaki rotasyon takibinde doğru işlem hangisidir?",
      o: ["Libero istediği herhangi bir oyuncuyla değişebilir", "Libero arka hatta geçen orta oyuncunun yerine girer ve aynı oyuncu ön hatta dönerken doğru eşleşmeyle çıkar", "Libero servis sırasını değiştirebilir", "Değişim normal oyuncu değişikliği sayısını mutlaka azaltır"],
      a: 1,
      e: "Libero değişiminde yerine girilen oyuncu takip edilir, değişim belirlenen alandan yapılır ve servis sırası korunur. Orta oyuncu ön hatta dönerken doğru eşleşme tamamlanır.",
    },
    {
      q: "Aşağıdakilerden hangisi üst üste binme veya pozisyon hatası riskidir?",
      o: ["Arka hat pasörünün izin verilen andan önce eşleştiği ön hat oyuncusundan öne geçmesi", "Oyuncuların top oyuna girdikten sonra uzmanlık konumlarına geçmesi", "Bölge 2 oyuncusunun servis hakkı kazanılınca bölge 1'e dönmesi", "Pasörün geçiş yolunun açık bırakılması"],
      a: 0,
      e: "Pozisyon hatası, servis için geçerli anda göreli ön-arka veya sağ-sol sırasının bozulmasıdır. Erken geçiş, özellikle sıkıştırılmış karşılama dizilişlerinde risk oluşturur.",
    },
    {
      q: "Rotasyondan oyun düzenine güvenli geçişin doğru sırası hangisidir?",
      o: ["Servis temasından önce görev alanına koşmak", "Geçiş için izin verilen anı beklemek, yolları ayırmak, topu görüşte tutmak ve hücum sonrası standart savunmaya dönmek", "Tüm oyuncuların aynı koridordan ilerlemesi", "Başlangıç dizilişinde ralli sonuna kadar kalmak"],
      a: 1,
      e: "Geçiş kısa ve çakışmasız olmalıdır. Pasör hedefe, hücumcular koridorlarına, savunmacılar alanlarına gider; ralli sonunda yeni servis sırası tekrar kurulur.",
    },
    {
      q: "Takım rotasyonlarını en güvenilir biçimde kontrol etmek için hangi yöntem kullanılmalıdır?",
      o: ["Yalnız oyuncuların hafızasına güvenmek", "Her ralli sonunda bölge 1 oyuncusunu, servis sırasını, değişimleri ve rotasyon çizelgesini doğrulamak", "Sadece skor tabelasına bakmak", "Servisçi yanlışsa ralli bitene kadar beklemek"],
      a: 1,
      e: "Sistematik kontrol yanlış servisçi ve değişim hatasını azaltır. Rotasyon çizelgesi, oyuncu numaraları ve servis sırası her ralliden sonra kısa biçimde doğrulanır.",
    },
  ],
  "Maç analizi": [
    {
      q: "Bilimsel ve uygulanabilir bir maç analizinin ilk adımı hangisidir?",
      o: ["Maç bittikten sonra dikkat çeken oyuncuyu seçmek", "Tek ve ölçülebilir analiz sorusunu, göstergeleri ve kod tanımlarını önceden belirlemek", "Mümkün olan bütün olayları açıklamasız kaydetmek", "Yalnız kazanılan rallileri incelemek"],
      a: 1,
      e: "Analiz, ‘neden kaybettik?’ gibi geniş bir yargı yerine belirli bir soruyla başlar. Kod sözlüğü ve kalite ölçekleri veri toplanmadan önce sabitlenir.",
    },
    {
      q: "Tarafsız gözlem için doğru uygulama hangisidir?",
      o: ["Aynı hareketi yıldız oyuncuda daha olumlu puanlamak", "Başarılı sonucu her zaman doğru karar saymak", "Önce eylemi ortak kodla kaydetmek, yorumu ayrı yapmak ve belirsizliği videodan kontrol etmek", "Tek ralliden oyuncunun genel eğilimini çıkarmak"],
      a: 2,
      e: "Eylem ve yorum ayrılır; aynı tanım bütün oyunculara uygulanır. Sonuç ile karar kalitesi aynı şey değildir ve belirsiz kayıt video üzerinden doğrulanır.",
    },
    {
      q: "İki gözlemcinin aynı 20 ralliyi benzer biçimde kodlaması neden kontrol edilir?",
      o: ["Maçın skorunu değiştirmek için", "Kod sisteminin gözlemciler arası güvenilirliğini değerlendirmek için", "Daha fazla oyuncu değişikliği yapmak için", "Video süresini kısaltmak için"],
      a: 1,
      e: "Açık operasyonel tanımlar yüksek gözlemci uyumu sağlamalıdır. Güvenilirlik araştırmaları, öznel veya çok karmaşık kategori tanımlarının kodlama tutarlılığını düşürebildiğini gösterir.",
    },
    {
      q: "Bir rallinin bitişini ‘HS’ koduyla kaydetmek ders içeriğinde ne anlama gelir?",
      o: ["Hücum sayısı", "Hücum hatası", "Servis hatası", "Karşılama hatası"],
      a: 0,
      e: "Ralli yalnız kazanan takımla değil bitiş nedeniyle kaydedilir. HS hücum sayısını; HH hücum hatasını, SA servis sayısını ve SH servis hatasını ifade eder.",
    },
    {
      q: "Servis analizi için hangi veri grubu birlikte kaydedilmelidir?",
      o: ["Yalnız servis içeri girdi mi?", "Servisçi, başlangıç bölgesi, servis türü, hedef, karşılama kalitesi ve sonuç", "Yalnız topun hızı", "Sadece servis atan oyuncunun boyu"],
      a: 1,
      e: "Servisin taktik etkisi hedef ve sonraki karşılama/hücum kalitesiyle anlaşılır. Yalnız ‘oyunda’ bilgisi rakibin sistem dışına çıkıp çıkmadığını göstermez.",
    },
    {
      q: "Dört düzeyli karşılama ölçeğinde ‘3 — Mükemmel’ neyi ifade eder?",
      o: ["Topun doğrudan sayı kaybına yol açmasını", "Hücumun yalnız yüksek kanattan kurulabilmesini", "Pasörün hızlı ve kanat dahil tüm hücum seçeneklerini kullanabilmesini", "Topun rakip sahaya geri gönderilmesini"],
      a: 2,
      e: "Mükemmel karşılamada pasör bütün hücum seçeneklerine sahiptir. Pozitif karşılama oranında ders tanımına göre 3 ve 2 değerli karşılamalar birlikte kullanılır.",
    },
    {
      q: "Bir takım 50 karşılamanın 32'sinde 2 veya 3 kalite değerine ulaştıysa pozitif karşılama oranı kaçtır?",
      o: ["%32", "%50", "%64", "%82"],
      a: 2,
      e: "Pozitif karşılama oranı 32 ÷ 50 = 0,64, yani %64'tür. Pay ve paydanın raporda açıkça gösterilmesi yorumun denetlenmesini sağlar.",
    },
    {
      q: "Bir oyuncu 40 hücumda 18 sayı ve 6 doğrudan hata yaptıysa hücum verimliliği kaçtır?",
      o: ["%30", "%45", "%60", "%75"],
      a: 0,
      e: "Hücum verimliliği (sayı − hata) ÷ toplam hücum formülüyle hesaplanır: (18 − 6) ÷ 40 = 0,30, yani %30.",
    },
    {
      q: "Hücum kararının neden başarılı veya başarısız olduğunu anlamak için hangi alanlar birlikte kodlanmalıdır?",
      o: ["Yalnız sayı ve hata", "Hücum bölgesi, tempo, pas kalitesi, blok sayısı, vuruş yönü ve sonuç", "Sadece hücumcunun adı", "Yalnız topun düştüğü nokta"],
      a: 1,
      e: "Sonuç bağlamdan ayrı yorumlanamaz. Aynı vuruş; kötü pas, üçlü blok veya farklı tempo altında tamamen farklı bir karar kalitesine sahip olabilir.",
    },
    {
      q: "Bir top savunulamadığında blok-savunma analizinde doğru yaklaşım hangisidir?",
      o: ["Her durumda yalnız liberoyu sorumlu tutmak", "Blok yönü ve kapanışı, savunmacının başlangıç yeri, okuma zamanı ve temas kalitesini birlikte incelemek", "Sadece topun hızını kaydetmek", "Ralliyi analiz dışı bırakmak"],
      a: 1,
      e: "Blok ve arka alan savunması tek sistemdir. Doğrudan blok, dokunuş, yumuşatılmış top ve kontrollü/kontrolsüz savunma ayrı kodlanarak sorunun kaynağı belirlenir.",
    },
    {
      q: "Side-out oranı hangi formülle hesaplanır?",
      o: ["Servis atarken kazanılan ralliler ÷ toplam servis rallisi", "Servis karşıladıktan sonra kazanılan ralliler ÷ toplam servis karşılama rallisi", "Hücum sayıları ÷ toplam blok", "Pozitif karşılama ÷ servis hatası"],
      a: 1,
      e: "Side-out, servis karşılayan takımın ralliyi kazanma başarısını ölçer. Servis atan takımın kazandığı rallilerin oranı ise break-point göstergesidir.",
    },
    {
      q: "Takımın toplam side-out yüzdesi iyi görünürken neden R1–R6 ayrı incelenmelidir?",
      o: ["Toplam oran hesaplanamadığı için", "Toplam değer belirli bir rotasyondaki düşük karşılama, kötü eşleşme veya kayıp serisini gizleyebileceği için", "Her rotasyonda kurallar değiştiği için", "Oyuncu isimlerini gizlemek için"],
      a: 1,
      e: "Rotasyon bazlı karşılaştırma pasör konumu, hücum seçenekleri ve karşılama düzeninin etkisini görünür kılar. Bilimsel çalışmalar bazı rotasyonların side-out olasılığında ayrışabildiğini göstermiştir.",
    },
    {
      q: "Bir oyuncu için ‘kötü pasta daima çapraz vuruyor’ eğilimini güvenilir biçimde raporlamak için ne gerekir?",
      o: ["Tek bir başarılı klip", "Farklı bağlamlarda yeterli sayıda eylem, sayısal kayıt, birkaç destekleyici klip ve mümkünse karşı örnek", "Oyuncunun kendi görüşü", "Yalnız maçın son rallisi"],
      a: 1,
      e: "Eğilim tekrarlanan örüntüdür. Ders en az 20 ilgili eylemi ve her çıkarım için en az üç video örneğini önerir; az veri ‘ön bulgu’ olarak işaretlenmelidir.",
    },
    {
      q: "Set içindeki üç veya daha fazla sayılık seri nasıl analiz edilmelidir?",
      o: ["Doğrudan şans veya momentum olarak etiketlenmelidir", "Başlangıç rotasyonu, servisçi, ralli bitiş nedenleri ve mola/değişiklik öncesi-sonrası bağlamıyla incelenmelidir", "Yalnız skor farkı yazılmalıdır", "Sadece son sayının videosu izlenmelidir"],
      a: 1,
      e: "Skor serisi gözlenebilir nedenlerle açıklanır: servis baskısı, karşılama düşüşü, blok eşleşmesi veya karar kalitesi gibi etkenler zaman çizelgesinde doğrulanır.",
    },
    {
      q: "İyi bir set arası raporun yapısı nasıl olmalıdır?",
      o: ["Bütün istatistiklerin uzun bir listesi", "İki doğrulanmış bulgu, nedenleri, en fazla üç uygulanabilir eylem ve bu eylemlerin ölçüm yöntemi", "Yalnız oyuncu hatalarının isim listesi", "Video olmadan genel motivasyon konuşması"],
      a: 1,
      e: "Analizin amacı sahada uygulanabilir karar üretmektir. Rapor ‘ne oluyor, neden oluyor, ne yapacağız ve nasıl ölçeceğiz?’ sorularına kısa cevap verir.",
    },
  ],
  "Taktik ve oyun zekâsı": [
    {
      q: "Voleybolda oyun zekâsını en doğru tanımlayan ifade hangisidir?",
      o: ["Yalnızca topa sert vurabilmek", "Topa temas etmeden önce ilgili saha bilgisini toplayıp uygun seçeneği zamanında ve teknik kontrolle uygulamak", "Her rallide aynı planı değiştirmeden kullanmak", "Sadece antrenörün saha dışından verdiği komutu beklemek"],
      a: 1,
      e: "Oyun zekâsı algı–karar–uygulama zinciridir. Oyuncu çevreyi tarar, olası seçenekleri hazırlar, son ipucuna göre seçer ve sonucu sonraki ralli için günceller.",
    },
    {
      q: "Saha taraması hangi zamanlarda tekrarlanmalıdır?",
      o: ["Yalnız mola sırasında", "Servis öncesinde, top karşı sahadayken ve takımın ilk teması sırasında", "Sadece top oyuncunun ellerine geldikten sonra", "Yalnız sayı kazanıldıktan sonra"],
      a: 1,
      e: "Kısa ve tekrarlanan bakışlar; rotasyon, pasör, kullanılabilir hücumcular, rakip blok, savunma derinliği ve boş alanlar hakkında erken bilgi sağlar.",
    },
    {
      q: "Bilimsel görsel arama araştırmalarında uzman voleybolcuların acemilere göre temel avantajı nedir?",
      o: ["Her bölgeye daha uzun süre rastgele bakmaları", "Göreve özgü önemli ipuçlarını daha verimli kodlayıp pas yönünü daha hızlı ve doğru öngörmeleri", "Yalnız topun rengine odaklanmaları", "Karar vermeyi top temasından sonraya bırakmaları"],
      a: 1,
      e: "Gerçekçi pasör videolarıyla yapılan göz izleme çalışmasında uzmanlar daha hızlı ve doğru tahmin üretmiş; kritik bilgiyi daha verimli görsel arama stratejisiyle işlemiştir.",
    },
    {
      q: "Top gelmeden önce ana ve yedek seçenek hazırlamanın amacı nedir?",
      o: ["Oyuncuyu tek bir karara kilitlemek", "Son uyaran değiştiğinde temas anında düşünmeye başlamadan uygun çözüme geçebilmek", "Teknik uygulamayı yavaşlatmak", "Rakip yerleşimini görmezden gelmek"],
      a: 1,
      e: "Örneğin pasör iyi karşılamada orta hücumu, zayıf karşılamada yüksek kanadı hazırlar. Böylece değişen top kalitesine tereddütsüz tepki verebilir.",
    },
    {
      q: "Rakip sahadaki ‘boş alan’ için doğru ifade hangisidir?",
      o: ["Maç boyunca değişmeyen sabit bir bölgedir", "Rakip oyuncunun bulunmadığı veya ulaşmakta zorlanacağı, ralli içinde değişebilen bölgedir", "Yalnız saha dışıdır", "Her zaman bölge 6'dır"],
      a: 1,
      e: "Boşluk servis karşılama, blok ve savunma hareketiyle değişir. Oyuncu iki karşılayıcı arası, blok arkası, kısa alan veya derin köşeyi sürekli yeniden değerlendirmelidir.",
    },
    {
      q: "Fileden uzak ve dengesiz bir hücum topunda doğru risk yönetimi hangisidir?",
      o: ["Skor ne olursa olsun keskin açıya tam güç vurmak", "Top kalitesi, denge, blok ve skor bağlamına göre kontrollü derin top veya blok kullanma seçmek", "Topu antene doğru zorlamak", "Rakip savunmaya bakmadan rastgele plase yapmak"],
      a: 1,
      e: "En iyi karar en gösterişli hareket değildir. Düşük kaliteli top ve dengesiz durumda doğrudan hata olasılığını azaltan çözüm daha yüksek başarı yüzdesi sağlayabilir.",
    },
    {
      q: "Rakip ikili bloğu okurken hangi bilgi yalnız blok sayısından daha değerlidir?",
      o: ["Blokçuların forma numarası", "İki el grubu arasındaki boşluk, kapanma hızı ve dış elin açısı", "Blokçuların servis sırası", "Seyirciye baktıkları yön"],
      a: 1,
      e: "Blok arası açıksa sert ara; dış el saha dışına dönükse blok aut; blok kapalıysa plase veya savunma boşluğu değerlendirilebilir.",
    },
    {
      q: "Arka orta savunmacı çok derinde, blok arkası ise boşsa hücumcu hangi seçeneği değerlendirmelidir?",
      o: ["Her durumda derin sert top", "Kısa ve kontrollü plase", "Topu kendi sahasına yönlendirme", "Anten dışına vuruş"],
      a: 1,
      e: "Savunmanın derinliği vuruş hedefini etkiler. Sert hücum görüntüsünden kısa plase, derindeki savunmacının öne yetişmekte zorlanacağı alanı kullanabilir.",
    },
    {
      q: "Taktik servis hedefi seçerken en doğru yaklaşım hangisidir?",
      o: ["Yalnız en zayıf oyuncuya her rotasyonda aynı servisi atmak", "Rakip rotasyonu, ara boşluk, pasörün yolu, hücumcunun geçişi ve skor riskini birlikte değerlendirmek", "Amaçsız biçimde yalnız en güçlü servisi kullanmak", "Servis hedefini vuruş anında rastgele belirlemek"],
      a: 1,
      e: "Servis planı rakibin hücum düzenini sınırlamayı amaçlar. Zayıf karşılayıcı kadar iki oyuncu arası, kısa-derin değişimi ve belirli rotasyondaki side-out sorunu da hedef olabilir.",
    },
    {
      q: "Hücumda vuruş çeşitliliği ne anlama gelir?",
      o: ["Her topta rastgele farklı teknik denemek", "Aynı hazırlık görüntüsünden top, blok, savunma ve dengeye uygun çizgi, çapraz, dış el veya plase seçmek", "Yalnız bilekle yön değiştirmek", "Sadece sert ve yumuşak vuruşu sırayla kullanmak"],
      a: 1,
      e: "Çeşitlilik rastlantı değildir. Hazırlığın benzer kalması rakibin erken okumasını zorlaştırırken seçim mevcut boşluk ve top kalitesiyle uyumlu olmalıdır.",
    },
    {
      q: "Savunmadan hücuma geçişte top pasör hedefinden çok uzaktaysa hangi öncelik doğrudur?",
      o: ["Her durumda hızlı orta hücumu zorlamak", "Hücumcu yetişmiyorsa güvenli yüksek top veya rakibi zorlayacak kontrollü top seçmek", "Pasörün ilk topu almasını yok saymak", "Bütün oyuncuların aynı anda fileye koşması"],
      a: 1,
      e: "Geçiş temposu savunma topunun kalitesi ve pasörün konumuna göre seçilir. İyi top hızlı seçenekleri, kötü top ise güvenli ve dengeli çözümü öne çıkarır.",
    },
    {
      q: "23-24 gibi kritik bir sayıda doğru karar süreci hangisidir?",
      o: ["Baskı nedeniyle takım planını terk edip en zor hareketi denemek", "Rotasyonun güvenilir seçeneğini, eşleşmeyi, ilk temas kalitesini, önceki rallileri ve hata olasılığını birlikte değerlendirmek", "Skoru tamamen görmezden gelmek", "Her durumda aynı oyuncuya aynı tempoda oynamak"],
      a: 1,
      e: "Kritik sayı kararında skor bilgisi önemlidir ancak tek belirleyici değildir. Oyuncu takım planını, mevcut topu ve kazanç-risk dengesini birlikte ele alır.",
    },
    {
      q: "Rakibin tekrar eden bir eğilimini güvenilir saymak için ne gerekir?",
      o: ["Tek bir dikkat çekici ralli", "Rotasyon, pas kalitesi ve skor bağlamında tekrarlanan yeterli sayıda olay ve karşı örnek kontrolü", "Oyuncunun geçmiş ünü", "Yalnız maçın son sayısı"],
      a: 1,
      e: "Eğilim rastlantısal olay değildir. Ders, en az 30 ilgili olay içinde örüntü aramayı ve her bulguyu en az üç olayla desteklemeyi öğretir.",
    },
    {
      q: "Bilimsel derlemelere göre voleybolda karar verme becerisini geliştiren yöntemlerden biri hangisidir?",
      o: ["Yalnız kondisyon koşusu", "Video geri bildirimi, sorgulama, görsel arama ve oyun benzetimi içeren algısal-bilişsel çalışmalar", "Oyuncuyu karar vermeden yalnız komut izlemeye zorlamak", "Sadece maç sonucunu söylemek"],
      a: 1,
      e: "Kontrollü çalışmaların meta-analizi, video, soru-cevap, görsel arama ve benzetim temelli karar antrenmanlarının normal antrenmana göre anlamlı gelişim sağlayabildiğini göstermiştir.",
    },
    {
      q: "Takım içi taktik iletişimin doğru özelliği hangisidir?",
      o: ["Ralli sırasında uzun ve ayrıntılı açıklama", "Kısa, erken, tek anlamlı ve ortak komut sözlüğüne dayalı iletişim", "Topa temas edildikten sonra çelişkili komutlar", "Yalnız kaptanın konuşması"],
      a: 1,
      e: "‘Kısa’, ‘uzun’, ‘çizgi’, ‘çapraz’, ‘plase’, ‘tekli’, ‘ikili’, ‘bende’ gibi ortak komutlar görev bilgisini eylemden önce aktarır.",
    },
  ],
  "Kondisyon ve kuvvet": [
    {
      q: "Voleybola özgü kondisyonu en doğru açıklayan ifade hangisidir?",
      o: ["Uzun süre hiç durmadan düşük hızda koşabilmek", "Yalnızca bir kez en yükseğe sıçrayabilmek", "Kısa ve yüksek şiddetli hareketleri tekrarlarken ralliler arasında toparlanıp teknik kaliteyi koruyabilmek", "Sadece ağır yük kaldırabilmek"],
      a: 2,
      e: "Voleybolda kondisyon, kesintili oyun yapısına uygun olarak kısa ve yüksek şiddetli eylemleri tekrar edebilme, aralarda toparlanma ve maç boyunca teknik kaliteyi sürdürebilme becerisidir.",
    },
    {
      q: "Başlangıç hareket taramasında ağrı ortaya çıkarsa en doğru uygulama hangisidir?",
      o: ["Testi daha ağır yükle tekrarlamak", "Ağrıyı normal yorgunluk kabul edip devam etmek", "Testi durdurmak, hareketi zorlamamak ve gerektiğinde sağlık uzmanına yönlendirmek", "Sadece hareket hızını artırmak"],
      a: 2,
      e: "Hareket taraması tanı koymaz; güvenli başlangıç düzeyini belirlemeye yardım eder. Ağrı varsa test zorlanmaz ve uygun uzman değerlendirmesi istenir.",
    },
    {
      q: "Gövde stabilitesinin smaç performansındaki temel görevi nedir?",
      o: ["Yalnız karın kaslarının görünümünü geliştirmek", "Alt vücutta üretilen kuvvetin kontrollü biçimde üst vücuda ve vuruş koluna aktarılmasına yardım etmek", "Vuruş sırasında nefesi tamamen tutmak", "Bel boşluğunu mümkün olduğunca artırmak"],
      a: 1,
      e: "Gövde stabilitesi; kaburga, pelvis ve omurganın kontrolüdür. Bu kontrol, bacaklardan üretilen kuvvetin smaç koluna aktarılmasını ve iniş ile savunmada dengenin korunmasını destekler.",
    },
    {
      q: "Güvenli bir inişte kalça–diz–ayak bileği hizası nasıl olmalıdır?",
      o: ["Dizler içe çökerken topuklar kalkmalıdır", "Dizler ayakların yönünü izlemeli, ayak tabanı üç noktadan desteklenmeli ve iniş yumuşak olmalıdır", "Bacaklar tamamen düz ve kilitli tutulmalıdır", "Gövde geriye atılarak yalnız ayak ucuna inilmelidir"],
      a: 1,
      e: "Kontrollü inişte dizler ayak yönünü izler; topuk, başparmak kökü ve küçük parmak kökü destek oluşturur. Kalça ve diz bükülmesi kuvvetin güvenli biçimde emilmesine yardım eder.",
    },
    {
      q: "Voleybolcularda üst vücut itme ve çekme hareketlerinin dengeli programlanmasının önemli bir nedeni nedir?",
      o: ["Servis ve smaçtaki tekrarlı baş üstü yüklenmelere karşı kürek kemiği ve omuz çevresi kontrolünü desteklemek", "Çekiş hareketleri sıçrama tekniğinin yerini aldığı için", "Yalnız kol çevresini büyütmek için", "Omuz hareket açıklığını tamamen azaltmak için"],
      a: 0,
      e: "Tekrarlı servis ve smaçlar omuz kuşağını yükler. Yatay çekiş, yüz çekişi, dış rotasyon ve serratus çalışmaları kürek kemiği ile omuz çevresinin dengeli kontrolünü destekler.",
    },
    {
      q: "Squat ile kalça menteşesi arasındaki temel teknik fark hangisidir?",
      o: ["Squatta yalnız bel, menteşede yalnız diz hareket eder", "Squatta diz ve kalça birlikte bükülür; menteşede hareket kalçanın geriye gitmesiyle başlar ve kaval kemiği daha dik kalır", "İki hareket arasında teknik fark yoktur", "Menteşede sırt yuvarlanmalı, squatta topuklar kalkmalıdır"],
      a: 1,
      e: "Squat diz ve kalça eklemlerinin birlikte büküldüğü bir modeldir. Kalça menteşesinde kalça geriye gider, omurga nötr kalır ve hareket kalçanın öne gelmesiyle tamamlanır.",
    },
    {
      q: "Tek bacak kuvvet çalışmalarının voleybolcuya en uygun katkısı hangisidir?",
      o: ["Sağ–sol kontrolünü, dengeyi ve kalça stabilitesini geliştirmek", "İki bacaklı tüm hareketleri yasaklamak", "Yalnız baldır kasını çalıştırmak", "Dizleri içe yönlendirmeyi öğretmek"],
      a: 0,
      e: "Yaklaşma, iniş ve yön değiştirmede bacaklar eşit yüklenmeyebilir. Split squat, geri hamle ve tek bacak menteşesi gibi çalışmalar sağ–sol kontrolü ile dengeyi geliştirir.",
    },
    {
      q: "Voleybola özgü kondisyon devresinde teknik bozulmaya başladığında ne yapılmalıdır?",
      o: ["Tur tükenişe kadar sürdürülmelidir", "Direnç hemen iki katına çıkarılmalıdır", "Teknik kalite öncelikli tutularak tur sonlandırılmalı veya yük azaltılmalıdır", "Dinlenme tamamen kaldırılmalıdır"],
      a: 2,
      e: "Devrenin amacı yalnız yorgunluk oluşturmak değil, yorulurken hareket kalitesini korumaktır. Teknik bozulduğunda turu sürdürmek hedefe hizmet etmez ve gereksiz yük oluşturur.",
    },
    {
      q: "Patlayıcı kuvvet çalışmasının set ve tekrar yapısı neden az, kaliteli tekrar ve tam dinlenmeye dayanır?",
      o: ["Kas dayanıklılığını tamamen ortadan kaldırmak için", "Kuvveti kısa sürede yüksek hızla üretme niteliğini ve güvenli inişi yorgunluk bozmadan korumak için", "Antrenman süresini rastgele kısaltmak için", "Sporcuyu her sette tükenişe götürmek için"],
      a: 1,
      e: "Patlayıcı çalışmada hedef tekrar sayısı değil, yüksek nitelikli kuvvet üretimidir. Bilimsel derlemeler pliometrik çalışmaların sıçramayı geliştirebildiğini gösterirken, ders güvenli ilerleme ve bireyselleştirmeyi vurgular.",
    },
    {
      q: "Tekrarlı sıçrama serisinin sonlandırılması için derste verilen en uygun işaret hangisidir?",
      o: ["Sporcu konuşabildiğinde", "Sıçrama performansı başlangıca göre yaklaşık %10'dan fazla düştüğünde veya iniş tekniği belirgin bozulduğunda", "İlk başarılı sıçramadan hemen sonra", "Nabız hiç değişmediğinde"],
      a: 1,
      e: "Sıçrama yüksekliğindeki belirgin düşüş ve iniş kalitesinin bozulması nöromüsküler yorgunluğu gösterir. Ders, performans yaklaşık %10'dan fazla düşmeden kalite sınırında kalmayı hedefler.",
    },
    {
      q: "60 dakikalık ve algılanan zorluğu 7/10 olan bir seansın basit seans yükü kaçtır?",
      o: ["67 birim", "420 birim", "8,6 birim", "600 birim"],
      a: 1,
      e: "Dersteki basit yöntem seans süresi × algılanan zorluk puanıdır. Bu nedenle 60 × 7 = 420 keyfî yük birimi olarak kaydedilir.",
    },
    {
      q: "Antrenman yükünü yalnız seans süresiyle değerlendirmek neden yetersizdir?",
      o: ["Süre hiçbir zaman ölçülemediği için", "Aynı süredeki iki seansın şiddeti ve sporcunun uyku, ağrı, stres ve yorgunluk durumu farklı olabileceği için", "Yalnız sıçrama sayısı önemli olduğu için", "Uzun seanslar her zaman kolay olduğu için"],
      a: 1,
      e: "Yük izleme; süre ve algılanan zorluğu, sıçrama sayısını ve iyi oluş göstergelerini birlikte ele alır. Voleybol araştırmaları da iç yükün seans-RPE, dış yükün ise sıçrama ölçümleriyle izlenmesini destekler.",
    },
    {
      q: "Başlangıç düzeyindeki çocuk ve genç sporcu için direnç artışı hangi koşulda yapılmalıdır?",
      o: ["İlk antrenmanda mümkün olan en ağır yük seçilerek", "Temel hareket tekniği tutarlı hale geldikten sonra, nitelikli gözetim altında ve küçük adımlarla", "Yaş ve antrenman geçmişi dikkate alınmadan", "Yüksek hacimli sıçramayla aynı anda büyük artış yapılarak"],
      a: 1,
      e: "Yaşa uygun direnç antrenmanı, doğru teknik ve nitelikli gözetimle güvenli ve etkili olabilir. Dersin ilerleme sırası önce vücut ağırlığıyla öğrenme, sonra küçük tekrar veya direnç artışıdır.",
    },
    {
      q: "Bir performans testinin 4–6 hafta sonraki sonuçla anlamlı karşılaştırılması için hangi uygulama doğrudur?",
      o: ["Her testte farklı ısınma ve farklı hareket kullanmak", "Aynı protokolü, benzer saat ve benzer yorgunluk koşullarını kullanıp sonucu teknik kalite ve iyi oluşla birlikte yorumlamak", "Yalnız en iyi sonucu kaydetmek", "Testten önce sporcuyu tükenişe götürmek"],
      a: 1,
      e: "Standartlaştırma, değişimin programdan mı yoksa test koşullarından mı kaynaklandığını ayırt etmeye yardım eder. Sonuç; teknik kalite, sağ–sol farkı ve sporcunun iyi oluşuyla birlikte değerlendirilir.",
    },
    {
      q: "Aşağıdakilerden hangisi Kondisyon ve Kuvvet dersindeki doğru antrenman sırasıdır?",
      o: ["Ana kuvvet → soğuma → ısınma → patlayıcı çalışma", "Kısa kondisyon → ağır kuvvet → hareket becerisi → ısınma", "Isınma → hareket becerisi → patlayıcı çalışma → ana kuvvet → yardımcı gövde/omuz → kısa kondisyon → soğuma ve kayıt", "Statik dinlenme → tükeniş devresi → teknik çalışma"],
      a: 2,
      e: "Patlayıcı ve teknik açıdan hassas çalışmalar yorgunluk birikmeden uygulanır; ana kuvvet ve yardımcı çalışmaların ardından kısa kondisyon, soğuma ve kayıt gelir.",
    },
  ],
  "Sıçrama geliştirme": [
    {
      q: "Güvenli bir voleybol inişinde yer tepki kuvveti nasıl karşılanmalıdır?",
      o: ["Dizler kilitlenip yalnız ayak ucuna inilerek", "Ayak bileği, diz ve kalça birlikte bükülerek yük dengeli emilip pozisyon kontrol edilerek", "Gövde geriye atılıp topuklar yerden kaldırılarak", "Bir sonraki sıçramaya geçmek için denge beklenmeden"],
      a: 1,
      e: "Ders, iniş kuvvetinin ayak bileği, diz ve kalça arasında paylaşılmasını öğretir. Yumuşak, sessiz temas ve iki saniyelik denge; kuvvet emme ile vücut kontrolünün görülebilir göstergeleridir.",
    },
    {
      q: "İnişte dizlerin içe çökmesini azaltan doğru alt ekstremite hizası hangisidir?",
      o: ["Dizlerin ayakların baktığı yönü izlemesi ve ayak tabanında üç nokta desteğinin korunması", "Dizlerin birbirine yaklaşması ve ağırlığın ayakların dışına verilmesi", "Kalçanın hiç bükülmemesi", "Her iki dizin farklı yönlere çevrilmesi"],
      a: 0,
      e: "Topuk, başparmak kökü ve küçük parmak kökü zeminde destek oluşturur; dizler ayak yönünü izler. Teknik eğitim ve dinamik kuvvetlendirme, inişle ilişkili biyomekanik risk göstergelerini iyileştirebilir.",
    },
    {
      q: "Kol salınımının sıçrama yüksekliğine katkısı en doğru nasıl açıklanır?",
      o: ["Kollar yalnız havada denge sağlar, kalkışa katkı yapmaz", "Bacakların açılmasıyla zamanlanan kol salınımı alt ekstremitenin yaptığı işi ve yukarı yönlü itişi destekler", "Kollar ne kadar erken kalkarsa sıçrama her zaman o kadar yükselir", "Kol salınımı yalnız blokta kullanılmalıdır"],
      a: 1,
      e: "Elit voleybolcular üzerindeki biyomekanik çalışmalar, kol salınımının dikey sıçrama performansını desteklediğini gösterir. Derste kolların öne-yukarı hareketi kalça, diz ve ayak bileği açılmasıyla eşleştirilir.",
    },
    {
      q: "Çift ayak dikey sıçramada fileye doğru savrulmayı azaltmak için hangi hedef kullanılmalıdır?",
      o: ["Mümkün olduğunca ileri sıçrayıp tek ayakla inmek", "Yukarı doğru kuvvet üretip başlangıç alanına yakın, iki ayakla dengeli inmek", "Gövdeyi kalkışta öne düşürmek", "Son anda ayakları birbirine çaprazlamak"],
      a: 1,
      e: "Dikey sıçramada kuvvet yukarı yönlendirilir. Başlangıç alanına yakın iniş, yatay savrulmanın kontrol edildiğini gösterir ve fileye ya da başka oyuncuya yaklaşma riskini azaltır.",
    },
    {
      q: "Squat jump ile countermovement jump arasındaki temel fark hangisidir?",
      o: ["Squat jump yalnız tek ayakla yapılır", "Squat jump sabit çömelme pozisyonundan ek yaylanma olmadan başlar; countermovement jump hızlı alçalmayı beklemeden yukarı itişe çevirir", "Countermovement jump sırasında dizler hiç bükülmez", "İki test tamamen aynı başlangıç protokolüne sahiptir"],
      a: 1,
      e: "Squat jump başlangıç kuvvetini daha belirgin sınarken countermovement jump gerilme-kısalma döngüsünü ve koordineli yön değiştirmeyi kullanır. Bu nedenle test türleri birbirinin yerine rastgele kullanılamaz.",
    },
    {
      q: "Smaç yaklaşmasının son iki adımında yatay hızın dikey sıçramaya çevrilmesini sağlayan doğru sıra hangisidir?",
      o: ["İki eşit ve yavaş adım", "Kısa ilk adım ve fileye doğru uzun son adım", "Daha uzun ve alçaltıcı sondan bir önceki adımın ardından hızlı kapatıcı son adım", "Son iki adımda tamamen durmak"],
      a: 2,
      e: "Sondan bir önceki uzun adım ağırlık merkezini alçaltır; son adım hızlı kapanır. Kol salınımı ve çift ayak itişiyle yatay yaklaşma hızı dikey yükselişe dönüştürülür.",
    },
    {
      q: "Yaklaşmalı smaç sıçramasında zamanlama hangi bilgiye göre ayarlanmalıdır?",
      o: ["Yalnız antrenörün sesine göre", "Pasın yüksekliği ve topun uçuşuna göre; ilk adımlar okumaya izin verip son iki adım hızlanmalıdır", "Her pasta değişmeyen sabit koşu hızıyla", "Top vuruş omzunun arkasına geçtikten sonra"],
      a: 1,
      e: "Sporcu topu havada kovalamak yerine vuruş penceresi oluşturur. Pas yüksekliğini okuyup yaklaşma ritmini ayarlar ve topu vuruş omzunun önünde karşılar.",
    },
    {
      q: "Tekrarlı blok sıçramalarında her tekrar arasındaki öncelik nedir?",
      o: ["Dizleri kilitleyip mümkün olan en hızlı biçimde tekrar sıçramak", "İki ayakla dengeli inip hazır duruşu yeniden kurarken temas süresini teknik bozulmadan kısa tutmak", "Her inişte fileye doğru ilerlemek", "Eller aşağıdayken ikinci sıçramayı başlatmak"],
      a: 1,
      e: "Tekrarlı blokta kısa temas tek başına yeterli değildir. İniş hizası, dengeli hazır duruş, el hazırlığı ve fileden güvenli uzaklık korunmalıdır.",
    },
    {
      q: "Reaktif sıçrama çalışmalarına geçmeden önce hangi koşullar sağlanmalıdır?",
      o: ["Yalnız yüksek motivasyon", "Yeterli temel kuvvet, ayak bileği kontrolü ve güvenli iniş yeterliği", "En az yüz kesintisiz sıçrama yapabilmek", "Her antrenmanda kas ağrısı yaşamak"],
      a: 1,
      e: "Reaktif sıçrama kısa yer temasıyla yeniden kuvvet üretir ve yüksek şiddetlidir. Temel kuvvet ile iniş kontrolü oluşmadan yüksek şiddetli pliometrik yük eklenmez.",
    },
    {
      q: "Reaktif sıçrama serisi sırasında hangi durumda çalışma sonlandırılmalıdır?",
      o: ["Sporcu kısa temas ve güvenli inişi koruduğunda", "Temas süresi uzadığında, dizler içe kaçtığında, yükseklik belirgin düştüğünde veya ağrı oluştuğunda", "İlk üç tekrar başarılı olduğunda", "Sporcu terlemeye başladığında"],
      a: 1,
      e: "Uzayan temas, kontrolsüz topuk çökmesi, diz hizasının bozulması, yükseklik kaybı ve ağrı kalite sınırının aşıldığını gösterir. Pliometrik çalışmada hacim değil nitelik önceliklidir.",
    },
    {
      q: "Tek ayak denge çalışmalarında sağ–sol kontrolü nasıl değerlendirilmelidir?",
      o: ["Yalnız güçlü taraf test edilerek", "İki tarafta aynı hareket aralığı kullanılıp iniş hizası ve iki saniyelik denge karşılaştırılarak", "Zayıf tarafa hemen daha ağır yük verilerek", "Yalnız tekrar sayısı sayılarak"],
      a: 1,
      e: "Tek ayak duruş, mini squat ve yana sıçrama-tutuş iki tarafta aynı koşullarda uygulanır. Pelvis, diz hizası, hareket aralığı ve denge süresi birlikte izlenir.",
    },
    {
      q: "Sıçrama yüksekliği testinin 4–6 hafta sonraki ölçümle güvenilir biçimde karşılaştırılması için ne yapılmalıdır?",
      o: ["Farklı yüzey ve farklı sıçrama türü kullanılmalıdır", "Aynı ısınma, sıçrama türü, başlangıç pozisyonu, ölçüm aracı ve benzer yorgunluk koşulları korunmalıdır", "İlk test kollu, ikinci test kolsuz yapılmalıdır", "Dinlenmeden mümkün olduğunca çok deneme yapılmalıdır"],
      a: 1,
      e: "Protokol değişirse sonuçtaki fark antrenman gelişimi yerine ölçüm koşullarından kaynaklanabilir. En iyi değerle birlikte ortalama ve iniş kalitesinin kaydı daha bütünlüklü yorum sağlar.",
    },
    {
      q: "Bilimsel derlemelerin voleybolcularda pliometrik sıçrama antrenmanı için desteklediği sonuç hangisidir?",
      o: ["Sıçrama yüksekliğini geliştirebilir; ancak program hacmi ve sıklığı oyuncunun düzeyi ve pozisyonuna göre bireyselleştirilmelidir", "Yalnız profesyonel erkek oyuncularda işe yarar", "Her sporcuda en yüksek hacim zorunludur", "Teknik ve iniş kontrolünden bağımsız uygulanmalıdır"],
      a: 0,
      e: "Randomize çalışmaların meta-analizi pliometrik sıçrama antrenmanının voleybolcularda dikey sıçramayı geliştirebildiğini göstermiştir. Araştırmacılar yaş, cinsiyet, pozisyon ve yük toleransına göre bireyselleştirmeyi önerir.",
    },
    {
      q: "Yorgunluk altında iniş kalitesini izleyen çalışmada iki tekrar üst üste teknik düşüş görülürse ne yapılmalıdır?",
      o: ["Seri sayısı artırılmalıdır", "Çalışma sonlandırılmalı ve yük ile toparlanma yeniden değerlendirilmelidir", "İniş göz ardı edilip yalnız yüksekliğe bakılmalıdır", "Dinlenme süresi kaldırılmalıdır"],
      a: 1,
      e: "Dersin amacı yorgunken sınırsız tekrar yapmak değil, teknik bozulma sınırını tanımaktır. İki ardışık kötü iniş, güvenli kalite sınırının aşıldığını gösterir.",
    },
    {
      q: "Haftalık sıçrama hacmi planlanırken hangi yükler birlikte değerlendirilmelidir?",
      o: ["Yalnız ayrı pliometrik antrenmandaki sıçramalar", "Saha antrenmanı, maç, blok-hücum tekrarları, pliometrik çalışma ve kuvvet antrenmanındaki toplam alt vücut yükü", "Yalnız maçta sayı olan sıçramalar", "Sadece sporcunun boyu ve kilosu"],
      a: 1,
      e: "Voleybolcunun toplam sıçrama yükü yalnız ayrı bir sıçrama seansından oluşmaz. Saha, maç ve kuvvet yükleri birlikte planlanır; performans düşüşü, iniş kalitesi, ağrı ve toparlanma belirtileri izlenir.",
    },
  ],
  "Hız ve çeviklik": [
    {
      q: "Voleybolda çevikliği yalnız yön değiştirme hızından ayıran temel özellik hangisidir?",
      o: ["Hareket rotasının önceden ezberlenmesi", "Oyunla ilgili bir uyaranı algılayıp doğru hareketi seçerek kontrollü uygulamak", "Yalnız düz çizgide en yüksek hıza ulaşmak", "Mümkün olduğunca uzun süre koşmak"],
      a: 1,
      e: "Çeviklik, algılama ve karar vermeyi fiziksel yön değiştirmeyle birleştirir. Reaktif parkurda oyuncu top, el işareti veya rakip hareketine göre uygun ayak çalışmasını seçer.",
    },
    {
      q: "Atletik hazır pozisyonun hızlı ilk harekete izin veren doğru özelliği hangisidir?",
      o: ["Dizler düz, ağırlık topuklarda ve gövde geride", "Ayaklar uygun genişlikte, dizler hafif bükülü, kalça alçak ve ağırlık ayakların ön bölümünde", "Ayaklar çapraz ve bakış zeminde", "Topuklar yere kilitli ve eller arkada"],
      a: 1,
      e: "Alçak ve dengeli hazır pozisyon ağırlık merkezinin her yöne taşınmasını kolaylaştırır. Topuklara kilitlenmek veya dik beklemek ilk adıma geç kalmaya neden olur.",
    },
    {
      q: "Sağa doğru ilk adımı hızla başlatmak isteyen oyuncu hangi mekaniği kullanmalıdır?",
      o: ["Önce yukarı kalkıp sonra sağa dönmek", "Sağ ayağa hareket alanı açarken sol ayakla zemini itip ağırlık merkezini hedef yönüne taşımak", "İlk adımı olabildiğince uzun atıp gövdeyi geride bırakmak", "Önce sola ters adım atmak"],
      a: 1,
      e: "İlk adımda amaç yalnız ayağı taşımak değil, ağırlık merkezini seçilen yöne hızlandırmaktır. Sporcu zemini ters yönde iter; gereksiz dikleşme ve ters adım hız kaybettirir.",
    },
    {
      q: "Görsel reaksiyon çalışmasında erken tahmin yerine doğru karar vermeyi geliştiren uygulama hangisidir?",
      o: ["Her tekrarda yönü önceden söylemek", "Topun çıkış açısı veya hücumcunun omuz hareketi gibi gerçek uyaranı gördükten sonra hareket etmek", "Yalnız sesli düdük kullanmak", "Uyaran verilmeden rastgele koşmak"],
      a: 1,
      e: "Ders tek uyaran–tek yön aşamasından yanıltıcı hazırlık sonrası gerçek uyarana ilerler. Amaç en erken hareket etmek değil, oyunla ilgili bilgiyi doğru yorumlamaktır.",
    },
    {
      q: "3–6 metrelik öne hızlanmada ilk iki adım nasıl olmalıdır?",
      o: ["Uzun, yavaş ve gövde dik", "Kısa ve güçlü; gövde hafif önde, kollar karşılıklı çalışır", "Ayaklar çapraz ve baş sürekli yana sallanır", "İlk adımda tamamen doğrulup sonra alçalmak"],
      a: 1,
      e: "Kısa mesafede ilk adımların kuvvetli olması hızlanmayı destekler. Hedefe yaklaşınca adımlar küçültülür ve top tekniği için yeniden dengeli, alçak duruş kurulur.",
    },
    {
      q: "Kısa yanal mesafede shuffle hareketinin doğru uygulanışı hangisidir?",
      o: ["Ayakları sürekli çaprazlayarak koşmak", "Yakın ayakla yönü açıp diğer ayakla zemini itmek; ayakları birleştirmeden ve çaprazlamadan ilerlemek", "Her adımda kalçayı tamamen fileden çevirmek", "Dizleri kilitleyerek sıçramak"],
      a: 1,
      e: "Shuffle, oyuncunun gövdesini oyuna dönük tutarak kısa mesafeyi kapatmasını sağlar. Ayakların birleşmesi veya çaprazlanması hareket ritmini ve dengeyi bozar.",
    },
    {
      q: "Shuffle yerine çapraz adım hangi durumda daha uygun bir seçimdir?",
      o: ["Çok kısa bir düzeltme adımında", "Blokta kanada kapanma gibi daha uzun yanal mesafeyi hızla aşmak gerektiğinde", "Topa temas anında tamamen dururken", "Yalnız geriye hareket ederken"],
      a: 1,
      e: "Hareket türü mesafeye ve göreve göre seçilir. Kısa mesafede shuffle dengeyi korurken daha uzun yanal geçişte açılma ve çapraz adım daha hızlı alan kapatabilir.",
    },
    {
      q: "Hızlanma sonrasında güvenli ve etkili frenleme için hangi sıra doğrudur?",
      o: ["Son anda tek uzun adımla dizleri kilitlemek", "Adımları kısaltıp ağırlık merkezini alçaltmak, kalça ve dizleri bükerek kuvveti emmek", "Gövdeyi geriye atıp topuklar üzerinde kaymak", "Hızı azaltmadan doğrudan yön değiştirmek"],
      a: 1,
      e: "Frenleme de hız üretimi kadar önemlidir. Birkaç kontrollü kısa adım, alçalan ağırlık merkezi ve ayak yönünü izleyen dizler oyuncuyu top temasına veya yeni hızlanmaya hazırlar.",
    },
    {
      q: "180 derece yön değiştirmede dönüş ayağı neden gövdeden çok uzağa yerleştirilmemelidir?",
      o: ["Adım sayısını artırdığı için", "Kuvvet emme ve yeniden itiş konumunu bozarak yeni yöndeki çıkışı yavaşlatabileceği için", "Kolların hareketini tamamen durdurduğu için", "Oyuncuyu her zaman fileye yaklaştırdığı için"],
      a: 1,
      e: "Dış ayak gövdeye göre yönetilebilir bir konuma basar; diz ve kalça bükülerek hız emilir. Aşırı uzanmış dönüş ayağı frenleme süresini ve yeni yönde kuvvet üretimini olumsuz etkiler.",
    },
    {
      q: "Savunma alanı kapatırken oyuncunun koşacağı koridoru belirleyen en uygun bilgiler hangileridir?",
      o: ["Yalnız topun rengi", "Pasın gittiği kanat, bloğun kapattığı yön ve hücumcunun yaklaşma ile omuz-kol ipuçları", "Sadece skor tabelası", "Yalnız kendi başlangıç pozisyonu"],
      a: 1,
      e: "Savunmacı en kısa yolu körlemesine koşmaz. Blok çizgiyi mi çaprazı mı kapatıyor, pas nereye gidiyor ve hücumcu hangi vuruşu hazırlıyor sorularını okuyarak açık koridora geçer.",
    },
    {
      q: "Savunmacının rakip vuruş anındaki ideal hareket durumu hangisidir?",
      o: ["Hâlâ yüksek hızla koşuyor olmak", "Frenlemeyi tamamlayıp alçak ve dengeli savunma pozisyonunda bulunmak", "Sırtı hücumcuya dönük olmak", "Ayakları çapraz biçimde sabitlemek"],
      a: 1,
      e: "Top kontrolü için oyuncu vuruştan hemen önce dengelenmelidir. Temas anında koşmaya devam etmek platform açısını ve yön kontrolünü bozar.",
    },
    {
      q: "Kısa topa çıkışta hız ile top kontrolünü birleştiren doğru davranış hangisidir?",
      o: ["Gövdeyi öne atıp mümkün olan en uzaktan tek elle vurmak", "İpucunu erken okuyup ilk adımı alçak atmak, son adımları küçültüp mümkün olduğunda topun arkasına geçmek", "Top düşene kadar dik beklemek", "Hız kesmeden topun üzerinden koşmak"],
      a: 1,
      e: "Kısa top savunmasında erken görsel bilgi ve doğru ayak çalışması, topun altında dengeli bir platform oluşturmayı sağlar. Temas sonrası sporcu hızla ayağa kalkıp ralliyi sürdürür.",
    },
    {
      q: "Bloktan savunmaya geçişte ilk yapılması gereken nedir?",
      o: ["File altında beklemek", "İki ayak üzerine dengeli inip topun kaldığı tarafı görmek", "Hemen sırtı sahaya dönmek", "Rakip yeniden vurmadan fileye yaklaşmak"],
      a: 1,
      e: "Dengeli iniş ikinci hareketin başlangıcıdır. Oyuncu topu gördükten sonra güvenli açılma adımıyla fileden uzaklaşır ve mesafeye göre shuffle veya çapraz adım seçer.",
    },
    {
      q: "Bilimsel bir çalışmada genç kadın voleybolcularda yön değiştirme performansını kontrol grubundan daha fazla geliştiren uygulama hangisidir?",
      o: ["Yalnız uzun mesafe koşusu", "Çeviklik merdiveninin çok yönlü hız çalışmalarıyla birleştirilmesi", "Sadece esneme", "Yön değiştirmeden düz yürüyüş"],
      a: 1,
      e: "Altı haftalık randomize çalışmada hem pliometrik hem çok yönlü hız bileşimleri gelişim sağladı; kontrol grubuna üstünlük özellikle çeviklik merdiveni ile çok yönlü hız grubunda görüldü. Bu bulgu dersin çok yönlü, görev odaklı yapısını destekler.",
    },
    {
      q: "Reaktif saha parkurunda hız niteliğini korumak için doğru uygulama hangisidir?",
      o: ["Her tekrarı uzun bir kondisyon yarışına çevirmek", "3–8 saniyelik oyunla ilişkili tekrarlar yapmak, 30–60 saniye dinlenmek ve karar doğruluğuyla teknik kaliteyi ayrı izlemek", "Rota ve uyaranı her zaman önceden açıklamak", "Teknik bozulsa da süre dolana kadar devam etmek"],
      a: 1,
      e: "Hız çalışmasında kısa ve nitelikli tekrarlarla yeterli dinlenme gerekir. Yanlış karar ile yavaş fiziksel uygulama ayrı kaydedilir; ilk ve son tekrar arasında belirgin süre ya da teknik düşüş varsa seri durdurulur.",
    },
  ],
  "Esneklik ve mobilite": [
    {
      q: "Esneklik ile mobilite arasındaki temel fark hangisidir?",
      o: ["Esneklik yalnız kuvvet, mobilite yalnız denge demektir", "Esneklik pasif hareket açıklığını; mobilite ise bu açıklığı kuvvet, denge ve sinir sistemi kontrolüyle aktif kullanabilmeyi içerir", "İki kavram tamamen aynıdır", "Mobilite yalnız antrenör yardımıyla yapılan pasif harekettir"],
      a: 1,
      e: "Bir sporcu bacağını yardımla yükseğe kaldırabilir fakat aynı açıyı kendi kontrolüyle kullanamayabilir. Mobilite, mevcut açıklığın voleybol hareketinde aktif ve dengeli yönetilmesidir.",
    },
    {
      q: "Mobilite çalışması sırasında nefesin doğru kullanımı hangisidir?",
      o: ["Tüm set boyunca nefesi tutmak", "Sakin nefes alıp verirken kaburga ve gövde kontrolünü korumak, boyun ve belde gereksiz gerginlik oluşturmamak", "Daha fazla açıklık için her nefeste beli zorla bastırmak", "Yalnız ağızdan hızlı nefes almak"],
      a: 1,
      e: "Kontrollü solunum kaburga ve gövde pozisyonunun yönetilmesine yardım eder. Amaç derin nefes uğruna pozisyonu bozmak değil, hareket boyunca rahat ve düzenli nefes almaktır.",
    },
    {
      q: "Ayak bileği dorsifleksiyonu voleybolda hangi hareketleri doğrudan destekler?",
      o: ["Yalnız parmak pas", "Squat, savunma duruşu, frenleme ve inişte dizin topuk kalkmadan öne ilerlemesini", "Yalnız kol salınımını", "Serviste top atışını"],
      a: 1,
      e: "Dorsifleksiyon, dizin ayak ucunun önüne kontrollü ilerlemesidir. Sistematik derlemeler sınırlı dorsifleksiyonun iniş mekaniğini değiştirebildiğini gösterir; bu nedenle açıklık ve hareket kalitesi birlikte değerlendirilir.",
    },
    {
      q: "Diz-duvar dorsifleksiyon testinin geçerli uygulanışı hangisidir?",
      o: ["Topuğu kaldırıp dizi içe yöneltmek", "Topuğu yerde tutup dizi ikinci–üçüncü ayak parmağı yönünde ilerletmek ve iki tarafı aynı koşulda karşılaştırmak", "Ayağı her ölçümde farklı açıya çevirmek", "Ağrıya rağmen duvara ulaşmaya zorlamak"],
      a: 1,
      e: "Topuğun kalkması veya dizin içe kaçması gerçek ayak bileği açıklığını gizler. Aynı protokol sağ–sol farkını izlemeyi ve egzersiz sonrasında yeniden test yapmayı sağlar.",
    },
    {
      q: "Kalça rotasyonu çalışmasında gerçek kalça hareketini koruyan uygulama hangisidir?",
      o: ["Pelvisi kontrol edip hareketi belden veya dizden zorlamamak", "Daha fazla açı için dizi içe bastırmak", "Bel omurlarını son noktaya kadar çevirmek", "Her iki tarafın farklı teknikle çalışmasına izin vermek"],
      a: 0,
      e: "90/90 geçişi ve destekli iç rotasyon gibi çalışmalarda pelvis kontrol edilir. Bel veya diz telafisi görünürde açıklığı artırsa da gerçek kalça mobilitesini göstermez.",
    },
    {
      q: "Arka bacak esnekliği çalışmasında amaç neden yalnız parmaklara ulaşmak değildir?",
      o: ["Parmaklara ulaşmak yalnız omuz kuvvetini ölçtüğü için", "Belden yuvarlanma hareket mesafesini artırabilir; hedef pelvis ve omurga kontrolüyle hareketi kalçadan üretmektir", "Hamstring hiçbir voleybol hareketinde kullanılmadığı için", "Dizlerin her zaman tamamen bükülmesi gerektiği için"],
      a: 1,
      e: "Aktif bacak kaldırma, hamstring süpürme ve kalça menteşesi sırasında belin telafi etmesi sınırlandırılır. Böylece açıklığın kalça ve arka bacak dokularından gelip gelmediği anlaşılır.",
    },
    {
      q: "Göğüs kafesi rotasyonunda doğru kontrol noktası hangisidir?",
      o: ["Pelvisi sabit tutup dönüşü göğüs omurgası çevresinde ağrısız gerçekleştirmek", "Belden mümkün olan en büyük açıda dönmek", "Dönüş sırasında nefesi tutmak", "Kalçayı omuzdan önce son sınıra çevirmek"],
      a: 0,
      e: "Göğüs kafesi rotasyonu smaç ve serviste kuvvet aktarımına katkı sağlar. Pelvisin kontrolü, hareketin belden aşırı dönerek oluşturulmasını engeller.",
    },
    {
      q: "Kol baş üstüne kaldırılırken belin aşırı çukurlaşması ve kaburgaların öne çıkması neyi düşündürür?",
      o: ["Omuz fleksiyonunun kusursuz olduğunu", "Gerçek omuz açıklığı yerine gövde telafisi kullanıldığını", "Kalça rotasyonunun arttığını", "Ayak bileği mobilitesinin yeterli olduğunu"],
      a: 1,
      e: "Omuz fleksiyonu değerlendirilirken kaburgalar pelvis üzerinde, bel kontrollü ve boyun rahat tutulur. Gövde telafisi kısıtlı omuz açıklığını gizleyebilir.",
    },
    {
      q: "Kol yukarı çıkarken kürek kemiğinin doğru davranışı hangisidir?",
      o: ["Göğüs kafesine zorla sabitlenmesi", "Kolla uyumlu biçimde yukarı dönüp göğüs kafesi üzerinde kontrollü hareket etmesi", "Omuzdan bağımsız olarak aşağı çekilmesi", "Belirgin biçimde kanatlaşması"],
      a: 1,
      e: "Kürek kemiği sabit bir platform değildir; kol hareketiyle koordineli yukarı dönüş ve dışa açılma yapar. Zorla sabitlemek omuz ritmini bozabilir.",
    },
    {
      q: "Smaçta omuza gelen yükü bütün vücuda dağıtan doğru hareket zinciri hangisidir?",
      o: ["Yalnız omuz ve dirseğin hızlanması", "Yaklaşma ve bacak kuvveti → pelvis-gövde rotasyonu → göğüs kafesi açılması → kürek kemiği yukarı dönüşü → omuz-dirsek hızlanması", "Belin aşırı yaylanması → kolun geride kalması", "Sadece el bileğinin hızlanması"],
      a: 1,
      e: "Smaç yalnız omuz hareketi değildir. Alt vücuttan başlayan kuvvet, gövde ve kürek kemiği üzerinden kola aktarılır; temas sonrasında kol kontrollü yavaşlar ve gövde inişi dengeler.",
    },
    {
      q: "Blokta file üzerinden erişim sırasında doğru uygulama hangisidir?",
      o: ["Daha uzağa erişmek için beli aşırı geriye yaymak", "Kaburga ve beli kontrol edip kürek kemiği ile omuz fleksiyonunu kullanırken gövdeyi fileye sürüklememek", "Omuzları kulaklara sıkıştırmak", "Tek ayak üzerine sert inmek"],
      a: 1,
      e: "Blok erişimi omuz açıklığı, kürek kemiği yukarı dönüşü, göğüs kafesi kontrolü ve dengeli sıçramanın birleşimidir. Sahte açıklık için belden kaçmak kontrolü azaltır.",
    },
    {
      q: "Kişisel mobilite taramasında ağrı veya instabilite görülürse ne yapılmalıdır?",
      o: ["Son noktaya kadar zorlayıp ölçüm tamamlanmalıdır", "Test durdurulmalı; taramanın tıbbi tanı olmadığı bilinerek gerektiğinde uzman değerlendirmesi istenmelidir", "Yalnız karşı taraf daha sert çalıştırılmalıdır", "Ağrı kayıt formuna yazılmamalıdır"],
      a: 1,
      e: "Tarama, hazırlık ihtiyacını belirler; tanı koymaz. Ağrı, sıkışma, denge kaybı ve telafiler kaydedilir, ağrılı hareket zorlanmaz.",
    },
    {
      q: "Patlayıcı voleybol çalışması öncesinde esneme seçimi için en uygun yaklaşım hangisidir?",
      o: ["Uzun ve zorlayıcı statik esnemeyi tek hazırlık olarak kullanmak", "Dinamik mobiliteyi ve giderek hızlanan voleybola özgü hareketleri öne almak; gerekiyorsa kısa ve ağrısız statik esnemeyi dinamik etkinlikle tamamlamak", "Isınmadan doğrudan maksimum sıçramaya geçmek", "Yalnız pasif esneme yapıp kas aktivasyonunu atlamak"],
      a: 1,
      e: "Sistematik derlemeler dinamik esnemenin güç ve dinamik performans hazırlığında uygun olduğunu; kısa statik esnemenin ise sonrasında dinamik etkinlik bulunduğunda etkisinin sınırlı kalabildiğini gösterir. Ders uzun ve zorlayıcı statik esnemeyi patlayıcı çalışma öncesine koymaz.",
    },
    {
      q: "Antrenmana özel mobilite akışı nasıl seçilmelidir?",
      o: ["Her gün vücudun tüm bölgelerine aynı uzun program uygulanarak", "Antrenmanın ana görevine ve kişisel kısıtlara göre; sıçrama gününde ayak bileği-kalça, servis-smaç gününde göğüs kafesi-omuz-kürek kemiği öncelenerek", "Yalnız sporcunun en esnek bölgesi çalıştırılarak", "Saha çalışmasından tamamen bağımsız hazırlanarak"],
      a: 1,
      e: "Mobilite akışı amaç odaklı ve kısa olmalıdır. Kazanılan açıklık aktif squat, hamle, erişim veya düşük şiddetli voleybol hareketiyle gerçek göreve aktarılır.",
    },
    {
      q: "Bir mobilite egzersizinin sporcu için yararlı olduğuna dair en güçlü ders içi gösterge hangisidir?",
      o: ["Sporcunun mümkün olan en büyük pasif açıya ulaşması", "Yeniden testte hedef voleybol hareketinin ağrısız ve daha kontrollü yapılması", "Egzersiz sırasında şiddetli gerilme ve ağrı oluşması", "Sağ–sol farkının kaydedilmemesi"],
      a: 1,
      e: "Mobilitenin amacı yalnız daha uzağa gitmek değildir. Aynı protokolle yapılan yeniden testte hareket kalitesinin ve aktif kontrolün iyileşmesi, seçilen egzersizin göreve aktarımını gösterir.",
    },
  ],
  "Isınma ve soğuma": [
    {
      q: "İyi planlanmış bir voleybol ısınmasının temel sonucu ne olmalıdır?",
      o: ["Sporcuyu ana çalışma başlamadan tükenişe götürmek", "Sporcuyu daha hareketli, odaklanmış ve teknik çalışmaya hazır hâle getirirken gereksiz yorgunluk oluşturmamak", "Yalnız terlemeyi sağlamak", "Antrenmandaki bütün sıçramaları önceden tamamlamak"],
      a: 1,
      e: "Isınma kasları, eklemleri, dolaşım sistemini ve dikkati ana göreve hazırlar. Isınma sonunda sporcu yorgun değil; canlı, kontrollü ve oyun hareketlerine hazır olmalıdır.",
    },
    {
      q: "Ders içeriğine göre ısınmanın doğru genel sırası hangisidir?",
      o: ["Tam güç sıçrama → statik dinlenme → hafif koşu", "Genel hazırlık → hareketlilik → aktivasyon → hız/sıçrama hazırlığı → topla voleybola özgü hazırlık", "Topla tam güç smaç → aktivasyon → genel hazırlık", "Soğuma → hız → eklem hareketleri"],
      a: 1,
      e: "Isınma basitten karmaşığa ve düşük şiddetten oyun hızına ilerler. Genel vücut ısısı yükseltildikten sonra hareketlilik, aktivasyon ve giderek daha özgül voleybol görevleri uygulanır.",
    },
    {
      q: "Isınmanın ilk 3–5 dakikasında nabız nasıl yükseltilmelidir?",
      o: ["İlk saniyeden maksimum sprintle", "Konuşmayı tamamen engellemeyen rahat tempodan orta şiddete kademeli geçerek", "Hareketsiz statik esnemeyle", "Yüksek hacimli blok sıçramalarıyla"],
      a: 1,
      e: "Yürüyüş, hafif koşu, yan adım ve düşük şiddetli skipping ile şiddet her dakika biraz artırılır. Ani tam hız koşu veya yüksek sıçramayla başlanmaz.",
    },
    {
      q: "Baş dönmesi, göğüs ağrısı veya olağan dışı nefes darlığı ısınma sırasında ortaya çıkarsa ne yapılmalıdır?",
      o: ["Şiddet artırılarak belirtilerin geçmesi beklenmelidir", "Çalışma durdurulmalı ve uygun sağlık prosedürü uygulanmalıdır", "Yalnız su içip maksimum koşuya devam edilmelidir", "Belirti antrenörle paylaşılmamalıdır"],
      a: 1,
      e: "Bu belirtiler normal ısınma hissi olarak kabul edilmez. Sporcu durur, durum değerlendirilir ve gerektiğinde sağlık desteği alınır.",
    },
    {
      q: "Dinamik eklem hareketlerinin doğru uygulanışı hangisidir?",
      o: ["Eklemleri ağrılı son noktaya savurmak", "Kontrollü tekrarlarla, giderek büyüyen rahat hareket aralığında ve telafisiz uygulamak", "Her pozisyonda birkaç dakika hareketsiz kalmak", "Yalnız omuzları hazırlamak"],
      a: 1,
      e: "Dinamik hareketlilik, eklemleri antrenmanda kullanılacak açıklığa hazırlar. Ayak bileği, kalça, göğüs kafesi ve omuz hareketleri ağrısız ve kontrollü gerçekleştirilir.",
    },
    {
      q: "Kalça ve gövde aktivasyonu neden tükenişe kadar yapılmamalıdır?",
      o: ["Bu kaslar voleybolda kullanılmadığı için", "Amaç kasları savunma, frenleme, sıçrama ve kuvvet aktarımına hazırlamak; ana çalışma öncesinde yormamak olduğu için", "Aktivasyon yalnız soğumada yapıldığı için", "Tükeniş hareket açıklığını her zaman artırdığı için"],
      a: 1,
      e: "Köprü, mini bant yana adım, dead bug ve yan plank gibi hareketler düşük-orta hacimde uygulanır. Hedef kas hissi ve gövde kontrolü aranır, belirgin yorgunluk değil.",
    },
    {
      q: "Ayak bileği ve diz hazırlığında düşük sıçrama–tutuş çalışmasının temel amacı nedir?",
      o: ["Mümkün olan en yüksek sıçramayı test etmek", "Ayak tabanı desteği, diz-kalça hizası ve kontrollü inişi düşük şiddette etkinleştirmek", "Sporcuyu maç öncesi yormak", "Dizleri kilitleyerek yere sert inmeyi öğretmek"],
      a: 1,
      e: "Düşük sıçrama-tutuş, ayak bileği hareketini ve iniş zincirini güvenli hızda hazırlar. Topuk, diz ve pelvis kontrolü bozulmadan tamamlanmalıdır.",
    },
    {
      q: "Servis ve smaç öncesi omuz hazırlığı neden yalnız kol çevirmekten oluşmamalıdır?",
      o: ["Kol çevirmek her zaman ağrı oluşturduğu için", "Baş üstü hareket kürek kemiği, rotator manşet, sırt ve gövdenin koordineli çalışmasını gerektirdiği için", "Omuz servis sırasında hareket etmediği için", "Yalnız boyun kasları önemli olduğu için"],
      a: 1,
      e: "Duvar kaydırma, lastikle dış rotasyon, yüz çekişi ve serratus erişimi omuz kuşağını bütüncül hazırlar. Voleybolcularda uygulanan özgül omuz ısınma programlarının yaralanma sıklığı ve şiddeti üzerinde olumlu sonuçları bildirilmiştir.",
    },
    {
      q: "Isınmanın kısa hızlanma bölümünde doğru yüklenme hangisidir?",
      o: ["Aralıksız uzun mesafe koşmak", "İlk tekrarları orta hızda, son tekrarları oyun hızına yakın yapmak ve kaliteyi koruyacak dinlenme vermek", "İlk tekrarı maksimum yapıp diğerlerini yorgun tamamlamak", "Frenleme çalışmasını tamamen atlamak"],
      a: 1,
      e: "Voleybola özgü 2–5 metrelik çıkışlar, shuffle, çapraz adım ve frenleme kullanılır. Kısa tekrarlar arasındaki dinlenme hız niteliğini ve diz hizasını korur.",
    },
    {
      q: "Topla teknik ısınmada doğru ilerleme hangisidir?",
      o: ["İlk topta tam güç sıçrama servisi", "Yakın mesafe pas ve manşetten hareketli hedeflere, kontrollü servis-hücuma ve kısa oyun rallisine ilerlemek", "Topla bölümü yalnız serbest vuruşa ayırmak", "Teknik kontrolü değerlendirmeden hızı sabit tutmak"],
      a: 1,
      e: "Topla bölüm hareket hissini ve iletişimi kurar. Teknik basitten oyun hızına taşınır; ilk dakikada tam güç servis veya smaçla kontrolsüz yük oluşturulmaz.",
    },
    {
      q: "Maç öncesi sıçrama hazırlığında en uygun uygulama hangisidir?",
      o: ["Bacaklar yorulana kadar kesintisiz maksimum sıçrama", "Düşük genlikten başlayıp orta şiddete ve birkaç yüksek kaliteli oyun hızı tekrarına ilerlemek", "Isınmadan doğrudan maksimum yaklaşmalı sıçrama", "Her sıçramada sert inişi teşvik etmek"],
      a: 1,
      e: "Sıçrama hazırlığı sinir-kas sistemini uyarır fakat yüksek hacimle yorgunluk yaratmaz. Her türde az sayıda kaliteli tekrar ve yeterli dinlenme kullanılır.",
    },
    {
      q: "Bilimsel çalışmaların voleybola özgü yapılandırılmış ısınma programları için desteklediği sonuç hangisidir?",
      o: ["Isınmanın yaralanmalarla hiçbir ilişkisi olamaz", "Aerobik, dinamik, denge-kuvvet ve spora özgü öğeler içeren programlar bazı gruplarda özellikle akut ve üst ekstremite yaralanma yükünü azaltabilir", "Yalnız statik esneme bütün yaralanmaları önler", "Her sporcu için aynı program yüzde yüz koruma sağlar"],
      a: 1,
      e: "Genç voleybolculardaki VolleyVeilig araştırmasında müdahale gruplarında akut ve üst ekstremite yaralanmaları ile yaralanma yükünde azalma bildirilmiştir. Sonuçlar program uyumu ve bireysel gereksinimlerle birlikte yorumlanmalıdır.",
    },
    {
      q: "Yoğun antrenmandan sonra doğru aktif soğuma yaklaşımı hangisidir?",
      o: ["Aniden yere oturmak", "3–5 dakika rahat yürüyüş ve çok hafif hareketle şiddeti kademeli azaltmak", "Ekstra yüksek şiddetli kondisyon yapmak", "Nefesi mümkün olduğunca uzun tutmak"],
      a: 1,
      e: "Soğuma yeni bir kondisyon yükü değildir. Rahat hareketle nabız ve nefesin doğal biçimde sakinleşmesine izin verilir; olağan dışı belirti varsa sağlık prosedürü uygulanır.",
    },
    {
      q: "Soğuma sırasında nefes ve gevşeme çalışmasının güvenli uygulanışı hangisidir?",
      o: ["Zorla çok derin ve uzun nefes almak", "Boyun ve omuzları gevşetip 4–6 rahat, ritmik soluk kullanmak; baş dönmesinde normal nefese dönmek", "Tüm uygulama boyunca nefesi tutmak", "Hızlı soluklarla baş dönmesini artırmak"],
      a: 1,
      e: "Amaç bedensel uyarılmayı zorlamadan azaltmaktır. Sporcu rahat pozisyonda nefes alır; baş dönmesi veya rahatsızlıkta uygulamayı bırakır.",
    },
    {
      q: "Antrenman sonrası kişisel kontrol kaydında hangi bilgiler birlikte değerlendirilmelidir?",
      o: ["Yalnız kazanılan sayı", "Seans zorluğu, genel yorgunluk, kas veya eklem ağrısı, sıvı-beslenme ihtiyacı, uyku planı ve olağan dışı belirtiler", "Sadece antrenman süresi", "Yalnız ertesi günün maç saati"],
      a: 1,
      e: "Tek bir puan tanı koymaz; birkaç günlük eğilimler önemlidir. Keskin ağrı, baş dönmesi veya olağan dışı nefes darlığı gecikmeden bildirilir ve sonraki yük buna göre planlanır.",
    },
  ],
  "Sakatlık önleme": [
    {
      q: "Voleybolda sakatlık önleme yaklaşımının en doğru amacı hangisidir?",
      o: ["Bütün sakatlıkların kesinlikle oluşmayacağını garanti etmek", "Değiştirilebilir riskleri azaltmak, erken belirtileri tanımak ve güvenli yüklenme alışkanlıkları geliştirmek", "Sporcuyu zor hareketlerden tamamen uzak tutmak", "Ağrı ortaya çıkana kadar yükü sürekli artırmak"],
      a: 1,
      e: "Hiçbir program bütün olayları önleyemez. Dersin amacı kontrol edilebilir riskleri azaltmak, belirtileri erken bildirmek ve teknik, yük, toparlanma ile çevreyi birlikte yönetmektir.",
    },
    {
      q: "Hangisi normal antrenman yorgunluğundan farklı olarak çalışmayı durdurup bildirmeyi gerektiren bir belirtidir?",
      o: ["İki tarafta hafif ve geçici kas yorgunluğu", "Tek noktada keskin, giderek artan ve hareket biçimini değiştiren ağrı", "Isınma sırasında hafif terleme", "Yoğun setten sonra kısa süreli normal nefes artışı"],
      a: 1,
      e: "Keskin veya artan ağrı, şişlik, şekil bozukluğu, üzerine basamama, eklemde boşalma, uyuşma veya güç kaybı uyarı işaretidir. Ağrıyı gizleyerek devam etmek sorunu büyütebilir.",
    },
    {
      q: "75 dakika süren ve algılanan zorluğu 6/10 olan bir antrenmanın basit seans yükü kaçtır?",
      o: ["81 birim", "450 birim", "12,5 birim", "750 birim"],
      a: 1,
      e: "Derste seans yükü, süre × algılanan zorluk olarak hesaplanır. 75 × 6 = 450 keyfî yük birimidir; sıçrama, servis-smaç hacmi ve iyi oluş göstergeleri ayrıca izlenir.",
    },
    {
      q: "Sakatlık riskini izlerken neden yalnız antrenman süresine bakmak yetersizdir?",
      o: ["Süre ölçülemediği için", "Aynı sürede şiddet, sıçrama ve baş üstü vuruş hacmi ile sporcunun uyku, ağrı ve stres durumu farklı olabileceği için", "Yalnız maç sonucu önemli olduğu için", "Uzun antrenman her zaman düşük şiddetli olduğu için"],
      a: 1,
      e: "Yük; süre, şiddet ve voleybola özgü tekrarları içerir. Birkaç günlük eğilim, performans ve toparlanma bilgisiyle birlikte değerlendirilir; tek bir sayı tanı koymaz.",
    },
    {
      q: "Servis ve smaç öncesi omuz koruyucu hazırlık hangi yapıları birlikte çalıştırmalıdır?",
      o: ["Yalnız pazı kasını", "Rotator manşet, kürek kemiği, sırt ve gövdeyi", "Yalnız el bileğini", "Sadece boyun kaslarını"],
      a: 1,
      e: "Duvar kaydırma, dış rotasyon, yüz çekişi, serratus erişimi ve kontrollü gölge vuruşları omuz kuşağını bütüncül hazırlar. Voleybolcularda özgül omuz ısınmasının yaralanma sayısı ve şiddetini azaltabildiği bildirilmiştir.",
    },
    {
      q: "Baş üstü harekette kürek kemiğinin doğru davranışı hangisidir?",
      o: ["Göğüs kafesine zorla sabitlenmek", "Kolla uyumlu biçimde yukarı dönüp göğüs kafesi üzerinde akıcı hareket etmek", "Omzu kulağa doğru sıkıştırmak", "Belin aşırı çukurlaşmasını sağlamak"],
      a: 1,
      e: "Kürek kemiği kola hareketli ve sağlam bir taban oluşturur. Zorla sabitleme, kanatlaşma, boyun gerginliği veya bel telafisi sağlıklı omuz ritmini bozar.",
    },
    {
      q: "Squat, frenleme ve inişte diz kontrolünün doğru göstergesi hangisidir?",
      o: ["Dizin ayağın baktığı yönü izlemesi ve ayak tabanı desteğiyle kalça-gövde kontrolünün korunması", "Dizlerin her tekrarda içe çökmesi", "Topukların sürekli kalkması", "Yük arttıkça hizanın önemini kaybetmesi"],
      a: 0,
      e: "Diz hizası yalnız diz kaslarına bağlı değildir; ayak desteği, kalça kuvveti, gövde kontrolü ve uygun yük düzeyi birlikte rol oynar.",
    },
    {
      q: "Ayak bileği burkulmasını önleme yaklaşımında en kapsamlı seçenek hangisidir?",
      o: ["Yalnız bant kullanmak", "Hareket açıklığı, baldır kuvveti, tek ayak dengesi, tepki çalışması ve file altında güvenli iniş alanı alışkanlığını birlikte geliştirmek", "Sadece ayak bileğini sabit tutmak", "Burkulma geçmişini göz ardı etmek"],
      a: 1,
      e: "Voleybolda ayak bileği yaralanmaları özellikle file altında başka ayağa basma ile ilişkilidir. Destek veya bant yalnız sağlık profesyoneli önerisiyle, kuvvet-denge ve güvenli saha davranışının tamamlayıcısı olarak kullanılır.",
    },
    {
      q: "Tek bacak denge çalışmasında uygun ilerleme sırası hangisidir?",
      o: ["Doğrudan gözler kapalı maksimum yana sıçrama", "Destekli duruştan desteksiz duruşa; ardından top takibi, mini squat, erişme ve küçük sıçrama-tutuşa ilerlemek", "Yalnız güçlü bacağı çalıştırmak", "Denge kurulmadan reaktif top eklemek"],
      a: 1,
      e: "İlerleme basitten karmaşığa yapılır. Sağ ve sol tarafta diz hizası, hareket aralığı ve iki saniyelik denge aynı ölçütlerle izlenir.",
    },
    {
      q: "File yakınında güvenli sıçrama inişi için ilk öncelik hangisidir?",
      o: ["Havadayken iniş alanını görüp mümkün olduğunda iki ayakla, sessiz ve dengeli inmek; başka oyuncunun ayağına temastan kaçınmak", "Sıçrama yüksekliği ne olursa olsun file altına ilerlemek", "Dizleri kilitleyerek tek ayak üzerine inmek", "İniş alanına bakmadan topu izlemeyi sürdürmek"],
      a: 0,
      e: "İnişte ayak bileği, diz ve kalça birlikte bükülerek kuvvet dağıtılır. Sıçrama yüksekliği hiçbir zaman sporcunun iniş kontrolünün üzerine çıkarılmamalıdır.",
    },
    {
      q: "Yuvarlanma ve plonjon öğretiminde güvenli başlangıç hangisidir?",
      o: ["Sert zeminde tam hız ve yüksekten atlama", "Yumuşak zeminde, alçak pozisyondan güvenli yan düşüş ve omuz üzerinden çapraz yuvarlanmayı gözetimle öğrenmek", "Baş ve boyun üzerine doğrudan temas etmek", "Bileği zemine sertçe dayamak"],
      a: 1,
      e: "Yuvarlanma darbeyi dağıtmayı amaçlar. Baş-boyun korunur; minder üzerinde topsuz ve düşük hızlı tekrarlarla başlanıp top ve oyun hızı aşamalı eklenir.",
    },
    {
      q: "Antrenman sırasında hangi yorgunluk örüntüsü yükün azaltılmasını gerektirir?",
      o: ["Teknik kalite korunurken normal efor hissi", "Sıçrama yüksekliğinde belirgin düşüş, sert veya tek taraflı iniş, koordinasyon kaybı ve tekrarlayan teknik hata", "Isınma sonrası hareketlerin kolaylaşması", "Dinlenmeyle normale dönen hafif solunum artışı"],
      a: 1,
      e: "Hızlı performans düşüşü, olağan dışı ağrı, baş dönmesi, görme sorunu veya günlerce süren uyku ve performans bozulması yükün yeniden değerlendirilmesini gerektirir.",
    },
    {
      q: "Uyku ve toparlanma günlüğünün doğru kullanımı hangisidir?",
      o: ["Tek bir kötü uyku puanıyla tıbbi tanı koymak", "Uyku, yorgunluk, ağrı, iştah-sıvı ve yaşam stresi eğilimlerini birkaç gün izleyip kötüleşmede antrenörle yük ayarlamak", "Yalnız maç günlerinde kayıt yapmak", "Kötüleşen belirtileri gizlemek"],
      a: 1,
      e: "Toparlanma antrenmana verilen uyumu destekler. Tek değer yerine zaman içindeki eğilim ve ertesi günün antrenman yükü birlikte yorumlanır.",
    },
    {
      q: "Sakatlık sonrası sahaya dönüşte doğru temel ilke hangisidir?",
      o: ["Ağrı biraz azalınca doğrudan tam maça dönmek", "Sağlık onayıyla temel hareket, kuvvet-denge, koşu, yön değiştirme, sıçrama, teknik ve takım yükünü basamaklı artırmak", "Sporcunun tanı ve dönüş kararını yalnız kendisinin vermesi", "Ertesi gün belirtilerini değerlendirmemek"],
      a: 1,
      e: "Dönüş yalnız ağrının azalması değildir. Her basamakta ağrı, şişlik, güven, teknik ve ertesi gün tepkisi izlenir; belirti artarsa ilerleme durdurularak sağlık profesyoneline bildirilir.",
    },
    {
      q: "Baş darbesi sonrası baş ağrısı, sersemlik veya denge sorunu yaşayan sporcu için doğru uygulama hangisidir?",
      o: ["Belirtiler hafifse aynı gün oyuna dönmek", "Oyundan çıkarıp değerlendirmeye yönlendirmek; aynı gün geri döndürmemek ve sağlık onayıyla basamaklı dönüş uygulamak", "Sadece birkaç dakika oturtup maksimum sıçrama testi yapmak", "Belirtileri takım arkadaşlarından saklamak"],
      a: 1,
      e: "Uluslararası spor beyin sarsıntısı uzlaşısı şüpheli durumda sporcunun oyundan çıkarılmasını, değerlendirilmesini ve kontrollü dönüş sürecini destekler. Aynı gün dönüş ciddi sağlık riski oluşturabilir.",
    },
  ],
  "Sporcu beslenmesi": [
    {
      q: "Çocuk ve genç voleybolcularda yeterli enerji alımı neden yalnız antrenman performansı için değerlendirilmez?",
      o: ["Enerji yalnız kaslara gittiği için", "Büyüme, öğrenme, bağışıklık, hormon işlevi, günlük yaşam ve toparlanmayı da desteklediği için", "Genç sporcuların dinlenme gününde enerjiye ihtiyacı olmadığı için", "Yalnız vücut ağırlığını artırdığı için"],
      a: 1,
      e: "Enerji kullanılabilirliği, egzersizden sonra vücudun temel işlevlerine kalan enerjiyi ifade eder. Uzun süreli yetersizlik kadın ve erkek sporcularda sağlık ile performansı olumsuz etkileyebilir.",
    },
    {
      q: "Hangisi uzun süreli yetersiz enerji alımını düşündürebilecek ve bildirilmesi gereken bir örüntüdür?",
      o: ["Antrenman sonrası geçici normal iştah", "Sürekli yorgunluk, performans düşüşü, sık hastalanma, istemsiz kilo değişimi ve toparlanmanın uzaması", "Dengeli öğünlerden sonra tokluk", "Dinlenme gününde daha az acıkmak"],
      a: 1,
      e: "Bu belirtiler tek başına tanı değildir. Uyku, ruh hâli veya adet düzenindeki değişiklikler ve yemekle ilgili aşırı kaygı da aileye, antrenöre ve uygun sağlık profesyoneline bildirilmelidir.",
    },
    {
      q: "Yoğun antrenman gününde dengeli sporcu tabağı nasıl uyarlanabilir?",
      o: ["Karbonhidrat tamamen çıkarılır", "Karbonhidrat bölümü gereksinime göre artırılır; protein, sebze-meyve, sağlıklı yağ ve sıvı çeşitliliği korunur", "Yalnız protein yenir", "Bütün öğün tek bir şekerli üründen oluşturulur"],
      a: 1,
      e: "Tabak oranları yük, yaş, iştah ve kişisel gereksinime göre değişir. Yoğun gün daha fazla yakıt gerektirebilir; hafif günde de besin grubu çeşitliliği korunur.",
    },
    {
      q: "Karbonhidratın voleyboldaki temel performans rolü hangisidir?",
      o: ["Yalnız kemik yapımına katılmak", "Sıçrama, servis, hızlı savunma ve tekrarlı ralliler gibi yüksek şiddetli hareketler için önemli yakıt sağlamak", "Protein sentezinin tamamını tek başına yapmak", "Sıvı ihtiyacını tamamen ortadan kaldırmak"],
      a: 1,
      e: "Kas glikojeni ve kan glukozu yüksek şiddetli çalışmaya katkı sağlar. Karbonhidratı tamamen kesmek ya da yalnız şekerli ürünlerden almak dengeli sporcu beslenmesi değildir.",
    },
    {
      q: "Proteinin toparlanma amacıyla en uygun kullanımı hangisidir?",
      o: ["Günün bütün proteinini tek bir gece öğününde tüketmek", "Çeşitli kaliteli kaynakları ana ve ara öğünlere dağıtmak ve toparlanmada karbonhidratla birlikte kullanabilmek", "Karbonhidratın yerine tamamen protein koymak", "Yalnız takviye ürünlerinden almak"],
      a: 1,
      e: "Protein kas, tendon ve diğer dokuların yapım-onarımını destekler. Günlük toplam miktar önemlidir; gerçek besin kaynaklarını gün içine dağıtmak pratik bir yaklaşımdır.",
    },
    {
      q: "Kemik sağlığı ve mikro besin yeterliliği için en doğru yaklaşım hangisidir?",
      o: ["Tek bir vitamin takviyesine güvenmek", "Yeterli enerji ve proteinle birlikte kalsiyum, D vitamini, demir ve diğer besinleri çeşitli gerçek besinlerden değerlendirmek", "Bütün yağları diyetten çıkarmak", "Demir düşüklüğü şüphesinde kendi kendine yüksek doz takviye başlamak"],
      a: 1,
      e: "Yağlar enerji, hücre yapısı ve yağda çözünen vitaminler için gereklidir. Demir veya D vitamini gibi konularda eksiklik şüphesi profesyonel değerlendirme gerektirir.",
    },
    {
      q: "Voleybolcunun günlük sıvı planı neden tek bir sabit litre değerine bağlanmamalıdır?",
      o: ["Su hiçbir zaman ölçülemediği için", "Vücut büyüklüğü, sıcaklık, nem, süre, kıyafet ve kişisel terleme hızı ihtiyacı değiştirdiği için", "Yalnız maç skoru sıvı ihtiyacını belirlediği için", "Genç sporcular terlemediği için"],
      a: 1,
      e: "Gün boyunca düzenli sıvı, kişisel şişe, susama ve idrar rengi gibi işaretler birlikte izlenir. Profesyonel gözetimde antrenman öncesi-sonrası ağırlık değişimi kişisel terleme planına yardım edebilir.",
    },
    {
      q: "Aşırı hızlı ve gereksiz miktarda sıvı tüketmek neden doğru değildir?",
      o: ["Sıvı yalnız antrenman sonunda içilebildiği için", "Kişisel kaybın çok üzerinde içmek rahatsızlık ve kandaki sodyumun aşırı seyrelmesi gibi riskler oluşturabileceği için", "Su kaslarda enerji üretimini durdurduğu için", "Her durumda susuzluk oluşturduğu için"],
      a: 1,
      e: "Hedef ne susuz kalmak ne de kontrolsüz biçimde aşırı içmektir. Plan çevre, süre, terleme ve sağlık durumuna göre kişiselleştirilir.",
    },
    {
      q: "Antrenman öncesi öğün için en doğru zamanlama ilkesi hangisidir?",
      o: ["Antrenmana yaklaştıkça öğünü büyütmek ve yağ-lifi artırmak", "Birkaç saat varsa dengeli öğün; süre kısaldıkça daha küçük, kolay sindirilen ve önceden denenmiş seçenek kullanmak", "Her antrenmanda yeni ürün denemek", "Bütün gün aç kalıp son dakikada çok ağır yemek"],
      a: 1,
      e: "Ön öğünün amacı enerji sağlarken mide rahatsızlığını azaltmaktır. Kişisel tolerans antrenmanda sınanır; yarışma veya maç günü ilk kez ürün denenmez.",
    },
    {
      q: "Kısa ve normal şiddetteki bir antrenmanda çoğu sporcu için antrenman sırasında temel yaklaşım hangisidir?",
      o: ["Yüksek kafeinli enerji içeceği zorunludur", "Önceden yapılmış dengeli beslenme ve uygun su planı çoğunlukla yeterlidir", "Her 10 dakikada protein takviyesi gerekir", "Sıvı tüketilmemelidir"],
      a: 1,
      e: "Uzun, yoğun, sıcak veya çok seanslı günlerde karbonhidrat ve elektrolit ihtiyacı artabilir. Karar süre, şiddet, çevre, terleme, önceki öğün ve kişisel toleransa göre verilir.",
    },
    {
      q: "Enerji içeceği ile sporcu içeceği hakkında doğru ifade hangisidir?",
      o: ["İkisi her zaman aynı üründür", "Yüksek kafeinli enerji içeceği, karbonhidrat-elektrolit amaçlı sporcu içeceğiyle aynı değildir ve özellikle gençlerde uygun kabul edilmez", "Enerji içeceği suyun her zaman daha güvenli karşılığıdır", "Sporcu içeceği her antrenmanda zorunludur"],
      a: 1,
      e: "Ürünün adı değil içeriği ve kullanım amacı değerlendirilir. Genç sporcularda yüksek kafeinli ürünlerden ve rastgele takviyelerden kaçınılır.",
    },
    {
      q: "Antrenman sonrası toparlanma öğününün üç temel bileşeni hangileridir?",
      o: ["Yalnız protein, kafein ve vitamin tableti", "Karbonhidrat, protein ve sıvı", "Yalnız yağ ve lif", "Sadece su ve tuz"],
      a: 1,
      e: "Karbonhidrat enerji depolarını, protein doku onarımını, sıvı ise kayıpların yerine konmasını destekler. Terleme yüksekse elektrolit ve tuz ihtiyacı kişiye göre değerlendirilir.",
    },
    {
      q: "Aynı gün ikinci maç bulunan turnuvada öğün seçimi nasıl yapılmalıdır?",
      o: ["Maçlar arasındaki süreye bakmadan çok ağır ve yağlı yemek", "Arayı kısa, orta veya uzun olarak sınıflandırıp sindirimi kolay, denenmiş ve güvenli saklanmış seçeneğin boyutunu buna göre ayarlamak", "Bozulabilir yiyeceği sıcak çantada saatlerce tutmak", "İlk kez kullanılan takviyeyi denemek"],
      a: 1,
      e: "Kısa arada küçük ve kolay sindirilen yakıt, uzun arada daha kapsamlı öğün planlanabilir. Soğuk zincir ve gıda güvenliği performans kadar önemlidir.",
    },
    {
      q: "Beslenme günlüğünün doğru amacı hangisidir?",
      o: ["Çocuk ve genç sporcuda kalori ve kilo takıntısı oluşturmak", "Öğün zamanı, enerji, sindirim, performans, uyku ve toparlanma arasındaki kişisel örüntüleri davranış odaklı görmek", "Her gün yiyecekleri yasaklı ve serbest diye ayırmak", "Yalnız vücut ağırlığını kaydetmek"],
      a: 1,
      e: "Günlük bir tanı aracı değildir ve kısıtlayıcı kilo takibine dönüşmemelidir. Amaç kişisel toleransı fark edip spor diyetisyeni veya sağlık ekibiyle güvenli değişiklik planlamaktır.",
    },
    {
      q: "Bir besin takviyesi üzerinde 'doğal' yazması ne anlama gelir?",
      o: ["Ürünün kesinlikle güvenli ve dopingsiz olduğunu", "Güvenlik, etiket doğruluğu veya yasaklı madde içermeme garantisi vermediğini", "Üçüncü taraf teste gerek olmadığını", "Genç sporcuların hekim görüşü olmadan kullanabileceğini"],
      a: 1,
      e: "IOC uzlaşı raporu takviyelerde sağlık, içerik ve istemeden doping riskini vurgular. Önce gereksinim ve beslenme değerlendirilir; hekim, spor diyetisyeni ve anti-doping kurallarıyla risk-fayda analizi yapılır. Üçüncü taraf test riski azaltabilir fakat sıfırlamaz.",
    },
  ],
  "Mental hazırlık": [
    {
      q: "23-23 skorunda servis sırası kendisinde olan oyuncu için hangisi uygulanabilir bir görev cümlesidir?",
      o: ["Bu servisi kesin kaçıracağım", "Hata yaparsam herkes bana kızacak", "Nefes ver, bölge 5 hedefini gör, dengeli atış ve kontrollü temas uygula", "Bu sayıyı mutlaka kazanmalıyım"],
      a: 2,
      e: "Skor 23-23 bir olay, 'kaçıracağım' bir düşünce, nefes-hedef-atış-temas ise kontrol edilebilir görevdir. Oyuncu düşünceyi bastırmadan fark eder ve dikkatini uygulanabilir harekete taşır.",
    },
    {
      q: "Kaygı uyandıran bir düşünce ortaya çıktığında dersin önerdiği ilk yaklaşım hangisidir?",
      o: ["Düşünceyle uzun süre tartışmak", "Düşünceyi kesin gerçek kabul etmek", "Düşünceyi kısa biçimde adlandırıp nefes vererek tek görev ipucuna dönmek", "Düşünceyi kimseye söylemeden bastırmak"],
      a: 2,
      e: "'Hata düşüncesi geldi' biçiminde fark etmek, düşünce ile gerçek olay arasında mesafe oluşturur. Ardından sporcu kontrol edebildiği tek görevi seçer.",
    },
    {
      q: "Servis öncesi nefes kullanımının amacı nedir?",
      o: ["Bedeni tamamen gevşetip enerji düzeyini sıfıra indirmek", "Uyarılmayı işlevsel hazır oluş düzeyine getirip dikkati bir sonraki göreve toplamak", "Mümkün olduğunca uzun süre nefesi tutmak", "Baş dönmesi oluşana kadar derin nefes almak"],
      a: 1,
      e: "Bir veya iki rahat nefes, çene ve elleri gevşetme ve kısa odak sözcüğü kullanılabilir. Baş dönmesinde zorlayıcı nefes bırakılıp normal solunuma dönülür.",
    },
    {
      q: "Oyuncunun dikkati geçmişteki hataya kaydığında şimdiye dönmesine yardım eden üç çapa hangileridir?",
      o: ["Skor tahmini, seyirci ve sonuç", "Görsel ipucu, bedensel his ve görev sözcüğü", "Rakibin ünü, hakem ve önceki set", "Yalnız olumlu düşünce"],
      a: 1,
      e: "Topun dikişi veya hedef görsel; ayak tabanı veya nefes bedensel; 'ilk adım' veya 'platform hedefe' ise görev çapasıdır. Amaç dikkati mevcut rallideki eyleme döndürmektir.",
    },
    {
      q: "Hangisi iyi tanımlanmış bir süreç hedefidir?",
      o: ["Maçı mutlaka 3-0 kazanmak", "Hiç hata yapmamak", "Her servis karşılamadan önce saha paylaşımını söyleyip alçak hazır duruş almak", "Rakibin kötü oynamasını sağlamak"],
      a: 2,
      e: "Süreç hedefi kısa, gözlenebilir, uygulanabilir ve zamana bağlıdır. Kazanmak değerli bir sonuç hedefidir ancak tek oyuncunun tam kontrolünde değildir.",
    },
    {
      q: "Etkili iç konuşmanın doğru örneği hangisidir?",
      o: ["Asla hata yapmayacağım", "Ben her zaman en iyiyim", "Topun arkasına geç, platformu hedefe çevir", "Hata yaparsam oyundan çıkarım"],
      a: 2,
      e: "Etkili iç konuşma gerçekçi, kısa ve görev odaklıdır. Meta-analitik araştırmalar, özellikle eğitimle uygulanan öğretici iç konuşmanın performansı destekleyebildiğini gösterir.",
    },
    {
      q: "Servis öncesi rutinin doğru özelliği hangisidir?",
      o: ["Sonuca göre her seferinde tamamen değişmesi", "Kısa, aynı sıralı, zaman kurallarına uygun ve servis sonrası savunma görevine bağlanan davranışlardan oluşması", "Batıl bir ritüel olarak uzatılması", "Yalnız topa bakmadan yapılan nefes çalışması olması"],
      a: 1,
      e: "Skor ve planı görme, hedef seçme, rahat nefes, top hazırlığı, odak sözcüğü ve temas ritmi rutinin parçalarıdır. Rutinin uygulanması servis sonucundan ayrı değerlendirilir.",
    },
    {
      q: "Karşılama öncesi rutinde servis vuruşundan önce tamamlanması gereken hazırlık hangisidir?",
      o: ["Sadece pasörün arkasına bakmak", "Servisçiyi okumak, ara top sorumluluğunu paylaşmak, pasör hedefini kontrol etmek ve alçak hazır duruş almak", "Top karşı sahayı geçtikten sonra iletişim kurmak", "Ayakları sabitleyip dik beklemek"],
      a: 1,
      e: "Karşılama rutini görsel bilgi, takım iletişimi, saha paylaşımı ve ilk adım hazırlığını birleştirir. Temas sonrası oyuncu hücum veya koruma görevine geçer.",
    },
    {
      q: "Hata sonrası üç adımlı sıfırlama sırası hangisidir?",
      o: ["Analiz et → suçla → sonucu düşün", "Kabul et → bırak → yeni göreve yönel", "Unutmaya zorla → oyundan kop → bekle", "Hakeme itiraz et → takım arkadaşını eleştir → servis kullan"],
      a: 1,
      e: "Oyuncu rallinin bittiğini kabul eder, nefes ve kısa fiziksel işaretle bırakır, ardından yeni skor-rotasyon ve tek görevi seçer. Ayrıntılı teknik analiz ralli arasında değil daha uygun zamanda yapılır.",
    },
    {
      q: "Hata sonrası sıfırlama rutini neden 3–6 saniye kadar kısa olmalıdır?",
      o: ["Oyuncunun hatayı hiç öğrenmemesi için", "Yeni ralli başlamadan dikkati geçmiş öz eleştiriden mevcut görev ve rotasyona taşıyabilmek için", "Nefes almayı engellemek için", "Takım iletişimini tamamen kaldırmak için"],
      a: 1,
      e: "Duyguyu yok saymak amaçlanmaz; hata bir sonraki sayıya taşınmaz. Kısa rutin oyun akışına uyarken uzun analiz set arasına veya antrenman sonrasına bırakılır.",
    },
    {
      q: "Yedek oyuncunun zihinsel olarak oyunda kalmasını sağlayan en uygun davranış hangisidir?",
      o: ["Skoru ve rotasyonu takip etmeyi bırakmak", "Rakibin servis-hücum eğilimlerini, takım rotasyonunu ve olası görevini izleyip oyuna giriş için bir-iki hedef seçmek", "Yalnız telefonla ilgilenmek", "Oyuna çağrılana kadar fiziksel hazırlığı tamamen bırakmak"],
      a: 1,
      e: "Yedek oyuncu kendi pozisyonundaki görevleri ve rakip örüntülerini izler. Çağrıldığında skor, rotasyon ve ilk görevini kısa sürede söyleyebilmelidir.",
    },
    {
      q: "Kritik sayıda 'sakinlik' en doğru nasıl tanımlanır?",
      o: ["Hiç heyecan veya enerji hissetmemek", "Artan uyarılmaya rağmen dikkati sonuçtan takım planı, nefes ve tek görev ipucuna döndürmek", "Son anda bütün taktik planı değiştirmek", "Top gelmeden olumsuz sonucu düşünmek"],
      a: 1,
      e: "Kritik sayı rutini skor ve rotasyonu netleştirir, ana-yedek kararı belirler ve hareketi tereddütsüz uygulamaya bağlar. Amaç düşük enerji değil işlevsel odaktır.",
    },
    {
      q: "Takım arkadaşının karşılama hatasından sonra en yararlı destek cümlesi hangisidir?",
      o: ["Sen hep aynı hatayı yapıyorsun", "Bir daha hata yapma", "Bitti, sıradaki top; platformu hedefe çevir", "Bu top yüzünden set gitti"],
      a: 2,
      e: "Destek dili kısa, saygılı ve eyleme dönüktür. Kişilik yorumu, alay ve belirsiz suçlama iletişimi ve güveni zedeler.",
    },
    {
      q: "Maç sonrası öğrenme günlüğünde en uygun kayıt hangisidir?",
      o: ["Ben kötü bir oyuncuyum", "İki kanıtlı güçlü davranış, uygulanan süreç hedefi, dikkatin dağıldığı an ve sonraki antrenman için tek uygulanabilir adım", "Yalnız maç skorunu yazmak", "Bütün hatalar için takım arkadaşlarını suçlamak"],
      a: 1,
      e: "Günlük yargılama değil öğrenme aracıdır. Kısa ilk not daha sonra video ve antrenör geri bildirimiyle tamamlanır; uyku, enerji ve stres de bağlam olarak kaydedilir.",
    },
    {
      q: "Mental beceri eğitiminin sınırıyla ilgili doğru ifade hangisidir?",
      o: ["Nefes ve rutin bütün ruh sağlığı sorunlarının tedavisidir", "Belirtiler haftalarca sürüyor, yoğunlaşıyor veya okul, uyku, yemek, ilişkiler ve sporu etkiliyorsa lisanslı uzmandan destek istenmelidir", "Yardım istemek mental zayıflık göstergesidir", "Kendine zarar düşüncesinde bir sonraki antrenman beklenmelidir"],
      a: 1,
      e: "Mental performans becerileri klinik değerlendirme veya tedavinin yerine geçmez. IOC uzlaşısı yardım istemeyi destekler; kendine zarar düşüncesi veya acil güvenlik riskinde yerel acil yardım ve kriz desteği hemen kullanılmalıdır.",
    },
  ],
  "Plaj voleybolu temelleri": [
    {
      q: "Güncel FIVB kurallarına göre plaj voleybolu sahasının ölçüsü ve sahadaki takım yapısı hangisidir?",
      o: ["18 × 9 metre ve altı oyuncu", "16 × 8 metre ve iki oyuncu", "14 × 7 metre ve üç oyuncu", "20 × 10 metre ve dört oyuncu"],
      a: 1,
      e: "Plaj voleybolu 16 × 8 metrelik kum sahada iki kişilik takımlarla oynanır. Her iki oyuncu da oyunda kalır; maç içinde oyuncu değişikliği veya yedek oyuncu yoktur.",
    },
    {
      q: "Plaj voleybolunda blok teması sonrası takımın topu rakibe göndermek için kaç vuruş hakkı kalır?",
      o: ["Üç", "İki", "Bir", "Hiç"],
      a: 1,
      e: "FIVB 2025–2028 Plaj Voleybolu Kuralları'nda blok teması bir takım vuruşu sayılır. Bloktan sonra, blok yapan oyuncu dâhil herhangi bir oyuncu kalan iki temastan ilkini yapabilir.",
    },
    {
      q: "Plaj voleybolunda doğru set ve saha değişimi düzeni hangisidir?",
      o: ["Tüm setler 25 sayıdır; her 8 sayıda değişilir", "İlk iki set 21, karar seti 15 sayıdır; ilk iki sette toplam her 7, karar setinde her 5 sayıda saha değiştirilir", "İlk iki set 15, karar seti 21 sayıdır", "Saha yalnız set sonunda değiştirilir"],
      a: 1,
      e: "Maç iki set kazanan takımındır ve her set en az iki farkla biter. Rüzgâr ve güneş etkisini dengelemek için saha değişimleri toplam sayı üzerinden düzenli yapılır.",
    },
    {
      q: "Kumda etkili hazır pozisyonun özelliği hangisidir?",
      o: ["Çok geniş, sert ve ayakları kuma gömen duruş", "Ayaklar omuz genişliğine yakın, dizler yumuşak, gövde hafif önde ve ağırlık ön-orta ayakta", "Dizler kilitli ve ağırlık topuklarda", "Ayaklar çapraz, eller arkada"],
      a: 1,
      e: "Kumun gevşek yapısı çok geniş ve sert duruşta ilk adımı geciktirir. Dengeli, alçak ve hareketli pozisyon kısa hazırlık adımına izin verir.",
    },
    {
      q: "Kumda uzak bir topa giderken en ekonomik ayak çalışması hangisidir?",
      o: ["İlk adımdan itibaren mümkün olan en uzun adımlar", "Kısa ve güçlü hızlanma adımlarıyla başlayıp mesafeye göre adım boyunu kademeli büyütmek, temas öncesi yeniden kontrol etmek", "Ayakları kuma sürükleyerek ilerlemek", "Sert zemindeki koşuyu hiç değiştirmeden uygulamak"],
      a: 1,
      e: "Uzun ilk adım ayağın kuma gömülmesine ve yön değişiminin gecikmesine neden olabilir. Son bölümde adımlar yeniden ayarlanarak platform ve gövde kontrolü hazırlanır.",
    },
    {
      q: "İki kişilik takımda top karşıya geçmeden önce hangi sorumlulukların paylaşılması gerekir?",
      o: ["Yalnız sağ ve sol çizgi", "Kısa, derin, ara top, blok sonrası alan ve gerektiğinde ikinci top sorumluluğu", "Sadece servis atacak oyuncu", "Yalnız hücum yönü"],
      a: 1,
      e: "İki oyuncu bütün sahayı birlikte yönetir. 'Benim-senin', 'kısa-derin', 'hat-çapraz' ve yardım çağrıları erken yapılır; geç çağrı çarpışma veya boş top oluşturabilir.",
    },
    {
      q: "Arka rüzgârda servis veya pas planı için en güvenli uyarlama hangisidir?",
      o: ["Topu gereksiz yükseltip dış çizgiyi hedeflemek", "Atış ve yörüngeyi daha kontrollü tutup hedef payını sahanın içine almak", "Rüzgârı tamamen yok saymak", "Her topa maksimum güç uygulamak"],
      a: 1,
      e: "Arka rüzgâr topu uzatabilir. Oyuncu daha düşük ve kontrollü yörünge ile iç hedef kullanır; rüzgârın yönünü her rallide yeniden gözlemler.",
    },
    {
      q: "Plaj servis karşılamasında ideal hedef neden topu fileye yapıştırmak değildir?",
      o: ["Top fileye hiç yaklaşamayacağı için", "Partnerin dengeli ikinci temas yapabileceği oyun kurma alanına yönlendirmek ve hücumcuya yaklaşma mesafesi bırakmak için", "İkinci temas yasak olduğu için", "Servis karşılamada yalnız tek elle oynanabildiği için"],
      a: 1,
      e: "İki kişilik oyunda pasör de hareket etmek zorundadır. Başarılı ilk temas partnerin yaklaşık iki adım içinde ulaşabileceği, fileden güvenli mesafedeki alana gider.",
    },
    {
      q: "İkinci topta parmak pas yerine manşet pasın daha güvenli olabileceği durum hangisidir?",
      o: ["Oyuncu dengeli biçimde topun tam altındayken", "Top düşük, hızlı veya gövdeden uzaktayken ya da güçlü rüzgâr kontrolü zorlaştırırken", "Her durumda yalnız manşet zorunlu olduğu için", "Top sabit ve rüzgâr yokken"],
      a: 1,
      e: "Teknik seçimi topun yüksekliği, oyuncunun dengesi, rüzgâr ve beceri düzeyine göre yapılır. Amaç hücumcuya ritimli, öngörülebilir ve kural uygun bir ikinci top vermektir.",
    },
    {
      q: "Kumdaki yaklaşmalı hücum sıçraması neden sert zemindeki kadar uzun ve kontrolsüz hızlı olmamalıdır?",
      o: ["Kumda kol salınımı yasak olduğu için", "Kumun uyumlu ve kararsız yüzeyi itiş kuvveti ile kalkış hızını değiştirir; aşırı uzun son adım ayağı gömüp ritmi bozabilir", "Kumda sıçrama yapılamadığı için", "Plaj voleybolunda yalnız ayakta hücum edildiği için"],
      a: 1,
      e: "Biyomekanik araştırmalar kumda sıçrama yüksekliği, kuvvet ve eklem davranışlarının sert yüzeyden farklı olduğunu gösterir. Oyuncu kontrollü yaklaşır, iki ayağı dengeli yerleştirir ve dikey yükselişi önceler.",
    },
    {
      q: "Yaygın blok işaretleme sisteminde bir parmak ve iki parmak genellikle neyi belirtir?",
      o: ["Bir parmak kısa servis, iki parmak derin servis", "Bir parmak çizgi, iki parmak çapraz hücum hattının blokla kapatılacağını", "Bir parmak pas, iki parmak manşet", "Bir parmak sağ oyuncu, iki parmak sol oyuncu değişikliği"],
      a: 1,
      e: "İşaretlerin kesin anlamı takım içinde önceden ortaklaştırılmalıdır. Yaygın sistemde el, karşısındaki hücumcuyu; parmak sayısı ise kapatılacak hattı belirtir.",
    },
    {
      q: "Blokçu çizgi hücumunu kapatıyorsa arka alan savunmacısının temel başlangıç sorumluluğu nedir?",
      o: ["Aynı çizgi hattını blokçuyla birlikte savunmak", "Blok dışında kalan çapraz sert vuruşu ve plase seçeneklerini dengeleyecek alana yerleşmek", "File altında blokçının arkasında beklemek", "Sahayı terk etmek"],
      a: 1,
      e: "Blok ve savunma tek sistemdir. İki oyuncunun aynı hattı kapatması geniş bir boşluk bırakır; savunmacı blokla kapatılmayan alanı tamamlar.",
    },
    {
      q: "Rakibin pası fileden çok uzak ve hücum seçeneği sınırlıysa blokçu için uygun karar hangisidir?",
      o: ["Her durumda filede kalıp maksimum sıçramak", "Erken 'çekil' çağrısıyla bloktan ayrılıp arka alan savunmasına katılmak", "Partnerine haber vermeden saha dışına çıkmak", "Servis sırasını değiştirmek"],
      a: 1,
      e: "Kötü pas, blok yerine iki oyunculu saha savunmasını daha değerli kılabilir. Çağrı erken verilirse partner başlangıç yerini buna göre ayarlar.",
    },
    {
      q: "Savunmadan hücuma geçişte doğru rol değişimi hangisidir?",
      o: ["İlk teması yapan oyuncunun topu izleyip yerde kalması", "İlk teması yapanın hücum hattına açılması, partnerin ikinci topu üstlenmesi ve pas konumu ile açık alan bilgisinin erken söylenmesi", "Her iki oyuncunun aynı anda ikinci topa koşması", "İletişimin yalnız hücumdan sonra yapılması"],
      a: 1,
      e: "'Benim', 'bende', 'içeride-dışarıda-yakın' ve 'hat-çapraz' çağrıları rol değişimini hızlandırır. Üç temaslı düzen, savunma topunu kontrollü hücuma dönüştürür.",
    },
    {
      q: "Plaj voleybolunda çevre ve güvenlik kontrolü için doğru uygulama hangisidir?",
      o: ["Kumu, sıcaklığı ve rüzgârı yalnız maç bittikten sonra değerlendirmek", "Kumda taş veya tehlikeli parçaları, yüzey sıcaklığını, güneş-rüzgâr koşullarını ve sıvı ihtiyacını antrenman öncesi ve sırasında izlemek", "Aşırı sıcakta mola vermeden devam etmek", "Ağrıyı normal kum yorgunluğu kabul etmek"],
      a: 1,
      e: "FIVB güvenli ve yabancı maddelerden arındırılmış kum yüzeyi ister. Hava, yüzey ve sporcunun belirtileri değiştikçe mola, sıvı ve yük planı güncellenir; ağrı veya olağan dışı belirti zorlanmaz.",
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
const EXAM_PASS_SCORE = 70;
const EXAM_ATTEMPTS_KEY = "volleyballExamAttempts";
const readExamAttempts = () => {
  try { return JSON.parse(localStorage.getItem(EXAM_ATTEMPTS_KEY) || "[]"); }
  catch { return []; }
};
const examAttemptFromRow = (row) => ({
  attemptId: registrationValue(row, "Giriş ID"),
  schoolId: registrationValue(row, "Okul ID"),
  schoolName: registrationValue(row, "Okul Adı"),
  userId: registrationValue(row, "Kullanıcı ID"),
  userName: registrationValue(row, "Kullanıcı Adı"),
  userType: registrationValue(row, "Rol"),
  examId: registrationValue(row, "Sınav ID"),
  examTitle: registrationValue(row, "Sınav Başlığı"),
  examOrder: Number(registrationValue(row, "Sınav Sırası")) || 0,
  attemptNumber: Number(registrationValue(row, "Deneme")) || 1,
  questionCount: Number(registrationValue(row, "Soru Sayısı")) || 0,
  correctCount: Number(registrationValue(row, "Doğru")) || 0,
  wrongCount: Number(registrationValue(row, "Yanlış")) || 0,
  score: Number(registrationValue(row, "Puan")) || 0,
  passingScore: Number(registrationValue(row, "Geçme Puanı")) || EXAM_PASS_SCORE,
  passed: registrationValue(row, "Durum").toLocaleLowerCase("tr") === "geçti",
  completedAt: registrationValue(row, "Tamamlanma Tarihi"),
});
const examIdFor = (title) => `SNV-${String(courseCategories.indexOf(title) + 1).padStart(2, "0")}`;

function ExamPage({ initialCourse, account }) {
  const accountType = account?.accountType || "";
  const isClub = accountType === "club";
  const canTakeExam = accountType === "athlete" || accountType === "trainer";
  const matchingSchool = readSchools().find((school) => school.id === account?.schoolId || String(school.schoolName || "").toLocaleLowerCase("tr") === String(account?.schoolName || "").toLocaleLowerCase("tr"));
  const schoolId = accountType === "club" ? account?.id : account?.schoolId || matchingSchool?.id || `OKUL-${account?.schoolCode || "BELIRSIZ"}`;
  const schoolName = account?.schoolName || matchingSchool?.schoolName || "Okul bilgisi yok";
  const userId = canTakeExam ? account?.id : "";
  const userName = canTakeExam ? account?.name : "";
  const [attempts, setAttempts] = useState(readExamAttempts);
  const [saveNotice, setSaveNotice] = useState("");
  useEffect(() => {
    if (!registrationApi || !schoolId) return;
    let disposed = false;
    fetchRegistrationSheet("Sinav Sonuclari").then((rows) => {
      if (disposed) return;
      const remote = rows.map(examAttemptFromRow).filter((item) => item.attemptId && item.schoolId === schoolId);
      const merged = new Map([...readExamAttempts(), ...remote].map((item) => [item.attemptId, item]));
      const next = [...merged.values()];
      localStorage.setItem(EXAM_ATTEMPTS_KEY, JSON.stringify(next));
      setAttempts(next);
    }).catch((error) => setSaveNotice(`Merkezi sınav geçmişi alınamadı: ${error.message}`));
    return () => { disposed = true; };
  }, [schoolId]);
  const userAttempts = attempts.filter((item) => canTakeExam ? item.userId === userId : item.schoolId === schoolId);
  const uniqueExamAttempts = Array.from(userAttempts.reduce((bestByExam, item) => {
    const key = `${item.userId}::${item.examId}`;
    const current = bestByExam.get(key);
    const currentTime = new Date(current?.completedAt || 0).getTime();
    const itemTime = new Date(item.completedAt || 0).getTime();
    if (!current || Number(item.score || 0) > Number(current.score || 0) || (Number(item.score || 0) === Number(current.score || 0) && itemTime > currentTime)) bestByExam.set(key, item);
    return bestByExam;
  }, new Map()).values()).sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  const historyGroups = Array.from(uniqueExamAttempts.reduce((groups, item) => {
    if (!groups.has(item.userId)) groups.set(item.userId, { userId: item.userId, userName: item.userName, userType: item.userType, exams: [] });
    groups.get(item.userId).exams.push(item);
    return groups;
  }, new Map()).values());
  const participantProfileFor = (group) => {
    const participant = group.userType === "Antrenör"
      ? readTrainers().find((item) => item.id === group.userId)
      : readAthletes().find((item) => item.id === group.userId);
    const participantSchool = readSchools().find((school) => school.id === participant?.schoolId
      || String(school.schoolName || "").toLocaleLowerCase("tr") === String(participant?.schoolName || schoolName).toLocaleLowerCase("tr"));
    return {
      avatar: participant?.avatar || (group.userId === account?.id ? account?.avatar : ""),
      teamLogo: participant?.teamLogo || participantSchool?.teamLogo || matchingSchool?.teamLogo || "",
      schoolName: participant?.schoolName || participantSchool?.schoolName || schoolName,
    };
  };
  const passedIds = new Set(userAttempts.filter((item) => item.passed).map((item) => item.examId));
  const firstPending = courseCategories.findIndex((item) => !passedIds.has(examIdFor(item)));
  const unlockedIndex = firstPending < 0 ? courseCategories.length - 1 : firstPending;
  const requestedTitle = initialCourse?.[1] || courseCategories[0];
  const requestedIndex = courseCategories.indexOf(requestedTitle);
  const [title, setTitle] = useState(() => isClub && requestedIndex >= 0 ? requestedTitle : canTakeExam && requestedIndex >= 0 && requestedIndex <= unlockedIndex ? requestedTitle : courseCategories[unlockedIndex]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const qs = questionsFor(title);
  const examId = examIdFor(title);
  const examOrder = courseCategories.indexOf(title);
  const choose = (answerIndex) => setAnswers({ ...answers, [index]: answerIndex });
  const reset = (nextTitle) => {
    if (nextTitle) setTitle(nextTitle);
    setIndex(0);
    setAnswers({});
    setDone(false);
  };
  const score = qs.reduce((sum, question, questionIndex) => sum + (answers[questionIndex] === question.a ? 1 : 0), 0);
  const scorePercent = Math.round((score / Math.max(qs.length, 1)) * 100);
  const passed = scorePercent >= EXAM_PASS_SCORE;
  const passedCount = passedIds.size;
  const totalPoints = uniqueExamAttempts.reduce((sum, item) => sum + Number(item.score || 0), 0);
  const bestScore = uniqueExamAttempts.length ? Math.max(...uniqueExamAttempts.map((item) => Number(item.score || 0))) : 0;
  const nextExamTitle = examOrder < courseCategories.length - 1 ? courseCategories[examOrder + 1] : "";
  const finishExam = () => {
    const attempt = {
      attemptId: `GIRIS-${Date.now()}`,
      schoolId,
      schoolName,
      userId,
      userName,
      userType: accountType === "trainer" ? "Antrenör" : "Sporcu",
      examId,
      examTitle: title,
      examOrder: examOrder + 1,
      attemptNumber: userAttempts.filter((item) => item.examId === examId).length + 1,
      questionCount: qs.length,
      correctCount: score,
      wrongCount: qs.length - score,
      score: scorePercent,
      passingScore: EXAM_PASS_SCORE,
      passed,
      completedAt: new Date().toISOString(),
    };
    const nextAttempts = [...attempts, attempt];
    localStorage.setItem(EXAM_ATTEMPTS_KEY, JSON.stringify(nextAttempts));
    setAttempts(nextAttempts);
    setDone(true);
    const token = sessionStorage.getItem(PROFILE_TOKEN_KEY);
    if (!token) {
      setSaveNotice("Sonuç bu cihazda saklandı. Merkezi kayıt için profil oturumunuzu yenileyin.");
      return;
    }
    setSaveNotice("Sınav sonucu kaydediliyor…");
    sendRegistration({ action:"saveExamAttempt", token, attempt })
      .then(() => setSaveNotice("Sınav sonucu okulunuza bağlı merkezi geçmişe kaydedildi."))
      .catch((error) => setSaveNotice(`Sonuç cihazda saklandı; merkezi kayıt başarısız: ${error.message}`));
  };
  const selectExam = (nextTitle) => {
    const nextIndex = courseCategories.indexOf(nextTitle);
    const unlocked = nextIndex === 0 || passedIds.has(examIdFor(courseCategories[nextIndex - 1]));
    if (isClub || (canTakeExam && unlocked)) reset(nextTitle);
  };
  const goToNextExam = () => {
    if (!passed || !nextExamTitle) return;
    reset(nextExamTitle);
    window.scrollTo({ top: document.querySelector(".exam-workspace")?.offsetTop || 0, behavior: "smooth" });
  };
  return (
    <div className="exam-page page">
      <section className="exam-hero">
        <div><span className="eyebrow"><ClipboardCheck/> ÖLÇME VE DEĞERLENDİRME</span><h1>{isClub ? "Kulübünün sınavlarını tek yerden kontrol et." : "Sahadaki gelişimini sınavlarla kanıtla."}</h1><p>{isClub ? "Tüm sınavları kilitsiz görüntüle; soru, doğru yanıt ve açıklamaları incele. Katılımcı sonuçlarını okul kimliğiyle takip et." : `Sınavları sırayla tamamla, en az %${EXAM_PASS_SCORE} puan al ve bir sonraki konunun kilidini aç.`}</p></div>
        <div className="exam-account-card"><span>{accountType === "trainer" ? <GraduationCap/> : accountType === "club" ? <School/> : <UserRound/>}</span><div><small>{accountType === "trainer" ? "ANTRENÖR" : accountType === "club" ? "KULÜP YÖNETİMİ" : "SPORCU"}</small><b>{userName || schoolName}</b><em>Okul ID: {schoolId}</em></div></div>
      </section>
      <section className="exam-stats">
        <article><Award/><span><b>{passedCount}</b><small>Geçilen Sınav</small></span></article>
        <article><Target/><span><b>{bestScore}</b><small>En Yüksek Puan</small></span></article>
        <article><Trophy/><span><b>{totalPoints}</b><small>Toplam Puan</small></span></article>
        <article>{isClub ? <ClipboardCheck/> : <LockKeyhole/>}<span><b>{isClub ? courseCategories.length : Math.max(0, courseCategories.length - passedCount - 1)}</b><small>{isClub ? "Kontrole Açık Sınav" : "Kilitli Sınav"}</small></span></article>
      </section>
      {isClub ? (
        <>
          <section className="exam-club-view"><School/><div><span className="eyebrow">KULÜP SINAV KONTROLÜ</span><h2>Tüm sınavlar incelemeye açık</h2><p>Kulüp hesabında sıra kilidi uygulanmaz. Sol listeden bir sınav seçerek soruları ve cevap açıklamalarını kontrol edebilirsin; sporcu ve antrenör sonuçları aşağıdaki geçmişte ayrıca listelenir.</p></div></section>
          <div className="exam-club-control">
            <aside className="exam-roadmap club-control-nav"><div><small>SINAV KÜTÜPHANESİ</small><b>{courseCategories.length} sınav • kilit yok</b><span><i style={{width:"100%"}}/></span></div><nav>{courseCategories.map((item,itemIndex)=>{const itemQuestions=questionsFor(item);return <button key={item} className={title===item?"active":""} onClick={()=>selectExam(item)}><i>{String(itemIndex+1).padStart(2,"0")}</i><span><b>{item}</b><small>{itemQuestions.length} soru • Kontrole açık</small></span></button>})}</nav></aside>
            <section className="exam-club-preview"><header><span><small>{examId} • SINAV ÖNİZLEME</small><h2>{title}</h2><p>{qs.length} sorunun doğru yanıtları ve öğretici açıklamaları</p></span><em><CheckCircle2/> Kilitsiz</em></header><div className="exam-club-question-list">{qs.map((question,questionIndex)=><article key={question.q}><i>{questionIndex+1}</i><div><b>{question.q}</b><span><strong>Doğru yanıt:</strong> {question.o[question.a]}</span><p>{question.e}</p></div></article>)}</div></section>
          </div>
        </>
      ) : (
        <div className="exam-workspace">
          <aside className="exam-roadmap"><div><small>SINAV YOLCULUĞU</small><b>{passedCount} / {courseCategories.length} tamamlandı</b><span><i style={{width:`${(passedCount/courseCategories.length)*100}%`}}/></span></div><nav>{courseCategories.map((item, itemIndex)=>{const itemId=examIdFor(item); const itemPassed=passedIds.has(itemId); const itemUnlocked=itemIndex===0||passedIds.has(examIdFor(courseCategories[itemIndex-1])); return <button key={item} className={`${title===item?"active":""} ${itemPassed?"passed":""}`} disabled={!itemUnlocked} onClick={()=>selectExam(item)}><i>{itemPassed?<CheckCircle2/>:itemUnlocked?String(itemIndex+1).padStart(2,"0"):<LockKeyhole/>}</i><span><b>{item}</b><small>{itemPassed?"Geçildi":itemUnlocked?"Girişe açık":"Önceki sınavı geç"}</small></span></button>})}</nav></aside>
          <div className="exam-stage">
            {!done ? (
              <div className="exam-card">
                <div className="exam-card-head"><span><small>{examId} • {examOrder + 1}. SINAV</small><h2>{title}</h2></span><em>Geçme puanı: {EXAM_PASS_SCORE}</em></div>
                <div className="exam-progress"><span>SORU {index + 1} / {qs.length}</span><div><i style={{ width: `${((index + 1) / qs.length) * 100}%` }} /></div></div>
                <h3>{qs[index].q}</h3>
                <div className="exam-options">{qs[index].o.map((option, optionIndex) => <button className={answers[index] === optionIndex ? "selected" : ""} onClick={() => choose(optionIndex)} key={option}><i>{String.fromCharCode(65 + optionIndex)}</i>{option}</button>)}</div>
                <div className="exam-actions"><button className="btn ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>Önceki</button>{index < qs.length - 1 ? <button className="btn" disabled={answers[index] === undefined} onClick={() => setIndex(index + 1)}>Sonraki <ArrowRight /></button> : <button className="btn" disabled={answers[index] === undefined} onClick={finishExam}>Sınavı Bitir</button>}</div>
              </div>
            ) : (
              <div className={`exam-result ${passed ? "passed" : "failed"}`}>
                {passed ? <Trophy /> : <RotateCcw />}<span>{passed ? "SINAVI GEÇTİN" : "TEKRAR ÇALIŞMALISIN"}</span><h2>{scorePercent} puan</h2><p>{score} doğru, {qs.length - score} yanlış. {passed ? nextExamTitle ? `Sıradaki sınav: ${nextExamTitle}.` : "Tüm sınavları tamamladın." : `İlerlemek için en az ${EXAM_PASS_SCORE} puan almalısın.`}</p>{saveNotice&&<p className="exam-save-notice" role="status">{saveNotice}</p>}<div className="exam-result-actions">{passed && nextExamTitle && <button className="btn" onClick={goToNextExam}>Sonraki Sınava Geç <ArrowRight/></button>}<button className="btn ghost" onClick={() => reset()}>Tekrar Dene</button></div>
                <div>{qs.map((question, questionIndex) => <article className={answers[questionIndex] === question.a ? "correct" : "wrong"} key={question.q}><b>{questionIndex + 1}. {question.q}</b><p>{question.e}</p></article>)}</div>
              </div>
            )}
          </div>
        </div>
      )}
      <section className="exam-history"><div className="exam-section-head"><span><small>SINAV GEÇMİŞİ</small><h2>{accountType === "club" ? "Okula bağlı katılımcılar ve sınavları" : "Girdiğin sınavlar"}</h2></span><em>{schoolId}</em></div>{historyGroups.length ? <div className="exam-participant-list">{historyGroups.map((group)=>{const profile=participantProfileFor(group);return <article className="exam-participant" key={group.userId}><header><span className="exam-participant-avatar">{profile.avatar ? <ProfileAvatar id={profile.avatar}/> : <UserRound/>}{profile.teamLogo&&<TeamLogo src={profile.teamLogo} name={profile.schoolName} className="exam-participant-team-logo"/>}</span><span className="exam-participant-identity"><small>{group.userType} PROFİLİ</small><b>{group.userName}</b><em>{profile.schoolName}</em></span><span className="exam-participant-summary"><strong>{group.exams.length}</strong><small>Tamamlanan sınav</small></span></header><div className="exam-taken-list"><div className="exam-taken-row header"><span>Girdiği Sınav</span><span>Puan</span><span>Durum</span></div>{group.exams.map((item,index)=><div className="exam-taken-row" key={`${group.userId}-${item.examId}`}><i className="exam-taken-index">{String(index+1).padStart(2,"0")}</i><span><b>{item.examTitle}</b><small>{new Date(item.completedAt).toLocaleDateString("tr-TR")} • En iyi sonuç</small></span><strong>{item.score}<small>/100</small></strong><em className={item.passed?"passed":"failed"}>{item.passed?<><CheckCircle2/> Geçti</>:<>Kaldı</>}</em></div>)}</div></article>})}</div> : <div className="exam-empty"><ClipboardCheck/><h3>Henüz sınav kaydı yok</h3><p>İlk sınav tamamlandığında okul kimliği, kullanıcı ve puan bilgisi burada görünecek.</p></div>}</section>
      <section className="exam-reminder"><span><Award/></span><div><small>İÇERİK HATIRLATMASI</small><h2>Her ders konusu için özgün sınav hazırlanmalı.</h2><p>Toplam {courseCategories.length} konu bulunuyor. Sorular; ders anlatımı, teknik doğrular ve yaygın hatalarla bire bir eşleştirilerek sırayla hazırlanacak.</p></div><b>{courseCategories.length} KONU</b></section>
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
  image: `/lesson-images/parmak-pas-${String(i + 1).padStart(2, "0")}.webp`,
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
      image: `/lesson-images/sheet-parmak-pas-${String(index + 1).padStart(2, "0")}.webp`,
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
            ? `/lesson-images/sheet-parmak-pas-${String(index + 1).padStart(2, "0")}.webp`
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
const createSixDigitCode = () => {
  if (window.crypto?.getRandomValues) {
    const number = new Uint32Array(1);
    window.crypto.getRandomValues(number);
    return String(100000 + (number[0] % 900000));
  }
  return String(Math.floor(100000 + Math.random() * 900000));
};
function ClubTeamManager({ school, members, trainers, onTrainersChange }) {
  const [teams, setTeams] = useState(() => teamsForSchool(readTeams(), school));
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState(() => createSixDigitCode());
  const [view, setView] = useState("cards");
  const [openRosterId, setOpenRosterId] = useState("");
  const [trainerAssignments, setTrainerAssignments] = useState({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const token = sessionStorage.getItem(PROFILE_TOKEN_KEY);
  const storeTeams = (next) => {
    const otherSchools = readTeams().filter((team)=>String(team.schoolId)!==String(school.id));
    localStorage.setItem("volleyballClubTeams", JSON.stringify([...otherSchools, ...next]));
    setTeams(next);
  };
  useEffect(() => {
    if (!token) return;
    let disposed = false;
    sendRegistration({action:"listClubTeams",token}).then((result)=>{
      if (!disposed) storeTeams(Array.isArray(result.teams)?result.teams:[]);
    }).catch((error)=>{ if (!disposed) setNotice(error.message); });
    return () => { disposed = true; };
  }, [school.id, token]);
  useEffect(() => {
    setTrainerAssignments(Object.fromEntries(trainers.map((trainer)=>[trainer.id,trainerTeamMemberships(trainer).map((team)=>team.id)])));
  }, [trainers]);
  const createTeam = async (event) => {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const result = await sendRegistration({action:"manageClubTeam",operation:"create",token,teamName,teamCode});
      storeTeams(result.teams||[]); setTeamName(""); setTeamCode(createSixDigitCode());
      setNotice("Takım oluşturuldu. Sporcu ve antrenör kayıtlarında bu takım kodu kullanılabilir.");
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  };
  const changeTeam = (id, field, value) => setTeams((items)=>items.map((team)=>team.id===id?{...team,[field]:value}:team));
  const updateTeam = async (team) => {
    setBusy(true); setNotice("");
    try {
      const result = await sendRegistration({action:"manageClubTeam",operation:"update",token,teamId:team.id,teamName:team.name,teamCode:team.code,order:team.order});
      storeTeams(result.teams||[]); setNotice(`${team.name} güncellendi.`);
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  };
  const shareTeam = (team) => {
    const text = `${school.schoolName} - ${team.name} sporcu kayıt daveti\n\nKulüp: ${school.schoolName}\nTakım: ${team.name}\n6 haneli sporcu takım kodu: ${team.code}\n\nÖnce kayıt sayfasından sporcu profilinizi oluşturun, ardından aynı takım ve kodla giriş yapın.\n\nKayıt: ${SITE_URL}${routeFor("register")}\nGiriş: ${SITE_URL}${routeFor("profiles")}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");
  };
  const toggleTrainerAssignment = (trainerId, teamId, checked) => {
    setTrainerAssignments((current)=>{
      const assigned=current[trainerId]||[];
      return {...current,[trainerId]:checked?[...new Set([...assigned,teamId])]:assigned.filter((id)=>id!==teamId)};
    });
  };
  const saveTrainerAssignment = async (trainer) => {
    setBusy(true); setNotice("");
    try {
      const result=await sendRegistration({action:"assignTrainerTeams",token,trainerId:trainer.id,teamIds:trainerAssignments[trainer.id]||[]});
      const memberships=Array.isArray(result.teams)?result.teams:[];
      onTrainersChange?.(trainer.id,memberships);
      setNotice(`${trainer.name} için takım ataması güncellendi.`);
    } catch(error) { setNotice(error.message); } finally { setBusy(false); }
  };
  return <section className="club-team-manager">
    <header className="club-team-heading"><span><small>TAKIM YÖNETİMİ</small><h2>Kulübünün takımlarını oluştur</h2><p>Kulüp kodu yalnızca kulüp girişinde, takım kodları yalnızca sporcu kayıt ve girişinde kullanılır.</p></span><div className="team-view-toggle" aria-label="Takım görünümü"><button type="button" className={view==="cards"?"active":""} onClick={()=>setView("cards")}>Kartlar</button><button type="button" className={view==="list"?"active":""} onClick={()=>setView("list")}>Liste</button></div></header>
    <form className="team-create-form" onSubmit={createTeam}><label>Yeni takım adı<input value={teamName} onChange={(event)=>setTeamName(event.target.value)} required minLength="2" maxLength="70" placeholder="Örn. U14 Kız Takımı"/></label><label>Otomatik takım kodu<input value={teamCode} onChange={(event)=>setTeamCode(event.target.value.replace(/\D/g,"").slice(0,6))} required inputMode="numeric" pattern="[0-9]{6}" maxLength="6"/></label><button type="button" className="team-code-refresh" onClick={()=>setTeamCode(createSixDigitCode())}><KeyRound/> Yeni kod</button><button className="btn" disabled={busy}>{busy?"Kaydediliyor…":"Takımı oluştur"}</button></form>
    {notice&&<p className="team-manager-notice" role="status"><ShieldCheck/>{notice}</p>}
    {teams.length?<div className={`club-team-collection ${view}`}>{teams.map((team)=>{
      const teamAthletes=members.filter((person)=>String(person.teamId||"")===String(team.id));
      const athleteCount=teamAthletes.length;
      const trainerCount=trainers.filter((person)=>trainerTeamMemberships(person).some((membership)=>membership.id===team.id)).length;
      const rosterOpen=openRosterId===team.id;
      return <article className={`club-team-item${rosterOpen?" roster-open":""}`} key={team.id}><div className="team-item-number">{String(team.order||1).padStart(2,"0")}</div><div className="team-item-fields"><label>Takım adı<input value={team.name} onChange={(event)=>changeTeam(team.id,"name",event.target.value)}/></label><label>Takım kodu<input value={team.code||""} onChange={(event)=>changeTeam(team.id,"code",event.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" maxLength="6"/></label></div><div className="team-item-stats"><span><Users/><b>{athleteCount}</b><small>Sporcu</small></span><span><GraduationCap/><b>{trainerCount}</b><small>Antrenör</small></span></div><div className="team-item-actions"><button type="button" className="btn ghost" onClick={()=>shareTeam(team)}><MessageCircle/> Kodu paylaş</button><button type="button" className="btn" disabled={busy||!/^\d{6}$/.test(team.code||"")} onClick={()=>updateTeam(team)}><Save/> Güncelle</button><button type="button" className="btn ghost roster-toggle" aria-expanded={rosterOpen} onClick={()=>setOpenRosterId(rosterOpen?"":team.id)}><Users/> Kayıtlı sporcular <ChevronDown/></button></div>{rosterOpen&&<div className="team-athlete-roster"><header><span><small>TAKIM KADROSU</small><b>{team.name}</b></span><em>{athleteCount} sporcu</em></header>{teamAthletes.length?<div className="team-athlete-roster-list">{teamAthletes.map((athlete)=><div key={athlete.id}><AthleteAvatar id={athlete.avatar}/><span><b>{athlete.name}</b><small>{athlete.id}</small></span></div>)}</div>:<p className="team-roster-empty">Bu takıma kayıtlı sporcu bulunmuyor.</p>}</div>}</article>;
    })}</div>:<div className="member-empty team-empty"><Users/><h3>Henüz takım oluşturulmadı</h3><p>İlk takımın adını yazın; sistem ayrı ve güvenli 6 haneli takım kodunu hazırlasın.</p></div>}
    <section className="trainer-assignment-panel"><header><span><small>ANTRENÖR ATAMALARI</small><h3>Antrenörleri takımlara ata</h3><p>Antrenör kayıt sırasında takım seçmez. Bir veya daha fazla takım seçimini kulüp yöneticisi yapar.</p></span><GraduationCap/></header>{trainers.length?<div className="trainer-assignment-list">{trainers.map((trainer)=>{const assigned=trainerAssignments[trainer.id]||[];return <article key={trainer.id}><div className="trainer-assignment-person"><TrainerAvatar id={trainer.avatar}/><span><b>{trainer.name}</b><small>{trainer.title||"Voleybol Antrenörü"} · {assigned.length} takım</small></span></div><fieldset><legend>Görev yapacağı takımlar</legend><div>{teams.map((team)=><label key={team.id} className={assigned.includes(team.id)?"selected":""}><input type="checkbox" checked={assigned.includes(team.id)} onChange={(event)=>toggleTrainerAssignment(trainer.id,team.id,event.target.checked)}/><span>{team.name}</span><CheckCircle2/></label>)}</div></fieldset><button type="button" className="btn" disabled={busy||!teams.length} onClick={()=>saveTrainerAssignment(trainer)}><Save/> Atamayı kaydet</button></article>})}</div>:<div className="member-empty trainer-assignment-empty"><GraduationCap/><h3>Kayıtlı antrenör bulunmuyor</h3><p>Antrenör koduyla kayıt olan kişiler burada takım ataması için listelenir.</p></div>}</section>
  </section>;
}

function ClubTrainerInvite({ school }) {
  const [copied, setCopied] = useState(false);
  const trainerCode = String(school?.trainerCode || "").replace(/\D/g, "");
  const message = `${school.schoolName} antrenör kayıt daveti\n\nKulüp: ${school.schoolName}\n6 haneli antrenör kodu: ${trainerCode}\n\nKayıt sayfasında Antrenör kaydı bölümünü açın, kulübümüzü seçin ve bu antrenör kodunu girerek profilinizi oluşturun. Kayıt sırasında takım seçmeniz gerekmez. Takım görevlendirmeniz kayıt tamamlandıktan sonra kulüp yöneticisi tarafından yapılacaktır. Sporcu takım kodlarını kullanmayın.\n\nKayıt: ${SITE_URL}${routeFor("register")}\nGiriş: ${SITE_URL}${routeFor("profiles")}`;
  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  if (!/^\d{6}$/.test(trainerCode)) return <section className="club-code-share trainer-code-share"><div className="club-code-share-heading"><span className="club-code-share-icon"><GraduationCap/></span><span><small>ANTRENÖR DAVETİ</small><h2>Ayrı antrenör kodu</h2><p>Kodu oluşturmak için kulüp hesabından çıkış yapıp yeniden giriş yapın.</p></span></div></section>;
  return <section className="club-code-share trainer-code-share"><div className="club-code-share-heading"><span className="club-code-share-icon"><GraduationCap/></span><span><small>ANTRENÖR DAVETİ</small><h2>Antrenör kayıt kodunu paylaş</h2><p>Bu kod kulüp giriş kodundan ve sporcu takım kodlarından tamamen ayrıdır.</p></span></div><div className="club-code-ticket trainer-code-ticket"><div><small>KULÜP</small><b>{school.schoolName}</b></div><div><small>6 HANELİ ANTRENÖR KODU</small><strong>{trainerCode}</strong></div></div><div className="club-code-share-actions"><button className="btn club-whatsapp-button" type="button" onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer")}><MessageCircle/> WhatsApp ile paylaş</button><button className="btn ghost" type="button" onClick={copyMessage}><Copy/> {copied?"Mesaj kopyalandı":"Mesajı kopyala"}</button></div><p className="club-code-share-note"><ShieldCheck/> Antrenör kayıt sırasında takım seçmez; takım atamasını kulüp yöneticisi profil alanından yapar.</p></section>;
}

function ProfilesPage({ go, initialNotice="", onActivityChange, onSessionChange }) {
  const [type, setType] = useState("club");
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  // Önce son doğrulanmış okul listesini göster, güncel veriyi arka planda sessizce yenile.
  const [schools, setSchools] = useState(() => readSchools());
  const [schoolsReady, setSchoolsReady] = useState(() => !registrationApi || readSchools().length > 0);
  const [teams, setTeams] = useState(() => readTeams());
  const [session, setSession] = useState(() => {
    if (import.meta.env.PROD && !sessionStorage.getItem(PROFILE_TOKEN_KEY)) return null;
    const currentId = localStorage.getItem("volleyballCurrentAthleteId");
    const athlete = readAthletes().find((item) => item.id === currentId);
    if (athlete) return { type:"athlete", athlete };
    const trainerId = localStorage.getItem("volleyballCurrentTrainerId");
    const trainer = readTrainers().find((item) => item.id === trainerId);
    if (trainer) return { type:"trainer", trainer };
    try {
      const school = JSON.parse(localStorage.getItem("volleyballCurrentClub") || "null");
      return school ? { type:"club", school } : null;
    } catch { return null; }
  });
  const [notice, setNotice] = useState(initialNotice);
  const [busy, setBusy] = useState(false);
  const [trainers, setTrainers] = useState(() => readTrainers());
  useEffect(() => {
    if (!registrationApi) return;
    let disposed = false;
    let active = false;
    let lastRelatedRefresh = 0;
    const refreshSchools = async (forceRelated = false) => {
      if (active || disposed) return;
      active = true;
      try {
        const schoolRows = await fetchRegistrationSheet("Okul Kayitlari");
        if (disposed) return;
        const syncedSchools = syncSchoolStorage(schoolRows);
        setSchools(syncedSchools);
        setSchoolsReady(true);
        setSelectedClub((current) => current && !syncedSchools.some((school) => String(school.schoolName || "").trim().toLocaleLowerCase("tr") === current.trim().toLocaleLowerCase("tr")) ? "" : current);
        if (forceRelated || Date.now() - lastRelatedRefresh >= RELATED_REGISTRATION_REFRESH_INTERVAL) {
          lastRelatedRefresh = Date.now();
          Promise.allSettled([fetchRegistrationSheet("Sporcu Kayitlari"), fetchRegistrationSheet("Takimlar"), fetchRegistrationSheet("Antrenor Kayitlari")]).then(([athleteResult, teamResult, trainerResult]) => {
            if (disposed) return;
            if (athleteResult.status === "fulfilled") syncRegistrationStorage(schoolRows, athleteResult.value);
            if (teamResult.status === "fulfilled") setTeams(syncTeamStorage(teamResult.value));
            if (trainerResult.status === "fulfilled") setTrainers(syncTrainerStorage(trainerResult.value));
          });
        }
      } catch (error) { console.warn("Okul listesi yenilenemedi:", error); }
      finally { active = false; }
    };
    refreshSchools(true);
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refreshSchools(true); };
    const refreshOnFocus = () => refreshSchools(true);
    const timer = window.setInterval(() => refreshSchools(false), SCHOOL_LIST_REFRESH_INTERVAL);
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);
  useEffect(() => {
    if (!schoolsReady || session?.type !== "club") return;
    const activeSchool = schools.some((school) => String(school.id) === String(session.school?.id));
    if (activeSchool) return;
    closeProfileServerSession();
    localStorage.removeItem("volleyballCurrentClub");
    clearSessionActivity();
    setSession(null);
    onSessionChange(null);
    setNotice("Bu kulüp kaydı artık aktif değil. Güncel okul listesinden seçim yapın.");
  }, [schoolsReady, schools, session?.type, session?.school?.id]);
  const approvedLoginSchools = useMemo(() => schools
    .filter((school) => String(school.status || "").trim().toLocaleUpperCase("tr") === "ONAYLANDI")
    .sort((a,b) => String(a.schoolName).localeCompare(String(b.schoolName),"tr")), [schools]);
  const clubOptions = useMemo(() => [...new Set(approvedLoginSchools.map((school) => school.schoolName).filter(Boolean))], [approvedLoginSchools]);
  const schoolLogoMap = useMemo(() => {
    const logos = new Map();
    approvedLoginSchools.forEach((school) => {
      if (school.teamLogo) logos.set(String(school.schoolName || "").trim().toLocaleLowerCase("tr"), school.teamLogo);
    });
    readAthletes().forEach((athlete) => {
      const key = String(athlete.schoolName || "").trim().toLocaleLowerCase("tr");
      if (key && athlete.teamLogo && !logos.has(key)) logos.set(key, athlete.teamLogo);
    });
    return logos;
  }, [approvedLoginSchools]);
  const clubLogo = (club) => {
    const key = String(club || "").trim().toLocaleLowerCase("tr");
    return schoolLogoMap.get(key) || "";
  };
  const selectedSchoolForLogin = approvedLoginSchools.find((school)=>String(school.schoolName||"").trim().toLocaleLowerCase("tr")===selectedClub.trim().toLocaleLowerCase("tr"));
  const loginTeams = type === "athlete" ? teamsForSchool(teams, selectedSchoolForLogin || selectedClub) : [];
  const matchesSchool = (person, school) => {
    if (!person || !school) return false;
    if (person.schoolId && school.id) return String(person.schoolId) === String(school.id);
    return String(person.schoolName || "").trim().toLocaleLowerCase("tr") === String(school.schoolName || "").trim().toLocaleLowerCase("tr");
  };
  const submit = async (event) => {
    event.preventDefault(); setNotice(""); setBusy(true);
    const data = new FormData(event.currentTarget);
    const schoolName = String(data.get("schoolName") || "").trim();
    const accessCode = String(data.get("accessCode") || "").trim();
    const teamId = type === "athlete" ? String(data.get("teamId") || "").trim() : "";
    if (!/^\d{6}$/.test(accessCode)) { setNotice(`${type === "club" ? "Kulüp" : type === "trainer" ? "Antrenör" : "Takım"} kodu 6 haneli olmalıdır.`); setBusy(false); return; }
    if (type === "athlete" && !teamId) { setNotice("Bağlı olduğunuz takımı seçin."); setBusy(false); return; }
    const selectedSchool = approvedLoginSchools.find((item) => item.schoolName.toLocaleLowerCase("tr") === schoolName.toLocaleLowerCase("tr") && (type !== "club" || String(item.code) === accessCode));
    const userName = type === "athlete" ? String(data.get("athleteName") || "").trim() : type === "trainer" ? String(data.get("trainerName") || "").trim() : "";
    let verified = null;
    try {
      verified = await sendRegistration({ action:"profileLogin", type, schoolName, schoolCode:type==="club"?accessCode:"", trainerCode:type==="trainer"?accessCode:"", teamId, teamCode:type==="athlete"?accessCode:"", userName });
      if (verified.token) sessionStorage.setItem(PROFILE_TOKEN_KEY, verified.token);
    } catch (error) {
      const legacyEndpoint = /Geçersiz işlem|GeÃ§ersiz iÅŸlem/i.test(error.message || "");
      if (!legacyEndpoint || type !== "club") { setNotice(error.message); setBusy(false); return; }
      console.warn("Profil oturumu için Apps Script'in güncel sürümü bekleniyor; yerel doğrulama kullanıldı.");
    }
    if (type === "club") {
      const school = verified?.account ? { ...selectedSchool, ...verified.account, id:verified.account.id || selectedSchool?.id } : selectedSchool;
      if (!school) { setNotice("Kulüp adı veya kullanıcı kodu eşleşmedi."); setBusy(false); return; }
      localStorage.setItem("volleyballCurrentClub", JSON.stringify(school));
      markSessionActivity();
      localStorage.removeItem("volleyballCurrentAthleteId");
      localStorage.removeItem("volleyballCurrentTrainerId");
      const clubSession = { type:"club", school };
      setSession(clubSession); onSessionChange(clubSession);
    } else if (type === "athlete") {
      const athlete = verified?.account ? { ...readAthletes().find((item) => item.id === verified.account.id), ...verified.account } : null;
      if (!athlete) { setNotice("Sporcu adı, kulüp adı veya kullanıcı kodu eşleşmedi."); setBusy(false); return; }
      localStorage.setItem("volleyballCurrentAthleteId", athlete.id);
      markSessionActivity();
      setAthleteLoggedOut(athlete.id, false);
      localStorage.removeItem("volleyballCurrentClub");
      localStorage.removeItem("volleyballCurrentTrainerId");
      const active = { ...athlete, online:true, lastSeen:new Date().toISOString() };
      localStorage.setItem("volleyballAthletes", JSON.stringify(readAthletes().map((item) => item.id === active.id ? active : item)));
      const athleteSession = { type:"athlete", athlete:active };
      sendAthletePresence(active.id, true);
      setSession(athleteSession); onSessionChange(athleteSession); onActivityChange();
    } else {
      const trainer = verified?.account ? { ...trainers.find((item) => item.id === verified.account.id), ...verified.account } : null;
      if (!trainer) { setNotice("Antrenör adı, kulüp adı veya kullanıcı kodu eşleşmedi."); setBusy(false); return; }
      localStorage.setItem("volleyballCurrentTrainerId", trainer.id);
      markSessionActivity();
      localStorage.removeItem("volleyballCurrentAthleteId");
      localStorage.removeItem("volleyballCurrentClub");
      const trainerSession = { type:"trainer", trainer };
      setSession(trainerSession); onSessionChange(trainerSession);
    }
    setBusy(false);
  };
  const logout = () => {
    closeProfileServerSession();
    if (session?.type === "athlete") {
      const id=session.athlete.id;
      localStorage.removeItem("volleyballCurrentAthleteId");
      setAthleteLoggedOut(id, true);
      localStorage.setItem("volleyballAthletes", JSON.stringify(readAthletes().map((item) => item.id === id ? { ...item, online:false } : item)));
      sendAthletePresence(id, false);
      onActivityChange();
    }
    localStorage.removeItem("volleyballCurrentClub");
    localStorage.removeItem("volleyballCurrentTrainerId");
    clearSessionActivity();
    onSessionChange(null); setSession(null); setNotice("");
  };
  if (session?.type === "club") {
    const members = readAthletes().filter((athlete) => matchesSchool(athlete, session.school));
    const clubTrainers = trainers.filter((trainer) => matchesSchool(trainer, session.school));
    const teamLogo = session.school.teamLogo || members.find((athlete) => athlete.teamLogo)?.teamLogo || "";
    const updateTrainerMemberships = (trainerId, memberships) => {
      setTrainers((current)=>{
        const next=current.map((trainer)=>trainer.id===trainerId?{...trainer,teamId:memberships[0]?.id||"",teamName:memberships[0]?.name||"",teamIds:memberships.map((team)=>team.id),teamNames:memberships.map((team)=>team.name),teamCodes:[],teams:memberships}:trainer);
        localStorage.setItem("volleyballTrainers",JSON.stringify(next));
        return next;
      });
    };
    return <div className="page profile-area">
      <section className="profile-hero-card"><div className={`club-emblem ${teamLogo ? "has-logo" : ""}`}>{teamLogo ? <TeamLogo src={teamLogo} name={session.school.schoolName}/> : <School/>}</div><span><small>KULÜP PROFİLİ</small><h1>{session.school.schoolName}</h1><p>Kullanıcı kodu: <b>{session.school.code}</b></p></span><button className="btn ghost" onClick={logout}>Çıkış yap</button></section>
      <div className="profile-summary"><article><Users/><span><b>{members.length}</b><small>Kayıtlı sporcu</small></span></article><article><GraduationCap/><span><b>{clubTrainers.length}</b><small>Kayıtlı antrenör</small></span></article><article><ShieldCheck/><span><b>{session.school.status === "ONAYLANDI" ? "Onaylı" : "Bekliyor"}</b><small>Kulüp durumu</small></span></article></div>
      <section className="club-bulletin-entry"><span className="club-bulletin-icon"><Newspaper/></span><span><small>SPORCU İLETİŞİMİ</small><h2>Haftalık eğitim bültenleri</h2><p>52 cuma için hazırlanan bültenleri kulüp logonla PDF oluşturup WhatsApp üzerinden paylaş.</p></span><button className="btn" onClick={()=>go("bulletins")}>Bültenleri yönet <ArrowRight/></button></section>
      <section className="club-bulletin-entry ready365-entry"><span className="club-bulletin-icon"><Library/></span><span><small>ANTRENÖR EĞİTİM ALANI</small><h2>Voleybol Antrenörlük Kütüphanesi</h2><p>21 profesyonel PDF kaynağını ve tüm çalışma bölümlerini sayfa içinde görüntüle.</p></span><button className="btn" onClick={()=>go("ready365-library")}>Kütüphaneyi aç <ArrowRight/></button></section>
      <ClubTrainerInvite school={session.school}/>
      <ClubTeamManager school={session.school} members={members} trainers={clubTrainers} onTrainersChange={updateTrainerMemberships}/>
      <section className="member-panel"><div className="member-heading"><span><small>SPORCU KADROSU</small><h2>Kulübe kayıtlı sporcular</h2></span></div>{members.length ? <div className="member-list">{members.map((athlete)=><article key={athlete.id}><AthleteAvatar id={athlete.avatar}/><span><b>{athlete.name}</b><small>{athlete.teamName||"Takım ataması bekliyor"} · {athlete.id}</small></span><em className={isAthleteActive(athlete)?"active":"offline"}>{isAthleteActive(athlete)?"Derste":"Çevrim dışı"}</em></article>)}</div> : <div className="member-empty"><Users/><h3>Henüz sporcu kaydı yok</h3><p>Sporcular takım adı ve o takıma ait 6 haneli kodla kayıt olduğunda burada listelenir.</p></div>}</section>
      <section className="member-panel"><div className="member-heading"><span><small>ANTRENÖR KADROSU</small><h2>Kulübe kayıtlı antrenörler</h2></span></div>{clubTrainers.length ? <div className="member-list">{clubTrainers.map((trainer)=>{const memberships=trainerTeamMemberships(trainer);return <article key={trainer.id}><TrainerAvatar id={trainer.avatar}/><span><b>{trainer.name}</b><small>{memberships.map((team)=>team.name).filter(Boolean).join(" · ")||"Takım ataması bekliyor"} · {trainer.title || "Antrenör"} · {trainer.id}</small></span><em className="active">{memberships.length} TAKIM</em></article>})}</div> : <div className="member-empty"><GraduationCap/><h3>Henüz antrenör kaydı yok</h3><p>Antrenörler ayrı antrenör koduyla kulübe kayıt olduğunda burada listelenir; takım atamasını kulüp yöneticisi yapar.</p></div>}</section>
    </div>;
  }
  if (session?.type === "trainer") {
    const trainer = session.trainer;
    const school = schools.find((item) => item.schoolName.toLocaleLowerCase("tr") === trainer.schoolName.toLocaleLowerCase("tr"));
    const teamLogo = trainer.teamLogo || school?.teamLogo || "";
    const trainerMemberships = trainerTeamMemberships(trainer);
    return <div className="page profile-area trainer-profile">
      <section className="profile-hero-card"><span className="trainer-profile-avatar-wrap"><TrainerAvatar id={trainer.avatar} className="profile-large-avatar"/>{teamLogo&&<TeamLogo src={teamLogo} name={trainer.schoolName} className="trainer-team-logo"/>}</span><span><small>ANTRENÖR PROFİLİ</small><h1>{trainer.name}</h1><p>{trainer.schoolName}</p></span><button className="btn ghost" onClick={logout}>Çıkış yap</button></section>
      <div className="athlete-profile-grid"><article><small>GÖREV</small><b>{trainer.title || "Antrenör"}</b></article><article><small>BAĞLI TAKIM</small><b>{trainerMemberships.length}</b></article><article><small>ANTRENÖR KODU</small><b>{trainer.trainerCode||trainer.teamCode||trainer.schoolCode}</b></article><article><small>PROFİL KİMLİĞİ</small><b>{trainer.id}</b></article></div>
      <section className="trainer-team-list"><div className="member-heading"><span><small>TAKIM LİSTEM</small><h2>Bağlı olduğum takımlar</h2></span></div>{trainerMemberships.length?<div className="trainer-team-list-grid">{trainerMemberships.map((team,index)=><article key={team.id||index}><span className="trainer-team-index">{String(index+1).padStart(2,"0")}</span><span><b>{team.name||"Takım"}</b><small>Kulüp yöneticisi görevlendirmesi</small></span><CheckCircle2/></article>)}</div>:<div className="member-empty trainer-team-empty"><GraduationCap/><h3>Takım ataması bekleniyor</h3><p>Kulüp yöneticiniz sizi bir veya daha fazla takıma atadığında takım listeniz burada gösterilir.</p></div>}</section>
      <section className="club-bulletin-entry ready365-entry"><span className="club-bulletin-icon"><Library/></span><span><small>ANTRENÖR EĞİTİM ALANI</small><h2>Voleybol Antrenörlük Kütüphanesi</h2><p>Antrenman, beceri gelişimi, takım sistemleri ve sezon planlama PDF kütüphanesi.</p></span><button className="btn" onClick={()=>go("ready365-library")}>Kütüphaneyi aç <ArrowRight/></button></section>
      <div className="profile-info-note"><ShieldCheck/><span><b>Kulübe bağlı antrenör hesabı</b><p>Bu profil kulüp yöneticisinin paylaştığı ayrı antrenör koduyla açılır; takım kodları yalnızca sporcular içindir.</p></span></div>
    </div>;
  }
  if (session?.type === "athlete") {
    const athlete=session.athlete;
    return <div className="page profile-area athlete-profile"><section className="profile-hero-card"><AthleteAvatar id={athlete.avatar} className="profile-large-avatar"/><span><small>SPORCU PROFİLİ</small><h1>{athlete.name}</h1><p>{athlete.schoolName}</p></span><button className="btn ghost" onClick={logout}>Çıkış yap</button></section><div className="athlete-profile-grid"><article><small>TAKIM</small><b>{athlete.teamName||"Atanmadı"}</b></article><article><small>TAKIM KODU</small><b>{athlete.teamCode||athlete.schoolCode}</b></article><article><small>AKTİFLİK</small><b className="green-text">Derste</b></article><article><small>PROFİL KİMLİĞİ</small><b>{athlete.id}</b></article></div><div className="profile-info-note"><CheckCircle2/><span><b>Profilin aktif</b><p>Bu sayfa açık kaldığı sürece çevrim içi görünürsün. Çıkış yaptığında otomatik kaldırılırsın.</p></span></div></div>;
  }
  const profileIcon = type === "club" ? <School/> : type === "trainer" ? <GraduationCap/> : <UserPlus/>;
  const profileTitle = type === "club" ? "Kulüp girişi" : type === "trainer" ? "Antrenör girişi" : "Sporcu girişi";
  return <div className="page profile-login-page">
    <div className="profile-login-intro"><span className="eyebrow"><ShieldCheck/> KİŞİSEL PROFİL ALANI</span><h1>Kulübüne ve profiline güvenle eriş.</h1><p>Kulüpler kendi kadrolarını görür; sporcular ve antrenörler bağlı oldukları kulüp üzerinden akademiye katılır.</p></div>
    <section className="profile-login-card">
      <div className="registration-tabs profile-login-tabs"><button className={type==="club"?"active":""} onClick={()=>{setType("club");setSelectedTeamId("");setNotice("")}}><School/> Kulüp</button><button className={type==="athlete"?"active":""} onClick={()=>{setType("athlete");setSelectedTeamId("");setNotice("")}}><UserPlus/> Sporcu</button><button className={type==="trainer"?"active":""} onClick={()=>{setType("trainer");setSelectedTeamId("");setNotice("")}}><GraduationCap/> Antrenör</button></div>
      <form className="registration-form" onSubmit={submit}><div className="form-heading">{profileIcon}<span><b>{profileTitle}</b><small>{type==="club"?"Kulübünüzü seçip size özel kulüp kodunu girin.":type==="trainer"?"Kulübünüzü seçip antrenör kullanıcı adınızı ve ayrı antrenör kodunu girin.":"Kulübünüzü ve takımınızı seçip takım kodunu girin."}</small></span></div>{!schoolsReady&&<p className="field-help" role="status">Güncel okul listesi yükleniyor…</p>}<SearchableSchoolPicker value={selectedClub} onChange={(club)=>{setSelectedClub(club);setSelectedTeamId("");setNotice("")}} options={clubOptions} logoFor={clubLogo}/>{type==="athlete"&&<label>Takım<select name="teamId" required value={selectedTeamId} onChange={(event)=>setSelectedTeamId(event.target.value)} disabled={!selectedClub}><option value="">{selectedClub?(loginTeams.length?"Bağlı olduğunuz takımı seçin":"Bu kulüp henüz takım oluşturmadı"):"Önce kulübünüzü seçin"}</option>{loginTeams.map((team)=><option key={team.id} value={team.id}>{team.name}</option>)}</select></label>}{type==="athlete"&&<label>Sporcu adı<input name="athleteName" required placeholder="@kullaniciadi" autoCapitalize="none" spellCheck="false"/></label>}{type==="trainer"&&<label>Antrenör adı<input name="trainerName" required placeholder="@antrenoradi" autoCapitalize="none" spellCheck="false"/></label>}<label>{type==="club"?"6 haneli kulüp giriş kodu":type==="trainer"?"6 haneli antrenör kodu":"6 haneli takım kodu"}<input name="accessCode" required inputMode="numeric" maxLength="6" pattern="[0-9]{6}" placeholder="000000"/></label><button className="btn" disabled={!schoolsReady||busy||clubOptions.length===0||!selectedClub||(type==="athlete"&&!selectedTeamId)}>{busy?"Güvenli giriş kontrol ediliyor…":"Profile giriş yap"} <ArrowRight/></button></form>
      {notice&&<div className="profile-login-error" role="alert"><WifiOff/>{notice}</div>}
    </section>
  </div>;
}

function VideoPreviewImage({ video, alt="", loading="lazy" }) {
  const candidates = [...new Set([
    video?.thumbnail,
    video?.id ? `https://lh3.googleusercontent.com/d/${video.id}=w900` : "",
    video?.id ? `https://drive.google.com/thumbnail?id=${video.id}&sz=w900` : "",
    video?.fallback,
    "/brand-logo-transparent.png",
  ].filter(Boolean))];
  const [candidateIndex, setCandidateIndex] = useState(0);
  useEffect(() => setCandidateIndex(0), [video?.id]);
  const currentSource = candidates[Math.min(candidateIndex, candidates.length - 1)];
  return <img key={`${video?.id}-${candidateIndex}`} src={currentSource} alt={alt} loading={loading} decoding="async" referrerPolicy="no-referrer" onError={()=>setCandidateIndex((value)=>Math.min(value+1,candidates.length-1))}/>;
}

function TrainingVideosPage() {
  const [library, setLibrary] = useState("academy");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Tümü");
  const [selected, setSelected] = useState(trainingVideos[0]);
  const [playerStarted, setPlayerStarted] = useState(false);
  const [nativePlaybackFailed, setNativePlaybackFailed] = useState(false);
  const [preferEmbeddedPlayer] = useState(() => window.matchMedia("(max-width: 760px), (pointer: coarse)").matches);
  const [visible, setVisible] = useState(12);
  const [managedVideos, setManagedVideos] = useState(()=>applyManagedVideoOrder(trainingVideos));
  const videos = library === "individual" ? individualTrainingVideos : managedVideos;
  const managedTopics = useMemo(()=>{
    const counts = new Map();
    managedVideos.forEach((video)=>counts.set(video.topic,(counts.get(video.topic)||0)+1));
    return [...counts.entries()].map(([name,count])=>({name,count}));
  },[managedVideos]);
  const topics = library === "individual" ? individualVideoTopics : managedTopics;
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");
    return videos.filter((video) => (topic === "Tümü" || video.topic === topic) && (!term || video.title.toLocaleLowerCase("tr").includes(term) || video.topic.toLocaleLowerCase("tr").includes(term) || video.fileName?.toLocaleLowerCase("tr").includes(term) || String(video.number) === term));
  }, [query, topic, videos]);
  useEffect(()=>{
    const applyRows=(rows)=>{
      if(!rows.length)return;
      localStorage.setItem("volleyballVideoManagement",JSON.stringify(rows));
      setManagedVideos(applyManagedVideoOrder(trainingVideos,rows));
    };
    fetchRegistrationSheet("Video Yonetimi").then(applyRows).catch(()=>{});
    const sync=(event)=>applyRows(event.detail||[]);
    window.addEventListener("volleyballVideoManagementUpdated",sync);
    return ()=>window.removeEventListener("volleyballVideoManagementUpdated",sync);
  },[]);
  const changeLibrary = (nextLibrary) => {
    const nextVideos = nextLibrary === "individual" ? individualTrainingVideos : trainingVideos;
    const nextTopic = nextLibrary === "individual" ? individualVideoTopics[0].name : "Tümü";
    setLibrary(nextLibrary); setTopic(nextTopic); setQuery(""); setVisible(12);
    setSelected(nextVideos[0]); setPlayerStarted(false); setNativePlaybackFailed(false);
  };
  const selectPlaylistTopic = (nextTopic) => {
    const nextVideo = videos.find((video) => nextTopic === "Tümü" || video.topic === nextTopic);
    setTopic(nextTopic); setVisible(12); setPlayerStarted(false); setNativePlaybackFailed(false);
    if (nextVideo) setSelected(nextVideo);
  };
  const choose = (video) => {
    setSelected(video);
    setPlayerStarted(false);
    setNativePlaybackFailed(false);
    requestAnimationFrame(() => document.querySelector(".video-player-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const playlistVideos = (topic === "Tümü" ? videos : filtered).slice(0, 40);
  return <div className="video-library-page">
    <section className="video-library-hero">
      <div><span className="eyebrow"><Video size={16}/> VİDEO KÜTÜPHANESİ</span><h1>Hareketi izle,<br/><em>sahada uygula.</em></h1><p>Eğitim videoları ve bireysel antrenman çalışmaları konu başlıklarına göre düzenlendi.</p><div className="video-hero-stats"><span><b>{trainingVideos.length}</b> eğitim videosu</span><span><b>{individualTrainingVideos.length}</b> bireysel çalışma</span></div></div>
      <div className="video-hero-mark" aria-hidden="true"><Play/><i/><i/><i/></div>
    </section>
    <section className="video-library-content">
      <div className="video-library-switch" aria-label="Video kütüphanesi türü"><button className={library === "academy" ? "active" : ""} onClick={() => changeLibrary("academy")}><Video/><span><b>Eğitim Videoları</b><small>{trainingVideos.length} video</small></span></button><button className={library === "individual" ? "active" : ""} onClick={() => changeLibrary("individual")}><Dumbbell/><span><b>Bireysel Antrenman Videoları</b><small>{individualTrainingVideos.length} çalışma</small></span></button></div>
      <div className="video-watch-layout">
        <div className="video-player-panel">
          <div className="video-player-heading"><span><small>ŞİMDİ İZLENİYOR</small><h2>{selected.title}</h2></span></div>
          <div className={`drive-player ${playerStarted ? "started" : "poster-visible"}`}>
            {playerStarted && !preferEmbeddedPlayer && selected.streamUrl && !nativePlaybackFailed && <video key={selected.id} className="video-native-player" src={selected.streamUrl} poster={selected.thumbnail || selected.fallback} controls autoPlay playsInline loop preload="metadata" onError={()=>setNativePlaybackFailed(true)}>Tarayıcınız video oynatmayı desteklemiyor.</video>}
            {playerStarted && (preferEmbeddedPlayer || !selected.streamUrl || nativePlaybackFailed) && <iframe key={`${selected.id}-fallback`} src={selected.preview} title={selected.title} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen loading="eager" referrerPolicy="strict-origin-when-cross-origin" />}
            {!playerStarted && <button type="button" className="video-player-poster" onClick={()=>setPlayerStarted(true)} aria-label={`${selected.title} videosunu başlat`}>{selected.source ? <video src={selected.source} muted playsInline preload="metadata" aria-label={`${selected.title} video ön izlemesi`}/> : <VideoPreviewImage video={selected} alt={`${selected.title} video ön izlemesi`} loading="eager"/>}<span><Play/> Videoyu başlat</span></button>}
          </div>
          <p>Video otomatik başlar ve tamamlandığında yeniden oynatılır. <a className="video-mobile-fallback" href={selected.view} target="_blank" rel="noreferrer">Video açılmazsa güvenli oynatıcıda aç</a></p>
          {selected.practice && <div className="video-practice-info"><article><Users/><span><small>SPORCU SAYISI</small><b>{selected.practice.athletes} sporcu</b></span></article><article><CircleDot/><span><small>TOP SAYISI</small><b>{selected.practice.balls} top</b></span></article><article><Target/><span><small>ÇALIŞMA AMACI</small><b>{selected.practice.goal}</b></span></article><article className="practice-advice"><Dumbbell/><span><small>ANTRENÖR ÖNERİSİ</small><b>{selected.practice.advice}</b></span></article></div>}
        </div>
        <aside className="video-playlist-panel" aria-label="Video oynatma listesi">
          <header><span><small>OYNATMA LİSTESİ</small><b>{topic === "Tümü" ? (library === "individual" ? "Bireysel Antrenmanlar" : "Eğitim Videoları") : topic}</b></span><em>{playlistVideos.findIndex((video)=>video.id===selected.id)+1 || 1} / {playlistVideos.length}</em></header>
          <div className="playlist-category-tabs">{topics.map((item)=><button key={item.name} className={topic===item.name?"active":""} onClick={()=>selectPlaylistTopic(item.name)}><span>{item.name}</span><b>{item.count}</b></button>)}</div>
          <div className="video-playlist-scroll">{playlistVideos.map((video,index)=><button key={video.id} className={selected.id===video.id?"active":""} onClick={()=>choose(video)}><i>{index+1}</i><span className="playlist-thumb">{video.source ? <video src={video.source} muted playsInline preload="metadata"/> : <VideoPreviewImage video={video}/>}<Play/></span><span className="playlist-copy"><b>{video.title}</b><small>{video.topic}</small></span></button>)}</div>
        </aside>
      </div>
      <div className="video-topic-bar" aria-label="Video konuları"><button className={topic==="Tümü"?"active":""} onClick={()=>selectPlaylistTopic("Tümü")}><span>Tüm videolar</span><b>{videos.length}</b></button>{topics.map((item)=><button key={item.name} className={topic===item.name?"active":""} onClick={()=>selectPlaylistTopic(item.name)}><span>{item.name}</span><b>{item.count}</b></button>)}</div>
      <div className="video-library-toolbar"><div><span className="eyebrow">{library === "individual" ? "BİREYSEL ÇALIŞMA ARŞİVİ" : "VİDEO ARŞİVİ"}</span><h2>{library === "individual" ? "Bireysel antrenman videoları" : "Tüm eğitim videoları"}</h2></div><label className="video-search"><Search/><span className="sr-only">Video ara</span><input value={query} onChange={(event)=>{setQuery(event.target.value);setVisible(12)}} placeholder="Video adı veya numarası ara"/></label></div>
      {filtered.length ? <div className="training-video-grid">{filtered.slice(0,visible).map((video)=><article className={selected.id===video.id?"training-video-card active":"training-video-card"} key={video.id}><button className="video-card-preview" onClick={()=>choose(video)} aria-label={`${video.title} videosunu oynat`}>{video.source ? <video src={video.source} muted playsInline preload="metadata" aria-label={`${video.title} video görüntüsü`}/> : <VideoPreviewImage video={video} alt={`${video.title} video görüntüsü`}/>}<span className="video-number">#{library === "individual" ? video.number : String(video.number).padStart(2,"0")}</span><span className="video-topic-label">{video.topic}</span><span className="video-play"><Play/></span></button><div><small>{video.topic.toLocaleUpperCase("tr")}</small><h3>{video.title}</h3>{video.fileName && <p className="video-file-name">{video.fileName}</p>}<button onClick={()=>choose(video)}>Videoyu izle <ArrowRight/></button></div></article>)}</div> : <div className="video-empty"><Search/><h2>Video bulunamadı</h2><p>Arama numarasını veya konuyu değiştirin.</p></div>}
      {visible < filtered.length && <button className="btn ghost video-load-more" onClick={()=>setVisible((value)=>value+12)}>Daha fazla video göster <ChevronDown/></button>}
    </section>
  </div>;
}

function applyManagedVideoOrder(videos, rows) {
  let settings=rows;
  if(!settings){try{settings=JSON.parse(localStorage.getItem("volleyballVideoManagement")||"[]")}catch{settings=[]}}
  if(!Array.isArray(settings)||!settings.length)return videos;
  const byId=new Map(settings.map((row)=>[String(row["Video ID"]||row.id||""),row]));
  return videos.map((video)=>{const row=byId.get(String(video.id));return row?{...video,title:String(row["Başlık"]||row.title||video.title),topic:String(row["Kategori"]||row.category||video.topic),adminOrder:Number(row["Sıra"]||row.order||9999)}:video})
    .sort((a,b)=>(a.adminOrder??9999)-(b.adminOrder??9999)||a.number-b.number);
}

function AdminPageLegacy(){
  const [token,setToken]=useState(()=>sessionStorage.getItem("volleyballAdminToken")||"");
  const [code,setCode]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const [items,setItems]=useState(()=>applyManagedVideoOrder(trainingVideos).map((video)=>({...video,category:video.topic})));
  const [blogStats,setBlogStats]=useState([]);
  const [dragged,setDragged]=useState(null);
  const [previewVideo,setPreviewVideo]=useState(null);
  const [adminCategory,setAdminCategory]=useState("Tümü");
  const [bulletinItems,setBulletinItems]=useState(()=>{
    try{return applyBulletinManagement(JSON.parse(localStorage.getItem("volleyballBulletinManagement")||"[]"),true)}catch{return applyBulletinManagement([],true)}
  });
  const [bulletinBusy,setBulletinBusy]=useState(false);
  const [bulletinDragged,setBulletinDragged]=useState(null);
  const autoSaveReady=useRef(false);
  const bulletinAutoSaveReady=useRef(false);
  const categories=[...new Set(videoTopics.map((item)=>item.name))];
  const adminCategoryCounts=useMemo(()=>categories.map((category)=>({category,count:items.filter((item)=>item.category===category).length})),[items]);
  const visibleAdminItems=items.map((video,index)=>({video,index})).filter(({video})=>adminCategory==="Tümü"||video.category===adminCategory);
  const load=async(nextToken=token)=>{const result=await sendRegistration({action:"adminStats",token:nextToken});setBlogStats(result.blog||[]);if(result.videos?.length){localStorage.setItem("volleyballVideoManagement",JSON.stringify(result.videos));setItems(applyManagedVideoOrder(trainingVideos,result.videos).map((video)=>({...video,category:video.topic})))}if(result.bulletins?.length){localStorage.setItem("volleyballBulletinManagement",JSON.stringify(result.bulletins));setBulletinItems(applyBulletinManagement(result.bulletins,true))}};
  useEffect(()=>{if(token)load().catch(()=>{sessionStorage.removeItem("volleyballAdminToken");setToken("")})},[]);
  const login=async(event)=>{event.preventDefault();setBusy(true);setNotice("");try{const result=await sendRegistration({action:"adminLogin",code,clientId:getStableClientId()});sessionStorage.setItem("volleyballAdminToken",result.token);setToken(result.token);setCode("");await load(result.token)}catch(error){setNotice(error.message)}finally{setBusy(false)}};
  const move=(from,to)=>{if(from===null||from===to||to<0||to>=items.length)return;autoSaveReady.current=true;setItems((current)=>{const next=[...current];const [item]=next.splice(from,1);next.splice(to,0,item);return next})};
  const moveInView=(visibleIndex,direction)=>{const target=visibleAdminItems[visibleIndex+direction];if(!target)return;move(visibleAdminItems[visibleIndex].index,target.index)};
  const updateCategory=(index,category)=>{autoSaveReady.current=true;setItems((current)=>current.map((item,itemIndex)=>itemIndex===index?{...item,category}:item))};
  const updateTitle=(index,title)=>{autoSaveReady.current=true;setItems((current)=>current.map((item,itemIndex)=>itemIndex===index?{...item,title}:item))};
  const save=async()=>{if(items.some((item)=>!item.title.trim())){setNotice("Video başlığı boş bırakılamaz.");return}setBusy(true);setNotice("Değişiklikler otomatik kaydediliyor…");try{const payload=items.map((item,index)=>({id:item.id,title:item.title.trim(),category:item.category,order:index+1}));const result=await sendRegistration({action:"adminSaveVideoOrder",token,items:payload});const rows=payload.map((item)=>({"Video ID":item.id,"Başlık":item.title,"Kategori":item.category,"Sıra":item.order}));localStorage.setItem("volleyballVideoManagement",JSON.stringify(rows));window.dispatchEvent(new CustomEvent("volleyballVideoManagementUpdated",{detail:rows}));setNotice(`${result.count||items.length} video otomatik kaydedildi.`)}catch(error){setNotice(error.message)}finally{setBusy(false)}};
  useEffect(()=>{if(!token||!autoSaveReady.current)return;const timer=setTimeout(()=>{autoSaveReady.current=false;save()},700);return()=>clearTimeout(timer)},[items,token]);
  const updateBulletin=(index,changes)=>{bulletinAutoSaveReady.current=true;setBulletinItems((current)=>current.map((item,itemIndex)=>itemIndex===index?{...item,...changes}:item))};
  const moveBulletin=(from,to)=>{if(from===null||from===to||to<0||to>=bulletinItems.length)return;bulletinAutoSaveReady.current=true;setBulletinItems((current)=>{const next=[...current];const [item]=next.splice(from,1);next.splice(to,0,item);return next})};
  const saveBulletins=async()=>{if(bulletinItems.some((item)=>!item.title.trim()||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(item.date))){setNotice("Bülten başlığı ve tarihi geçerli olmalıdır.");return}setBulletinBusy(true);try{const payload=bulletinItems.map((item,index)=>({id:item.id,title:item.title.trim(),date:item.date,published:item.published!==false,order:index+1}));const rows=payload.map((item)=>({"Bülten ID":item.id,"Başlık":item.title,"Tarih":item.date,"Sıra":item.order,"Yayında":item.published?"EVET":"HAYIR"}));localStorage.setItem("volleyballBulletinManagement",JSON.stringify(rows));window.dispatchEvent(new CustomEvent("volleyballBulletinManagementUpdated",{detail:rows}));try{const result=await sendRegistration({action:"adminSaveBulletins",token,items:payload});setNotice(`${result.count||payload.length} bülten otomatik kaydedildi.`)}catch(error){setNotice(`Bültenler bu cihazda kaydedildi. Sunucu: ${error.message}`)}}finally{setBulletinBusy(false)}};
  useEffect(()=>{if(!token||!bulletinAutoSaveReady.current)return;const timer=setTimeout(()=>{bulletinAutoSaveReady.current=false;saveBulletins()},700);return()=>clearTimeout(timer)},[bulletinItems,token]);
  if(!token)return <div className="admin-page admin-login"><section><span className="admin-icon"><ShieldCheck/></span><small>YÖNETİCİ ALANI</small><h1>İçerik kontrol merkezine giriş</h1><p>Yönetici kodu sunucuda doğrulanır ve web sayfasının kaynak kodunda saklanmaz.</p><form onSubmit={login}><label>6 haneli yönetici kodu<input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g,""))} required autoComplete="one-time-code"/></label><button className="btn" disabled={busy||code.length!==6}><KeyRound/>{busy?"Kontrol ediliyor…":"Güvenli giriş yap"}</button></form>{notice&&<div className="admin-notice error">{notice}</div>}</section></div>;
  return <div className="admin-page"><section className="admin-hero"><div><span className="eyebrow"><Settings/> YÖNETİCİ PANELİ</span><h1>İçerikleri tek yerden yönet.</h1><p>Videoların sırasını ve kategorisini düzenle; blog okunmalarını takip et.</p></div><button className="btn ghost" onClick={()=>{sessionStorage.removeItem("volleyballAdminToken");setToken("")}}>Güvenli çıkış</button></section>
    <div className="admin-grid"><section className="admin-panel video-admin"><header><span><small>VİDEO KONTROLÜ</small><h2>Sıralama ve kategori</h2></span><span className={`admin-autosave-state ${busy?"saving":""}`}><i/>{busy?"Kaydediliyor…":"Otomatik kayıt aktif"}</span></header><p className="admin-hint">Video görseline dokunarak önizleyin. Başlık, kategori ve sıralama değişiklikleri otomatik kaydedilir.</p><div className="admin-category-filter" aria-label="Video kategorileri"><button className={adminCategory==="Tümü"?"active":""} onClick={()=>setAdminCategory("Tümü")}><span>Tüm Videolar</span><b>{items.length}</b></button>{adminCategoryCounts.map(({category,count})=><button key={category} className={adminCategory===category?"active":""} onClick={()=>setAdminCategory(category)}><span>{category}</span><b>{count}</b></button>)}</div>{previewVideo&&<div className="admin-video-player"><div><span><small>VİDEO ÖNİZLEMESİ</small><b>{previewVideo.title}</b></span><button onClick={()=>setPreviewVideo(null)} aria-label="Önizlemeyi kapat">×</button></div><iframe src={previewVideo.preview} title={`${previewVideo.title} önizlemesi`} allow="autoplay; fullscreen" allowFullScreen/></div>}<div className="admin-video-list">{visibleAdminItems.map(({video,index},visibleIndex)=><article key={video.id} draggable onDragStart={()=>setDragged(index)} onDragOver={(event)=>event.preventDefault()} onDrop={()=>{move(dragged,index);setDragged(null)}}><GripVertical/><button className="admin-video-thumb" onClick={()=>setPreviewVideo(video)} aria-label={`${video.title} videosunu önizle`}>{video.source?<video src={video.source} muted playsInline preload="metadata"/>:<img src={video.thumbnail} alt=""/>}<Play/></button><label className="admin-video-title"><small>#{String(visibleIndex+1).padStart(2,"0")} · VİDEO BAŞLIĞI</small><input value={video.title} maxLength="180" onChange={(event)=>updateTitle(index,event.target.value)} aria-label={`${String(visibleIndex+1).padStart(2,"0")} numaralı video başlığı`}/></label><select value={video.category} onChange={(event)=>updateCategory(index,event.target.value)}>{categories.map((category)=><option key={category}>{category}</option>)}</select><div className="admin-move"><button onClick={()=>moveInView(visibleIndex,-1)} aria-label="Yukarı taşı">↑</button><button onClick={()=>moveInView(visibleIndex,1)} aria-label="Aşağı taşı">↓</button></div></article>)}</div></section>
    <section className="admin-panel blog-admin"><header><span><small>BLOG ANALİZİ</small><h2>Okunma sayıları</h2></span><Eye/></header>{blogStats.length?<div className="admin-blog-list">{[...blogStats].sort((a,b)=>Number(b["Okunma Sayısı"]||0)-Number(a["Okunma Sayısı"]||0)).map((row)=><article key={row["Yazı ID"]}><span><b>{row["Başlık"]}</b><small>Son okunma: {row["Son Okunma"]||"—"}</small></span><strong>{row["Okunma Sayısı"]||0}<small>okunma</small></strong></article>)}</div>:<div className="admin-empty"><Eye/><b>Henüz okunma kaydı yok</b><p>Blog yazıları açıldıkça sayaç burada görünür.</p></div>}</section></div>{notice&&<div className="admin-notice">{notice}</div>}</div>;
}

function AdminPage(){
  const [token,setToken]=useState(()=>sessionStorage.getItem("volleyballAdminToken")||"");
  const [code,setCode]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const [bulletinBusy,setBulletinBusy]=useState(false);
  const [items,setItems]=useState(()=>applyManagedVideoOrder(trainingVideos).map((video)=>({...video,category:video.topic})));
  const [bulletinItems,setBulletinItems]=useState(()=>{
    try{return applyBulletinManagement(JSON.parse(localStorage.getItem("volleyballBulletinManagement")||"[]"),true)}catch{return applyBulletinManagement([],true)}
  });
  const [blogStats,setBlogStats]=useState([]);
  const [dragged,setDragged]=useState(null);
  const [bulletinDragged,setBulletinDragged]=useState(null);
  const [previewVideo,setPreviewVideo]=useState(null);
  const [adminCategory,setAdminCategory]=useState("Tümü");
  const videoSaveReady=useRef(false);
  const bulletinSaveReady=useRef(false);
  const categories=[...new Set([...videoTopics.map((item)=>item.name),...items.map((item)=>item.category)])];
  const categoryCounts=useMemo(()=>categories.map((category)=>({category,count:items.filter((item)=>item.category===category).length})),[items]);
  const visibleVideos=items.map((video,index)=>({video,index})).filter(({video})=>adminCategory==="Tümü"||video.category===adminCategory);

  const load=async(nextToken=token)=>{
    const result=await sendRegistration({action:"adminStats",token:nextToken});
    setBlogStats(result.blog||[]);
    if(result.videos?.length){localStorage.setItem("volleyballVideoManagement",JSON.stringify(result.videos));setItems(applyManagedVideoOrder(trainingVideos,result.videos).map((video)=>({...video,category:video.topic})))}
    if(result.bulletins?.length){localStorage.setItem("volleyballBulletinManagement",JSON.stringify(result.bulletins));setBulletinItems(applyBulletinManagement(result.bulletins,true))}
  };
  useEffect(()=>{if(token)load().catch(()=>{sessionStorage.removeItem("volleyballAdminToken");setToken("")})},[]);
  const login=async(event)=>{event.preventDefault();setBusy(true);setNotice("");try{const result=await sendRegistration({action:"adminLogin",code,clientId:getStableClientId()});sessionStorage.setItem("volleyballAdminToken",result.token);setToken(result.token);setCode("");await load(result.token)}catch(error){setNotice(error.message)}finally{setBusy(false)}};

  const moveVideo=(from,to)=>{if(from===null||from===to||to<0||to>=items.length)return;videoSaveReady.current=true;setItems((current)=>{const next=[...current];const [item]=next.splice(from,1);next.splice(to,0,item);return next})};
  const moveVisibleVideo=(visibleIndex,direction)=>{const target=visibleVideos[visibleIndex+direction];if(target)moveVideo(visibleVideos[visibleIndex].index,target.index)};
  const updateVideo=(index,changes)=>{videoSaveReady.current=true;setItems((current)=>current.map((item,itemIndex)=>itemIndex===index?{...item,...changes}:item))};
  const saveVideos=async()=>{if(items.some((item)=>!item.title.trim())){setNotice("Video başlığı boş bırakılamaz.");return}setBusy(true);try{const payload=items.map((item,index)=>({id:item.id,title:item.title.trim(),category:item.category,order:index+1}));const result=await sendRegistration({action:"adminSaveVideoOrder",token,items:payload});const rows=payload.map((item)=>({"Video ID":item.id,"Başlık":item.title,"Kategori":item.category,"Sıra":item.order}));localStorage.setItem("volleyballVideoManagement",JSON.stringify(rows));window.dispatchEvent(new CustomEvent("volleyballVideoManagementUpdated",{detail:rows}));setNotice(`${result.count||items.length} video otomatik kaydedildi.`)}catch(error){setNotice(error.message)}finally{setBusy(false)}};
  useEffect(()=>{if(!token||!videoSaveReady.current)return;const timer=setTimeout(()=>{videoSaveReady.current=false;saveVideos()},700);return()=>clearTimeout(timer)},[items,token]);

  const updateBulletin=(index,changes)=>{bulletinSaveReady.current=true;setBulletinItems((current)=>current.map((item,itemIndex)=>itemIndex===index?{...item,...changes}:item))};
  const moveBulletin=(from,to)=>{if(from===null||from===to||to<0||to>=bulletinItems.length)return;bulletinSaveReady.current=true;setBulletinItems((current)=>{const next=[...current];const [item]=next.splice(from,1);next.splice(to,0,item);return next})};
  const saveBulletins=async()=>{if(bulletinItems.some((item)=>!item.title.trim()||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(item.date))){setNotice("Bülten başlığı ve tarihi geçerli olmalıdır.");return}setBulletinBusy(true);const payload=bulletinItems.map((item,index)=>({id:item.id,title:item.title.trim(),date:item.date,status:item.status||"published",order:index+1}));const statusLabel={published:"YAYINDA",draft:"TASLAK",deleted:"SİLİNDİ"};const rows=payload.map((item)=>({"Bülten ID":item.id,"Başlık":item.title,"Tarih":item.date,"Sıra":item.order,"Yayında":statusLabel[item.status]||"TASLAK"}));localStorage.setItem("volleyballBulletinManagement",JSON.stringify(rows));window.dispatchEvent(new CustomEvent("volleyballBulletinManagementUpdated",{detail:rows}));try{const result=await sendRegistration({action:"adminSaveBulletins",token,items:payload});setNotice(`${result.count||payload.length} bülten otomatik kaydedildi.`)}catch(error){setNotice(`Bültenler bu cihazda kaydedildi. Sunucu: ${error.message}`)}finally{setBulletinBusy(false)}};
  useEffect(()=>{if(!token||!bulletinSaveReady.current)return;const timer=setTimeout(()=>{bulletinSaveReady.current=false;saveBulletins()},700);return()=>clearTimeout(timer)},[bulletinItems,token]);

  if(!token)return <div className="admin-page admin-login"><section><span className="admin-icon"><ShieldCheck/></span><small>YÖNETİCİ ALANI</small><h1>İçerik kontrol merkezine giriş</h1><p>Yönetici kodu sunucuda doğrulanır ve web sayfasının kaynak kodunda saklanmaz.</p><form onSubmit={login}><label>6 haneli yönetici kodu<input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g,""))} required autoComplete="one-time-code"/></label><button className="btn" disabled={busy||code.length!==6}><KeyRound/>{busy?"Kontrol ediliyor…":"Güvenli giriş yap"}</button></form>{notice&&<div className="admin-notice error">{notice}</div>}</section></div>;
  return <div className="admin-page">
    <section className="admin-hero"><div><span className="eyebrow"><Settings/> YÖNETİCİ PANELİ</span><h1>İçerikleri tek yerden yönet.</h1><p>Videoları, eğitim bültenlerini ve blog okunmalarını kontrol et.</p></div><button className="btn ghost" onClick={()=>{sessionStorage.removeItem("volleyballAdminToken");setToken("")}}>Güvenli çıkış</button></section>
    <div className="admin-grid">
      <section className="admin-panel video-admin"><header><span><small>VİDEO KONTROLÜ</small><h2>Sıralama ve kategori</h2></span><span className={`admin-autosave-state ${busy?"saving":""}`}><i/>{busy?"Kaydediliyor…":"Otomatik kayıt aktif"}</span></header><p className="admin-hint">Video görseline dokunarak ön izleyin. Başlık, kategori ve sıralama değişiklikleri otomatik kaydedilir.</p><div className="admin-category-filter"><button className={adminCategory==="Tümü"?"active":""} onClick={()=>setAdminCategory("Tümü")}><span>Tüm Videolar</span><b>{items.length}</b></button>{categoryCounts.map(({category,count})=><button key={category} className={adminCategory===category?"active":""} onClick={()=>setAdminCategory(category)}><span>{category}</span><b>{count}</b></button>)}</div>
        {previewVideo&&<div className="admin-video-player"><div><span><small>VİDEO ÖN İZLEMESİ</small><b>{previewVideo.title}</b></span><button onClick={()=>setPreviewVideo(null)} aria-label="Ön izlemeyi kapat">×</button></div><iframe src={previewVideo.preview} title={`${previewVideo.title} ön izlemesi`} allow="autoplay; fullscreen" allowFullScreen/></div>}
        <div className="admin-video-list">{visibleVideos.map(({video,index},visibleIndex)=><article key={video.id} draggable onDragStart={()=>setDragged(index)} onDragOver={(event)=>event.preventDefault()} onDrop={()=>{moveVideo(dragged,index);setDragged(null)}}><GripVertical/><button className="admin-video-thumb" onClick={()=>setPreviewVideo(video)} aria-label={`${video.title} videosunu ön izleyin`}><img src={video.thumbnail||video.fallback} alt={`${video.title} ön izleme görseli`} loading="lazy" onError={(event)=>{event.currentTarget.onerror=null;event.currentTarget.src=video.fallback||"/brand-logo.png"}}/><Play/></button><label className="admin-video-title"><small>#{String(visibleIndex+1).padStart(2,"0")} · VİDEO BAŞLIĞI</small><input value={video.title} maxLength="180" onChange={(event)=>updateVideo(index,{title:event.target.value})}/></label><select value={video.category} onChange={(event)=>updateVideo(index,{category:event.target.value})}>{categories.map((category)=><option key={category}>{category}</option>)}</select><div className="admin-move"><button onClick={()=>moveVisibleVideo(visibleIndex,-1)} aria-label="Yukarı taşı">↑</button><button onClick={()=>moveVisibleVideo(visibleIndex,1)} aria-label="Aşağı taşı">↓</button></div></article>)}</div>
      </section>
      <section className="admin-panel blog-admin"><header><span><small>BLOG ANALİZİ</small><h2>Okunma sayıları</h2></span><Eye/></header>{blogStats.length?<div className="admin-blog-list">{[...blogStats].sort((a,b)=>Number(b["Okunma Sayısı"]||0)-Number(a["Okunma Sayısı"]||0)).map((row)=><article key={row["Yazı ID"]}><span><b>{row["Başlık"]}</b><small>Son okunma: {row["Son Okunma"]||"—"}</small></span><strong>{row["Okunma Sayısı"]||0}<small>okunma</small></strong></article>)}</div>:<div className="admin-empty"><Eye/><b>Henüz okunma kaydı yok</b><p>Blog yazıları açıldıkça sayaç burada görünür.</p></div>}</section>
    </div>
    <section className="admin-panel bulletin-admin"><header><span><small>EĞİTİM BÜLTENLERİ</small><h2>Yayın planı ve içerik yönetimi</h2></span><span className={`admin-autosave-state ${bulletinBusy?"saving":""}`}><i/>{bulletinBusy?"Kaydediliyor…":"Otomatik kayıt aktif"}</span></header><p className="admin-hint">Taslak bültenler spor okullarına gösterilmez. “Yayınla” seçildiğinde okul sayfalarında görünür; başlık, tarih ve sıralama değişiklikleri otomatik kaydedilir.</p><div className="admin-bulletin-list">{bulletinItems.map((item,index)=>{const status=item.status||"published";const statusText=status==="published"?"Yayında":status==="draft"?"Taslak":"Silindi";return <article key={item.id} className={status==="published"?"":`unpublished ${status}`} draggable onDragStart={()=>setBulletinDragged(index)} onDragOver={(event)=>event.preventDefault()} onDrop={()=>{moveBulletin(bulletinDragged,index);setBulletinDragged(null)}}><GripVertical/><span className="admin-bulletin-number">{String(index+1).padStart(2,"0")}</span><label><small>BÜLTEN BAŞLIĞI</small><input value={item.title} maxLength="150" onChange={(event)=>updateBulletin(index,{title:event.target.value})}/></label><label className="admin-bulletin-date"><small>YAYIN TARİHİ</small><input type="date" value={item.date} onChange={(event)=>updateBulletin(index,{date:event.target.value})}/></label><span className={`admin-bulletin-status ${status}`}>{statusText}</span><div className="admin-bulletin-actions"><button onClick={()=>moveBulletin(index,index-1)} aria-label="Yukarı taşı">↑</button><button onClick={()=>moveBulletin(index,index+1)} aria-label="Aşağı taşı">↓</button>{status==="published"?<button className="draft" onClick={()=>updateBulletin(index,{status:"draft",published:false})}><FileText/> Taslağa al</button>:<button className="publish" onClick={()=>updateBulletin(index,{status:"published",published:true})}><CheckCircle2/> Yayınla</button>}{status==="deleted"?<button className="restore" onClick={()=>updateBulletin(index,{status:"draft",published:false})}><RotateCcw/> Geri al</button>:<button className="remove" onClick={()=>updateBulletin(index,{status:"deleted",published:false})}><X/> Sil</button>}</div></article>})}</div></section>
    {notice&&<div className="admin-notice">{notice}</div>}
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

const privacySections = [
  { id:"kapsam", title:"1. Politikanın kapsamı", icon:<ShieldCheck/>, content:<><p>Bu Gizlilik ve Kişisel Verilerin Korunması Politikası; <b>voleybolokullari.com.tr</b> alan adlı Online Voleybol Akademisi’nde okul, sporcu ve antrenör hesaplarının kullanımı sırasında işlenen verileri açıklar.</p><p>Platform yalnızca voleybol eğitim hizmeti sunar. Bu metin; kayıt, giriş, ders, eğitim videosu, sınav, kulüp profili, çevrim içi görünürlük ve iletişim işlemlerini kapsar.</p></> },
  { id:"veriler", title:"2. İşlenen kişisel veriler", icon:<Users/>, content:<><p>Hizmetin kullanılan bölümüne göre aşağıdaki sınırlı veriler işlenebilir:</p><ul><li><b>Spor okulu bilgileri:</b> okul adı, telefon numarası, okul kayıt kimliği, 6 haneli giriş kodu, onay durumu ve takım logosu.</li><li><b>Sporcu bilgileri:</b> kullanıcı adı, bağlı okul, profil görseli seçimi, profil kimliği, çevrim içi durumu ve son görülme zamanı.</li><li><b>Antrenör bilgileri:</b> ad veya kullanıcı adı, görev, bağlı okul, hesap durumu ve profil kimliği.</li><li><b>Eğitim kayıtları:</b> girilen sınavlar, puanlar, geçme durumu ve tamamlanma zamanı.</li><li><b>Teknik bilgiler:</b> oturumun devamını sağlayan tarayıcı kayıtları, güvenlik kontrolleri ve hata bilgileri.</li></ul><p>Platform, kayıt için gerekli olmayan sağlık verisi, ödeme kartı bilgisi veya hassas kimlik belgesi talep etmez.</p></> },
  { id:"amac", title:"3. Verilerin işlenme amaçları", icon:<Target/>, content:<><ul><li>Okul kayıt talebini almak ve yönetici onayını yürütmek.</li><li>Sporcu ve antrenörü doğru okul hesabıyla eşleştirmek.</li><li>Kulüp profilinde yalnızca o kulübe bağlı kişileri göstermek.</li><li>Ders, video ve sınav erişimini kayıtlı kullanıcılara sunmak.</li><li>Sınav sonuçlarını ve eğitim ilerlemesini ilgili kullanıcı ve okul bazında göstermek.</li><li>Oturum güvenliğini, kötüye kullanım önlemlerini ve sistem sürekliliğini sağlamak.</li><li>Kullanıcının başlattığı WhatsApp iletişimi için hazır mesaj oluşturmak.</li></ul></> },
  { id:"hukuk", title:"4. Hukuki sebepler ve toplama yöntemi", icon:<ClipboardCheck/>, content:<><p>Veriler; web formları, kullanıcı işlemleri, okul yöneticisinin veri güncellemeleri ve platformun teknik kayıt mekanizmaları aracılığıyla elektronik ortamda elde edilir.</p><p>İşleme faaliyetleri, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 5. maddesinde yer alan <b>bir sözleşmenin kurulması veya ifası, hukuki yükümlülük, bir hakkın tesisi veya korunması ve temel haklara zarar vermemek kaydıyla meşru menfaat</b> şartlarına dayanabilir. Açık rıza gereken ayrı bir işlem oluşursa rıza, aydınlatma metninden ayrı olarak alınır.</p></> },
  { id:"cocuklar", title:"5. Çocuk ve genç sporcuların verileri", icon:<Heart/>, content:<><p>Platformda çocuk veya genç sporcuların kullanıcı adı ve profil görseli bulunabilir. Sporcu kaydı, kulübün ilgili takım için oluşturduğu 6 haneli takım koduyla yapılır; kulüp giriş kodu sporcularla paylaşılmaz. Spor okulu, yaşa göre gerekli veli bilgilendirmesini ve iznini almaktan sorumludur.</p><p>Gerçek fotoğraf yerine sistem tarafından sunulan avatarların kullanılması önerilir. Çocuklardan açık adres, kimlik numarası, sağlık raporu veya okul dışı özel iletişim bilgileri istenmez. Veli veya yasal temsilci, çocuğa ait kaydın düzeltilmesini ya da kaldırılmasını talep edebilir.</p></> },
  { id:"aktarim", title:"6. Hizmet sağlayıcılar ve veri aktarımı", icon:<Share2/>, content:<><p>Veriler, hizmetin çalışması için gerekli olduğu ölçüde barındırma, veri tablosu ve otomasyon hizmeti sağlayıcılarının teknik altyapısında işlenebilir. Bu sağlayıcılara yalnızca hizmetin sunulması için gereken kapsamda erişim verilir.</p><p>WhatsApp bağlantısı, kullanıcı düğmeye bastığında açılır; mesajın alıcısını ve gönderimini kullanıcı kendisi belirler. Platform mesajı kullanıcı adına otomatik olarak göndermez. Yasal zorunluluk bulunmadıkça kişisel veriler reklam amacıyla satılmaz veya ilgisiz üçüncü kişilerle paylaşılmaz.</p></> },
  { id:"saklama", title:"7. Saklama, güvenlik ve silme", icon:<LockKeyhole/>, content:<><p>Kayıt verileri üyelik veya okul ilişkisi devam ettiği sürece; sınav ve işlem kayıtları hizmetin yürütülmesi ve olası uyuşmazlıkların yönetilmesi için gerekli makul süre boyunca saklanır. Süre sonunda veriler silinir, yok edilir veya kimliği belirlenemeyecek hale getirilir.</p><ul><li>Okullar birbirinden benzersiz okul kayıt kimliği ve koduyla ayrılır.</li><li>Sporcu ve antrenörler yalnızca bağlı oldukları okul sayfasında listelenir.</li><li>Yönetim işlemleri yetki kontrolüyle sınırlandırılır.</li><li>İstemci tarafında servis hesabı anahtarı veya özel sunucu parolası tutulmaz.</li></ul><p>İnternet üzerinden yapılan hiçbir aktarım yüzde yüz risksiz değildir; buna rağmen makul teknik ve idari tedbirler uygulanır.</p></> },
  { id:"oturum", title:"8. Çerezler ve tarayıcı depolaması", icon:<CircleDot/>, content:<><p>Platform; giriş oturumunu sürdürmek, seçilen profili hatırlamak, çevrim içi durumu yönetmek ve kullanıcı tercihlerini korumak için tarayıcının yerel ve oturum depolama alanlarını kullanabilir.</p><p>Bu kayıtlar ağırlıklı olarak zorunlu işlevler içindir. Tarayıcı ayarlarından silinebilir; ancak silinmeleri kullanıcının yeniden giriş yapmasını gerektirebilir. Üçüncü taraf ölçüm veya pazarlama çerezleri etkinleştirilirse kullanıcıya ayrıca bilgi verilir.</p></> },
  { id:"haklar", title:"9. KVKK kapsamındaki haklarınız", icon:<CheckCircle2/>, content:<><p>KVKK’nın 11. maddesi kapsamında kişisel verinizin işlenip işlenmediğini öğrenme; işlenmişse bilgi isteme; amacına uygun kullanılıp kullanılmadığını öğrenme; aktarılan üçüncü kişileri bilme; eksik veya yanlış verinin düzeltilmesini, şartları oluştuğunda silinmesini ya da yok edilmesini ve bu işlemlerin aktarım yapılan kişilere bildirilmesini isteme haklarına sahipsiniz.</p><p>Ayrıca verilerin yalnızca otomatik sistemlerle analiz edilmesi sonucunda aleyhinize bir durum oluşmasına itiraz edebilir ve hukuka aykırı işleme nedeniyle zarara uğramanız halinde giderim talep edebilirsiniz.</p></> },
  { id:"basvuru", title:"10. Başvuru ve iletişim", icon:<MessageCircle/>, content:<><p>Gizlilik, düzeltme veya silme taleplerinizde; ilgili okul adını, profil kimliğini ve talebinizi açıkça belirterek platform yönetimine ulaşabilirsiniz.</p><div className="privacy-contact"><span><small>VERİ SORUMLUSU / PLATFORM</small><b>Voleybol Okulları – Online Voleybol Akademisi</b></span><a href="https://wa.me/905557924758" target="_blank" rel="noreferrer"><MessageCircle/> 0555 792 47 58</a></div><p>Kimliğin doğrulanması için yalnızca talebi sonuçlandırmak üzere gerekli ek bilgiler istenebilir. Başvurular, yasal süreler içinde ücretsiz olarak değerlendirilir; işlemin ayrıca bir maliyet doğurması halinde mevzuattaki tarife uygulanabilir.</p></> },
  { id:"guncelleme", title:"11. Politika güncellemeleri", icon:<RotateCcw/>, content:<><p>Platformun özellikleri veya mevzuat değiştiğinde bu politika güncellenebilir. Güncel metin her zaman bu sayfada yayımlanır. Önemli değişiklikler, uygun olduğu ölçüde site içinde ayrıca duyurulur.</p><p><b>Son güncelleme:</b> 3 Ağustos 2026</p></> },
];

function PrivacyPage({ go }) {
  return <div className="privacy-page">
    <section className="privacy-hero"><div><span className="eyebrow"><ShieldCheck/> GİZLİLİK VE VERİ GÜVENLİĞİ</span><h1>Verileriniz sahadaki güven kadar önemlidir.</h1><p>Hangi bilgileri neden kullandığımızı, nasıl koruduğumuzu ve haklarınızı açık bir dille anlatıyoruz.</p><div className="privacy-hero-meta"><span><LockKeyhole/><b>KVKK odaklı</b></span><span><Users/><b>Okul bazlı ayrım</b></span><span><CheckCircle2/><b>Şeffaf kullanım</b></span></div></div><div className="privacy-shield"><ShieldCheck/><span>GÜVENLİ<br/>AKADEMİ</span></div></section>
    <div className="privacy-layout"><aside><small>İÇİNDEKİLER</small><nav>{privacySections.map((section)=><a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav><div><CircleHelp/><p>Verilerinizle ilgili bir sorunuz mu var?</p><button onClick={()=>go("contact")}>İletişime geç</button></div></aside><article className="privacy-content"><header><small>AYDINLATMA METNİ</small><h2>Gizlilik Politikası</h2><p>Bu metin, veri işleme faaliyetlerini anlaşılır ve erişilebilir biçimde açıklamak amacıyla hazırlanmıştır.</p></header>{privacySections.map((section)=><section id={section.id} key={section.id}><div className="privacy-section-icon">{section.icon}</div><div><h2>{section.title}</h2>{section.content}</div></section>)}</article></div>
  </div>;
}

const instructorProfiles = [
  {
    id:"kursat-bugra-karaoglan",
    name:"Kürşat Buğra Karaoğlan",
    image:"/instructors/kursat-bugra-karaoglan.webp",
    roles:["Beden Eğitimi ve Spor Öğretmeni","Vibe Coder","Sosyal Medya İçerik Sorumlusu"],
    summary:"Spor eğitimi, dijital içerik üretimi ve teknoloji odaklı geliştirme çalışmalarını aynı çatı altında buluşturur. Online Voleybol Akademisi’nin eğitim deneyimi ve dijital içerik süreçlerinde görev alır.",
    phone:"0555 792 47 58",
    whatsapp:"905557924758",
    linkedin:"https://www.linkedin.com/in/kursatbugrakaraoglan/",
    instagram:"https://www.instagram.com/spor.one1/",
  },
];

function CoachesPage() {
  return <div className="coaches-page">
    <section className="coaches-hero"><div><span className="eyebrow"><GraduationCap/> EĞİTMENLERİMİZ</span><h1>Bilgiyi, sporu ve teknolojiyi buluşturan ekip.</h1><p>Online Voleybol Akademisi’nin eğitim içeriklerini, dijital deneyimini ve iletişim çalışmalarını geliştiren uzmanlarla tanışın.</p><div className="coaches-hero-stats"><span><b>{instructorProfiles.length}</b><small>Aktif ekip üyesi</small></span><span><b>3</b><small>Uzmanlık alanı</small></span></div></div><div className="coaches-hero-mark"><GraduationCap/><span>UZMAN<br/>KADRO</span></div></section>
    <section className="coaches-directory"><header><div><small>AKADEMİ EKİBİ</small><h2>Eğitmen ve uzman profilleri</h2></div><p>Yeni ekip üyeleri eklendikçe bu alanda kendi uzmanlıkları ve iletişim bilgileriyle listelenecektir.</p></header>
      <div className="coach-grid">{instructorProfiles.map((coach)=><article className="coach-profile-card" key={coach.id}><div className="coach-photo"><img src={coach.image} alt={`${coach.name} profil fotoğrafı`}/><span><CircleDot/> Aktif ekip üyesi</span></div><div className="coach-profile-body"><small>BEDEN EĞİTİMİ · DİJİTAL GELİŞTİRME</small><h2>{coach.name}</h2><div className="coach-role-list">{coach.roles.map((role)=><span key={role}><CheckCircle2/>{role}</span>)}</div><p>{coach.summary}</p><div className="coach-contact"><a className="coach-whatsapp" href={`https://wa.me/${coach.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle/><span><small>İLETİŞİM</small><b>{coach.phone}</b></span></a><a href={coach.linkedin} target="_blank" rel="noreferrer" aria-label={`${coach.name} LinkedIn profili`}><Linkedin/><span>LinkedIn</span><ArrowRight/></a><a href={coach.instagram} target="_blank" rel="noreferrer" aria-label={`${coach.name} Instagram profili`}><Instagram/><span>Instagram</span><ArrowRight/></a></div></div></article>)}</div>
    </section>
  </div>;
}

function TechnicalCardsPage({ account }) {
  const [selected, setSelected] = useState(null);
  const technicalTriggerRef = useRef(null);
  const technicalCloseRef = useRef(null);
  const [category, setCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term=query.trim().toLocaleLowerCase("tr");
    return technicalCards.filter((card)=>(category==="Tümü"||card.category===category)&&(!term||card.title.toLocaleLowerCase("tr").includes(term)||card.category.toLocaleLowerCase("tr").includes(term)));
  },[category,query]);
  const docUrl=(id,mode="preview")=>`https://docs.google.com/document/d/${id}/${mode}`;
  const schoolName = account?.schoolName || account?.name || "Voleybol Akademisi";
  const shareCard = (card) => {
    const pdfUrl = `${docUrl(card.id,"export")}?format=pdf`;
    const message = `${schoolName} teknik kart paylaşımı\n\n${card.title}\nKategori: ${card.category}\n\nPDF dosyasını doğrudan indir:\n${pdfUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  const openPreview = (card,event) => { technicalTriggerRef.current=event.currentTarget; setSelected(card); };
  const closePreview = () => { setSelected(null); requestAnimationFrame(()=>technicalTriggerRef.current?.focus()); };
  useEffect(()=>{
    if(!selected)return;
    const previousOverflow=document.body.style.overflow;
    const onKeyDown=(event)=>{if(event.key==="Escape")closePreview()};
    document.body.style.overflow="hidden";
    document.addEventListener("keydown",onKeyDown);
    requestAnimationFrame(()=>technicalCloseRef.current?.focus());
    return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener("keydown",onKeyDown)};
  },[selected]);
  return <div className="technical-cards-page">
    <section className="technical-cards-hero"><div><span className="eyebrow"><FileText/> TEKNİK KART KÜTÜPHANESİ</span><h1>Tekniği incele,<br/><em>sahaya taşı.</em></h1><p>Voleybol hareketlerini tek sayfalık A4 eğitim kartlarıyla inceleyin; Word veya PDF biçiminde doğrudan indirin.</p><div><span><b>{technicalCards.length}</b><small>Teknik kart</small></span><span><b>A4</b><small>Tek sayfa düzeni</small></span><span><b>2</b><small>İndirme biçimi</small></span></div></div><div className="technical-paper-mark"><FileText/><b>A4</b><span>TEKNİK<br/>EĞİTİM KARTI</span></div></section>
    <section className="technical-library"><header><div><small>BELGE ARŞİVİ</small><h2>Tüm teknik kartlar</h2></div><label><Search/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Teknik kart ara" aria-label="Teknik kartlarda ara"/></label></header><nav>{technicalCardCategories.map((item)=><button key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>{item}<b>{item==="Tümü"?technicalCards.length:technicalCards.filter((card)=>card.category===item).length}</b></button>)}</nav>{filtered.length?<div className="technical-card-grid">{filtered.map((card)=><article key={card.id}><button className="technical-card-select" onClick={(event)=>openPreview(card,event)}><span className="technical-card-page"><FileText/><img src={card.image} alt={`${card.title} teknik kart çalışma görseli`} loading="lazy"/><i>{String(card.number).padStart(2,"0")}</i></span><span><small>{card.category}</small><h3>{card.title}</h3><em>Ön izlemeyi aç <Eye/></em></span></button><div className="technical-card-actions"><a href={`${docUrl(card.id,"export")}?format=docx`} aria-label={`${card.title} Word belgesini indir`}><Download/> Word</a><a href={`${docUrl(card.id,"export")}?format=pdf`} aria-label={`${card.title} PDF belgesini indir`}><Download/> PDF</a><button type="button" onClick={()=>shareCard(card)} aria-label={`${card.title} kartını WhatsApp ile paylaş`}><MessageCircle/> WhatsApp</button></div></article>)}</div>:<div className="technical-empty"><Search/><h3>Teknik kart bulunamadı</h3><p>Arama kelimesini veya kategoriyi değiştirin.</p><button onClick={()=>{setQuery("");setCategory("Tümü")}}>Filtreleri temizle</button></div>}</section>
    {selected&&<div className="technical-preview-modal" role="dialog" aria-modal="true" aria-label={`${selected.title} ön izlemesi`} onMouseDown={(event)=>{if(event.target===event.currentTarget)closePreview()}}><section><header><span><small>TEKNİK KART ÖN İZLEMESİ</small><h2>{selected.title}</h2><p>{selected.category} · Kart {String(selected.number).padStart(2,"0")}</p></span><button ref={technicalCloseRef} type="button" onClick={closePreview} aria-label="Ön izlemeyi kapat"><X/></button></header><div className="technical-modal-document"><img key={selected.id} src={selected.image} alt={`${selected.title} teknik kart ön izlemesi`}/></div><footer><a href={`${docUrl(selected.id,"export")}?format=docx`}><Download/> Word İndir</a><a href={`${docUrl(selected.id,"export")}?format=pdf`}><Download/> PDF İndir</a><button type="button" onClick={()=>shareCard(selected)}><MessageCircle/> WhatsApp ile Paylaş</button></footer></section></div>}
  </div>;
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
  const [courseOpen, setCourseOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  let xs = [
    ["home", Home, "Ana Sayfa"],
    ["courses", BookOpen, "Dersler"],
    ["videos", Video, "Videolar"],
    ["exams", CheckCircle2, "Sınavlar"],
    ["junior-referee", Flag, "Junior Hakem"],
    ["blog", Newspaper, "Blog"],
    ["notebooklm-ai", MessageCircle, "Voleybol AI"],
    ["chat", MessageCircle, "Sohbet"],
    ["demo", Play, "Demo"],
    ["pricing", BadgeTurkishLira, "Ücretler"],
    ["register", UserPlus, "Kayıt"],
    ["profiles", Users, isAuthenticated ? "Hesabım" : "Giriş Yap"],
  ];
  if (!isAuthenticated) xs = xs.filter(([key]) => ["home", "junior-referee", "blog", "notebooklm-ai", "demo", "pricing", "register", "profiles"].includes(key));
  if (isAuthenticated) xs = xs.filter(([key]) => !["demo", "pricing", "register"].includes(key));
  const primaryKeys = isAuthenticated
    ? ["home", "courses", "videos", "exams", "profiles"]
    : ["home", "junior-referee", "blog", "register", "profiles"];
  const primaryItems = xs.filter(([key]) => primaryKeys.includes(key));
  const secondaryItems = xs.filter(([key]) => !primaryKeys.includes(key));
  const openPage = (key) => {
    setMoreOpen(false);
    if (key === "courses") setCourseOpen((value)=>!value);
    else go(key);
  };
  return (
    <>
      {courseOpen&&<button className="mobile-course-backdrop" type="button" aria-label="Dersler alt menüsünü kapat" onClick={()=>setCourseOpen(false)}/>}
      {courseOpen&&<section className="mobile-course-menu" aria-label="Dersler alt menüsü"><header><span><small>DERSLER</small><b>Eğitim alanını seç</b></span><button type="button" onClick={()=>setCourseOpen(false)} aria-label="Dersler alt menüsünü kapat"><X/></button></header><button type="button" onClick={()=>{setCourseOpen(false);go("courses")}}><BookOpen/><span><b>Tüm Dersler</b><small>Voleybol eğitim kütüphanesi</small></span><ArrowRight/></button><button type="button" onClick={()=>{setCourseOpen(false);go("technical-cards")}}><FileText/><span><b>Teknik Kartlar</b><small>Görsel, Word ve PDF çalışma kartları</small></span><ArrowRight/></button></section>}
      {moreOpen&&<button className="mobile-course-backdrop" type="button" aria-label="Diğer menüyü kapat" onClick={()=>setMoreOpen(false)}/>}
      {moreOpen&&<section className="mobile-more-menu" aria-label="Diğer sayfalar"><header><span><small>MENÜ</small><b>Diğer bölümler</b></span><button type="button" onClick={()=>setMoreOpen(false)} aria-label="Diğer menüyü kapat"><X/></button></header><div>{secondaryItems.map(([key,Icon,title])=><button type="button" key={key} onClick={()=>openPage(key)}><Icon/><span>{title}</span><ArrowRight/></button>)}</div></section>}
      <nav className="mobile-nav">
      {primaryItems.map(([k, I, t]) => (
        <button
          className={(page === k || (k==="courses"&&["course","lesson","technical-cards"].includes(page))) ? "active" : ""}
          onClick={() => openPage(k)}
          key={k}
          aria-expanded={k === "courses" ? courseOpen : undefined}
        >
          <I />
          <span>{t}</span>
        </button>
      ))}
      {secondaryItems.length>0&&<button className={moreOpen?"active":""} onClick={()=>{setCourseOpen(false);setMoreOpen((value)=>!value)}} aria-expanded={moreOpen}><Menu/><span>Menü</span></button>}
      </nav>
    </>
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
      <div className="junior-referee-visual"><img src="/junior-referees.webp" alt="Voleybol hakemi kıyafetli bir kız ve bir erkek çocuk"/></div>
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
function ContactMessenger() {
  const [open,setOpen]=useState(false);
  const [name,setName]=useState("");
  const [message,setMessage]=useState("");
  const sendMessage=(event)=>{
    event.preventDefault();
    const text=`Merhaba, ben ${name.trim() || "bir ziyaretçiyim"}. ${message.trim()}`;
    window.open(`https://wa.me/905557924758?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");
  };
  return <aside className={`contact-messenger ${open?"open":""}`} aria-label="İletişim paneli">
    {open&&<div className="contact-messenger-panel">
      <header><span><i/><small>ÇEVRİM İÇİ DESTEK</small><b>Nasıl yardımcı olabiliriz?</b></span><button onClick={()=>setOpen(false)} aria-label="Mesaj panelini kapat"><X/></button></header>
      <p>Mesajınızı yazın, WhatsApp üzerinden doğrudan iletişime geçelim.</p>
      <div className="contact-message-topics">{["Kayıt","Dersler","Teknik destek"].map((topic)=><button key={topic} onClick={()=>setMessage(`${topic} hakkında bilgi almak istiyorum.`)}>{topic}</button>)}</div>
      <form onSubmit={sendMessage}><label>Adınız<input value={name} onChange={(event)=>setName(event.target.value)} placeholder="Adınızı yazın"/></label><label>Mesajınız<textarea required value={message} onChange={(event)=>setMessage(event.target.value)} placeholder="Size nasıl yardımcı olabiliriz?" rows="3"/></label><button className="contact-send" type="submit"><MessageCircle/> WhatsApp ile gönder <ArrowRight/></button></form>
      <small className="contact-privacy"><ShieldCheck/> Bilgileriniz web sitesinde saklanmaz.</small>
    </div>}
    <button className="contact-messenger-trigger" onClick={()=>setOpen((value)=>!value)} aria-expanded={open}><span><MessageCircle/></span><i><b>İletişim</b><small>Çevrim içi destek</small></i></button>
  </aside>;
}
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="footer-brand-block">
        <div className="brand inverse">
          <img className="ball" src="/brand-logo-transparent.png" alt="" aria-hidden="true" />
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
        <button onClick={() => go("faq")}>Sık Sorulan Sorular</button>
        <button onClick={() => go("help")}>Yardım merkezi</button>
        <button onClick={() => go("contact")}>İletişim</button>
        <button onClick={() => go("privacy")}>Gizlilik</button>
        <button className="footer-admin-link" onClick={() => go("admin")}><ShieldCheck/> Yönetici</button>
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
initAnalytics();
registerPwa();
const appRoot = rootElement.__reactRoot || createRoot(rootElement);
rootElement.__reactRoot = appRoot;
appRoot.render(<App />);
