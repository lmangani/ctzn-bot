/* Import CTZN Bot Helper */
const bot = require('./bot.js');

/* Define a callback function */
const main = async function(config){
   try {
       const userInfo = await bot.login(config);
       await bot.post('Bot Online at '+new Date().toISOString(),'');
       bot.getNotification(notify);
   }catch (e){
       console.log(e);
       bot.disconnect();
       process.exit();
   }
};

/* Connect w/ callback */
bot.connect(main);
