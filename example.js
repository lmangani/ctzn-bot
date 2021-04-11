/* Import CTZN Bot Helper */
const bot = require("./bot.js");

/* Define a handler for fetching updates */
const notify = async function(data) {
  const updates = await bot.getNotifications(data.count);
  console.log("you got meowd", updates);
};

/* Define a main callback function */
const main = async function(config) {
  try {
    const userInfo = await bot.login(config);
    await bot.postSelf("Bot Online at " + new Date().toISOString(), "");
    bot.getNotification(notify);
  } catch (e) {
    console.log(e);
    bot.disconnect();
    process.exit();
  }
};

/* Connect w/ callback */
bot.connect(main);
