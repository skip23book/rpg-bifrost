// ══════════════════════════════════════════════════
//  STATE (ตัวแปรระบบหลัก)
// ══════════════════════════════════════════════════
var APP_VERSION = "1.0.3";
var LINE_MUTE_MODE = false;
// Web App URL ของ Apps Script สำหรับใช้งานจริง
var BIFROST_API_URL = "https://script.google.com/macros/s/AKfycbzhZ4vnKvSMhxay6Wz2Ur86cI3bBXhel3ms_v9yH27eEKT9m8M4QmcMFypts59iwXst/exec";

// กรอกเลขเวอร์ชันและรายละเอียดอัปเดตตรงนี้ได้เลย
// เพิ่ม/ลบบรรทัดใน APP_UPDATE_NOTES ได้ตามต้องการ เมื่อ APP_VERSION เปลี่ยน popup จะแสดงครั้งแรกอัตโนมัติ
var APP_UPDATE_NOTES = [
  "เพิ่มระบบ Auto Update/Force Reload ให้โหลดไฟล์เวอร์ชันใหม่อัตโนมัติ ไม่ต้องลบ PWA แล้วลงใหม่",
  "เพิ่มตัวตรวจเวอร์ชันจาก backend เพื่อป้องกันมือถือหรือ PWA ใช้ script เก่าค้างอยู่",
  "แก้ระบบ CloudSave ไม่ให้ข้อมูลเก่าทับข้อมูลใหม่หลังส่งภารกิจหรือเปิดแอปใหม่",
  "อัปเดต LINE Token ใหม่เพื่อให้ Flex Message และแจ้งเตือน LINE กลับมาทำงาน",
  "เพิ่มรายจ่ายวันนี้บน Dashboard และนับการแลกเงินผ่าน Wallet เป็นรายจ่าย",
  "แก้ Daily Adventure Log ไม่ให้หลุดไปแสดงบนหน้า Quest และ Shop",
  "ปรับความเสถียรของการซิงค์ข้อมูลเหรียญ ไอเท็ม และสถิติข้ามอุปกรณ์"
];
var AV = ['🧙','⚔️','🏹','🧜','🔥','⚡','🌊','🍃','❄️','💫','🦅','🐉','🌸','🗡️','🛡️','👑','🌙','☀️','🎭','✨','🦇','🐺','🧚','🧞','🧟','🤖','👽','👻','☠️','🤡','🦁','🐍','🐢','🐦','🦄','🐝','🦊','🐙','🕷️','🦂','💎','🔮','🪓','🔱','👁️','🪐','☄️','🌪️','🌌','♾️'];
var AN = ['นักเวทย์','นักรบ','นักธนู','ไฮโดร','ไพโร','อิเล็กโตร','อควา','อะเนโม','ครายโอ','แอสโตร','ฮอว์ค','มังกร','ซากุระ','คาตา','พาลาดิน','ราชัน','ลูน่า','โซลาร์','มายา','ดาวเด่น','แวมไพร์','ไลแคน','แฟรี่','จินนี่','ซอมบี้','ไซบอร์ก','เอเลี่ยน','สเปกเตอร์','เนโครมันเซอร์','โจ๊กเกอร์','ราชสีห์','ไวเปอร์','เก็นบุ','ฟีนิกซ์','ยูนิคอร์น','คิลเลอร์บี','คิทซึเนะ','คราเคน','อารัคเน่','สคอร์เปียน','โกเลม','ออราเคิล','เบอร์เซิร์กเกอร์','โพไซดอน','ผู้หยั่งรู้','คอสมิก','เมเทโอ','พายุหมุน','เนบิวลา','อัลฟ่า'];
var CHAR_NAMES=['นักดาบฝึกหัด','นักรบฝึกหัด','สำนักดาบ','ทหารยาม','อัศวินสามัญ','ผู้พิทักษ์','นักรบแนวหน้า','อัศวินศักดิ์สิทธิ์','พาลาดินศักดิ์สิทธิ์','เทมพลาร์หลวง','อัศวินองครักษ์','อัศวินเพลิง','จทัพศักดิ์สิทธิ์','นักดาบเงา','อัศวินรัตติกาล','จ้าวแห่งเพลิง','ผู้พิทักษ์เหมันต์','จ้าวแห่งพายุ','ผู้พิทักษ์สวรรค์','ตำนานนิรันดร์'];
var FEEL=[null,{i:'😫',l:'เหนื่อยมาก'},{i:'😔',l:'ค่อนข้างเหนื่อย'},{i:'😐',l:'พอสู้ได้'},{i:'😊',l:'ดีมาก'},{i:'🌟',l:'ยอดเยี่ยม!'}];
var HOF_INFO = { shark: { i: '🦈', t: 'บอสฉลามขาว', c: 'ว่ายฟรีสไตล์ต่ำกว่าเป้าหมาย' }, book:  { i: '📚', t: 'บอสหมอโหด', c: 'สอบได้คะแนน >= 90% (โดนยึดคืนถ้าคะแนนตก)' }, heart: { i: '❤️', t: 'บอสมุ่งมั่น', c: 'ได้ดาบทอง 7 วันรวด (โดนยึดคืนถ้าพลาด)' }, pole: { i: '🦒', t: 'บอสเสาไฟ', c: 'ส่วนสูงเพิ่มขึ้นทุกๆ 2 ซม.' }, shrimp: { i: '💪', t: 'บอสกุ้งแห้งเล่นเวท', c: 'น้ำหนักเพิ่มขึ้นทุกๆ 2 กก.' } };
var BOSS_DETAILS = { shark: { i: '🦈', t: 'บอสฉลามขาว', c: 'ว่าย Sprint ฟรีสไตล์ 25 เมตร เพื่อล้มบอสไปทีละด่าน!\n(ทีละ 1 วิ)', r: '🏆 ล้มบอสระดับ 25-21 วิ รับ 50 B-Coin |\nระดับ 20 วิลงไป รับ 200 B-Coin!', n: 'บอสจะโผล่มาให้สู้ทีละด่านเท่านั้น เริ่มต้นที่ด่าน 25 วิ!' }, book: { i: '📚', t: 'บอสหมอโหด', c: 'ทำคะแนนสอบวิชาใดก็ได้ให้ได้ตั้งแต่ 90% ขึ้นไป', r: '💎 +300 B-Coin และปลดล็อกตราคัมภีร์', n: 'ระวัง!\nถ้าสอบครั้งถัดไปได้น้อยกว่า 90% ตราจะหายไปนะ' }, heart: { i: '❤️', t: 'บอสมุ่งมั่น', c: 'ทำภารกิจรายวัน (โซน 1) ให้ครบทั้ง 3 ข้อ ติดต่อกัน 7 วัน (จันทร์-อาทิตย์)', r: '🌟 +18 B-Coin และปลดล็อกตราหัวใจเหล็กไหล (พร้อมกุญแจทอง 2 ดอก)', n: 'ถ้าพลาดแม้แต่วันเดียวในสัปดาห์ ตราจะโดนยึดคืนทันที' }, pole: { i: '🦒', t: 'บอสเสาไฟ', c: 'ส่วนสูงเพิ่มขึ้นทุกๆ 2 เซนติเมตร จากฐานความสูงเดิมของคุณ', r: '💰 +30 B-Coin (รับได้เรื่อยๆ ทุกครั้งที่สูงขึ้น)', n: 'ปัดเศษทศนิยมทิ้ง นับเฉพาะจำนวนเต็มที่เพิ่มขึ้น' }, shrimp: { i: '💪', t: 'บอสกุ้งแห้งเล่นเวท', c: 'น้ำหนักตัวเพิ่มขึ้นทุกๆ 2 กิโลกรัม จากฐานน้ำหนักเดิม (เน้นความแข็งแรง)', r: '🍖 +30 B-Coin (รับได้เรื่อยๆ เมื่อตัวหนาขึ้น)', n: 'กินอาหารที่มีประโยชน์เพื่อเอาชนะบอสตัวนี้!' } };

var S={ coins:0, todayCoins:0, todayGmCoins:0, w:'', h:'', exp:0, expMax:100, lv:1, curAv:0, selAv:0, phoenix:0, ticket:0, bcards:0, bcUsed:0, bcTotal: 0, bcList: [], keys:0, streak:['grey','grey','grey','grey','grey','grey','grey'], currentDayIndex: 0, lastSyncDate: null, quests:[false,false,false], pin:'', PIN:'5918', pending:null, submitted:false, gmSubmitted:false, isResubmit: false, feeling:3, illness:'ไม่มี', swimFr:'', swimBt:'', swimFg:'', swimBk:'', laps:'', achievement:'', specialCoin:0, gpa:'', score:'', weekKey:'', phWeekBought:0, foodWeekBought:0, monthBest:{fr:null,bt:null,fg:null,bk:null}, allBest:{fr:null,bt:null,fg:null,bk:null}, hof: { shark: false, book: false, heart: false }, bossTargets: { speed: 25, heightBase: 129, weightBase: 24 }, todayGacha: [], todayItemsUsed: [], bcList: [], gmBuffs: { jackpot: false, prophecy: '', buddy: false }, gmPopupSeen: true, gmPopupSeen: true, prophecySeen: true };
var qcnt=0, chIdx=0;

// 🔊 เสียง 8-Bit
var actx;
function playTone(freq, type, duration, vol) {
  try {
    if(!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if(actx.state === 'suspended') actx.resume();
    var osc = actx.createOscillator(); var gain = actx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, actx.currentTime);
    
    // 🌟 ระบบเพิ่มพลังเสียง (ตัวคูณ)
    var globalVolume = vol * 3; // 👈 คูณ 4 เท่าจากค่าเดิม
    
    gain.gain.setValueAtTime(globalVolume, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + duration);
    osc.connect(gain); gain.connect(actx.destination);
    osc.start(); osc.stop(actx.currentTime + duration);
  } catch(e) {}
}

var SFX = {
  pop: function(){ playTone(600, 'sine', 0.1, 0.1); }, 
  error: function(){ playTone(150, 'sawtooth', 0.1, 0.2); setTimeout(function(){playTone(150, 'sawtooth', 0.2, 0.2);}, 150); }, 
  coin: function(){ playTone(987, 'sine', 0.1, 0.1); setTimeout(function(){playTone(1318, 'sine', 0.2, 0.1);}, 80); }, 
  levelUp: function(){ [523, 659, 783, 1046].forEach(function(f,i){ setTimeout(function(){playTone(f, 'square', 0.2, 0.1);}, i*100); }); }, 
  save: function(){ playTone(800, 'sine', 0.1, 0.05); }, 
  submit: function(){ playTone(300, 'square', 0.1, 0.1); setTimeout(function(){playTone(200, 'square', 0.15, 0.1);}, 100); }, 
  card: function(){ playTone(400, 'triangle', 0.1, 0.1); setTimeout(function(){playTone(600, 'triangle', 0.2, 0.1);}, 100); }, 
  boss: function(){ playTone(100, 'sawtooth', 0.3, 0.3); }, 
  tada: function(){ [440, 554, 659, 880].forEach(function(f,i){ setTimeout(function(){playTone(f, 'sine', 0.3, 0.15);}, i*150); }); }, 
  drumroll: function(){ for(var i=0; i<15; i++) { setTimeout(function(){playTone(100, 'square', 0.05, 0.1);}, i*100); } },
  beep: function(){ playTone(880, 'square', 0.1, 0.1); } 
};

// 🔗 URL Apps Script
var SHEET_URL = BIFROST_API_URL; 


function clearBrowserCachesForUpdate_() {
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then(function(regs) {
        regs.forEach(function(reg) { reg.unregister(); });
      });
    }
    if (window.caches && caches.keys) {
      caches.keys().then(function(keys) {
        keys.forEach(function(key) { caches.delete(key); });
      });
    }
  } catch (e) {}
}

function reloadForAssetVersion_(assetVersion) {
  clearBrowserCachesForUpdate_();
  var base = window.location.origin + window.location.pathname;
  var hash = window.location.hash || '';
  var nextUrl = base + '?appv=' + encodeURIComponent(assetVersion) + '&t=' + Date.now() + hash;
  window.location.replace(nextUrl);
}

function checkRemoteVersion() {
  try {
    if (!navigator.onLine || !BIFROST_API_URL || BIFROST_API_URL.length < 10) return Promise.resolve(false);
    return fetch(BIFROST_API_URL + '?action=version&ts=' + Date.now(), { cache: 'no-store' })
      .then(function(res) { return res.json(); })
      .then(function(info) {
        if (!info || info.result !== 'success' || !info.assetVersion) return false;
        var remoteVersion = String(info.assetVersion);
        var rememberedVersion = localStorage.getItem('bifrost_asset_version');
        if (!rememberedVersion) localStorage.setItem('bifrost_asset_version', APP_VERSION);
        if (remoteVersion !== APP_VERSION) {
          localStorage.setItem('bifrost_asset_version', remoteVersion);
          localStorage.removeItem('bifrost_seen_version');
          reloadForAssetVersion_(remoteVersion);
          return true;
        }
        localStorage.setItem('bifrost_asset_version', remoteVersion);
        return false;
      })
      .catch(function() { return false; });
  } catch (e) {
    return Promise.resolve(false);
  }
}
function sendToLine(msgType, msgContent) {
  if (LINE_MUTE_MODE) { console.log("[LINE muted]", msgType, msgContent); return; }
  // return; // 🛑 เปิดแจ้งเตือน Line ให้ลบสองขีดหน้ารีเทินออก
  if(!SHEET_URL || SHEET_URL.length < 10) return;
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    // 🌟 เติม type เข้าไปตรงนี้ เพื่อให้ Google Apps Script รู้ว่าต้องดึงรูปไหน!
    body: JSON.stringify({ action: "LINE_ALERT", type: msgType, message: msgContent })
  });
}

function showVersionUpdateIfNeeded() {
  try {
    var seenVersion = localStorage.getItem('bifrost_seen_version');
    if (seenVersion === APP_VERSION || !APP_UPDATE_NOTES || APP_UPDATE_NOTES.length === 0) return false;

    var modal = document.getElementById('version-update-modal');
    var title = document.getElementById('version-update-title');
    var list = document.getElementById('version-update-list');
    if (!modal || !title || !list) return false;

    title.textContent = 'อัปเดตเวอร์ชัน ' + APP_VERSION;
    list.innerHTML = APP_UPDATE_NOTES.map(function(note) {
      return '<div style="display:flex; gap:8px; margin-bottom:8px;"><span style="color:var(--gold); font-weight:bold;">✦</span><span>' + escapeHtml(note) + '</span></div>';
    }).join('');
    modal.classList.add('on');
    return true;
  } catch (e) {
    return false;
  }
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, function(ch) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch];
  });
}

window.acknowledgeVersionUpdate = function() {
  localStorage.setItem('bifrost_seen_version', APP_VERSION);
  var modal = document.getElementById('version-update-modal');
  if (modal) modal.classList.remove('on');
  showProphecyIfAny();
};
function syncWalletActivityFromLocal() {
  try {
    var raw = localStorage.getItem('bifrost_data');
    if (!raw) return false;
    var saved = JSON.parse(raw);
    var changed = false;
    ['coins', 'todayCoinsSpent'].forEach(function(key) {
      if (saved[key] !== undefined && saved[key] !== S[key]) { S[key] = saved[key]; changed = true; }
    });
    if (Array.isArray(saved.todayItemsUsed)) {
      if (!Array.isArray(S.todayItemsUsed)) S.todayItemsUsed = [];
      saved.todayItemsUsed.forEach(function(item) {
        if (S.todayItemsUsed.indexOf(item) === -1) { S.todayItemsUsed.push(item); changed = true; }
      });
    }
    return changed;
  } catch (e) {
    return false;
  }
}

function refreshWalletActivityLog() {
  if (syncWalletActivityFromLocal()) {
    saveLocal();
    renderAll();
  }
}
function loadLocal() { var data = localStorage.getItem('bifrost_data'); if (data) Object.assign(S, JSON.parse(data)); if(S.keys === undefined) S.keys = 0; if(!S.todayItemsUsed) S.todayItemsUsed = []; }
function saveLocal() { 
  S._clientUpdatedAt = new Date().toISOString();
  localStorage.setItem('bifrost_data', JSON.stringify(S)); 
  // 🌟 ส่งเซฟขึ้น Cloud ทันทีที่เครื่องมีการอัปเดต
  if (navigator.onLine && SHEET_URL && SHEET_URL.length > 10) {
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: "saveCloud", payload: S })
    });
  }
}

function setSkeleton(isLoading) {
    var targets = document.querySelectorAll('.skeleton-target');
    targets.forEach(el => {
        if(isLoading) el.classList.add('skeleton');
        else el.classList.remove('skeleton');
    });
}

function showProphecyIfAny() {
    // เช็กว่ามีคำทำนาย และ น้องยังไม่ได้กดรับทราบ
    if(S.gmBuffs && S.gmBuffs.prophecy && S.gmBuffs.prophecy !== '' && S.prophecySeen === false) {
        document.getElementById('prophecy-text').textContent = S.gmBuffs.prophecy;
        document.getElementById('prophecy-modal').style.display = 'flex';
    }
}

function autoSyncDraft(e) {
  if(!SHEET_URL || SHEET_URL.length < 10) return;
  var todayStr = new Date().toLocaleDateString('en-CA');
  var payload = { 
    w: document.getElementById('in-w')?.value || '', 
    h: document.getElementById('in-h')?.value || '', 
    fr: document.getElementById('in-fr')?.value || '', 
    bt: document.getElementById('in-bt')?.value || '', 
    fg: document.getElementById('in-fg')?.value || '', 
    bk: document.getElementById('in-bk')?.value || '', 
    sc: document.getElementById('in-sc')?.value || '', 
    lp: document.getElementById('in-lp')?.value || '' 
  };
  fetch(SHEET_URL, {
    method: 'POST', mode: 'no-cors',
    body: JSON.stringify({ syncType: "DRAFT", syncDate: todayStr, payload: payload })
  }).then(function() {
     SFX.save(); 
     if(e && e.target) { e.target.classList.remove('save-glow'); void e.target.offsetWidth; e.target.classList.add('save-glow'); }
  });
}

function processAutoNextDay() {
  var now = new Date();
  var todayStr = now.toLocaleDateString('en-CA'); 
  
  if (!S.lastSyncDate) { S.lastSyncDate = todayStr; saveLocal(); return; }
  if (S.lastSyncDate === todayStr) return;

  var lastDate = new Date(S.lastSyncDate);
  while (lastDate.toLocaleDateString('en-CA') < todayStr) {
    var dateLabel = lastDate.toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});
    if(S.gmBuffs) S.gmBuffs.secretQuest = '';
   

    if(!SHEET_URL || SHEET_URL.length < 10) return;
    var payload = Object.assign({}, S, { syncDate: dateLabel });
    fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', body: JSON.stringify(payload) });

    // รีเซ็ตโควตาซื้อของในร้านค้าทุกๆ วันจันทร์ (ไม่ต้องยุ่งกับก้าวเดินแล้ว)
if (new Date().getDay() === 1) { S.phWeekBought = 0; S.foodWeekBought = 0; }
    
    S.submitted = false; S.gmSubmitted = false; S.isResubmit = false;
    S.quests = [false, false, false];
    S.todayCoins = 0; S.todayGmCoins = 0; S.todayGacha = []; S.todayItemsUsed = []; S.todayCoinsSpent = 0;
    S.achievement = '';       // 🌟 ล้างประวัติ GM Gift ของเมื่อวาน
    S.specialCoin = 0;        // 🌟 ล้างจำนวนเหรียญพิเศษของเมื่อวาน
    S.laps = ''; S.swimFr = ''; S.swimBt = ''; S.swimFg = ''; S.swimBk = ''; S.score = ''; S.gpa = ''; S.illness = 'ไม่มี';
    S.achievement = ''; S.specialCoin = 0;

    lastDate.setDate(lastDate.getDate() + 1);
    var oldMonth = new Date(lastDate.getTime() - 86400000).getMonth();
    var newMonth = lastDate.getMonth();
    if (oldMonth !== newMonth) { S.monthBest = { fr: null, bt: null, fg: null, bk: null }; }
  }

  S.lastSyncDate = todayStr;
  saveLocal();
  renderAll();
  buildStreak();
  [1,2,3].forEach(function(n){ var qc = document.getElementById('qc'+n); if(qc) { qc.classList.remove('on'); qc.textContent=''; } var qi = document.getElementById('qi'+n); if(qi) qi.classList.remove('done'); });
  qcnt = 0; var qbar = document.getElementById('qbar'); if(qbar) qbar.innerHTML = 'ติ๊ก <b>0</b>/3 ภารกิจ';
  ['in-w','in-h','in-lp','in-fr','in-bt','in-fg','in-bk','in-gpa','in-sc'].forEach(function(id){ var el = document.getElementById(id); if(el) el.value = ''; });
  
  autoSyncDraft();
}

function gasCall(fn, args, ok, fail) {
  // บล็อกการใช้งานเมื่อออฟไลน์ (ยกเว้นตอนโหลดข้อมูลครั้งแรก)
  if (!navigator.onLine && fn !== 'getHeroData') {
     showToast('📡 ออฟไลน์! ไม่สามารถบันทึกข้อมูลหรือทำรายการได้');
     return;
  }
  loadLocal();
  setSkeleton(true); 
  
  setTimeout(function() {
    var res = {};
    if (fn === 'getHeroData') { res = S; } 
    else if (fn === 'submitQuest') {
      if(!S.hof) S.hof = { shark: false, book: false, heart: false }; if(!S.bossTargets) S.bossTargets = { speed: 25, heightBase: 129, weightBase: 24 }; if(!S.todayGacha) S.todayGacha = []; if(!S.todayItemsUsed) S.todayItemsUsed = []; if(S.keys===undefined) S.keys=0;
      
      if (!S.submitted) { S.prevBossTargets = JSON.parse(JSON.stringify(S.bossTargets)); S.prevHof = JSON.parse(JSON.stringify(S.hof)); }
      var bossRewards = []; var isPerfectToday = args.q1 && args.q2 && args.q3;
      S.streak[S.currentDayIndex] = isPerfectToday ? 'gold' : 'red';
      var earn = (args.q1 ? 2 : 0) + (args.q2 ? 2 : 0) + (args.q3 ? 2 : 0); 
      
      if (args.swimFr) { 
        var fr = parseFloat(args.swimFr); var frInt = Math.floor(fr); var currentTarget = S.bossTargets.speed;
        if (frInt < currentTarget) {
            var rewardCoins = (currentTarget <= 20) ? 200 : 50;
            bossRewards.push({ title: 'บอสฉลามขาว', coin: rewardCoins, desc: 'ผ่านด่าน < ' + currentTarget + ' วิ! (เป้าหมายต่อไป: < ' + (currentTarget - 1) + ' วิ)', icon: '🦈' }); 
            earn += rewardCoins; S.bossTargets.speed = currentTarget - 1; if (currentTarget <= 20) { S.hof.shark = true; }
        } 
      }
      if (args.score) { var sc = parseFloat(args.score);
        if (sc >= 90) { bossRewards.push({ title: 'บอสหมอโหด', coin: 300, desc: 'สอบได้ Rank S (' + sc + '%)', icon: '📚' }); earn += 300; S.hof.book = true; } else { S.hof.book = false; } 
      }
      if (!isPerfectToday) { S.hof.heart = false; }
      
      if (S.currentDayIndex === 6 && S.streak.every(s => s === 'gold')) { 
        bossRewards.push({ title: 'บอสมุ่งมั่น', coin: 18, desc: 'ภารกิจ 7 วันรวด! (รับกุญแจทอง 2 ดอก)', icon: '❤️' }); earn += 18; S.keys += 2; S.hof.heart = true; 
      }
      
      if (args.h) { var hFloor = Math.floor(parseFloat(args.h));
        if (hFloor >= S.bossTargets.heightBase + 2) { var hSteps = Math.floor((hFloor - S.bossTargets.heightBase) / 2); var hBonus = hSteps * 30; bossRewards.push({ title: 'บอสเสาไฟ', coin: hBonus, desc: 'ตัวสูงทะลุเป้า (+'+(hSteps*2)+'cm)', icon: '🦒' }); earn += hBonus; S.bossTargets.heightBase += (hSteps * 2); } 
      }
      if (args.w) { var wFloor = Math.floor(parseFloat(args.w));
        if (wFloor >= S.bossTargets.weightBase + 2) { var wSteps = Math.floor((wFloor - S.bossTargets.weightBase) / 2); var wBonus = wSteps * 30; bossRewards.push({ title: 'บอสกุ้งแห้งเล่นเวท', coin: wBonus, desc: 'ร่างกายแข็งแรง (+'+(wSteps*2)+'kg)', icon: '💪' }); earn += wBonus; S.bossTargets.weightBase += (wSteps * 2); } 
      }
      
      var styles = { swimFr: 'fr', swimBt: 'bt', swimFg: 'fg', swimBk: 'bk' };
      for (var key in styles) {
        if (args[key]) {
          var time = parseFloat(args[key]); var st = styles[key];
          if (S.allBest[st] === null || time < S.allBest[st]) { S.allBest[st] = time; }
          if (S.monthBest[st] === null || time < S.monthBest[st]) { S.monthBest[st] = time; }
        }
      }
      
      S.coins += earn; S.todayCoins += earn;
      if (S.lv < 100) { S.exp += 35; if(S.exp >= S.expMax) { S.lv++; S.exp = 0; if (S.lv >= 100) { S.lv = 100; S.exp = S.expMax; } } }
      if (args.hasOwnProperty('q1')) { S.quests = [args.q1, args.q2, args.q3]; } Object.assign(S, args);
      S.submitted = true; saveLocal();
      res = Object.assign({}, S, {totalCoinsEarned: earn, bossRewards: bossRewards.length > 0 ? bossRewards : null});
    } 
    else if (fn === 'resetToday') { 
      S.streak[S.currentDayIndex] = 'grey';
      if (S.submitted) {
        S.coins = Math.max(0, S.coins - S.todayCoins); 
        S.exp -= 35; if (S.exp < 0) { if (S.lv > 1) { S.lv--; S.exp += S.expMax; } else { S.exp = 0; } }
        if (S.prevBossTargets) { S.bossTargets = JSON.parse(JSON.stringify(S.prevBossTargets)); }
        if (S.prevHof) { S.hof = JSON.parse(JSON.stringify(S.prevHof)); }
      }
      S.isResubmit = true;
      S.submitted = false; S.todayCoins = 0; 
      saveLocal(); res = S; 
    }
    else if (fn === 'submitGm') { 
      var coinsAdj = args.coinsAdj || 0; S.coins = Math.max(0, S.coins + coinsAdj); S.todayGmCoins = coinsAdj; 
      var lvAdj = args.lvAdj || 0; S.lv = Math.max(1, Math.min(100, S.lv + lvAdj));
      
      if(!S.gmBuffs) S.gmBuffs = { jackpot: false, prophecy: '', buddy: false };
      if (args.jackpot) S.gmBuffs.jackpot = true;
      if (args.prophecy) { S.gmBuffs.prophecy = args.prophecy; S.prophecySeen = false; }
      if (args.secretQuest !== undefined) { S.gmBuffs.secretQuest = args.secretQuest; }
      
      var extra = [];
      if (args.addPhoenix) { S.phoenix++; extra.push('💧 น้ำตาฟีนิกซ์'); }
      if (args.addKey) { S.keys++; extra.push('🗝️ กุญแจทอง'); }
      if (args.addExp) { S.exp += 50; if(S.exp >= S.expMax) { S.lv = Math.min(100, S.lv + 1); S.exp -= S.expMax; } extra.push('⭐ 50 EXP'); }
      if (args.addFood) { S.ticket = (S.ticket || 0) + 1; extra.push('🍜 ตั๋วเชฟทองคำ'); } // 🌟 เพิ่มบรรทัดนี้ลงไป
      setChar(chForLevel(S.lv));
      
      // 🌟 [ส่วนปรับปรุง God Mode] 🌟
      // 1. แก้ไขสถิติว่ายน้ำ
      if (args.swimType !== '') {
          var st = args.swimType;
          if (args.swimMonth !== undefined && args.swimMonth !== '') { var mVal = parseFloat(args.swimMonth); S.monthBest[st] = mVal <= 0 ? null : mVal; }
          if (args.swimAll !== undefined && args.swimAll !== '') { var aVal = parseFloat(args.swimAll); S.allBest[st] = aVal <= 0 ? null : aVal; }
      }
      
      // 2. แก้มือลั่น ฐานบอส (ตรวจเช็กเผื่อไม่มี Object)
      if(!S.bossTargets) S.bossTargets = { speed: 25, heightBase: 129, weightBase: 24 };
      if (args.baseW !== undefined && args.baseW !== '') { S.bossTargets.weightBase = parseInt(args.baseW); }
      if (args.baseH !== undefined && args.baseH !== '') { S.bossTargets.heightBase = parseInt(args.baseH); }
      if (args.bossShark !== undefined && args.bossShark !== '') { S.bossTargets.speed = parseInt(args.bossShark); }

      // 3. ยึดตรา HOF
      if(!S.hof) S.hof = { shark: false, book: false, heart: false };
      if (args.revShark) S.hof.shark = false;
      if (args.revBook) S.hof.book = false;
      if (args.revHeart) S.hof.heart = false;

      var logMsg = args.achievement;
      if(extra.length > 0) logMsg += (logMsg ? ' ' : '') + '(แถม: ' + extra.join(', ') + ')';
      
      S.achievement = logMsg; S.specialCoin = coinsAdj; S.gmSubmitted = true; S.gmPopupSeen = false;
      saveLocal(); 
      res = S;
    }
    else if (fn === 'saveAvatar') { S.curAv = args; saveLocal(); res = S; } 
    
    setSkeleton(false); 
    if (ok) ok(res);
  }, 400); 
}

function applyData(d){ if(!d)return; Object.keys(d).forEach(k => { if(S.hasOwnProperty(k)) S[k] = d[k]; }); if(d.streak!==undefined){ S.streak=d.streak; buildStreak(); } renderAll(); }
function chForLevel(lv){ return Math.min(Math.ceil(lv/5), 20) - 1; }
function setChar(i){ chIdx = i; var img = document.getElementById('ch-img'), placeholder = document.getElementById('ch-placeholder'); if(!img || !placeholder) return; var unlockedIdx = chForLevel(S.lv); img.src = './images/RPG-Bifrost-character-' + (i + 1).toString().padStart(2, '0') + '.jpg'; if (i > unlockedIdx) { img.classList.add('img-locked'); placeholder.innerHTML = '🔒'; placeholder.className = 'lock-overlay'; placeholder.style.display = 'flex'; } else { img.classList.remove('img-locked'); placeholder.style.display = 'none'; } img.style.display = 'block'; img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover'; img.onerror = function() { img.style.display = 'none'; placeholder.innerHTML = '⚔️'; placeholder.className = ''; placeholder.style.display = 'flex'; }; var lbl = document.getElementById('ch-name-lbl'); if(lbl) lbl.textContent = CHAR_NAMES[i]; var bdg = document.getElementById('ch-badge'); if(bdg) bdg.innerHTML = 'ตัวที่ <b>' + (i+1) + '</b> / 20 · Lv.' + (i*5+1) + '–' + ((i+1)*5); var pBtn = document.getElementById('ch-prev'), nBtn = document.getElementById('ch-next'); if(pBtn) pBtn.classList.toggle('dim', i === 0); if(nBtn) nBtn.classList.toggle('dim', i === 19); }

function goP(p){ 
  SFX.pop(); 
  document.querySelectorAll('.pg').forEach(function(e){e.classList.remove('on');}); 
  document.querySelectorAll('.ni').forEach(function(e){e.classList.remove('on');}); 
  var pg = document.getElementById('pg-'+p), ni = document.getElementById('ni-'+{dashboard:'d',quest:'q',shop:'s'}[p]); 
  if(pg) pg.classList.add('on');
  if(ni) { ni.classList.add('on'); ni.classList.remove('menu-pop'); void ni.offsetWidth; ni.classList.add('menu-pop'); } 
  var pages = document.querySelector('.pages'); if(pages) pages.scrollTop=0;
  
  if(p === 'dashboard') {
    updateHeroSpeech();
  }

}

function buildStreak() {
  var container = document.getElementById('st-slots');
  if(!container) return;
  container.innerHTML = '';
  
  // แก๊งมอนสเตอร์ประจำด่าน (เผื่อเหนียว ป้องกันบั๊ก)
  var monsters = ['👾', '🦇', '🕷️', '🦂', '🐍', '🐺'];
  
  // 🌟 ดึงค่าการก้าวเดิน
  var currentStep = S.currentDayIndex || 0; 
  
  for (var i = 0; i < 7; i++) {
    var slot = document.createElement('div');
    var isDone = i < currentStep;
    var isCurrent = i === currentStep;
    var isBoss = i === 6;
    
    slot.style.width = '35px';
    slot.style.height = '35px';
    slot.style.borderRadius = '50%';
    slot.style.display = 'flex';
    slot.style.alignItems = 'center';
    slot.style.justifyContent = 'center';
    slot.style.fontSize = '18px';
    slot.style.transition = '0.3s';
    
    if (isDone) {
      slot.innerHTML = '✔'; // 🌟 เปลี่ยนมาใช้เครื่องหมายถูกตัวนี้แทนอีโมจิ
      slot.style.color = '#ffffff'; // 🌟 บังคับให้เครื่องหมายถูกเป็นสีขาวล้วน
      slot.style.background = 'var(--gold)';
      slot.style.boxShadow = '0 0 10px var(--gold)';
      slot.style.border = 'none'; // เอาขอบออกให้สีทองเนียนๆ
    }
    
    else if (isBoss) {
      slot.innerHTML = '💎';
      // 🌟 กล่องรางวัล: พื้นขาว ขอบทองแบบเส้นประ
      slot.style.background = '#fff'; 
      slot.style.border = '2px dashed var(--gold)'; 
      slot.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'; // แถมเงาเบาๆ
    } else if (isCurrent) {
      slot.innerHTML = '⚔️';
      slot.style.background = '#fff';
      slot.style.transform = 'scale(1.2)';
      slot.style.boxShadow = '0 0 10px #fff';
      slot.style.border = '2px solid var(--gold)'; // เพิ่มขอบทองให้จุดที่กำลังยืนอยู่
    } else {
      slot.innerHTML = monsters[i] || '👾'; 
      // 🌟 มอนสเตอร์ที่ยังไปไม่ถึง: พื้นขาว ขอบทอง
      slot.style.background = '#fff';
      slot.style.border = '2px solid var(--gold)'; 
      slot.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'; // แถมเงาเบาๆ ให้ดูมีมิติ
    }
    container.appendChild(slot);
  }
}

function tQ(n) {
  var i = n - 1;
  S.quests[i] = !S.quests[i];
  var c = document.getElementById('qc' + n);
  var qi = document.getElementById('qi' + n);
  
  // อัปเดตเครื่องหมายติ๊กถูก
  if (c) {
    c.classList.toggle('on', S.quests[i]);
    c.textContent = S.quests[i] ? '✓' : '';
  }
  if (qi) qi.classList.toggle('done', S.quests[i]);
  
  // นับจำนวนเควสที่ทำเสร็จ
  var qcnt = S.quests.filter(Boolean).length;
  var qbar = document.getElementById('qbar');
  if (qbar) {
    qbar.innerHTML = (qcnt == 3) ? '<span class="qsuc">✦ ภารกิจพร้อมส่ง! ✦</span>' : 'ติ๊ก <b>' + qcnt + '</b>/3 ภารกิจ';
  }

  // --- 🌟 ระบบเช็กปุ่มแบบเรียลไทม์ 🌟 ---
  var bSub = document.getElementById('btn-submit');
  var bDraft = document.getElementById('btn-draft');
  
  if (!S.submitted) {
      if (qcnt === 3) {
          // ถ้าครบ 3 ข้อ โชว์ปุ่มส่งภารกิจสีทอง
          if (bSub) { bSub.style.display = 'block'; bSub.textContent = '⚔️ ส่งภารกิจ'; bSub.disabled = false; bSub.style.background = ''; bSub.style.color = ''; }
          if (bDraft) bDraft.style.display = 'none';
      } else {
          // ถ้าไม่ครบ 3 ข้อ โชว์ปุ่มอัปเดตชั่วคราว
          if (bSub) bSub.style.display = 'none';
          if (bDraft) bDraft.style.display = 'block';
      }
  }
  // --------------------------------

  saveLocal();
}
function updateFeel(v){ S.feeling=parseInt(v);var f=FEEL[S.feeling]; var ico = document.getElementById('feel-ico'), lbl = document.getElementById('feel-lbl'), sl = document.getElementById('feel-sl'); if(ico) ico.textContent=f.i; if(lbl) lbl.textContent=f.l; var pct=(S.feeling-1)/4*100; if(sl) sl.style.background='linear-gradient(90deg,var(--gold) '+pct+'%,var(--bg2) '+pct+'%)'; }

function checkPin(){ if(S.pin.length<4){showToast('กรุณากรอกรหัส 4 หลักให้ครบ');return false;} if(S.pin!==S.PIN){showToast('🔐 รหัสผ่านไม่ถูกต้อง!');clrPin();return false;} return true; }
function showBossDetail(id) { var info = BOSS_DETAILS[id]; document.getElementById('bd-ico').textContent = info.i; document.getElementById('bd-ttl').textContent = info.t; document.getElementById('bd-cond').textContent = info.c; document.getElementById('bd-reward').textContent = info.r; document.getElementById('bd-note').textContent = '* ' + info.n; var mov = document.getElementById('boss-detail-mov'); if(mov) mov.classList.add('on'); }

function doSubmit(){ 
  if(S.submitted) { showToast('วันนี้ส่งภารกิจไปแล้วครับ!'); return; } 
  SFX.submit(); 
  
  var questData={ q1: S.quests[0], q2: S.quests[1], q3: S.quests[2], w: document.getElementById('in-w')?.value || '', h: document.getElementById('in-h')?.value || '', laps: document.getElementById('in-lp')?.value || '', swimFr: document.getElementById('in-fr')?.value || '', swimBt: document.getElementById('in-bt')?.value || '', swimFg: document.getElementById('in-fg')?.value || '', swimBk: document.getElementById('in-bk')?.value || '', feeling: S.feeling, gpa: document.getElementById('in-gpa')?.value || '', score: document.getElementById('in-sc')?.value || '', illness: document.getElementById('in-ill')?.value || 'ไม่มี' }; 
  ['w', 'h', 'gpa', 'score'].forEach(function(k) { if (questData[k] === '') { delete questData[k]; } });
  
  var ok=document.getElementById('submit-ok'), bar=document.getElementById('sok-bar'); 
  if(ok) ok.classList.add('on'); if(bar) bar.style.width='0%'; 
  gasCall('submitQuest',questData,function(r){ 
    var prevLv=S.lv; applyData(r); 
    var sokC = document.getElementById('sok-coins'); if(sokC) sokC.textContent='+'+(r.totalCoinsEarned||0)+' B-Coin'; 
    // 🗺️ ระบบสะสมก้าวเดินและแจกรางวัล (7 ก้าว)
// 🗺️ ระบบสะสมก้าวเดินและแจกรางวัล (7 ก้าว)
  
  // 🌟 เพิ่มตัวแปรดักจับบอสไว้ตรงนี้ (เหนือ if)
  var isBossCleared_ForLine = false; 

  if (!S.isResubmit) { 
      S.currentDayIndex = (S.currentDayIndex || 0) + 1; 
      
      buildStreak(); // 🌟 สั่งให้วาดกราฟิกก้าวเดินใหม่ทันที!
      saveLocal();   // 🌟 สั่งเซฟข้อมูลลงเครื่อง
      
      if (S.currentDayIndex >= 7) {
          isBossCleared_ForLine = true; // 🌟 มาร์คไว้ว่าเพิ่งตบบอสเสร็จ! ส่งให้ LINE รู้
          S.currentDayIndex = 0;        // รีเซ็ตกลับไปก้าวที่ 0
          
          setTimeout(() => {
              showToast("🎊 ยินดีด้วย! ผจญภัยครบ 7 ครั้ง รับกุญแจทอง 2 ดอก!");
              renderAll(); 
              buildStreak(); // 🌟 รีเซ็ตภาพกราฟิกกลับมาจุดเริ่มต้น
              saveLocal();
          }, 1500);
      }
    // 💾 ระบบจดจำสถิติล่าสุด (Latest Record) [V.2 ดักจับทุกชื่อตัวแปร]
        if (!S.lastStats) S.lastStats = {};
        if (!S.compareStats) S.compareStats = {};
        
        // กวาดหาชื่อตัวแปรทุกรูปแบบที่มีโอกาสเป็นไปได้
        const trackKeys = ['w', 'h', 'laps', 'lp', 'swimFr', 'fr', 'swimBt', 'bt', 'swimFg', 'fg', 'swimBk', 'bk', 'gpa', 'score', 'sc'];
        
        trackKeys.forEach(key => {
            let val = questData[key];
            if (val !== undefined && val !== '' && val !== null && val != 0) {
                S.compareStats[key] = S.lastStats[key] || val; 
                S.lastStats[key] = val; 
            }
        });
}

    // 🌟 ส่งข้อมูลขึ้น Sheet ประวัติแบบเรียลไทม์ทันทีที่กดส่งภารกิจ
      if (navigator.onLine && SHEET_URL && SHEET_URL.length > 10) {
         var dateLabel = new Date().toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});
         var payload = Object.assign({}, S, { syncDate: dateLabel });
         fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', body: JSON.stringify(payload) });
      }
    // บันทึกสถิติวันนี้สำหรับ Ghost Data
      S.todayStats = questData;
      updateLog();
      
      // ของเดิม: S.draft = {};
S.draft = {};
      ['in-w','in-h','in-lp','in-fr','in-bt','in-fg','in-bk','in-gpa','in-sc'].forEach(id => {
         let el = document.getElementById(id); if(el) el.value = '';
      });
      document.getElementById('in-ill').value = 'ไม่มี';
      let fsl = document.getElementById('feel-sl'); if(fsl){ fsl.value = 3; fsl.dispatchEvent(new Event('input')); }
      saveLocal();

if(r.lv>prevLv) { 
      SFX.levelUp(); 
      var lvt = document.getElementById('lv-txt'); 
      if(lvt) { lvt.classList.remove('level-up-pop'); void lvt.offsetWidth; lvt.classList.add('level-up-pop'); }
      // เรียก Popup ออกมา
      document.getElementById('lm-lv-val').textContent = r.lv;
      document.getElementById('level-overlay').classList.add('on');
    } else {
      SFX.coin(); 
    }

    // -----------------------------------------
    // 🌟 สร้างข้อความแจ้งเตือน LINE สรุปรายวัน (อัปเกรด V.3)
    // -----------------------------------------
    var earnCoin = r.totalCoinsEarned || 0;
    var spentCoin = S.todayCoinsSpent || 0; // 🌟 ดึงยอดเงินที่ใช้ไปวันนี้

    // 🗺️ คำนวณเส้นทางนักผจญภัย
    var stepStr = "";
    if (S.isResubmit) {
        stepStr = (S.currentDayIndex === 0) ? "ด่าน บอส 💎" : "ด่าน " + S.currentDayIndex + "/7";
    } else {
        if (isBossCleared_ForLine) {
            stepStr = "ด่าน บอส 💎 (🎉 เคลียร์สำเร็จ! ได้รับรางวัล กุญแจทอง 2 ดอก 🗝️🗝️)";
        } else {
            stepStr = "ด่าน " + S.currentDayIndex + "/7";
        }
    }

    var dOpts = {year:'numeric', month:'short', day:'numeric'};
    var todayStr = new Date().toLocaleDateString('th-TH', dOpts);
    
    var lineMsg = S.isResubmit ? "🔄 [อัปเดตแก้ไข] รายงานประจำวัน 🔄\n" : "🛡️ [BIFROST] สรุปรายงานประจำวัน 🛡️\n";
    lineMsg += "📅 วันที่: " + todayStr + "\n\n";

    lineMsg += "💰 เหรียญทั้งหมดในกระเป๋า: " + r.coins + " B-Coin\n";
    lineMsg += "✨ เหรียญที่ได้วันนี้: +" + earnCoin + " B-Coin\n";
    lineMsg += "💸 เหรียญที่ใช้วันนี้: -" + spentCoin + " B-Coin\n\n"; // 🌟 แสดงเหรียญที่ใช้

    lineMsg += "🗺️ เส้นทางนักผจญภัย: " + stepStr + "\n\n"; // 🌟 แสดงด่านที่เดินถึง

    lineMsg += "📊 สถิติการฝึกซ้อม:\n";
    lineMsg += "⚖️ น้ำหนัก: " + (questData.w ? questData.w + " kg" : "-") + "\n";
    lineMsg += "🦒 ส่วนสูง: " + (questData.h ? questData.h + " cm" : "-") + "\n";
    lineMsg += "🏊 จำนวนรอบว่ายน้ำ: " + (questData.laps ? questData.laps + " รอบ" : "-") + "\n\n";
    
    lineMsg += "⏱️ สถิติเวลาว่ายน้ำ:\n";
    lineMsg += "🏊 ฟรีสไตล์: " + (questData.swimFr ? questData.swimFr + " วิ" : "-") + "\n";
    lineMsg += "🏊 กรรเชียง: " + (questData.swimBk ? questData.swimBk + " วิ" : "-") + "\n";
    lineMsg += "🏊 กบ: " + (questData.swimFg ? questData.swimFg + " วิ" : "-") + "\n";
    lineMsg += "🏊 ผีเสื้อ: " + (questData.swimBt ? questData.swimBt + " วิ" : "-");

    sendToLine("DAILY_REPORT", lineMsg);
    // -----------------------------------------
    
    if(bar) { bar.style.width = '100%'; }
    setTimeout(function() {
      if(ok) ok.classList.remove('on'); 
      renderAll(); goP('dashboard');
      if(r.bossRewards && r.bossRewards.length > 0) { setTimeout(function(){ showBossRewards(r.bossRewards); }, 500); }
    }, 1500);
  });
}

function doReset(){ cfmShow('⚠️', 'ยืนยันรีเซ็ตภารกิจ?', 'ข้อมูลที่กรอกวันนี้จะหายไปทั้งหมด', function() { gasCall('resetToday',undefined,function(r){ applyData(r); [1,2,3].forEach(function(n){ S.quests[n-1]=false; var qc = document.getElementById('qc'+n); if(qc){ qc.classList.remove('on'); qc.textContent=''; } var qi = document.getElementById('qi'+n); if(qi){ qi.classList.remove('done'); } }); qcnt=0; var qbar = document.getElementById('qbar'); if(qbar) qbar.innerHTML='ติ๊ก <b>0</b>/3 ภารกิจ'; ['in-w','in-h','in-lp','in-fr','in-bt','in-fg','in-bk','in-gpa','in-sc'].forEach(function(id){ var el = document.getElementById(id); if(el) el.value = ''; }); var ill = document.getElementById('in-ill'); if(ill) ill.value = 'ไม่มี'; var sl = document.getElementById('feel-sl'); if(sl) { sl.value = 3; updateFeel(3); } showToast('🗑️ รีเซ็ตข้อมูลวันนี้เรียบร้อย กรอกใหม่ได้เลย!'); 
  autoSyncDraft();
}); }); }

function doGmSubmit(){ 
  var gmData = { 
    achievement: document.getElementById('in-ac')?.value || '', 
    coinsAdj: parseInt(document.getElementById('in-gm-coins')?.value) || 0,
    lvAdj: parseInt(document.getElementById('in-gm-lv')?.value) || 0,
    jackpot: document.getElementById('gm-secret-jackpot')?.checked || false,
    prophecy: document.getElementById('gm-prophecy')?.value || '',
    secretQuest: document.getElementById('gm-secret-quest')?.value || '',
    addPhoenix: document.querySelector('#gm-add-ph')?.parentElement.classList.contains('active') || false,
    addKey: document.querySelector('#gm-add-key')?.parentElement.classList.contains('active') || false,
    addExp: document.querySelector('#gm-add-exp')?.parentElement.classList.contains('active') || false,
    addFood: document.querySelector('#gm-add-food')?.parentElement.classList.contains('active') || false, // 🌟 เพิ่มบรรทัดนี้ลงไป

    // 🌟 ส่งข้อมูลแก้ไขใหม่ไปให้ระบบ
    swimType: document.getElementById('gm-swim-type')?.value || '',
    swimMonth: document.getElementById('gm-swim-m')?.value,
    swimAll: document.getElementById('gm-swim-a')?.value,
    baseW: document.getElementById('gm-base-w')?.value,
    baseH: document.getElementById('gm-base-h')?.value,
    bossShark: document.getElementById('gm-boss-shark')?.value,
    revShark: document.getElementById('gm-revoke-shark')?.checked || false,
    revBook: document.getElementById('gm-revoke-book')?.checked || false,
    revHeart: document.getElementById('gm-revoke-heart')?.checked || false
  };

  gasCall('submitGm', gmData, function(r){ 
    applyData(r); 
    showToast('🎁 รันคำสั่งระดับพระเจ้า GM เรียบร้อย!'); 
    
    // ล้างค่าในช่องกรอกทุกช่องหลังกดเสร็จ
    ['in-gm-coins', 'in-gm-lv', 'gm-prophecy', 'gm-secret-quest', 'in-ac', 'gm-swim-m', 'gm-swim-a', 'gm-base-w', 'gm-base-h', 'gm-boss-shark'].forEach(id => {
      var el = document.getElementById(id); if(el) el.value = '';
    });
    var stEl = document.getElementById('gm-swim-type'); if(stEl) stEl.value = '';
    ['gm-revoke-shark', 'gm-revoke-book', 'gm-revoke-heart', 'gm-secret-jackpot'].forEach(id => {
      var el = document.getElementById(id); if(el) el.checked = false;
    });
    document.querySelectorAll('.gm-item-sel').forEach(el => el.classList.remove('active'));
    document.getElementById('gm-modal').classList.remove('on');
  });
}

function showBossRewards(bosses) { 
  var html = ''; 
  bosses.forEach(function(b) { html += '<div class="bm-item"><div class="bm-ico">'+(b.icon||'⚔️')+'</div><div class="bm-info"><div class="bm-name">'+b.title+'</div><div class="bm-desc">'+b.desc+'</div></div><div class="bm-coin">+'+b.coin+'</div></div>'; });
  var bList = document.getElementById('bm-list'); if(bList) bList.innerHTML = html; 
  SFX.boss(); var bOverlay = document.getElementById('boss-overlay'); if(bOverlay) bOverlay.classList.add('on');
  var bModal = document.querySelector('.boss-modal'); if(bModal) { bModal.classList.remove('boss-zoom'); void bModal.offsetWidth; bModal.classList.add('boss-zoom'); } 
}

function doGacha() {
  // บล็อกการเปิดกล่องเมื่อออฟไลน์
  if (!navigator.onLine) {
     showToast('📡 ออฟไลน์! โปรดเชื่อมต่ออินเทอร์เน็ตก่อนเปิดกล่อง');
     return;
  }

  var d = new Date(); var day = d.getDay();
  var isTempUnlocked = (S.tempChestUnlockUntil && Date.now() < S.tempChestUnlockUntil);
  
  if(day !== 0 && day !== 6 && !isTempUnlocked) { 
    SFX.error(); var lockEl = document.getElementById('gacha-lock-overlay'); if(lockEl) { lockEl.classList.remove('lock-shake'); void lockEl.offsetWidth; lockEl.classList.add('lock-shake'); } showToast('🔒 กล่องถูกปิดผนึก! เปิดได้เฉพาะ เสาร์-อาทิตย์ เท่านั้น');
    return; 
  }
  
  if (S.keys < 1) { SFX.error(); showToast('❌ ไม่มีกุญแจทอง! (ทำภารกิจ 7 วันรวดเพื่อรับกุญแจ)'); return; }
  
  S.keys -= 1; saveLocal(); renderAll(); 
  document.getElementById('gacha-mov').classList.add('on'); document.getElementById('gacha-light').classList.add('on');
  
  SFX.drumroll(); var chestAnim = document.getElementById('chest-anim'); chestAnim.classList.remove('chest-open'); chestAnim.classList.add('chest-rumbling');
  var gRes = document.getElementById('gacha-result'); gRes.style.display = 'none'; document.getElementById('gacha-close').style.display = 'none';
  
  var res = getGachaResult();
  
  setTimeout(function() { 
    chestAnim.classList.remove('chest-rumbling'); chestAnim.classList.add('chest-open'); 
    
    if (res.rarity === 'LEGENDARY') {
      var countDiv = document.createElement('div');
      countDiv.style.cssText = 'position:absolute; top:35%; left:50%; transform:translate(-50%, -50%); font-size:150px; font-weight:900; color:#ffea00; text-shadow:0 0 30px #ffc107, 0 0 10px #fff; z-index:9999;';
      document.getElementById('gacha-mov').appendChild(countDiv);
      var c = 3; countDiv.textContent = c; SFX.beep(); countDiv.animate([{transform:'translate(-50%,-50%) scale(0.5)', opacity:0}, {transform:'translate(-50%,-50%) scale(1.2)', opacity:1}, {transform:'translate(-50%,-50%) scale(1)', opacity:1}], {duration: 400});
      var iv = setInterval(function() {
          c--; if(c > 0) { countDiv.textContent = c; SFX.beep(); countDiv.animate([{transform:'translate(-50%,-50%) scale(0.5)', opacity:0}, {transform:'translate(-50%,-50%) scale(1.2)', opacity:1}, {transform:'translate(-50%,-50%) scale(1)', opacity:1}], {duration: 400}); } 
          else { clearInterval(iv); countDiv.remove(); SFX.tada(); gRes.classList.remove('item-pop'); void gRes.offsetWidth; gRes.classList.add('item-pop'); displayGachaResult(res); }
      }, 1000);
    } else {
      SFX.tada(); gRes.classList.remove('item-pop'); void gRes.offsetWidth; gRes.classList.add('item-pop'); displayGachaResult(res);
    }
  }, 2000);
}

function getGachaResult() {
  if (S.gmBuffs && S.gmBuffs.jackpot) {
      S.gmBuffs.jackpot = false; saveLocal();
      return { rarity: 'LEGENDARY', ico: '🏆', ttl: 'JACKPOT!!!', desc: 'แจ็คพอตแตกแล้ววว!\nมหาเศรษฐี!', type: 'coin', val: 150, color: 'rare-legendary' };
  }
  var rng = Math.floor(Math.random() * 100) + 1;
  var res = { rarity: 'COMMON', ico: '📦', ttl: '', desc: '', type: 'coin', val: 0, color: 'rare-common' };
  if (rng <= 30) { var c = Math.floor(Math.random() * 11) + 10; res = { rarity: 'COMMON', ico: '💰', ttl: 'ได้รับ '+c+' B-Coin', desc: 'เหรียญรางวัลทั่วไป!', type: 'coin', val: c, color: 'rare-common' }; }
  else if (rng <= 39) { res = { rarity: 'COMMON', ico: '🫂', ttl: 'Family Love', desc: 'วิ่งไปกอดปะป๊า 30 วินาที\n(ได้รับโบนัส 10 B-Coin)', type: 'info', val: 10, color: 'rare-common' }; }
  else if (rng <= 47) { res = { rarity: 'COMMON', ico: '💃', ttl: 'อาชีพ Dancer', desc: 'เต้นโชว์สเต็ป 30 วินาที\n(ได้รับโบนัส 10 B-Coin)', type: 'info', val: 10, color: 'rare-common' }; }
  else if (rng <= 57) { res = { rarity: 'RARE', ico: '🍫', ttl: 'ขนมด่วนจี๋', desc: 'ขอรับขนม 7-11 ที่ต้องการทันที 2 ชิ้น!\n(ได้รับโบนัส 5 B-Coin)', type: 'info', val: 5, color: 'rare-rare' }; }
  else if (rng <= 68) { var c = Math.floor(Math.random() * 11) + 30; res = { rarity: 'RARE', ico: '💰', ttl: 'ได้รับ '+c+' B-Coin', desc: 'โชคดีจัง!\nเหรียญรางวัลหายาก!', type: 'coin', val: c, color: 'rare-rare' }; }
  else if (rng <= 76) { res = { rarity: 'RARE', ico: '👨‍🍳', ttl: 'เชฟทองคำ', desc: 'รีเควสอาหารมื้อเย็นให้ปะป๊าทำให้!\n(ได้รับโบนัส 5 B-Coin)', type: 'chef', val: 5, color: 'rare-rare' }; }
  else if (rng <= 84) { if (S.phoenix < 2) { res = { rarity: 'RARE', ico: '💧', ttl: 'น้ำตาฟีนิกซ์', desc: 'ได้รับไอเทมชุบชีวิต Streak!', type: 'item', val: 0, color: 'rare-rare' }; } else { res = { rarity: 'RARE', ico: '💰', ttl: 'ได้รับ 15 B-Coin', desc: 'คลังน้ำตาเต็ม 2 อันแล้ว!\nเปลี่ยนเป็นเหรียญแทน', type: 'coin', val: 15, color: 'rare-rare' }; } }
  else if (rng <= 90) { res = { rarity: 'RARE', ico: '🤝', ttl: 'การ์ดเพื่อนแท้', desc: 'เรียกปะป๊ามาเล่นด้วยทันที 30 นาที!\n(เฉพาะตอนปะป๊าว่าง + ได้รับ 5 B-Coin)', type: 'info', val: 5, color: 'rare-rare' }; }
  else if (rng <= 96) { var c = Math.floor(Math.random() * 21) + 40; res = { rarity: 'EPIC', ico: '💰', ttl: 'ได้รับ '+c+' B-Coin', desc: 'สุดยอด!\nรางวัลระดับมหากาพย์!', type: 'coin', val: c, color: 'rare-epic' }; }
  else { res = { rarity: 'LEGENDARY', ico: '🏆', ttl: 'JACKPOT!!!', desc: 'แจ็คพอตแตกแล้ววว!\nมหาเศรษฐี!', type: 'coin', val: 150, color: 'rare-legendary' }; }
  return res;
}

function displayGachaResult(res) {
  var view = document.getElementById('gacha-result'); var rarityEl = document.getElementById('gr-rarity'); rarityEl.textContent = res.rarity; rarityEl.className = 'gr-rarity ' + res.color; document.getElementById('gr-ico').textContent = res.ico; document.getElementById('gr-ttl').textContent = res.ttl; document.getElementById('gr-desc').textContent = res.desc; var bigCoin = document.getElementById('gr-big-coin'); if(res.val > 0 && res.type !== 'item') { bigCoin.textContent = '+' + res.val + ' B-Coin'; bigCoin.style.display = 'block'; } else { bigCoin.style.display = 'none'; }
  if(res.rarity === 'LEGENDARY') { document.getElementById('gacha-mov').classList.add('jackpot-active'); }
  if(!S.todayGacha) S.todayGacha = []; var action = document.getElementById('gr-action'), input = document.getElementById('gr-input'), btn = document.getElementById('gr-btn'); action.style.display = 'none'; input.style.display = 'none'; 
  
  if (res.type === 'chef') {
    action.style.display = 'block'; input.style.display = 'block'; input.value = '';
    btn.onclick = function() { 
      if(!input.value) { showToast('พิมพ์เมนูก่อนนะครับ!'); return; }
      S.coins += res.val; S.todayCoins += res.val;
      S.todayGacha.push('👨‍🍳 สั่งเมนู: ' + input.value + ' (+'+res.val+' Coins)');
      
      // 🌟 แจ้งเตือน LINE: สั่งอาหารจาก "ตั๋วเชฟทองคำ" (กาชา)
      sendToLine("CHEF_TICKET", "👨‍🍳 [BIFROST] ออเดอร์พิเศษ!\nเมนู: " + input.value + "\n(ได้รับจาก: 🎫 ตั๋วเชฟทองคำ ในกาชา)");
      
      saveLocal(); renderAll();
      showToast('🍜 ส่งเมนูให้ปะป๊าเรียบร้อย! ได้รับ +5 B-Coin'); closeGacha(); 
    };
  } else {
    btn.onclick = function() { 
      if(res.type === 'coin') { S.coins += res.val; S.todayCoins += res.val; S.todayGacha.push(res.ico + ' หมุนได้ ' + res.ttl); } 
      else if(res.type === 'item') { S.phoenix++; S.todayGacha.push(res.ico + ' หมุนได้ น้ำตาฟีนิกซ์'); }
      else if(res.type === 'info') { S.coins += res.val; S.todayCoins += res.val; S.todayGacha.push(res.ico + ' ภารกิจ: ' + res.ttl + ' (+'+res.val+' Coins)'); }
      saveLocal(); renderAll(); closeGacha();
      
      // 🌟 แจ้งเตือน LINE: ให้เด้งเฉพาะตอนได้รางวัล LEGENDARY (JACKPOT) เท่านั้น รางวัลอื่นเงียบกริบ!
      if (res.rarity === 'LEGENDARY') {
          sendToLine("GACHA", "🏆 [BIFROST] แจ็คพอตแตก!!! 🏆\nไบฟรอสเปิดกล่องสมบัติได้รับ:\n✨ " + res.ttl + "\n(ยอดเงินล่าสุด: " + S.coins + " B-Coin)");
      }
    };
    action.style.display = 'block'; btn.textContent = "รับรางวัล"; document.getElementById('gacha-close').style.display = 'none';
  }
  view.style.display = 'block';
}

function closeGacha() { document.getElementById('gacha-mov').classList.remove('on'); document.getElementById('gacha-light').classList.remove('on'); document.getElementById('gacha-mov').classList.remove('jackpot-active'); }

function updateLog() {
    const logBox = document.getElementById('log-txt');
    if (!logBox) return;

    let html = '';
    const isTodayDone = S.submitted; // 🌟 เช็กว่าวันนี้กดส่งเควสไปหรือยัง?

    // ==========================================
    // 🟢 โซนที่ 1: ข้อมูลภารกิจ (ลด margin-bottom เป็น 2px)
    // ==========================================
    if (isTodayDone) {
        let qCnt = S.quests ? S.quests.filter(Boolean).length : 0;
        if (qCnt > 0) {
            let qEarn = (S.quests[0]?2:0) + (S.quests[1]?2:0) + (S.quests[2]?2:0);
            html += `<div style="margin-bottom:2px; color:#4caf50; font-weight:bold;">✅ ภารกิจรายวัน: ${qCnt === 3 ? 'ครบถ้วน' : qCnt+' ข้อ'} (+${qEarn} Coins)</div>`;
        }
        if (S.todayItemsUsed && S.todayItemsUsed.length > 0) {
            html += `<div style="margin-bottom:2px; color:#2196f3; font-weight:bold;">🎒 ใช้ไอเทม: ${S.todayItemsUsed.join(', ')}</div>`;
        }
        if (S.todayGacha && S.todayGacha.length > 0) {
            html += `<div style="margin-bottom:2px; color:#9c27b0; font-weight:bold;">💎 สมบัติ: ${S.todayGacha.join(', ')}</div>`;
        }
    }

    // ==========================================
    // 📊 โซนที่ 2: สถิติการผจญภัย (ลดความห่างของเส้นประ)
    // ==========================================
    html += `
    <div style="margin-top:-10px; padding-top:-10px; border-top:1px dashed var(--gbdr);">
        <div style="color:var(--gold); font-weight:bold; margin-bottom:4px;">📊 สถิติการผจญภัย</div>`;
    
    const d = isTodayDone ? (S.todayStats || {}) : {}; 
    const past = isTodayDone ? (S.compareStats || {}) : (S.lastStats || {});

    function getVal(obj, k1, k2) {
        if (obj && obj[k1] !== undefined && obj[k1] !== '' && obj[k1] != 0) return obj[k1];
        if (obj && k2 && obj[k2] !== undefined && obj[k2] !== '' && obj[k2] != 0) return obj[k2];
        return '';
    }

    let cv = {
        w: getVal(d, 'w'), h: getVal(d, 'h'), laps: getVal(d, 'laps', 'lp'),
        fr: getVal(d, 'swimFr', 'fr'), bk: getVal(d, 'swimBk', 'bk'),
        fg: getVal(d, 'swimFg', 'fg'), bt: getVal(d, 'swimBt', 'bt'),
        gpa: getVal(d, 'gpa'), sc: getVal(d, 'score', 'sc')
    };
    
    let pv = {
        w: getVal(past, 'w'), h: getVal(past, 'h'), laps: getVal(past, 'laps', 'lp'),
        fr: getVal(past, 'swimFr', 'fr'), bk: getVal(past, 'swimBk', 'bk'),
        fg: getVal(past, 'swimFg', 'fg'), bt: getVal(past, 'swimBt', 'bt'),
        gpa: getVal(past, 'gpa'), sc: getVal(past, 'score', 'sc')
    };

    function drawStatRow(label, icon, currentVal, prevVal, unit, isTimeBased = false) {
        // 🌟 ไม้ตายก้นหีบ: บังคับความสูงและระยะห่างขั้นเด็ดขาด (ทับ CSS ทุกตัว 100%)
        let baseStyle = "display:flex !important; align-items:center !important; justify-content:flex-start !important; padding: 0 !important; margin: 0 !important; height: 0px !important; line-height: 1 !important; font-size:13px !important; color:#333 !important; overflow:visible !important;";
        
        // 🌟 กรณีที่ 1: พอกดข้ามวัน (ยังไม่ได้ส่งเควส) ให้โชว์ค่า (ล่าสุด: ...)
        if (!isTodayDone) {
            if (!prevVal || prevVal === '' || prevVal == 0) return '';
            return `
            <div style="${baseStyle}">
                <span style="margin-right:8px; width:18px; text-align:center;">${icon}</span>
                <span style="min-width:80px; margin-right:5px; color:#333;">${label}:</span>
                <span style="font-weight:bold; color:#777;">(ล่าสุด: ${prevVal} ${unit})</span>
            </div>`;
        }

        // 🌟 กรณีที่ 2: ส่งเควสแล้ว โชว์ค่าปัจจุบัน + ลูกศร
        if (!currentVal || currentVal === '' || currentVal == 0) return '';
        let rowHtml = `
        <div style="${baseStyle}">
            <span style="margin-right:8px; width:18px; text-align:center;">${icon}</span>
            <span style="min-width:80px; margin-right:5px; color:#333;">${label}:</span>
            <span style="font-weight:900; color:#111;">${currentVal} ${unit}</span>`;

        let cvNum = parseFloat(currentVal);
        let pvNum = parseFloat(prevVal);
        // แสดงลูกศรก็ต่อเมื่อมีค่าเก่า และค่าเปลี่ยนแปลง
        if (!isNaN(cvNum) && !isNaN(pvNum) && pvNum > 0 && cvNum !== pvNum) {
            let diff = cvNum - pvNum;
            let isImprovement = isTimeBased ? (diff < 0) : (diff > 0);
            let color = isImprovement ? '#00e676' : '#ff4d4d'; 
            let arrow = isImprovement ? '▲' : '▼';
            rowHtml += `<span style="color:${color}; font-weight:900; margin-left:10px; text-shadow:0 1px 2px rgba(0,0,0,0.1);">${arrow} ${Math.abs(diff).toFixed(2).replace(/\.00$/, '')}</span>`;
        }
        rowHtml += `</div>`;
        return rowHtml;
    }

    let statHtml = '';
    statHtml += drawStatRow('น้ำหนัก', '⚖️', cv.w, pv.w, 'kg');
    statHtml += drawStatRow('ส่วนสูง', '🦒', cv.h, pv.h, 'cm');
    statHtml += drawStatRow('จำนวนรอบ', '🏊', cv.laps, pv.laps, 'รอบ');
    statHtml += drawStatRow('ฟรีสไตล์', '🏊', cv.fr, pv.fr, 'วิ', true);
    statHtml += drawStatRow('กรรเชียง', '🏊', cv.bk, pv.bk, 'วิ', true);
    statHtml += drawStatRow('กบ', '🏊', cv.fg, pv.fg, 'วิ', true);
    statHtml += drawStatRow('ผีเสื้อ', '🏊', cv.bt, pv.bt, 'วิ', true);
    
    if (statHtml === '') {
        html += `<div style="font-size:12px; color:#777; font-style:italic; margin-bottom:4px;">ยังไม่มีข้อมูลสถิติที่บันทึกไว้ครับ...</div>`;
    } else {
        html += statHtml;
    }
    
    html += `</div>`; 

    // ==========================================
    // 📚 โซนที่ 3: ความรู้สึก และ วิชาการ
    // ==========================================
    html += `<div style="margin-top:30px; padding-top:12px; border-top:1px dashed var(--gbdr);">`;
    
    if (isTodayDone && S.feeling !== undefined) {
        const FEEL = ['แย่มาก', 'ไม่ค่อยดี', 'พอสู้ได้', 'ดีทีเดียว', 'ยอดเยี่ยม'];
        const F_ICO = ['😫', '🙁', '😐', '🙂', '🌟'];
        let fidx = parseInt(S.feeling) - 1;
        if(fidx >= 0 && fidx < 5) { 
            html += `<div style="margin-bottom:2px; font-size:13px; color:#333; display:flex; justify-content:flex-start; gap:0 !important;">
                        <span style="margin-right:8px; width:18px; text-align:center;">${F_ICO[fidx]}</span> 
                        <span style="min-width:80px; margin-right:5px;"><b style="color:var(--gold);">ความรู้สึก:</b></span> 
                        <span style="font-weight:bold;">${FEEL[fidx]}</span>
                     </div>`;
        }
    }

    if (pv.gpa || pv.sc) {
        let acadStr = [];
        if(isTodayDone) {
            if(cv.gpa) acadStr.push(`GPA ${cv.gpa}`);
            if(cv.sc) acadStr.push(`คะแนนสอบ ${cv.sc}%`);
        } else {
            if(pv.gpa) acadStr.push(`GPA (ล่าสุด: ${pv.gpa})`);
            if(pv.sc) acadStr.push(`คะแนนสอบ (ล่าสุด: ${pv.sc}%)`);
        }
        if (acadStr.length > 0) {
            html += `<div style="font-size:13px; color:#333; display:flex; justify-content:flex-start; gap:0 !important;">
                        <span style="margin-right:8px; width:18px; text-align:center;">📚</span> 
                        <span style="min-width:80px; margin-right:5px;"><b style="color:var(--gold);">วิชาการ:</b></span> 
                        <span style="font-weight:bold;">${acadStr.join(' | ')}</span>
                     </div>`;
        }
    }

    html += `</div>`;
    logBox.innerHTML = html;
}

function renderAll(){ 
  var cd = document.getElementById('coin-d'); if(cd) cd.textContent=S.coins; var td = document.getElementById('td-d'); if(td) td.textContent=S.todayCoins + (S.todayGmCoins||0); var spentD = document.getElementById('spent-d'); if(spentD) spentD.textContent=S.todayCoinsSpent || 0; var shc = document.getElementById('sh-c'); if(shc) shc.textContent=S.coins; var wd = document.getElementById('dw'); if(wd) wd.textContent=S.w||'—'; var hd = document.getElementById('dh'); if(hd) hd.textContent=S.h||'—'; var lvt = document.getElementById('lv-txt'); if(lvt) lvt.textContent=S.lv>=100?'MAX':S.lv; var cav = document.getElementById('cur-av'); if(cav) cav.textContent=AV[S.curAv];
  var pct=S.lv>=100?100:(S.exp/S.expMax*100); var expf = document.getElementById('exp-f'); if(expf) expf.style.width=pct+'%'; var expt = document.getElementById('exp-txt'); if(expt) expt.textContent=S.lv>=100?'MAX':(S.exp+' / '+S.expMax+' EXP');
  if(!S.hof) S.hof = { shark: false, book: false, heart: false }; var hS = document.getElementById('hof-shark'); if(hS) hS.className = S.hof.shark ? 'tri on' : 'tri off'; var hB = document.getElementById('hof-book'); if(hB) hB.className = S.hof.book ? 'tri on' : 'tri off'; var hH = document.getElementById('hof-heart'); if(hH) hH.className = S.hof.heart ? 'tri on' : 'tri off';
  var bgSub = document.getElementById('btn-gm-submit');
if(bgSub) {
  // ไม่ต้องซ่อนปุ่ม แต่ระบบจะมีตัวดักใน doGmSubmit อยู่แล้วว่าถ้าส่งแล้วจะแจ้งเตือนแทน [cite: 389, 390]
  bgSub.style.display = 'block'; 
}
  var gkDisp = document.getElementById('gacha-key-display'); if(gkDisp) gkDisp.textContent = S.keys || 0;
  syncInv(); syncShopQuota(); updateLog(); updateBestTable(); checkGachaLock(); 

  [1,2,3].forEach(function(n){ var c=document.getElementById('qc'+n), qi=document.getElementById('qi'+n); if(c) { c.classList.toggle('on',S.quests[n-1]); c.textContent=S.quests[n-1]?'✓':''; } if(qi) qi.classList.toggle('done',S.quests[n-1]); });
  qcnt=S.quests.filter(Boolean).length; var qbar = document.getElementById('qbar'); if(qbar) qbar.innerHTML=qcnt===3?'<span class="qsuc">✦ ภารกิจพร้อมส่ง! ✦</span>':'ติ๊ก <b>'+qcnt+'</b>/3 ภารกิจ';

// เช็กสถานะปุ่มอัปเดตและปุ่มส่ง
  var bSub = document.getElementById('btn-submit');
  var bDraft = document.getElementById('btn-draft');
  if (S.submitted) {
      if(bSub) { bSub.style.display = 'block'; bSub.textContent = '✅ ส่งภารกิจแล้ว'; bSub.disabled = true; bSub.style.background = '#555'; bSub.style.color = '#fff'; }
      if(bDraft) bDraft.style.display = 'none';
  } else {
      if (qcnt === 3) {
          if(bSub) { bSub.style.display = 'block'; bSub.textContent = '⚔️ ส่งภารกิจ'; bSub.disabled = false; bSub.style.background = ''; bSub.style.color = ''; }
          if(bDraft) bDraft.style.display = 'none';
      } else {
          if(bSub) bSub.style.display = 'none';
          if(bDraft) bDraft.style.display = 'block';
      }
  }

updateHeroSpeech();
  updateGmStatus();
  checkGmNotif();
  updateLog();
  buildStreak();
}

function checkGachaLock() {
  var d = new Date(); 
  var day = d.getDay(); 
  var isWeekend = (day === 0 || day === 6);
  
  // 🌟 เพิ่มการเช็คกุญแจผี 1 ชั่วโมงตรงนี้
  var isTempUnlocked = (S.tempChestUnlockUntil && Date.now() < S.tempChestUnlockUntil);
  
  var gBanner = document.querySelector('[onclick="doGacha()"]');
  if(!gBanner) return;
  if(window.getComputedStyle(gBanner).position === 'static') gBanner.style.position = 'relative';
  gBanner.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
  var lockId = 'gacha-lock-overlay'; var lockEl = document.getElementById(lockId);
  if(!lockEl) {
    lockEl = document.createElement('div'); lockEl.id = lockId;
    lockEl.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); border-radius:inherit; display:none; flex-direction:column; align-items:center; justify-content:center; z-index:10; border:2px solid #333; backdrop-filter:blur(2px);';
    lockEl.innerHTML = '<div style="font-size:38px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.8));">⛓️🔒⛓️</div><div style="color:#ff5252; font-weight:bold; font-size:12px; margin-top:5px; background:rgba(0,0,0,0.7); padding:4px 10px; border-radius:15px;">เปิดได้เฉพาะ เสาร์-อาทิตย์</div>';
    gBanner.appendChild(lockEl);
  }
  
  // 🌟 ถ้าเป็นวันหยุด หรือ ใช้กุญแจผีปลดล็อคชั่วคราว ให้เอาแม่กุญแจออก
  if(isWeekend || isTempUnlocked) { 
    gBanner.style.transform = 'scale(1)'; 
    gBanner.style.filter = 'grayscale(0)'; 
    lockEl.style.setProperty('display', 'none', 'important'); 
  } else { 
    gBanner.style.transform = 'scale(0.9)'; 
    gBanner.style.filter = 'grayscale(0.8)'; 
    lockEl.style.setProperty('display', 'flex', 'important'); 
  }
}
function updateBestTable(){ var fmt=function(v){return(v===null||v===undefined||v==='')?'—':(v+' วิ');}; ['fr','bt','fg','bk'].forEach(function(k){ var mEl = document.getElementById('mb-'+k), aEl = document.getElementById('ab-'+k); if(mEl && S.monthBest) mEl.textContent=fmt(S.monthBest[k]); if(aEl && S.allBest) aEl.textContent=fmt(S.allBest[k]); }); }
function syncInv(){ var invK = document.getElementById('inv-key'); if(invK) invK.textContent=S.keys||0; var invP = document.getElementById('inv-ph'); if(invP) invP.textContent=S.phoenix; var shP = document.getElementById('sh-ph'); if(shP) shP.textContent=S.phoenix; var invT = document.getElementById('inv-tk'); if(invT) invT.textContent=S.ticket; var shT = document.getElementById('sh-tk'); if(shT) shT.textContent=S.ticket; }
function syncShopQuota(){ var fQ = document.getElementById('food-quota'); if(fQ) fQ.textContent='✅ โควต้าคงเหลือ: '+Math.max(0, 1-(S.foodWeekBought||0))+'/1'; }

var toastTm; function showToast(m){ var t=document.getElementById('toast'); if(!t) return; t.textContent=m;t.classList.add('on'); clearTimeout(toastTm);toastTm=setTimeout(function(){t.classList.remove('on');},3200); }
function cfmShow(ico,ttl,msg,cb){ var ci = document.getElementById('ci'); if(ci) ci.textContent=ico; var ct2 = document.getElementById('ct2'); if(ct2) ct2.textContent=ttl; var cm = document.getElementById('cm'); if(cm) cm.textContent=msg; S.pending=cb; var cfm = document.getElementById('cfm'); if(cfm) cfm.classList.add('on'); }

function usePhoenix(){ if(S.phoenix<=0) showToast('❌ ไม่มีน้ำตาฟีนิกซ์ในคลัง'); else showToast('✅ กดใช้ที่ไอคอนรูปกะโหลก 💀 ในหน้า Streak ได้เลย!'); }
function useTicket(){ 
    if(S.ticket<=0){ showToast('❌ ไม่มีน้ำยาแสนอร่อย\nซื้อที่ร้านค้าก่อนนะ! 🛒'); return; } 
    cfmShow('🍜','ดื่มน้ำยาแสนอร่อย?','(เพื่อสั่งเมนูพิเศษ คงเหลือ: '+S.ticket+' ขวด)', function(){ 
        S.ticket--; saveLocal(); syncInv(); 
        var fdM = document.getElementById('fd-mov'); if(fdM) fdM.classList.add('on'); 
    }); 
}

function confirmFd(){ 
  var fdM = document.getElementById('fd-mov');
  if(fdM) {
    var inputEl = fdM.querySelector('input') || fdM.querySelector('textarea');
    var menuText = (inputEl && inputEl.value.trim() !== '') ? inputEl.value : 'เมนูพิเศษ (ไม่ได้ระบุ)';
    if(!S.todayItemsUsed) S.todayItemsUsed = []; S.todayItemsUsed.push('🍜 สั่งเมนู: ' + menuText);
    if(!S.chefUsed) S.chefUsed = 0; S.chefUsed++;
    saveLocal(); renderAll();
    
    // 🌟 แจ้งเตือน LINE: สั่งอาหารจาก "น้ำยาแสนอร่อย" (คลังไอเทม)
    sendToLine("POTION", "👨‍🍳 [BIFROST] ออเดอร์พิเศษ!\nเมนู: " + menuText + "\n(ใช้ไอเทม: 🍜 น้ำยาแสนอร่อย)");
    
    if(inputEl) inputEl.value = '';
    fdM.classList.remove('on'); 
    showChefCard(menuText);
  }
}
function buyFood() {
    if(S.coins < 50){ showToast('❌ B-Coin ไม่พอ!'); return; }
    if(S.foodWeekBought >= 1){ showToast('❌ หมดโควต้าสัปดาห์นี้แล้ว!'); return; }
    
    cfmShow('🍜', 'ซื้อตั๋วเชฟทองคำ?', 'ราคา 50 B-Coin', function() {
        // 🌟 ให้ระบบหน้าจอ หักเงินและเพิ่มตั๋วเองทันที!
        S.coins -= 50;
        S.todayCoinsSpent = (S.todayCoinsSpent || 0) + 50;
        S.ticket = (S.ticket || 0) + 1;
        S.foodWeekBought = (S.foodWeekBought || 0) + 1;
        if (!S.todayItemsUsed) S.todayItemsUsed = [];
        S.todayItemsUsed.push('🛒 ซื้อน้ำยาแสนอร่อย (-50 Coins)');
        
        saveLocal();
        renderAll();
        showToast('🍜 ซื้อตั๋วเชฟทองคำสำเร็จ!');
    });
}



function showChefCard(menuText) {
  var d = new Date(); var dateStr = d.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}); var serialStr = 'CHEF-' + String(S.chefUsed).padStart(4,'0');
  var cMenu = document.getElementById('chef-card-menu'); var cDate = document.getElementById('chef-card-date'); var cSerial = document.getElementById('chef-card-serial');
  if(cMenu) cMenu.textContent = menuText; if(cDate) cDate.textContent = dateStr; if(cSerial) cSerial.textContent = serialStr;
  var chefScreen = document.getElementById('chef-screen');
  if(chefScreen) { SFX.card(); chefScreen.style.display = 'flex'; var chefCard = chefScreen.children[1]; if(chefCard) { chefCard.classList.remove('card-slide-up'); void chefCard.offsetWidth; chefCard.classList.add('card-slide-up'); } }
}

function openAv(){ S.selAv=S.curAv; buildAg(); var avM = document.getElementById('av-mov'); if(avM) avM.classList.add('on'); }
function buildAg(){ var html=''; AV.forEach(function(em,i){ var reqLv = (i === 0) ? 1 : (i * 2) + 1; var un = S.lv >= reqLv; var sel = i === S.selAv; html += '<div class="ao '+(un?'u':'lk')+' '+(sel?'sel':'')+'" data-ai="'+i+'">'; html += '<div>'+em+'</div><div class="ao-l">'+AN[i]+'</div>'; if (!un) { html += '<div class="lko">🔒<span>Lv.'+reqLv+'</span></div>'; } html += '</div>'; }); var avg = document.getElementById('av-g'); if(avg) avg.innerHTML=html; document.querySelectorAll('.ao.u').forEach(function(el){ el.addEventListener('click',function(){ S.selAv=parseInt(el.getAttribute('data-ai')); document.querySelectorAll('.ao').forEach(function(e,j){ e.classList.toggle('sel',j===S.selAv); }); }); }); }

function readRepairNumber(id) {
  var el = document.getElementById(id);
  if (!el || el.value === '') return undefined;
  var n = Number(el.value);
  return Number.isFinite(n) ? n : undefined;
}

function readRepairText(id) {
  var el = document.getElementById(id);
  if (!el || el.value === '') return undefined;
  return el.value;
}

function setRepairValue(id, value) {
  var el = document.getElementById(id);
  if (el) el.value = (value === undefined || value === null) ? '' : value;
}

function fillRepairCenter() {
  setRepairValue('rp-coins', S.coins);
  setRepairValue('rp-today-coins', S.todayCoins);
  setRepairValue('rp-today-spent', S.todayCoinsSpent || 0);
  setRepairValue('rp-lv', S.lv);
  setRepairValue('rp-exp', S.exp);
  setRepairValue('rp-keys', S.keys || 0);
  setRepairValue('rp-ticket', S.ticket || 0);
  setRepairValue('rp-food-week', S.foodWeekBought || 0);
  setRepairValue('rp-step', S.currentDayIndex || 0);
  setRepairValue('rp-w', S.w || '');
  setRepairValue('rp-h', S.h || '');
  setRepairValue('rp-fr', S.swimFr || '');
  setRepairValue('rp-bk', S.swimBk || '');
  setRepairValue('rp-fg', S.swimFg || '');
  setRepairValue('rp-bt', S.swimBt || '');
  setRepairValue('rp-boss-speed', S.bossTargets ? S.bossTargets.speed : '');
  setRepairValue('rp-boss-height', S.bossTargets ? S.bossTargets.heightBase : '');
  setRepairValue('rp-boss-weight', S.bossTargets ? S.bossTargets.weightBase : '');
  setRepairValue('rp-log', Array.isArray(S.todayItemsUsed) ? S.todayItemsUsed.join('\n') : '');
}

function openRepairCenter() {
  fillRepairCenter();
  var m = document.getElementById('repair-modal');
  if (m) m.classList.add('on');
}

function closeRepairCenter() {
  var m = document.getElementById('repair-modal');
  if (m) m.classList.remove('on');
}

function doRepairSubmit() {
  var pin = readRepairText('rp-pin') || '';
  var reason = readRepairText('rp-reason') || '';
  if (pin.length < 4) { showToast('กรุณากรอก PIN ก่อนซ่อมข้อมูล'); return; }
  if (!reason) { showToast('กรุณาระบุเหตุผลการแก้ไข'); return; }

  var fields = {};
  var numberMap = {
    coins:'rp-coins', todayCoins:'rp-today-coins', todayCoinsSpent:'rp-today-spent', lv:'rp-lv', exp:'rp-exp', keys:'rp-keys', ticket:'rp-ticket', foodWeekBought:'rp-food-week', currentDayIndex:'rp-step', w:'rp-w', h:'rp-h', swimFr:'rp-fr', swimBk:'rp-bk', swimFg:'rp-fg', swimBt:'rp-bt'
  };
  Object.keys(numberMap).forEach(function(key) {
    var val = readRepairNumber(numberMap[key]);
    if (val !== undefined) fields[key] = val;
  });

  var nested = {};
  var bossSpeed = readRepairNumber('rp-boss-speed');
  var bossHeight = readRepairNumber('rp-boss-height');
  var bossWeight = readRepairNumber('rp-boss-weight');
  if (bossSpeed !== undefined || bossHeight !== undefined || bossWeight !== undefined) {
    nested.bossTargets = {};
    if (bossSpeed !== undefined) nested.bossTargets.speed = bossSpeed;
    if (bossHeight !== undefined) nested.bossTargets.heightBase = bossHeight;
    if (bossWeight !== undefined) nested.bossTargets.weightBase = bossWeight;
  }

  var logText = readRepairText('rp-log');
  if (logText !== undefined) fields.todayItemsUsed = logText.split('\n').map(function(x){ return x.trim(); }).filter(Boolean);

  fetch(SHEET_URL, { method:'POST', body:JSON.stringify({ action:'ADMIN_REPAIR', pin:pin, reason:reason, fields:fields, nested:nested }) })
    .then(function(res){ return res.json(); })
    .then(function(data){
      if (!data || data.result !== 'success') throw new Error((data && (data.message || data.error)) || 'ซ่อมข้อมูลไม่สำเร็จ');
      Object.assign(S, data.save || {});
      localStorage.setItem('bifrost_data', JSON.stringify(S));
      renderAll();
      closeRepairCenter();
      showToast('🛠️ ซ่อมข้อมูลสำเร็จ พร้อม backup แล้ว');
    })
    .catch(function(err){ showToast(err.message || 'ซ่อมข้อมูลไม่สำเร็จ'); });
}
function bindAll(){
  var a = (id, e, f) => { var el = document.getElementById(id); if(el) el.addEventListener(e, f); };
  a('ni-d', 'click', () => goP('dashboard')); a('ni-q', 'click', () => goP('quest')); a('ni-s', 'click', () => goP('shop'));
  a('ch-prev', 'click', () => { if(chIdx>0) setChar(chIdx-1); }); a('ch-next', 'click', () => { if(chIdx<19) setChar(chIdx+1); });
  a('btn-av', 'click', openAv);
  var avm = document.getElementById('av-mov'); if(avm) avm.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('on'); });
  var hofm = document.getElementById('hof-mov'); if(hofm) { hofm.addEventListener('click', function(e){ if(e.target === this) this.classList.remove('on'); }); }
  var bdm = document.getElementById('boss-detail-mov'); if(bdm) bdm.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('on'); });
  a('btn-av-confirm', 'click', () => { gasCall('saveAvatar', S.selAv, function(r){ applyData(r); var m = document.getElementById('av-mov'); if(m) m.classList.remove('on'); showToast('✦ เปลี่ยนอวาตาร์สำเร็จ!'); }); });
  [1,2,3].forEach(function(n){ a('qi'+n, 'click', () => tQ(n)); });
  a('feel-sl', 'input', function(){ updateFeel(this.value); });
   
  a('btn-submit', 'click', doSubmit); a('btn-reset', 'click', doReset); a('btn-gm-submit', 'click', doGmSubmit); a('btn-open-repair', 'click', openRepairCenter); a('btn-repair-submit', 'click', doRepairSubmit); a('btn-repair-close', 'click', closeRepairCenter);
  a('inv-ph-row', 'click', usePhoenix); a('inv-tk-row', 'click', useTicket);
  a('sh-food-btn', 'click', buyFood);
  var fdm = document.getElementById('fd-mov'); if(fdm) fdm.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('on'); });
  a('btn-fd-confirm', 'click', confirmFd);
  a('cfm-yes', 'click', () => { var c = document.getElementById('cfm'); if(c) c.classList.remove('on'); if(S.pending){S.pending();S.pending=null;} });
  a('cfm-no', 'click', () => { var c = document.getElementById('cfm'); if(c) c.classList.remove('on'); S.pending=null; });
  a('chef-close-btn', 'click', () => { var scr = document.getElementById('chef-screen'); if(scr) scr.style.display='none'; });
  a('btn-boss-claim', 'click', () => { SFX.coin(); var bo = document.getElementById('boss-overlay'); if(bo) bo.classList.remove('on'); goP('dashboard'); setChar(chForLevel(S.lv)); });
  document.addEventListener('visibilitychange', function() { if (document.visibilityState === 'visible') { fetchDraftFromCloud(); refreshWalletActivityLog(); } });
  window.addEventListener('focus', refreshWalletActivityLog);
  document.querySelectorAll('input').forEach(function(input) { input.addEventListener('blur', autoSyncDraft); });

 // 👑 ตรวจสอบ URL ว่ามีตัว @ อยู่ด้านหลังสุดหรือไม่ (รองรับทั้ง ?@ และ #@)
  var isAdmin = window.location.search.includes('@') || window.location.hash.includes('@');

  // 👑 ทางเข้า GM MODE (ระบบ Admin)
  var hdrT = document.querySelector('.hdr-t');
  if(hdrT) {
    if(isAdmin) {
      // โหมดคุณพ่อ: เปลี่ยนสี/ชื่อ ให้รู้ว่าอยู่โหมด Admin และกดแค่ "ครั้งเดียว" เปิดเลย
      hdrT.innerHTML = '✦ BIFROST (ADMIN) ✦';
      hdrT.style.color = '#ffea00'; 
      hdrT.addEventListener('click', function() {
        var gmMov = document.getElementById('gm-modal');
        if(gmMov) gmMov.classList.add('on');
        showToast('👑 ยินดีต้อนรับปะป๊า (Admin Mode)');
      });
    } else {
      // โหมดของน้อง (ไม่มี mode=admin): ไม่มีการฝัง Event Click ใดๆ ปลอดภัย 100%
      // ไม่สามารถกดเปิดได้เด็ดขาด
    }
  }

  // 🛠️ ทางเข้า TEST MODE สำหรับเทสแอป (กด 5 ครั้งที่ชื่อฮีโร่)
  var testClicks = 0; var testTm;
  var heroNameEl = document.querySelector('.hero-nm');
  if(heroNameEl) {
    heroNameEl.addEventListener('click', function() {
      // บล็อคไว้ให้เปิดได้เฉพาะคุณพ่อ (Admin) เท่านั้น
      if(!isAdmin) return; 
      
      testClicks++; clearTimeout(testTm);
      if(testClicks >= 5) { 
        var devBar = document.getElementById('dev-tools-bar');
        if(devBar) devBar.style.display = 'flex';
        showToast('🛠️ เปิดโหมดทดสอบ (TEST MODE) แล้ว!');
        testClicks = 0;
      }
      testTm = setTimeout(function(){ testClicks = 0; }, 1000);
    });
  }
}

// ==========================================
// 🛠️ TEST MODE FUNCTIONS
// ==========================================
window.devQuickComplete = function() {
    if (S.submitted) { showToast('วันนี้ส่งภารกิจไปแล้ว กดข้ามวันก่อนครับ!'); return; }
    
    // 1. ติ๊กเควสให้ครบ 3 ข้อ
    S.quests = [true, true, true];
    S.submitted = true;
    
    // 2. 🗺️ สั่งให้ก้าวเดินขยับ 1 ก้าวทันที
    S.currentDayIndex = (S.currentDayIndex || 0) + 1;
    buildStreak(); // อัปเดตภาพหน้าจอ
    
    // 3. 🎁 แจกรางวัลถ้าครบ 7 ก้าว (โหมดจำลอง Dev)
    if (S.currentDayIndex >= 7) {
        S.keys = (S.keys || 0) + 2; // แจกกุญแจในโหมด Dev ได้เลย
        S.currentDayIndex = 0;
        setTimeout(() => {
            showToast("🎊 ยินดีด้วย! ครบ 7 ก้าว รับกุญแจทอง 2 ดอก! (Dev Mode)");
            renderAll();
            buildStreak();
        }, 1000);
    }
    
    saveLocal();
    renderAll();
    showToast('🎯 จบเควส & เดินหน้า 1 ก้าวเรียบร้อย!');
};

window.devLevelUp = function() { 
  S.lv++; saveLocal(); renderAll(); setChar(chForLevel(S.lv)); 
  SFX.levelUp();
  var lvt = document.getElementById('lv-txt'); 
  if(lvt) { lvt.classList.remove('level-up-pop'); void lvt.offsetWidth; lvt.classList.add('level-up-pop'); }
  document.getElementById('lm-lv-val').textContent = S.lv;
  document.getElementById('level-overlay').classList.add('on');
};

window.devAddExp = function() { 
  S.exp += 50; 
  if(S.exp >= S.expMax) { 
    S.lv++; S.exp = S.exp - S.expMax; 
    SFX.levelUp();
    var lvt = document.getElementById('lv-txt'); 
    if(lvt) { lvt.classList.remove('level-up-pop'); void lvt.offsetWidth; lvt.classList.add('level-up-pop'); }
    document.getElementById('lm-lv-val').textContent = S.lv;
    document.getElementById('level-overlay').classList.add('on');
  } else { 
    showToast('⭐ ได้รับ 50 EXP'); 
  }
  saveLocal(); renderAll(); setChar(chForLevel(S.lv)); 
};

window.devAddCoin = function() { 
  S.coins += 100; 
  saveLocal(); renderAll(); 
  showToast('💰 ได้รับ 100 B-Coin'); 
};

window.devAddKey = function() { 
  S.keys += 1; 
  saveLocal(); renderAll(); 
  showToast('🗝️ ได้รับกุญแจทอง 1 ดอก!'); 
};

window.devNextDay = function() { 
  var dateLabel = new Date().toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});
  if(SHEET_URL && SHEET_URL.length >= 10) {
      var payload = Object.assign({}, S, { syncDate: dateLabel });
      fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', body: JSON.stringify(payload) });
  }
  
if (new Date().getDay() === 1) { S.phWeekBought = 0; S.foodWeekBought = 0; showToast('✨ เริ่มต้นสัปดาห์ใหม่!'); }

  S.submitted = false; S.gmSubmitted = false; S.isResubmit = false; S.quests = [false, false, false]; S.todayCoins = 0; S.todayGmCoins = 0; S.todayGacha = []; S.todayItemsUsed = []; S.todayCoinsSpent = 0; S.lastSyncDate = new Date().toLocaleDateString('en-CA');
  [1,2,3].forEach(function(n){ var qc = document.getElementById('qc'+n); if(qc) { qc.classList.remove('on'); qc.textContent=''; } var qi = document.getElementById('qi'+n); if(qi) qi.classList.remove('done'); });
  qcnt = 0; var qbar = document.getElementById('qbar'); if(qbar) qbar.innerHTML = 'ติ๊ก <b>0</b>/3 ภารกิจ'; 
  S.achievement = ''; S.specialCoin = 0;
  
  var currentM = new Date().getMonth(); var checkM = new Date(S.lastSyncDate).getMonth();
  if (currentM !== checkM) { S.monthBest = { fr: null, bt: null, fg: null, bk: null }; }
  
  saveLocal(); renderAll(); buildStreak(); showToast('🌅 ข้ามไปวันถัดไปเรียบร้อย!'); 
  autoSyncDraft();
};

window.devHardReset = function() { 
  cfmShow('⚠️', 'ยืนยันการล้างข้อมูล?', 'เริ่มใหม่หมดทันที!', function() { 
    localStorage.removeItem('bifrost_data'); 
    location.reload(); 
  }); 
};
// ==========================================

document.addEventListener('DOMContentLoaded',function(){ checkRemoteVersion(); 
  // ส่งเลขเวอร์ชันไปแสดงที่หน้าจอ
  var verEl = document.getElementById('app-version');
  if(verEl) verEl.textContent = 'Ver.' + APP_VERSION;
  var mainVerEl = document.getElementById('main-app-version');
  if(mainVerEl) mainVerEl.textContent = 'Ver.' + APP_VERSION;
  loadLocal(); 
  loadDraft();
  window.addEventListener('online', () => { document.getElementById('offline-overlay').style.display = 'none'; showToast('🟢 สัญญาณอินเทอร์เน็ตกลับมาแล้ว!'); });
  window.addEventListener('offline', () => { document.getElementById('offline-overlay').style.display = 'flex'; SFX.error(); });
  if(!navigator.onLine) document.getElementById('offline-overlay').style.display = 'flex';

  // --- ระบบฉาก Intro สีขาวแบบใหม่ ---
  var vOverlay = document.getElementById('intro-overlay');
  function closeIntro() { 
    if(vOverlay) { 
      vOverlay.style.opacity = '0'; 
      setTimeout(() => { vOverlay.style.display='none'; if(!showVersionUpdateIfNeeded()) showProphecyIfAny(); }, 800); 
    } 
  }
  if(vOverlay) {
    setTimeout(closeIntro, 1300); // โชว์ 2.5 วินาทีแล้วหายไป
  }
  // ------------------------------

  bindAll(); 
  // 🌟 โหลดเซฟจาก Cloud ตอนเปิดแอป
  if (navigator.onLine && SHEET_URL && SHEET_URL.length > 10) {
    setSkeleton(true);
    fetch(SHEET_URL + "?action=loadSave")
      .then(res => res.json())
      .then(data => {
        setSkeleton(false);
        if(Object.keys(data).length > 0) {
          Object.assign(S, data); 
          localStorage.setItem('bifrost_data', JSON.stringify(S)); 
          showToast('🟢 ซิงค์ข้อมูลข้ามอุปกรณ์สำเร็จ!');
        }
        if (S.bossTargets && S.bossTargets.speed === 21) { S.bossTargets.speed = 25; saveLocal(); }
        setChar(chForLevel(S.lv)); processAutoNextDay(); renderAll();
      }).catch(err => {
        setSkeleton(false); showToast('⚠️ ใช้เซฟในเครื่อง (ออฟไลน์)');
        gasCall('getHeroData', null, function(data) { applyData(data); setChar(chForLevel(S.lv)); processAutoNextDay(); renderAll(); });
      });
  } else {
     gasCall('getHeroData', null, function(data) { applyData(data); setChar(chForLevel(S.lv)); processAutoNextDay(); renderAll(); });
  }
});

function fetchDraftFromCloud() {
  if(!SHEET_URL || SHEET_URL.length < 10) return;
  var todayStr = new Date().toLocaleDateString('en-CA');
  fetch(SHEET_URL + "?action=fetchDraft&date=" + todayStr)
    .then(res => res.json())
    .then(data => {
      if (data.w) document.getElementById('in-w').value = data.w;
      if (data.h) document.getElementById('in-h').value = data.h;
      if (data.fr) document.getElementById('in-fr').value = data.fr;
      if (data.bt) document.getElementById('in-bt').value = data.bt;
      if (data.fg) document.getElementById('in-fg').value = data.fg;
      if (data.bk) document.getElementById('in-bk').value = data.bk;
      if (data.sc) document.getElementById('in-sc').value = data.sc;
      if (data.lp) document.getElementById('in-lp').value = data.lp;
    }).catch(e => console.log("ยังไม่มี Draft ของวันนี้"));
}

// ==========================================
// 💬 ระบบคำพูดฮีโร่ (Dynamic Speech Bubble)
// ==========================================
var NORMAL_SPEECHES = {
  morning: ["อรุณสวัสดิ์ฮีโร่ไบฟรอส! วันนี้มีเควสรอเราอยู่นะ! ⚔️", "ตื่นเต็มตาหรือยัง? ทานข้าว ดื่มนม แล้วไปลุยเควสแรกกันเถอะ! 🥛✨", "แสงอาทิตย์ยามเช้า! เหมาะกับการเริ่มออกผจญภัยที่สุด 🗺️"],
  afternoon: ["ลุยต่ออีกนิดนะ! ขาดอีกนิดเดียวหลอด EXP ก็พุ่งปรี๊ดแล้ว! 📈", "เหนื่อยไหมฮีโร่? พักดื่มน้ำแป๊บนึง แล้วกลับมาลุยภารกิจกันต่อ! 💧", "มอนสเตอร์ใกล้แพ้แล้ว! งัดพลังก๊อกสองออกมาเลยไบฟรอส! 🔥"],
  evening: ["พระอาทิตย์จะตกแล้ว! รีบเคลียร์เควสแล้วมารายงานตัวเร็วเข้า! 🌇", "ฮีโร่! อย่าปล่อยให้เควสหมดอายุนะ รีบไปดู Quest Board เถอะ! ⏳", "มัวแต่เล่นเพลินหรือเปล่าเนี่ย? มากดส่งเควสรับ EXP ก่อนไปอาบน้ำนอนนะ! 🚿"],
  ready: ["ภารกิจครบแล้ว! รีบไปกดส่งรายงานให้ปะป๊าเร็วเข้า! 🏃‍♂️", "ติ๊กเควสครบแล้วใช่มั้ย? รีบมารายงานตัวด่วน! 📝", "ระบบรอรับรายงานอยู่! กดยืนยันปุ๊บ รับเหรียญไปนอนกอดได้เลย! 💰"],
  done: ["วันนี้ยอดเยี่ยมมาก! พักผ่อนชาร์จพลัง พรุ่งนี้ลุยกันใหม่นะ 🌟", "เควสเคลียร์หมดแล้ว! เก่งมากไบฟรอส คืนนี้ฝันดีนะฮีโร่ 🌙", "ผลงานวันนี้ปะป๊าภูมิใจแน่ๆ! รีบเข้านอนนะ ร่างกายจะได้แข็งแรง 💪"]
};

function updateHeroSpeech() {
  var zone = document.getElementById('hero-speech-zone'), 
      alertIco = document.getElementById('hero-alert'), 
      bubble = document.getElementById('hero-bubble'), 
      txt = document.getElementById('hero-bubble-text');
  
  if(!zone || !alertIco || !bubble) return;

  // 1. ล้างสถานะเดิมทิ้งก่อน เพื่อให้ Animation เล่นใหม่ได้
  alertIco.style.display = 'none'; 
  bubble.style.display = 'none'; 
  bubble.classList.remove('anim', 'secret-quest');
  alertIco.style.animation = 'none'; 
  void alertIco.offsetWidth; // เทคนิค Force Reflow เพื่อรีเซ็ต Animation

  // 🌟 โหมดที่ 1: เควสลับจากคุณพ่อ (Priority สูงสุด)
  if(S.gmBuffs && S.gmBuffs.secretQuest) {
      txt.innerHTML = '📜 <b>ภารกิจลับ (ด่วน):</b><br>' + S.gmBuffs.secretQuest;
      bubble.classList.add('secret-quest');
      
      // แสดง ❗️❗️❗️ และสั่งให้กระพริบ 2 ครั้ง (0.5วิ x 2 = 1 วินาที)
      alertIco.style.display = 'block';
      alertIco.style.animation = 'alertBlink 0.5s ease-in-out 2';
      
      // พอครบ 1 วิ ให้ซ่อนเครื่องหมาย แล้วเด้งกรอบข้อความสีดำทองขึ้นมา
      setTimeout(function() {
          alertIco.style.display = 'none';
          bubble.classList.add('anim');
          bubble.style.display = 'block';
      }, 1000);
  } else {
      // 💬 โหมดที่ 2: ทักทายปกติ (แสดงทันที ไม่ต้องรอเครื่องหมายตกใจ)
      var hour = new Date().getHours(), 
          qDone = S.quests ? S.quests.filter(Boolean).length : 0, 
          arr = [];
      
      if(S.submitted) arr = NORMAL_SPEECHES.done;
      else if(qDone === 3) arr = NORMAL_SPEECHES.ready;
      else if(hour >= 17) arr = NORMAL_SPEECHES.evening;
      else if(hour >= 12) arr = NORMAL_SPEECHES.afternoon;
      else arr = NORMAL_SPEECHES.morning;
      
      txt.innerHTML = arr[Math.floor(Math.random() * arr.length)];
      bubble.classList.add('anim');
      bubble.style.display = 'block';
  }
}

// ⚠️ หาฟังก์ชัน renderAll() ของเดิม แล้วเอาบรรทัดนี้ไปใส่ไว้ท้ายสุดของฟังก์ชันนั้นครับ:
// updateHeroSpeech();

// 🟢 ระบบอัปเดตไฟสถานะในหน้า GM Mode (เวอร์ชันแก้บัคข้อมูลว่าง)
function updateGmStatus() {
    var setSt = function(id, isOn) {
        var el = document.getElementById(id);
        if(!el) return;
        if(isOn) {
            el.innerHTML = '[ 🟢 ON ]';
            el.style.color = '#00e676';
            el.style.textShadow = '0 0 8px #00e676';
        } else {
            el.innerHTML = '[ ⚪ OFF ]';
            el.style.color = '#888';
            el.style.textShadow = 'none';
        }
    };

    // ดึงข้อมูลบัฟ ถ้าไม่มีให้มองว่าเป็นกล่องเปล่าๆ จะได้ไม่ Error
    var buffs = S.gmBuffs || {}; 
    
    setSt('st-jackpot', buffs.jackpot); 
    setSt('st-prophecy', buffs.prophecy && buffs.prophecy.trim() !== ''); 
    setSt('st-secret', buffs.secretQuest && buffs.secretQuest.trim() !== ''); 
    
}

// 🔓 ระบบปลดล็อกหีบสมบัติชั่วคราว (1 ชั่วโมง)
window.devTempUnlockChest = function() {
  // บวกเวลาไปอีก 1 ชั่วโมง (60 นาที * 60 วินาที * 1000 มิลลิวินาที)
  S.tempChestUnlockUntil = Date.now() + (60 * 60 * 1000); 
  saveLocal();
  renderAll(); // รีเฟรชหน้าจอให้แม่กุญแจหายไป
  showToast('🔓 ปลดล็อกหีบสมบัติชั่วคราว 1 ชั่วโมงเรียบร้อย!');
};

// ฟังก์ชันแสดง Popup แจ้งเตือน
function checkGmNotif() {
  // ตรวจสอบว่ามีการส่งคำสั่ง GM และน้องยังไม่ได้กดรับทราบ
  if (S.gmSubmitted && S.gmPopupSeen === false) {
    let msg = "<b>มีการอัปเดตจากปะป๊า!</b><br>";
    if (S.specialCoin !== 0) msg += "• B-Coin: " + (S.specialCoin > 0 ? "+" : "") + S.specialCoin + " เหรียญ<br>";
    if (S.achievement) msg += "• บันทึก: " + S.achievement;
    
    var notifContent = document.getElementById('gm-notif-content');
    var notifModal = document.getElementById('gm-notif-modal');
    
    if(notifContent && notifModal) {
        notifContent.innerHTML = msg;
        notifModal.classList.add('on');
    }
  }
}

// ฟังก์ชันเมื่อกดปุ่ม "รับทราบ" (ปิดถาวรสำหรับการส่งครั้งนั้น)
window.acknowledgeGmNotif = function() {
  S.gmPopupSeen = true;
  saveLocal();
  var notifModal = document.getElementById('gm-notif-modal');
  if(notifModal) notifModal.classList.remove('on');
  showToast('✅ รับทราบการอัปเดตเรียบร้อย');
}

// ฟังก์ชันเมื่อกด "รับทราบคำทำนาย" (ปิดถาวร)
window.acknowledgeProphecy = function() {
  S.prophecySeen = true;
  S.gmBuffs.prophecy = ''; // ลบข้อความทิ้งเมื่อรับทราบแล้ว
  saveLocal();
  document.getElementById('prophecy-modal').style.display = 'none';
  showToast('🔮 บันทึกคำทำนายลงในจิตวิญญาณแล้ว');
}

// ย้ายมาเรียกใช้ใน renderAll เพื่อให้เด้งทันทีเหมือน GM Message
// (ให้คุณพ่อไปเติม showProphecyIfAny(); ไว้ท้ายฟังก์ชัน renderAll ต่อจาก checkGmNotif(); ได้เลยครับ)

// ==========================================
// 💾 ระบบอัปเดตภารกิจ (Save Draft)
// ==========================================
function doDraft() {
    if(S.submitted) return;
    S.draft = {
        ill: document.getElementById('in-ill').value,
        w: document.getElementById('in-w').value,
        h: document.getElementById('in-h').value,
        lp: document.getElementById('in-lp').value,
        fr: document.getElementById('in-fr').value,
        bt: document.getElementById('in-bt').value,
        fg: document.getElementById('in-fg').value,
        bk: document.getElementById('in-bk').value,
        gpa: document.getElementById('in-gpa').value,
        sc: document.getElementById('in-sc').value,
        feel: document.getElementById('feel-sl').value
    };
    saveLocal();
    showToast('💾 บันทึกข้อมูลชั่วคราวแล้ว!');
}

function loadDraft() {
    if(S.draft && !S.submitted) {
        if(S.draft.ill) document.getElementById('in-ill').value = S.draft.ill;
        if(S.draft.w) document.getElementById('in-w').value = S.draft.w;
        if(S.draft.h) document.getElementById('in-h').value = S.draft.h;
        if(S.draft.lp) document.getElementById('in-lp').value = S.draft.lp;
        if(S.draft.fr) document.getElementById('in-fr').value = S.draft.fr;
        if(S.draft.bt) document.getElementById('in-bt').value = S.draft.bt;
        if(S.draft.fg) document.getElementById('in-fg').value = S.draft.fg;
        if(S.draft.bk) document.getElementById('in-bk').value = S.draft.bk;
        if(S.draft.gpa) document.getElementById('in-gpa').value = S.draft.gpa;
        if(S.draft.sc) document.getElementById('in-sc').value = S.draft.sc;
        if(S.draft.feel) {
            var fsl = document.getElementById('feel-sl');
            if(fsl) { fsl.value = S.draft.feel; fsl.dispatchEvent(new Event('input')); }
        }
    }
}

