const ALLOWED_SHEETS=['Courses','Lessons','Coaches','Users','Progress','TrainingPlans','Announcements','Assessments','Quizzes','Reviews','Okul Kayitlari','Sporcu Kayitlari','Antrenor Kayitlari','Video Yonetimi','Bulten Yonetimi','Sinav Sonuclari'];
const PROFILE_SESSION_SECONDS=15*60;
function doGet(e){
  const name=String(e.parameter.sheet||'Courses');
  if(!ALLOWED_SHEETS.includes(name))return json_({ok:false,error:'Geçersiz veri kaynağı'});
  const sh=SpreadsheetApp.getActive().getSheetByName(name); if(!sh)return json_({ok:false,error:'Sekme bulunamadı'});
  const values=sh.getDataRange().getDisplayValues(); const headers=values.shift()||[];
  const publicFields={
    'Okul Kayitlari':['Kayıt ID','Okul Adı','Onay Durumu','Kayıt Tarihi','Takım Logosu (Manuel)'],
    'Sporcu Kayitlari':['Sporcu ID','Okul Kayıt ID','Okul Adı','Sporcu Adı','Profil Kodu','Profil Görseli','Takım Logosu (Manuel)','Çevrim İçi','Son Görülme','Kayıt Tarihi'],
    'Antrenor Kayitlari':['Antrenör ID','Okul Kayıt ID','Okul Adı','Antrenör Adı','Görev','Takım Logosu (Manuel)','Durum','Kayıt Tarihi','Profil Kodu','Profil Görseli']
  };
  const allowed=publicFields[name]||headers;
  const data=values.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(allowed.map(h=>[h,r[headers.indexOf(h)]??''])));
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
    if(body.action==='registerTrainer') return registerTrainer_(body);
    if(body.action==='updateAthletePresence') return updateAthletePresence_(body);
    if(body.action==='syncSchoolRoster') return syncSchoolRoster_(body);
    if(body.action==='profileLogin') return profileLogin_(body);
    if(body.action==='validateProfileSession') return validateProfileSession_(body);
    if(body.action==='logoutProfile') return logoutProfile_(body);
    if(body.action==='saveExamAttempt') return saveExamAttempt_(body);
    if(body.action==='trackBlogView') return trackBlogView_(body);
    if(body.action==='adminLogin') return adminLogin_(body);
    if(body.action==='adminStats') return adminStats_(body);
    if(body.action==='adminSaveVideoOrder') return adminSaveVideoOrder_(body);
    if(body.action==='adminSaveBulletins') return adminSaveBulletins_(body);
    return json_({ok:false,error:'Geçersiz işlem'});
  }catch(error){return json_({ok:false,error:'Kayıt işlenemedi: '+error.message})}
}

function updateAthletePresence_(body){
  const id=clean_(body.id,40), online=body.online===true||String(body.online).toLowerCase()==='true';
  if(!id) return json_({ok:false,error:'Sporcu kimliği gerekli.'});
  const account=requireProfile_(body.token);
  if(account.type!=='athlete'||account.id!==id) return json_({ok:false,error:'Çevrim içi durum yetkisi geçersiz.'});
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
    const duplicate=rows.find(r=>normalize_(r[1])===normalize_(schoolName));
    if(duplicate) return json_({ok:false,error:'Bu okul adı daha önce kaydedilmiş. Farklı bir okul adı girin.'});
    const code=uniqueSchoolCode_(sh), id='OKL-'+Utilities.getUuid().slice(0,8).toUpperCase();
    sh.appendRow([id,schoolName,phone,code,'BEKLİYOR',new Date(),'','','','','']);
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
    const account={type:'athlete',id:id,name:athleteName,schoolId:school[0],schoolName:school[1],schoolCode:code,avatar:avatarId,teamLogo:inheritedLogo};
    const session=createProfileSession_(account);
    return json_({ok:true,id:id,teamLogo:inheritedLogo,profileToken:session.token,expiresIn:PROFILE_SESSION_SECONDS});
  }finally{lock.releaseLock()}
}

function registerTrainer_(body){
  const schoolName=clean_(body.schoolName,120), code=String(body.schoolCode||''), trainerName=clean_(body.name,100), title=clean_(body.title,60)||'Voleybol Antrenörü';
  if(!/^\d{6}$/.test(code)||!/^@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}$/.test(trainerName)||title.length<3) return json_({ok:false,error:'Antrenör bilgileri geçersiz.'});
  const avatarId=clean_(body.avatar,30), avatarName=clean_(body.avatarName,80);
  if(!/^(kadin|erkek)-antrenor-[1-6]$/.test(avatarId)) return json_({ok:false,error:'Antrenör profil seçimi geçersiz.'});
  const schools=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu','Takım Logosu (Manuel)']);
  const school=schools.getDataRange().getDisplayValues().slice(1).find(r=>normalize_(r[1])===normalize_(schoolName)&&r[3]===code&&String(r[4]).toLocaleUpperCase('tr')==='ONAYLANDI');
  if(!school) return json_({ok:false,error:'Okul adı, kod veya yönetici onayı doğrulanamadı.'});
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) return json_({ok:false,error:'Kayıt servisi yoğun. Lütfen tekrar deneyin.'});
  try{
    const headers=['Antrenör ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Antrenör Adı','Görev','Takım Logosu (Manuel)','Durum','Kayıt Tarihi','Profil Kodu','Profil Görseli'];
    const sh=getOrCreate_('Antrenor Kayitlari',headers);
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    const trainerRows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,headers.length).getDisplayValues():[];
    if(trainerRows.some(r=>r[1]===school[0]&&normalize_(r[4])===normalize_(trainerName))) return json_({ok:false,error:'Bu antrenör adı seçilen okulda zaten kayıtlı.'});
    const id='ANT-'+Utilities.getUuid().slice(0,8).toUpperCase();
    const inheritedLogo=school[10]||(trainerRows.find(r=>normalize_(r[2])===normalize_(school[1])&&/^https?:\/\//.test(r[6]))||[])[6]||'';
    sh.appendRow([id,school[0],school[1],code,trainerName,title,inheritedLogo,'AKTİF',new Date(),avatarId,avatarName||avatarId]);
    const account={type:'trainer',id:id,schoolId:school[0],schoolName:school[1],schoolCode:code,name:trainerName,title:title,avatar:avatarId,teamLogo:inheritedLogo,status:'AKTİF'};
    const session=createProfileSession_(account);
    return json_({ok:true,id:id,teamLogo:inheritedLogo,profileToken:session.token,expiresIn:PROFILE_SESSION_SECONDS});
  }finally{lock.releaseLock()}
}

function createProfileSession_(account){
  const token=Utilities.getUuid()+'-'+Utilities.getUuid();
  CacheService.getScriptCache().put('profile:'+token,JSON.stringify(account),PROFILE_SESSION_SECONDS);
  return {token:token,account:account};
}
function requireProfile_(token){
  const key='profile:'+clean_(token,100);
  const cache=CacheService.getScriptCache(), raw=cache.get(key);
  if(!raw) throw new Error('Profil oturumu geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.');
  cache.put(key,raw,PROFILE_SESSION_SECONDS);
  return JSON.parse(raw);
}
function profileLogin_(body){
  const type=String(body.type||'').toLowerCase(), schoolName=clean_(body.schoolName,120), code=String(body.schoolCode||'').replace(/\D/g,''), userName=clean_(body.userName,100);
  if(!['club','athlete','trainer'].includes(type)||!schoolName||!/^\d{6}$/.test(code)) return json_({ok:false,error:'Giriş bilgileri geçersiz.'});
  const schools=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu','Takım Logosu (Manuel)']);
  const schoolRows=schools.getDataRange().getDisplayValues();
  const school=schoolRows.slice(1).find(r=>normalize_(r[1])===normalize_(schoolName)&&r[3]===code&&String(r[4]).toLocaleUpperCase('tr')==='ONAYLANDI');
  if(!school) return json_({ok:false,error:'Kulüp adı, kullanıcı kodu veya yönetici onayı doğrulanamadı.'});
  let account;
  if(type==='club') account={type:'club',id:school[0],schoolId:school[0],schoolName:school[1],name:school[1],phone:school[2],schoolCode:school[3],teamLogo:school[10]||''};
  if(type==='athlete'){
    const sh=getOrCreate_('Sporcu Kayitlari',['Sporcu ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Sporcu Adı','Profil Kodu','Profil Görseli','Takım Logosu (Manuel)','Çevrim İçi','Son Görülme','Kayıt Tarihi']);
    const person=sh.getDataRange().getDisplayValues().slice(1).find(r=>r[1]===school[0]&&normalize_(r[4])===normalize_(userName));
    if(!person) return json_({ok:false,error:'Sporcu adı bu kulübün kayıtlarıyla eşleşmedi.'});
    account={type:'athlete',id:person[0],schoolId:person[1],schoolName:person[2],schoolCode:person[3],name:person[4],avatar:person[5],teamLogo:person[7]||school[10]||''};
  }
  if(type==='trainer'){
    const headers=['Antrenör ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Antrenör Adı','Görev','Takım Logosu (Manuel)','Durum','Kayıt Tarihi','Profil Kodu','Profil Görseli'];
    const sh=getOrCreate_('Antrenor Kayitlari',headers);
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    const person=sh.getDataRange().getDisplayValues().slice(1).find(r=>r[1]===school[0]&&normalize_(r[4])===normalize_(userName)&&String(r[7]||'AKTİF').toLocaleUpperCase('tr')==='AKTİF');
    if(!person) return json_({ok:false,error:'Antrenör adı bu kulübün aktif kayıtlarıyla eşleşmedi.'});
    account={type:'trainer',id:person[0],schoolId:person[1],schoolName:person[2],schoolCode:person[3],name:person[4],title:person[5]||'Antrenör',teamLogo:person[6]||school[10]||'',status:person[7]||'AKTİF',avatar:person[9]||''};
  }
  const session=createProfileSession_(account);
  return json_({ok:true,token:session.token,expiresIn:PROFILE_SESSION_SECONDS,account:account});
}
function validateProfileSession_(body){
  const account=requireProfile_(body.token);
  return json_({ok:true,expiresIn:PROFILE_SESSION_SECONDS,account:account});
}
function syncSchoolRoster_(body){
  const account=requireProfile_(body.token);
  rebuildSchoolRosterById_(account.schoolId);
  return json_({ok:true,schoolId:account.schoolId});
}
function logoutProfile_(body){
  const token=clean_(body.token,100);
  if(token) CacheService.getScriptCache().remove('profile:'+token);
  return json_({ok:true});
}
function saveExamAttempt_(body){
  const account=requireProfile_(body.token), attempt=body.attempt||{};
  if(!['athlete','trainer'].includes(account.type)) return json_({ok:false,error:'Yalnızca sporcu ve antrenör sınav sonucu kaydedebilir.'});
  const attemptId=clean_(attempt.attemptId,80), examId=clean_(attempt.examId,30), examTitle=clean_(attempt.examTitle,180);
  const score=Math.max(0,Math.min(100,Number(attempt.score)||0)), questionCount=Math.max(1,Math.min(100,Number(attempt.questionCount)||1));
  const correctCount=Math.max(0,Math.min(questionCount,Number(attempt.correctCount)||0)), wrongCount=Math.max(0,questionCount-correctCount);
  if(!attemptId||!/^SNV-\d{2}$/.test(examId)||!examTitle) return json_({ok:false,error:'Sınav sonucu geçersiz.'});
  const headers=['Giriş ID','Okul ID','Okul Adı','Kullanıcı ID','Kullanıcı Adı','Rol','Sınav ID','Sınav Başlığı','Sınav Sırası','Deneme','Soru Sayısı','Doğru','Yanlış','Puan','Geçme Puanı','Durum','Tamamlanma Tarihi'];
  const sh=getOrCreate_('Sinav Sonuclari',headers), lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) return json_({ok:false,error:'Sınav kayıt servisi yoğun. Lütfen tekrar deneyin.'});
  try{
    const ids=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat():[];
    if(ids.includes(attemptId)) return json_({ok:true,duplicate:true,attemptId:attemptId});
    const passingScore=Math.max(0,Math.min(100,Number(attempt.passingScore)||70)), passed=score>=passingScore;
    sh.appendRow([attemptId,account.schoolId,account.schoolName,account.id,account.name,account.type==='trainer'?'Antrenör':'Sporcu',examId,examTitle,Number(attempt.examOrder)||0,Number(attempt.attemptNumber)||1,questionCount,correctCount,wrongCount,score,passingScore,passed?'Geçti':'Kaldı',new Date()]);
    return json_({ok:true,attemptId:attemptId,passed:passed});
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
  if(trainers&&trainers.getLastRow()>1) trainers.getDataRange().getDisplayValues().slice(1).filter(r=>r[1]===schoolId).forEach(r=>output.push(['Antrenör',r[0],r[1],r[2],r[3],r[4],r[5],r[9]||'',r[10]||'',r[6],r[7],'','',r[8]]));
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
  const expected=PropertiesService.getScriptProperties().getProperty('ADMIN_CODE_HASH');
  if(!expected) return json_({ok:false,error:'Yönetici kodu yapılandırılmamış. Apps Script içinde setupAdminCode işlevini bir kez çalıştırın.'});
  const code=String(body.code||'').replace(/\D/g,'');
  const clientId=clean_(body.clientId,64).replace(/[^a-zA-Z0-9_-]/g,'')||'anonymous';
  const attemptKey='admin-login-failures:'+clientId;
  const cache=CacheService.getScriptCache(), attempts=Number(cache.get(attemptKey)||0);
  if(attempts>=5) return json_({ok:false,error:'Çok fazla hatalı deneme yapıldı. 10 dakika sonra tekrar deneyin.'});
  if(!/^\d{6}$/.test(code)||hash_(code)!==expected){cache.put(attemptKey,String(attempts+1),600);return json_({ok:false,error:'Yönetici kodu hatalı.'})}
  cache.remove(attemptKey);
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
  const bulletins=getOrCreate_('Bulten Yonetimi',['Bülten ID','Başlık','Tarih','Sıra','Yayında']).getDataRange().getDisplayValues();
  return json_({ok:true,blog:rowsToObjects_(blog),videos:rowsToObjects_(videos),bulletins:rowsToObjects_(bulletins)});
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
function adminSaveBulletins_(body){
  requireAdmin_(body.token);
  const items=Array.isArray(body.items)?body.items.slice(0,80):[];
  if(!items.length) return json_({ok:false,error:'Kaydedilecek bülten bulunamadı.'});
  const statusLabels={published:'YAYINDA',draft:'TASLAK',deleted:'SİLİNDİ'};
  const cleanRows=items.map((item,index)=>[
    clean_(item.id,40),clean_(item.title,150),clean_(item.date,10),index+1,statusLabels[String(item.status||'published')]||'TASLAK'
  ]).filter(row=>/^bulten-[0-9]{2}$/.test(row[0])&&row[1]&&/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(row[2]));
  if(cleanRows.length!==items.length||new Set(cleanRows.map(row=>row[0])).size!==cleanRows.length) return json_({ok:false,error:'Bülten listesinde eksik veya yinelenen kayıt var.'});
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try{
    const sh=getOrCreate_('Bulten Yonetimi',['Bülten ID','Başlık','Tarih','Sıra','Yayında']);
    if(sh.getLastRow()>1) sh.getRange(2,1,sh.getLastRow()-1,5).clearContent();
    sh.getRange(2,1,cleanRows.length,5).setValues(cleanRows);
    return json_({ok:true,count:cleanRows.length});
  }finally{lock.releaseLock()}
}
function rowsToObjects_(values){
  if(!values.length)return [];
  const headers=values[0];
  return values.slice(1).filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function hash_(value){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(value),Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('')}
