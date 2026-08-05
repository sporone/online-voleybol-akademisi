import React,{useMemo,useState} from "react";
import {ArrowLeft,BookOpen,Eye,FileText,Library,Search,ShieldCheck,X} from "lucide-react";
import {ready365Categories,ready365Documents} from "./ready365-library.js";

const categoryArtwork=(category)=>{
  if(category==="Görsel Destek"||category==="Bölüm Görselleri") return "/antrenor-egitim-teknik.webp";
  if(category==="Ana Bölümler"||category==="Uzmanlık") return "/antrenor-egitim-taktik.webp";
  return "/antrenor-egitim-kutuphanesi-hero.webp";
};

export default function Ready365LibraryPage({account,go}){
  const [category,setCategory]=useState("Tümü"),[query,setQuery]=useState(""),[active,setActive]=useState(null);
  const visible=useMemo(()=>ready365Documents.filter((item)=>(category==="Tümü"||item.category===category)&&`${item.title} ${item.original} ${item.description}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))),[category,query]);
  return <div className="page ready-library-page">
    <button className="ready-back" onClick={()=>go("profiles")}><ArrowLeft/> Profilime dön</button>
    <section className="ready-hero">
      <div className="ready-hero-copy"><small><Library/> ANTRENÖR EĞİTİM ALANI</small><h1>Voleybol Antrenörlük Kütüphanesi</h1><p>Voleybol antrenman planlaması, beceri gelişimi, takım sistemleri ve antrenör yönetimi için hazırlanmış profesyonel PDF kütüphanesi.</p><div><span><FileText/> 21 PDF kaynak</span><span><BookOpen/> 6 ana bölüm</span><span><ShieldCheck/> Kulüp ve antrenör erişimi</span></div></div>
      <figure className="ready-hero-visual"><img src="/antrenor-egitim-kutuphanesi-hero.webp" alt="Akademi logolu formalarıyla voleybol antrenörü ve genç sporcular" fetchPriority="high"/></figure>
    </section>
    <section className="ready-toolbar"><label><Search/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Kaynak veya konu ara"/></label><div>{ready365Categories.map((item)=><button className={category===item?"active":""} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div></section>
    <p className="ready-result"><b>{visible.length}</b> kaynak gösteriliyor · Erişim: <strong>{account?.schoolName||account?.name}</strong></p>
    <section className="ready-grid">{visible.map((item)=><article className="ready-card" key={item.id}><div className="ready-cover"><img src={categoryArtwork(item.category)} alt={`${item.category} için akademi logolu voleybol antrenörü ve sporcular`} loading="lazy"/><span><FileText/></span><em>{String(item.index).padStart(2,"0")}</em><b>{item.category}</b></div><div className="ready-card-body"><small>{item.category}</small><h2>{item.title}</h2><p>{item.description}</p><span>{item.original}</span></div><footer><span>{item.size}</span><button onClick={()=>setActive(item)}><Eye/> PDF'yi görüntüle</button></footer></article>)}</section>
    {!visible.length&&<div className="ready-empty"><Search/><h2>Kaynak bulunamadı</h2><p>Arama metnini değiştirin veya kategori filtresini temizleyin.</p></div>}
    {active&&<div className="ready-modal" role="dialog" aria-modal="true" aria-label={`${active.title} PDF görüntüleyici`}><div className="ready-modal-panel"><header><span><small>{active.category}</small><h2>{active.title}</h2><p>{active.original}</p></span><button onClick={()=>setActive(null)} aria-label="PDF görüntüleyiciyi kapat"><X/></button></header><div className="ready-pdf-frame"><iframe src={active.preview} title={`${active.title} PDF`} allow="autoplay" allowFullScreen/></div></div></div>}
  </div>;
}
