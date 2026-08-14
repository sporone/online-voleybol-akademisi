import fs from "node:fs";
import path from "node:path";

const site = "https://voleybolokullari.com.tr";
const blogPages = [
  ["/voleybol-blog/", "Voleybol Blog | Eğitim, Teknik ve Spor Okulları", "Voleybol eğitimi, temel teknikler, yaş grupları, spor okulları ve online dersler hakkında kapsamlı Türkçe rehberler."],
  ["/voleybol-blog/voleybol-egitimleri-rehberi/", "Voleybol Eğitimleri: Temelden İleri Seviyeye Rehber", "Teknik, taktik, fiziksel ve zihinsel gelişimi birlikte planlayan kapsamlı voleybol eğitimi rehberi."],
  ["/voleybol-blog/baslangic-orta-ileri-seviye-voleybol/", "Başlangıç, Orta ve İleri Seviye Voleybol Dersleri", "Voleybol seviyelerine göre öğrenme hedefleri, teknik öncelikler ve bir üst aşamaya geçiş ölçütleri."],
  ["/voleybol-blog/parmak-pas-manset-servis-smac-blok/", "Parmak Pas, Manşet, Servis, Smaç ve Blok Rehberi", "Voleybolun beş temel tekniğini doğru uygulama sırası, yaygın hatalar ve çalışma önerileriyle öğrenin."],
  ["/voleybol-blog/online-voleybol-egitimi-nasil-calisir/", "Online Voleybol Eğitimi Nasıl Çalışır?", "Ders, video, sınav ve saha uygulamasını birleştiren online voleybol eğitim sistemini keşfedin."],
  ["/voleybol-blog/voleybol-egitimine-kimler-katilabilir/", "Voleybol Eğitimine Kimler Katılabilir?", "Çocuklar, yeni başlayanlar, aktif sporcular ve antrenörler için uygun voleybol eğitim yolları."],
  ["/voleybol-blog/voleybol-yas-gruplari/", "Voleybol Yaş Grupları ve Yaşa Uygun Eğitim", "Çocukluk, ergenlik ve yetişkinlik dönemlerinde güvenli ve etkili voleybol eğitimi yaklaşımı."],
  ["/voleybol-blog/voleybol-antrenoru-ve-uzman-secimi/", "Voleybol Antrenörü ve Uzman Seçimi", "Eğitim, deneyim, iletişim ve güvenlik açısından doğru voleybol antrenörünü değerlendirme rehberi."],
  ["/voleybol-blog/voleybol-egitimi-sik-sorulan-sorular/", "Voleybol Eğitimi Sık Sorulan Sorular", "Başlama yaşı, ekipman, antrenman sıklığı ve online eğitim hakkında sık sorulan soruların yanıtları."],
  ["/voleybol-blog/uyelik-ve-egitim-sistemi/", "Online Voleybol Akademisi Üyelik ve Eğitim Sistemi", "Spor okulu kaydı, kullanıcı erişimi, dersler, videolar ve sınav sisteminin işleyişi."],
  ["/voleybol-blog/istanbul-ilce-voleybol-okullari/", "İstanbul ve İlçe Bazlı Voleybol Spor Okulları", "Ataşehir ve İstanbul ilçelerinde voleybol spor okulu seçerken değerlendirilecek önemli ölçütler."],
  ["/voleybol-blog/voleybol-terimleri-sozlugu/", "Voleybol Terimleri Sözlüğü", "Rotasyon, ralli, side-out, libero, pipe ve sık kullanılan diğer voleybol kavramlarının anlamları."],
];
const pages = [
  ["/", "Online Voleybol Akademisi | Voleybol Okulları", "Voleybolcular ve spor okulları için çevrim içi voleybol eğitim platformu.", true],
  ["/voleybol-dersleri/", "Voleybol Dersleri ve Eğitim Programları", "Başlangıçtan ileri seviyeye teknik, taktik ve performans odaklı voleybol dersleri.", false],
  ["/junior-hakem/", "Junior Hakem Akademisi", "Gençler için voleybol kuralları, örnek olaylar ve hakemlik eğitimleri."],
  ["/kayitli-spor-okullari/", "Kayıtlı Voleybol Spor Okulları", "Akademiye kayıtlı voleybol spor okullarını inceleyin."],
  ["/ucretler/", "Voleybol Akademisi Üyelik Ücretleri", "Sınırsız öğrenci erişimli üyelik seçenekleri."],
  ["/kayit/", "Spor Okulu ve Sporcu Kaydı", "Spor okulunuzu kaydedin veya sporcu profilinizi oluşturun."],
  ["/giris/", "Spor Okulu, Sporcu ve Antrenör Girişi", "Spor okulu, sporcu veya antrenör hesabınızla Online Voleybol Akademisine giriş yapın.", false],
  ["/demo/", "Online Voleybol Akademisi Demo", "Akademinin ders, video ve sınav modüllerini inceleyin."],
  ["/online-akademi/ai-asistan/", "Voleybol AI Asistanı | Online Voleybol Akademisi", "Voleybol teknikleri, kurallar ve eğitim içerikleri hakkında AI destekli çalışma alanımızdan yararlanın."],
  ["/hakkimizda/", "Hakkımızda | Online Voleybol Akademisi", "Online Voleybol Akademisinin amacı ve eğitim yaklaşımı."],
  ["/iletisim/", "İletişim | Online Voleybol Akademisi", "Online Voleybol Akademisi ile iletişime geçin."],
  ["/gizlilik-politikasi/", "Gizlilik Politikası | Voleybol Akademisi", "Online Voleybol Akademisi gizlilik politikası."],
  ["/sik-sorulan-sorular/", "Sık Sorulan Sorular | Online Voleybol Akademisi", "Spor okulu ve sporcu kaydı, giriş, voleybol dersleri, eğitim videoları, sınavlar ve üyelik hakkında ayrıntılı yanıtlar."],
  ...blogPages,
];
const dist = path.resolve("dist");
const baseHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (v) => v.replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
for (const [route, title, description, indexable = true] of pages) {
  const canonical = `${site}${route === "/" ? "/" : route}`;
  const html = baseHtml.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}"/>`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(description)}"/>`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}"/>`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${esc(title)}"/>`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(description)}"/>`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${indexable ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,nofollow"}"/>`);
  const finalHtml = html.replace(/<meta name="googlebot" content="[^"]*"\s*\/>/, `<meta name="googlebot" content="${indexable ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,nofollow"}"/>`);
  if (route === "/") fs.writeFileSync(path.join(dist, "index.html"), finalHtml);
  else { const dir = path.join(dist, route.slice(1)); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, "index.html"), finalHtml); }
}
const now = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((page) => page[3] !== false).map(([r]) => `  <url><loc>${site}${r === "/" ? "/" : r}</loc><lastmod>${now}</lastmod></url>`).join("\n")}\n</urlset>\n`);
