import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import {createHash,randomUUID} from "node:crypto";

const source=fs.readFileSync(new URL('../apps-script/Code.gs',import.meta.url),'utf8');
function harness(){
  let now=0;
  const cached=new Map(),properties=new Map(),sheets=new Map();
  const cache={get:key=>{const item=cached.get(key);return item&&item.until>now?item.value:null},put:(key,value,ttl)=>cached.set(key,{value,until:now+ttl}),remove:key=>cached.delete(key)};
  const sheet=(name)=>{
    const rows=[];
    const obj={rows,getLastRow:()=>rows.length,getMaxColumns:()=>26,getFrozenRows:()=>1,setFrozenRows:()=>{},appendRow:r=>rows.push([...r]),getDataRange:()=>({getDisplayValues:()=>rows.map(r=>r.map(String))}),getRange:(row,column,height=1,width=1)=>({
      getDisplayValues:()=>Array.from({length:height},(_,i)=>Array.from({length:width},(_,j)=>String(rows[row-1+i]?.[column-1+j]??''))),
      setValues:values=>{values.forEach((r,i)=>{rows[row-1+i]??=[];r.forEach((v,j)=>rows[row-1+i][column-1+j]=v)});},
    })};sheets.set(name,obj);return obj;
  };
  const context=vm.createContext({console:{log:()=>assert.fail('Credentials must not be logged')},Date,JSON,Math,
    SpreadsheetApp:{getActive:()=>({getSheetByName:name=>sheets.get(name)||null,insertSheet:sheet})},
    Utilities:{getUuid:randomUUID,Charset:{UTF_8:'utf8'},DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,value)=>[...createHash('sha256').update(value).digest()].map(x=>x>127?x-256:x)},
    ContentService:{MimeType:{JSON:'json'},createTextOutput:value=>({value,setMimeType(){return this}})},
    LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})},
    CacheService:{getScriptCache:()=>cache},PropertiesService:{getScriptProperties:()=>({getProperty:k=>properties.get(k),setProperty:(k,v)=>properties.set(k,v)})},
  });
  vm.runInContext(source,context);
  return {context,sheets,sheet,cache,properties,advance:seconds=>now+=seconds,post:body=>JSON.parse(context.doPost({postData:{contents:JSON.stringify(body)}}).value)};
}
test('individual registration issues a private random code, stores only its salted hash, and authenticates',()=>{
  const h=harness();const result=h.post({action:'registerUser',userName:'@Deneme'});
  assert.equal(result.ok,true);assert.equal(result.account.type,'user');assert.equal(result.account.name,'@deneme');assert.match(result.code,/^[a-f0-9]{32}$/);
  const row=h.sheets.get('Kullanici Kayitlari').rows[1];assert.notEqual(row[2],result.code);assert.equal(JSON.stringify(row).includes(result.code),false);
  assert.equal(h.post({action:'profileLogin',userName:'@DENEME',code:result.code}).ok,true);
  const valid=h.post({action:'validateProfileSession',token:result.token});assert.equal(valid.account.id,result.account.id);assert.equal('code' in valid,false);
  assert.equal(h.post({action:'registerUser',userName:'@deneme'}).ok,false);assert.equal(h.sheets.get('Kullanici Kayitlari').rows.length,2);
});
test('failed login is throttled, logout and expiry revoke user sessions',()=>{
  const h=harness(),user=h.post({action:'registerUser',userName:'@test'});
  for(let i=0;i<5;i++)assert.equal(h.post({action:'profileLogin',userName:'@test',code:'0'.repeat(32)}).ok,false);
  assert.match(h.post({action:'profileLogin',userName:'@test',code:user.code}).error,/15 dakika/);
  h.advance(901);const login=h.post({action:'profileLogin',userName:'@test',code:user.code});assert.equal(login.ok,true);
  h.post({action:'logoutProfile',token:login.token});assert.equal(h.post({action:'validateProfileSession',token:login.token}).ok,false);
  const next=h.post({action:'profileLogin',userName:'@test',code:user.code});h.advance(901);assert.equal(h.post({action:'validateProfileSession',token:next.token}).ok,false);
});
test('private records and old registration/assignment APIs are closed without side effects',()=>{
  const h=harness();
  for(const action of ['registerSchool','registerAthlete','registerTrainer','manageClubTeam','assignTrainerTeams','renewTrainerCode','syncSchoolRoster','listClubTeams','saveAnnualPlan'])assert.equal(h.post({action}).ok,false,action);
  for(const sheet of ['Okul Kayitlari','Sporcu Kayitlari','Antrenor Kayitlari','Takimlar','Users','Kullanici Kayitlari','Sinav Sonuclari'])assert.equal(JSON.parse(h.context.doGet({parameter:{sheet}}).value).ok,false,sheet);
  assert.equal(h.sheets.size,0);
  h.cache.put('profile:old',JSON.stringify({type:'club',id:'old'}),900);assert.equal(h.post({action:'validateProfileSession',token:'old'}).ok,false);
});
test('exam history is scoped to the authenticated user and rejects missing sessions',()=>{
  const h=harness(),a=h.post({action:'registerUser',userName:'@first'}),b=h.post({action:'registerUser',userName:'@second'});
  const exams=h.sheet('Sinav Sonuclari');exams.rows.push(['Giriş ID','Kullanıcı ID'],['a',a.account.id],['b',b.account.id]);
  const result=h.post({action:'listExamAttempts',token:a.token});assert.equal(result.items.length,1);assert.equal(result.items[0]['Giriş ID'],'a');
  assert.equal(h.post({action:'listExamAttempts'}).ok,false);
});
test('user tokens cannot access admin APIs and existing admin authentication is preserved',()=>{
  const h=harness(),user=h.post({action:'registerUser',userName:'@normal'});
  h.properties.set('ADMIN_CODE_HASH',h.context.hash_('123456'));
  assert.equal(h.post({action:'adminStats',token:user.token}).ok,false);
  assert.equal(h.post({action:'adminLogin',code:'000000',clientId:'test'}).ok,false);
  const admin=h.post({action:'adminLogin',code:'123456',clientId:'test'});assert.equal(admin.ok,true);assert.equal(admin.expiresIn,1800);
  assert.equal(h.post({action:'validateProfileSession',token:admin.token}).ok,false);
  assert.equal(h.properties.get('ADMIN_CODE_HASH'),h.context.hash_('123456'));
});
