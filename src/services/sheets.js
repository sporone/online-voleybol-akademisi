const API_URL=import.meta.env.VITE_SHEETS_API_URL;
const CACHE_MS=5*60*1000;
export async function fetchSheet(tab){
  if(!API_URL) throw new Error('Google Sheets bağlantısı yapılandırılmadı');
  const key=`ova:${tab}`, cached=sessionStorage.getItem(key);
  if(cached){const parsed=JSON.parse(cached);if(Date.now()-parsed.time<CACHE_MS)return parsed.data}
  const response=await fetch(`${API_URL}?sheet=${encodeURIComponent(tab)}`);
  if(!response.ok)throw new Error(`Veri alınamadı (${response.status})`);
  const json=await response.json(); if(!Array.isArray(json.data))throw new Error('Geçersiz veri biçimi');
  sessionStorage.setItem(key,JSON.stringify({time:Date.now(),data:json.data})); return json.data;
}
