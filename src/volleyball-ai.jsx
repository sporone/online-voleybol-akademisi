import React, { useMemo, useState } from "react";
import { ArrowRight, Bot, BookOpen, CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles } from "lucide-react";
import "./volleyball-ai.css";

const suggestions = [
  "Parmak pas nasıl yapılır?",
  "Manşette kollar nasıl olmalı?",
  "Smaç sıçramasını nasıl geliştiririm?",
  "Libero oyuncusunun görevi nedir?",
];

const knowledge = [
  { title:"Voleybola giriş ve temel kurallar", keys:["kural","saha","rotasyon","sayı","set","file","temas"], answer:"Salon voleybolunda sahada altı oyuncu bulunur. Bir takım, blok teması dışında topu rakip alana göndermeden önce en fazla üç takım teması yapabilir. Oyuncular servis hakkını kazandıklarında saat yönünde bir pozisyon döner. Teknik ayrıntıları öğrenirken saha yerleşimi, temas sırası ve rotasyon kurallarını birlikte çalışmak gerekir." },
  { title:"Parmak pas", keys:["parmak pas","pasör","pas verme","el şekli","alın"], answer:"Parmak pasta top, alın önünde ve iki elin dengeli oluşturduğu pencere içinde karşılanır. Dizler hafif bükülü, gövde dengeli ve dirsekler rahat olmalıdır. Kuvvet yalnızca bilekten değil; ayak, diz, kalça ve kolların uyumlu açılmasından üretilir. Top elde tutulmadan kısa ve kontrollü temasla hedefe yönlendirilir." },
  { title:"Manşet", keys:["manşet","platform","servis karşılama","ön kol"], answer:"Manşette iki ön kol aynı düzlemde birleşerek sabit bir platform oluşturur. Omuzlar öne ve aşağı yönlenir, dirsekler bükülmez ve top bileklere değil ön kolların düz yüzeyine alınır. Yön kontrolü büyük kol salınımıyla değil; ayakların hedefe yerleşmesi ve platform açısıyla sağlanır." },
  { title:"Servis teknikleri", keys:["servis","floater","tenis servis","top atışı"], answer:"Etkili servisin temeli dengeli başlangıç, tekrarlanabilir top atışı ve doğru temas noktasıdır. Floater serviste topun merkezine sert ve kısa temas edilerek dönüş azaltılır. Hedef çalışmasında önce doğruluk, ardından hız artırılmalıdır; çizgiye basmak veya servis sırasını bozmak hatadır." },
  { title:"Smaç", keys:["smaç","yaklaşma","kol salınımı","hücum vuruşu"], answer:"Smaç; yaklaşma, sıçrama, havada kol hazırlığı, en yüksek erişim noktasında temas ve dengeli iniş aşamalarından oluşur. Son iki adım hızın dikey kuvvete çevrilmesini sağlar. Topa açık elle, vücudun önünde temas edilmeli ve iki ayakla kontrollü iniş hedeflenmelidir." },
  { title:"Blok", keys:["blok","blokçu","file üstü","eller file"], answer:"Blokta oyuncu hücumcunun yaklaşmasını ve pasın yönünü okur. Sıçrama zamanlaması topun yüksekliği ve hücum temposuna göre ayarlanır. Eller file üzerine uzatılıp rakip alana doğru alan kapatır; inişte denge korunur ve file temasından kaçınılır." },
  { title:"Savunma teknikleri", keys:["savunma","dig","plonjon","alan savunması","reaksiyon"], answer:"Savunmada hazır duruş alçak, dengeli ve hareket etmeye uygun olmalıdır. Oyuncu topa değil önce hücumcunun yaklaşma açısı, omuz yönü ve blok yerleşimine bakar. İlk hedef mükemmel pas değil, topu kontrol edilebilir biçimde oyunda tutmaktır." },
  { title:"Hücum organizasyonları", keys:["hücum organizasyonu","hücum temposu","kombinasyon","orta hücum"], answer:"Hücum organizasyonu; kaliteli ilk temas, pasörün topa dengeli ulaşması ve hücumcuların doğru zamanda yaklaşmasıyla kurulur. Tempo seçimi karşılama kalitesine, blok yerleşimine ve hücumcunun özelliklerine göre yapılır. Oyuncuların çağrıları ve geçiş yolları önceden belirlenmelidir." },
  { title:"Pozisyon bilgisi", keys:["pozisyon","pasör çaprazı","smaçör","orta oyuncu","libero","pasör"], answer:"Takımda pasör hücumu organize eder; smaçör karşılama ve hücum sorumluluğunu paylaşır; pasör çaprazı yüksek toplarda önemli bitiricidir; orta oyuncu hızlı hücum ve blok merkezidir; libero arka alan savunması ve servis karşılamada uzmanlaşır. Her pozisyon rotasyona göre ön ve arka alan sorumluluklarını bilmelidir." },
  { title:"Kondisyon ve kuvvet", keys:["kuvvet","kondisyon","dayanıklılık","antrenman yükü"], answer:"Voleybola özgü fiziksel hazırlık; temel kuvvet, tek bacak dengesi, gövde kontrolü, omuz dayanıklılığı ve tekrarlı sıçrama kapasitesini kapsar. Teknik bozulmadan uygulanabilen yük seçilmeli, yoğun günlerin ardından yeterli toparlanma planlanmalıdır." },
  { title:"Sıçrama geliştirme", keys:["sıçrama","pliometrik","dikey sıçrama","zıplama"], answer:"Sıçrama gelişimi yalnızca çok zıplamakla değil; kuvvet temeli, doğru frenleme, hızlı kuvvet üretimi ve güvenli iniş tekniğiyle sağlanır. Pliometrik tekrarlar düşük hacimle ve tam dinlenmeyle uygulanmalı, dizlerin içe çökmediği dengeli iniş korunmalıdır." },
  { title:"Sakatlık önleme", keys:["sakatlık","ağrı","omuz","diz","ayak bileği","önleme"], answer:"Sakatlık riskini azaltmak için yük artışı kademeli yapılmalı; ayak bileği, diz, kalça, gövde ve omuz kontrolü düzenli çalıştırılmalıdır. Keskin veya artan ağrı antrenmanla zorlanmamalıdır. Bu asistan tanı koymaz; ağrı ve yaralanma durumunda sağlık uzmanına başvurulmalıdır." },
  { title:"Sporcu beslenmesi", keys:["beslenme","su","karbonhidrat","protein","maç öncesi"], answer:"Voleybolcu beslenmesinde yeterli enerji, düzenli sıvı alımı ve antrenman çevresinde uygun karbonhidrat-protein dengesi önemlidir. Maç öncesinde kişiye yabancı ve sindirimi zor yiyeceklerden kaçınılmalı; maç sonrasında sıvı, karbonhidrat ve proteinle toparlanma desteklenmelidir." },
  { title:"Mental hazırlık", keys:["mental","özgüven","odak","kaygı","motivasyon"], answer:"Mental hazırlık; kontrol edilebilir hedef belirleme, nefes düzenleme, olumlu iç konuşma ve servis öncesi gibi sabit performans rutinleriyle geliştirilir. Hata sonrasında kısa bir sıfırlama rutini kullanmak, dikkati geçmiş sayıdan bir sonraki göreve taşır." },
  { title:"Plaj voleybolu temelleri", keys:["plaj","kum","ikili","plaj voleybolu"], answer:"Plaj voleybolunda iki oyuncu tüm alanı paylaşır; iletişim, servis hedefi ve blok-savunma anlaşması belirleyicidir. Kumda hareket kısa ve dengeli adımlarla yapılır. Salon voleybolundan farklı top kontrolü ve oyun kuralları bulunduğu için teknikler plaj koşullarına göre uyarlanmalıdır." },
];

const normalize = (value="") => value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const volleyballTerms = normalize("voleybol top file saha set servis manşet parmak pas smaç blok savunma hücum pasör libero oyuncu rotasyon maç antrenman sıçrama kondisyon kuvvet sakatlık beslenme mental plaj diz omuz ayak bileği").split(" ");

function findAnswer(question) {
  const input = normalize(question);
  const volleyballRelated = volleyballTerms.some((term) => input.includes(term));
  if (!volleyballRelated) return { rejected:true, text:"Ben yalnızca voleybol konularında yardımcı olabilirim. Teknik, taktik, kurallar, pozisyonlar veya voleybolcu gelişimi hakkında bir soru sorabilirsin." };
  const ranked = knowledge.map((item) => ({ item, score:item.keys.reduce((score,key)=>score + (input.includes(normalize(key)) ? normalize(key).split(" ").length + 1 : 0), 0) })).sort((a,b)=>b.score-a.score);
  const match = ranked[0];
  if (!match || match.score === 0) return { text:"Sorun voleybolla ilgili ancak bilgi tabanımda doğrudan bir eşleşme bulamadım. Sorunu teknik adıyla ve biraz daha ayrıntılı yazabilir veya aşağıdaki derslerden birini inceleyebilirsin." };
  return { text:match.item.answer, courseTitle:match.item.title };
}

export default function VolleyballAIPage({ courses, go }) {
  const welcome = useMemo(() => ({ role:"assistant", text:"Merhaba! Ben Voleybol AI Asistanı. Yalnızca voleybol hakkında, akademideki doğrulanmış eğitim içeriklerine dayanarak yanıt veririm. Ne öğrenmek istersin?" }), []);
  const [messages, setMessages] = useState([welcome]);
  const [question, setQuestion] = useState("");
  const ask = (value) => {
    const clean = String(value || "").trim();
    if (!clean) return;
    const answer = findAnswer(clean);
    setMessages((items) => [...items, { role:"user", text:clean }, { role:"assistant", ...answer }]);
    setQuestion("");
  };
  const openCourse = (title) => { const course = courses.find((item) => normalize(item[1]) === normalize(title)); if (course) go("course", course); };
  return <div className="volleyball-ai-page">
    <section className="volleyball-ai-hero"><div><span className="eyebrow"><Sparkles/> ÜCRETSİZ • API KULLANMAZ</span><h1>Voleybol sorunu sor,<br/><em>sahaya uygun yanıt al.</em></h1><p>Yanıtlar yalnızca akademinin voleybol dersleri ve hazırlanmış bilgi tabanından bulunur. Soruların başka bir servise gönderilmez.</p><div className="ai-trust"><span><ShieldCheck/> Site içinde çalışır</span><span><BookOpen/> Derslerle bağlantılı</span><span><CheckCircle2/> Yalnızca voleybol</span></div></div><div className="ai-hero-mark"><Bot/><i/><small>VOLEYBOL AI</small></div></section>
    <section className="ai-chat-shell">
      <header><span><MessageCircle/><i><small>VOLEYBOL ASİSTANI</small><b>Nasıl yardımcı olabilirim?</b></i></span><em><i/> Çevrim içi</em></header>
      <div className="ai-messages" aria-live="polite">{messages.map((message,index)=><article className={`ai-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "assistant" ? <Bot/> : "SEN"}</span><div><p>{message.text}</p>{message.courseTitle&&<button onClick={()=>openCourse(message.courseTitle)}><BookOpen/> {message.courseTitle} dersine git <ArrowRight/></button>}</div></article>)}</div>
      {messages.length===1&&<div className="ai-suggestions">{suggestions.map((item)=><button key={item} onClick={()=>ask(item)}>{item}<ArrowRight/></button>)}</div>}
      <form onSubmit={(event)=>{event.preventDefault();ask(question)}}><label htmlFor="volleyball-ai-question">Voleybol sorun</label><div><input id="volleyball-ai-question" value={question} onChange={(event)=>setQuestion(event.target.value)} maxLength="240" placeholder="Örnek: Manşette top kontrolünü nasıl geliştiririm?"/><button type="submit" disabled={!question.trim()} aria-label="Soruyu gönder"><Send/></button></div><small>Bu alan sağlık tanısı veya kişiye özel tedavi önerisi vermez.</small></form>
    </section>
  </div>;
}
