# Online Voleybol Akademisi

Voleybolcular, antrenörler ve yeni başlayanlar için mobil öncelikli Türkçe eğitim platformu. İlk sürüm; ana sayfa, kurs kataloğu, sporcu paneli, antrenman planı ve performans ekranını çalışır demo verileriyle içerir.

## Kurulum

1. Node.js 20+ kurun.
2. `npm install`
3. `.env.example` dosyasını `.env` olarak kopyalayın.
4. `npm run dev`

Üretim kontrolü: `npm run build` ve `npm run preview`.

## Google Sheets bağlantısı

Ders içerikleri, ders adıyla eşleşen sekmeden okunur. Güncel bağlantıda `Parmak pas`, `Voleybola giriş ve temel kurallar` ve `Manşet` sekmeleri desteklenir. Her sekmede `açıklama`, `DERSİN KAZANIMLARI`, `1. BAŞLANGIÇ SEVİYESİ`, `2. ORTA SEVİYE`, `3. İLERİ SEVİYE`, teknik hata ve antrenman programı alanları kullanılabilir. Boş veya silinen hücreler ders listesine alınmaz; yeni dolu başlıklar sayfa yenilendiğinde otomatik gösterilir.

`docs/google-sheets-template.csv` başlıklarını kullanarak README içindeki sekmeleri oluşturun. `apps-script/Code.gs` kodunu bağlı Apps Script projesine ekleyin; Web App olarak dağıtın ve URL'yi `VITE_SHEETS_API_URL` değişkenine girin. İstemci yalnızca izinli sekmeleri okur. Kullanıcı e-postaları gibi kişisel verileri herkese açık dağıtıma dahil etmeyin. Yazma işlemleri için kimlik doğrulamalı ayrı bir sunucu uç noktası kullanın.

API yoksa arayüz otomatik olarak gerçek kişilere ait olmayan demo verilerini gösterir.

## GitHub Pages

Depoyu GitHub'a gönderin. Settings → Pages → Source alanında **GitHub Actions** seçin. İsteğe bağlı API adresini repository secret olarak `VITE_SHEETS_API_URL` adıyla tanımlayın. `main` dalına gönderimden sonra workflow derler ve yayınlar. Uygulama istemci tarafında tek görünüm yönlendirmesi kullandığı için sayfa yenilemede 404 üretmez.

## Kontrol listesi

- Telefon, tablet ve masaüstü düzenleri
- Klavye focus durumları, görünür etiketler ve alt metinler
- Kurs arama ve seviye filtreleri
- Demo veri durumu ve boş sonuç ekranı
- Kritik konsol/build hatası bulunmaması
- Google Sheets erişimi yokken güvenli demo görünümü
- GitHub Pages üretim derlemesi

Detaylı veri alanları `docs/google-sheets-template.csv` dosyasındadır.

## Okul ve sporcu kayıt sistemi

`apps-script/Code.gs` dosyasını **Voleybol Akademisi - Okul ve Sporcu Kayıtları** Google Sheet'ine bağlı Apps Script projesine ekleyip Web App olarak yayınlayın. Oluşan `/exec` adresini `.env` içinde `VITE_REGISTRATION_API_URL` değerine yazın.

- Okul başvuruları `Okul Kayitlari` sekmesine `BEKLİYOR` olarak eklenir.
- Yönetici `Onay Durumu` hücresini `ONAYLANDI` yaptığında WhatsApp mesaj bağlantısı hazırlanır.
- Sporcu kaydı yalnızca okul adı, 6 haneli kod ve `ONAYLANDI` durumu eşleştiğinde kabul edilir.
- Tam otomatik WhatsApp gönderimi için ayrıca WhatsApp Business API gerekir; mevcut sürüm yöneticinin tıklayacağı hazır mesaj bağlantısını üretir.

Canlı kayıt API adresi `src/config.js` dosyasında tutulur. Apps Script yeniden dağıtılırsa yalnızca bu dosyadaki `registrationApiUrl` değeri güncellenmelidir.

Web uygulaması `Okul Kayitlari`, `Sporcu Kayitlari` ve `Antrenor Kayitlari` sekmelerini açılışta, pencere yeniden odaklandığında ve düzenli aralıklarla önbelleksiz olarak yeniler. Antrenör kayıtlarında `Antrenör ID`, `Okul Kayıt ID`, `Okul Adı`, `Okul Kodu`, `Antrenör Adı`, `Görev`, `Takım Logosu (Manuel)`, `Durum` ve `Kayıt Tarihi` başlıkları kullanılır. Yalnızca `AKTİF` durumundaki ve kulüp adı/kodu eşleşen antrenörler giriş yapabilir.
