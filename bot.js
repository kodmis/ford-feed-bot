'use strict'
const Telegram = require('node-telegram-bot-api');
const parser = require('./main.js');
const tg = new Telegram(process.env.TOKEN);

const sendToChannel = (url) => {
  console.log(`Sending ${url} to @${process.env.CHANNEL}`);
  tg.sendPhoto('@' + process.env.CHANNEL, url);
};

parser(sendToChannel,"http://foto.carexpert.ru/Ford/p1/");

