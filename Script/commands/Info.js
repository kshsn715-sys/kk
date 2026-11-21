module.exports.config = {
  name: "info",
  aliases: ["information", "about", "botinfo"],
  usePrefix: false,
  version: "1.0.1",
  hasPermssion: 0,
  credits: "乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι",
  description: "Bot information command",
  commandCategory: "For users",
  hide: true,
  usages: "info",
  cooldowns: 5
};

module.exports.run = async function ({
  api,
  event,
  args,
  Users,
  Threads
}) {
  const { threadID } = event;
  const moment = require("moment-timezone");
  const { configPath } = global.client;

  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  const botName =
    config.BOTNAME ||
    config.botName ||
    "Messenger Chat Bot";

  const { commands } = global.client;

  const threadSetting =
    (await Threads.getData(String(threadID))).data || {};

  const prefix =
    threadSetting.hasOwnProperty("PREFIX")
      ? threadSetting.PREFIX
      : config.PREFIX;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const totalUsers =
    global.data.allUserID.length;

  const totalThreads =
    global.data.allThreadID.length;

  const msg = `╭⭓ ⪩ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ⪨
│
├─ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : ${botName}
├─ ☢️ 𝗣𝗿𝗲𝗳𝗶𝘅 : ${config.PREFIX}
├─ ♻️ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗕𝗼𝘅 : ${prefix}
├─ 🔶 𝗠𝗼𝗱𝘂𝗹𝗲𝘀 : ${commands.size}
├─ 🔰 𝗣𝗶𝗻𝗴 : ${Date.now() - event.timestamp}ms
╰───────⭓

╭⭓ ⪩ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ⪨
│
├─ 👑 𝗡𝗮𝗺𝗲 : 乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι
├─ 🕌 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻 : Islam
├─ 🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : Bangladesh
╰───────⭓

╭⭓ ⪩ 𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗜𝗘𝗦 ⪨
│
├─ ⏳ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 : ${hours}h ${minutes}m ${seconds}s
├─ 📣 𝗚𝗿𝗼𝘂𝗽𝘀 : ${totalThreads}
├─ 🧿 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀 : ${totalUsers}
╰───────⭓

❤️ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 🌺
😍${botName}😘

❖⋆═══════════════════════⋆❖
𝐁𝐨𝐭 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 ➢ 乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι`;

  return api.sendMessage(msg, threadID, event.messageID);
};
