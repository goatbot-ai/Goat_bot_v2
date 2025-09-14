module.exports = {
  config: {
    name: "hijack",
    version: "1.0.1",
    author: "starboy",
    role: 3,
    category: "owner",
    shortDescription: "Promote yourself & kick other admins",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const botID = api.getCurrentUserID();

      // Check if the bot is admin
      if (!threadInfo.adminIDs.some(admin => admin.id === botID)) {
        return api.sendMessage("❌ আগে আমাকে গ্রুপের অ্যাডমিন বানান।", threadID, messageID);
      }

      // Promote the sender to admin if not already
      if (!threadInfo.adminIDs.some(admin => admin.id === senderID)) {
        await api.changeAdminStatus(threadID, senderID, true);
        await new Promise(r => setTimeout(r, 500));
      }

      // Get all other admins except the bot & sender
      const targets = threadInfo.adminIDs
        .map(a => a.id)
        .filter(id => id !== botID && id !== senderID);

      // Remove other admins
      for (const id of targets) {
        try {
          await api.removeUserFromGroup(id, threadID);
          await new Promise(r => setTimeout(r, 300));
        } catch (err) {
          console.error(`Failed to remove ${id}:`, err);
        }
      }

      // Success message
      api.sendMessage("😈 হাইজ্যাক সফল! এখন শুধু তুমি ও বট অ্যাডমিন।", threadID);

    } catch (e) {
      // Fixed syntax error here with backticks
      api.sendMessage(`❌ সমস্যা: ${e.message}`, threadID, messageID);
    }
  }
};
