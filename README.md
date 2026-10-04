# LSK WALK HK｜荔枝角步行地圖

Mobile-first、GitHub Pages 相容的步行資訊 Web App。這是一個步行工具，而非遊戲：使用 OpenStreetMap 地圖、LSK001 燈號倒數、行人活動**推算**、天氣及簡易路線資訊。

## 資料狀態與原則

- **人流預設不會假造資料。** 當 `./api/crowd`（或設定的 Worker）無法取得資料時，UI 顯示「人流資料暫未連線」及「目前沒有足夠的人流訊號」。不會把 mock 值當成 Outscraper 即時資料。
- 人流是「附近多個 Google Maps / Outscraper 地點活動訊號」經距離與類型加權的**推算人流**，不是街上實際行人計數或 Google 即時行人數。
- LSK001 Countdown API 無法連線時，才會顯示明確的 `DEVELOPMENT MOCK` 倒數；絕不標成即時。天氣及降雨目前也清楚顯示未連線。
- 前端沒有 Outscraper key，也不會讓訪客直接呼叫 Outscraper；位置僅用於本機的路線估算，不保存或上傳。

## 架構與核心檔案

- `src/config.js`：唯一的 API 設定、`VITE_CROWD_API_URL` 覆寫點、搜尋 query 及含 `TODO_LSK001_COORDINATES` 的 LSK001 座標。
- `src/services/crowdApi.js`：只讀取 Worker 的 `/api/crowd` JSON，不會接觸 API key。
- `src/services/crowdInference.js`：獨立的加權推算公式；距離、地點類型、分級 threshold 集中於 `src/config/crowdModel.js`。
- `worker/crowd-worker.js`：Cloudflare Worker 的 server-side 模板；`OUTSCRAPER_API_KEY` 必須以 Worker secret 設定並由 Worker 快取五分鐘。
- `src/services/countdownApi.js`：讀取既有 LSK001 Worker，以 API end time 計算而非累加計時；回到前景會重新同步。
- `src/services/weatherApi.js`、`src/services/rainForecast.js`：可替換的獨立天氣及香港降雨預報 adapter。
- `public/data/lsk-walk-segments.geojson`：尚未量測的道路 geometry 以空陣列和 TODO 表示，沒有捏造座標。

## 人流 Worker response

Worker 預期回傳一個 object 或 `segments` array；每筆必須保留：`roadSegmentId`、`name`、`flowLevel`、`flowScore`、`source`、`sourceCount`、`signals`、`factors`、`confidence`、`updatedAt`、`modelVersion`。缺少 live / popular-times signal 時，應回傳 `flowLevel: "unknown"`、`flowScore: null`、`confidence: 0`。

`crowdInference.js` 使用：`Σ(livePercentage × distanceWeight × typeWeight) / Σ(distanceWeight × typeWeight)`；0–30 為 low、31–60 為 medium、61–100 為 high。可信度只顯示高／中／低推算品質，並非官方準確率。

## Cloudflare Worker 接入

1. 將 `worker/crowd-worker.js` 部署成獨立 Worker，設定 secret：`wrangler secret put OUTSCRAPER_API_KEY`。
2. Worker 應以 5 分鐘 cache 統一查詢、去重並過濾無座標、超過 500m 或缺少 live signal 的地點，再透過 inference module 回傳 JSON。
3. 在部署前設定 `globalThis.VITE_CROWD_API_URL` 或把 `API_CONFIG.crowdUrl` 改為該 Worker 的 `/api/crowd` URL；這是唯一的前端 API 設定位置。

## GitHub Pages

Push repository 後，在 **Settings → Pages → Deploy from a branch** 選擇 branch 及 `/(root)`。所有本地檔案連結均為相對路徑，適用於 `https://<user>.github.io/<repo>/`。PWA manifest 和 service worker 已包含在專案中。
