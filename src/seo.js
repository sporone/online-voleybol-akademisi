export const SITE_URL = "https://voleybolokullari.com.tr";

export const pageRoutes = {
  home: "/", courses: "/voleybol-dersleri", videos: "/egitim-videolari",
  exams: "/sinavlar", "junior-referee": "/junior-hakem", demo: "/demo",
  pricing: "/ucretler", register: "/kayit", "registered-schools": "/kayitli-spor-okullari",
  profiles: "/giris", about: "/hakkimizda", contact: "/iletisim",
  privacy: "/gizlilik-politikasi", help: "/yardim-merkezi",
  coaches: "/egitmenler", live: "/canli-dersler",
};

export const routePages = Object.fromEntries(Object.entries(pageRoutes).map(([page, route]) => [route, page]));

export const slugifyTr = (value = "") => value.toLocaleLowerCase("tr-TR").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/ğ/g, "g")
  .replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const routeFor = (page, course) => {
  if (page === "course" && course) return `/voleybol-dersleri/${slugifyTr(course[1])}`;
  if (page === "lesson" && course) return `/voleybol-dersleri/${slugifyTr(course[1])}/egitim`;
  return pageRoutes[page] || `/${slugifyTr(page)}`;
};

export const resolveRoute = (pathname, courses) => {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  const lessonMatch = path.match(/^\/voleybol-dersleri\/([^/]+)\/egitim$/);
  const courseMatch = path.match(/^\/voleybol-dersleri\/([^/]+)$/);
  const match = lessonMatch || courseMatch;
  if (match) {
    const course = courses.find((item) => slugifyTr(item[1]) === match[1]);
    if (course) return { page: lessonMatch ? "lesson" : "course", course };
  }
  return { page: routePages[path] || "home", course: null };
};

const metaByPage = {
  home: ["Online Voleybol Akademisi | Voleybol Okulları", "Voleybolcular ve spor okulları için teknik, taktik, mental hazırlık ve performans odaklı çevrim içi eğitim platformu."],
  courses: ["Voleybol Dersleri ve Eğitim Programları", "Parmak pas, manşet, servis, smaç, blok, pozisyon ve performans konularında başlangıçtan ileri seviyeye voleybol dersleri."],
  videos: ["Voleybol Eğitim Videoları", "Voleybol tekniklerini hareket örnekleriyle öğrenebileceğiniz mobil uyumlu eğitim video kütüphanesi."],
  exams: ["Voleybol Sınavları ve Değerlendirmeler", "Voleybol derslerine göre hazırlanmış çoktan seçmeli sınavlarla bilgilerinizi ölçün."],
  "junior-referee": ["Junior Hakem Akademisi | Voleybol Hakemliği", "Gençler için voleybol kuralları, örnek olaylar, hakem kararları ve gözlemci görevleri eğitim alanı."],
  pricing: ["Voleybol Akademisi Üyelik Ücretleri", "Sınırsız öğrenci erişimli aylık ve yıllık üyelik seçeneklerini inceleyin."],
  register: ["Spor Okulu ve Sporcu Kaydı", "Voleybol spor okulunuzu akademiye kaydedin veya onaylı okul kodunuzla sporcu profilinizi oluşturun."],
  "registered-schools": ["Kayıtlı Voleybol Spor Okulları", "Online Voleybol Akademisine kayıtlı spor okullarını isimleri ve kulüp logolarıyla inceleyin."],
  profiles: ["Voleybol Akademisi Giriş", "Kayıtlı spor okulu veya sporcu hesabınızla Online Voleybol Akademisine giriş yapın."],
  demo: ["Online Voleybol Akademisi Demo", "Ders, eğitim videosu ve sınav modüllerinin örnek kullanımını inceleyin."],
};

export function seoFor(page, course) {
  if ((page === "course" || page === "lesson") && course) return {
    title: `${course[1]} ${page === "lesson" ? "Eğitimi" : "Dersi"} | Online Voleybol Akademisi`,
    description: course[2] || `${course[1]} konusunda ayrıntılı voleybol eğitimi.`,
    path: routeFor(page, course), noindex: true,
  };
  const [title, description] = metaByPage[page] || [`${String(page).replace(/-/g, " ")} | Voleybol Akademisi`, "Online Voleybol Akademisi bilgi sayfası."];
  return { title, description, path: routeFor(page), noindex: ["profiles", "exams", "videos", "courses"].includes(page) };
}
