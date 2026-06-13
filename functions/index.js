const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.scheduledReservationReminder = functions.pubsub
  .schedule("0 10 * * *")
  .timeZone("Asia/Seoul")
  .onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 내일 날짜로 확정(confirmed)된 세션 리스트 추출
    const resSnapshot = await admin.firestore().collection("reservations")
      .where("date", "==", tomorrowStr)
      .where("status", "==", "confirmed")
      .get();

    if (resSnapshot.empty) return null;

    const promises = [];
    resSnapshot.forEach((doc) => {
      const reservation = doc.data();
      const memberUid = reservation.uid;

      const sendPromise = admin.firestore().collection("users").doc(memberUid).get()
        .then(async (userDoc) => {
          if (userDoc.exists && userDoc.data().fcmToken) {
            const token = userDoc.data().fcmToken;
            const hour = reservation.hour;

            return admin.messaging().send({
              token: token,
              notification: {
                title: "🏋️ FitSync 세션 리마인드",
                body: `내일 ${hour}시에 PT 수업이 예약되어 있습니다. 늦지 않게 출석해 주세요!`
              }
            });
          }
          return null;
        });
      promises.push(sendPromise);
    });

    await Promise.all(promises);
    return null;
  });