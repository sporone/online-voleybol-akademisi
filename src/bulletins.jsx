import React, { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { ArrowLeft, Brain, CalendarDays, CheckCircle2, Download, Dumbbell, FileText, MessageCircle, School, Send, ShieldCheck, Target } from "lucide-react";
import { appConfig } from "./config.js";
import { applyBulletinManagement, bulletins, bulletinPeriod } from "./bulletins.js";

const dateText = (value) => new Intl.DateTimeFormat("tr-TR", {
  day: "numeric", month: "long", year: "numeric", weekday: "long", timeZone: "UTC",
}).format(new Date(`${value}T12:00:00Z`));

const safeName = (value) => String(value || "spor-okulu").toLocaleLowerCase("tr-TR")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CALENDAR_START_YEAR = 2025;
const CALENDAR_END_YEAR = 2030;
const MONTH_NAMES = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const WEEKDAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const buildCalendarEntries = (templates) => {
  return templates
    .filter((item) => /^20\d{2}-\d{2}-\d{2}$/.test(item.date))
    .map((item) => ({ ...item, calendarId: `${item.date}-${item.id}` }))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.adminOrder ?? a.number) - (b.adminOrder ?? b.number))
    .map((item, index) => ({ ...item, calendarOrder:index + 1 }));
};

const wrapLines = (context, text, maxWidth) => {
  const words = String(text).split(/\s+/); const lines = []; let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
    else line = test;
  });
  if (line) lines.push(line);
  return lines;
};

const rounded = (ctx, x, y, width, height, radius, fill, stroke) => {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
};

const loadImage = (url) => new Promise((resolve, reject) => {
  const image = new Image(); image.crossOrigin = "anonymous";
  image.onload = () => resolve(image); image.onerror = reject; image.src = url;
});

const rgbHex = (r,g,b) => `#${[r,g,b].map((value)=>Math.round(Math.max(0,Math.min(255,value))).toString(16).padStart(2,"0")).join("")}`;
const hexRgb = (hex) => { const value=String(hex).replace("#",""); return [0,2,4].map((i)=>parseInt(value.slice(i,i+2),16)); };
const shade = (hex, amount) => rgbHex(...hexRgb(hex).map((value)=>value*amount));
const colorDistance = (a,b) => Math.sqrt(hexRgb(a).reduce((sum,value,index)=>sum+(value-hexRgb(b)[index])**2,0));

function logoPalette(image) {
  if (!image) return { primary:"#ff6519", secondary:"#ffbd20", dark:"#071b33" };
  try {
    const sample=document.createElement("canvas"); sample.width=72; sample.height=72;
    const context=sample.getContext("2d",{willReadFrequently:true}); context.drawImage(image,0,0,72,72);
    const pixels=context.getImageData(0,0,72,72).data; const groups=new Map();
    for(let i=0;i<pixels.length;i+=16){const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];const max=Math.max(r,g,b),min=Math.min(r,g,b);
      if(a<180||max>242||max-min<24||max<45) continue; const key=[r,g,b].map(v=>Math.round(v/32)*32).join(","); groups.set(key,(groups.get(key)||0)+1);}
    const colors=[...groups.entries()].sort((a,b)=>b[1]-a[1]).map(([key])=>rgbHex(...key.split(",").map(Number)));
    const primary=colors[0]||"#ff6519"; const secondary=colors.find((color)=>colorDistance(color,primary)>105)||"#ffbd20";
    return { primary, secondary, dark:shade(primary,.28) };
  } catch { return { primary:"#ff6519", secondary:"#ffbd20", dark:"#071b33" }; }
}

function drawTopicIcon(ctx, type, x, y, color) {
  ctx.save(); ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=5; ctx.lineCap="round"; ctx.lineJoin="round";
  ctx.beginPath(); ctx.arc(x,y,31,0,Math.PI*2); ctx.globalAlpha=.12; ctx.fill(); ctx.globalAlpha=1;
  if(type===0){ctx.beginPath();ctx.arc(x,y,17,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-11);ctx.moveTo(x,y);ctx.lineTo(x+10,y+5);ctx.stroke();}
  if(type===1){ctx.beginPath();ctx.arc(x,y,16,.2,5.1);ctx.stroke();ctx.beginPath();ctx.moveTo(x+7,y-18);ctx.lineTo(x+20,y-17);ctx.lineTo(x+15,y-5);ctx.stroke();}
  if(type===2){ctx.beginPath();ctx.moveTo(x-4,y+18);ctx.bezierCurveTo(x-30,y+7,x-23,y-24,x-4,y-17);ctx.bezierCurveTo(x+4,y-31,x+29,y-18,x+22,y+2);ctx.bezierCurveTo(x+30,y+18,x+8,y+28,x-4,y+18);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y-16);ctx.lineTo(x,y+16);ctx.stroke();}
  if(type===3){ctx.beginPath();ctx.arc(x-8,y+3,17,.2,Math.PI*2);ctx.arc(x+9,y+3,17,.2,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x,y-14);ctx.quadraticCurveTo(x+3,y-28,x+15,y-27);ctx.stroke();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(x-5,y+2,5,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawVolleyball(ctx,x,y,r,color){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=5;ctx.globalAlpha=.28;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x+Math.cos(i*2.09)*r*.45,y+Math.sin(i*2.09)*r*.45,r*.62,i*2.09-1.2,i*2.09+1.15);ctx.stroke();}ctx.restore();}

function drawIssueDecoration(ctx, variant, primary, secondary) {
  ctx.save(); const mode=Math.floor(variant/13); ctx.globalAlpha=.18; ctx.lineWidth=3;
  if(mode===0) drawVolleyball(ctx,1100,105,145,"#fff");
  if(mode===1){ctx.fillStyle=secondary;ctx.beginPath();ctx.moveTo(850,0);ctx.lineTo(1240,0);ctx.lineTo(1240,270);ctx.closePath();ctx.fill();}
  if(mode===2){ctx.strokeStyle="#fff";for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(1100,80,55+i*34,0,Math.PI*2);ctx.stroke();}}
  if(mode===3){ctx.strokeStyle="#fff";for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(850+i*70,0);ctx.lineTo(1050+i*40,390);ctx.stroke();}}
  if(mode===3){ctx.fillStyle=secondary;ctx.beginPath();ctx.moveTo(930,0);ctx.bezierCurveTo(1030,90,1050,260,1240,300);ctx.lineTo(1240,0);ctx.closePath();ctx.fill();}
  ctx.globalAlpha=.08;ctx.fillStyle="#fff";ctx.font=`700 ${150+(variant%4)*12}px Arial`;ctx.textAlign="right";ctx.fillText(String(variant+1).padStart(2,"0"),1190,370);ctx.restore();
}

function contentFrames(variant) {
  const mode=variant%13;
  if(mode===1) return Array.from({length:4},(_,index)=>({x:76+(index%2)*22,y:682+index*137,w:1088-(index%2)*22,h:119,style:"row"}));
  if(mode===2) return [
    {x:76,y:690,w:625,h:250,style:"magazine"},{x:721,y:690,w:443,h:250,style:"magazine"},
    {x:76,y:980,w:443,h:250,style:"magazine"},{x:539,y:980,w:625,h:250,style:"magazine"},
  ];
  if(mode===3) return Array.from({length:4},(_,index)=>({x:112,y:680+index*138,w:1016,h:121,style:"timeline"}));
  if(mode===4) return [
    {x:76,y:680,w:1088,h:180,style:"row"},{x:76,y:884,w:346,h:346,style:"magazine"},
    {x:447,y:884,w:346,h:346,style:"magazine"},{x:818,y:884,w:346,h:346,style:"magazine"},
  ];
  if(mode===5) return [
    {x:76,y:680,w:346,h:330,style:"magazine"},{x:447,y:680,w:346,h:330,style:"magazine"},
    {x:818,y:680,w:346,h:330,style:"magazine"},{x:76,y:1035,w:1088,h:195,style:"row"},
  ];
  if(mode===6) return [
    {x:76,y:680,w:425,h:255,style:"grid"},{x:76,y:965,w:425,h:265,style:"grid"},
    {x:526,y:680,w:638,h:255,style:"magazine"},{x:526,y:965,w:638,h:265,style:"magazine"},
  ];
  if(mode===7) return [
    {x:76,y:680,w:638,h:255,style:"magazine"},{x:739,y:680,w:425,h:255,style:"grid"},
    {x:76,y:965,w:638,h:265,style:"magazine"},{x:739,y:965,w:425,h:265,style:"grid"},
  ];
  if(mode===8) return Array.from({length:4},(_,index)=>({x:76+(index%2?70:0),y:680+index*137,w:1088-(index%2?70:0),h:119,style:"timeline"}));
  if(mode===9) return [
    {x:76,y:680,w:470,h:250,style:"grid"},{x:571,y:680,w:593,h:250,style:"magazine"},
    {x:76,y:980,w:593,h:250,style:"magazine"},{x:694,y:980,w:470,h:250,style:"grid"},
  ];
  if(mode===10) return [
    {x:76,y:680,w:516,h:230,style:"magazine"},{x:628,y:700,w:516,h:230,style:"magazine"},
    {x:76,y:970,w:516,h:230,style:"magazine"},{x:628,y:990,w:516,h:230,style:"magazine"},
  ];
  if(mode===11) return [
    {x:76,y:680,w:690,h:250,style:"magazine"},{x:791,y:680,w:373,h:250,style:"grid"},
    {x:76,y:980,w:373,h:250,style:"grid"},{x:474,y:980,w:690,h:250,style:"magazine"},
  ];
  if(mode===12) return Array.from({length:4},(_,index)=>({x:76+(index*17),y:680+index*137,w:1088-(index*34),h:119,style:index%2?"timeline":"row"}));
  return [
    {x:76,y:690,w:516,h:250,style:"grid"},{x:628,y:690,w:516,h:250,style:"grid"},
    {x:76,y:980,w:516,h:250,style:"grid"},{x:628,y:980,w:516,h:250,style:"grid"},
  ];
}

const newA4Canvas = () => { const canvas=document.createElement("canvas");canvas.width=1240;canvas.height=1754;const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,1240,1754);return {canvas,ctx}; };

function drawFeatureHeader(ctx, bulletin, club, logo, palette, pageNumber) {
  const navy=palette.dark,accent=palette.primary,secondary=palette.secondary;
  ctx.fillStyle=navy;ctx.fillRect(0,0,1240,265);ctx.fillStyle=accent;ctx.fillRect(0,0,16,265);
  rounded(ctx,70,45,128,128,28,"#fff");if(logo){const scale=Math.min(96/logo.width,96/logo.height),w=logo.width*scale,h=logo.height*scale;ctx.drawImage(logo,134-w/2,109-h/2,w,h);}
  ctx.fillStyle=secondary;ctx.font="700 18px Arial";ctx.fillText("SPORCU EĞİTİM BÜLTENİ",230,72);
  ctx.fillStyle="#fff";drawSingleLine(ctx,club?.schoolName||"Voleybol Spor Okulu",230,122,760,32,18);
  ctx.font="19px Arial";ctx.fillStyle="#d9e4ec";ctx.fillText(`${dateText(bulletin.date)}  •  SAYI ${String(bulletin.number).padStart(2,"0")}`,230,164);
}

async function createFirstBulletinArtworks(bulletin, club) {
  const logo=await getClubLogo(club),palette=logoPalette(logo),navy=palette.dark,accent=palette.primary,secondaryInk=shade(palette.secondary,.52),muted="#60738a",line="#dce6ed";
  const first=newA4Canvas(),second=newA4Canvas();
  drawFeatureHeader(first.ctx,bulletin,club,logo,palette,1);drawFeatureHeader(second.ctx,bulletin,club,logo,palette,2);
  const a=first.ctx;a.fillStyle=navy;drawSingleLine(a,"YENİ SEZONA HAZIRLANIYORUM",70,350,1100,52,30);a.fillStyle=accent;a.fillRect(70,378,220,8);
  a.fillStyle=muted;a.font="24px Arial";drawParagraph(a,bulletin.feature.opening,70,438,1090,34,4);
  a.fillStyle=navy;a.font="700 22px Arial";a.fillText("SEZONA ÜÇ YÖNDEN HAZIRLAN",70,610);
  const pillars=[["01","FİZİKSEL HAZIRLIK",bulletin.feature.physical,accent],["02","ZİHİNSEL HAZIRLIK",bulletin.feature.mental,secondaryInk],["03","GÜNLÜK DÜZEN",bulletin.feature.organization,shade(accent,.68)]];
  pillars.forEach(([number,title,text,color],i)=>{const x=70+i*368;rounded(a,x,648,340,345,25,"#f5f8fa",line);rounded(a,x+22,672,58,58,17,color);a.fillStyle="#fff";a.font="700 21px Arial";a.textAlign="center";a.fillText(number,x+51,709);a.textAlign="left";a.fillStyle=color;a.font="700 18px Arial";a.fillText(title,x+22,773);a.fillStyle=navy;a.font="19px Arial";drawParagraph(a,text,x+22,817,295,27,6);});
  rounded(a,70,1040,528,485,26,"#fff",line);a.fillStyle=accent;a.font="700 20px Arial";a.fillText("İLK HAFTA HEDEFLERİM",100,1090);bulletin.feature.goals.forEach((item,i)=>{const y=1142+i*82;a.strokeStyle=accent;a.lineWidth=3;a.strokeRect(100,y-21,25,25);a.fillStyle=navy;a.font="20px Arial";drawParagraph(a,item,145,y,410,27,2);});
  rounded(a,626,1040,544,485,26,"#fff",line);a.fillStyle=secondaryInk;a.font="700 20px Arial";a.fillText("HAZIRLIK KONTROL LİSTEM",656,1090);bulletin.feature.readiness.forEach((item,i)=>{const y=1138+i*59;a.strokeStyle=secondaryInk;a.lineWidth=3;a.strokeRect(656,y-18,22,22);a.fillStyle=navy;a.font="18px Arial";drawParagraph(a,item,695,y,435,24,2);});
  a.fillStyle=muted;a.font="17px Arial";a.fillText("Hazırlığını tamamladığında bu sayfayı antrenörün veya ailenle birlikte değerlendirebilirsin.",70,1610);a.fillStyle=navy;a.font="700 18px Arial";a.fillText("voleybolokullari.com.tr",70,1685);a.fillStyle=accent;a.textAlign="right";a.fillText("1 / 2",1170,1685);a.textAlign="left";

  const b=second.ctx;b.fillStyle=navy;drawSingleLine(b,"İLK HAFTA SPORCU REHBERİ",70,345,1100,49,30);b.fillStyle=accent;b.fillRect(70,375,220,8);
  b.fillStyle=muted;b.font="23px Arial";drawParagraph(b,"Yeni sezonun ilk haftasında amaç yüksek tempoya bir anda ulaşmak değil; doğru hazırlık, kontrollü antrenman ve kaliteli toparlanmayla sürdürülebilir bir başlangıç yapmaktır.",70,430,1090,32,4);
  const routine=[["ANTRENMAN ÖNCESİ",bulletin.feature.before,accent],["ANTRENMAN SIRASINDA",bulletin.feature.during,secondaryInk],["ANTRENMAN SONRASI",bulletin.feature.after,shade(accent,.68)]];
  b.strokeStyle=line;b.lineWidth=4;b.beginPath();b.moveTo(115,620);b.lineTo(115,1040);b.stroke();routine.forEach(([title,text,color],i)=>{const y=610+i*155;b.fillStyle=color;b.beginPath();b.arc(115,y+33,24,0,Math.PI*2);b.fill();b.fillStyle="#fff";b.font="700 17px Arial";b.textAlign="center";b.fillText(String(i+1),115,y+39);b.textAlign="left";b.fillStyle=color;b.font="700 19px Arial";b.fillText(title,165,y+16);b.fillStyle=navy;b.font="19px Arial";drawParagraph(b,text,165,y+55,950,27,4);});
  const info=[["SPORCU BESLENMESİ",bulletin.feature.nutrition,accent],["SPOR PSİKOLOJİSİ",bulletin.feature.psychology,secondaryInk],["GÜVENLİK KURALI",bulletin.feature.safety,shade(accent,.68)]];
  info.forEach(([title,text,color],i)=>{const x=70+i*368;rounded(b,x,1110,340,300,23,"#f5f8fa",line);b.fillStyle=color;b.fillRect(x,1110,340,8);b.fillStyle=color;b.font="700 17px Arial";b.fillText(title,x+22,1160);b.fillStyle=navy;b.font="17px Arial";drawParagraph(b,text,x+22,1205,296,23,7);});
  rounded(b,70,1450,1100,190,25,"#fff4ec",shade(accent,.82));b.fillStyle=accent;b.font="700 19px Arial";b.fillText("BU HAFTANIN SPORCU GÖREVİ",100,1495);b.fillStyle=navy;b.font="700 20px Arial";drawParagraph(b,bulletin.feature.weeklyMission,100,1538,1030,27,4);
  b.fillStyle=navy;b.font="700 18px Arial";b.fillText("voleybolokullari.com.tr",70,1690);b.fillStyle=accent;b.textAlign="right";b.fillText("2 / 2",1170,1690);b.textAlign="left";
  return [first.canvas,second.canvas];
}

async function createSecondBulletinArtworks(bulletin, club) {
  const logo=await getClubLogo(club),palette=logoPalette(logo),navy=palette.dark,accent=palette.primary,secondary=shade(palette.secondary,.52),muted="#60738a",line="#dce6ed",data=bulletin.goalFeature;
  const first=newA4Canvas(),secondPage=newA4Canvas();drawFeatureHeader(first.ctx,bulletin,club,logo,palette,1);drawFeatureHeader(secondPage.ctx,bulletin,club,logo,palette,2);
  const a=first.ctx;a.fillStyle=navy;drawSingleLine(a,"SEZON HEDEFLERİMİ BELİRLİYORUM",70,345,1090,48,27);a.fillStyle=accent;a.fillRect(70,375,255,8);
  a.fillStyle=muted;a.font="23px Arial";drawParagraph(a,data.opening,70,430,780,32,4);
  a.save();a.translate(1040,455);[95,69,43,17].forEach((radius,index)=>{a.strokeStyle=index%2?secondary:accent;a.lineWidth=12;a.beginPath();a.arc(0,0,radius,0,Math.PI*2);a.stroke();});a.fillStyle=navy;a.beginPath();a.arc(0,0,8,0,Math.PI*2);a.fill();a.restore();
  rounded(a,70,590,1100,175,25,"#f5f8fa",line);a.fillStyle=accent;a.font="700 19px Arial";a.fillText("KONTROL EDEBİLDİĞİN ALANA ODAKLAN",100,636);a.fillStyle=navy;a.font="20px Arial";drawParagraph(a,data.principle,100,680,1035,27,4);
  a.fillStyle=navy;a.font="700 21px Arial";a.fillText("ÜÇ HEDEF ALANI",70,825);
  data.goalTypes.forEach(([title,text],index)=>{const y=860+index*172,color=[accent,secondary,shade(accent,.67)][index];rounded(a,70,y,1100,145,22,"#fff",line);rounded(a,91,y+27,70,70,20,color);a.fillStyle="#fff";a.font="700 23px Arial";a.textAlign="center";a.fillText(String(index+1).padStart(2,"0"),126,y+71);a.textAlign="left";a.fillStyle=color;a.font="700 19px Arial";a.fillText(title,190,y+42);a.fillStyle=navy;a.font="18px Arial";drawParagraph(a,text,190,y+79,925,24,3);});
  a.fillStyle=navy;a.font="700 21px Arial";a.fillText("HEDEFİMİ OLUŞTURMA ADIMLARI",70,1415);
  data.goalSteps.forEach(([number,title],index)=>{const x=70+index*276;rounded(a,x,1450,250,100,20,index%2?"#f5f8fa":"#fff",line);a.fillStyle=index%2?secondary:accent;a.font="700 17px Arial";a.fillText(number,x+20,1484);a.fillStyle=navy;a.font="700 18px Arial";a.fillText(title,x+20,1520);});
  a.fillStyle=muted;a.font="16px Arial";a.fillText("Hedefin sana ait, uygulanabilir ve takip edilebilir olsun.",70,1620);a.fillStyle=navy;a.font="700 18px Arial";a.fillText("voleybolokullari.com.tr",70,1688);a.fillStyle=accent;a.textAlign="right";a.fillText("1 / 2",1170,1688);a.textAlign="left";

  const b=secondPage.ctx;b.fillStyle=navy;drawSingleLine(b,"HEDEFİ PLANA DÖNÜŞTÜR",70,345,1090,48,28);b.fillStyle=accent;b.fillRect(70,375,220,8);
  rounded(b,70,420,1100,175,24,"#fff4ec",shade(accent,.82));b.fillStyle=accent;b.font="700 18px Arial";b.fillText("ÖRNEK: GENEL İFADEDEN NET HEDEFE",100,463);b.fillStyle=navy;b.font="20px Arial";drawParagraph(b,data.example,100,507,1030,28,4);
  b.fillStyle=navy;b.font="700 21px Arial";b.fillText("DÖRT HAFTALIK UYGULAMA YOLU",70,660);b.strokeStyle=line;b.lineWidth=5;b.beginPath();b.moveTo(132,725);b.lineTo(1100,725);b.stroke();data.plan.forEach(([week,text],index)=>{const x=70+index*276,color=index%2?secondary:accent;b.fillStyle=color;b.beginPath();b.arc(x+60,725,27,0,Math.PI*2);b.fill();b.fillStyle="#fff";b.font="700 16px Arial";b.textAlign="center";b.fillText(String(index+1),x+60,731);b.textAlign="left";b.fillStyle=color;b.font="700 17px Arial";b.fillText(week,x+20,790);b.fillStyle=navy;b.font="16px Arial";drawParagraph(b,text,x+20,826,235,22,5);});
  b.fillStyle=navy;b.font="700 21px Arial";b.fillText("ENGELİ ÖNCEDEN GÖR, ÇÖZÜMÜNÜ HAZIRLA",70,980);
  data.obstacles.forEach(([obstacle,solution],index)=>{const col=index%2,row=Math.floor(index/2),x=70+col*558,y=1015+row*170;rounded(b,x,y,530,145,21,"#f5f8fa",line);b.fillStyle=index%2?secondary:accent;b.font="700 17px Arial";b.fillText(obstacle.toLocaleUpperCase("tr-TR"),x+24,y+38);b.fillStyle=navy;b.font="17px Arial";drawParagraph(b,solution,x+24,y+76,480,23,3);});
  rounded(b,70,1378,1100,115,24,navy);b.fillStyle=palette.secondary;b.font="700 17px Arial";b.fillText("TAKIMA VERDİĞİM SÖZ",100,1417);b.fillStyle="#fff";b.font="18px Arial";drawParagraph(b,data.teamPromise,100,1454,1030,24,2);
  rounded(b,70,1520,730,145,24,"#fff4ec",shade(accent,.82));b.fillStyle=accent;b.font="700 17px Arial";b.fillText("BU HAFTANIN GÖREVİ",95,1558);b.fillStyle=navy;b.font="17px Arial";drawParagraph(b,data.mission,95,1595,675,23,3);
  rounded(b,825,1520,345,145,24,"#fff",line);b.fillStyle=secondary;b.font="700 16px Arial";b.fillText("KENDİME SORUYORUM",850,1558);data.questions.forEach((item,index)=>{b.fillStyle=navy;b.font="15px Arial";drawParagraph(b,`• ${item}`,850,1592+index*29,290,19,2);});
  b.fillStyle=navy;b.font="700 18px Arial";b.fillText("voleybolokullari.com.tr",70,1710);b.fillStyle=accent;b.textAlign="right";b.fillText("2 / 2",1170,1710);b.textAlign="left";
  return [first.canvas,secondPage.canvas];
}

function drawCampBackpack(ctx,x,y,color,secondary) {
  ctx.save();ctx.lineWidth=10;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.fillStyle=color;ctx.globalAlpha=.10;ctx.beginPath();ctx.arc(x,y,145,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle=color;ctx.fillStyle="#fff";ctx.beginPath();ctx.roundRect(x-72,y-85,144,185,34);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.arc(x,y-79,42,Math.PI,0);ctx.stroke();
  ctx.fillStyle=secondary;ctx.beginPath();ctx.roundRect(x-56,y+15,112,66,20);ctx.fill();
  ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(x-74,y-45);ctx.quadraticCurveTo(x-116,y+5,x-92,y+82);ctx.moveTo(x+74,y-45);ctx.quadraticCurveTo(x+116,y+5,x+92,y+82);ctx.stroke();
  ctx.strokeStyle="#fff";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-30,y+47);ctx.lineTo(x+30,y+47);ctx.stroke();ctx.restore();
}

function drawCoverPhoto(ctx,image,x,y,width,height,radius=26) {
  if(!image) return;
  const scale=Math.max(width/image.width,height/image.height),drawWidth=image.width*scale,drawHeight=image.height*scale;
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,width,height,radius);ctx.clip();ctx.drawImage(image,x+(width-drawWidth)/2,y+(height-drawHeight)/2,drawWidth,drawHeight);ctx.restore();
}

async function createThirdBulletinArtworks(bulletin, club) {
  const logo=await getClubLogo(club),palette=logoPalette(logo),navy=palette.dark,accent=palette.primary,secondary=shade(palette.secondary,.52),muted="#60738a",line="#dce6ed",data=bulletin.campFeature;
  const first=newA4Canvas(),secondPage=newA4Canvas();drawFeatureHeader(first.ctx,bulletin,club,logo,palette,1);drawFeatureHeader(secondPage.ctx,bulletin,club,logo,palette,2);
  const a=first.ctx;a.fillStyle=navy;drawSingleLine(a,"KAMP ÇANTAM VE KİŞİSEL HAZIRLIĞIM",70,345,1090,47,25);a.fillStyle=accent;a.fillRect(70,375,290,8);
  a.fillStyle=muted;a.font="22px Arial";drawParagraph(a,data.opening,70,430,760,31,6);drawCampBackpack(a,1040,470,accent,palette.secondary);
  a.fillStyle=navy;a.font="700 21px Arial";a.fillText("KAMPA ÜÇ ADIMDA HAZIRLAN",70,650);
  data.principles.forEach(([title,text],index)=>{const x=70+index*368,color=[accent,secondary,shade(accent,.68)][index];rounded(a,x,685,340,225,24,index===1?"#f5f8fa":"#fff",line);rounded(a,x+22,708,52,52,15,color);a.fillStyle="#fff";a.font="700 18px Arial";a.textAlign="center";a.fillText(String(index+1).padStart(2,"0"),x+48,742);a.textAlign="left";a.fillStyle=color;a.font="700 18px Arial";a.fillText(title,x+91,742);a.fillStyle=navy;a.font="17px Arial";drawParagraph(a,text,x+22,794,296,23,5);});
  a.fillStyle=navy;a.font="700 21px Arial";a.fillText("KAMP ÇANTASI KONTROL LİSTEM",70,970);
  data.bagGroups.forEach(([title,items],index)=>{const col=index%2,row=Math.floor(index/2),x=70+col*558,y=1005+row*285,color=index%2?secondary:accent;rounded(a,x,y,530,260,24,index%3===0?"#fff5ee":"#f5f8fa",line);a.fillStyle=color;a.fillRect(x,y,10,260);a.fillStyle=color;a.font="700 18px Arial";a.fillText(title,x+32,y+43);items.forEach((item,itemIndex)=>{const itemY=y+84+itemIndex*39;a.strokeStyle=color;a.lineWidth=3;a.strokeRect(x+33,itemY-18,19,19);a.fillStyle=navy;a.font="16px Arial";drawParagraph(a,item,x+65,itemY,425,20,2);});});
  a.fillStyle=muted;a.font="16px Arial";a.fillText("Listeyi kampın süresine, hava koşullarına ve antrenörünün yönergelerine göre güncelle.",70,1627);a.fillStyle=navy;a.font="700 18px Arial";a.fillText("voleybolokullari.com.tr",70,1690);a.fillStyle=accent;a.textAlign="right";a.fillText("1 / 2",1170,1690);a.textAlign="left";

  const b=secondPage.ctx;b.fillStyle=navy;drawSingleLine(b,"KAMP GÜNÜ HAZIRLIK REHBERİ",70,345,1090,47,27);b.fillStyle=accent;b.fillRect(70,375,255,8);
  [["BİR GECE ÖNCE",data.dayBefore,accent],["YOLCULUK SABAHI",data.travelMorning,secondary]].forEach(([title,text,color],index)=>{const x=70+index*558;rounded(b,x,420,530,230,24,index?"#f5f8fa":"#fff5ee",line);b.fillStyle=color;b.font="700 18px Arial";b.fillText(title,x+28,465);b.fillStyle=navy;b.font="18px Arial";drawParagraph(b,text,x+28,510,474,25,6);});
  b.fillStyle=navy;b.font="700 21px Arial";b.fillText("ÇANTAYI HAZIRLAMA SIRAM",70,715);
  data.packingSteps.forEach(([number,title,text],index)=>{const x=70+index*276,color=index%2?secondary:accent;rounded(b,x,750,250,172,22,"#fff",line);rounded(b,x+20,770,52,52,15,color);b.fillStyle="#fff";b.font="700 17px Arial";b.textAlign="center";b.fillText(number,x+46,804);b.textAlign="left";b.fillStyle=color;b.font="700 16px Arial";b.fillText(title,x+84,802);b.fillStyle=navy;b.font="15px Arial";drawParagraph(b,text,x+20,850,208,20,4);});
  b.fillStyle=navy;b.font="700 21px Arial";b.fillText("KAMPTA GÜNLÜK KİŞİSEL DÜZENİM",70,985);
  data.routines.forEach(([title,text],index)=>{const y=1020+index*126,color=[accent,secondary,shade(accent,.68)][index];rounded(b,70,y,1100,108,20,index===1?"#f5f8fa":"#fff",line);rounded(b,92,y+18,70,70,18,color);drawTopicIcon(b,index,127,y+53,"#fff");b.fillStyle=color;b.font="700 17px Arial";b.fillText(title,192,y+36);b.fillStyle=navy;b.font="16px Arial";drawParagraph(b,text,192,y+68,930,21,3);});
  rounded(b,70,1405,520,130,22,"#f5f8fa",line);b.fillStyle=accent;b.font="700 16px Arial";b.fillText("HİJYEN VE GÜVENLİK",96,1442);b.fillStyle=navy;b.font="13px Arial";drawParagraph(b,`✓ ${data.hygiene[0]} ✓ ${data.hygiene[1]} ${data.safety}`,96,1474,460,17,4);
  rounded(b,614,1405,556,130,22,"#fff5ee",shade(accent,.82));b.fillStyle=secondary;b.font="700 16px Arial";b.fillText("ZİHİNSEL HAZIRLIK",640,1442);b.fillStyle=navy;b.font="13px Arial";drawParagraph(b,data.mindset,640,1474,500,17,4);
  rounded(b,70,1560,1100,105,22,navy);b.fillStyle=palette.secondary;b.font="700 16px Arial";b.fillText("BU HAFTANIN SPORCU GÖREVİ",96,1595);b.fillStyle="#fff";b.font="13px Arial";drawParagraph(b,data.weeklyMission,96,1622,1035,17,3);
  b.fillStyle=navy;b.font="700 18px Arial";b.fillText("voleybolokullari.com.tr",70,1710);b.fillStyle=accent;b.textAlign="right";b.fillText("2 / 2",1170,1710);b.textAlign="left";
  return [first.canvas,secondPage.canvas];
}

async function createCampBulletinArtworks(bulletin, club) {
  const [logo,bagPhoto,readyPhoto]=await Promise.all([
    getClubLogo(club),
    loadImage("/bulletins/camp-bag-preparation.png"),
    loadImage("/bulletins/camp-morning-ready.png"),
  ]);
  const palette=logoPalette(logo),navy=palette.dark,accent=palette.primary,secondary=shade(palette.secondary,.52),muted="#60738a",line="#dce6ed",data=bulletin.campFeature;
  const first=newA4Canvas(),secondPage=newA4Canvas();drawFeatureHeader(first.ctx,bulletin,club,logo,palette,1);drawFeatureHeader(secondPage.ctx,bulletin,club,logo,palette,2);

  const a=first.ctx;
  a.fillStyle=navy;drawSingleLine(a,"KAMP ÇANTAM",70,345,600,52,30);drawSingleLine(a,"VE KİŞİSEL HAZIRLIĞIM",70,405,620,43,24);a.fillStyle=accent;a.fillRect(70,435,260,8);
  a.fillStyle=muted;a.font="21px Arial";drawParagraph(a,data.opening,70,490,610,29,6);
  rounded(a,735,325,445,570,30,accent);drawCoverPhoto(a,bagPhoto,715,305,445,570,30);
  rounded(a,744,815,386,42,21,navy);a.fillStyle="#fff";a.font="700 15px Arial";a.textAlign="center";a.fillText("HAZIRLA  •  KONTROL ET  •  SAHAYA ODAKLAN",937,842);a.textAlign="left";
  a.fillStyle=navy;a.font="700 20px Arial";a.fillText("KAMPA ÜÇ ADIMDA HAZIRLAN",70,700);
  data.principles.forEach(([title,text],index)=>{const y=730+index*92,color=[accent,secondary,shade(accent,.68)][index];rounded(a,70,y,610,85,18,index===1?"#f5f8fa":"#fff",line);rounded(a,88,y+17,50,50,14,color);a.fillStyle="#fff";a.font="700 17px Arial";a.textAlign="center";a.fillText(String(index+1).padStart(2,"0"),113,y+49);a.textAlign="left";a.fillStyle=color;a.font="700 14px Arial";a.fillText(title,158,y+26);a.fillStyle=navy;a.font="13px Arial";drawParagraph(a,text,158,y+49,490,15,3);});
  a.fillStyle=navy;a.font="700 21px Arial";a.fillText("KAMP ÇANTASI KONTROL LİSTEM",70,1030);
  data.bagGroups.forEach(([title,items],index)=>{const col=index%2,row=Math.floor(index/2),x=70+col*558,y=1065+row*260,color=index%2?secondary:accent;rounded(a,x,y,530,236,23,index%3===0?"#fff4ec":"#f5f8fa",line);a.fillStyle=color;a.fillRect(x,y,10,236);a.fillStyle=color;a.font="700 17px Arial";a.fillText(`${String(index+1).padStart(2,"0")}  ${title}`,x+32,y+40);items.forEach((item,itemIndex)=>{const itemY=y+78+itemIndex*37;a.strokeStyle=color;a.lineWidth=3;a.strokeRect(x+33,itemY-17,18,18);a.fillStyle=navy;a.font="15px Arial";drawParagraph(a,item,x+64,itemY,425,18,2);});});
  rounded(a,70,1590,1100,55,17,"#f5f8fa",line);a.fillStyle=muted;a.font="15px Arial";a.fillText("Çantanı kamp süresine, hava koşullarına ve antrenörünün paylaştığı programa göre son kez kontrol et.",96,1625);
  a.fillStyle=navy;a.font="700 18px Arial";a.fillText("voleybolokullari.com.tr",70,1700);a.fillStyle=accent;a.textAlign="right";a.fillText("1 / 2",1170,1700);a.textAlign="left";

  const b=secondPage.ctx;
  rounded(b,70,315,445,520,30,accent);drawCoverPhoto(b,readyPhoto,55,300,445,520,30);
  rounded(b,85,740,385,50,24,navy);b.fillStyle="#fff";b.font="700 16px Arial";b.textAlign="center";b.fillText("KAMP SABAHI HAZIRIM",278,772);b.textAlign="left";
  b.fillStyle=navy;drawSingleLine(b,"KAMP GÜNÜ",545,350,620,48,28);drawSingleLine(b,"HAZIRLIK REHBERİ",545,405,620,42,24);b.fillStyle=accent;b.fillRect(545,435,220,8);
  [["BİR GECE ÖNCE",data.dayBefore,accent],["YOLCULUK SABAHI",data.travelMorning,secondary]].forEach(([title,text,color],index)=>{const y=480+index*175;rounded(b,545,y,625,155,22,index?"#f5f8fa":"#fff4ec",line);b.fillStyle=color;b.font="700 17px Arial";b.fillText(title,572,y+39);b.fillStyle=navy;b.font="16px Arial";drawParagraph(b,text,572,y+76,570,21,4);});
  b.fillStyle=navy;b.font="700 21px Arial";b.fillText("ÇANTAYI HAZIRLAMA SIRAM",70,895);
  data.packingSteps.forEach(([number,title,text],index)=>{const x=70+index*276,color=index%2?secondary:accent;rounded(b,x,930,250,174,22,"#fff",line);rounded(b,x+20,950,52,52,15,color);b.fillStyle="#fff";b.font="700 17px Arial";b.textAlign="center";b.fillText(number,x+46,984);b.textAlign="left";b.fillStyle=color;b.font="700 15px Arial";b.fillText(title,x+84,982);b.fillStyle=navy;b.font="14px Arial";drawParagraph(b,text,x+20,1032,208,18,4);});
  b.fillStyle=navy;b.font="700 21px Arial";b.fillText("KAMPTA GÜNLÜK DÜZENİM",70,1162);
  data.routines.forEach(([title,text],index)=>{const x=70+index*368,color=[accent,secondary,shade(accent,.68)][index];rounded(b,x,1195,340,220,22,index===1?"#f5f8fa":"#fff",line);drawTopicIcon(b,index,x+55,1245,color);b.fillStyle=color;b.font="700 16px Arial";b.fillText(title,x+95,1235);b.fillStyle=navy;b.font="15px Arial";drawParagraph(b,text,x+28,1300,284,20,5);});
  rounded(b,70,1450,530,190,22,"#f5f8fa",line);b.fillStyle=accent;b.font="700 16px Arial";b.fillText("GÜVENLİK VE ZİHİNSEL HAZIRLIK",96,1489);b.fillStyle=navy;b.font="14px Arial";drawParagraph(b,`${data.safety} ${data.mindset}`,96,1526,475,18,6);
  rounded(b,625,1450,545,190,22,navy);b.fillStyle=palette.secondary;b.font="700 16px Arial";b.fillText("BU HAFTANIN SPORCU GÖREVİ",651,1489);b.fillStyle="#fff";b.font="14px Arial";drawParagraph(b,data.weeklyMission,651,1526,490,19,6);
  b.fillStyle=navy;b.font="700 18px Arial";b.fillText("voleybolokullari.com.tr",70,1700);b.fillStyle=accent;b.textAlign="right";b.fillText("2 / 2",1170,1700);b.textAlign="left";
  return [first.canvas,secondPage.canvas];
}

async function getClubLogo(club) {
  const raw = club?.teamLogo || club?.logoUrl || "/brand-logo.png";
  const sources = /^https?:/i.test(raw)
    ? [`https://images.weserv.nl/?url=${encodeURIComponent(raw)}&w=360&h=360&fit=contain&output=png`, raw, "/brand-logo.png"]
    : [raw, "/brand-logo.png"];
  for (const source of sources) { try { return await loadImage(source); } catch { /* sıradaki güvenli kaynağı dene */ } }
  return null;
}

const drawParagraph = (ctx, text, x, y, width, lineHeight, maxLines=5) => {
  const lines = wrapLines(ctx, text, width).slice(0, maxLines);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
};

const drawSingleLine = (ctx, text, x, y, maxWidth, startSize, minSize=16, weight=700) => {
  const value=String(text || "").toLocaleUpperCase("tr-TR"); let size=startSize;
  do { ctx.font=`${weight} ${size}px Arial`; if(ctx.measureText(value).width<=maxWidth) break; size-=1; } while(size>minSize);
  ctx.fillText(value,x,y); return size;
};

async function createBulletinArtwork(bulletin, club) {
  const canvas = document.createElement("canvas"); canvas.width = 1240; canvas.height = 1754;
  const ctx = canvas.getContext("2d");
  const logo = await getClubLogo(club); const palette=logoPalette(logo);
  const navy = palette.dark, orange = palette.primary, secondary=palette.secondary, secondaryInk=shade(palette.secondary,.52), pale = "#f3f7fa", muted = "#60738a";
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = navy; ctx.fillRect(0, 0, 1240, 390);
  ctx.fillStyle = orange; ctx.fillRect(0, 0, 18, 390);
  drawIssueDecoration(ctx,bulletin.designVariant,orange,secondary);
  rounded(ctx, 76, 62, 160, 160, 34, "#fff");
  if (logo) {
    const scale = Math.min(120 / logo.width, 120 / logo.height);
    const width = logo.width * scale, height = logo.height * scale;
    ctx.drawImage(logo, 156 - width / 2, 142 - height / 2, width, height);
  } else { ctx.fillStyle = orange; ctx.font = "700 52px Arial"; ctx.fillText("VA", 112, 160); }
  ctx.fillStyle = secondary; ctx.font = "700 22px Arial"; ctx.letterSpacing = "3px";
  ctx.fillText("SPORCU EĞİTİM BÜLTENİ", 278, 94);
  ctx.fillStyle = "#fff";
  drawSingleLine(ctx, club?.schoolName || "Voleybol Spor Okulu", 278, 158, 790, 39, 20);
  ctx.fillStyle = "#b9c9d9"; ctx.font = "24px Arial";
  ctx.fillText(`${bulletin.number}. HAFTA  •  ${dateText(bulletin.date)}  •  ${bulletin.phase}`, 278, 250);
  rounded(ctx, 1015, 294, 149, 49, 24, orange);
  ctx.fillStyle="#fff"; ctx.font="700 18px Arial"; ctx.textAlign="center"; ctx.fillText(`SAYI ${String(bulletin.number).padStart(2,"0")}`,1089,326); ctx.textAlign="left";
  ctx.fillStyle = "#fff";
  drawSingleLine(ctx, bulletin.title, 76, 337, 890, 48, 27);

  ctx.fillStyle = orange; ctx.font = "700 18px Arial"; ctx.fillText("BU HAFTANIN ODAĞI", 76, 454);
  ctx.fillStyle = navy; drawSingleLine(ctx, bulletin.phaseFocus, 76, 506, 1080, 42, 25);
  ctx.fillStyle = muted; ctx.font = "23px Arial";
  drawParagraph(ctx, bulletin.intro, 76, 554, 1080, 32, 4);

  const sourceBlocks = [
    ["ANTRENMAN ÖNCESİ", bulletin.preTraining, orange,0], ["ANTRENMAN SONRASI", bulletin.postTraining, secondaryInk,1],
    ["SPOR PSİKOLOJİSİ", bulletin.psychology, shade(secondary,.45),2], ["SPORCU BESLENMESİ", bulletin.nutrition, shade(orange,.65),3],
  ];
  const shift=bulletin.designVariant%4; const blocks=[...sourceBlocks.slice(shift),...sourceBlocks.slice(0,shift)];
  const frames=contentFrames(bulletin.designVariant); const layoutMode=bulletin.designVariant%13;
  ctx.save();ctx.globalAlpha=.055;ctx.strokeStyle=orange;ctx.lineWidth=2;
  if(layoutMode===0){ctx.beginPath();ctx.moveTo(610,675);ctx.lineTo(610,1242);ctx.moveTo(60,960);ctx.lineTo(1175,960);ctx.stroke();}
  if(layoutMode===3){ctx.beginPath();ctx.moveTo(83,700);ctx.lineTo(83,1215);ctx.stroke();}
  ctx.restore();
  blocks.forEach(([label, text, color, iconType], index) => {
    const frame=frames[index],{x,y,w,h}=frame;
    const cardRadius=10+bulletin.designVariant*.36;
    rounded(ctx, x, y, w, h, cardRadius, bulletin.designVariant%2 ? "#ffffff" : pale, "#dce6ed");
    if(frame.style==="grid"){
      ctx.fillStyle=color;ctx.fillRect(x,y,9,h);drawTopicIcon(ctx,iconType,x+55,y+55,color);
      ctx.fillStyle=color;ctx.font="700 18px Arial";ctx.fillText(`${String(index+1).padStart(2,"0")}  ${label}`,x+102,y+61);
      ctx.fillStyle=navy;ctx.font=w<470?"16px Arial":"18px Arial";const gridLine=w<470?20:23;drawParagraph(ctx,text,x+34,y+101,w-70,gridLine,Math.max(5,Math.floor((h-110)/gridLine)));
    } else if(frame.style==="row"){
      ctx.fillStyle=color;ctx.fillRect(x,y,w,7);drawTopicIcon(ctx,iconType,x+52,y+61,color);
      ctx.fillStyle=color;ctx.font="700 17px Arial";ctx.fillText(`${String(index+1).padStart(2,"0")}  ${label}`,x+98,y+37);
      ctx.fillStyle=navy;ctx.font="16px Arial";drawParagraph(ctx,text,x+98,y+65,w-125,20,Math.max(3,Math.floor((h-72)/20)));
    } else if(frame.style==="magazine"){
      ctx.save();ctx.globalAlpha=.10;ctx.fillStyle=color;ctx.fillRect(x,y,w,h);ctx.restore();
      drawTopicIcon(ctx,iconType,x+w-58,y+53,color);ctx.fillStyle=color;ctx.font="700 17px Arial";ctx.fillText(`${String(index+1).padStart(2,"0")}  ${label}`,x+28,y+48);
      const magazineFont=w<400?15:w<500?16:18;const magazineLine=w<400?19:w<500?21:22;ctx.fillStyle=navy;ctx.font=`${magazineFont}px Arial`;drawParagraph(ctx,text,x+28,y+89,w-56,magazineLine,Math.max(5,Math.floor((h-100)/magazineLine)));
    } else {
      ctx.fillStyle=color;ctx.beginPath();ctx.arc(x-29,y+60,22,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="700 16px Arial";ctx.textAlign="center";ctx.fillText(String(index+1),x-29,y+66);ctx.textAlign="left";
      drawTopicIcon(ctx,iconType,x+45,y+60,color);ctx.fillStyle=color;ctx.font="700 17px Arial";ctx.fillText(label,x+92,y+39);
      ctx.fillStyle=navy;ctx.font="16px Arial";drawParagraph(ctx,text,x+92,y+68,w-120,20,Math.max(3,Math.floor((h-75)/20)));
    }
  });
  rounded(ctx, 76, 1292, 1088, 218, 28, "#fff3eb", "#ffc5a4");
  ctx.fillStyle = orange; ctx.font = "700 19px Arial"; ctx.fillText("ANTRENMAN TÜYOSU VE HAFTANIN TAVSİYESİ", 112, 1343);
  ctx.fillStyle = navy; ctx.font = "700 19px Arial"; drawParagraph(ctx, `${bulletin.trainingTip} ${bulletin.athleteAdvice}`, 112, 1388, 1010, 26, 5);
  ctx.fillStyle = navy; ctx.font = "700 18px Arial"; ctx.fillText("HAFTALIK KONTROLÜM",76,1547);
  ctx.font = "17px Arial"; bulletin.selfCheck.forEach((item,index)=>{const x=76+index*362;ctx.strokeStyle="#9eb0bf";ctx.strokeRect(x,1570,20,20);ctx.fillStyle=muted;drawParagraph(ctx,item,x+31,1587,310,23,2);});
  ctx.fillStyle = muted; ctx.font = "17px Arial"; ctx.fillText("Güvenliğin için tüm uygulamalarda antrenörünün yönlendirmesini izle.", 76, 1660);
  ctx.fillStyle = navy; ctx.font = "700 19px Arial"; ctx.fillText("voleybolokullari.com.tr", 76, 1705);
  ctx.fillStyle = orange; ctx.textAlign = "right"; ctx.fillText(`${bulletin.number} / ${bulletinPeriod.total}`, 1164, 1705); ctx.textAlign = "left";

  return canvas;
}

async function createBulletinPdf(bulletin, club) {
  const canvases = bulletin.number===1 ? await createFirstBulletinArtworks(bulletin,club) : bulletin.number===2 ? await createSecondBulletinArtworks(bulletin,club) : bulletin.number===3 ? await createCampBulletinArtworks(bulletin,club) : [await createBulletinArtwork(bulletin, club)];
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  canvases.forEach((canvas,index)=>{if(index)pdf.addPage("a4","portrait");pdf.addImage(canvas.toDataURL("image/jpeg",.9),"JPEG",0,0,210,297,undefined,"FAST");});
  return {
    blob: pdf.output("blob"),
    fileName: `${safeName(club?.schoolName)}-${bulletin.date}-egitim-bulteni.pdf`,
  };
}

export default function BulletinsPage({ club, go }) {
  const [managedBulletins, setManagedBulletins] = useState(() => {
    try { return applyBulletinManagement(JSON.parse(localStorage.getItem("volleyballBulletinManagement") || "[]")); }
    catch { return applyBulletinManagement([]); }
  });
  const firstManagedDate = managedBulletins[0]?.date ? new Date(`${managedBulletins[0].date}T12:00:00Z`) : new Date();
  const initialYear = Math.min(CALENDAR_END_YEAR, Math.max(CALENDAR_START_YEAR, firstManagedDate.getUTCFullYear()));
  const [calendarYear, setCalendarYear] = useState(initialYear);
  const [calendarMonth, setCalendarMonth] = useState(firstManagedDate.getUTCFullYear() === initialYear ? firstManagedDate.getUTCMonth() : 8);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(""); const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState([]); const [previewLoading, setPreviewLoading] = useState(true);
  const storageKey = `volleyballBulletinsSent:${club?.id || club?.schoolName || "club"}`;
  const [sent, setSent] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; } });
  const calendarEntries = useMemo(() => buildCalendarEntries(managedBulletins), [managedBulletins]);
  const calendarPeriodText = calendarEntries.length ? `${dateText(calendarEntries[0].date)} – ${dateText(calendarEntries.at(-1).date)}` : "Yayın planı bulunmuyor";
  const monthEntries = useMemo(() => calendarEntries.filter((item) => {
    const date = new Date(`${item.date}T12:00:00Z`);
    return date.getUTCFullYear() === calendarYear && date.getUTCMonth() === calendarMonth;
  }), [calendarEntries, calendarYear, calendarMonth]);
  const firstDayOffset = (new Date(Date.UTC(calendarYear, calendarMonth, 1)).getUTCDay() + 6) % 7;
  const monthDayCount = new Date(Date.UTC(calendarYear, calendarMonth + 1, 0)).getUTCDate();
  const monthEventByDay = useMemo(() => new Map(monthEntries.map((item) => [Number(item.date.slice(-2)), item])), [monthEntries]);
  const logo = club?.teamLogo || club?.logoUrl || "/brand-logo.png";
  useEffect(() => {
    const applyRows = (rows) => {
      const next = applyBulletinManagement(rows);
      localStorage.setItem("volleyballBulletinManagement", JSON.stringify(rows));
      setManagedBulletins(next);
    };
    const onUpdate = (event) => applyRows(event.detail || []);
    window.addEventListener("volleyballBulletinManagementUpdated", onUpdate);
    const api = import.meta.env.VITE_REGISTRATION_API_URL || appConfig.registrationApiUrl || "";
    let refreshTimer;
    if (api) {
      const refresh = () => {
        const url = new URL(api); url.searchParams.set("sheet", "Bulten Yonetimi"); url.searchParams.set("_", Date.now());
        fetch(url, { cache:"no-store" }).then((response) => response.json()).then((result) => {
          if (result.ok && Array.isArray(result.data) && result.data.length) applyRows(result.data);
        }).catch(() => {});
      };
      refresh();
      refreshTimer = window.setInterval(refresh, 15000);
    }
    return () => { window.removeEventListener("volleyballBulletinManagementUpdated", onUpdate); if (refreshTimer) window.clearInterval(refreshTimer); };
  }, []);
  useEffect(() => {
    setSelected((current) => monthEntries.find((item) => item.calendarId === current?.calendarId) || monthEntries[0] || calendarEntries[0] || null);
  }, [calendarEntries, monthEntries]);
  useEffect(() => {
    if (!selected) return;
    let active = true; setPreviewLoading(true);
    const artworkPromise=selected.number===1 ? createFirstBulletinArtworks(selected,club) : selected.number===2 ? createSecondBulletinArtworks(selected,club) : selected.number===3 ? createCampBulletinArtworks(selected,club) : createBulletinArtwork(selected,club).then((canvas)=>[canvas]);
    artworkPromise.then((canvases) => {
      if (active) setPreview(canvases.map((canvas)=>canvas.toDataURL("image/jpeg", .84)));
    }).catch(()=>{ if(active) setPreview([]); }).finally(()=>{ if(active) setPreviewLoading(false); });
    return () => { active = false; };
  }, [selected, club?.id, club?.teamLogo, club?.logoUrl]);
  const moveMonth = (step) => {
    const next = new Date(Date.UTC(calendarYear, calendarMonth + step, 1));
    const year = next.getUTCFullYear();
    if (year < CALENDAR_START_YEAR || year > CALENDAR_END_YEAR) return;
    setCalendarYear(year);
    setCalendarMonth(next.getUTCMonth());
  };
  const chooseEntry = (item) => {
    setSelected(item);
    if (window.innerWidth < 760) window.setTimeout(() => document.getElementById("bulletin-preview")?.scrollIntoView({ behavior:"smooth", block:"start" }), 40);
  };
  const calendarCells = Array.from({ length: firstDayOffset + monthDayCount }, (_, index) => {
    if (index < firstDayOffset) return null;
    const day = index - firstDayOffset + 1;
    const weekday = (firstDayOffset + day - 1) % 7;
    return { day, weekday, entry: monthEventByDay.get(day) };
  });
  const markSent = (id) => setSent((items) => { const next = [...new Set([...items, id])]; localStorage.setItem(storageKey, JSON.stringify(next)); return next; });
  const shareMessage = selected ? `${club?.schoolName || "Voleybol Spor Okulu"}\n\nMerhaba sporcularımız,\n\nBülten: ${selected.title}\nTarih: ${dateText(selected.date)}\n\nBu haftanın eğitim bülteni ekte yer almaktadır. Bülteni dikkatlice incelemenizi ve haftalık uygulamaları antrenörünüzün yönlendirmesiyle tamamlamanızı rica ederiz.\n\nSağlıklı, disiplinli ve başarılı antrenmanlar dileriz.` : "";
  const prepare = async (mode) => {
    try {
      setBusy(mode); setNotice("PDF hazırlanıyor…"); const result = await createBulletinPdf(selected, club);
      if (mode === "download") {
        const url = URL.createObjectURL(result.blob); const link = document.createElement("a"); link.href = url; link.download = result.fileName; link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 2000); setNotice("PDF indirildi.");
      } else {
        const file = new File([result.blob], result.fileName, { type: "application/pdf" });
        if (navigator.share && (!navigator.canShare || navigator.canShare({ files:[file] }))) {
          await navigator.clipboard?.writeText(shareMessage).catch(()=>{});
          await navigator.share({ title:`${selected.title} | Eğitim Bülteni`, text:shareMessage, files:[file] }); markSent(selected.calendarId || selected.id); setNotice("PDF belge paylaşım ekranına eklendi. Hazır metin görünmezse mesaj alanına yapıştırın; metin panoya kopyalandı.");
        } else {
          const url = URL.createObjectURL(result.blob); const link = document.createElement("a"); link.href=url; link.download=result.fileName; link.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 2000);
          await navigator.clipboard?.writeText(shareMessage).catch(()=>{});
          window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank", "noopener,noreferrer");
          setNotice("Hazır mesaj WhatsApp'ta açıldı ve PDF indirildi. PDF'yi konuşmaya belge olarak ekleyin.");
        }
      }
    } catch (error) { if (error?.name !== "AbortError") setNotice("PDF hazırlanamadı. Lütfen tekrar deneyin."); }
    finally { setBusy(""); }
  };
  if (!selected) return <div className="page bulletin-page"><div className="bulletin-preview-error"><FileText/><p>Yayında eğitim bülteni bulunmuyor.</p></div></div>;
  const selectedKey = selected.calendarId || selected.id;
  return <div className="page bulletin-page">
    <button className="bulletin-back" onClick={() => go("profiles")}><ArrowLeft/> Kulüp profiline dön</button>
    <section className="bulletin-hero"><div className="bulletin-club-logo"><img src={logo} alt={`${club?.schoolName} logosu`} onError={(e)=>{e.currentTarget.src="/brand-logo.png";}}/></div><div><small>SPORCU İLETİŞİMİ</small><h1>Haftalık eğitim bültenleri</h1><p>Her cuma sporcularına sezon hazırlığı, antrenman alışkanlıkları, spor psikolojisi, beslenme ve sporcu tavsiyelerini kulübünün logosuyla ulaştır.</p><div className="bulletin-hero-meta"><span><CalendarDays/> 2025–2030 takvimi</span><span><FileText/> Logolu PDF</span><span><MessageCircle/> WhatsApp paylaşımı</span></div></div></section>
    <section className="bulletin-intro"><div><small>YAYIN TAKVİMİ</small><b>{calendarPeriodText}</b></div><p>Yayın tarihleri yönetici planıyla eş zamanlı güncellenir. Başlığa dokunduğunda seçilen bültenin PDF önizlemesi ve paylaşım seçenekleri aşağıda açılır.</p></section>
    <section className="bulletin-calendar-section" aria-label="Aylık eğitim bülteni takvimi">
      <header className="bulletin-calendar-toolbar">
        <div><small>AYLIK PLAN</small><h2>{MONTH_NAMES[calendarMonth]} {calendarYear}</h2><p>{monthEntries.length} yayın</p></div>
        <div className="bulletin-calendar-controls">
          <button type="button" aria-label="Önceki ay" onClick={()=>moveMonth(-1)} disabled={calendarYear===CALENDAR_START_YEAR&&calendarMonth===0}>‹</button>
          <label><span>Ay</span><select value={calendarMonth} onChange={(event)=>setCalendarMonth(Number(event.target.value))}>{MONTH_NAMES.map((month,index)=><option value={index} key={month}>{month}</option>)}</select></label>
          <label><span>Yıl</span><select value={calendarYear} onChange={(event)=>setCalendarYear(Number(event.target.value))}>{Array.from({length:CALENDAR_END_YEAR-CALENDAR_START_YEAR+1},(_,index)=>CALENDAR_START_YEAR+index).map((year)=><option value={year} key={year}>{year}</option>)}</select></label>
          <button type="button" aria-label="Sonraki ay" onClick={()=>moveMonth(1)} disabled={calendarYear===CALENDAR_END_YEAR&&calendarMonth===11}>›</button>
        </div>
      </header>
      <div className="bulletin-calendar-weekdays" aria-hidden="true">{WEEKDAY_NAMES.map((day)=><span key={day}>{day}</span>)}</div>
      <div className="bulletin-calendar-grid">{calendarCells.map((cell,index)=>cell ? <div key={cell.day} className={`bulletin-calendar-day ${cell.weekday===4?"friday":""}`}><span className="bulletin-calendar-date">{cell.day}</span>{cell.entry&&<button type="button" className={`bulletin-calendar-event ${selected.calendarId===cell.entry.calendarId?"active":""}`} onClick={()=>chooseEntry(cell.entry)}><b>{cell.entry.title}</b>{sent.includes(cell.entry.calendarId)&&<CheckCircle2/>}</button>}</div> : <div className="bulletin-calendar-day empty" aria-hidden="true" key={`empty-${index}`}/>)}</div>
    </section>
    <aside id="bulletin-preview" className="bulletin-preview bulletin-preview-below"><header><span><small>{selected.calendarOrder}. BÜLTEN</small><h2>{selected.title}</h2><p>{dateText(selected.date)} · {selected.phase}</p></span>{sent.includes(selectedKey)&&<em><CheckCircle2/> Paylaşıldı</em>}</header>
        <div className="preview-club"><img src={logo} alt={`${club?.schoolName || "Spor okulu"} logosu`} onError={(event)=>{event.currentTarget.onerror=null;event.currentTarget.src="/brand-logo.png"}}/><span><small>BÜLTENİ HAZIRLAYAN</small><b>{club?.schoolName || "Voleybol Spor Okulu"}</b></span></div>
        <div className={`bulletin-paper-preview ${preview.length>1?"multi-page":""} ${previewLoading ? "loading" : ""}`}>{preview.length ? preview.map((image,index)=><figure key={index}><img src={image} alt={`${selected.title} PDF bülten ${index+1}. sayfa önizlemesi`}/><figcaption>{index+1}. SAYFA</figcaption></figure>) : <div className="bulletin-preview-error"><FileText/><p>Önizleme hazırlanamadı.</p></div>}</div>
        {notice&&<p className="bulletin-notice">{notice}</p>}
        <div className="bulletin-actions"><button className="btn ghost" disabled={busy} onClick={()=>prepare("download")}><Download/> {busy==="download"?"Hazırlanıyor…":"PDF indir"}</button><button className="btn" disabled={busy} onClick={()=>prepare("share")}><Send/> {busy==="share"?"Hazırlanıyor…":"Belgeyi WhatsApp'ta paylaş"}</button></div>
      </aside>
  </div>;
}
