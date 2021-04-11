/* Import CTZN Bot Helper */
const bot = require('./bot.js');

const notify = function(data){
   console.log(data);
}

/* Define a callback function */
const main = async function(config){
   try {
       const userInfo = await bot.login(config);
       await bot.postSelf('Bot Online at '+new Date().toISOString(),'');
       bot.getNotification(notify);
   }catch (e){
       console.log(e);
       bot.disconnect();
       process.exit();
   }
};

/* Connect w/ callback */
bot.connect(main);
