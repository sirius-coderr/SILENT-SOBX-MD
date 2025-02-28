const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: 'version',
  alias: ["changelog", "cupdate", "checkupdate"],
  react: '🚀',
  desc: "Check bot's version, system stats, and update info.",
  category: 'info',
  filename: __filename
}, async (conn, mek, m, {
  from, sender, pushname, reply
}) => {
  try {
    // Read local version data
    const localVersionPath = path.join(__dirname, '../my_data/version.json');
    let localVersion = 'Unknown';
    let changelog = 'No changelog available.';
    if (fs.existsSync(localVersionPath)) {
      const localData = JSON.parse(fs.readFileSync(localVersionPath));
      localVersion = localData.version;
      changelog = localData.changelog;
    }

    // Fetch latest version data from GitHub
    const rawVersionUrl = 'https://raw.githubusercontent.com/SILENTLOVER0432/SILENT-SOBX-MD/main/data/version.json';
    let latestVersion = 'Unknown';
    let latestChangelog = 'No changelog available.';
    try {
      const { data } = await axios.get(rawVersionUrl);
      latestVersion = data.version;
      latestChangelog = data.changelog;
    } catch (error) {
      console.error('Failed to fetch latest version:', error);
    }

    // Count total plugins
    const pluginPath = path.join(__dirname, '../plugins');
    const pluginCount = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length;

    // Count total registered commands
    const totalCommands = commands.length;

    // System info
    const uptime = runtime(process.uptime());
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const hostName = os.hostname();
    const lastUpdate = fs.statSync(localVersionPath).mtime.toLocaleString();

    // GitHub stats
    const githubRepo = 'https://github.com/SILENTLOVER0432/SILENT-SOBX-MD';

    // Check update status
    let updateMessage = `✅ YOUR BOT SILENT-SOBX-MD IS UP-TO-DATE! 🚀❤️`;
    if (localVersion !== latestVersion) {
      updateMessage = `🚀 YOUR BOT SILENT-SOBX-MD IS OUTDATED!
🔹 *CURRENT VERSION:* ${localVersion}
🔹 *LATEST VERSION:* ${latestVersion}

USE *.UPDATE* TO UPDATE YOUR BOT.`;
    }

    const statusMessage = `🌟 *GOOD ${new Date().getHours() < 12 ? 'MORNING' : 'NIGHT'}, ${pushname}!* 🌟\n\n` +
      `📌 *BOT NAME:* SILENT-SOBX-MD\n🔖 *CURRENT VERSION 🚀:* ${localVersion}\n📢 *LATEST VERSION:* ${latestVersion}\n📂 *TOTAL PLUGINS:* ${pluginCount}\n🔢 *TOTAL COMMANDS🚀:* ${totalCommands}\n\n` +
      `💾 *SYSTEM INFO:*\n⏳ *UPTIME:* ${uptime}\n📟 *RAM USAGE:* ${ramUsage}MB / ${totalRam}MB\n⚙️ *HOST NAME:* ${hostName}\n📅 *LAST UPDATE:* ${lastUpdate}\n\n` +
      `📝 *CHANGELOG:*\n${latestChangelog}\n\n` +
      `⭐ *GITHUB REPO:* ${githubRepo}\n👤 *OWNER:* [SILENTLOVER432](https://github.com/SILENTLOVER0432)\n\n${updateMessage}\n\n🚀 *HEY! DON'T FORGET TO FORK & STAR 🌟 THE REPO!*`;

    // Send the status message with an image
    await conn.sendMessage(from, {
      image: { url: 'https://telegra.ph/file/2a06381b260c3f096a612.jpg' },
      caption: statusMessage,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363189714152560@newsletter',
          newsletterName: 'SILENT-SOBX-MD',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
  } catch (error) {
    console.error('Error fetching version info:', error);
    reply('❌ An error occurred while checking the bot version.');
  }
});
