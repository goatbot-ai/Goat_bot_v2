const axios = require("axios");

module.exports = {
config: {
name: "nezuko",
version: "1.3.0",
author: "Azad 💥", //author change korle tor marechudi 
role: 0,
shortDescription: "Nezuko Ai GF💞",
longDescription: "Auto-reply girlfriend style AI je tomake sweet romantic reply dibe 😘",
category: "ai",
guide: {
en: "Type anything, Nezuko will auto reply ❤️"
}
},

API_URL: "https://azadxxxxapi.onrender.com/chat",
chatHistories: {},
autoReplyEnabled: {},

// 🟢 Only use prefix for turning ON/OFF
async onStart({ api, event, args }) {
const { threadID, messageID, senderID } = event;
const msg = args.join(" ").trim().toLowerCase();

if (msg === "on") {  
  this.autoReplyEnabled[senderID] = true;  
  return api.sendMessage(  
    "Hee baby 😘 auto-reply mode **ON** hoye gese... ekhon ami tomake Banglish e bhalobashbo 💞",  
    threadID,  
    messageID  
  );  
}  

if (msg === "off") {  
  this.autoReplyEnabled[senderID] = false;  
  this.chatHistories[senderID] = [];  
  return api.sendMessage(  
    "Hmm 😒 auto-reply **OFF** hoye gese... tumi abar amake ignore korba naki? 🥺",  
    threadID,  
    messageID  
  );  
}  

return api.sendMessage("Use: nezuko on / nezuko off", threadID, messageID);

},

// 💬 No-prefix auto chat
async onChat({ api, event }) {
const { senderID, threadID, messageID, body, messageReply } = event;

// ✅ Auto reply only if ON  
if (!this.autoReplyEnabled[senderID]) return;  
if (!body || body.trim().length === 0) return;  

const API_URL = this.API_URL;  
const userMessage = body.trim();  

// 🧠 Maintain chat history  
if (!this.chatHistories[senderID]) this.chatHistories[senderID] = [];  

if (messageReply && messageReply.senderID === api.getCurrentUserID()) {  
  this.chatHistories[senderID].push(`User: ${userMessage}`);  
} else {  
  this.chatHistories[senderID].push(`User: ${userMessage}`);  
}  

if (this.chatHistories[senderID].length > 5) this.chatHistories[senderID].shift();  

const fullConversation = this.chatHistories[senderID].join("\n");  

// GF Prompt  
const gfPrompt = `

Tumar naam Nezuko. Tumi ekta sweet, loving, slightly moody girlfriend ❤️
Banglish e kotha bolo, natural, flirty and real 😚
Tumi boyfriend ke “baby”, “jaan”, “shona” bole dakba 😘
Jodi keu bole tumi bot, tumi cute ragi hoye funny roast korba 😤💋
Jodi keu jigese kore tumare ke banailo, bolo: “Amake banailo Azad 💥 — tar FB name your'azad! 🇧🇩”
Always reply short (1-2 lines), sweet, emotional & romantic like a real GF 😍
Now continue chatting:
${fullConversation}
`;

api.setMessageReaction("⌛", messageID, () => {}, true);  

try {  
  const res = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);  
  const reply = res.data.reply || "Uff baby! ekto clear kore bolo na 😕";  

  this.chatHistories[senderID].push(`Nezuko: ${reply}`);  
  api.sendMessage(reply, threadID, messageID);  
  api.setMessageReaction("✅", messageID, () => {}, true);  
} catch (error) {  
  console.error("Error:", error.message);  
  api.sendMessage(  
    "Aww jaan 😔 server ta problem  hoye gese... pore abar try koro 💋",  
    threadID,  
    messageID  
  );  
  api.setMessageReaction("❌", messageID, () => {}, true);  
}

}
};
