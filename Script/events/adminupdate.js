const moduleConfig = {
  name: "adminUpdate",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-icon",
    "log:thread-call",
    "log:thread-color"
  ],
  version: "4.1.0",
  credits: "乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι",
  description: "Stylized group update notifications",
  envConfig: {
    sendNoti: true,
    autoUnsend: false,
    timeToUnsend: 600
  }
};

module.exports.config = moduleConfig;

const footer = botName => `◈━━꯭${botName}꯭━━◈`;

async function getUserName(Users, api, userID) {
  if (!userID) return "Unknown User";

  try {
    if (Users && typeof Users.getNameUser === "function") {
      const name = await Users.getNameUser(String(userID));
      if (name) return String(name);
    }
  } catch (error) {}

  if (!api || typeof api.getUserInfo !== "function") return "Unknown User";

  return new Promise(resolve => {
    let settled = false;
    const done = (error, data) => {
      if (settled) return;
      settled = true;
      resolve(!error && data && data[String(userID)] && data[String(userID)].name
        ? String(data[String(userID)].name)
        : "Unknown User");
    };

    try {
      const result = api.getUserInfo(String(userID), done);
      if (result && typeof result.then === "function") {
        result.then(data => done(null, data), error => done(error));
      }
    } catch (error) {
      done(error);
    }
  });
}

function isVideoCall(data) {
  const value = data.video ?? data.is_video ?? data.group_call_type;
  return value === true || value === 1 || value === "1" || value === "video";
}

function callAction(data) {
  const raw = String(data.event || data.call_event || data.action || "").toLowerCase();
  if (/end|stop|finish/.test(raw)) return "ended";
  if (/join|participant/.test(raw) || data.joining_user) return "joined";
  if (/start|begin|create/.test(raw)) return "started";
  return "";
}

function formatDuration(value) {
  const duration = Math.max(0, Number(value) || 0);
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor((duration / 60) % 60);
  const hours = Math.floor(duration / 3600);
  return [hours, minutes, seconds].map(part => String(part).padStart(2, "0")).join(":");
}

module.exports.run = async function ({ event, api, Threads, Users }) {
  try {
    if (!event || !event.threadID || !event.logMessageType || !event.logMessageData) return;

    const config = (global.configModule && global.configModule[moduleConfig.name]) || moduleConfig.envConfig;
    if (config && config.sendNoti === false) return;

    const threadID = event.threadID;
    const data = event.logMessageData;
    const botName = String((global.config && global.config.BOTNAME) || "SHAHADAT CHAT BOT").trim();
    const signoff = footer(botName);
    let message = "";
    let targetID = "";
    let userName = "Unknown User";

    if (event.logMessageType === "log:thread-call") {
      const action = callAction(data);
      targetID = String(data.caller_id || data.joining_user || data.user_id || event.author || "");
      userName = await getUserName(Users, api, targetID);
      const callType = isVideoCall(data) ? "Video Call" : "Voice Call";
      const title = action === "started" ? "CALL STARTED" : action === "ended" ? "CALL ENDED" : "MEMBER JOINED CALL";
      const activity = action === "started"
        ? `📞 Started a ${callType}`
        : action === "ended"
          ? `📴 Call ended  •  ⏱️ ${formatDuration(data.call_duration || data.duration)}`
          : `🤝 Joined the ${callType}`;
      message = `🌷╭━━━『 📞 ${title} 』━━━╮🌹\n\n👤 𝐔𝐬𝐞𝐫: ${userName}\n🆔 𝐔𝐈𝐃: ${targetID || "Unknown"}\n📹 𝐓𝐲𝐩𝐞: ${callType}\n\n${activity}\n\n╰━━━❖ ${signoff} ❖━━━╯`;
    } else if (event.logMessageType === "log:thread-admins") {
      targetID = String(data.TARGET_ID || "");
      if (!targetID) return;
      userName = await getUserName(Users, api, targetID);
      if (data.ADMIN_EVENT === "add_admin") {
        message = `👑╭━━━『 𝐆𝐑𝐎𝐔𝐏 𝐀𝐃𝐌𝐈𝐍 』━━━╮\n\n👤 𝐔𝐬𝐞𝐫: ${userName}\n🆔 𝐔𝐈𝐃: ${targetID}\n\n✅ Admin permission activated\n\n${signoff}`;
      } else if (data.ADMIN_EVENT === "remove_admin") {
        message = `⚠️╭━━━『 𝐆𝐑𝐎𝐔𝐏 𝐀𝐃𝐌𝐈𝐍 』━━━╮\n\n👤 𝐔𝐬𝐞𝐫: ${userName}\n🆔 𝐔𝐈𝐃: ${targetID}\n\n❌ Admin permission removed\n\n${signoff}`;
      }
    } else if (event.logMessageType === "log:user-nickname") {
      targetID = String(data.participant_id || "");
      if (!targetID) return;
      userName = await getUserName(Users, api, targetID);
      const nickname = String(data.nickname || "Original Name");
      message = `🌸╭━━━『 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 』━━━╮\n\n👤 𝐔𝐬𝐞𝐫: ${userName}\n🆔 𝐔𝐈𝐃: ${targetID}\n✍️ 𝐍𝐞𝐰 𝐍𝐚𝐦𝐞: ${nickname}\n\n${signoff}`;
    } else if (event.logMessageType === "log:thread-name") {
      targetID = String(event.author || "");
      userName = await getUserName(Users, api, targetID);
      const name = String(data.name || event.logMessageBody || "Group");
      message = `📝╭━━━『 𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄 』━━━╮\n\n👤 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐛𝐲: ${userName}\n🆕 𝐍𝐞𝐰 𝐍𝐚𝐦𝐞: ${name}\n\n${signoff}`;
    } else if (event.logMessageType === "log:thread-icon") {
      targetID = String(event.author || "");
      userName = await getUserName(Users, api, targetID);
      const icon = String(data.thread_icon || "👍");
      message = `🖼️╭━━━『 𝐆𝐑𝐎𝐔𝐏 𝐈𝐂𝐎𝐍 』━━━╮\n\n👤 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐛𝐲: ${userName}\n✨ 𝐍𝐞𝐰 𝐈𝐜𝐨𝐧: ${icon}\n\n${signoff}`;
    } else if (event.logMessageType === "log:thread-color") {
      targetID = String(event.author || "");
      userName = await getUserName(Users, api, targetID);
      const color = String(data.thread_color || "🌤️");
      message = `🎨╭━━━『 𝐆𝐑𝐎𝐔𝐏 𝐓𝐇𝐄𝐌𝐄 』━━━╮\n\n👤 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐛𝐲: ${userName}\n🌈 𝐍𝐞𝐰 𝐓𝐡𝐞𝐦𝐞: ${color}\n\n${signoff}`;
    }

    if (!message) return;

    const autoUnsend = config && config.autoUnsend === true;
    const timeToUnsend = Math.max(1, Number(config.timeToUnsend) || 600);
    api.sendMessage(message, threadID, (error, info) => {
      if (error) {
        console.error("[ADMIN UPDATE SEND ERROR]", error.message || error);
        return;
      }
      if (autoUnsend && info && info.messageID && typeof api.unsendMessage === "function") {
        setTimeout(() => api.unsendMessage(info.messageID, () => {}), timeToUnsend * 1000);
      }
    });

    if (Threads && typeof Threads.getData === "function" && typeof Threads.setData === "function") {
      try {
        const result = await Threads.getData(threadID);
        const threadInfo = (result && result.threadInfo) || {};
        if (event.logMessageType === "log:thread-name") threadInfo.threadName = String(data.name || event.logMessageBody || "");
        if (event.logMessageType === "log:thread-icon") threadInfo.threadIcon = data.thread_icon || "👍";
        if (event.logMessageType === "log:thread-color") threadInfo.threadColor = data.thread_color || "🌤️";
        await Threads.setData(threadID, { threadInfo });
      } catch (error) {
        console.error("[ADMIN UPDATE DATA ERROR]", error.message || error);
      }
    }
  } catch (error) {
    console.error("[ADMIN UPDATE ERROR]", error);
  }
};
