/* ══════════════════════════════════════════════════════════════════════════
   📚 CODE.GS — RPG BIFROST APPS SCRIPT BACKEND
   ══════════════════════════════════════════════════════════════════════════
   โครงสร้างไฟล์:

   §1  CONFIG                  — API_VERSION, SHEET_URL, LINE_TOKEN
   §2  doPost / doGet ROUTER  — Main HTTP entry points + error handling
   §3  TIMEZONE HELPERS        — bkkIsoDate_, bkkThaiLabel_, bkkDateTimeText_
   §4  DRAFT SYNC              — handleDraftSync, handleFetchDraft, normalizeDraftDate_
   §5  MAIN SUBMIT             — handleMainSync (FINAL_SUBMIT) + optimistic concurrency
   §6  CLOUD SAVE              — saveCloud / loadSave (in doPost/doGet)
   §7  EVENT LOG               — [v1.1.2] handleEventLog
   §8  LINE ALERTS             — handleLineAlert, buildLineAlertFlex_
   §9  ARCHIVE / STATS         — sheetRowsAsObjects_, normalizeStatsRow_, handleFetchArchive
   §10 ADMIN REPAIR            — handleAdminRepair (with allowed fields)
   §11 BACKDATE QUEST          — handleBackdateQuest
   §12 WALLET                  — handleWalletExchange, sendWalletLineFlex_
   §13 UTILITIES               — createJsonResponse, findColIndex_, etc.

   ══════════════════════════════════════════════════════════════════════════
   §1 CONFIG
   ══════════════════════════════════════════════════════════════════════════ */
// ══════════════════════════════════════════════════
// ⚙️ BIFROST API CONFIGURATION (ตั้งค่าระบบ)
// ══════════════════════════════════════════════════
const CONFIG = {
  API_VERSION: "1.1.4",
  DEV_MODE: false,
  DEV_APPS_SCRIPT_PROJECT_URL: "",
  SHEET_URL: "https://docs.google.com/spreadsheets/d/1PCWKJi-z1fE__8xIkfplmRqtgt0VZ-IfcFzt31VHxi4/edit?usp=sharing",
  LINE_TOKEN: "WZ0fMjM4UX7TLHU6jrsGRac0Jav4GBVgiXZqKeHQ5grkxmEBGsUjMGPL190gnypIVIe+s4wgKURiOd/cbcjV7lV0A5eVhSOGBci3cAlGubcVTysIqjvnkUl3G1iTq2tvkrfc1Q1hRANn0v2pute26wdB04t89/1O/w1cDnyilFU=",
  LINE_SEND_MODE: "broadcast", // "broadcast" = แจ้งทุกคนที่ add OA, "push" = ส่งหา LINE_TARGET_ID คนเดียว
  LINE_TARGET_ID: "U2af519b9feb8cd265cde00c13b3bdc9e",
  DISABLE_LINE_ALERTS: false
};

/* ══════════════════════════════════════════════════════════════════════════
   §2 doPost / doGet ROUTER
   ══════════════════════════════════════════════════════════════════════════ */
// ══════════════════════════════════════════════════
// 🚀 MAIN API ROUTER (ระบบแยกสายการทำงาน)
// ══════════════════════════════════════════════════
function doPost(e) {
  const lock = LockService.getScriptLock();
  var parsedData = null;

  try {
    lock.waitLock(10000); // 🛡️ รอรับคิวสูงสุด 10 วินาที ป้องกันข้อมูลชนกัน

    // 🛡️ [v1.1.1] แยก JSON parse error ออกจาก logic error เพื่อให้ frontend รู้ชัดและ retry ได้ถูก
    try {
      parsedData = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      console.error("[doPost] JSON parse failed", parseErr.toString(), "raw=", String(e.postData.contents).substring(0, 200));
      return createJsonResponse({
        result: "error",
        errorType: "parse",
        isRetryable: false,
        message: "ข้อมูลที่ส่งมาไม่ใช่ JSON ที่ถูกต้อง",
        error: parseErr.toString()
      });
    }
    const data = parsedData;
    if (data.action === "DAILY_REPORT") {
      return handleDailyReportSubmit(data);
    }

    if (data.action === "CLIENT_TRANSACTION") {
      return handleClientTransaction(data);
    }

    if (data.action === "WALLET_EXCHANGE") {
      return handleWalletExchange(data);
    }

    if (data.action === "WALLET_LINE_ALERT") {
      return handleWalletLineAlert(data);
    }

    if (data.action === "ADMIN_REPAIR") {
      return handleAdminRepair(data);
    }

    if (data.action === "BACKDATE_QUEST") {
      return handleBackdateQuest(data);
    }

    // 📝 [v1.1.2] รับ event log จาก frontend
    if (data.action === "EVENT_LOG") {
      return handleEventLog(data);
    }
  // 🌟 [ระบบอัปโหลดเซฟคลาวด์]
    if (data.action === 'saveCloud') {
      var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL); // 👈 เปลี่ยนมาชี้เป้า URL ตรงๆ
      var sheet = ss.getSheetByName("CloudSave");
      if (!sheet) { sheet = ss.insertSheet("CloudSave"); }
      var incoming = data.payload || {};
      var currentRaw = sheet.getRange("A1").getValue();
      var current = currentRaw ? JSON.parse(currentRaw) : {};
      var incomingRev = Number(incoming._revision || 0);
      var currentRev = Number(current._revision || 0);
      var incomingTime = Date.parse(incoming._clientUpdatedAt || incoming._serverUpdatedAt || "") || 0;
      var currentTime = Date.parse(current._clientUpdatedAt || current._serverUpdatedAt || "") || 0;
      var blockStaleSave = (currentRev > 0 && incomingRev < currentRev) || (incomingRev === currentRev && currentTime > 0 && incomingTime > 0 && incomingTime < currentTime);
      if (blockStaleSave) {
        return createJsonResponse({ result: "conflict", status: "Conflict", message: "CloudSave has newer revision", revision: currentRev, serverUpdatedAt: current._serverUpdatedAt, save: current });
      }
      incoming._revision = currentRev + 1;
      incoming._serverUpdatedAt = new Date().toISOString();
      sheet.getRange("A1").setValue(JSON.stringify(incoming));
      return createJsonResponse({ status: "Saved", revision: incoming._revision });
    }
    
    // 👉 1. โหมดส่งแจ้งเตือน LINE
    if (data.action === "LINE_ALERT") {
      return handleLineAlert(data.message, data.type);
    }
    
    // 👉 2. โหมดเซฟข้อมูลร่าง (Draft) ข้ามเครื่อง
    if (data.syncType === "DRAFT") {
      return handleDraftSync(data);
    }
    
    // 👉 3. โหมดบันทึกข้อมูลหลักตอนจบวัน (Final Submission)
    return handleMainSync(data);

  } catch(error) {
    // 🛡️ [v1.1.1] แยกประเภท error เพื่อให้ frontend ตัดสินใจ retry vs surrender
    var errStr = String(error && error.toString ? error.toString() : error);
    var errLower = errStr.toLowerCase();
    var isQuotaError = /quota|rate limit|too many/.test(errLower);
    var isNetworkError = /timeout|timed out|network|fetch|service unavailable|deadline/.test(errLower);
    var isLockError = /lock|locked/.test(errLower);
    var errorType = isQuotaError ? "quota" : (isNetworkError ? "network" : (isLockError ? "lock" : "logic"));
    var isRetryable = isQuotaError || isNetworkError || isLockError;
    console.error("[doPost ERROR]", JSON.stringify({
      errorType: errorType,
      message: errStr,
      action: parsedData && parsedData.action,
      syncType: parsedData && parsedData.syncType,
      isRetryable: isRetryable,
      time: new Date().toISOString()
    }));
    return createJsonResponse({
      result: "error",
      errorType: errorType,
      isRetryable: isRetryable,
      error: errStr,
      message: isRetryable ? "ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง" : "เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูล"
    });
  } finally {
    try { lock.releaseLock(); } catch (_) {} // 🛡️ คืนคิวให้คนต่อไปเสมอ (ห่อ try กัน lock ที่ไม่เคยจับ)
  }
}

function doGet(e) {
  if (e.parameter.action === "version") {
    return handleVersionCheck_();
  }
  if (e.parameter.action === "health") {
    return handleHealthCheck_();
  }
  if (e.parameter.action === "walletBalance") {
    return handleWalletBalance();
  }
  if (e.parameter.action === "fetchArchive") {
    return handleFetchArchive(e);
  }
  if (e.parameter.action === "fetchDraft" || e.parameter.date) {
    return handleFetchDraft(e);
  }
// 🌟 [ระบบโหลดเซฟคลาวด์]
  if (e.parameter.action === 'loadSave') {
    var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL); // 👈 เปลี่ยนมาชี้เป้า URL ตรงๆ
    var sheet = ss.getSheetByName("CloudSave");
    if (!sheet) return createJsonResponse({});
    var savedData = sheet.getRange("A1").getValue();
    return createJsonResponse(savedData ? JSON.parse(savedData) : {});
  }
}

// ══════════════════════════════════════════════════
// 📦 API CONTROLLERS (ฟังก์ชันจัดการแต่ละโหมด)
// ══════════════════════════════════════════════════

/* ══════════════════════════════════════════════════════════════════════════
   §3 TIMEZONE HELPERS
   ══════════════════════════════════════════════════════════════════════════ */
// 🌐 [v1.1.1] Timezone helpers — รวม Asia/Bangkok ใช้ทั่วระบบ
// เดิมใช้ Session.getScriptTimeZone() บางที่ + "Asia/Bangkok" hardcoded บางที่
// + browser local จาก frontend → date ใน Drafts/Main อาจไม่ตรงกัน
const BKK_TZ = "Asia/Bangkok";
function bkkIsoDate_(d) {
  return Utilities.formatDate(d || new Date(), BKK_TZ, "yyyy-MM-dd");
}
function bkkThaiLabel_(d) {
  // คืนรูปแบบ "3 พฤษภาคม 2569" ตาม locale TH ในเขตเวลา Bangkok
  var date = d || new Date();
  return date.toLocaleDateString("th-TH-u-ca-buddhist", { year: "numeric", month: "long", day: "numeric", timeZone: BKK_TZ });
}
function bkkDateTimeText_(d) {
  return Utilities.formatDate(d || new Date(), BKK_TZ, "dd/MM/yyyy HH:mm:ss");
}

/**
 * 🟢 ฟังก์ชัน: จัดการเซฟข้อมูลร่าง (Draft)
 */
function normalizeDraftDate_(value) {
  if (value instanceof Date) {
    return bkkIsoDate_(value);
  }
  return String(value || '').trim();
}

function handleDraftSync(data) {
  const ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  let draftSheet = ss.getSheetByName("Drafts") || ss.insertSheet("Drafts");
  
  if (draftSheet.getLastRow() === 0) {
    draftSheet.appendRow(["Date", "Data", "UpdatedAt", "Device"]);
  }
  
  const syncDate = normalizeDraftDate_(data.syncDate);
  const payload = data.payload || {};
  const updatedAt = payload._draftUpdatedAt || new Date().toISOString();
  const device = payload._draftDeviceName || "";
  const rows = draftSheet.getDataRange().getValues();
  let foundIdx = -1;
  
  for (let i = 1; i < rows.length; i++) {
    if (normalizeDraftDate_(rows[i][0]) === syncDate) { foundIdx = i + 1; break; }
  }
  
  if (foundIdx > 0) {
    draftSheet.getRange(foundIdx, 1, 1, 4).setValues([[syncDate, JSON.stringify(payload), updatedAt, device]]);
  } else {
    draftSheet.appendRow([syncDate, JSON.stringify(payload), updatedAt, device]);
  }
  
  return createJsonResponse({ result: "success", message: data.clearDraft ? "Draft Cleared" : "Draft Saved", updatedAt: updatedAt });
}

/**
 * 🟢 ฟังก์ชัน: จัดการบันทึกข้อมูลหลักลงแผ่น Current และ Archive
 */
/**
 * 🟢 ฟังก์ชัน: จัดการบันทึกข้อมูลหลักลงแผ่น Current และ Archive (แบบอัปเดตบรรทัดเดิมได้)
 */
/**
 * 🟢 ฟังก์ชัน: จัดการบันทึกข้อมูลหลักลงแผ่น Current และ Archive (แบบอัปเดตบรรทัดเดิมได้)
 */
/**
 * 🟢 ฟังก์ชัน: จัดการบันทึกข้อมูลหลักลงแผ่น Current และ Archive
 */
/**
 * 🟢 ฟังก์ชัน: จัดการบันทึกข้อมูลหลัก (เพิ่มคอลัมน์เหรียญวันนี้)
 */
function handleMainSync(data) {
  if (!data.syncDate) throw new Error("ข้อมูลไม่ครบถ้วน (Missing syncDate)");
  const ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);

  // 🛡️ [v1.1.1] Optimistic concurrency — กัน double submit ข้ามอุปกรณ์
  // ถ้าอีกเครื่องเพิ่ง submit ไปก่อนหน้า → CloudSave จะมี revision สูงกว่าที่ client คิด
  // กรณีนั้นต้องปฏิเสธ + ส่ง save ปัจจุบันกลับให้ client เอาไป merge แทนที่จะทับ
  if (data.syncType === "FINAL_SUBMIT") {
    var cs = ss.getSheetByName("CloudSave");
    if (cs) {
      var rawCs = cs.getRange("A1").getValue();
      if (rawCs) {
        try {
          var curCs = JSON.parse(rawCs);
          var serverRev = Number(curCs._revision || 0);
          var clientRev = Number(data._revision || 0);
          // ถ้า client มี revision น้อยกว่า server แสดงว่ามีคนชิงไปก่อน
          if (serverRev > 0 && clientRev > 0 && clientRev < serverRev) {
            return createJsonResponse({
              result: "conflict",
              errorType: "stale_revision",
              isRetryable: false,
              message: "อุปกรณ์อีกเครื่องส่งภารกิจวันนี้ไปก่อนแล้ว — โปรดโหลดข้อมูลใหม่",
              serverRevision: serverRev,
              clientRevision: clientRev,
              save: curCs
            });
          }
        } catch (revErr) {
          console.error("[handleMainSync] revision parse error", revErr.toString());
        }
      }
    }
  }

  const sheet = ss.getSheetByName("Main") || ss.getSheets()[0];
  let archiveSheet = ss.getSheetByName("Archive_Data") || ss.insertSheet("Archive_Data");
  
  // 🌟 อัปเดตหัวตาราง Archive ให้มี 13 คอลัมน์ (เพิ่ม "เหรียญวันนี้")
  if (archiveSheet.getLastRow() === 0) {
    archiveSheet.appendRow(["วันที่", "เหรียญวันนี้", "น้ำหนัก", "ส่วนสูง", "ฟรีสไตล์", "กบ", "กรรเชียง", "ผีเสื้อ", "คะแนนสอบ/GPA", "Level", "Exp", "Coin รวม", "ประวัติกิจกรรม"]);
  }
  
  if (sheet.getLastRow() > 1) {
    const firstRowDateStr = String(sheet.getRange(2, 1).getDisplayValue());
    const incomingDateStr = String(data.syncDate);
    const firstMonthYear = firstRowDateStr.split(" ").slice(1).join(" ");
    const incomingMonthYear = incomingDateStr.split(" ").slice(1).join(" ");
    if (firstMonthYear !== incomingMonthYear && firstMonthYear !== "") {
       const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
       const allValues = dataRange.getValues();
       archiveSheet.getRange(archiveSheet.getLastRow() + 1, 1, allValues.length, allValues[0].length).setValues(allValues);
       sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
  }

  // 💰 คำนวณเหรียญที่ได้ในวันนี้ (เหรียญเควส + เหรียญ GM)
  let totalToday = (data.todayCoins || 0) + (data.todayGmCoins || 0);

  let activities = "";
  if (data.todayGacha && data.todayGacha.length > 0) activities += "กล่องสมบัติ: " + data.todayGacha.join(", ");
  if (data.todayItemsUsed && data.todayItemsUsed.length > 0) activities += (activities ? " | " : "") + "ไอเทม: " + data.todayItemsUsed.join(", ");
  if (data.achievement) activities += (activities ? " | " : "") + "GM Gift: " + data.achievement;
  
  // 💾 จัดเตรียมข้อมูลใหม่ (รวม 13 คอลัมน์)
  const rowData = [
    data.syncDate, 
    totalToday, // 👈 คอลัมน์ใหม่ที่เพิ่มเข้ามา
    data.w || "-", data.h || "-", 
    data.swimFr || "-", data.swimFg || "-", data.swimBk || "-", data.swimBt || "-", 
    data.score || data.gpa || "-", 
    data.lv, data.exp, data.coins, 
    activities
  ];

  const rows = sheet.getDataRange().getDisplayValues();
  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.syncDate)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  if (data.syncType === "FINAL_SUBMIT") {
    updateCloudSaveFromFinalSubmit_(ss, data);
  }
  
  return createJsonResponse({ result: "success" });
}

function updateCloudSaveFromFinalSubmit_(ss, data) {
  var cloudSheet = ss.getSheetByName("CloudSave") || ss.insertSheet("CloudSave");
  var raw = cloudSheet.getRange("A1").getValue();
  var current = raw ? JSON.parse(raw) : {};
  var save = {};
  Object.keys(current).forEach(function(key) { save[key] = current[key]; });
  Object.keys(data).forEach(function(key) {
    if (key === "syncType" || key === "syncDate" || key === "action") return;
    save[key] = data[key];
  });
  save.submitted = true;
  save.draft = { _draftCleared: true, _draftUpdatedAt: new Date().toISOString(), _draftSubmitted: true };
  save._revision = Number(current._revision || data._revision || 0) + 1;
  save._serverUpdatedAt = new Date().toISOString();
  cloudSheet.getRange("A1").setValue(JSON.stringify(save));
}

/**
 * 🟢 ฟังก์ชัน: ดึงข้อมูลร่างกลับไปที่แอป (GET)
 */
function handleFetchDraft(e) {
  try {
    const ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
    const draftSheet = ss.getSheetByName("Drafts");
    if (!draftSheet) return createJsonResponse({});
    
    const dateReq = normalizeDraftDate_(e.parameter.date);
    const rows = draftSheet.getDataRange().getValues();
    
    for (let i = 1; i < rows.length; i++) {
      if (normalizeDraftDate_(rows[i][0]) === dateReq) {
        return ContentService.createTextOutput(rows[i][1] || "{}").setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return createJsonResponse({});
  } catch(error) {
    return createJsonResponse({});
  }
}

/**
 * 🟢 ฟังก์ชัน: ยิงแจ้งเตือนผ่าน LINE
 */
const LINE_ALERT_IMAGES = {
  DAILY_REPORT: "https://i.ibb.co/Rphbg9DH/1.jpg",
  BCARD: "https://i.ibb.co/Mkz1Q6Bm/2.jpg",
  GACHA: "https://i.ibb.co/HLjtkdW3/3.jpg",
  CHEF_TICKET: "https://i.ibb.co/NbWb8sY/4.jpg",
  POTION: "https://i.ibb.co/sr5dsdT/5.jpg",
  SECRET_QUEST: "https://i.ibb.co/0wjPpZy/06.jpg"
};

const LINE_ALERT_TITLES = {
  DAILY_REPORT: "BIFROST DAILY REPORT",
  BCARD: "BIFROST B-CARD",
  GACHA: "BIFROST JACKPOT",
  CHEF_TICKET: "GOLDEN CHEF TICKET",
  POTION: "SPECIAL FOOD ORDER",
  SECRET_QUEST: "BIFROST SECRET QUEST"
};

function getLineApiUrl_() {
  var mode = String(CONFIG.LINE_SEND_MODE || "push").toLowerCase();
  return mode === "broadcast" ? "https://api.line.me/v2/bot/message/broadcast" : "https://api.line.me/v2/bot/message/push";
}

function buildLinePayload_(messages) {
  var mode = String(CONFIG.LINE_SEND_MODE || "push").toLowerCase();
  var payload = { messages: messages };
  if (mode !== "broadcast") {
    var targetId = CONFIG.LINE_TARGET_ID || CONFIG.USER_ID || "";
    if (!targetId) throw new Error("LINE_TARGET_ID is required when LINE_SEND_MODE is push");
    payload.to = targetId;
  }
  return payload;
}
function handleLineAlert(msgText, msgType) {
  if (CONFIG.DISABLE_LINE_ALERTS) return createJsonResponse({ result: "skipped", message: "LINE alerts disabled" });
  const imageUrl = LINE_ALERT_IMAGES[msgType];
  const title = LINE_ALERT_TITLES[msgType] || "RPG BIFROST";
  const message = String(msgText || "BIFROST Alert");
  const lineMessage = imageUrl ? buildLineAlertFlex_(title, message, imageUrl) : { type: "text", text: message };
  var payload = buildLinePayload_([lineMessage]);
  const options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CONFIG.LINE_TOKEN
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const res = UrlFetchApp.fetch(getLineApiUrl_(), options);
    const code = res.getResponseCode();
    if (code < 200 || code >= 300) throw new Error("LINE HTTP " + code + ": " + res.getContentText());
    return createJsonResponse({ result: "success", message: "Flex Alert Sent", type: msgType || "TEXT" });
  } catch (error) {
    console.log("LINE Error: " + error);
    return createJsonResponse({ result: "error", error: error.toString() });
  }
}

function buildLineAlertFlex_(title, message, imageUrl) {
  return {
    type: "flex",
    altText: title,
    contents: {
      type: "bubble",
      size: "mega",
      hero: {
        type: "image",
        url: imageUrl,
        size: "full",
        aspectRatio: "1:1",
        aspectMode: "cover"
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        backgroundColor: "#1a1a2e",
        contents: [
          { type: "text", text: title, color: "#ffd700", weight: "bold", size: "sm", wrap: true },
          { type: "separator", color: "#ffd700", margin: "sm" },
          { type: "text", text: message, color: "#fff8df", size: "sm", wrap: true, margin: "md" }
        ]
      }
    }
  };
}

// ══════════════════════════════════════════════════
// 🛠️ UTILITIES (ฟังก์ชันช่วยเหลือ)
// ══════════════════════════════════════════════════

/**
 * 📦 ฟังก์ชันห่อข้อมูลเพื่อส่งกลับไปยังแอปให้ถูกต้องตามหลัก JSON
 */


function handleVersionCheck_() {
  return createJsonResponse({
    result: "success",
    appVersion: CONFIG.API_VERSION || "unknown",
    assetVersion: CONFIG.API_VERSION || "unknown",
    forceReload: true,
    updateNotes: [
      "ปรับระบบส่งรายงานใหม่: บังคับกรอกเฉพาะน้ำหนักและให้รางวัลจากฝั่ง Apps Script",
      "ส่งรายงานสำเร็จจะได้ 6 B-Coin, 35 EXP และเดินเส้นทางนักผจญภัย 1 ก้าว",
      "เพิ่ม Transaction_Log สำหรับตรวจประวัติเหรียญ EXP เลเวล Wallet GM ร้านค้า และกาชา",
      "ปรับเป็น Offline-first: เครื่องน้องเป็นข้อมูลหลัก ส่วน Sheet/LINE เป็นสำเนาประวัติ",
      "คงระบบ Pending Reward สำหรับกล่องสมบัติ พร้อมกันการปิดแอปเพื่อสุ่มใหม่"
    ],
    serverTime: new Date().toISOString()
  });
}
function handleHealthCheck_() {
  var sheetId = "";
  var match = String(CONFIG.SHEET_URL || "").match(/\/d\/([^\/]+)/);
  if (match) sheetId = match[1];
  var token = String(CONFIG.LINE_TOKEN || "");
  var checksum = 0;
  for (var i = 0; i < token.length; i++) checksum = (checksum + token.charCodeAt(i) * (i + 1)) % 1000000007;
  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var txSheet = ensureTransactionLogSheet_(ss);
  var cloudSheet = ss.getSheetByName("CloudSave");
  var cloud = {};
  if (cloudSheet) {
    var raw = cloudSheet.getRange("A1").getValue();
    cloud = raw ? JSON.parse(raw) : {};
  }
  return createJsonResponse({
    result: "success",
    apiVersion: CONFIG.API_VERSION || "unknown",
    devMode: !!CONFIG.DEV_MODE,
    offlinePrimary: true,
    lineAlertsDisabled: !!CONFIG.DISABLE_LINE_ALERTS,
    lineSendMode: CONFIG.LINE_SEND_MODE || "push",
    sheetId: sheetId,
    cloudRevision: Number(cloud._revision || 0),
    cloudUpdatedAt: cloud._serverUpdatedAt || cloud._clientUpdatedAt || "",
    cloudCoins: Number(cloud.coins || 0),
    pendingReward: cloud.pendingReward || null,
    transactionLogRows: Math.max(0, txSheet.getLastRow() - 1),
    tokenLength: token.length,
    tokenChecksum: checksum,
    serverTime: new Date().toISOString()
  });
}
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ensureTransactionLogSheet_(ss) {
  var sheet = ss.getSheetByName("Transaction_Log") || ss.insertSheet("Transaction_Log");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Time", "RequestId", "Action", "CoinDelta", "ExpDelta",
      "CoinBefore", "CoinAfter", "LvBefore", "LvAfter",
      "Balance", "Note", "Source", "ServerTime"
    ]);
  }
  return sheet;
}

function findTransactionByRequest_(ss, requestId, action) {
  if (!requestId) return null;
  var sheet = ss.getSheetByName("Transaction_Log");
  if (!sheet || sheet.getLastRow() < 2) return null;
  var rows = sheet.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][1]) === String(requestId) && (!action || String(rows[i][2]) === String(action))) {
      return {
        time: rows[i][0],
        requestId: rows[i][1],
        action: rows[i][2],
        coinDelta: Number(rows[i][3] || 0),
        expDelta: Number(rows[i][4] || 0),
        coinAfter: Number(rows[i][6] || rows[i][9] || 0),
        lvAfter: Number(rows[i][8] || 1),
        note: rows[i][10] || ""
      };
    }
  }
  return null;
}

function appendTransaction_(ss, tx) {
  var sheet = ensureTransactionLogSheet_(ss);
  var now = new Date();
  sheet.appendRow([
    tx.time || bkkDateTimeText_(now),
    tx.requestId || "",
    tx.action || "",
    Number(tx.coinDelta || 0),
    Number(tx.expDelta || 0),
    Number(tx.coinBefore || 0),
    Number(tx.coinAfter || 0),
    Number(tx.lvBefore || 1),
    Number(tx.lvAfter || 1),
    Number(tx.coinAfter || tx.balance || 0),
    tx.note || "",
    tx.source || "",
    now.toISOString()
  ]);
}

function handleClientTransaction(data) {
  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var requestId = String(data.requestId || "").trim();
  var action = String(data.txAction || data.type || "CLIENT_TRANSACTION").trim();
  var duplicate = findTransactionByRequest_(ss, requestId, action);
  if (duplicate) return createJsonResponse({ result: "success", duplicate: true, transaction: duplicate });
  appendTransaction_(ss, {
    requestId: requestId,
    action: action,
    coinDelta: Number(data.coinDelta || 0),
    expDelta: Number(data.expDelta || 0),
    coinBefore: Number(data.coinBefore || 0),
    coinAfter: Number(data.coinAfter || 0),
    lvBefore: Number(data.lvBefore || 1),
    lvAfter: Number(data.lvAfter || 1),
    note: String(data.note || "").substring(0, 500),
    source: data.source || data.deviceId || "web"
  });
  return createJsonResponse({ result: "success", requestId: requestId });
}

function addExpAndLevel_(save, expDelta) {
  var beforeLv = Number(save.lv || 1);
  var beforeExp = Number(save.exp || 0);
  var max = Number(save.expMax || 100);
  save.lv = beforeLv;
  save.exp = beforeExp + Number(expDelta || 0);
  if (save.lv >= 100) {
    save.lv = 100;
    save.exp = max;
    return;
  }
  while (save.exp >= max && save.lv < 100) {
    save.exp -= max;
    save.lv += 1;
  }
  if (save.lv >= 100) {
    save.lv = 100;
    save.exp = max;
  }
}

function handleDailyReportSubmit(data) {
  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var requestId = String(data.requestId || "").trim();
  var duplicate = findTransactionByRequest_(ss, requestId, "DAILY_REPORT");
  var cloudSheet = ss.getSheetByName("CloudSave") || ss.insertSheet("CloudSave");
  var raw = cloudSheet.getRange("A1").getValue();
  var save = (data.offlinePrimary && data.clientSaveBefore) ? data.clientSaveBefore : (raw ? JSON.parse(raw) : {});
  if (duplicate) {
    return createJsonResponse({ result: "success", duplicate: true, save: save, totalCoinsEarned: duplicate.coinDelta, transaction: duplicate });
  }

  var report = data.report || {};
  var weight = String(report.w || "").trim();
  if (!weight || !isFinite(Number(weight)) || Number(weight) <= 0) {
    return createJsonResponse({ result: "error", message: "กรุณากรอกน้ำหนักก่อนส่งรายงาน" });
  }

  var now = new Date();
  var isoDate = String(data.isoDate || bkkIsoDate_(now));
  var syncDate = String(data.syncDate || bkkThaiLabel_(now));
  if (!data.offlinePrimary && save.submitted === true && String(save.lastSyncDate || "") === isoDate) {
    return createJsonResponse({ result: "error", message: "วันนี้ส่งรายงานไปแล้ว", save: save });
  }

  if (!save.streak) save.streak = ["grey","grey","grey","grey","grey","grey","grey"];
  if (!save.hof) save.hof = { shark: false, book: false, heart: false };
  if (!save.bossTargets) save.bossTargets = { speed: 25, heightBase: 129, weightBase: 24 };
  if (!save.todayGacha) save.todayGacha = [];
  if (!save.todayItemsUsed) save.todayItemsUsed = [];
  if (!save.monthBest) save.monthBest = { fr:null, bt:null, fg:null, bk:null };
  if (!save.allBest) save.allBest = { fr:null, bt:null, fg:null, bk:null };

  var coinBefore = Number(save.coins || 0);
  var lvBefore = Number(save.lv || 1);
  var expBefore = Number(save.exp || 0);
  var earn = 6;
  var expGain = 35;
  var bossRewards = [];

  if (report.swimFr) {
    var fr = parseFloat(report.swimFr);
    var frInt = Math.floor(fr);
    var currentTarget = Number(save.bossTargets.speed || 25);
    if (isFinite(frInt) && frInt < currentTarget) {
      var rewardCoins = (currentTarget <= 20) ? 200 : 50;
      bossRewards.push({ title: "บอสฉลามขาว", coin: rewardCoins, desc: "ผ่านด่าน < " + currentTarget + " วิ! (เป้าหมายต่อไป: < " + (currentTarget - 1) + " วิ)", icon: "🦈" });
      earn += rewardCoins;
      save.bossTargets.speed = currentTarget - 1;
      if (currentTarget <= 20) save.hof.shark = true;
    }
  }
  if (report.score) {
    var sc = parseFloat(report.score);
    if (isFinite(sc) && sc >= 90) {
      bossRewards.push({ title: "บอสหมอโหด", coin: 300, desc: "สอบได้ Rank S (" + sc + "%)", icon: "📚" });
      earn += 300;
      save.hof.book = true;
    } else if (isFinite(sc)) {
      save.hof.book = false;
    }
  }
  if (report.h) {
    var hFloor = Math.floor(parseFloat(report.h));
    if (isFinite(hFloor) && hFloor >= Number(save.bossTargets.heightBase || 129) + 2) {
      var hSteps = Math.floor((hFloor - Number(save.bossTargets.heightBase || 129)) / 2);
      var hBonus = hSteps * 30;
      bossRewards.push({ title: "บอสเสาไฟ", coin: hBonus, desc: "ตัวสูงทะลุเป้า (+" + (hSteps * 2) + "cm)", icon: "🦒" });
      earn += hBonus;
      save.bossTargets.heightBase = Number(save.bossTargets.heightBase || 129) + (hSteps * 2);
    }
  }
  if (report.w) {
    var wFloor = Math.floor(parseFloat(report.w));
    if (isFinite(wFloor) && wFloor >= Number(save.bossTargets.weightBase || 24) + 2) {
      var wSteps = Math.floor((wFloor - Number(save.bossTargets.weightBase || 24)) / 2);
      var wBonus = wSteps * 30;
      bossRewards.push({ title: "บอสกุ้งแห้งเล่นเวท", coin: wBonus, desc: "ร่างกายแข็งแรง (+" + (wSteps * 2) + "kg)", icon: "💪" });
      earn += wBonus;
      save.bossTargets.weightBase = Number(save.bossTargets.weightBase || 24) + (wSteps * 2);
    }
  }

  var step = Number(save.currentDayIndex || 0);
  if (step < 0 || step > 6) step = 0;
  save.streak[step] = "gold";
  save.currentDayIndex = step + 1;
  if (save.currentDayIndex >= 7) {
    bossRewards.push({ title: "บอสมุ่งมั่น", coin: 18, desc: "ผจญภัยครบ 7 ครั้ง! (รับกุญแจทอง 2 ดอก)", icon: "❤️" });
    earn += 18;
    save.keys = Number(save.keys || 0) + 2;
    save.hof.heart = true;
    save.currentDayIndex = 0;
    save.streak = ["grey","grey","grey","grey","grey","grey","grey"];
  }

  var prevStats = save.lastStats || {};
  save.compareStats = JSON.parse(JSON.stringify(prevStats || {}));
  save.lastStats = JSON.parse(JSON.stringify(prevStats || {}));
  ["w","h","laps","swimFr","swimBt","swimFg","swimBk","gpa","score"].forEach(function(key) {
    if (report[key] !== undefined && report[key] !== "" && report[key] !== null) save.lastStats[key] = report[key];
  });

  var styles = { swimFr:"fr", swimBt:"bt", swimFg:"fg", swimBk:"bk" };
  Object.keys(styles).forEach(function(key) {
    if (!report[key]) return;
    var time = parseFloat(report[key]);
    var st = styles[key];
    if (!isFinite(time)) return;
    if (save.allBest[st] === null || save.allBest[st] === undefined || time < Number(save.allBest[st])) save.allBest[st] = time;
    if (save.monthBest[st] === null || save.monthBest[st] === undefined || time < Number(save.monthBest[st])) save.monthBest[st] = time;
  });

  save.coins = coinBefore + earn;
  save.todayCoins = Number(save.todayCoins || 0) + earn;
  addExpAndLevel_(save, expGain);
  save.w = report.w || save.w || "";
  if (report.h !== undefined && report.h !== "") save.h = report.h;
  if (report.laps !== undefined && report.laps !== "") save.laps = report.laps;
  if (report.swimFr !== undefined && report.swimFr !== "") save.swimFr = report.swimFr;
  if (report.swimBt !== undefined && report.swimBt !== "") save.swimBt = report.swimBt;
  if (report.swimFg !== undefined && report.swimFg !== "") save.swimFg = report.swimFg;
  if (report.swimBk !== undefined && report.swimBk !== "") save.swimBk = report.swimBk;
  if (report.gpa !== undefined && report.gpa !== "") save.gpa = report.gpa;
  if (report.score !== undefined && report.score !== "") save.score = report.score;
  save.feeling = report.feeling || save.feeling || 3;
  save.illness = report.illness || "ไม่มี";
  var todayStats = JSON.parse(JSON.stringify(report));
  todayStats.rewardCoins = earn;
  todayStats.expEarned = expGain;
  save.todayStats = todayStats;
  save.quests = [true, true, true];
  save.submitted = true;
  save.isResubmit = false;
  save.lastSyncDate = isoDate;
  save.draft = { _draftCleared: true, _draftUpdatedAt: now.toISOString(), _draftSubmitted: true };
  save._revision = Number(save._revision || 0) + 1;
  save._serverUpdatedAt = now.toISOString();
  cloudSheet.getRange("A1").setValue(JSON.stringify(save));

  appendTransaction_(ss, {
    requestId: requestId,
    action: "DAILY_REPORT",
    coinDelta: earn,
    expDelta: expGain,
    coinBefore: coinBefore,
    coinAfter: save.coins,
    lvBefore: lvBefore,
    lvAfter: save.lv,
    note: "Daily Report " + syncDate + " / weight " + report.w + " kg",
    source: data.deviceId || "web"
  });

  var totalToday = Number(save.todayCoins || 0) + Number(save.todayGmCoins || 0);
  var activities = "Daily Report: +" + earn + " Coins";
  if (save.todayGacha && save.todayGacha.length > 0) activities += " | กล่องสมบัติ: " + save.todayGacha.join(", ");
  if (save.todayItemsUsed && save.todayItemsUsed.length > 0) activities += " | ไอเทม: " + save.todayItemsUsed.join(", ");
  var rowData = [
    syncDate,
    totalToday,
    report.w || "-", report.h || "-",
    report.swimFr || "-", report.swimFg || "-", report.swimBk || "-", report.swimBt || "-",
    report.score || report.gpa || "-",
    save.lv || 1, save.exp || 0, save.coins,
    activities
  ];
  var mainSheet = ss.getSheetByName("Main") || ss.getSheets()[0];
  ensureArchiveHeader_(mainSheet);
  upsertArchiveRow_(mainSheet, rowData);

  return createJsonResponse({
    result: "success",
    save: save,
    totalCoinsEarned: earn,
    expEarned: expGain,
    bossRewards: bossRewards.length ? bossRewards : null,
    requestId: requestId,
    revision: save._revision
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 📝 [v1.1.2] EVENT LOG — รับ batch จาก frontend ลง EventLog sheet
// ═══════════════════════════════════════════════════════════════════════════
function handleEventLog(data) {
  var batch = Array.isArray(data.batch) ? data.batch : [];
  if (!batch.length) return createJsonResponse({ result: "success", count: 0 });
  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var sheet = ss.getSheetByName("EventLog") || ss.insertSheet("EventLog");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Time", "Version", "DevMode", "Category", "Data"]);
  }
  // จำกัดขนาด sheet ไม่ให้ใหญ่เกิน 10000 rows (rotate ถ้าเกิน)
  if (sheet.getLastRow() > 10000) {
    sheet.deleteRows(2, 5000); // ลบ row เก่าครึ่งหนึ่ง
  }
  var rows = batch.map(function(e) {
    return [
      e.ts || new Date().toISOString(),
      e.ver || "",
      !!e.dev,
      e.cat || "misc",
      JSON.stringify(e.data || {}).substring(0, 5000) // limit cell size
    ];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
  return createJsonResponse({ result: "success", count: rows.length });
}

// ใช้ทดสอบ LINE ผ่าน Apps Script ได้โดยตรง
function testLINE() {
  return handleLineAlert("🚀 ทดสอบระบบ Flex Message! ถ้าข้อความนี้เด้งพร้อมรูป แสดงว่า API ใหม่ทำงานปกติ", "DAILY_REPORT");
}

// 🛠️ โค้ดพิเศษ: ให้บอทตะโกนบอก Group ID
function debugReplyGroupId(e) {
  var event = JSON.parse(e.postData.contents).events[0];
  var replyToken = event.replyToken;
  var source = event.source;
  
  var targetId = "";
  if (source.type === "group") {
    targetId = source.groupId; // ถ้าพิมพ์ในกลุ่ม จะได้รหัสกลุ่ม (C...)
  } else {
    targetId = source.userId;  // ถ้าพิมพ์แชทส่วนตัว จะได้รหัสส่วนตัว (U...)
  }

  // ให้บอทตอบกลับไปบอกรหัสในแชทนั้นเลย!
  var payload = {
    "replyToken": replyToken,
    "messages": [{
      "type": "text",
      "text": "รหัส ID ของแชทนี้คือ:\n" + targetId
    }]
  };
  
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ใส่_CHANNEL_ACCESS_TOKEN_ตรงนี้ด้วยนะ" 
    },
    "payload": JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}


function sheetRowsAsObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getDisplayValues();
  var headers = values[0];
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) obj[headers[c] || ("col" + c)] = values[r][c];
    out.push(obj);
  }
  return out;
}

function pickStatsField_(row, names, index) {
  for (var i = 0; i < names.length; i++) {
    var key = names[i];
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  }
  var values = Object.keys(row).map(function(key) { return row[key]; });
  return values[index] !== undefined ? values[index] : "";
}

function normalizeStatsRow_(row) {
  return {
    date: pickStatsField_(row, ["date", "Date", "วันที่", "syncDate", "day"], 0),
    todayCoins: pickStatsField_(row, ["เหรียญวันนี้", "todayCoins", "coinsToday"], 1),
    w: pickStatsField_(row, ["w", "weight", "Weight", "น้ำหนัก"], 2),
    h: pickStatsField_(row, ["h", "height", "Height", "ส่วนสูง"], 3),
    fr: pickStatsField_(row, ["swimFr", "fr", "freestyle", "FreeStyle", "ฟรีสไตล์"], 4),
    fg: pickStatsField_(row, ["swimFg", "fg", "breaststroke", "Breaststroke", "กบ"], 5),
    bk: pickStatsField_(row, ["swimBk", "bk", "backstroke", "Backstroke", "กรรเชียง"], 6),
    bt: pickStatsField_(row, ["swimBt", "bt", "butterfly", "Butterfly", "ผีเสื้อ"], 7),
    score: pickStatsField_(row, ["score", "gpa", "คะแนนสอบ/GPA"], 8),
    lv: pickStatsField_(row, ["lv", "Level", "level"], 9),
    exp: pickStatsField_(row, ["exp", "Exp", "EXP"], 10),
    coins: pickStatsField_(row, ["coins", "Coin รวม", "B-Coin"], 11),
    activity: pickStatsField_(row, ["ประวัติกิจกรรม", "activity", "activities"], 12),
    source: row.source || ""
  };
}

function handleFetchArchive(e) {
  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var archiveSheet = ss.getSheetByName("Archive_Data");
  var mainSheet = ss.getSheetByName("Main") || ss.getSheets()[0];
  var rows = [];
  sheetRowsAsObjects_(archiveSheet).forEach(function(row) { row.source = "Archive_Data"; rows.push(normalizeStatsRow_(row)); });
  sheetRowsAsObjects_(mainSheet).forEach(function(row) { row.source = "Main"; rows.push(normalizeStatsRow_(row)); });
  rows.sort(function(a, b) { return archiveDateKey_(a.date) - archiveDateKey_(b.date); });
  return createJsonResponse({ result: "success", rows: rows });
}

/* ══════════════════════════════════════════════════════════════════════════
   §10 ADMIN REPAIR
   ══════════════════════════════════════════════════════════════════════════ */
function handleAdminRepair(data) {
  var pin = String(data.pin || "");
  var reason = String(data.reason || "").trim();
  if (!reason) return createJsonResponse({ result: "error", message: "กรุณาระบุเหตุผลการแก้ไข" });
  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var cloudSheet = ss.getSheetByName("CloudSave") || ss.insertSheet("CloudSave");
  var raw = cloudSheet.getRange("A1").getValue();
  var save = (data.offlinePrimary && data.clientSaveBefore) ? data.clientSaveBefore : (raw ? JSON.parse(raw) : {});
  var realPin = String(save.PIN || "2308");
  if (pin !== realPin) return createJsonResponse({ result: "error", message: "PIN ไม่ถูกต้อง" });
  var before = JSON.parse(JSON.stringify(save));
  var fields = data.fields || {};
  // 🛡️ [v1.1.1-hf4] เพิ่ม isResubmit ใน allowed — กรณี flag ค้างจาก state เก่า admin จะแก้ได้
  var allowed = { coins:true, todayCoins:true, todayGmCoins:true, todayCoinsSpent:true, lv:true, exp:true, keys:true, ticket:true, phoenix:true, bcards:true, bcCount:true, currentDayIndex:true, submitted:true, gmSubmitted:true, isResubmit:true, foodWeekBought:true, phWeekBought:true, w:true, h:true, swimFr:true, swimBt:true, swimFg:true, swimBk:true, laps:true, score:true, gpa:true, achievement:true, specialCoin:true, todayItemsUsed:true, todayGacha:true };
  Object.keys(fields).forEach(function(key) { if (allowed[key]) save[key] = fields[key]; });
  var nested = data.nested || {};
  if (nested.bossTargets) {
    if (!save.bossTargets) save.bossTargets = {};
    ["speed", "heightBase", "weightBase"].forEach(function(key) { if (nested.bossTargets[key] !== undefined) save.bossTargets[key] = nested.bossTargets[key]; });
  }
  if (nested.hof) {
    if (!save.hof) save.hof = {};
    ["shark", "book", "heart"].forEach(function(key) { if (nested.hof[key] !== undefined) save.hof[key] = !!nested.hof[key]; });
  }
  save._serverUpdatedAt = new Date().toISOString();
  save._revision = Number(save._revision || 0) + 1;
  cloudSheet.getRange("A1").setValue(JSON.stringify(save));
  var backupSheet = ss.getSheetByName("State_Backups") || ss.insertSheet("State_Backups");
  if (backupSheet.getLastRow() === 0) backupSheet.appendRow(["Time", "Reason", "BeforeJson", "AfterJson"]);
  var nowText = bkkDateTimeText_(new Date());
  backupSheet.appendRow([nowText, reason, JSON.stringify(before), JSON.stringify(save)]);
  var auditSheet = ss.getSheetByName("Admin_Audit_Log") || ss.insertSheet("Admin_Audit_Log");
  if (auditSheet.getLastRow() === 0) auditSheet.appendRow(["Time", "Reason", "Fields", "Nested", "Revision"]);
  auditSheet.appendRow([nowText, reason, JSON.stringify(fields), JSON.stringify(nested), save._revision]);
  var coinBefore = Number(before.coins || 0);
  var coinAfter = Number(save.coins || 0);
  var expBefore = Number(before.exp || 0);
  var expAfter = Number(save.exp || 0);
  var lvBefore = Number(before.lv || 1);
  var lvAfter = Number(save.lv || 1);
  if (coinBefore !== coinAfter || expBefore !== expAfter || lvBefore !== lvAfter) {
    appendTransaction_(ss, {
      requestId: "ADMIN-" + save._revision,
      action: "ADMIN_REPAIR",
      coinDelta: coinAfter - coinBefore,
      expDelta: expAfter - expBefore,
      coinBefore: coinBefore,
      coinAfter: coinAfter,
      lvBefore: lvBefore,
      lvAfter: lvAfter,
      note: reason,
      source: "gm-repair"
    });
  }
  return createJsonResponse({ result: "success", save: save, revision: save._revision });
}
function ensureArchiveHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["วันที่", "เหรียญวันนี้", "น้ำหนัก", "ส่วนสูง", "ฟรีสไตล์", "กบ", "กรรเชียง", "ผีเสื้อ", "คะแนนสอบ/GPA", "Level", "Exp", "Coin รวม", "ประวัติกิจกรรม"]);
  }
}

function thaiDateLabelFromIso_(isoDate) {
  var parts = String(isoDate || "").split("-");
  if (parts.length !== 3) return String(isoDate || "");
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  // 🌐 [v1.1.1] ใช้ Bangkok timezone เพื่อ consistent
  return bkkThaiLabel_(d);
}

function archiveDateKey_(value) {
  if (value instanceof Date) return value.getTime();
  var text = String(value || "").trim();
  var iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])).getTime();
  var th = text.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/);
  if (th) {
    var months = {"มกราคม":0,"กุมภาพันธ์":1,"มีนาคม":2,"เมษายน":3,"พฤษภาคม":4,"มิถุนายน":5,"กรกฎาคม":6,"สิงหาคม":7,"กันยายน":8,"ตุลาคม":9,"พฤศจิกายน":10,"ธันวาคม":11};
    var y = Number(th[3]);
    if (y > 2400) y -= 543;
    if (months[th[2]] !== undefined) return new Date(y, months[th[2]], Number(th[1])).getTime();
  }
  return 0;
}

function upsertArchiveRow_(sheet, rowData) {
  ensureArchiveHeader_(sheet);
  var rows = sheet.getDataRange().getDisplayValues();
  var wanted = String(rowData[0]);
  var rowIndex = -1;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === wanted) { rowIndex = i + 1; break; }
  }
  if (rowIndex > 0) sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  else sheet.appendRow(rowData);
  sortArchiveRowsByDate_(sheet);
}

function sortArchiveRowsByDate_(sheet) {
  if (!sheet || sheet.getLastRow() <= 2) return;
  var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  var values = range.getValues();
  values.sort(function(a, b) { return archiveDateKey_(a[0]) - archiveDateKey_(b[0]); });
  range.setValues(values);
}

function findArchiveDateRow_(sheet, dateLabel) {
  if (!sheet || sheet.getLastRow() < 2) return -1;
  var rows = sheet.getDataRange().getDisplayValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(dateLabel)) return i + 1;
  }
  return -1;
}

function upsertBackdateQuestRow_(ss, isoDate, rowData) {
  var dateLabel = String(rowData[0]);
  var mainSheet = ss.getSheetByName("Main") || ss.getSheets()[0];
  var archiveSheet = ss.getSheetByName("Archive_Data") || ss.insertSheet("Archive_Data");
  ensureArchiveHeader_(mainSheet);
  ensureArchiveHeader_(archiveSheet);

  var mainRow = findArchiveDateRow_(mainSheet, dateLabel);
  if (mainRow > 0) {
    mainSheet.getRange(mainRow, 1, 1, rowData.length).setValues([rowData]);
    sortArchiveRowsByDate_(mainSheet);
    return "Main";
  }

  var archiveRow = findArchiveDateRow_(archiveSheet, dateLabel);
  if (archiveRow > 0) {
    archiveSheet.getRange(archiveRow, 1, 1, rowData.length).setValues([rowData]);
    sortArchiveRowsByDate_(archiveSheet);
    return "Archive_Data";
  }

  var parts = String(isoDate).split("-");
  var now = new Date();
  var isCurrentMonth = parts.length === 3 && Number(parts[0]) === now.getFullYear() && Number(parts[1]) === now.getMonth() + 1;
  var target = isCurrentMonth ? mainSheet : archiveSheet;
  upsertArchiveRow_(target, rowData);
  return isCurrentMonth ? "Main" : "Archive_Data";
}
function handleBackdateQuest(data) {
  var pin = String(data.pin || "");
  var isoDate = String(data.date || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return createJsonResponse({ result: "error", message: "กรุณาเลือกวันที่ย้อนหลัง" });

  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var cloudSheet = ss.getSheetByName("CloudSave") || ss.insertSheet("CloudSave");
  var raw = cloudSheet.getRange("A1").getValue();
  var save = (data.offlinePrimary && data.clientSaveBefore) ? data.clientSaveBefore : (raw ? JSON.parse(raw) : {});
  var realPin = String(save.PIN || "2308");
  if (pin !== realPin) return createJsonResponse({ result: "error", message: "PIN ไม่ถูกต้อง" });

  var before = JSON.parse(JSON.stringify(save));
  var q1 = !!data.q1, q2 = !!data.q2, q3 = !!data.q3;
  var questCoins = (q1 ? 2 : 0) + (q2 ? 2 : 0) + (q3 ? 2 : 0);
  // 🛡️ [Audit-fix] ป้องกัน NaN และค่าติดลบจาก bonusCoins (เดิม: ส่ง "abc" → NaN, ส่ง -9999 → หักเหรียญ)
  var bonusRaw = Number(data.bonusCoins);
  var bonusCoins = (Number.isFinite(bonusRaw) && bonusRaw >= 0) ? Math.floor(bonusRaw) : 0;
  var totalCoins = questCoins + bonusCoins;
  var dateLabel = thaiDateLabelFromIso_(isoDate);
  var activities = [];
  activities.push("Backdate Quest: " + [q1 ? "กิน" : null, q2 ? "ฝึก" : null, q3 ? "ทำ" : null].filter(Boolean).join(", ") + " (+" + questCoins + " Coins)");
  if (bonusCoins) activities.push("โบนัสย้อนหลัง: +" + bonusCoins + " Coins");
  if (data.note) activities.push("หมายเหตุ: " + String(data.note));

  save.coins = Number(save.coins || 0) + totalCoins;
  if (data.w !== "" && data.w !== undefined) save.w = data.w;
  if (data.h !== "" && data.h !== undefined) save.h = data.h;
  if (data.laps !== "" && data.laps !== undefined) save.laps = data.laps;
  if (data.swimFr !== "" && data.swimFr !== undefined) save.swimFr = data.swimFr;
  if (data.swimBk !== "" && data.swimBk !== undefined) save.swimBk = data.swimBk;
  if (data.swimFg !== "" && data.swimFg !== undefined) save.swimFg = data.swimFg;
  if (data.swimBt !== "" && data.swimBt !== undefined) save.swimBt = data.swimBt;
  if (data.score !== "" && data.score !== undefined) save.score = data.score;
  if (!save.todayItemsUsed) save.todayItemsUsed = [];
  save.todayItemsUsed.push("📅 บันทึกย้อนหลัง " + dateLabel + " (+" + totalCoins + " B-Coin)");

  var streakAdvanced = false;
  var keysAwarded = 0;
  if (data.applyStreak && q1 && q2 && q3) {
    save.currentDayIndex = Number(save.currentDayIndex || 0) + 1;
    streakAdvanced = true;
    if (save.currentDayIndex >= 7) {
      save.currentDayIndex = 0;
      save.keys = Number(save.keys || 0) + 2;
      keysAwarded = 2;
    }
  }

  save._revision = Number(save._revision || 0) + 1;
  save._serverUpdatedAt = new Date().toISOString();
  cloudSheet.getRange("A1").setValue(JSON.stringify(save));

  var rowData = [
    dateLabel,
    totalCoins,
    data.w || "-", data.h || "-",
    data.swimFr || "-", data.swimFg || "-", data.swimBk || "-", data.swimBt || "-",
    data.score || data.gpa || "-",
    save.lv || 1, save.exp || 0, save.coins,
    activities.join(" | ")
  ];  var targetSheetName = upsertBackdateQuestRow_(ss, isoDate, rowData);

  var backupSheet = ss.getSheetByName("State_Backups") || ss.insertSheet("State_Backups");
  if (backupSheet.getLastRow() === 0) backupSheet.appendRow(["Time", "Reason", "BeforeJson", "AfterJson"]);
  var nowText = bkkDateTimeText_(new Date());
  backupSheet.appendRow([nowText, "Backdate Quest " + dateLabel, JSON.stringify(before), JSON.stringify(save)]);

  var auditSheet = ss.getSheetByName("Admin_Audit_Log") || ss.insertSheet("Admin_Audit_Log");
  if (auditSheet.getLastRow() === 0) auditSheet.appendRow(["Time", "Reason", "Fields", "Nested", "Revision"]);
  auditSheet.appendRow([nowText, "Backdate Quest", JSON.stringify(data), JSON.stringify({ streakAdvanced: streakAdvanced, keysAwarded: keysAwarded }), save._revision]);
  appendTransaction_(ss, {
    requestId: "BACKDATE-" + isoDate + "-" + save._revision,
    action: "BACKDATE_REPORT",
    coinDelta: totalCoins,
    expDelta: 0,
    coinBefore: Number(before.coins || 0),
    coinAfter: Number(save.coins || 0),
    lvBefore: Number(before.lv || 1),
    lvAfter: Number(save.lv || 1),
    note: "Backdate " + dateLabel + (data.note ? " / " + String(data.note) : ""),
    source: "gm-backdate"
  });

  return createJsonResponse({ result: "success", save: save, totalCoins: totalCoins, dateLabel: dateLabel, targetSheet: targetSheetName, streakAdvanced: streakAdvanced, keysAwarded: keysAwarded, revision: save._revision });
}
/* ══════════════════════════════════════════════════════════════════════════
   §12 WALLET
   ══════════════════════════════════════════════════════════════════════════ */
// ══════════════════════════════════════════════════
// 💳 BIFROST E-WALLET BACKEND
// ══════════════════════════════════════════════════
var WALLET_LINE_HERO_IMAGE_URL = "https://i.ibb.co/Mkz1Q6Bm/2.jpg";

function handleWalletBalance() {
  var save = getWalletSave_();
  return createJsonResponse({
    result: "success",
    coins: Number(save.coins || 0),
    lv: save.lv || 1,
    exp: save.exp || 0,
    curAv: save.curAv || 0,
    updatedAt: new Date().toISOString()
  });
}

function handleWalletExchange(data) {
  // 🛡️ [Audit-fix] ป้องกัน NaN/ค่าติดลบ — ก่อนหน้านี้ถ้า amount เป็น string ที่ parse ไม่ได้
  // จะได้ NaN, NaN < 1 = false → ผ่านเช็ก แล้ว save.coins - NaN = NaN → เซฟพัง
  var amountRaw = Number(data.amount);
  var amount = (Number.isFinite(amountRaw) && amountRaw > 0) ? Math.floor(amountRaw) : 0;
  var rateCoinRaw = Number(data.rateCoin);
  var rateCoin = (Number.isFinite(rateCoinRaw) && rateCoinRaw > 0) ? Math.floor(rateCoinRaw) : 100;
  var rateBahtRaw = Number(data.rateBaht);
  var rateBaht = (Number.isFinite(rateBahtRaw) && rateBahtRaw > 0) ? rateBahtRaw : 100;
  var pin = String(data.pin || "");
  var requestId = String(data.requestId || "").trim();

  if (amount < 1) {
    return createJsonResponse({ result: "error", message: "กรุณาใส่จำนวน B-Coin ที่ต้องการแลก (ต้องเป็นจำนวนเต็มบวก)" });
  }
  if (pin.length !== 4) {
    return createJsonResponse({ result: "error", message: "กรุณากรอก PIN 4 หลัก" });
  }

  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var cloudSheet = ss.getSheetByName("CloudSave") || ss.insertSheet("CloudSave");
  var raw = cloudSheet.getRange("A1").getValue();
  var save = (data.offlinePrimary && data.clientSaveBefore) ? data.clientSaveBefore : (raw ? JSON.parse(raw) : {});
  var realPin = "5918";
  var currentCoins = Number(save.coins || 0);

  if (pin !== realPin) {
    return createJsonResponse({ result: "error", message: "PIN ไม่ถูกต้อง" });
  }
  var existingTx = requestId ? findWalletTransactionByRequest_(ss, requestId, save) : null;
  if (existingTx) {
    return createJsonResponse({
      result: "success",
      duplicate: true,
      requestId: requestId,
      amount: existingTx.amount,
      baht: existingTx.baht,
      coins: existingTx.balance,
      date: existingTx.date,
      save: save
    });
  }
  if (currentCoins < amount) {
    return createJsonResponse({ result: "error", message: "B-Coin ไม่พอ มีอยู่ " + currentCoins + " เหรียญ" });
  }

  var baht = (amount / rateCoin) * rateBaht;
  var now = new Date();
  var dateText = bkkDateTimeText_(now);

  save.coins = currentCoins - amount;
  save.todayCoinsSpent = Number(save.todayCoinsSpent || 0) + amount;
  save._revision = Number(save._revision || 0) + 1;
  save._serverUpdatedAt = new Date().toISOString();
  if (!save.todayItemsUsed) save.todayItemsUsed = [];
  save.todayItemsUsed.push("E-Wallet แลกเงิน -" + amount + " B-Coin = " + baht + " บาท");
  if (requestId) {
    if (!save.walletExchangeIds) save.walletExchangeIds = [];
    if (save.walletExchangeIds.indexOf(requestId) === -1) save.walletExchangeIds.push(requestId);
  }

  cloudSheet.getRange("A1").setValue(JSON.stringify(save));
  appendWalletTransaction_(ss, dateText, amount, baht, save.coins, requestId);
  appendTransaction_(ss, {
    requestId: requestId,
    action: "WALLET_EXCHANGE",
    coinDelta: -amount,
    expDelta: 0,
    coinBefore: currentCoins,
    coinAfter: save.coins,
    lvBefore: save.lv || 1,
    lvAfter: save.lv || 1,
    note: "E-Wallet แลกเงิน " + amount + " B-Coin = " + baht + " บาท",
    source: "wallet"
  });
  updateTodayMainCoins_(ss, save.coins);
  sendWalletLineFlex_(amount, baht, save.coins, dateText);

  return createJsonResponse({
    result: "success",
    amount: amount,
    baht: baht,
    coins: save.coins,
    date: dateText,
    requestId: requestId,
    save: save
  });
}

function getWalletSave_() {
  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var sheet = ss.getSheetByName("CloudSave");
  if (!sheet) return {};
  var raw = sheet.getRange("A1").getValue();
  return raw ? JSON.parse(raw) : {};
}

function ensureWalletTransactionHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Date", "Type", "B-Coin", "Baht", "Balance", "RequestId"]);
    return;
  }
  if (String(sheet.getRange(1, 6).getValue() || "") !== "RequestId") sheet.getRange(1, 6).setValue("RequestId");
}

function findWalletTransactionByRequest_(ss, requestId, save) {
  var sheet = ss.getSheetByName("Wallet_Transactions");
  if (!sheet || !requestId) return null;
  ensureWalletTransactionHeader_(sheet);
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][5] || "") === requestId) {
      return { date: rows[i][0], amount: Number(rows[i][2] || 0), baht: Number(rows[i][3] || 0), balance: Number(rows[i][4] || save.coins || 0) };
    }
  }
  return null;
}

function appendWalletTransaction_(ss, dateText, amount, baht, balance, requestId) {
  var sheet = ss.getSheetByName("Wallet_Transactions") || ss.insertSheet("Wallet_Transactions");
  ensureWalletTransactionHeader_(sheet);
  sheet.appendRow([dateText, "EXCHANGE", amount, baht, balance, requestId || ""]);
}

// 🌐 [v1.1.1] Header-based column lookup — กันคอลัมน์เลื่อนเมื่อมีการเพิ่มคอลัมน์ใหม่
// เดิม: hardcode column index 12 ("Coin รวม") → ถ้ามีการแทรกคอลัมน์จะเขียนผิด field
// ใหม่: หาจาก header row โดยรับ candidate names หลายตัว (กันชื่อคอลัมน์ใน Sheet มี whitespace/รูปแบบแตกต่าง)
function findColIndex_(sheet, candidates) {
  if (!sheet || sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) return -1;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0] || [];
  var norm = function(s){ return String(s || "").replace(/\s+/g, "").toLowerCase(); };
  for (var c = 0; c < headers.length; c++) {
    var h = norm(headers[c]);
    for (var k = 0; k < candidates.length; k++) {
      if (h === norm(candidates[k])) return c + 1; // 1-based
    }
  }
  return -1;
}
function updateTodayMainCoins_(ss, balance) {
  var sheet = ss.getSheetByName("Main") || ss.getSheets()[0];
  if (!sheet || sheet.getLastRow() < 2) return;

  // 🌐 [v1.1.1] ใช้ Bangkok timezone เดิมเป็น browser local ของ Apps Script server (อาจไม่ตรงกับ TH date)
  var todayLabel = bkkThaiLabel_(new Date());
  var coinCol = findColIndex_(sheet, ["Coin รวม", "Coinรวม", "Total Coin", "Coins", "เหรียญรวม"]);
  if (coinCol < 1) coinCol = 12; // fallback ใช้ค่าเดิมถ้าไม่เจอ header
  var rows = sheet.getDataRange().getDisplayValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(todayLabel)) {
      sheet.getRange(i + 1, coinCol).setValue(balance);
      return;
    }
  }
}

function sendWalletLineFlex_(amount, baht, balance, dateText) {
  if (CONFIG.DISABLE_LINE_ALERTS) return;
  var flex = {
    type: "flex",
    altText: "BIFROST E-Wallet แลกเงินสำเร็จ",
    contents: {
      type: "bubble",
      size: "mega",
      hero: {
        type: "image",
        url: WALLET_LINE_HERO_IMAGE_URL,
        size: "full",
        aspectRatio: "1:1",
        aspectMode: "cover"
      },
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#1f4f75",
        paddingAll: "18px",
        contents: [
          { type: "text", text: "BIFROST E-WALLET", color: "#f5d77b", weight: "bold", size: "sm" },
          { type: "text", text: "แลกเงินสำเร็จ", color: "#ffffff", weight: "bold", size: "xl", margin: "sm" }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          walletFlexRow_("ใช้เหรียญ", amount + " B-Coin"),
          walletFlexRow_("ได้รับ", baht + " บาท"),
          walletFlexRow_("คงเหลือ", balance + " B-Coin"),
          walletFlexRow_("เวลา", dateText)
        ]
      }
    }
  };

  var payload = buildLinePayload_([flex]);

  var options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CONFIG.LINE_TOKEN
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  try {
    var res = UrlFetchApp.fetch(getLineApiUrl_(), options);
    var code = res.getResponseCode();
    if (code < 200 || code >= 300) console.log("Wallet LINE Error: HTTP " + code + ": " + res.getContentText());
  } catch (error) {
    console.log("Wallet LINE Error: " + error);
  }
}

function handleWalletLineAlert(data) {
  var amount = Number(data.amount || 0);
  var baht = Number(data.baht || 0);
  var balance = Number(data.balance || data.coins || 0);
  var dateText = data.date || bkkDateTimeText_(new Date());
  sendWalletLineFlex_(amount, baht, balance, dateText);
  return createJsonResponse({ result: "success", message: "Wallet LINE Flex sent" });
}

function walletFlexRow_(label, value) {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      { type: "text", text: label, color: "#777777", size: "sm", flex: 2 },
      { type: "text", text: String(value), color: "#222222", size: "sm", weight: "bold", align: "end", flex: 3 }
    ]
  };
}


