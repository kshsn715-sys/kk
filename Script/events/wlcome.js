const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"],
  version: "2.0.0",
  credits: "乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι",
  description: "Styled welcome message with mentions",
  dependencies: { "fs-extra": "", path: "" }
};

const BANNER_TEXT = `🌷-Assalamu Alaikum-🌹.

ꕥ̳̳̳̳̳̳̳̿̿̿𝄟≛⃝𝐌𝐎𝐍𝐄𝐑💠𝐊𝐎𝐓𝐇𝐀🎸𝐌𝐔𝐒𝐈𝐂💠𝐁𝐀𝐍𝐃🎸

এ্ঁ আ্ঁপ্ঁনা্ঁকে্ঁ🌹🌹
🌺💑ᏔᎬᏞᏟϴᎷᎬ 🌺💑 💕🍃

💕.•°``°•.¸.•°``°•.💕
💕(  Welcome     ) 💕
💕•.¸   💗   ¸.• 💕
     💕° •.¸¸.•° 💕
           💕💕
             💕  💕
┌────♣─────┐
🥰@MEMBER_NAME
❤ _(🍒
└────♣─────┘
  🌹🍃🌹🍃

☆⋆⃝➠᭄‌‌‌‌‌‌‌🥰🥰🥰🥰🥰
　　   ┊┊┊┊┊
　  　 ┊┊┊┊💚
　　   ┊┊┊💚
　　   ┊┊💚
　　   ┊ ] 💚
আ্ঁশা্ঁ ক্ঁরি্ঁ আ্ঁপ্ঁনি্ঁ আ্ঁপ্ঁনা্ঁর্ঁ মু্ঁল্য্ঁবা্ঁন্ঁ স্ঁম্ঁয়্ঁ আ্ঁমা্ঁদে্ঁর্ঁ উ্ঁপ্ঁহা্ঁর্ঁ দিবেন ❁❁❁❁আ্ঁমা্ঁদে্ঁর্ঁ ☆⋆⃝➠᭄‌‌‌‌‌‌🍁গু্ঁরু্ঁপ্ঁ টা্ঁ এ্ঁগি্ঁয়ে্ঁ নি্ঁয়ে্ঁ যা্ঁও্ঁয়া্ঁর্ঁ জ্ঁন্য্ঁ স্ঁহ্ঁযো্ঁগিতা্ঁ ক্ঁর্ঁবে্ঁন্ঁ ⑅⃝💛»‌‌‌‌‌‌‌‌...

◄══╬AKAID╬═►

💚┊💙┊💜
❤️┊💛
💖`;

module.exports.run = async function ({ api, event }) {
  try {
    if (!event || event.logMessageType !== "log:subscribe" || !event.logMessageData) return;

    const participants = event.logMessageData.addedParticipants;
    if (!Array.isArray(participants) || !participants.length) return;

    const threadID = event.threadID;
    const botID = String(api.getCurrentUserID());

    for (const participant of participants) {
      const userID = String(participant.userFbId || "");
      if (!userID || userID === botID) continue;

      const userName = String(participant.fullName || participant.name || "New Member").trim();
      const body = BANNER_TEXT.replace("@MEMBER_NAME", `@${userName}`);

      await new Promise((resolve, reject) => {
        api.sendMessage(
          {
            body,
            mentions: [{ tag: `@${userName}`, id: userID }]
          },
          threadID,
          error => error ? reject(error) : resolve()
        );
      });
    }
  } catch (error) {
    console.error("[WELCOME ERROR]", error);
  }
};
