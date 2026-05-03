window.BIFROST_CONFIG = {
  APP_VERSION: "1.1.1",
  DEV_MODE: false,
  API_URL: "https://script.google.com/macros/s/AKfycbzhZ4vnKvSMhxay6Wz2Ur86cI3bBXhel3ms_v9yH27eEKT9m8M4QmcMFypts59iwXst/exec",
  UPDATE_NOTES: [
    "🛡️ แก้บัค Daily Adventure Log แสดงน้ำหนักผิด: ตอนยังไม่ส่งภารกิจ จะแสดงค่าที่กรอกพร้อมแท็ก (รอส่ง) แทนค่าเก่าจาก lastStats",
    "🛡️ ป้องกัน NaN/ค่าติดลบใน Wallet Exchange และ Backdate Quest (เดิมส่ง 'abc' หรือ -9999 จะทำเซฟพัง)",
    "⚡ Auto Save Draft (debounce 1 วินาที): ลด network call ขณะพิมพ์ค่าในฟอร์ม",
    "⚡ Validate ฟอร์มก่อนส่งภารกิจ (น้ำหนัก/ส่วนสูง/GPA/คะแนน) ก่อน gasCall",
    "⚡ จับ unhandled promise rejection แจ้ง toast แทนล้มเงียบ",
    "🌙 Service Worker: รองรับ offline mode + cache static assets",
    "🌐 doPost error handling แยกประเภท (parse / quota / network / logic) + log",
    "🌐 Timezone helper Asia/Bangkok ใช้ทั่วระบบ ลด date mismatch ระหว่าง Drafts/Main",
    "🌐 Header-based column lookup ใน Sheet กันคอลัมน์เลื่อน",
    "🌐 Optimistic concurrency check ใน CloudSave/submitQuest กัน double submit ข้ามอุปกรณ์",
    "🌐 ProcessAutoNextDay เปลี่ยนเป็น Promise chain รอ archive แต่ละวันสำเร็จก่อน reset",
    "🧹 ลบ UTF-8 BOM จาก manifest.json"
  ],
  DEPLOY_CHECKLIST: [
    "เปลี่ยน APP_VERSION ใน config.js และ API_VERSION ใน code.gs ให้ตรงกัน",
    "ตรวจ index.html ว่า style.css/script.js/config.js ใช้ ?v= เวอร์ชันใหม่",
    "อัปโหลด code.gs ไป Apps Script",
    "Deploy Apps Script เป็น Web app เวอร์ชันใหม่",
    "เปิด ?action=health เพื่อตรวจ backend",
    "เปิดแอปแล้วเช็กเลขเวอร์ชันบนหน้าจอ",
    "ทดสอบส่งภารกิจและดูว่า CloudSave/Sheet อัปเดต",
    "ทดสอบ LINE Flex Message ด้วย testLINE()",
    "ทดสอบ Wallet ถ้ามีการแก้ระบบเงิน",
    "สำรองไฟล์ก่อนเริ่มแก้รอบถัดไป"
  ]
};
