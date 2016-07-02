'use strict';

require('dotenv').load();

module.exports = {
  appid: process.env.APP_ID,
  appkey: process.env.APP_KEY,
  keyid: process.env.KEY_ID,
  privatekey: process.env.PRIVATE_KEY,
  platformtype: process.env.PLATFORM,
  dburi: process.env.MONGODB_URI
};
