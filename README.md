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

## Bireysel kullanıcı hesabı

Kayıt ve giriş artık yalnız bireysel kullanıcılar içindir. Kayıt formu yalnız @ kullanıcı adı ister; telefon, okul, takım ve rol alanları yoktur. Sunucu her kullanıcı için rastgele 128 bit biçiminde bir giriş kodu üretir, yalnız bir kez yanıtta gösterir ve yalnız tuzlanmış SHA-256 özetini saklar. Giriş kodu tarayıcı depolamasına veya kaynak koduna yazılmaz.

- Özel hesap tablosu: `Kullanici Kayitlari`; herkese açık GET ile okunamaz.
- `registerUser`, `profileLogin`, `validateProfileSession`, `logoutProfile` bireysel akışı sağlar. Başarısız girişler kullanıcı adına göre sınırlandırılır. Profil oturumu 15 dakikadır.
- Okul/sporcu/antrenör kayıtları, takım yönetimi ve atama uç noktaları kapalıdır. Önceki rol oturumları kabul edilmez. Sınav geçmişi oturum sahibine göre sunucuda süzülür.
- Yönetici PIN, Script Properties ve yönetici API yetkileri korunur. Kullanıcı belirteçleri yönetici API'lerine erişemez.

### Yayın ve veri geçişi sırası

1. `npm test`, `npm run build`, `npm run check` ve mobil/masaüstü kontrolünü çalıştırın.
2. Doğrulanmış bağlı Apps Script projesinde `apps-script/Code.gs` dosyasını güncelleyin. Mevcut dağıtımda yeni sürüm kullanın; dağıtım kimliği ve URL aynı kalsın. Yönetici kodu üretme işlevini çalıştırmayın. İzinleri genişletmeyin.
3. Eski kayıt/atama API'lerinin kapalı olduğunu ve yönetici oturumunun çalıştığını doğrulayın. Veri silme ayrı, açıkça yetkilendirilmiş bir işlemdir; kod yayını veri silmez.
4. Yalnız doğrulanan eski okul, sporcu, antrenör ve takım satırlarını temizleyin; beklenmedik yeni veri varsa durun. Öğrenci yedeği üretmeyin. Ayrı yıllık plan dosyalarını silmeyin; eski bağlantıları kaldırırken bu dosyaları koruyun.
5. GitHub Pages'in mevcut `main` iş akışıyla ön yüzü yayınlayın. Canlı Kayıt, Giriş ve Yönetici ekranlarını doğrulayın.

Testler Apps Script işlevlerini bellek içi tablo/önbellekle çalıştırır; üretim hesabı veya üretim verisi oluşturmaz. `npm run check` var olan büyük ders görselleri nedeniyle başarısız olursa bu sınırı ayrıca raporlayın; ilgisiz görselleri değiştirmeyin.
