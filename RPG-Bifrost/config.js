window.BIFROST_CONFIG = {
  APP_VERSION: "1.1.4",
  OFFLINE_PRIMARY: true,
  DEV_MODE: false,
  API_URL: "https://script.google.com/macros/s/AKfycbzhZ4vnKvSMhxay6Wz2Ur86cI3bBXhel3ms_v9yH27eEKT9m8M4QmcMFypts59iwXst/exec",
  UPDATE_NOTES: [
    "ปรับระบบส่งรายงานใหม่: บังคับกรอกเฉพาะน้ำหนัก ส่วนสูง/ว่ายน้ำ/ความรู้สึก/วิชาการกรอกหรือเว้นว่างได้",
    "ส่งรายงานสำเร็จจะได้รับ 6 B-Coin, 35 EXP และเดินเส้นทางนักผจญภัย 1 ก้าว",
    "ย้ายการให้รางวัลหลักไปคำนวณฝั่ง Apps Script เพื่อลดปัญหาเหรียญ/เลเวลเพี้ยนข้ามอุปกรณ์",
    "เพิ่ม Sheet ใหม่ชื่อ Transaction_Log สำหรับตรวจประวัติการเปลี่ยนเหรียญ EXP เลเวล และรายการสำคัญ",
    "เพิ่ม transaction audit สำหรับส่งรายงาน, Wallet, GM, ร้านค้า และกาชา",
    "ปรับปุ่มส่งรายงานให้ขึ้นเฉพาะเมื่อกรอกน้ำหนักแล้ว และแสดงสถานะกำลังส่งข้อมูลเพื่อกันกดซ้ำ",
    "ปรับเป็น Offline-first: เครื่องน้องเป็นข้อมูลหลัก ส่วน Sheet/LINE เป็นสำเนาประวัติ",
    "ปิดการโหลด CloudSave/Draft กลับมาทับข้อมูลในเครื่อง เพื่อลดปัญหาเหรียญหรือสถิติย้อนค่า",
    "แก้ข้อความอัปเดตเวอร์ชันให้เป็นภาษาไทยอ่านได้ตามปกติ"
  ],
  DEPLOY_CHECKLIST: [
    "ตรวจเลข APP_VERSION ใน config.js และ API_VERSION ใน code.gs ให้ตรงกันก่อนปล่อยจริง",
    "ตรวจ index.html ว่า style.css/script.js/config.js ใช้ cache busting ตามเวอร์ชันล่าสุด",
    "อัปโหลด code.gs ไป Apps Script",
    "Deploy Apps Script เป็น Web app เวอร์ชันใหม่",
    "เปิด ?action=health เพื่อตรวจ Backend, Sheet, LINE และ Transaction_Log",
    "เปิดแอปแล้วเช็กเลขเวอร์ชันบนหน้าจอ",
    "ทดสอบส่งรายงานด้วยน้ำหนักอย่างเดียว แล้วตรวจ Local Save/Main/Transaction_Log",
    "ทดสอบ LINE Flex Message ด้วย testLINE()",
    "ทดสอบ Wallet ถ้ามีการแก้ระบบเงิน",
    "สำรองไฟล์ก่อนเริ่มแก้รอบถัดไป"
  ]
};
