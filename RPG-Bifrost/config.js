window.BIFROST_CONFIG = {
  APP_VERSION: "1.1.0",
  DEV_MODE: false,
  API_URL: "https://script.google.com/macros/s/AKfycbzhZ4vnKvSMhxay6Wz2Ur86cI3bBXhel3ms_v9yH27eEKT9m8M4QmcMFypts59iwXst/exec",
  UPDATE_NOTES: [
    "เพิ่มระบบ Pending Reward สำหรับกล่องสมบัติ: ถ้าแอปปิดกลางทาง รางวัลเดิมจะกลับมาให้รับต่อ ไม่สุ่มใหม่",
    "เพิ่มระบบกันโกงกาชา: เมื่อกดเปิดกล่องแล้วจะหักกุญแจและล็อกรางวัลทันที",
    "รวมเลขเวอร์ชันและ API URL ฝั่งหน้าเว็บไว้ใน config.js",
    "เพิ่ม GM Health Check สำหรับตรวจ Apps Script, Sheet, LINE, CloudSave และ Retry Queue",
    "เพิ่ม Retry Queue สำหรับรายการสำคัญ เช่น CloudSave, Draft, LINE Alert, Archive และ Wallet",
    "เพิ่ม Deploy Checklist เพื่อช่วยเช็กก่อนปล่อยเวอร์ชันจริง"
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
