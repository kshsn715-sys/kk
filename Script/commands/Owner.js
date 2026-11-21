module.exports.config = {
  name: "owner",
  aliases: ["ownerinfo", "owners"],
  version: "1.0.1",
  hasPermssion: 0,
  credits: "乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι",
  description: "Show Owner Info",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  const info = `
👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢

👤 𝗡𝗮𝗺𝗲: 乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι
🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲: Bayazid
🕌 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻: Islam
🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻: Developer
🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: Bangladesh

❖⋆═══════════════════════⋆❖
𝐁𝐨𝐭 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 ➢ 乃αყα𝚉ι𝙳 乃⦿ន𝚃αᴍι
`;

  return api.sendMessage(info, event.threadID, event.messageID);
};
