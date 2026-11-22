const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leavenoti",
  eventType: ["log:unsubscribe"],
  version: "3.0.0",
  credits: "乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι",
  description: "Styled farewell notification and antiout system",
  dependencies: {
    "fs-extra": "",
    path: ""
  }
};

const createStyledMessage = ({ name, title, text, botName }) => `🌷-Assalamu Alaikum-🌹 .

ꕥ̳̳̳̳̳̳̳̿̿̿𝄟≛⃝𝐌𝐎𝐍𝐄𝐑💠𝐊𝐎𝐓𝐇𝐀🎸𝐌𝐔𝐒𝐈𝐂💠𝐁𝐀𝐍𝐃🎸

 এ্ঁ আ্ঁপ্ঁনা্ঁকে্ঁ🌹🌹
🌺💑${title}🌺💑 💕🍃

💕.•°``°•.¸.•°``°•.💕
💕(  ${title}  ) 💕
💕•.¸   💗   ¸.• 💕
     💕° •.¸¸.•° 💕
           💕💕
             💕  💕
┌────♣─────┐
🥰@${name}
❤ _(🍒
└────♣─────┘
  🌹🍃🌹🍃

☆⋆⃝➠᭄‌‌‌‌‌‌‌🥰🥰🥰🥰🥰
　　   ┊┊┊┊┊
　  　 ┊┊┊┊💚
　　   ┊┊┊💚
　　   ┊┊💚
　　   ┊ ] 💚
${text}

◄══╬AKAID╬═►

💚┊💙┊💜
❤️┊💛
💖

◈━━꯭${botName}꯭━━◈`;

module.exports.run = async function ({ api, event, Users, Threads }) {
  if (!event || !event.logMessageData || !event.logMessageData.leftParticipantFbId) return;

  const leftID = String(event.logMessageData.leftParticipantFbId);
  const botID = String(api.getCurrentUserID());
  if (leftID === botID) return;

  const threadID = event.threadID;
  const threadData = global.data && global.data.threadData;
  let data = threadData && (threadData.get(String(threadID)) || threadData.get(Number(threadID)));
  if (!data && Threads && typeof Threads.getData === "function") {
    try {
      const thread = await Threads.getData(threadID);
      data = thread && thread.data;
    } catch (error) {}
  }
  data = data || {};

  let name = (global.data && global.data.userName && global.data.userName.get(leftID)) || "Member";
  if (name === "Member" && Users && typeof Users.getNameUser === "function") {
    try {
      name = (await Users.getNameUser(leftID)) || name;
    } catch (error) {}
  }
  name = String(name);
  const botName = String((global.config && global.config.BOTNAME) || "MESSENGER CHAT BOT");
  const isSelfLeave = String(event.author) === leftID;
  const fsExtra = global.nodemodule && global.nodemodule["fs-extra"] || fs;
  const pathModule = global.nodemodule && global.nodemodule.path || path;
  const mediaExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov", ".mkv", ".webm"];

  const getRandomMedia = folderName => {
    const folder = pathModule.join(__dirname, "Uhas", folderName);
    try {
      if (!fsExtra.existsSync(folder)) {
        fsExtra.mkdirSync(folder, { recursive: true });
        return null;
      }
      const files = fsExtra.readdirSync(folder).filter(file =>
        mediaExtensions.includes(pathModule.extname(file).toLowerCase())
      );
      return files.length ? pathModule.join(folder, files[Math.floor(Math.random() * files.length)]) : null;
    } catch (error) {
      return null;
    }
  };

  const send = (body, mediaPath) => {
    const message = { body };
    const mentionText = `@${name}`;
    const mentionIndex = body.indexOf(mentionText);
    if (mentionIndex !== -1) {
      message.mentions = [{ tag: mentionText, id: leftID, fromIndex: mentionIndex }];
    }
    if (mediaPath) message.attachment = fsExtra.createReadStream(mediaPath);
    return api.sendMessage(message, threadID);
  };

  if (isSelfLeave && data.antiout !== false) {
    return api.addUserToGroup(leftID, threadID, async error => {
      if (error) {
        const body = createStyledMessage({
          name,
          title: "বিদায়",
          text: `😔 ${name} কে আবার গ্রুপে যোগ করা যায়নি। Privacy Settings-এর কারণে হতে পারে।`,
          botName
        });
        return send(body, getRandomMedia("add"));
      }

      const body = createStyledMessage({
        name,
        title: "আবার স্বাগতম",
        text: `😂 Admin-এর অনুমতি ছাড়া লিভ করেছিলে—তোমাকে আবার গ্রুপে ফিরিয়ে আনা হয়েছে!`,
        botName
      });
      return send(body, getRandomMedia("leave"));
    });
  }

  const title = "বিদায়";
  const farewell = isSelfLeave
    ? `👋 ${name}, গ্রুপ ছেড়ে যাওয়ার জন্য বিদায়। ভালো থেকো!`
    : `👋 ${name}, তোমাকে গ্রুপ থেকে সরানো হয়েছে। ভালো থেকো!`;
  const defaultMessage = createStyledMessage({ name, title, text: farewell, botName });
  const customMessage = typeof data.customLeave === "undefined" ? defaultMessage : String(data.customLeave);
  const body = customMessage
    .replace(/\{name\}/g, name)
    .replace(/\{type\}/g, farewell)
    .replace(/\{botName\}/g, botName);

  return send(body, getRandomMedia(isSelfLeave ? "leave" : "remove"));
};
