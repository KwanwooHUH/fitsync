const admin = require('firebase-admin');

// 깃허브 시크릿(보안 환경변수)에서 파이어베이스 권한 키를 가져옵니다.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const messaging = admin.messaging();

async function sendDailyReminders() {
  // 1. 내일 날짜 계산 (예: "2026-06-14")
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  console.log(`[조회 시작] ${tomorrowStr} 날짜의 예약을 조회합니다.`);

  // 2. 내일 날짜로 확정(confirmed)된 세션 리스트 추출
  const resSnapshot = await db.collection("reservations")
    .where("date", "==", tomorrowStr)
    .where("status", "==", "confirmed")
    .get();

  if (resSnapshot.empty) {
    console.log("내일 배정된 수업 세션이 존재하지 않습니다.");
    return;
  }

  // 3. 루프를 돌며 각 유저의 디바이스 토큰으로 푸시 전송
  for (const doc of resSnapshot.docs) {
    const reservation = doc.data();
    const memberUid = reservation.uid;
    const hour = reservation.hour;

    const userDoc = await db.collection("users").doc(memberUid).get();
    if (userDoc.exists && userDoc.data().fcmToken) {
      const token = userDoc.data().fcmToken;

      try {
        await messaging.send({
          token: token,
          notification: {
            title: "🏋️ FitSync 세션 리마인드",
            body: `내일 ${hour}시에 PT 수업이 예약되어 있습니다. 늦지 않게 출석해 주세요!`
          }
        });
        console.log(`알림 발송 성공 -> 유저 UID: ${memberUid}`);
      } catch (err) {
        console.error(`알림 발송 실패 -> 유저 UID: ${memberUid}`, err);
      }
    }
  }
}

sendDailyReminders()
  .then(() => console.log("[완료] 모든 예약자 알림 처리가 끝났습니다."))
  .catch(err => console.error("[에러 발생]", err));