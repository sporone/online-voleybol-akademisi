const ALLOWED_SHEETS=['Courses','Lessons','Coaches','Users','Progress','TrainingPlans','Announcements','Assessments','Quizzes','Reviews','Okul Kayitlari','Takimlar','Sporcu Kayitlari','Antrenor Kayitlari','Video Yonetimi','Bulten Yonetimi','Sinav Sonuclari'];
const PROFILE_SESSION_SECONDS=15*60;
const PUBLIC_TEAM_CACHE_KEY='public-school-teams-v2';
const PUBLIC_TEAM_CACHE_SECONDS=30;
let legacyTeamMigrationChecked_=false;
const TEAM_HEADERS=['Takım ID','Okul Kayıt ID','Okul Adı','Takım Adı','6 Haneli Takım Kodu','Durum','Sıra','Oluşturma Tarihi','Güncelleme Tarihi'];
const ATHLETE_HEADERS=['Sporcu ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Sporcu Adı','Profil Kodu','Profil Görseli','Takım Logosu (Manuel)','Çevrim İçi','Son Görülme','Kayıt Tarihi','Takım ID','Takım Adı','Takım Kodu'];
const TRAINER_HEADERS=['Antrenör ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Antrenör Adı','Görev','Takım Logosu (Manuel)','Durum','Kayıt Tarihi','Profil Kodu','Profil Görseli','Takım ID','Takım Adı','Takım Kodu'];
function doGet(e){
  const name=String(e.parameter.sheet||'Courses');
  if(!ALLOWED_SHEETS.includes(name))return json_({ok:false,error:'Geçersiz veri kaynağı'});
  if(name==='Takimlar'){
    migrateLegacyTeamsToSchoolSheets_();
    return json_({ok:true,data:publicSchoolTeams_(),updatedAt:new Date().toISOString()});
  }
  const sh=SpreadsheetApp.getActive().getSheetByName(name); if(!sh)return json_({ok:false,error:'Sekme bulunamadı'});
  const values=sh.getDataRange().getDisplayValues(); const headers=values.shift()||[];
  const publicFields={
    'Okul Kayitlari':['Kayıt ID','Okul Adı','Onay Durumu','Kayıt Tarihi','Takım Logosu (Manuel)'],
    'Takimlar':['Takım ID','Okul Kayıt ID','Okul Adı','Takım Adı','Durum','Sıra','Oluşturma Tarihi'],
    'Sporcu Kayitlari':['Sporcu ID','Okul Kayıt ID','Okul Adı','Sporcu Adı','Profil Kodu','Profil Görseli','Takım Logosu (Manuel)','Çevrim İçi','Son Görülme','Kayıt Tarihi','Takım ID','Takım Adı'],
    'Antrenor Kayitlari':['Antrenör ID','Okul Kayıt ID','Okul Adı','Antrenör Adı','Görev','Takım Logosu (Manuel)','Durum','Kayıt Tarihi','Profil Kodu','Profil Görseli','Takım ID','Takım Adı']
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
    if(body.action==='listClubTeams') return listClubTeams_(body);
    if(body.action==='manageClubTeam') return manageClubTeam_(body);
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
  const sh=getOrCreate_('Sporcu Kayitlari',ATHLETE_HEADERS);
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
    const duplicate=exactRows_(sh,2,schoolName,11).find(r=>normalize_(r[1])===normalize_(schoolName));
    if(duplicate) return json_({ok:false,error:'Bu okul adı daha önce kaydedilmiş. Farklı bir okul adı girin.'});
    const code=uniqueSchoolCode_(sh), id='OKL-'+Utilities.getUuid().slice(0,8).toUpperCase();
    sh.appendRow([id,schoolName,phone,code,'BEKLİYOR',new Date(),'','','','','']);
    return json_({ok:true,id:id,code:code,status:'BEKLİYOR'});
  }finally{lock.releaseLock()}
}

function teamRosterRow_(teamId,schoolId,schoolName,teamName,code,status,order,createdAt,updatedAt){
  return ['Takım',teamId,schoolId,schoolName,'',teamName,order,'','','',status||'AKTİF','',updatedAt||new Date(),createdAt||new Date(),teamId,teamName,code];
}
function schoolTeamEntries_(schoolId,schoolName,createSheet){
  const ss=SpreadsheetApp.getActive();
  const sh=createSheet?getSchoolRosterSheet_(schoolName,schoolId):ss.getSheetByName(schoolRosterSheetName_(schoolName,schoolId));
  if(!sh||sh.getLastRow()<2) return {sheet:sh,entries:[]};
  const rows=sh.getRange(2,1,sh.getLastRow()-1,SCHOOL_ROSTER_HEADERS.length).getDisplayValues();
  const entries=[];
  rows.forEach((r,index)=>{
    if(normalize_(r[0])!=='takım') return;
    const id=clean_(r[14]||r[1],40), name=clean_(r[15]||r[5],70), teamCode=String(r[16]||'').replace(/\D/g,'');
    if(!id||!name||!teamCode) return;
    entries.push({sheetRow:index+2,source:r,data:[id,r[2]||schoolId,r[3]||schoolName,name,teamCode,r[10]||'AKTİF',Number(r[6])||0,r[13]||'',r[12]||'']});
  });
  return {sheet:sh,entries:entries};
}
function allSchoolTeamEntries_(){
  const schools=SpreadsheetApp.getActive().getSheetByName('Okul Kayitlari');
  if(!schools||schools.getLastRow()<2) return [];
  const result=[];
  schools.getDataRange().getDisplayValues().slice(1).filter(r=>r[0]&&r[1]).forEach(school=>{
    schoolTeamEntries_(school[0],school[1],false).entries.forEach(entry=>result.push(entry));
  });
  return result;
}
function publicSchoolTeams_(){
  const cache=CacheService.getScriptCache(), cached=cache.get(PUBLIC_TEAM_CACHE_KEY);
  if(cached){try{return JSON.parse(cached)}catch(error){cache.remove(PUBLIC_TEAM_CACHE_KEY)}}
  const data=allSchoolTeamEntries_().map(entry=>{
    const r=entry.data;
    return {'Takım ID':r[0],'Okul Kayıt ID':r[1],'Okul Adı':r[2],'Takım Adı':r[3],'Durum':r[5],'Sıra':r[6],'Oluşturma Tarihi':r[7]};
  });
  cache.put(PUBLIC_TEAM_CACHE_KEY,JSON.stringify(data),PUBLIC_TEAM_CACHE_SECONDS);
  return data;
}
function clearPublicTeamCache_(){CacheService.getScriptCache().remove(PUBLIC_TEAM_CACHE_KEY)}
function migrateLegacyTeamsToSchoolSheets_(){
  if(legacyTeamMigrationChecked_) return;
  const properties=PropertiesService.getScriptProperties(), key='TEAM_STORAGE_IN_SCHOOL_SHEETS_V1';
  if(properties.getProperty(key)==='done'){legacyTeamMigrationChecked_=true;return}
  const ss=SpreadsheetApp.getActive(), legacy=ss.getSheetByName('Takimlar'), schools=ss.getSheetByName('Okul Kayitlari');
  if(legacy&&legacy.getLastRow()>1&&schools&&schools.getLastRow()>1){
    const schoolRows=schools.getDataRange().getDisplayValues().slice(1);
    const legacyRows=legacy.getRange(2,1,legacy.getLastRow()-1,TEAM_HEADERS.length).getDisplayValues();
    legacyRows.filter(r=>r[0]&&r[1]).forEach(r=>{
      const school=schoolRows.find(s=>s[0]===r[1]);
      if(!school) return;
      const target=schoolTeamEntries_(school[0],school[1],true);
      if(target.entries.some(entry=>entry.data[0]===r[0])) return;
      target.sheet.appendRow(teamRosterRow_(r[0],school[0],school[1],r[3],r[4],r[5]||'AKTİF',Number(r[6])||target.entries.length+1,r[7]||new Date(),r[8]||new Date()));
    });
  }
  clearPublicTeamCache_();
  properties.setProperty(key,'done');
  legacyTeamMigrationChecked_=true;
}
function findActiveTeam_(schoolId,teamId,code,schoolName){
  migrateLegacyTeamsToSchoolSheets_();
  const school=schoolName?[schoolId,schoolName]:schoolById_(schoolId);
  if(!school) return null;
  return (schoolTeamEntries_(schoolId,school[1],false).entries.find(entry=>{
    const r=entry.data;
    return r[0]===teamId&&r[4]===code&&String(r[5]||'AKTİF').toLocaleUpperCase('tr')==='AKTİF';
  })||{}).data||null;
}
function uniqueTeamCode_(teamRows,schoolSheet,requested,excludeTeamId){
  const schoolCodes=new Set(schoolSheet.getLastRow()>1?schoolSheet.getRange(2,4,schoolSheet.getLastRow()-1,1).getDisplayValues().flat():[]);
  const used=new Set(teamRows.filter(r=>r[0]!==excludeTeamId).map(r=>r[4]).concat([...schoolCodes]));
  const preferred=String(requested||'').replace(/\D/g,'');
  if(preferred){
    if(!/^\d{6}$/.test(preferred)) throw new Error('Takım kodu 6 haneli olmalıdır.');
    if(used.has(preferred)) throw new Error('Bu takım kodu kullanımda. Başka bir kod seçin.');
    return preferred;
  }
  let code;
  do{code=String(Math.floor(100000+Math.random()*900000))}while(used.has(code));
  return code;
}
function clubTeams_(schoolId,includeCodes,schoolName){
  migrateLegacyTeamsToSchoolSheets_();
  const school=schoolName?[schoolId,schoolName]:schoolById_(schoolId);
  if(!school) return [];
  return schoolTeamEntries_(schoolId,school[1],false).entries.map(entry=>entry.data)
    .sort((a,b)=>(Number(a[6])||999)-(Number(b[6])||999)||String(a[3]).localeCompare(String(b[3]),'tr'))
    .map(r=>({id:r[0],schoolId:r[1],schoolName:r[2],name:r[3],code:includeCodes?r[4]:'',status:r[5]||'AKTİF',order:Number(r[6])||0,createdAt:r[7],updatedAt:r[8]}));
}
function listClubTeams_(body){
  const account=requireProfile_(body.token);
  if(account.type!=='club') return json_({ok:false,error:'Takım yönetimi yalnızca kulüp hesabına açıktır.'});
  return json_({ok:true,teams:clubTeams_(account.schoolId,true,account.schoolName)});
}
function syncTeamUsers_(schoolId,teamId,teamName,teamCode,onlyEmpty){
  [[getOrCreate_('Sporcu Kayitlari',ATHLETE_HEADERS),ATHLETE_HEADERS],[getOrCreate_('Antrenor Kayitlari',TRAINER_HEADERS),TRAINER_HEADERS]].forEach(pair=>{
    const sh=pair[0], headers=pair[1];
    if(sh.getLastRow()<2) return;
    const values=sh.getRange(2,1,sh.getLastRow()-1,headers.length).getValues();
    let changed=false;
    values.forEach(row=>{
      if(String(row[1])!==schoolId) return;
      const rowTeamId=String(row[11]||'');
      if(sh.getName()==='Antrenor Kayitlari'){
        const ids=splitTeamValues_(row[11]), names=splitTeamValues_(row[12]), codes=splitTeamValues_(row[13]);
        if(onlyEmpty){
          if(ids.length) return;
          row[3]=teamCode; row[11]=teamId; row[12]=teamName; row[13]=teamCode; changed=true; return;
        }
        const teamIndex=ids.indexOf(teamId);
        if(teamIndex<0) return;
        names[teamIndex]=teamName; codes[teamIndex]=teamCode;
        row[3]=codes[0]||teamCode; row[11]=ids.join('|'); row[12]=names.join('|'); row[13]=codes.join('|'); changed=true; return;
      }
      if((onlyEmpty&&rowTeamId)||(!onlyEmpty&&rowTeamId!==teamId)) return;
      row[3]=teamCode; row[11]=teamId; row[12]=teamName; row[13]=teamCode; changed=true;
    });
    if(changed) sh.getRange(2,1,values.length,headers.length).setValues(values);
  });
}
function manageClubTeam_(body){
  const account=requireProfile_(body.token);
  if(account.type!=='club') return json_({ok:false,error:'Takım yönetimi yalnızca kulüp hesabına açıktır.'});
  const operation=String(body.operation||'create').toLowerCase();
  const teamName=clean_(body.teamName,70), teamId=clean_(body.teamId,40);
  if(!['create','update'].includes(operation)||teamName.length<2) return json_({ok:false,error:'Takım adı en az 2 karakter olmalıdır.'});
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) return json_({ok:false,error:'Takım servisi yoğun. Lütfen tekrar deneyin.'});
  try{
    migrateLegacyTeamsToSchoolSheets_();
    const schools=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu','Takım Logosu (Manuel)']);
    const school=schoolById_(account.schoolId);
    if(!school) return json_({ok:false,error:'Kulüp kaydı bulunamadı.'});
    const storage=schoolTeamEntries_(account.schoolId,school[1],true), rows=storage.entries.map(entry=>entry.data);
    const duplicateName=rows.find(r=>normalize_(r[3])===normalize_(teamName)&&r[0]!==teamId);
    if(duplicateName) return json_({ok:false,error:'Bu takım adı kulübünüzde zaten kullanılıyor.'});
    const code=uniqueTeamCode_(allSchoolTeamEntries_().map(entry=>entry.data),schools,body.teamCode,teamId);
    if(operation==='create'){
      const id='TKM-'+Utilities.getUuid().slice(0,8).toUpperCase(), order=rows.length+1;
      storage.sheet.appendRow(teamRosterRow_(id,account.schoolId,school[1],teamName,code,'AKTİF',order,new Date(),new Date()));
      if(order===1) syncTeamUsers_(account.schoolId,id,teamName,code,true);
    }else{
      const index=rows.findIndex(r=>r[0]===teamId);
      if(index<0) return json_({ok:false,error:'Güncellenecek takım bulunamadı.'});
      const entry=storage.entries[index];
      storage.sheet.getRange(entry.sheetRow,1,1,SCHOOL_ROSTER_HEADERS.length).setValues([teamRosterRow_(teamId,account.schoolId,school[1],teamName,code,'AKTİF',Number(body.order)||Number(rows[index][6])||1,rows[index][7]||new Date(),new Date())]);
      syncTeamUsers_(account.schoolId,teamId,teamName,code,false);
    }
    clearPublicTeamCache_();
    rebuildSchoolRosterById_(account.schoolId);
    return json_({ok:true,teams:clubTeams_(account.schoolId,true,school[1])});
  }finally{lock.releaseLock()}
}

function registerAthlete_(body){
  const schoolName=clean_(body.schoolName,120), teamId=clean_(body.teamId,40), code=String(body.teamCode||body.schoolCode||''), athleteName=clean_(body.name,100);
  if(!/^\d{6}$/.test(code)||athleteName.length<2) return json_({ok:false,error:'Sporcu bilgileri geçersiz.'});
  if(!/^@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}$/.test(athleteName)) return json_({ok:false,error:'Sporcu adı @ ile başlamalıdır.'});
  const school=approvedSchoolByName_(schoolName);
  if(!school) return json_({ok:false,error:'Okul adı veya yönetici onayı doğrulanamadı.'});
  const team=findActiveTeam_(school[0],teamId,code,school[1]);
  if(!team) return json_({ok:false,error:'Takım veya 6 haneli takım kodu doğrulanamadı.'});
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) return json_({ok:false,error:'Kayıt servisi yoğun. Lütfen tekrar deneyin.'});
  try{
    const sh=getOrCreate_('Sporcu Kayitlari',ATHLETE_HEADERS);
    if(exactRows_(sh,5,athleteName,ATHLETE_HEADERS.length).some(r=>normalize_(r[4])===normalize_(athleteName))) return json_({ok:false,error:'Bu sporcu adı alınmış.'});
    const id='SPR-'+Utilities.getUuid().slice(0,8).toUpperCase();
    const avatarId=clean_(body.avatar,30), avatarName=clean_(body.avatarName,80);
    if(!/^(kadin|erkek)-voleybolcu-[1-6]$/.test(avatarId)) return json_({ok:false,error:'Profil seçimi geçersiz.'});
    const inheritedLogo=school[10]||(exactRows_(sh,3,school[1],ATHLETE_HEADERS.length).find(r=>/^https?:\/\//.test(r[7]))||[])[7]||'';
    sh.appendRow([id,school[0],school[1],code,athleteName,avatarId,avatarName||avatarId,inheritedLogo,false,'',new Date(),team[0],team[3],code]);
    const account={type:'athlete',id:id,name:athleteName,schoolId:school[0],schoolName:school[1],teamId:team[0],teamName:team[3],teamCode:code,schoolCode:code,avatar:avatarId,teamLogo:inheritedLogo};
    const session=createProfileSession_(account);
    return json_({ok:true,id:id,teamId:team[0],teamName:team[3],teamCode:code,teamLogo:inheritedLogo,account:account,profileToken:session.token,expiresIn:PROFILE_SESSION_SECONDS});
  }finally{lock.releaseLock()}
}

function splitTeamValues_(value){return String(value||'').split('|').map(item=>item.trim()).filter(Boolean)}
function trainerTeamsFromRow_(row){
  const ids=splitTeamValues_(row&&row[11]), names=splitTeamValues_(row&&row[12]), codes=splitTeamValues_(row&&row[13]);
  return ids.map((id,index)=>({id:id,name:names[index]||'',code:codes[index]||''}));
}
function registerTrainer_(body){
  const schoolName=clean_(body.schoolName,120), trainerName=clean_(body.name,100), title=clean_(body.title,60)||'Voleybol Antrenörü';
  const requested=Array.isArray(body.teams)&&body.teams.length?body.teams:[{teamId:body.teamId,teamCode:body.teamCode||body.schoolCode}];
  const selections=requested.slice(0,20).map(item=>({teamId:clean_(item&&item.teamId,40),teamCode:String(item&&item.teamCode||'').replace(/\D/g,'')})).filter((item,index,list)=>item.teamId&&list.findIndex(other=>other.teamId===item.teamId)===index);
  if(!selections.length||selections.some(item=>!/^\d{6}$/.test(item.teamCode))||!/^@[A-Za-z0-9._çğıöşüÇĞİÖŞÜ-]{2,30}$/.test(trainerName)||title.length<3) return json_({ok:false,error:'Antrenör ve takım bilgileri geçersiz.'});
  const avatarId=clean_(body.avatar,30), avatarName=clean_(body.avatarName,80);
  if(!/^(kadin|erkek)-antrenor-[1-6]$/.test(avatarId)) return json_({ok:false,error:'Antrenör profil seçimi geçersiz.'});
  const school=approvedSchoolByName_(schoolName);
  if(!school) return json_({ok:false,error:'Okul adı veya yönetici onayı doğrulanamadı.'});
  const teams=selections.map(item=>findActiveTeam_(school[0],item.teamId,item.teamCode,school[1]));
  if(teams.some(team=>!team)) return json_({ok:false,error:'Seçilen takımlardan biri veya 6 haneli takım kodu doğrulanamadı.'});
  const memberships=teams.map(team=>({id:team[0],name:team[3],code:team[4]}));
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) return json_({ok:false,error:'Kayıt servisi yoğun. Lütfen tekrar deneyin.'});
  try{
    const sh=getOrCreate_('Antrenor Kayitlari',TRAINER_HEADERS);
    if(exactRows_(sh,5,trainerName,TRAINER_HEADERS.length).some(r=>r[1]===school[0]&&normalize_(r[4])===normalize_(trainerName))) return json_({ok:false,error:'Bu antrenör adı seçilen okulda zaten kayıtlı.'});
    const id='ANT-'+Utilities.getUuid().slice(0,8).toUpperCase();
    const inheritedLogo=school[10]||(exactRows_(sh,3,school[1],TRAINER_HEADERS.length).find(r=>/^https?:\/\//.test(r[6]))||[])[6]||'';
    const teamIds=memberships.map(team=>team.id).join('|'), teamNames=memberships.map(team=>team.name).join('|'), teamCodes=memberships.map(team=>team.code).join('|');
    sh.appendRow([id,school[0],school[1],memberships[0].code,trainerName,title,inheritedLogo,'AKTİF',new Date(),avatarId,avatarName||avatarId,teamIds,teamNames,teamCodes]);
    const account={type:'trainer',id:id,schoolId:school[0],schoolName:school[1],teamId:memberships[0].id,teamName:memberships[0].name,teamCode:memberships[0].code,teamIds:memberships.map(team=>team.id),teamNames:memberships.map(team=>team.name),teamCodes:memberships.map(team=>team.code),teams:memberships,schoolCode:memberships[0].code,name:trainerName,title:title,avatar:avatarId,teamLogo:inheritedLogo,status:'AKTİF'};
    const session=createProfileSession_(account);
    return json_({ok:true,id:id,teams:memberships,teamId:memberships[0].id,teamName:memberships[0].name,teamCode:memberships[0].code,teamLogo:inheritedLogo,account:account,profileToken:session.token,expiresIn:PROFILE_SESSION_SECONDS});
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
  const type=String(body.type||'').toLowerCase(), schoolName=clean_(body.schoolName,120), code=String(type==='club'?body.schoolCode:(body.teamCode||body.schoolCode)||'').replace(/\D/g,''), teamId=clean_(body.teamId,40), userName=clean_(body.userName,100);
  if(!['club','athlete','trainer'].includes(type)||!schoolName||!/^\d{6}$/.test(code)) return json_({ok:false,error:'Giriş bilgileri geçersiz.'});
  const school=approvedSchoolByName_(schoolName);
  if(!school) return json_({ok:false,error:'Kulüp adı veya yönetici onayı doğrulanamadı.'});
  let account;
  if(type==='club'){
    if(school[3]!==code) return json_({ok:false,error:'Kulüp adı veya kulüp giriş kodu doğrulanamadı.'});
    account={type:'club',id:school[0],schoolId:school[0],schoolName:school[1],name:school[1],phone:school[2],schoolCode:school[3],teamLogo:school[10]||''};
  }
  if(type==='athlete'){
    const team=findActiveTeam_(school[0],teamId,code,school[1]);
    if(!team) return json_({ok:false,error:'Takım veya takım kodu doğrulanamadı.'});
    const sh=getOrCreate_('Sporcu Kayitlari',ATHLETE_HEADERS);
    const person=exactRows_(sh,5,userName,ATHLETE_HEADERS.length).find(r=>r[1]===school[0]&&r[11]===team[0]&&normalize_(r[4])===normalize_(userName));
    if(!person) return json_({ok:false,error:'Sporcu adı seçilen takımın kayıtlarıyla eşleşmedi.'});
    account={type:'athlete',id:person[0],schoolId:person[1],schoolName:person[2],teamId:team[0],teamName:team[3],teamCode:team[4],schoolCode:team[4],name:person[4],avatar:person[5],teamLogo:person[7]||school[10]||''};
  }
  if(type==='trainer'){
    const team=findActiveTeam_(school[0],teamId,code,school[1]);
    if(!team) return json_({ok:false,error:'Takım veya takım kodu doğrulanamadı.'});
    const sh=getOrCreate_('Antrenor Kayitlari',TRAINER_HEADERS);
    const person=exactRows_(sh,5,userName,TRAINER_HEADERS.length).find(r=>r[1]===school[0]&&splitTeamValues_(r[11]).includes(team[0])&&normalize_(r[4])===normalize_(userName)&&String(r[7]||'AKTİF').toLocaleUpperCase('tr')==='AKTİF');
    if(!person) return json_({ok:false,error:'Antrenör adı seçilen takımın aktif kayıtlarıyla eşleşmedi.'});
    const memberships=trainerTeamsFromRow_(person);
    account={type:'trainer',id:person[0],schoolId:person[1],schoolName:person[2],teamId:team[0],teamName:team[3],teamCode:team[4],teamIds:memberships.map(item=>item.id),teamNames:memberships.map(item=>item.name),teamCodes:memberships.map(item=>item.code),teams:memberships,schoolCode:team[4],name:person[4],title:person[5]||'Antrenör',teamLogo:person[6]||school[10]||'',status:person[7]||'AKTİF',avatar:person[9]||''};
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

function normalizeWhatsappPhone_(value){
  let phone=String(value||'').replace(/\D/g,'');
  if(phone.length===11&&phone.startsWith('0')) phone='90'+phone.slice(1);
  else if(phone.length===10) phone='90'+phone;
  return phone;
}
function schoolApprovalMessage_(school,code){
  return [
    'Merhaba '+school+' Yetkilisi,',
    '',
    'Online Voleybol Akademisi spor okulu kaydınız onaylandı.',
    '',
    'Kulüp adı: '+school,
    'Kulüp giriş kodu: '+code,
    '',
    'Bu kod yalnızca kulüp yöneticisinin giriş yapması içindir. Sporcu ve antrenörlerle paylaşmayın.',
    '',
    'İlk girişten sonra:',
    '1. Kulüp profilinize giriş yapın.',
    '2. Takımlarınızı oluşturun.',
    '3. Her takım için sistemin oluşturduğu 6 haneli takım kodunu kontrol edin.',
    '4. Sporcu ve antrenörlere yalnızca bağlı oldukları takımın kodunu gönderin.',
    '',
    'Kulüp girişi: https://voleybolokullari.com.tr/giris/',
    'Sporcu ve antrenör kaydı: https://voleybolokullari.com.tr/kayit/',
    '',
    'Online Voleybol Akademisi'
  ].join('\n');
}
function writeSchoolApproval_(sh,row){
  const school=sh.getRange(row,2).getDisplayValue().trim();
  const phone=normalizeWhatsappPhone_(sh.getRange(row,3).getDisplayValue());
  const code=sh.getRange(row,4).getDisplayValue().replace(/\D/g,'');
  if(!school||!/^\d{6}$/.test(code)) return;
  const message=schoolApprovalMessage_(school,code);
  sh.getRange(row,7).setValue(new Date());
  sh.getRange(row,8).setValue(message).setWrap(true);
  const linkCell=sh.getRange(row,9);
  if(phone.length>=10&&phone.length<=15){
    const url='https://wa.me/'+phone+'?text='+encodeURIComponent(message);
    const richText=SpreadsheetApp.newRichTextValue().setText('WhatsApp ile gönder').setLinkUrl(url).build();
    linkCell.setRichTextValue(richText);
  }else{
    linkCell.setValue('Telefon numarası gerekli');
  }
}
function onEdit(e){
  const sh=e.range.getSheet(), name=sh.getName(), row=e.range.getRow();
  if(row<2) return;
  if(name==='Okul Kayitlari'){
    const status=sh.getRange(row,5).getDisplayValue().trim().toLocaleUpperCase('tr');
    if(status==='ONAYLANDI'&&[2,3,4,5].includes(e.range.getColumn())) writeSchoolApproval_(sh,row);
    rebuildSchoolRosterById_(sh.getRange(row,1).getDisplayValue());
    return;
  }
  if(name.indexOf('OKUL - ')===0&&normalize_(sh.getRange(row,1).getDisplayValue())==='takım'){clearPublicTeamCache_();return}
  if(name==='Sporcu Kayitlari'||name==='Antrenor Kayitlari') rebuildSchoolRosterById_(sh.getRange(row,2).getDisplayValue());
}

const SCHOOL_ROSTER_HEADERS=['Kayıt Türü','Kullanıcı ID','Okul Kayıt ID','Okul Adı','Okul Kodu','Kullanıcı Adı','Görev','Profil Kodu','Profil Görseli','Takım Logosu','Durum','Çevrim İçi','Son Görülme','Kayıt Tarihi','Takım ID','Takım Adı','Takım Kodu'];
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
  const teamRows=target.getLastRow()>1?target.getRange(2,1,target.getLastRow()-1,SCHOOL_ROSTER_HEADERS.length).getDisplayValues().filter(r=>normalize_(r[0])==='takım'):[];
  if(target.getLastRow()>1) target.getRange(2,1,target.getLastRow()-1,SCHOOL_ROSTER_HEADERS.length).clearContent();
  const output=teamRows.slice(), teamCount=teamRows.length, athletes=ss.getSheetByName('Sporcu Kayitlari'), trainers=ss.getSheetByName('Antrenor Kayitlari');
  if(athletes&&athletes.getLastRow()>1) athletes.getDataRange().getDisplayValues().slice(1).filter(r=>r[1]===schoolId).forEach(r=>output.push(['Sporcu',r[0],r[1],r[2],r[3],r[4],'Sporcu',r[5],r[6],r[7],'AKTİF',r[8],r[9],r[10],r[11]||'',r[12]||'',r[13]||'']));
  if(trainers&&trainers.getLastRow()>1) trainers.getDataRange().getDisplayValues().slice(1).filter(r=>r[1]===schoolId).forEach(r=>output.push(['Antrenör',r[0],r[1],r[2],r[3],r[4],r[5],r[9]||'',r[10]||'',r[6],r[7],'','',r[8],r[11]||'',r[12]||'',r[13]||'']));
  if(output.length) target.getRange(2,1,output.length,SCHOOL_ROSTER_HEADERS.length).setValues(output);
  if(teamCount) target.getRange(2,1,teamCount,SCHOOL_ROSTER_HEADERS.length).setBackground('#fff2e8').setFontWeight('bold');
  if(output.length>teamCount) target.getRange(teamCount+2,1,output.length-teamCount,SCHOOL_ROSTER_HEADERS.length).setBackground('#ffffff').setFontWeight('normal');
  target.setFrozenRows(1); target.autoResizeColumns(1,SCHOOL_ROSTER_HEADERS.length);
}
function syncSchoolRosterSheets(){
  const sh=SpreadsheetApp.getActive().getSheetByName('Okul Kayitlari');
  if(!sh||sh.getLastRow()<2) return 0;
  const ids=sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat().filter(Boolean);
  ids.forEach(rebuildSchoolRosterById_); return ids.length;
}

function getOrCreate_(name,headers){
  const ss=SpreadsheetApp.getActive(); let sh=ss.getSheetByName(name), created=false;
  if(!sh){sh=ss.insertSheet(name);created=true}
  if(sh.getMaxColumns()<headers.length) sh.insertColumnsAfter(sh.getMaxColumns(),headers.length-sh.getMaxColumns());
  if(created||sh.getLastRow()===0||sh.getRange(1,headers.length).getDisplayValue()!==headers[headers.length-1]) sh.getRange(1,1,1,headers.length).setValues([headers]);
  if(sh.getFrozenRows()!==1) sh.setFrozenRows(1);
  return sh;
}
function exactRows_(sh,column,value,width){
  if(!sh||sh.getLastRow()<2||!String(value||'').trim()) return [];
  return sh.getRange(2,column,sh.getLastRow()-1,1).createTextFinder(String(value).trim()).matchEntireCell(true).matchCase(false).findAll().map(cell=>sh.getRange(cell.getRow(),1,1,width).getDisplayValues()[0]);
}
function approvedSchoolByName_(schoolName){
  const sh=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu','Takım Logosu (Manuel)']);
  return exactRows_(sh,2,schoolName,11).find(r=>normalize_(r[1])===normalize_(schoolName)&&String(r[4]).toLocaleUpperCase('tr')==='ONAYLANDI')||null;
}
function schoolById_(schoolId){
  const sh=getOrCreate_('Okul Kayitlari',['Kayıt ID','Okul Adı','Telefon','6 Haneli Kod','Onay Durumu','Kayıt Tarihi','Onay Tarihi','WhatsApp Mesajı','WhatsApp Bağlantısı','Yönetici Notu','Takım Logosu (Manuel)']);
  return exactRows_(sh,1,schoolId,11).find(r=>r[0]===schoolId)||null;
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
