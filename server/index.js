/* eslint-disable no-console */

const Discord = require('discord.js');
const { API_TOKEN, PREFIX } = require('../config.js');
const commands = require('./commands');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (msg) => {
  const commandReg = /!(\S+)/;
  if (msg.content[0] === PREFIX) {
    try {
      commands[commandReg.exec(msg.content)[1]](client, msg);
    } catch (e) {
      msg.reply(`\`\`\`${e}\`\`\``);
    }
  }
});

client.login(API_TOKEN)
  .then(() => console.log('Success!'))
  .catch((err) => console.error(err));
