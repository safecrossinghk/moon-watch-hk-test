const HK={lat:22.3193,lon:114.1694};
async function loadWeather(lat=HK.lat,lon=HK.lon){
const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,cloud_cover,visibility&forecast_days=2&timezone=Asia%2FHong_Kong`;
const r=await fetch(url);if(!r.ok)throw Error("Weather request failed");const d=await r.json(),now=new Date();
const h=d.hourly.time.map((t,i)=>({time:new Date(t),temp:d.hourly.temperature_2m[i],rain:d.hourly.precipitation_probability[i]??0,cloud:d.hourly.cloud_cover[i]??100,visibility:d.hourly.visibility[i]??0}));
const cur=h.reduce((a,b)=>Math.abs(a.time-now)<Math.abs(b.time-now)?a:b);
temp.textContent=`${Math.round(cur.temp)}°`;cloud.textContent=`${Math.round(cur.cloud)}%`;rain.textContent=`${Math.round(cur.rain)}%`;visibility.textContent=`${(cur.visibility/1000).toFixed(1)} km`;
const tonight=h.filter(x=>x.time.getDate()===now.getDate()&&x.time.getHours()>=18&&x.time.getHours()<=23);
if(!tonight.length)return;
const s=tonight.map(x=>({...x,score:Math.round((100-x.cloud)*.4+(100-x.rain)*.25+Math.min(100,x.visibility/1000/10*100)*.2+15)}));
const avg=Math.round(s.reduce((a,x)=>a+x.score,0)/s.length);score.textContent=avg;scoreText.textContent=avg>=80?"今晚天氣條件相當不錯":avg>=60?"今晚有機會看到月亮":"今晚雲雨可能影響賞月";
const best=s.reduce((a,b)=>a.score>b.score?a:b);bestTime.textContent=`最佳賞月時間：約 ${String(best.time.getHours()).padStart(2,"0")}:00`;weatherStatus.textContent=`今晚 18:00–23:00 共取得 ${tonight.length} 個逐小時預報資料。`;
}
locationBtn.onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>loadWeather(p.coords.latitude,p.coords.longitude),()=>alert("未能取得位置，繼續使用香港預設位置。")):alert("此裝置不支援定位。");
loadWeather().catch(()=>{weatherStatus.textContent="暫時無法取得 Open-Meteo 天氣資料。";scoreText.textContent="資料載入失敗";});