const phases = [
  { name:"Sezon Öncesi Hazırlık", focus:"Yeni sezona sağlıklı, düzenli ve bilinçli başla" },
  { name:"İlk Devre Gelişimi", focus:"Antrenman alışkanlıklarını güçlendir ve takım düzenine uyum sağla" },
  { name:"Sezon İçi Performans", focus:"Yoğun dönemde performansını, enerjini ve motivasyonunu koru" },
  { name:"Sezon Sonu ve Geçiş", focus:"Gelişimini değerlendir, toparlan ve yeni hedefler oluştur" },
];

const weeklyTitles = [
  "Yeni sezona hazırlanıyorum", "Sezon hedeflerimi belirliyorum", "Kamp çantam ve kişisel hazırlığım", "Kamp döneminde günlük düzen",
  "Antrenman disiplinine uyum", "Uyku düzeni ve dinlenme", "Vücudumu antrenmana hazırlıyorum", "Takım arkadaşlarımla güven oluşturuyorum",
  "Antrenördeki yönergeleri doğru uygulama", "Sağlıklı sporcu alışkanlıkları", "Okul ve antrenman dengesini kurma", "İlk dönem motivasyonumu koruma", "Sezon öncesi gelişim kontrolü",
  "Antrenman öncesi doğru beslenme", "Antrenman sonrası toparlanma", "Su tüketimi ve sıvı dengesi", "Antrenmanda odaklanma",
  "Hata yaptıktan sonra oyuna dönme", "Takım iletişimi ve olumlu dil", "Maç haftasına hazırlanma", "Maç günü çantası ve sorumluluklar",
  "Yedek oyuncuyken hazır kalma", "Kazanırken ve kaybederken sporculuk", "Antrenman yoğunluğunu yönetme", "Kış döneminde bağışıklığı koruma", "İlk devre gelişim değerlendirmesi",
  "İkinci devreye güçlü başlangıç", "Yoğun haftalarda enerji yönetimi", "Maç öncesi heyecanı yönetme", "Baskı altında sakin kalma",
  "Özgüvenimi sağlıklı geliştirme", "Takım içindeki rolümü benimseme", "Antrenman kalitesini yükseltme", "Kas yorgunluğunu doğru tanıma",
  "Sakatlık belirtilerini önemseme", "Deplasman ve yolculuk hazırlığı", "Turnuva gününde beslenme", "Zorlu maçtan sonra toparlanma", "Sezon içi performans kontrolü",
  "Sezonun son bölümüne hazırlanma", "Yorgunken doğru karar verme", "Motivasyon düştüğünde yeniden başlama", "Takım hedeflerine katkı sağlama",
  "Sezon sonu maçlarına zihinsel hazırlık", "Kişisel gelişimimi değerlendirme", "Antrenör geri bildirimini kullanma", "Sezon sonrası aktif dinlenme",
  "Geçiş döneminde beslenme", "Yeni sezon için bireysel hedefler", "Yaz döneminde voleybolla bağımı koruma", "Kamp öncesi yeniden hazırlık", "Bir sezonun sporcu günlüğü",
];

const preTraining = [
  "Antrenmandan 10–15 dakika önce salonda ol. Malzemelerini kontrol et, kısa bir zihinsel hazırlık yap ve ısınmaya zamanında katıl.",
  "Antrenmana çok aç ya da aşırı tok gelme. Son ana bırakmadan hafif bir öğün planla ve su şişeni yanında bulundur.",
  "O günkü enerji ve ağrı durumunu kontrol et. Olağan dışı bir ağrı veya rahatsızlık varsa çalışmaya başlamadan önce antrenörüne bildir.",
  "Telefonunu ve dikkat dağıtan eşyalarını kaldır. Bugünkü antrenman için tek, ölçülebilir bir gelişim hedefi seç.",
];
const postTraining = [
  "Antrenman biter bitmez aniden durma. Hafif hareket, kontrollü nefes ve antrenörün verdiği soğuma çalışmalarıyla vücudunu dinlenmeye geçir.",
  "Terli kıyafetlerini değiştir, sıvı kaybını tamamla ve ilk uygun zamanda dengeli bir toparlanma öğünü tüket.",
  "Çalışmadan sonra kendine üç soru sor: Bugün neyi iyi yaptım, nerede zorlandım, bir sonraki çalışmada neyi geliştireceğim?",
  "Ekipmanlarını düzenle, salonu temiz bırak ve ertesi günün uyku-dinlenme planını antrenman yoğunluğuna göre oluştur.",
];
const psychology = [
  "Gelişim her antrenmanda aynı hızda olmaz. Sonuca değil doğru alışkanlığı düzenli tekrar etmeye odaklan.",
  "Hata yaptığında kısa bir nefes al, hatadan çıkaracağın tek dersi belirle ve dikkatini hemen sıradaki topa ver.",
  "Kendinle konuşurken bir takım arkadaşına konuşur gibi yapıcı ol. ‘Yapamıyorum’ yerine ‘Doğru tekrarlarla geliştirebilirim’ de.",
  "Kontrol edebildiğin alanlara odaklan: hazırlığın, çaban, iletişimin ve bir sonraki harekete verdiğin tepki.",
];
const nutrition = [
  "Gün boyunca düzenli su iç. Susamayı beklemek yerine kişisel şişeni kullan ve antrenman öncesi idrar renginin açık olmasını hedefle.",
  "Ana öğünlerinde karbonhidrat, kaliteli protein, sebze-meyve ve sağlıklı yağlara yer ver. Tek bir besin grubuyla performans bekleme.",
  "Antrenman öncesinde sindirimi kolay, alışık olduğun besinleri tercih et. İlk kez deneyeceğin ürünleri maç gününe bırakma.",
  "Toparlanma için antrenman sonrasında sıvı, karbonhidrat ve protein içeren dengeli bir öğün planla; gereksiz takviyeleri uzman önerisi olmadan kullanma.",
];
const tips = [
  "Kaliteli tekrar sayısı, kontrolsüz çok tekrardan değerlidir. Hareket bozulduğunda hızını azalt ve doğru biçimi yeniden kur.",
  "Antrenör konuşurken top sektirme; göz teması kur, yönergeyi dinle ve anlamadığın noktayı doğru zamanda sor.",
  "Her çalışmada takım arkadaşınla net ve olumlu iletişim kur. Sahadaki sessizlik kararsızlığı artırır.",
  "Yorgunluk yükseldiğinde tekniği korumaya odaklan. Keskin ağrıda çalışmayı sürdürme ve durumu antrenörüne bildir.",
];
const rules = [
  "Takı, saat ve sakatlanma riski taşıyan aksesuarlarla antrenmana çıkma; uygun ayakkabı ve dizlik kullan.",
  "Salona, takım arkadaşlarına, rakibe ve görev yapan personele saygılı davran. Sporculuk davranışı skor tabelasından bağımsızdır.",
  "İzinsiz egzersiz veya ek ağırlık uygulama. Yaşına ve gelişim düzeyine uygun program için antrenörünün planını izle.",
  "Antrenmana katılamayacaksan kulübünün iletişim kuralına göre önceden haber ver; düzenli katılım gelişimin temelidir.",
];
const advice = [
  "Bu hafta bir güçlü yönünü ve geliştirmek istediğin bir alışkanlığı sporcu günlüğüne yaz.",
  "Bir takım arkadaşına somut ve olumlu geri bildirim ver; takımın gelişimine sözlerinle de katkı sağla.",
  "Her antrenman sonunda kendine 1–5 arasında odaklanma puanı ver ve puanının nedenini tek cümleyle açıkla.",
  "Kendini başka sporcularla değil, geçen haftaki halinle karşılaştır. Küçük ama sürekli ilerlemeyi takip et.",
];

const phaseGuidance = [
  "Bu dönemde amaç bir anda en yüksek performansa çıkmak değil; düzenli uyku, doğru beslenme ve kontrollü yüklenmeyle sağlam bir temel oluşturmaktır.",
  "İlk devrede öğrendiğin alışkanlıkları istikrarlı biçimde uygulaman, hem bireysel gelişimini hem de takım içindeki güvenilirliğini artırır.",
  "Yoğun sezon döneminde her gün aynı enerjide olmayabilirsin. Önemli olan bedeninin verdiği işaretleri okuyup hazırlık ve toparlanma kalitesini korumaktır.",
  "Sezon sonu yalnızca sonuçlara bakma zamanı değildir. Kazandığın alışkanlıkları, geliştirdiğin yönleri ve yeni dönem hedeflerini birlikte değerlendirmelisin.",
];

const detailSentences = [
  "Uygulamayı acele etmeden yap; doğru alışkanlığın nasıl hissettirdiğini fark etmeye çalış. Gerektiğinde antrenöründen kişisel geri bildirim iste.",
  "Bu öneriyi yalnızca antrenman gününde değil, hafta boyunca günlük düzeninin bir parçası haline getir. Küçük tekrarlar kalıcı sporcu alışkanlığı oluşturur.",
  "Kendini takım arkadaşlarınla kıyaslamak yerine geçen haftaki hazırlığınla karşılaştır. Gelişimini kısa notlarla takip et.",
  "Yaşına, sağlık durumuna ve antrenörünün programına uygun hareket et. Ağrı, baş dönmesi veya olağan dışı yorgunlukta çalışmayı sürdürme.",
];

const weeklyActions = [
  "hazırlık saatini planla ve ihtiyaç listesini bir gün önceden tamamla", "hedefini antrenörünle paylaş ve haftanın sonunda gerçekleşme durumunu değerlendir",
  "çantandaki malzemeleri güvenlik, hijyen ve kullanım sırasına göre düzenle", "kamp günlerini uyku, öğün, antrenman ve dinlenme saatleriyle birlikte planla",
  "salona girişten çıkışa kadar uygulayacağın üç disiplin davranışını belirle", "uyuma ve uyanma saatlerini kayıt altına alarak toparlanma kaliteni gözlemle",
  "ısınmanın her bölümünde vücudundaki değişimi fark et ve acele etme", "bir takım arkadaşınla açık iletişim kurup güven veren bir davranış göster",
  "verilen yönergeyi kendi cümlenle tekrar ederek doğru anladığını kontrol et", "su, uyku, öğün ve kişisel bakım alışkanlıklarından birini geliştirmeye odaklan",
  "ödev, dinlenme ve antrenman saatlerini çakışmayacak biçimde haftalık plana yerleştir", "motivasyonun azaldığında sana neden voleybol oynadığını hatırlatan üç nedeni oku",
  "ilk on iki haftadaki notlarını inceleyip gelişen ve yeniden çalışılması gereken alanları ayır", "antrenmandan önceki öğünün saatini ve antrenmandaki enerji hissini birlikte kaydet",
  "soğuma, sıvı ve öğün adımlarını antrenman biter bitmez doğru sırayla uygula", "kişisel şişeni kullanıp gün boyunca içtiğin suyu yaklaşık olarak takip et",
  "çalışma başlamadan önce dikkat dağıtan düşünceleri kısa bir nefes rutiniyle geride bırak", "hata sonrasında kullanacağın toparlanma kelimesini belirle ve sıradaki topa yönel",
  "takım içinde kullanacağın kısa, olumlu ve anlaşılır saha ifadelerini önceden seç", "maçtan önce uyku, çanta, öğün ve ulaşım hazırlığını kontrol listesiyle tamamla",
  "forma, ayakkabı, dizlik, su ve kişisel bakım malzemelerini maçtan önce kontrol et", "kenardayken oyunu takip et, pozisyonunu zihninde canlandır ve çağrıldığında hazır ol",
  "sonuç ne olursa olsun rakibe, hakeme ve takım arkadaşına saygılı davranışını koru", "yüksek yoğunluk günlerinin ardından dinlenme ve uyku süreni bilinçli artır",
  "kapalı alan döneminde el hijyeni, uyku ve dengeli öğün düzenini aksatma", "ilk devredeki alışkanlıklarını puanlayıp ikinci devre için tek öncelik seç",
  "tatil sonrası ilk çalışmalarda kontrollü başla ve vücuduna yeniden uyum süresi tanı", "yoğun haftada önemli işlerini önceden planlayıp gereksiz enerji kaybını azalt",
  "maç öncesi heyecanını nefes, olumlu iç konuşma ve kısa rutinle yönet", "baskı anında skoru değil uygulayacağın bir sonraki görevi düşün",
  "başarını yalnızca sayı almakla değil doğru karar, çaba ve iletişimle de değerlendir", "takımdaki rolünün gerektirdiği sorumlulukları yazıp her antrenmanda birini uygula",
  "tekrar sayısını artırmadan önce her tekrarın amacını ve kalitesini kontrol et", "normal kas yorgunluğu ile keskin ağrı arasındaki farkı gözlemleyip antrenörüne açıkça bildir",
  "tekrarlayan ağrı, şişlik veya hareket kaybını gizlemeden yetişkine ve antrenöre söyle", "yolculuk öncesinde su, öğün, rahat kıyafet ve dinlenme planını tamamla",
  "turnuva boyunca alışık olduğun küçük öğünleri ve su tüketimini düzenli sürdür", "zorlu maçtan sonra sonucu kısa değerlendirip bedenini ve zihnini dinlenmeye geçir",
  "son on iki haftadaki performans notlarından tekrar eden güçlü yönünü belirle", "sezonun son bölümünde yeni yük eklemek yerine temel alışkanlıkların kalitesini koru",
  "yorgunlukta karar vermeden önce nefes al, sahayı tara ve en güvenli seçeneği belirle", "isteğinin azaldığı günlerde küçük bir başlangıç hedefi koyarak harekete geç",
  "kişisel hedefini takım hedefiyle ilişkilendirip arkadaşlarına yardımcı olacak bir davranış seç", "son maçlar öncesinde geçmiş hataları değil hazır olduğun görevleri zihninde canlandır",
  "sezon başındaki hedeflerinle bugünkü durumunu kanıtlar ve notlarla karşılaştır", "aldığın geri bildirimden uygulanabilir tek davranış çıkarıp sonraki çalışmada dene",
  "tam hareketsizlik yerine keyif aldığın düşük yoğunluklu etkinliklerle aktif dinlen", "antrenman azalırken porsiyon ve atıştırma düzenini günlük hareketine göre dengele",
  "yeni sezon için sonuç hedefinin yanında davranış ve devamlılık hedefi de oluştur", "yaz döneminde top hissini korurken dinlenme ve farklı hareket deneyimlerine de yer ver",
  "kampa dönmeden önce uyku ve günlük hareket düzenini kademeli biçimde yeniden kur", "sezon boyunca öğrendiğin en değerli beş sporcu alışkanlığını günlüğünde özetle",
];

const start = new Date(Date.UTC(2026, 8, 4));
export const bulletins = weeklyTitles.map((title, index) => {
  const date = new Date(start); date.setUTCDate(start.getUTCDate() + index * 7);
  const phase = phases[Math.floor(index / 13)];
  const weeklyAction=weeklyActions[index];
  const bulletin = {
    id:`bulten-${String(index + 1).padStart(2,"0")}`, number:index + 1,
    date:date.toISOString().slice(0,10), title, phase:phase.name, phaseFocus:phase.focus,
    intro:`${title} haftasında temel hedefin, ${phase.focus.toLocaleLowerCase("tr-TR")}. ${phaseGuidance[Math.floor(index / 13)]}`,
    preTraining:`${title} haftasına başlamadan önce ${weeklyAction}. ${preTraining[index % preTraining.length]} ${detailSentences[index % detailSentences.length]}`,
    postTraining:`${title} çalışmasının ardından bedenindeki enerji, gerginlik ve yorgunluk değişimini not et. ${postTraining[(index + 1) % postTraining.length]} ${detailSentences[(index + 1) % detailSentences.length]}`,
    psychology:`${title} sürecinde kontrol edebileceğin davranışlara odaklan. ${psychology[(index + 2) % psychology.length]} Bu haftanın sonunda düşünce ve tepkilerindeki değişimi tek cümleyle değerlendir.`,
    nutrition:`${title} dönemindeki öğün ve sıvı düzenini antrenman saatine göre planla. ${nutrition[(index + 3) % nutrition.length]} Özel gereksinimlerinde ailenden ve uygun bir sağlık uzmanından destek al.`,
    trainingTip:`${title} için haftanın uygulaması: ${weeklyAction}. ${tips[index % tips.length]}`,
    rule:`${title} haftasının güvenlik kuralı: ${rules[(index + 1) % rules.length]} Bu kural takımın çalışma düzeni için de geçerlidir.`,
    athleteAdvice:`${title} konusunda kendine verdiğin sözü sporcu günlüğüne yaz. ${advice[(index + 2) % advice.length]} Hafta sonunda küçük ve gerçekçi bir sonraki adım belirle.`,
    designVariant:index,
    selfCheck:["Antrenmana zamanında ve hazırlıklı geldim.", "Bedenimin verdiği işaretleri dikkate aldım.", "Takımımla olumlu iletişim kurdum."],
  };
  if(index===0) bulletin.feature = {
    opening:"Yeni sezon, geçen yılın devamı değil; daha bilinçli bir sporcu olmak için yeni bir başlangıçtır. İlk haftadaki amacın kendini zorlamak değil, bedenini ve günlük düzenini voleybola güvenli biçimde yeniden hazırlamaktır.",
    physical:"Uyku saatini düzene sok, antrenman dışındaki günlük hareketini kademeli artır ve vücudundaki olağan dışı ağrıları antrenörünle paylaş. İlk günlerde yüksek yoğunluk yerine kontrollü uyum hedefle.",
    mental:"Sonuç hedefinden önce davranış hedefi belirle. Zamanında gelmek, yönergeyi dikkatle dinlemek, hata sonrasında oyuna dönmek ve takım arkadaşına destek olmak senin kontrolündedir.",
    organization:"Forma, ayakkabı, dizlik, havlu, kişisel su şişesi ve yedek kıyafetini bir gün önce hazırla. Okul, öğün, ulaşım ve antrenman saatlerini haftalık planına yaz.",
    goals:["Her antrenmana en az 10 dakika erken gelmek","Hafta boyunca düzenli uyku saatini korumak","Her çalışmada bir olumlu takım iletişimi kurmak","Antrenman sonunda kısa gelişim notu yazmak"],
    readiness:["Uyku düzenim sezon programına uygun","Antrenman çantam eksiksiz","Su şişem ve ara öğünüm hazır","Ağrı veya sağlık durumumu bildirdim","Haftalık okul-antrenman planımı yaptım","Kişisel gelişim hedefimi yazdım"],
    before:"Antrenmandan 2–3 saat önce alışık olduğun dengeli bir öğün tüket. Salona erken gel, su iç, ekipmanını kontrol et ve ısınma boyunca hareket kalitesine odaklan. Ağrı ile normal tutukluğu birbirine karıştırma.",
    during:"İlk hafta tekrarların hızından çok doğruluğunu önemse. Antrenör konuşurken göz teması kur, anlamadığın yönergeyi sor ve yorgunluk yükseldiğinde tekniğinin bozulup bozulmadığını gözlemle.",
    after:"Çalışmayı hafif hareket ve kontrollü soğumayla tamamla. Terli kıyafetini değiştir, sıvı kaybını yerine koy ve uygun zamanda karbonhidrat ile protein içeren dengeli bir öğün tüket.",
    nutrition:"Güne kahvaltısız başlama; ana öğünlerde tahıl veya diğer karbonhidrat kaynaklarını, kaliteli proteini, sebze-meyveyi ve sağlıklı yağları birlikte düşün. Yeni takviye veya enerji ürünlerini uzman önerisi olmadan kullanma.",
    psychology:"İlk antrenmanlarda eski performansına hemen ulaşamayabilirsin. Bunu başarısızlık olarak değil uyum süreci olarak değerlendir. Her hata sonrasında nefes al, kısa bir anahtar kelime kullan ve dikkatini sıradaki göreve taşı.",
    safety:"Keskin ağrı, şişlik, baş dönmesi, nefes darlığı veya olağan dışı halsizlikte çalışmayı sürdürme. Durumu hemen antrenörüne ve ailene bildir. Ek egzersizleri yalnızca antrenör onayıyla uygula.",
    weeklyMission:"Yedi gün boyunca uyku saatini, su tüketimini, antrenman öncesi enerji durumunu ve antrenman sonrasındaki hissini sporcu günlüğüne kaydet. Pazar günü güçlü bir alışkanlığını ve geliştireceğin tek davranışı seç.",
  };
  if(index===1) bulletin.goalFeature = {
    opening:"Hedef belirlemek yalnızca ‘daha iyi oynamak istiyorum’ demek değildir. İyi bir hedef; neyi geliştireceğini, hangi davranışı düzenli uygulayacağını ve ilerlemeni nasıl fark edeceğini açıkça gösterir.",
    principle:"Skor, kadro seçimi veya rakibin performansı her zaman senin kontrolünde değildir. Hazırlığın, çaban, iletişimin, devamlılığın ve geri bildirimlere verdiğin tepki ise senin kontrolündedir. Bu sezon hedeflerini önce bu davranışlar üzerine kur.",
    goalTypes:[
      ["DAVRANIŞ HEDEFİ","Antrenmana zamanında gelmek, her top öncesi hazır olmak ve takım arkadaşlarıyla olumlu iletişim kurmak gibi doğrudan uygulayabileceğin davranışlardır."],
      ["GELİŞİM HEDEFİ","Servis kararlılığını, top kontrolünü, hareket kaliteni veya kondisyonunu başlangıç durumuna göre ilerletmeyi amaçlar."],
      ["TAKIM HEDEFİ","Sorumluluğunu yerine getirmek, arkadaşına destek olmak ve ortak oyun düzenine katkı sağlamak gibi takımın tamamını güçlendiren hedeflerdir."],
    ],
    goalSteps:[
      ["01","SEÇ","Aynı anda çok sayıda hedef yerine senin için öncelikli olan bir gelişim alanını seç."],
      ["02","NETLEŞTİR","Hedefini ‘ne, ne zaman, kaç kez ve nasıl takip edeceğim?’ sorularıyla açık hale getir."],
      ["03","UYGULA","Hedefi haftalık küçük davranışlara böl ve antrenman planına yerleştir."],
      ["04","DEĞERLENDİR","Hafta sonunda kanıta bak; işe yarayan davranışı koru, zorlandığın adımı yeniden düzenle."],
    ],
    example:"Genel ifade: ‘Servisim daha iyi olsun.’ Net hedef: ‘Dört hafta boyunca her antrenmanda antrenörümün belirlediği hedef alana 10 kontrollü servis atacağım; isabet sayımı sporcu günlüğüme yazacağım.’",
    plan:[
      ["1. HAFTA","Başlangıç durumunu gözlemle, hedefini yaz ve antrenörünle paylaş."],
      ["2. HAFTA","Seçtiğin davranışı her antrenmanda uygula; sonucu kısa notlarla takip et."],
      ["3. HAFTA","Antrenör geri bildirimine göre uygulamanın bir bölümünü düzelt ve yeniden dene."],
      ["4. HAFTA","İlk haftayla karşılaştır, gelişimi kanıtla ve sonraki küçük hedefi belirle."],
    ],
    obstacles:[
      ["Motivasyonum düşerse","Yalnızca beş dakikalık başlangıç hedefi koyar, ilk doğru davranışı uygularım."],
      ["Hata yaparsam","Nefes alır, hatadan tek ders çıkarır ve dikkatimi sıradaki göreve taşırım."],
      ["Programım yoğunlaşırsa","Okul, uyku ve antrenman saatlerimi önceden planlar; hedefimi daha küçük adıma bölerim."],
      ["Gelişimi göremezsem","Notlarıma ve ölçümlerime bakar, antrenörümden somut geri bildirim isterim."],
    ],
    teamPromise:"Takım hedefim için her antrenmanda en az bir arkadaşımı olumlu bir cümleyle destekleyecek, saha içi sorumluluğumu yüksek sesli ve net iletişimle yerine getireceğim.",
    mission:"Bir davranış, bir gelişim ve bir takım hedefi yaz. İçlerinden öncelikli olanı seç; dört haftalık planın ilk adımını bu hafta en az iki antrenmanda uygula. Hafta sonunda yaptığın tekrarları ve öğrendiğin bir noktayı günlüğüne kaydet.",
    questions:["Hedefim benim kontrol edebildiğim bir davranış içeriyor mu?","İlerlememi hangi kayıt veya gözlemle takip edeceğim?","Bu hedef için bu hafta atacağım en küçük adım nedir?"],
  };
  if(index===2) bulletin.campFeature = {
    opening:"Kamp hazırlığı yalnızca çantayı doldurmak değildir. Doğru malzemeyi zamanında hazırlamak; antrenmana, dinlenmeye ve takım düzenine hazır olduğunun göstergesidir. Çantanı bir gün önce planladığında unutma stresini azaltır, enerjini sahadaki görevlerine ayırırsın.",
    principles:[
      ["HAZIRLIK","Kamp programını, hava durumunu, ulaşım saatini ve tesis koşullarını önceden öğren. İhtiyaçlarını tahmin ederek değil, antrenörünün paylaştığı listeye göre hazırla."],
      ["DÜZEN","Malzemelerini kullanım sırasına göre bölümlere ayır. Temiz ve kirli kıyafetleri ayrı poşetlerde tut; suya karşı korunması gereken eşyaları kapalı bölmeye yerleştir."],
      ["SORUMLULUK","Kendi çantanı kendin kontrol et. Her antrenman sonrasında eksilen, ıslanan veya temizlenmesi gereken malzemeyi işaretle ve ertesi güne bırakmadan tamamla."],
    ],
    bagGroups:[
      ["SAHA EKİPMANI",["Antrenman forması ve yedek tişört","Salon ayakkabısı ve temiz çorap","Dizlik, bileklik veya onaylı destek","Kişisel su şişesi ve küçük havlu"]],
      ["KİŞİSEL BAKIM",["Terli kıyafet için kapalı poşet","Duş ve temel hijyen malzemeleri","Güneş koruyucu ve dudak koruyucu","Kişisel ilaçlar - yetişkin kontrolünde"]],
      ["BESLENME VE SIVI",["Yeterli içme suyu","Alışık olduğun ara öğün","Sızdırmaz besin kabı","Uzun gün için antrenörün önerdiği plan"]],
      ["BELGE VE İLETİŞİM",["Kimlik ve gerekli izin belgesi","Acil durum iletişim bilgisi","Kamp programı ve buluşma saati","Gerekliyse şarj cihazı - kullanım kuralına uygun"]],
    ],
    packingSteps:[
      ["01","LİSTEYİ AÇ","Kamp programını ve antrenörün ihtiyaç listesini önüne koy."],
      ["02","GRUPLA","Eşyaları saha, bakım, beslenme ve belge olarak dört gruba ayır."],
      ["03","YERLEŞTİR","Ağır malzemeleri alta, sık kullanacaklarını kolay ulaşılacak bölmeye koy."],
      ["04","SON KONTROL","Çıkıştan önce çantanı listeyle birlikte ikinci kez kontrol et."],
    ],
    dayBefore:"Forma ve yedek kıyafetlerinin temiz ve kuru olduğunu kontrol et. Ayakkabı tabanını temizle, su şişeni yıka, gerekli belgeleri kapalı dosyaya yerleştir. Uyku saatini yolculuk ve ilk antrenman saatine göre planla; son dakika hazırlığına güvenme.",
    travelMorning:"Hafif ve alışık olduğun bir kahvaltı yap. Su içmeye güne erken başla; çok aç veya aşırı tok yola çıkma. Buluşma yerine zamanında ulaş, takım yoklamasını takip et ve çantanı başkasının sorumluluğuna bırakma.",
    routines:[
      ["ANTRENMAN ÖNCESİ","Doğru kıyafeti giy, takılarını çıkar, su şişeni doldur ve ağrı ya da rahatsızlık durumunu antrenörüne bildir."],
      ["ANTRENMAN SONRASI","Soğumayı tamamla, terli kıyafetini değiştir, kullandığın malzemeyi kurula ve sıvı-toparlanma planını uygula."],
      ["AKŞAM KONTROLÜ","Kirli malzemeyi ayır, ertesi günün formasını hazırla, su şişeni temizle ve gün içindeki enerji durumunu kısa notla değerlendir."],
    ],
    hygiene:[
      "Su şişesi, havlu ve kişisel bakım ürünlerini paylaşma.",
      "Terli kıyafetle uzun süre kalma; temiz ve kuru kıyafet giy.",
      "Küçük yara veya cilt sorununu gizleme; sorumlu yetişkine bildir.",
      "Ortak alanları temiz bırak ve takımın kamp kurallarına uy.",
    ],
    nutrition:[
      ["ÖNCESİ","Antrenmandan önce sindirimi kolay, daha önce denediğin bir öğün tercih et."],
      ["SIRASINDA","Susamayı beklemeden küçük aralıklarla su iç; kişisel şişeni kullan."],
      ["SONRASI","Karbonhidrat, kaliteli protein ve sıvı içeren dengeli toparlanma öğününü geciktirme."],
    ],
    mindset:"Eksik eşya fark ettiğinde paniğe kapılma. Önce antrenörüne veya sorumlu yetişkine haber ver, güvenli ve takım düzenine uygun çözümü birlikte belirle. Başkasının malzemesini izinsiz kullanma; hazırlık hatasını bir sonraki gün için öğrenme notuna dönüştür.",
    safety:"Kimlik, kişisel ilaç ve acil durum bilgileri ayrı, güvenli ve kolay bulunabilen bir bölümde olmalı. İlaç kullanımı yalnızca aile ve yetkili sağlık uzmanının belirlediği plana göre yapılmalıdır.",
    weeklyMission:"Bu hafta çantanı iki kamp günü için bir gece önceden kendin hazırla. Sabah yalnızca son kontrol yap. Antrenman sonunda eksik veya gereksiz taşıdığın bir eşyayı not et ve kişisel kamp listeni buna göre güncelle.",
    selfCheck:["Çantamı listeyle ve kendim hazırladım.","Temiz-kirli malzemeyi ayrı tuttum.","Su ve öğün planımı tamamladım.","Belge ve acil bilgilerimi kontrol ettim."],
  };
  return bulletin;
});

export const bulletinPeriod = { start:bulletins[0].date, end:bulletins.at(-1).date, total:bulletins.length };

const bulletinStatus = (value) => {
  const normalized = typeof value === "string" ? value.trim().toLocaleUpperCase("tr-TR") : value;
  if (["SİLİNDİ", "SILINDI", "DELETED"].includes(normalized)) return "deleted";
  if ([false, 0, "0", "FALSE", "HAYIR", "TASLAK", "YAYINDAN KALDIRILDI"].includes(normalized)) return "draft";
  return "published";
};

export function applyBulletinManagement(rows, includeHidden = false) {
  if (!Array.isArray(rows) || !rows.length) return bulletins.map((item) => ({ ...item, status:"published", published:true }));
  const byId = new Map(rows.map((row) => [String(row["Bülten ID"] || row.id || ""), row]));
  return bulletins.map((item) => {
    const row = byId.get(item.id);
    if (!row) return { ...item, status:"published", published:true, adminOrder:item.number };
    const status = bulletinStatus(row["Durum"] ?? row["Yayında"] ?? row.status ?? row.published);
    return {
      ...item,
      title:String(row["Başlık"] || row.title || item.title),
      date:String(row["Tarih"] || row.date || item.date),
      status,
      published:status === "published",
      adminOrder:Number(row["Sıra"] || row.order || item.number),
    };
  }).filter((item) => includeHidden || item.status === "published")
    .sort((a,b) => (a.adminOrder ?? a.number) - (b.adminOrder ?? b.number));
}
