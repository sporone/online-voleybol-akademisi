const groupMeta = {
  "01_Parmak_Pas": { name: "Parmak Pas", cover: "/course-covers/course-02.webp" },
  "02_Manset_Pas": { name: "Manşet Pas", cover: "/course-covers/course-03.webp" },
  "03_Smac_ve_Hucum_Vuruslari": { name: "Smaç ve Hücum Vuruşları", cover: "/course-covers/course-05.webp" },
  "04_Birlesik_Alistirmalar": { name: "Birleşik Alıştırmalar", cover: "/course-covers/course-08.webp" },
  "05_Oyunlar": { name: "Oyunlar", cover: "/course-covers/course-17.webp" },
  "06_Top_Kontrolu": { name: "Top Kontrolü", cover: "/course-covers/course-01.webp" },
};

const turkishTitles = {
  20087:"Çok Toplu Değişim Çalışması",20313:"Havada Top Kontrolü 1",20314:"Eşli Dikey Top Kontrolü 1",20315:"Havada Top Kontrolü 2",20316:"Havada Top Kontrolü 3",20317:"Havada Top Kontrolü 4",20318:"Parmak Pas ve Kafa Vuruşu",20319:"Yüksek Top Kontrolü",20320:"Duvarla Top Kontrolü 1",20321:"Duvarla Top Kontrolü 2",20322:"Duvarla Top Kontrolü 3",20323:"Dikey Top Kontrolü 1",20324:"Voleybol Duşu",
  20327:"Sayıları Fark Ederek Parmak Pas 3",20328:"Parmak Pas Ön Çalışması 1",20329:"Parmak Pas Ön Çalışması 2",20330:"Dönüş Sonrası Parmak Pas",20331:"Sayıları Fark Ederek Parmak Pas 4",20332:"Parmak Pas Ön Çalışması 3",20333:"Duvara Parmak Pas",20334:"Top Değiştirerek Parmak Pas",20335:"Yorgunluk Altında Parmak Pas",20336:"Eşli Dikey Parmak Pas 3",20337:"Yüzüstü Pozisyondan Parmak Pas",20338:"Bank Üzerinden Parmak Pas 1",20339:"Bank Üzerinden Parmak Pas 2",20340:"Yana Yuvarlanma Sonrası Parmak Pas",20341:"Öne Yuvarlanma Sonrası Parmak Pas",20342:"Bank Üzerinden Parmak Pas 3",20343:"Duvarla Parmak Pas Oyunu 1",20344:"Geriye Yuvarlanma Sonrası Parmak Pas",20345:"Duvarla Parmak Pas Oyunu 2",20346:"Dikey Parmak Pas 3",20347:"Ek Topla Parmak Pas 1",20348:"Ek Topla Parmak Pas 2",20349:"Ek Topla Parmak Pas 3",20350:"İki Topla Parmak Pas 1",20351:"İki Topla Parmak Pas 2",20352:"Ara Kontrolle Parmak Pas",
  20353:"Duvarla Manşet Çalışması 4",20354:"Sayıları Fark Ederek Manşet 1",20355:"Duvarla Manşet Çalışması 5",20356:"Dönüş Sonrası Manşet",20357:"Manşet ve Kafa Vuruşu",20358:"Sayıları Fark Ederek Manşet 2",20359:"Dikey Manşet Kontrolü 2",20360:"Eşli Dikey Manşet 2",20361:"Duvarla Manşet Oyunu 1",20362:"Duvarla Manşet Oyunu 2",20363:"Duvarla Manşet Oyunu 3",20364:"Ek Topla Manşet 1",20365:"Ek Topla Manşet 2",20366:"Ek Topla Manşet 3",20367:"İki Topla Manşet 1",20368:"İki Topla Manşet 2",20369:"Ara Kontrolle Manşet",
  20370:"Duvara Hücum Vuruşu 4",20371:"Duvara Hücum Vuruşu 1",20372:"Duvara Hücum Vuruşu 2",20373:"Hücum Vuruşu 1",20374:"Hücum Vuruşu 2",20375:"Duvara Hücum Vuruşu 3",20376:"Smaç Fren Adımı 1",20377:"Hücum Vuruşu 3",20378:"Smaç Fren Adımı 2",20379:"Smaç Fren Adımı 3",20380:"Hücum Vuruşu 4",20381:"Hücum Vuruşu 5",
  20382:"Manşet ve Parmak Pas Geçişi 1",20383:"Çok Toplu Parmak Pas",20384:"Çok Toplu Manşet",20385:"Parmak Pasla Top Değişimi",20386:"Manşetle Top Değişimi",20389:"Manşet ve Parmak Pas Geçişi 2",
  20390:"Balon Ekspres Oyunu",20391:"Çember ve Hücum Vuruşu Oyunu",20392:"Hendek Topu Oyunu",20393:"Bank Topu Oyunu",20394:"Sepete Parmak Pas Oyunu",20395:"Duvar Hedef Oyunu 5",
};

function practiceDetails(videoNo, title, groupName) {
  const lower = title.toLocaleLowerCase("tr");
  let athletes = /eşli|partner|değiş|iki top|oyunu|bank üzerinden|çok top|sayıları fark/.test(lower) ? 2 : 1;
  let balls = /iki top|ek top|çok top|değiştir/.test(lower) ? 2 : 1;
  if (groupName === "Oyunlar") athletes = "2+";
  if (videoNo === "20390" || videoNo === "20392" || videoNo === "20393") athletes = "4+";
  if (lower.includes("balon")) balls = 1;
  const goalByGroup = {
    "Parmak Pas":"El şekli, temas hassasiyeti ve yön kontrolü",
    "Manşet Pas":"Platform açısı, denge ve top yönlendirme",
    "Smaç ve Hücum Vuruşları":"Yaklaşma ritmi, kol hızı ve kontrollü temas",
    "Birleşik Alıştırmalar":"Teknikler arası hızlı ve dengeli geçiş",
    "Oyunlar":"Karar verme, koordinasyon ve eğlenceli tekrar",
    "Top Kontrolü":"Top hissi, koordinasyon ve hareket kontrolü",
  };
  let advice = "Önce düşük tempoda doğru tekniği kurun; kontrol bozulmadan tekrar hızını artırın.";
  if (/duvar/.test(lower)) advice = "Duvarda sabit bir hedef belirleyin; her temastan sonra dengeli hazır pozisyona dönün.";
  else if (/dönüş|yuvarlanma/.test(lower)) advice = "Hareketi tamamladıktan sonra önce dengeyi kurun, ardından topa kontrollü temas edin.";
  else if (/iki top|ek top|çok top/.test(lower)) advice = "Topları karıştırmadan sabit ritimle başlayın; göz–el koordinasyonu oturdukça tempoyu yükseltin.";
  else if (/hücum|smaç/.test(lower)) advice = "Omuz ve kolu rahat tutun; topa en yüksek ve vücudun önündeki noktada temas edin.";
  else if (groupName === "Oyunlar") advice = "Alanı ve güvenlik sınırlarını belirleyin; kaliteyi koruyan kısa ve tempolu turlar uygulayın.";
  return { athletes, balls, goal: goalByGroup[groupName], advice };
}

const rows = `
01_Parmak_Pas|20327|Zahlen erkennen 3|16UORJuy66Ku5kf2y_RUyetk6s4MqfcOi
01_Parmak_Pas|20328|Pritschen Vorübung 1|1FUVg0wJL9sapAxWAONgn_9YUjR8psunq
01_Parmak_Pas|20329|Pritschen Vorübung 2|1DZfHIXQCCOJPPnmU428aGv9oYljB1jzT
01_Parmak_Pas|20330|Pritschen nach Drehung|14FMrVQOUounpkHRbElQCAxcohT_usL16
01_Parmak_Pas|20331|Zahlen erkennen 4|1KSSPVGkbb56CmkgcRu3iNvmCO-PiMqk-
01_Parmak_Pas|20332|Pritschen Vorübung 3|1qrwaQD0ZymSdwNjzegHqrqAlqRsGdcSE
01_Parmak_Pas|20333|Wandpritschen|1AFA5JHfwtRHaTqQFlzlsB6rXkMZHhDng
01_Parmak_Pas|20334|Bälle tauschen|1gvafNpQcnBn9cKOSaJ7zv1eRYKPCRNK2
01_Parmak_Pas|20335|Müdes Pritschen|1NFZ1z_8u-vuY_dUPTrY8kiB5uwaAIFv2
01_Parmak_Pas|20336|Partnersäule 3|1bSX0uged4nGYC46-IduqRQ_3RXN58kbY
01_Parmak_Pas|20337|Pritschen mit Bauchlage|1S4n27Jw3TTZXrSWp_T1p1KbUoO_ZgLOH
01_Parmak_Pas|20338|Bank-Volley 1|1sUpJ-KfeMKlMjs5EbSxusBE72z7rh-3u
01_Parmak_Pas|20339|Bank-Volley 2|1hIi7cnveJpalC0z0VG93BkhyrjYYgufa
01_Parmak_Pas|20340|Pritschen mit Seitrolle|1SNPlgxd8lHNx0t5_2WCZvwPv3DSrVwpe
01_Parmak_Pas|20341|Pritschen mit Rolle vw|1WrLXB3AbQBE9kgeQLXPX2tb7LmG4EVgS
01_Parmak_Pas|20342|Bank-Volley 3|1MXOrLaIxBEI4m5DGChDbnNTQju6ykEJW
01_Parmak_Pas|20343|Volley-Squash 1|11uSdfBXttzXecjDxDb7ykeU09LGA-Bo3
01_Parmak_Pas|20344|Pritschen mit Rolle rw|1L-ohrS1wZPFL3sY7Lijt7aplKDccsRH5
01_Parmak_Pas|20345|Volley-Squash 2|1HuuZdb-LzA_-O3t-d2es7HJHJubZo1mh
01_Parmak_Pas|20346|Säulen 3|1vOPpJYaWoETR-ohWpklFaCIYU0_YKbYb
01_Parmak_Pas|20347|Zusatzballpritschen 1|14am852HW7eMdVqJdFvDVBr5sSEdfZT10
01_Parmak_Pas|20348|Zusatzballpritschen 2|1jGnH03jFpSvTS1iZpJePOhLE_RC8N5b1
01_Parmak_Pas|20349|Zusatzballpritschen 3|1Ivn8t8ptrJ5DDeuHHBDm7mWdUEUc7pya
01_Parmak_Pas|20350|Zweiballpritschen 1|1v-KmpxG6YaR9UgKe0t-ziL1athOeeEPr
01_Parmak_Pas|20351|Zweiballpritschen 2|1NV3dPEIMy-eEWe7yPaF67BDwqt0-KOwC
01_Parmak_Pas|20352|Pritschen m. Eigenspiel|16-Vspoe0ytNJYN_j4gmLQ98_DsxXiCAS
02_Manset_Pas|20353|Wand als Partner 4|1zkgv57ReMoTktGK7TrPIiOWfMDDkJ66x
02_Manset_Pas|20354|Zahlen erkennen 1|1pxbwC3-D4D3mH8WjcJ5yh0exnYu4c_ob
02_Manset_Pas|20355|Wand als Partner 5|10x6aM0BNWOc6UCb4flXxbALjCIfR6-PW
02_Manset_Pas|20356|Bagger nach Drehung|18SrYzKIAsdkwL0QKEi2fwrS9VNkeXeag
02_Manset_Pas|20357|Baggerköpfeln|1ZWMUvSLeG9rXnyLZSii4R7svqOFbhczj
02_Manset_Pas|20358|Zahlen erkennen 2|1ogofdtOj7Q0Xhfh_2JVYq9MTDiO5AZFQ
02_Manset_Pas|20359|Säulen 2|1x90FQTZFO9wnD18HuCXQVUyzbE8iBBZJ
02_Manset_Pas|20360|Partnersäule 2|1WNvpOMZ2F7d9RxIpqoSOJjZudHnWSf8U
02_Manset_Pas|20361|Bagger-Squash 1|1pVcZd8sENPjvgaoBt3eJ0FKm0QYWYNUJ
02_Manset_Pas|20362|Bagger-Squash 2|1bNU9wEclj-BJRniF4usDhqh33qHqjIT9
02_Manset_Pas|20363|Bagger-Squash 3|1f_iGzFU-IIHFowqdbS0nm9I5OdOZglvw
02_Manset_Pas|20364|Zusatzballbagger 1|1Lb8QWu3vbgnoRZe8X0Ou9LUYizaoIgb3
02_Manset_Pas|20365|Zusatzballbagger 2|1CBBA95Y2M5Kbn5_73b2MplmtWHBL6K1J
02_Manset_Pas|20366|Zusatzballbagger 3|1TPyO5H80Bn554wDVLbmqJmJBzPKiNruG
02_Manset_Pas|20367|Zweiballbagger 1|1TRzD_CWg4HKOcHYKTU41AT2TnENPMhl4
02_Manset_Pas|20368|Zweiballbagger 2|1-Z2QcQSqYUTibPqs-IDzpMYcqCmjZRRc
02_Manset_Pas|20369|Baggern mit Eigenspiel|1oaglD0K2gty21Ay0L1PCoOe0t9t4XPjW
03_Smac_ve_Hucum_Vuruslari|20370|Anmäuerln 4|1NaMOKVBRmcpz3A3SXGooKKXF3fFKgk5I
03_Smac_ve_Hucum_Vuruslari|20371|Anmäuerln 1|1ykjIlnpcnOim7GM2K5Ll9UfSm_aB5OnQ
03_Smac_ve_Hucum_Vuruslari|20372|Anmäuerln 2|16f_CdAcZKGF-wIUejUm19qxG7Jaeee8g
03_Smac_ve_Hucum_Vuruslari|20373|Angriffsschlag 1|1n-pclo91HRZugvsbe3FewayIuPbqNSdl
03_Smac_ve_Hucum_Vuruslari|20374|Angriffsschlag 2|1bAqYNTye8b2CFDjSJZBfbF157hC3Azz5
03_Smac_ve_Hucum_Vuruslari|20375|Anmäuerln 3|13h3SnAYhIq2uWrHhUb9fzPliCwdLpCFK
03_Smac_ve_Hucum_Vuruslari|20376|Stemmschritt 1|19g6mX6II_0zDQBBfltJMEVoU9NLQNaHQ
03_Smac_ve_Hucum_Vuruslari|20377|Angriffschlag 3|15T1szSap3Mj25Yt6toZxhy2jiQVthaIN
03_Smac_ve_Hucum_Vuruslari|20378|Stemmschritt 2|1EzLUjY_D2xRpwP-4iWzvw_iaXAasP4kl
03_Smac_ve_Hucum_Vuruslari|20379|Stemmschritt 3|1Y0lhWFdAYoMclShJOEtToeWCMiQPIgBa
03_Smac_ve_Hucum_Vuruslari|20380|Angriffsschlag 4|1MSU5dqUSRko6wbtPeiIgBTj3_6FQx9ia
03_Smac_ve_Hucum_Vuruslari|20381|Angriffsschlag 5|1JLqP-kQBrfZkZvpXj4IruXP2-3Abt0j8
04_Birlesik_Alistirmalar|20087|Multiballwechsel|1yHPlKpEb-iWU99QPnoQwkgYdELWs4uh3
04_Birlesik_Alistirmalar|20382|Baggerpritschen 1|1nqTiSD2BQirTzRH3iXUFE4KWrdI9a7i7
04_Birlesik_Alistirmalar|20383|Multiballpritschen|1jXdwHUoQkl3ZVN7jQMVJF0I8Cf8fc8UK
04_Birlesik_Alistirmalar|20384|Multiballbaggern|13ukIOqJE5rh_QK4n93gKPdDVOcY_E-xu
04_Birlesik_Alistirmalar|20385|Pritschen-Ball-Wechsel|1XGup4c80KDFMK4DcpyagLbvpodb8IDsN
04_Birlesik_Alistirmalar|20386|Baggern-Ball-Wechsel|1yY2_fOfcw6hE35QiZwYbE-uEfdWOOZeW
04_Birlesik_Alistirmalar|20389|Baggerpritschen 2|13gsF8dS7F8sFVQi5f6J9qPulBmkjyTRv
05_Oyunlar|20390|Ballon Express|1n10-jJyFEbSNbtbio_PBdGCHYUOdW8DO
05_Oyunlar|20391|Reifen-Schlag-Spiel|131uFX-i8TQHwA6oFCchzolFpzKLxLfcx
05_Oyunlar|20392|Grabenball|19p0MR1Vc8bw4_qa9XM_ZnFuRokumD9Rx
05_Oyunlar|20393|Bankball|1Pa-q2uztOOkLa6dXbg3Mlike6lri3smj
05_Oyunlar|20394|Korbpritschen|1NlsCCu3Sub_2AyDj-scBY1z5XSWDkxvX
05_Oyunlar|20395|Anmäuerln 5|1ofndwNH0X_MAaA60UlZoATToH-him4Td
06_Top_Kontrolu|20313|Schwebender Ball 1|1mgW374mxgAoH-x9EUdX5dihwyQpFS_D_
06_Top_Kontrolu|20314|Partnersäule 1|1Sx3h0z-tK-3WSuUhvTe9W5XAgG1Y_Xmp
06_Top_Kontrolu|20315|Schwebender Ball 2|14U0qVGmStKO2pb408NPRD1vFcdEWea7a
06_Top_Kontrolu|20316|Schwebender Ball 3|1g3R6lFhtzhtol9isufr6kBdqok0Y6JdL
06_Top_Kontrolu|20317|Schwebender Ball 4|1Vor2l5hNJZjtGZrIX4pfYj-_x9dZuVdO
06_Top_Kontrolu|20318|Pritschköpfeln|16MUm9Ho2w4XqwfqAVTD2L0k6l1IOXE_9
06_Top_Kontrolu|20319|Kerzenball|18JZadZj8l1IUVAGEDTBGB0DS4lDgNQZ9
06_Top_Kontrolu|20320|Wand als Partner 1|1skifaXJ5dzSheiTCQ0tRZcOj6JgCJOoD
06_Top_Kontrolu|20321|Wand als Partner 2|107gVvbtYWLYOKcVXHuySznxF6n_ka_5j
06_Top_Kontrolu|20322|Wand als Partner 3|1OmG8yIGLLn4PgWLDFVYMkpUpqotNKNkS
06_Top_Kontrolu|20323|Säulen 1|1s8icr8NAP5jalO5NHgG1vPBvMigDNA1R
06_Top_Kontrolu|20324|Volleyshower|1xif_OHyXWlQpWv8NjOQiQyv9S4x4I_V3
`.trim().split("\n").map((line) => line.split("|"));

export const individualTrainingVideos = rows.map(([groupKey, videoNo, title, id], index) => {
  const group = groupMeta[groupKey];
  const translatedTitle = turkishTitles[videoNo] || title;
  return {
    id,
    number: Number(videoNo),
    order: index + 1,
    title: translatedTitle,
    originalTitle: title,
    fileName: `${videoNo}_${translatedTitle}.mp4`,
    originalFileName: `${videoNo}_${title}.mp4`,
    topic: group.name,
    groupKey,
    fallback: group.cover,
    thumbnail: `https://lh3.googleusercontent.com/d/${id}=w900`,
    // The public Drive folder supports secure HTTP Range requests on mobile.
    source: null,
    streamUrl: `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    originalSource: `http://www.bewegungskompetenzen.at/2020/images/videos/${videoNo}.mp4#t=1`,
    preview: `https://drive.google.com/file/d/${id}/preview?autoplay=1&loop=1`,
    view: `https://drive.google.com/file/d/${id}/view`,
    practice: practiceDetails(videoNo, translatedTitle, group.name),
  };
});

export const individualVideoTopics = Object.entries(groupMeta).map(([key, group]) => ({
  key,
  name: group.name,
  count: individualTrainingVideos.filter((video) => video.groupKey === key).length,
}));
