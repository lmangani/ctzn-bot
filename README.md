<img src="https://user-images.githubusercontent.com/1423657/114308321-b92e3900-9ae3-11eb-9526-5cfeef94ef23.png" width=120>

# ctzn-bot
Simple bot for [CTZN](https://ctznry.com)

### Status
* Nothing to see here. Meow on.

### Usage
```
npm install ctzn-bot
```

### Hack
Configure your CTZN settings in `config.json` and hack with `example.js`

#### Exports
```
connect(cb function)
disconnect()
login(config json)
postSelf(title string, body string, blob string)
postCommunity(title string, body string, blob string)
pushBlob(base64 string)
getNotification(cb function)
getNotifications(limit int)
getPosts(userId string, limit int)
```

### Contact
Making a bot? Join the [Bot Community](https://ctznry.com/bots@ctzn.one) on [CTZN](https://ctznry.com)
