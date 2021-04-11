/*
 * CTZN Bot for ctznry.com
 * https://github.com/pfrazee/ctzn
 * (C) 2021 QXIP BV see LICENSE for details
 */

const WebSocket = require('rpc-websockets').Client
const fetch = require('node-fetch');
const config = require( './config.json' );

/* main example */
/*

const bot = require('./bot.js');
const main = async function(config){
   try {
       const userInfo = await bot.login(config);
       await bot.post('Bot Online at '+new Date().toISOString(),'');
       bot.getNotification(notify);
   }catch (e){
       console.log(e);
       ws.close();
       process.exit();
   }
};

*/

var ws;
function connect(cb) {
  if (!cb) return;
  ws = new WebSocket(config.ctzn.server);
  ws.on('open', async function() {
          cb(config);
  })
  ws.onclose = function(e) {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function() {
        connect();
      }, 1000);
  };
  ws.onerror = function(err) {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      ws.close();
  };
}

function disconnect() {
      ws.close();
      ws = false;
}

/* Functions */

const notify = async function(log){
  console.log('fresh notification!',log);
  var data = await getNotifications(log.count);
  console.log('update',data);
  await post('Bot Notified at '+new Date().toISOString(),JSON.stringify(data.notifications[0].author));
}

const getNotification = async function(cb){
  await ws.call('view.get', ["ctzn.network/notifications-count-view",{"after":new Date().toISOString() }]).then(function(result) {
        if(result && result.count > 0) cb(result);
        setTimeout(function() { getNotification(cb)}, config.ctzn.delay)
  }).catch(function(error) {
        console.log('view.get failed', error)
        setTimeout(function() { getNotification(cb)}, config.ctzn.delay)
  })
}

const getNotifications = async function(limit){
  var res = await ws.call('view.get', ["ctzn.network/notifications-view",{"limit":limit }]).then(function(result) {
    return result;
  }).catch(function(error) {
    return false;
  })
  return res;
}


const login = async function(){
  var res = await ws.call('accounts.login', [{"username":config.ctzn.user,"password":config.ctzn.pass}]).then(function(result) {
    console.log('accounts.login succeeded',result);
    return result;
  }).catch(function(error) {
    console.log('auth failed', error)
    ws.close();
    process.exit(1);
  })
  return res;
}

const post = async function(text,body,blob){
    var rand = Math.random().toString(36).substring(7);
    var post = [config.ctzn.uri,"ctzn.network/post",{"text":text || rand,"extendedText": body || rand, "extendedTextMimeType":"text/html" }];
    if(blob) post[2].media = [{"caption":"caption","blobs":{"original":{"blobName":blob,"mimeType":"image/png"}}}]
    var res = await ws.call('table.create', post).then(function(result) {
            console.log('post succeeded', result)
            return result;
    }).catch(function(error) {
            console.log('post failed', error)
            return false;
    })
    return res;
}

const postCommunity = async function(text,body,blob){
    var rand = Math.random().toString(36).substring(7);
    var post = [config.ctzn.uri,"ctzn.network/post",{"text":text || rand,"extendedText": body || rand, "extendedTextMimeType":"text/html", "community":{"userId":"memes@ctzn.one","dbUrl":"hyper://0a4968b19d692f472dd39b74b8663d2400dc34e33ca897e3a259c3525ae8168a/"} }];
    if(blob) post[2].media = [{"caption":"caption","blobs":{"original":{"blobName":blob,"mimeType":"image/png"}}}]
    await ws.call('table.create', post).then(function(result) {
            console.log('post succeeded', result)
            return result;
    }).catch(function(error) {
            console.log('post failed', error)
            return false;
    })
}

const pushBlob = async function(data, type){
    if (!type) type = {"mimeType":"image/png"}
    const blob = [data, type];
    var result = await ws.call('blob.create', blob).then(function(result) {
            console.log('blob succeeded', result)
            return result.name;
    }).catch(function(error) {
            console.log('blob failed', error)
            return false;
    })
    return result;
}

const imageFetch = async function(url){
    const response = await fetch(url);
    const data = await response.buffer()
    const b64 = data.toString('base64');
    return b64;
}

Array.prototype.forEachAsync = async function (fn) {
    for (let t of this) { await fn(t) }
}


/* Exports */

exports.connect = connect;
exports.disconnect = disconnect;
exports.login = login;
exports.postSelf = post;
exports.postCommunity = postCommunity;
exports.pushBlob = pushBlob;
exports.getNotification = getNotification;
exports.getNotifications = getNotifications;
