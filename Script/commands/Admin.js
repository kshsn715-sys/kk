const moment = require("moment-timezone");

module.exports.config = {
  name: "admin",
  aliases: ["admininfo", "infoadmin"],
  version: "1.0.0",
  hasPermssion: 0,
  credits: "乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι",
  description: "Show Owner Info",
  commandCategory: "info",
  usages: "admin",
  cooldowns: 2
};

module.exports.run = async function({ api, event }) {
  const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  const body = `
┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│👤 𝐍𝐚𝐦𝐞 : 乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι
│🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : Islam
│🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : Developer
│🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : Bangladesh
└───────────────⭓

┌───────────────⭓
│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲
├───────────────
│ ${time}
└───────────────⭓

❖⋆═══════════════════════⋆❖
𝐁𝐨𝐭 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 ➢ 乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι
`;

  return api.sendMessage(body, event.threadID, event.messageID);
};
