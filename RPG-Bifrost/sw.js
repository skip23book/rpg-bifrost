// ══════════════════════════════════════════════════
//  RPG BIFROST — Service Worker (v1.1.1)
//  รองรับ offline mode + cache static assets
// ══════════════════════════════════════════════════
//
//  กลยุทธ์:
//   - "core" assets (HTML/CSS/JS/manifest/icons) → cache-first
//     ถ้าเน็ตหลุดก็ยังเปิดแอปได้ ไม่เห็นหน้า dino
//   - Apps Script API (script.google.com) → network-only เสมอ
//     เพราะข้อมูล realtime ห้าม cache (จะได้เซฟเก่า)
//   - รูปภาพ chars / icons → cache-first พร้อม fallback
//   - หน้า navigation ใหม่ → network-first → fallback cache → fallback /index.html
//
//  หมายเหตุ DEV vs Final:
//   - DEV ปิด SW โดย default ผ่าน config (BIFROST_CONFIG.DEV_MODE === true)
//   - script.js จะ register SW เฉพาะตอน DEV_MODE === false หรือ explicit opt-in
//
const VERSION = "1.1.1";
const CORE_CACHE = "bifrost-core-" + VERSION;
const IMG_CACHE  = "bifrost-img-"  + VERSION;
const RUNTIME    = "bifrost-rt-"   + VERSION;

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=" + VERSION,
  "./script.js?v=" + VERSION,
  "./config.js?v=" + VERSION,
  "./manifest.json?v=" + VERSION,
  "./stats.html",
  "./wallet.html",
  "./images/icon-01.png",
  "./images/icon-02.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CORE_CACHE).then(function(cache) {
      // ใช้ addAll แต่ if-fail แต่ละชิ้น ไม่ทำให้ install ทั้งก้อนพัง
      return Promise.all(CORE_ASSETS.map(function(url) {
        return cache.add(url).catch(function(err) {
          // ถ้าโหลดไฟล์ใดไฟล์หนึ่งไม่ได้ ไม่ break install
          console.warn("[SW] skip cache for", url, err && err.message);
        });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        // ลบ cache รุ่นเก่าที่ไม่ตรงกับ version ปัจจุบัน
        if (key !== CORE_CACHE && key !== IMG_CACHE && key !== RUNTIME) {
          return caches.delete(key);
        }
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

function isApiRequest(url) {
  return /script\.google(?:usercontent)?\.com/.test(url.hostname) || /api-data\.line\.me/.test(url.hostname);
}
function isImage(url) {
  return /\.(?:png|jpe?g|gif|webp|svg)$/i.test(url.pathname);
}

self.addEventListener("fetch", function(event) {
  var req = event.request;
  if (req.method !== "GET") return; // ไม่ cache POST/PUT/DELETE

  var url;
  try { url = new URL(req.url); } catch (_) { return; }

  // 🌐 API Apps Script → network-only (กัน cache เซฟเก่า)
  if (isApiRequest(url)) {
    return; // ปล่อยให้ default fetch ไป
  }

  // 🖼️ รูปภาพ → cache-first
  if (isImage(url)) {
    event.respondWith(
      caches.open(IMG_CACHE).then(function(cache){
        return cache.match(req).then(function(hit){
          if (hit) return hit;
          return fetch(req).then(function(res){
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(function(){ return hit || Response.error(); });
        });
      })
    );
    return;
  }

  // 📄 Navigation → network-first, fallback cache, fallback index.html
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(function(){
        return caches.match(req).then(function(hit){
          return hit || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // ⚙️ Default: cache-first สำหรับ same-origin static
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(function(hit){
        if (hit) return hit;
        return fetch(req).then(function(res){
          // เก็บลง runtime cache ถ้าตอบกลับมาดี
          if (res && res.ok && res.type === "basic") {
            var clone = res.clone();
            caches.open(RUNTIME).then(function(c){ c.put(req, clone); });
          }
          return res;
        }).catch(function(){ return hit || Response.error(); });
      })
    );
  }
});

// 🔁 รองรับ message จาก client เพื่อ trigger update เร็ว
self.addEventListener("message", function(event) {
  if (event && event.data === "skip-waiting") self.skipWaiting();
});
