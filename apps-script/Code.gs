const ALLOWED_SHEETS=['Courses','Lessons','Coaches','Users','Progress','TrainingPlans','Announcements','Assessments','Quizzes','Reviews','Okul Kayitlari','Sporcu Kayitlari','Antrenor Kayitlari'];
function doGet(e){
  const name=String(e.parameter.sheet||'Courses');
  if(!ALLOWED_SHEETS.includes(name))return json_({ok:false,error:'Geçersiz veri kaynağı'});
  const sh=SpreadsheetApp.getActive().getSheetByName(name); if(!sh)return json_({ok:false,error:'Sekme bulunamadı'});
  const values=sh.getDataRange().getDisplayValues(); const headers=values.shift()||[];
  const data=values.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
  return json_({ok:true,data,updatedAt:new Date().toISOString()});
}
function json_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)}

function doPost(e){
  try{
    const body=JSON.parse((e.postData&&e.postData.contents)||'{}');
    if(body.action==='registerSchool') return registerSchool_(body);
    if(body.action==='registerAthlete') return registerAthlete_(body);
    if(body.action==='updateAthletePresence') return updateAthletePresence_(body);
    return json_({ok:false,error:'Geçersiz işlem'});
  }catch(error){return json_({ok:false,error:'Kayıt işlenemedi: '+error.message})}
}

function updateAthletePresence_(body){
  const id=clean_(body.id,40), online=body.online===true||String(body.online).toLowerCase()==='true';
  if(!id) return json_({ok:false,error:'Sporcu kimliği gerekli.'});
  const sh=getOrCreate_('Sporcu Kayitlari',['Sporcu ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Sporcu Adı','Profil Kodu','Profil Görseli','Takım Logosu (Manuel)','Çevrim İçi','Son Görülme','Kayıt Tarihi']);
  if(sh.getLastRow()<2) return json_({ok:false,error:'Sporcu bulunamadı.'});
  const ids=sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat();
  const index=ids.indexOf(id);
  if(index<0) return json_({ok:false,error:'Sporcu bulunamadı.'});
  const row=index+2;
  sh.getRange(row,9,1,2).setValues([[online,new Date()]]);
  return json_({ok:true,id:id,online:online});
}

function registerSchool_(body){
  const schoolName=clean_(body.schoolName,120); let phone=String(body.phone||'').replace(/\D/g,'');
  if(phone.length===11&&phone.startsWith('0')) phone='90'+phone.slice(1); else if(phone.length===10) phone='90'+phone;
  if(schoolName.length<3||phone.length<10||phone.length>15) return json_({ok:false,error:'Okul adı veya telefon geçersiz.'});
  const sh=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu']);
  const code=uniqueSchoolCode_(sh), id='OKL-'+Utilities.getUuid().slice(0,8).toUpperCase();
  sh.appendRow([id,schoolName,phone,code,'BEKLİYOR',new Date(),'','','','']);
  return json_({ok:true,id:id,code:code,status:'BEKLİYOR'});
}

function registerAthlete_(body){
  const schoolName=clean_(body.schoolName,120), code=String(body.schoolCode||''), athleteName=clean_(body.name,100);
  if(!/^\d{6}$/.test(code)||athleteName.length<2) return json_({ok:false,error:'Sporcu bilgileri geçersiz.'});
  const schools=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu']);
  const rows=schools.getDataRange().getDisplayValues();
  const school=rows.slice(1).find(r=>r[1].trim().toLocaleLowerCase('tr')===schoolName.toLocaleLowerCase('tr')&&r[3]===code&&r[4]==='ONAYLANDI');
  if(!school) return json_({ok:false,error:'Okul adı, kod veya yönetici onayı doğrulanamadı.'});
  const sh=getOrCreate_('Sporcu Kayitlari',['Sporcu ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Sporcu Adı','Profil Kodu','Profil Görseli','Takım Logosu (Manuel)','Çevrim İçi','Son Görülme','Kayıt Tarihi']);
  const id='SPR-'+Utilities.getUuid().slice(0,8).toUpperCase();
  const avatarId=clean_(body.avatar,30), avatarName=clean_(body.avatarName,80);
  const athleteRows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,11).getDisplayValues():[];
  const inheritedLogo=(athleteRows.find(r=>r[2].trim().toLocaleLowerCase('tr')===school[1].trim().toLocaleLowerCase('tr')&&r[7])||[])[7]||'';
  sh.appendRow([id,school[0],school[1],code,athleteName,avatarId,'',inheritedLogo,true,new Date(),new Date()]);
  const row=sh.getLastRow(); sh.setRowHeight(row,72); sh.getRange(row,7).setNote(avatarName||avatarId);
  const match=String(body.avatarDataUrl||'').match(/^data:image\/(png|jpeg);base64,(.+)$/);
  if(match){
    const mime=match[1]==='jpeg'?'image/jpeg':'image/png';
    const blob=Utilities.newBlob(Utilities.base64Decode(match[2]),mime,id+'.png');
    const image=sh.insertImage(blob,7,row); image.setWidth(64).setHeight(64);
  }else sh.getRange(row,7).setValue(avatarName||avatarId);
  return json_({ok:true,id:id,teamLogo:inheritedLogo});
}

function onEdit(e){
  const sh=e.range.getSheet(); if(sh.getName()!=='Okul Kayitlari'||e.range.getColumn()!==5||e.range.getRow()<2) return;
  const row=e.range.getRow(), status=String(e.value||'');
  if(status!=='ONAYLANDI') return;
  const school=sh.getRange(row,2).getDisplayValue(), phone=sh.getRange(row,3).getDisplayValue().replace(/\D/g,''), code=sh.getRange(row,4).getDisplayValue();
  const message='Okul kaydınız onaylandı. Kullanıcı: '+school+' | 6 haneli giriş kodunuz: '+code;
  sh.getRange(row,7).setValue(new Date()); sh.getRange(row,8).setValue(message); sh.getRange(row,9).setFormula('=HYPERLINK("https://wa.me/'+phone+'?text='+encodeURIComponent(message)+'","WhatsApp ile gönder")');
}

function getOrCreate_(name,headers){
  const ss=SpreadsheetApp.getActive(); let sh=ss.getSheetByName(name);
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1)}
  return sh;
}
function uniqueSchoolCode_(sh){
  const existing=new Set(sh.getLastRow()>1?sh.getRange(2,4,sh.getLastRow()-1,1).getDisplayValues().flat():[]); let code;
  do{code=String(Math.floor(100000+Math.random()*900000))}while(existing.has(code)); return code;
}
function clean_(value,max){return String(value||'').replace(/[<>]/g,'').trim().slice(0,max)}
