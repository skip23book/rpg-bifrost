// ══════════════════════════════════════════════════
//  STATE (ตัวแปรระบบหลัก)
// ══════════════════════════════════════════════════
var AV = ['🧙','⚔️','🏹','🧜','🔥','⚡','🌊','🍃','❄️','💫','🦅','🐉','🌸','🗡️','🛡️','👑','🌙','☀️','🎭','✨','🦇','🐺','🧚','🧞','🧟','🤖','👽','👻','☠️','🤡','🦁','🐍','🐢','🐦','🦄','🐝','🦊','🐙','🕷️','🦂','💎','🔮','🪓','🔱','👁️','🪐','☄️','🌪️','🌌','♾️'];
var AN = ['นักเวทย์','นักรบ','นักธนู','ไฮโดร','ไพโร','อิเล็กโตร','อควา','อะเนโม','ครายโอ','แอสโตร','ฮอว์ค','มังกร','ซากุระ','คาตา','พาลาดิน','ราชัน','ลูน่า','โซลาร์','มายา','ดาวเด่น','แวมไพร์','ไลแคน','แฟรี่','จินนี่','ซอมบี้','ไซบอร์ก','เอเลี่ยน','สเปกเตอร์','เนโครมันเซอร์','โจ๊กเกอร์','ราชสีห์','ไวเปอร์','เก็นบุ','ฟีนิกซ์','ยูนิคอร์น','คิลเลอร์บี','คิทซึเนะ','คราเคน','อารัคเน่','สคอร์เปียน','โกเลม','ออราเคิล','เบอร์เซิร์กเกอร์','โพไซดอน','ผู้หยั่งรู้','คอสมิก','เมเทโอ','พายุหมุน','เนบิวลา','อัลฟ่า'];
var CHAR_NAMES=['นักดาบฝึกหัด','นักรบฝึกหัด','สำนักดาบ','ทหารยาม','อัศวินสามัญ','ผู้พิทักษ์','นักรบแนวหน้า','อัศวินศักดิ์สิทธิ์','พาลาดินศักดิ์สิทธิ์','เทมพลาร์หลวง','อัศวินองครักษ์','อัศวินเพลิง','จทัพศักดิ์สิทธิ์','นักดาบเงา','อัศวินรัตติกาล','จ้าวแห่งเพลิง','ผู้พิทักษ์เหมันต์','จ้าวแห่งพายุ','ผู้พิทักษ์สวรรค์','ตำนานนิรันดร์'];
var FEEL=[null,{i:'😫',l:'เหนื่อยมาก'},{i:'😔',l:'ค่อนข้างเหนื่อย'},{i:'😐',l:'พอสู้ได้'},{i:'😊',l:'ดีมาก'},{i:'🌟',l:'ยอดเยี่ยม!'}];
var HOF_INFO = { shark: { i: '🦈', t: 'บอสฉลามขาว', c: 'ว่ายฟรีสไตล์ต่ำกว่าเป้าหมาย' }, book:  { i: '📚', t: 'บอสหมอโหด', c: 'สอบได้คะแนน >= 90% (โดนยึดคืนถ้าคะแนนตก)' }, heart: { i: '❤️', t: 'บอสมุ่งมั่น', c: 'ได้ดาบทอง 7 วันรวด (โดนยึดคืนถ้าพลาด)' }, pole: { i: '🦒', t: 'บอสเสาไฟ', c: 'ส่วนสูงเพิ่มขึ้นทุกๆ 2 ซม.' }, shrimp: { i: '💪', t: 'บอสกุ้งแห้งเล่นเวท', c: 'น้ำหนักเพิ่มขึ้นทุกๆ 2 กก.' } };
var BOSS_DETAILS = { shark: { i: '🦈', t: 'บอสฉลามขาว', c: 'ว่าย Sprint ฟรีสไตล์ 25 เมตร เพื่อล้มบอสไปทีละด่าน!\n(ทีละ 1 วิ)', r: '🏆 ล้มบอสระดับ 25-21 วิ รับ 50 B-Coin |\nระดับ 20 วิลงไป รับ 200 B-Coin!', n: 'บอสจะโผล่มาให้สู้ทีละด่านเท่านั้น เริ่มต้นที่ด่าน 25 วิ!' }, book: { i: '📚', t: 'บอสหมอโหด', c: 'ทำคะแนนสอบวิชาใดก็ได้ให้ได้ตั้งแต่ 90% ขึ้นไป', r: '💎 +300 B-Coin และปลดล็อกตราคัมภีร์', n: 'ระวัง!\nถ้าสอบครั้งถัดไปได้น้อยกว่า 90% ตราจะหายไปนะ' }, heart: { i: '❤️', t: 'บอสมุ่งมั่น', c: 'ทำภารกิจรายวัน (โซน 1) ให้ครบทั้ง 3 ข้อ ติดต่อกัน 7 วัน (จันทร์-อาทิตย์)', r: '🌟 +18 B-Coin และปลดล็อกตราหัวใจเหล็กไหล (พร้อมกุญแจทอง 2 ดอก)', n: 'ถ้าพลาดแม้แต่วันเดียวในสัปดาห์ ตราจะโดนยึดคืนทันที' }, pole: { i: '🦒', t: 'บอสเสาไฟ', c: 'ส่วนสูงเพิ่มขึ้นทุกๆ 2 เซนติเมตร จากฐานความสูงเดิมของคุณ', r: '💰 +30 B-Coin (รับได้เรื่อยๆ ทุกครั้งที่สูงขึ้น)', n: 'ปัดเศษทศนิยมทิ้ง นับเฉพาะจำนวนเต็มที่เพิ่มขึ้น' }, shrimp: { i: '💪', t: 'บอสกุ้งแห้งเล่นเวท', c: 'น้ำหนักตัวเพิ่มขึ้นทุกๆ 2 กิโลกรัม จากฐานน้ำหนักเดิม (เน้นความแข็งแรง)', r: '🍖 +30 B-Coin (รับได้เรื่อยๆ เมื่อตัวหนาขึ้น)', n: 'กินอาหารที่มีประโยชน์เพื่อเอาชนะบอสตัวนี้!' } };

var S={ coins:0, todayCoins:0, todayGmCoins:0, w:'', h:'', exp:0, expMax:100, lv:1, curAv:0, selAv:0, phoenix:0, ticket:0, bcards:0, bcUsed:0, bcTotal: 0, bcList: [], keys:0, streak:['grey','grey','grey','grey','grey','grey','grey'], currentDayIndex: 0, lastSyncDate: null, quests:[false,false,false], pin:'', PIN:'2308', pending:null, submitted:false, gmSubmitted:false, isResubmit: false, feeling:3, illness:'ไม่มี', swimFr:'', swimBt:'', swimFg:'', swimBk:'', laps:'', achievement:'', specialCoin:0, gpa:'', score:'', weekKey:'', phWeekBought:0, foodWeekBought:0, monthBest:{fr:null,bt:null,fg:null,bk:null}, allBest:{fr:null,bt:null,fg:null,bk:null}, hof: { shark: false, book: false, heart: false }, bossTargets: { speed: 25, heightBase: 129, weightBase: 24 }, todayGacha: [], todayItemsUsed: [], bcList: [], gmBuffs: { jackpot: false, prophecy: '', buddy: false } };
var qcnt=0, chIdx=0;

// 🔊 เสียง 8-Bit
var actx;
function playTone(freq, type, duration, vol) {
  try {
    if(!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if(actx.state === 'suspended') actx.resume();
    var osc = actx.createOscillator(); var gain = actx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, actx.currentTime);
    gain.gain.setValueAtTime(vol, actx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + duration);
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
var SHEET_URL = "https://script.google.com/macros/s/AKfycbwq4bwjl6aH1B9csf7ETB_LLL-x8I9kjxtNOR9B4AjBIHRn4cGBN8tB2sfsyeSy9ueM2g/exec"; 

function sendToLine(msgType, msgContent) {
  if(!SHEET_URL || SHEET_URL.length < 10) return;
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ action: "LINE_ALERT", message: msgContent })
  });
}

function loadLocal() { var data = localStorage.getItem('bifrost_data'); if (data) Object.assign(S, JSON.parse(data)); if(S.keys === undefined) S.keys = 0; if(!S.todayItemsUsed) S.todayItemsUsed = []; }
function saveLocal() { localStorage.setItem('bifrost_data', JSON.stringify(S)); }

function setSkeleton(isLoading) {
    var targets = document.querySelectorAll('.skeleton-target');
    targets.forEach(el => {
        if(isLoading) el.classList.add('skeleton');
        else el.classList.remove('skeleton');
    });
}

function showProphecyIfAny() {
    if(S.gmBuffs && S.gmBuffs.prophecy && S.gmBuffs.prophecy !== '') {
        document.getElementById('prophecy-text').textContent = S.gmBuffs.prophecy;
        document.getElementById('prophecy-modal').style.display = 'flex';
        SFX.tada(); S.gmBuffs.prophecy = ''; saveLocal();
    }
}

function autoSyncDraft(e) {
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
    if (S.gmBuffs && S.gmBuffs.buddy) { S.gmBuffs.buddy = false; } 
    if(S.gmBuffs) S.gmBuffs.secretQuest = '';
    else { if (S.streak[S.currentDayIndex] !== 'gold' && S.streak[S.currentDayIndex] !== 'red') { S.streak[S.currentDayIndex] = 'red'; } }

    if(!SHEET_URL || SHEET_URL.length < 10) return;
    var payload = Object.assign({}, S, { syncDate: dateLabel });
    fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', body: JSON.stringify(payload) });

    S.currentDayIndex++;
    if (S.currentDayIndex > 6) { S.currentDayIndex = 0; S.streak = ['grey','grey','grey','grey','grey','grey','grey']; S.phWeekBought = 0; S.foodWeekBought = 0; }
    
    S.submitted = false; S.gmSubmitted = false; S.isResubmit = false;
    S.quests = [false, false, false];
    S.todayCoins = 0; S.todayGmCoins = 0; S.todayGacha = []; S.todayItemsUsed = [];
    S.laps = ''; S.swimFr = ''; S.swimBt = ''; S.swimFg = ''; S.swimBk = ''; S.score = ''; S.gpa = ''; S.illness = 'ไม่มี';

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
      var gmEarn = args.specialCoin || 0; S.coins += gmEarn; S.todayGmCoins = gmEarn; 
      if(!S.gmBuffs) S.gmBuffs = { jackpot: false, prophecy: '', buddy: false };
      if (args.jackpot) S.gmBuffs.jackpot = true;
      if (args.prophecy) S.gmBuffs.prophecy = args.prophecy;
      if (args.secretQuest !== undefined) { S.gmBuffs.secretQuest = args.secretQuest; }
      if (args.buddy) S.gmBuffs.buddy = true;
      var extra = [];
      if (args.addPhoenix) { S.phoenix++; extra.push('💧 น้ำตาฟีนิกซ์'); }
      if (args.addKey) { S.keys++; extra.push('🗝️ กุญแจทอง'); }
      if (args.addExp) { S.exp += 50; if(S.exp >= S.expMax) { S.lv++; S.exp -= S.expMax; } extra.push('⭐ 50 EXP'); }
      var logMsg = args.achievement; if(extra.length > 0) logMsg += (logMsg ? ' ' : '') + '(แถม: ' + extra.join(', ') + ')';
      S.achievement = logMsg; S.specialCoin = gmEarn; S.gmSubmitted = true; saveLocal(); res = S;
    }
    else if (fn === 'resetGm') { 
      S.coins = Math.max(0, S.coins - (S.todayGmCoins || 0));
      S.todayGmCoins = 0; S.achievement = ''; S.specialCoin = 0; S.gmSubmitted = false; saveLocal(); res = S;
    }
    else if (fn === 'buyItem') { 
      if (args === 'phoenix' && S.coins >= 15 && S.phWeekBought < 1 && S.phoenix < 2) { S.coins -= 15; S.phoenix++; S.phWeekBought++; } 
      else if (args === 'food' && S.coins >= 50 && S.foodWeekBought < 2) { S.coins -= 50; S.ticket++; S.foodWeekBought++; } saveLocal(); res = S; 
    } 
    else if (fn === 'usePhoenixItem') { 
      if(S.phoenix > 0) { S.phoenix--; S.streak[args] = 'gold'; if(!S.todayItemsUsed) S.todayItemsUsed = []; S.todayItemsUsed.push('💧 ใช้น้ำตาฟีนิกซ์ ชุบชีวิต Streak'); saveLocal(); } res = S;
    } 
    else if (fn === 'useBCard') { 
      if(S.bcards > 0) { S.bcards--; S.bcUsed++; if(!S.todayItemsUsed) S.todayItemsUsed = []; S.todayItemsUsed.push('🎫 แสดงการ์ด B-Card เรียกร้องรางวัล 1 ใบ'); saveLocal(); } res = S;
    } 
    else if (fn === 'exchangeBCard') { 
      var cost = parseInt(args);
      if(S.coins >= cost) { 
        S.coins -= cost; S.bcards++; S.bcTotal++; // 👈 รันเลขบัตรใบใหม่ตรงนี้
        if(!S.bcList) S.bcList = [];
        S.bcList.push({ amount: cost, date: new Date().toLocaleDateString('en-CA') });
        saveLocal(); 
      } 
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

function buildStreak(){ var days=['จ','อ','พ','พฤ','ศ','ส','อา'], ico={gold:'🗡️', red:'💀', grey:'○', now:'⏳'}, html=''; S.streak.forEach(function(s, i){ var status = s; if (i === S.currentDayIndex && s === 'grey') status = 'now'; html+='<div class="sd"><div class="sdl">'+days[i]+'</div><div class="fl '+status+'" data-si="'+i+'">'+ico[status]+'</div></div>'; }); var sg = document.getElementById('sg'); if(sg) sg.innerHTML=html; document.querySelectorAll('.fl').forEach(function(el){ el.addEventListener('click',function(){onFl(parseInt(el.getAttribute('data-si')));}); }); }
function onFl(i){ if(S.streak[i]!=='red')return; if(S.phoenix<=0){showToast('❌ น้ำตาฟีนิกซ์หมดแล้ว!');return;} var days=['จันทร์','อังคาร','พุธ','พฤหัส','ศุกร์','เสาร์','อาทิตย์']; cfmShow('💧','ใช้น้ำตาฟีนิกซ์?','ต้องการใช้น้ำตาฟีนิกซ์ 1 หยด\nเพื่อชุบชีวิต Streak วัน'+days[i]+'?',function(){ gasCall('usePhoenixItem',i,function(r){ applyData(r); S.streak[i]='gold'; buildStreak(); showToast('💧 Streak ฟื้นคืนแล้ว! 🔥'); 
  sendToLine("ITEM", "💧 แจ้งเตือน! ไบฟรอสใช้น้ำตาฟีนิกซ์ชุบชีวิต Streak วัน" + days[i]);
}); }); }

function tQ(n){ var i=n-1; S.quests[i]=!S.quests[i]; var c=document.getElementById('qc'+n), qi=document.getElementById('qi'+n); if(c) { c.classList.toggle('on',S.quests[i]); c.textContent=S.quests[i]?'✓':''; } if(qi) qi.classList.toggle('done',S.quests[i]); qcnt=S.quests.filter(Boolean).length; var qbar = document.getElementById('qbar'); if(qbar) qbar.innerHTML=qcnt===3?'<span class="qsuc">✦ ภารกิจพร้อมส่ง! ✦</span>':'ติ๊ก <b>'+qcnt+'</b>/3 ภารกิจ'; saveLocal(); }
function updateFeel(v){ S.feeling=parseInt(v);var f=FEEL[S.feeling]; var ico = document.getElementById('feel-ico'), lbl = document.getElementById('feel-lbl'), sl = document.getElementById('feel-sl'); if(ico) ico.textContent=f.i; if(lbl) lbl.textContent=f.l; var pct=(S.feeling-1)/4*100; if(sl) sl.style.background='linear-gradient(90deg,var(--gold) '+pct+'%,var(--bg2) '+pct+'%)'; }
function syncPin(){ for(var i=0;i<4;i++) { var pd = document.getElementById('pd'+i); if(pd) pd.classList.toggle('on',i<S.pin.length); } } function pp(n){if(S.pin.length<4){S.pin+=n;syncPin();}} function pb(){S.pin=S.pin.slice(0,-1);syncPin();} function clrPin(){S.pin='';syncPin();}
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

    var qd = [questData.q1, questData.q2, questData.q3].filter(Boolean).length;
    var lineMsg = S.isResubmit ? "🔄 [อัปเดตแก้ไข] รายงานประจำวัน 🔄\n\n" : "🛡️ [BIFROST] รายงานประจำวัน 🛡️\n\n";
    lineMsg += "📊 ภารกิจ: " + (qd===3 ? "✅ ทำครบ!" : "⚡ ทำได้ "+qd+"/3") + "\n";
    if(questData.illness && questData.illness !== 'ไม่มี') lineMsg += "🤒 สถานะ: " + questData.illness + "\n";

    var bStats = [];
    if(questData.w) bStats.push("น้ำหนัก "+questData.w+"kg"); if(questData.h) bStats.push("สูง "+questData.h+"cm");
    if(bStats.length) lineMsg += "⚖️ ร่างกาย: " + bStats.join(" | ") + "\n";
    if(questData.laps) lineMsg += "🏊 จำนวนรอบ: " + questData.laps + " รอบ\n";

    var swims = [];
    if(questData.swimFr) swims.push("Fr:"+questData.swimFr); if(questData.swimBt) swims.push("Bt:"+questData.swimBt);
    if(questData.swimFg) swims.push("Fg:"+questData.swimFg); if(questData.swimBk) swims.push("Bk:"+questData.swimBk);
    if(swims.length > 0) lineMsg += "⏱️ ว่ายน้ำ: " + swims.join(" | ") + " วิ\n";
    
    var earnCoin = r.totalCoinsEarned || 0;
    lineMsg += "\n💰 เหรียญที่ได้วันนี้: +" + earnCoin + " B-Coin\n";
    lineMsg += "📈 ยอดคงเหลือ: " + r.coins + " | Lv." + r.lv;

    sendToLine("DAILY_REPORT", lineMsg); 
    
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
  if(!checkPin()) return; 
  if(S.gmSubmitted) { showToast('❌ วันนี้รันคำสั่งไปแล้ว'); clrPin(); return; } 
  var gmData = { 
    achievement: document.getElementById('in-ac')?.value || '', 
    specialCoin: parseInt(document.getElementById('in-sp')?.value) || 0,
    jackpot: document.getElementById('gm-secret-jackpot')?.checked || false,
    prophecy: document.getElementById('gm-prophecy')?.value || '',
    secretQuest: document.getElementById('gm-secret-quest')?.value || '',
    buddy: document.getElementById('gm-buddy')?.checked || false,
    addPhoenix: document.querySelector('#gm-add-ph')?.parentElement.classList.contains('active') || false,
    addKey: document.querySelector('#gm-add-key')?.parentElement.classList.contains('active') || false,
    addExp: document.querySelector('#gm-add-exp')?.parentElement.classList.contains('active') || false
  };
  gasCall('submitGm', gmData, function(r){ 
    applyData(r); showToast('🎁 รันคำสั่งลับ GM เรียบร้อย!'); clrPin(); 
    document.querySelectorAll('.gm-item-sel').forEach(el => el.classList.remove('active'));
    if(document.getElementById('gm-secret-jackpot')) document.getElementById('gm-secret-jackpot').checked = false;
    if(document.getElementById('gm-prophecy')) document.getElementById('gm-prophecy').value = '';
    if(document.getElementById('gm-secret-quest')) document.getElementById('gm-secret-quest').value = '';
    if(document.getElementById('gm-buddy')) document.getElementById('gm-buddy').checked = false;
    document.getElementById('gm-modal').classList.remove('on');
  });
}
function doGmReset(){ if(!checkPin()) return; gasCall('resetGm', undefined, function(r){ applyData(r); ['in-ac', 'in-sp'].forEach(function(id){ var el = document.getElementById(id); if(el) el.value = ''; }); showToast('❌ ริบของคืนเรียบร้อย!'); clrPin(); }); }

function showBossRewards(bosses) { 
  var html = ''; 
  bosses.forEach(function(b) { html += '<div class="bm-item"><div class="bm-ico">'+(b.icon||'⚔️')+'</div><div class="bm-info"><div class="bm-name">'+b.title+'</div><div class="bm-desc">'+b.desc+'</div></div><div class="bm-coin">+'+b.coin+'</div></div>'; });
  var bList = document.getElementById('bm-list'); if(bList) bList.innerHTML = html; 
  SFX.boss(); var bOverlay = document.getElementById('boss-overlay'); if(bOverlay) bOverlay.classList.add('on');
  var bModal = document.querySelector('.boss-modal'); if(bModal) { bModal.classList.remove('boss-zoom'); void bModal.offsetWidth; bModal.classList.add('boss-zoom'); } 
}

function doGacha() {
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
      S.coins += res.val; S.todayCoins += res.val; S.todayGacha.push('👨‍🍳 สั่งเมนู: ' + input.value + ' (+'+res.val+' Coins)');
      sendToLine("ORDER", "👨‍🍳 ออเดอร์พิเศษจากไบฟรอส!\nเมนู: " + input.value + "\n(ได้รับจากการเปิดกาชา!)");
      saveLocal(); renderAll(); showToast('🍜 ส่งเมนูให้ปะป๊าเรียบร้อย! ได้รับ +5 B-Coin'); closeGacha(); 
    };
  } else {
    btn.onclick = function() { 
      if(res.type === 'coin') { S.coins += res.val; S.todayCoins += res.val; S.todayGacha.push(res.ico + ' หมุนได้ ' + res.ttl); } 
      else if(res.type === 'item') { S.phoenix++; S.todayGacha.push(res.ico + ' หมุนได้ น้ำตาฟีนิกซ์'); }
      else if(res.type === 'info') { S.coins += res.val; S.todayCoins += res.val; S.todayGacha.push(res.ico + ' ภารกิจ: ' + res.ttl + ' (+'+res.val+' Coins)'); }
      saveLocal(); renderAll(); closeGacha();
      var lineGachaMsg = res.rarity === 'LEGENDARY' ? "🏆 แจ็คพอตแตก!!\nไบฟรอสเปิดกล่องสมบัติได้รับ: " + res.ttl : "💎 ไบฟรอสเปิดกล่องสมบัติได้รับ: " + res.ttl;
      sendToLine("GACHA", lineGachaMsg + "\n(ยอดเงินล่าสุด: " + S.coins + " B-Coin)");
    };
    action.style.display = 'block'; btn.textContent = "รับรางวัล"; document.getElementById('gacha-close').style.display = 'none';
  }
  view.style.display = 'block';
}

function closeGacha() { document.getElementById('gacha-mov').classList.remove('on'); document.getElementById('gacha-light').classList.remove('on'); document.getElementById('gacha-mov').classList.remove('jackpot-active'); }

function updateLog(){ 
  var logEl = document.getElementById('log-txt'); if(!logEl) return; 
  var hasGacha = S.todayGacha && S.todayGacha.length > 0; var hasItems = S.todayItemsUsed && S.todayItemsUsed.length > 0;
  if(!S.submitted && !S.gmSubmitted && !hasGacha && !hasItems){ 
    logEl.innerHTML='<div style="text-align:center; padding:10px; color:var(--txt3);">ยังไม่มีข้อมูลของวันนี้<br>กรุณาส่งภารกิจที่หน้า Quest Board ก่อนนะ! 🗡️</div>'; return;
  } 
  
  var html = '<div style="font-size:12px; line-height:1.6;">';
  if(S.submitted) { 
    var qd = S.quests.filter(Boolean).length;
    if(qd === 3) html += '<div>✅ ทำภารกิจรายวัน: <span style="color:var(--gold); font-weight:bold;">ครบถ้วน (+6 Coins)</span></div>';
    else if(qd > 0) html += '<div>⚡ ทำภารกิจรายวัน: <span style="color:#ff9800;">'+qd+'/3 ข้อ</span></div>'; 
    else html += '<div>❌ ภารกิจรายวัน: ยังไม่ได้ทำ</div>';
    if(S.illness && S.illness !== 'ไม่มี') html += '<div>🤒 สถานะ: <span style="color:#ff4d4d; font-weight:bold;">'+S.illness+'</span></div>';
  } 
  if(S.gmSubmitted && S.specialCoin > 0) html += '<div>🎁 ของขวัญ GM: <span style="color:var(--gold); font-weight:bold;">+'+S.specialCoin+' Coins</span> ("'+S.achievement+'")</div>';
  if(S.submitted || hasItems || hasGacha) { 
    html += '<hr style="border:0; border-top:1px dashed var(--gbdr); margin:10px 0;">';
    if(hasItems) { 
      html += '<div>🎒 <b>การใช้ไอเทม/แลกบัตรวันนี้:</b></div>';
      S.todayItemsUsed.forEach(function(item) { html += '<div style="color:var(--txt2); margin-left:10px;">• ' + item + '</div>'; });
      html += '<hr style="border:0; border-top:1px dashed var(--gbdr); margin:10px 0;">';
    }
    if(hasGacha) { 
      html += '<div>💎 <b>ประวัติเปิดกล่องสมบัติ:</b></div>';
      S.todayGacha.forEach(function(g) { html += '<div style="color:var(--txt2); margin-left:10px;">✦ ' + g + '</div>'; });
      html += '<hr style="border:0; border-top:1px dashed var(--gbdr); margin:10px 0;">';
    }
    if(S.submitted) {
      var bodyHtml = '';
      if(S.w) { var wVal = parseFloat(S.w); var wTrend = wVal > S.bossTargets.weightBase ? ' <span style="color:#4caf50; font-size:10px; font-weight:bold;">(▲ +'+(wVal - S.bossTargets.weightBase).toFixed(1)+'kg)</span>' : ''; bodyHtml += 'น้ำหนัก '+S.w+' kg' + wTrend; }
      if(S.h) { var hVal = parseFloat(S.h); var hTrend = hVal > S.bossTargets.heightBase ? ' <span style="color:#4caf50; font-size:10px; font-weight:bold;">(▲ +'+(hVal - S.bossTargets.heightBase).toFixed(1)+'cm)</span>' : ''; if(bodyHtml !== '') bodyHtml += ' <span style="color:var(--txt3);">|</span> '; bodyHtml += 'ส่วนสูง '+S.h+' cm' + hTrend; }
      if(bodyHtml !== '') html += '<div>⚖️ <b>ร่างกาย:</b> ' + bodyHtml + '</div>';
      if(S.laps) html += '<div>🏊 <b>จำนวนรอบ:</b> <span style="color:#4fc3f7; font-weight:bold;">'+S.laps+' รอบ</span></div>';
      var swStyles = { swimFr: { l:'ฟรีสไตล์', k:'fr' }, swimBt: { l:'ผีเสื้อ', k:'bt' }, swimFg: { l:'กบ', k:'fg' }, swimBk: { l:'กรรเชียง', k:'bk' } }; var sw = [];
      for(var key in swStyles) { if(S[key]) { var time = parseFloat(S[key]); var best = S.allBest[swStyles[key].k]; var trend = ''; if(best && time <= best) { trend = ' <span style="color:#4caf50; font-size:10px; font-weight:bold;">(👑 สถิติใหม่!)</span>'; } else if (best) { trend = ' <span style="color:#ff9800; font-size:10px;">(ช้ากว่าสถิติ '+(time - best).toFixed(1)+'วิ)</span>'; } sw.push(swStyles[key].l + ' ' + S[key] + ' วิ' + trend); } }
      if(sw.length) { html += '<div>⏱️ <b>สถิติว่ายน้ำ:</b><br>'; sw.forEach(function(s) { html += '<div style="margin-left:15px; color:var(--txt2);">• ' + s + '</div>'; }); html += '</div>'; }
      if(S.feeling && FEEL[S.feeling]) html += '<div>'+FEEL[S.feeling].i+' <b>ความรู้สึก:</b> '+FEEL[S.feeling].l+'</div>';
      var ac = []; if(S.gpa) ac.push('GPA '+S.gpa); 
      if(S.score) { var scTrend = parseFloat(S.score) >= 90 ? ' <span style="color:#4caf50; font-size:10px; font-weight:bold;">(🌟 Rank S)</span>' : ''; ac.push('คะแนนสอบ '+S.score+'%' + scTrend); }
      if(ac.length) html += '<div>📚 <b>วิชาการ:</b> '+ac.join(' <span style="color:var(--txt3);">|</span> ')+'</div>';
    }
  } 
  html += '</div>'; logEl.innerHTML = html; 
}

function renderAll(){ 
  var cd = document.getElementById('coin-d'); if(cd) cd.textContent=S.coins; var td = document.getElementById('td-d'); if(td) td.textContent=S.todayCoins + (S.todayGmCoins||0); var shc = document.getElementById('sh-c'); if(shc) shc.textContent=S.coins; var wd = document.getElementById('dw'); if(wd) wd.textContent=S.w||'—'; var hd = document.getElementById('dh'); if(hd) hd.textContent=S.h||'—'; var lvt = document.getElementById('lv-txt'); if(lvt) lvt.textContent=S.lv>=100?'MAX':S.lv; var cav = document.getElementById('cur-av'); if(cav) cav.textContent=AV[S.curAv];
  var pct=S.lv>=100?100:(S.exp/S.expMax*100); var expf = document.getElementById('exp-f'); if(expf) expf.style.width=pct+'%'; var expt = document.getElementById('exp-txt'); if(expt) expt.textContent=S.lv>=100?'MAX':(S.exp+' / '+S.expMax+' EXP');
  if(!S.hof) S.hof = { shark: false, book: false, heart: false }; var hS = document.getElementById('hof-shark'); if(hS) hS.className = S.hof.shark ? 'tri on' : 'tri off'; var hB = document.getElementById('hof-book'); if(hB) hB.className = S.hof.book ? 'tri on' : 'tri off'; var hH = document.getElementById('hof-heart'); if(hH) hH.className = S.hof.heart ? 'tri on' : 'tri off';
  var bSub = document.getElementById('btn-submit'), bRes = document.getElementById('btn-reset'); if(bSub && bRes) { if(S.submitted) { bSub.style.display='none'; bRes.style.display='block'; } else { bSub.style.display='block'; bRes.style.display='none'; } } var bgSub = document.getElementById('btn-gm-submit'), bgRes = document.getElementById('btn-gm-reset'); if(bgSub && bgRes) { if(S.gmSubmitted) { bgSub.style.display='none'; bgRes.style.display='block'; } else { bgSub.style.display='block'; bgRes.style.display='none'; } } 
  var gkDisp = document.getElementById('gacha-key-display'); if(gkDisp) gkDisp.textContent = S.keys || 0;
  syncInv(); syncShopQuota(); syncBCard(); updateLog(); updateBestTable(); checkGachaLock(); 

  [1,2,3].forEach(function(n){ var c=document.getElementById('qc'+n), qi=document.getElementById('qi'+n); if(c) { c.classList.toggle('on',S.quests[n-1]); c.textContent=S.quests[n-1]?'✓':''; } if(qi) qi.classList.toggle('done',S.quests[n-1]); });
  qcnt=S.quests.filter(Boolean).length; var qbar = document.getElementById('qbar'); if(qbar) qbar.innerHTML=qcnt===3?'<span class="qsuc">✦ ภารกิจพร้อมส่ง! ✦</span>':'ติ๊ก <b>'+qcnt+'</b>/3 ภารกิจ';

updateHeroSpeech();
  updateGmStatus();
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
function syncInv(){ var invK = document.getElementById('inv-key'); if(invK) invK.textContent=S.keys||0; var invP = document.getElementById('inv-ph'); if(invP) invP.textContent=S.phoenix; var shP = document.getElementById('sh-ph'); if(shP) shP.textContent=S.phoenix; var invT = document.getElementById('inv-tk'); if(invT) invT.textContent=S.ticket; var shT = document.getElementById('sh-tk'); if(shT) shT.textContent=S.ticket; var invB = document.getElementById('inv-bc'); if(invB) invB.textContent=S.bcards; }
function syncShopQuota(){ var pQ = document.getElementById('ph-quota'); if(pQ) pQ.textContent='✅ โควต้าคงเหลือ: '+(1-S.phWeekBought)+'/1'; var fQ = document.getElementById('food-quota'); if(fQ) fQ.textContent='✅ โควต้าคงเหลือ: '+(2-S.foodWeekBought)+'/2'; }

function syncBCard(){ 
  var bcs = document.getElementById('bc-status'); var inputAmt = document.getElementById('in-bc-amount'); var btnB = document.getElementById('btn-bc');
  if(bcs) {
      if(S.coins >= 100) bcs.innerHTML='<span style="color:var(--grn);font-weight:700">✅ พร้อมแลก B-Card แล้ว!</span>';
      else bcs.innerHTML='ต้องการอีก '+Math.max(0,100-S.coins)+' Coins เพื่อการันตีขั้นต่ำ';
  }
  if(btnB) btnB.disabled = S.coins < 100; 
}

var toastTm; function showToast(m){ var t=document.getElementById('toast'); if(!t) return; t.textContent=m;t.classList.add('on'); clearTimeout(toastTm);toastTm=setTimeout(function(){t.classList.remove('on');},3200); }
function cfmShow(ico,ttl,msg,cb){ var ci = document.getElementById('ci'); if(ci) ci.textContent=ico; var ct2 = document.getElementById('ct2'); if(ct2) ct2.textContent=ttl; var cm = document.getElementById('cm'); if(cm) cm.textContent=msg; S.pending=cb; var cfm = document.getElementById('cfm'); if(cfm) cfm.classList.add('on'); }

function usePhoenix(){ if(S.phoenix<=0) showToast('❌ ไม่มีน้ำตาฟีนิกซ์ในคลัง'); else showToast('✅ กดใช้ที่ไอคอนรูปกะโหลก 💀 ในหน้า Streak ได้เลย!'); }
function useTicket(){ if(S.ticket<=0){showToast('❌ ไม่มีตั๋วเชฟทองคำ\nซื้อที่ร้านค้าก่อนนะ! 🛒');return;} cfmShow('🍜','สั่งอาหารพิเศษ?','(คงเหลือ: '+S.ticket+' ใบ)',function(){ S.ticket--; saveLocal(); syncInv(); var fdM = document.getElementById('fd-mov'); if(fdM) fdM.classList.add('on'); }); }
function useBcItem(){ if(S.bcards<=0){showToast('❌ ยังไม่มี B-Card ในคลัง');return;} cfmShow('🎫','แสดง B-Card?','⚠️ จะหักออก 1 ใบ หลังยืนยัน',function(){ gasCall('useBCard',undefined,function(r){applyData(r);openBcScreen();}); }); }
function buyPh(){ if(S.coins < 15){ showToast('❌ B-Coin ไม่พอ!'); return; } if(S.phWeekBought >= 1){ showToast('❌ หมดโควต้าสัปดาห์นี้แล้ว!'); return; } if(S.phoenix >= 2){ showToast('❌ คลังเต็มแล้ว!'); return; } cfmShow('💧','ซื้อน้ำตาฟีนิกซ์?','ราคา 15 B-Coin',function(){ gasCall('buyItem','phoenix',function(r){applyData(r);showToast('💧 ซื้อสำเร็จ!');}); }); }
function buyFood(){ if(S.coins < 50){ showToast('❌ B-Coin ไม่พอ!'); return; } if(S.foodWeekBought >= 2){ showToast('❌ หมดโควต้าสัปดาห์นี้แล้ว!'); return; } cfmShow('🍜','ซื้อน้ำยาแสนอร่อย?','ราคา 50 B-Coin',function(){ gasCall('buyItem','food',function(r){applyData(r);showToast('🍜 ซื้อสำเร็จ!');}); }); }

function confirmFd(){ 
  var fdM = document.getElementById('fd-mov');
  if(fdM) {
    var inputEl = fdM.querySelector('input') || fdM.querySelector('textarea');
    var menuText = (inputEl && inputEl.value.trim() !== '') ? inputEl.value : 'เมนูพิเศษ (ไม่ได้ระบุ)';
    if(!S.todayItemsUsed) S.todayItemsUsed = []; S.todayItemsUsed.push('👨‍🍳 สั่งเมนู: ' + menuText);
    if(!S.chefUsed) S.chefUsed = 0; S.chefUsed++;
    saveLocal(); renderAll();
    sendToLine("ORDER", "👨‍🍳 ออเดอร์พิเศษจากไบฟรอส!\nเมนู: " + menuText + "\n(กรุณาเตรียมความอร่อยให้พร้อม!)");
    if(inputEl) inputEl.value = '';
    fdM.classList.remove('on'); 
    showChefCard(menuText);
  }
}

function showChefCard(menuText) {
  var d = new Date(); var dateStr = d.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}); var serialStr = 'CHEF-' + String(S.chefUsed).padStart(4,'0');
  var cMenu = document.getElementById('chef-card-menu'); var cDate = document.getElementById('chef-card-date'); var cSerial = document.getElementById('chef-card-serial');
  if(cMenu) cMenu.textContent = menuText; if(cDate) cDate.textContent = dateStr; if(cSerial) cSerial.textContent = serialStr;
  var chefScreen = document.getElementById('chef-screen');
  if(chefScreen) { SFX.card(); chefScreen.style.display = 'flex'; var chefCard = chefScreen.children[1]; if(chefCard) { chefCard.classList.remove('card-slide-up'); void chefCard.offsetWidth; chefCard.classList.add('card-slide-up'); } }
}

function exchangeBCard(){ 
    var inputAmt = document.getElementById('in-bc-amount'); // ดึงค่าจากช่องกรอก [cite: 512]
    var amt = parseInt(inputAmt.value);
    
    if(isNaN(amt) || amt < 100) { showToast('❌ ต้องแลกขั้นต่ำ 100 B-Coin ขึ้นไป!'); return; }
    if(S.coins < amt) { showToast('❌ เหรียญไม่พอ! (มีแค่ ' + S.coins + ' เหรียญ)'); return; }
    
    cfmShow('🎫','สร้าง B-Card?','จะใช้เหรียญทั้งหมด ' + amt + ' B-Coin', function(){ 
        gasCall('exchangeBCard', amt, function(r){
            applyData(r); 
            if(inputAmt) inputAmt.value = ''; 
            showToast('🎫 สร้าง B-Card สำเร็จ!');
            
            if(!S.todayItemsUsed) S.todayItemsUsed = [];
            S.todayItemsUsed.push('🎫 แลก B-Card มูลค่า ' + amt + ' Coins');
            saveLocal(); renderAll();
            
            // ส่งแจ้งเตือนเข้า LINE [cite: 130]
            sendToLine("BCARD", "🎫 แจ้งเตือน! ไบฟรอสแลก B-Card 1 ใบ!\nมูลค่า: " + amt + " B-Coin\n(ยอดเงินล่าสุด: " + S.coins + " B-Coin)");
            openBcScreen(); // 👈 สั่งให้โชว์การ์ดทันที
        }); 
    });
}

function openAv(){ S.selAv=S.curAv; buildAg(); var avM = document.getElementById('av-mov'); if(avM) avM.classList.add('on'); }
function buildAg(){ var html=''; AV.forEach(function(em,i){ var reqLv = (i === 0) ? 1 : (i * 2) + 1; var un = S.lv >= reqLv; var sel = i === S.selAv; html += '<div class="ao '+(un?'u':'lk')+' '+(sel?'sel':'')+'" data-ai="'+i+'">'; html += '<div>'+em+'</div><div class="ao-l">'+AN[i]+'</div>'; if (!un) { html += '<div class="lko">🔒<span>Lv.'+reqLv+'</span></div>'; } html += '</div>'; }); var avg = document.getElementById('av-g'); if(avg) avg.innerHTML=html; document.querySelectorAll('.ao.u').forEach(function(el){ el.addEventListener('click',function(){ S.selAv=parseInt(el.getAttribute('data-ai')); document.querySelectorAll('.ao').forEach(function(e,j){ e.classList.toggle('sel',j===S.selAv); }); }); }); }

function openBcScreen(){ 
  var d=new Date(); 
  var bcd = document.getElementById('bc-date'); if(bcd) bcd.textContent=d.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}); 
  
  // 🌟 เปลี่ยนมาใช้ bcTotal เพื่อให้เลขไม่เป็น 0000
  var bcs = document.getElementById('bc-serial'); if(bcs) bcs.textContent='BIFROST-BCARD-'+String(S.bcTotal).padStart(4,'0');
  
  // 💰 ดึงมูลค่าล่าสุดที่เพิ่งแลกมาโชว์บนการ์ด [cite: 550]
  var valEl = document.getElementById('bc-value'); 
  var lastVal = (S.bcList && S.bcList.length > 0) ? S.bcList[S.bcList.length - 1].amount : 100; 
  if(valEl) valEl.textContent = lastVal;

  var scr = document.getElementById('bc-screen'); 
  if(scr) {
    SFX.card(); 
    scr.style.display='flex'; 
    var ticket = scr.querySelector('.ticket');
    if(ticket) { ticket.classList.remove('card-slide-up'); void ticket.offsetWidth; ticket.classList.add('card-slide-up'); } 
  }
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
  document.querySelectorAll('.pk[data-n]').forEach(function(el){ el.addEventListener('click', function(){ pp(el.getAttribute('data-n')); }); });
  a('pk-del', 'click', pb); a('pk-ok', 'click', checkPin); 
  a('btn-submit', 'click', doSubmit); a('btn-reset', 'click', doReset); a('btn-gm-submit', 'click', doGmSubmit); a('btn-gm-reset', 'click', doGmReset);
  a('inv-ph-row', 'click', usePhoenix); a('inv-tk-row', 'click', useTicket); a('inv-bc-row', 'click', useBcItem);
  a('sh-ph-btn', 'click', buyPh); a('sh-food-btn', 'click', buyFood); a('btn-bc', 'click', exchangeBCard);
  var fdm = document.getElementById('fd-mov'); if(fdm) fdm.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('on'); });
  a('btn-fd-confirm', 'click', confirmFd);
  a('cfm-yes', 'click', () => { var c = document.getElementById('cfm'); if(c) c.classList.remove('on'); if(S.pending){S.pending();S.pending=null;} });
  a('cfm-no', 'click', () => { var c = document.getElementById('cfm'); if(c) c.classList.remove('on'); S.pending=null; });
  a('bc-close-btn', 'click', () => { var scr = document.getElementById('bc-screen'); if(scr) scr.style.display='none'; });
  a('chef-close-btn', 'click', () => { var scr = document.getElementById('chef-screen'); if(scr) scr.style.display='none'; });
  a('btn-boss-claim', 'click', () => { SFX.coin(); var bo = document.getElementById('boss-overlay'); if(bo) bo.classList.remove('on'); goP('dashboard'); setChar(chForLevel(S.lv)); });
  document.addEventListener('visibilitychange', function() { if (document.visibilityState === 'visible') { fetchDraftFromCloud(); } });
  document.querySelectorAll('input').forEach(function(input) { input.addEventListener('blur', autoSyncDraft); });

  // 👑 ตรวจสอบ URL ว่ามี ?mode=admin หรือไม่
  var urlParams = new URLSearchParams(window.location.search);
  var isAdmin = urlParams.get('mode') === 'admin';

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

  // 🛠️ ทางเข้า DEV MODE สำหรับเทสแอป (กด 5 ครั้งที่ชื่อฮีโร่)
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
        showToast('🛠️ เปิดโหมดทดสอบ (DEV MODE) แล้ว!');
        testClicks = 0;
      }
      testTm = setTimeout(function(){ testClicks = 0; }, 1000);
    });
  }
}

// ==========================================
// 🛠️ DEV MODE FUNCTIONS
// ==========================================
window.devQuickComplete = function() { 
  var questData = { q1: true, q2: true, q3: true, feeling: 5, illness: 'ไม่มี' }; 
  gasCall('submitQuest', questData, function(r) { 
    applyData(r); 
    showToast('🎯 ทำภารกิจเสร็จสิ้นอัตโนมัติ!'); 
    goP('dashboard'); 
  }); 
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
  if (S.streak[S.currentDayIndex] !== 'gold' && S.streak[S.currentDayIndex] !== 'red') { S.streak[S.currentDayIndex] = 'red'; }
  if(SHEET_URL && SHEET_URL.length >= 10) {
      var payload = Object.assign({}, S, { syncDate: dateLabel });
      fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', body: JSON.stringify(payload) });
  }
  
  S.currentDayIndex++; 
  if (S.currentDayIndex > 6) { S.currentDayIndex = 0; S.streak = ['grey','grey','grey','grey','grey','grey','grey']; S.phWeekBought = 0; S.foodWeekBought = 0; showToast('✨ เริ่มต้นสัปดาห์ใหม่!'); } 
  
  S.submitted = false; S.gmSubmitted = false; S.isResubmit = false; S.quests = [false, false, false]; S.todayCoins = 0; S.todayGmCoins = 0; S.todayGacha = []; S.todayItemsUsed = []; S.lastSyncDate = new Date().toLocaleDateString('en-CA');
  [1,2,3].forEach(function(n){ var qc = document.getElementById('qc'+n); if(qc) { qc.classList.remove('on'); qc.textContent=''; } var qi = document.getElementById('qi'+n); if(qi) qi.classList.remove('done'); });
  qcnt = 0; var qbar = document.getElementById('qbar'); if(qbar) qbar.innerHTML = 'ติ๊ก <b>0</b>/3 ภารกิจ'; 
  
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

document.addEventListener('DOMContentLoaded',function(){ 
  loadLocal(); 
  window.addEventListener('online', () => { document.getElementById('offline-overlay').style.display = 'none'; showToast('🟢 สัญญาณอินเทอร์เน็ตกลับมาแล้ว!'); });
  window.addEventListener('offline', () => { document.getElementById('offline-overlay').style.display = 'flex'; SFX.error(); });
  if(!navigator.onLine) document.getElementById('offline-overlay').style.display = 'flex';

  // --- ระบบฉาก Intro สีขาวแบบใหม่ ---
  var vOverlay = document.getElementById('intro-overlay');
  function closeIntro() { 
    if(vOverlay) { 
      vOverlay.style.opacity = '0'; 
      setTimeout(() => { vOverlay.style.display='none'; showProphecyIfAny(); }, 800); 
    } 
  }
  if(vOverlay) {
    setTimeout(closeIntro, 2500); // โชว์ 2.5 วินาทีแล้วหายไป
  }
  // ------------------------------

  bindAll(); 
  gasCall('getHeroData', null, function(data) { 
    applyData(data); if (S.bossTargets && S.bossTargets.speed === 21) { S.bossTargets.speed = 25; saveLocal(); }
    setChar(chForLevel(S.lv)); processAutoNextDay();
  }); 
});

function fetchDraftFromCloud() {
  var todayStr = new Date().toLocaleDateString('en-CA');
  fetch(SHEET_URL + "?date=" + todayStr)
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
    setSt('st-buddy', buffs.buddy); 
}

// 🔓 ระบบปลดล็อกหีบสมบัติชั่วคราว (1 ชั่วโมง)
window.devTempUnlockChest = function() {
  // บวกเวลาไปอีก 1 ชั่วโมง (60 นาที * 60 วินาที * 1000 มิลลิวินาที)
  S.tempChestUnlockUntil = Date.now() + (60 * 60 * 1000); 
  saveLocal();
  renderAll(); // รีเฟรชหน้าจอให้แม่กุญแจหายไป
  showToast('🔓 ปลดล็อกหีบสมบัติชั่วคราว 1 ชั่วโมงเรียบร้อย!');
};