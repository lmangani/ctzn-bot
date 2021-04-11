const r = require("better-redddit");
const fetch = require("node-fetch");
const bot = require("./bot.js");

/* Main Bot Loop */
const main = async function(config) {
  try {
    const userInfo = await bot.login(config);
    // Fetch Top 5 Memes from Reddit
    var posts = await r.top_posts("memes", 10);
    await posts.forEachAsync(async function(result) {
      // Repost to CTZN
      var title = "REPOST: " + result.data.title;
      var imgUrl =
        result.data.preview.images[0].source.url || result.data.thumbnail;
      imgUrl = imgUrl.replace("amp;s", "s");
      var b64 = await bot.imageFetch(imgUrl);
      var blob = await bot.pushBlob(b64);
      var body =
        "<img src='" +
        result.data.url_overridden_by_dest +
        "' /><br>Posted by " +
        result.data.author_fullname;
      var result = await bot.postSelf(title, body, blob);
    });
    bot.disconnect();
    process.exit();
  } catch (e) {
    console.log(e);
    bot.disconnect();
    process.exit();
  }
};

bot.connect(main);
