const ALLOWED_SHEETS=['Courses','Lessons','Coaches','Users','Progress','TrainingPlans','Announcements','Assessments','Quizzes','Reviews','Okul Kayitlari','Sporcu Kayitlari','Antrenor Kayitlari','Video Yonetimi'];
const ADMIN_CODE_HASH='705be25e5e24528f0d472310dac77755da16c2f2ab063160c1b291ee765ea877';
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
    const raw=(e.postData&&e.postData.contents)||'{}';
    if(raw.length>50000) return json_({ok:false,error:'Kayıt verisi izin verilen boyutu aşıyor.'});
    const body=JSON.parse(raw);
    if(body.action==='registerSchool') return registerSchool_(body);
    if(body.action==='registerAthlete') return registerAthlete_(body);
    if(body.action==='updateAthletePresence') return updateAthletePresence_(body);
    if(body.action==='trackBlogView') return trackBlogView_(body);
    if(body.action==='adminLogin') return adminLogin_(body);
    if(body.action==='adminStats') return adminStats_(body);
    if(body.action==='adminSaveVideoOrder') return adminSaveVideoOrder_(body);
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
  rebuildSchoolRosterById_(sh.getRange(row,2).getDisplayValue());
  return json_({ok:true,id:id,online:online});
}

function registerSchool_(body){
  const schoolName=clean_(body.schoolName,120); let phone=String(body.phone||'').replace(/\D/g,'');
  if(phone.length===11&&phone.startsWith('0')) phone='90'+phone.slice(1); else if(phone.length===10) phone='90'+phone;
  if(schoolName.length<3||phone.length<10||phone.length>15) return json_({ok:false,error:'Okul adı veya telefon geçersiz.'});
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) return json_({ok:false,error:'Kayıt servisi yoğun. Lütfen tekrar deneyin.'});
  try{
    const sh=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu','Takım Logosu (Manuel)']);
    const rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,11).getDisplayValues():[];
    const duplicate=rows.find(r=>normalize_(r[1])===normalize_(schoolName)||String(r[2]).replace(/\D/g,'')===phone);
    if(duplicate) return json_({ok:false,error:'Bu okul veya telefon numarası daha önce kaydedilmiş.'});
    const code=uniqueSchoolCode_(sh), id='OKL-'+Utilities.getUuid().slice(0,8).toUpperCase();
    sh.appendRow([id,schoolName,phone,code,'BEKLİYOR',new Date(),'','','','','']);
    getSchoolRosterSheet_(schoolName,id);
    return json_({ok:true,id:id,code:code,status:'BEKLİYOR'});
  }finally{lock.releaseLock()}
}

function registerAthlete_(body){
  const schoolName=clean_(body.schoolName,120), code=String(body.schoolCode||''), athleteName=clean_(body.name,100);
  if(!/^\d{6}$/.test(code)||athleteName.length<2) return json_({ok:false,error:'Sporcu bilgileri geçersiz.'});
  if(!/^@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}$/.test(athleteName)) return json_({ok:false,error:'Sporcu adı @ ile başlamalıdır.'});
  const schools=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu','Takım Logosu (Manuel)']);
  const rows=schools.getDataRange().getDisplayValues();
  const school=rows.slice(1).find(r=>r[1].trim().toLocaleLowerCase('tr')===schoolName.toLocaleLowerCase('tr')&&r[3]===code&&r[4]==='ONAYLANDI');
  if(!school) return json_({ok:false,error:'Okul adı, kod veya yönetici onayı doğrulanamadı.'});
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) return json_({ok:false,error:'Kayıt servisi yoğun. Lütfen tekrar deneyin.'});
  try{
    const sh=getOrCreate_('Sporcu Kayitlari',['Sporcu ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Sporcu Adı','Profil Kodu','Profil Görseli','Takım Logosu (Manuel)','Çevrim İçi','Son Görülme','Kayıt Tarihi']);
    const athleteRows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,11).getDisplayValues():[];
    if(athleteRows.some(r=>normalize_(r[4])===normalize_(athleteName))) return json_({ok:false,error:'Bu sporcu adı alınmış.'});
    const id='SPR-'+Utilities.getUuid().slice(0,8).toUpperCase();
    const avatarId=clean_(body.avatar,30), avatarName=clean_(body.avatarName,80);
    if(!/^(kadin|erkek)-voleybolcu-[1-6]$/.test(avatarId)) return json_({ok:false,error:'Profil seçimi geçersiz.'});
    const inheritedLogo=school[10]||(athleteRows.find(r=>normalize_(r[2])===normalize_(school[1])&&/^https?:\/\//.test(r[7]))||[])[7]||'';
    sh.appendRow([id,school[0],school[1],code,athleteName,avatarId,avatarName||avatarId,inheritedLogo,false,'',new Date()]);
    rebuildSchoolRosterById_(school[0]);
    return json_({ok:true,id:id,teamLogo:inheritedLogo});
  }finally{lock.releaseLock()}
}

function onEdit(e){
  const sh=e.range.getSheet(), name=sh.getName(), row=e.range.getRow();
  if(row<2) return;
  if(name==='Okul Kayitlari'){
    if(e.range.getColumn()===5&&String(e.value||'')==='ONAYLANDI'){
      const school=sh.getRange(row,2).getDisplayValue(), phone=sh.getRange(row,3).getDisplayValue().replace(/\D/g,''), code=sh.getRange(row,4).getDisplayValue();
      const message='Okul kaydınız onaylandı. Kullanıcı: '+school+' | 6 haneli giriş kodunuz: '+code;
      sh.getRange(row,7).setValue(new Date()); sh.getRange(row,8).setValue(message); sh.getRange(row,9).setFormula('=HYPERLINK("https://wa.me/'+phone+'?text='+encodeURIComponent(message)+'","WhatsApp ile gönder")');
    }
    rebuildSchoolRosterById_(sh.getRange(row,1).getDisplayValue());
    return;
  }
  if(name==='Sporcu Kayitlari'||name==='Antrenor Kayitlari') rebuildSchoolRosterById_(sh.getRange(row,2).getDisplayValue());
}

const SCHOOL_ROSTER_HEADERS=['Kayıt Türü','Kullanıcı ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Kullanıcı Adı','Görev','Profil Kodu','Profil Görseli','Takım Logosu','Durum','Çevrim İçi','Son Görülme','Kayıt Tarihi'];
function schoolRosterSheetName_(schoolName,schoolId){
  const safe=clean_(schoolName,70).replace(/[\\\/?*\[\]:]/g,' ').replace(/\s+/g,' ').trim()||'Okul';
  const suffix=String(schoolId||'').replace(/^OKL-/,'').slice(-6);
  return ('OKUL - '+safe+(suffix?' - '+suffix:'')).slice(0,99);
}
function getSchoolRosterSheet_(schoolName,schoolId){return getOrCreate_(schoolRosterSheetName_(schoolName,schoolId),SCHOOL_ROSTER_HEADERS)}
function rebuildSchoolRosterById_(schoolId){
  if(!schoolId) return;
  const ss=SpreadsheetApp.getActive(), schools=ss.getSheetByName('Okul Kayitlari');
  if(!schools||schools.getLastRow()<2) return;
  const school=schools.getDataRange().getDisplayValues().slice(1).find(r=>r[0]===schoolId);
  if(!school) return;
  const target=getSchoolRosterSheet_(school[1],school[0]);
  if(target.getLastRow()>1) target.getRange(2,1,target.getLastRow()-1,SCHOOL_ROSTER_HEADERS.length).clearContent();
  const output=[], athletes=ss.getSheetByName('Sporcu Kayitlari'), trainers=ss.getSheetByName('Antrenor Kayitlari');
  if(athletes&&athletes.getLastRow()>1) athletes.getDataRange().getDisplayValues().slice(1).filter(r=>r[1]===schoolId).forEach(r=>output.push(['Sporcu',r[0],r[1],r[2],r[3],r[4],'Sporcu',r[5],r[6],r[7],'AKTİF',r[8],r[9],r[10]]));
  if(trainers&&trainers.getLastRow()>1) trainers.getDataRange().getDisplayValues().slice(1).filter(r=>r[1]===schoolId).forEach(r=>output.push(['Antrenör',r[0],r[1],r[2],r[3],r[4],r[5],'','',r[6],r[7],'','',r[8]]));
  if(output.length) target.getRange(2,1,output.length,SCHOOL_ROSTER_HEADERS.length).setValues(output);
  target.setFrozenRows(1); target.autoResizeColumns(1,SCHOOL_ROSTER_HEADERS.length);
}
function syncSchoolRosterSheets(){
  const sh=SpreadsheetApp.getActive().getSheetByName('Okul Kayitlari');
  if(!sh||sh.getLastRow()<2) return 0;
  const ids=sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat().filter(Boolean);
  ids.forEach(rebuildSchoolRosterById_); return ids.length;
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
function normalize_(value){return clean_(value,160).toLocaleLowerCase('tr').replace(/\s+/g,' ')}

function setupAdminCode(){
  const code=String(Math.floor(100000+Math.random()*900000));
  PropertiesService.getScriptProperties().setProperty('ADMIN_CODE_HASH',hash_(code));
  console.log('Yönetici kodu: '+code);
  return code;
}
function adminLogin_(body){
  const expected=PropertiesService.getScriptProperties().getProperty('ADMIN_CODE_HASH')||ADMIN_CODE_HASH;
  const code=String(body.code||'').replace(/\D/g,'');
  const cache=CacheService.getScriptCache(), attempts=Number(cache.get('admin-login-failures')||0);
  if(attempts>=5) return json_({ok:false,error:'Çok fazla hatalı deneme yapıldı. 10 dakika sonra tekrar deneyin.'});
  if(!/^\d{6}$/.test(code)||hash_(code)!==expected){cache.put('admin-login-failures',String(attempts+1),600);return json_({ok:false,error:'Yönetici kodu hatalı.'})}
  cache.remove('admin-login-failures');
  const token=Utilities.getUuid();
  cache.put('admin:'+token,'1',1800);
  return json_({ok:true,token:token,expiresIn:1800});
}
function requireAdmin_(token){
  const key='admin:'+clean_(token,80);
  if(!CacheService.getScriptCache().get(key)) throw new Error('Yönetici oturumu geçersiz veya süresi dolmuş.');
  CacheService.getScriptCache().put(key,'1',1800);
}
function trackBlogView_(body){
  const postId=clean_(body.postId,100), title=clean_(body.title,180);
  if(!/^[a-z0-9-]{3,100}$/.test(postId)||!title) return json_({ok:false,error:'Blog bilgisi geçersiz.'});
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try{
    const sh=getOrCreate_('Blog Okunmalari',['Yazı ID','Başlık','Okunma Sayısı','Son Okunma']);
    const rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,4).getValues():[];
    const index=rows.findIndex(r=>String(r[0])===postId);
    if(index<0) sh.appendRow([postId,title,1,new Date()]);
    else sh.getRange(index+2,2,1,3).setValues([[title,Number(rows[index][2]||0)+1,new Date()]]);
    return json_({ok:true});
  }finally{lock.releaseLock()}
}
function adminStats_(body){
  requireAdmin_(body.token);
  const blog=getOrCreate_('Blog Okunmalari',['Yazı ID','Başlık','Okunma Sayısı','Son Okunma']).getDataRange().getDisplayValues();
  const videos=getOrCreate_('Video Yonetimi',['Video ID','Başlık','Kategori','Sıra']).getDataRange().getDisplayValues();
  return json_({ok:true,blog:rowsToObjects_(blog),videos:rowsToObjects_(videos)});
}
function adminSaveVideoOrder_(body){
  requireAdmin_(body.token);
  const items=Array.isArray(body.items)?body.items.slice(0,250):[];
  if(!items.length) return json_({ok:false,error:'Kaydedilecek video bulunamadı.'});
  const cleanRows=items.map((item,index)=>[
    clean_(item.id,100),clean_(item.title,180),clean_(item.category,80),index+1
  ]).filter(row=>row[0]&&row[1]&&row[2]);
  if(cleanRows.length!==items.length||new Set(cleanRows.map(row=>row[0])).size!==cleanRows.length) return json_({ok:false,error:'Video listesinde eksik veya yinelenen kayıt var.'});
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try{
    const sh=getOrCreate_('Video Yonetimi',['Video ID','Başlık','Kategori','Sıra']);
    if(sh.getLastRow()>1) sh.getRange(2,1,sh.getLastRow()-1,4).clearContent();
    sh.getRange(2,1,cleanRows.length,4).setValues(cleanRows);
    return json_({ok:true,count:cleanRows.length});
  }finally{lock.releaseLock()}
}
function rowsToObjects_(values){
  if(!values.length)return [];
  const headers=values[0];
  return values.slice(1).filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function hash_(value){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(value),Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('')}
