/* eslint-disable no-console */

const Discord = require('discord.js');
const { API_TOKEN, PREFIX } = require('../config.js');
const commands = require('./commands');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (msg) => {
  const commandReg = /!(\S+)/;
  const channel = client.channels.cache.get(msg.channel.id);
  if (msg.content[0] === PREFIX) {
    try {
      commands[commandReg.exec(msg.content)[1]](client, msg);
    } catch (e) {
      msg.reply(`\`\`\`${e}\`\`\``);
    }
  } else if (msg.channel.id === '817255774425186304' && msg.author.id !== client.user.id) {
    if (msg.member.voice.channel) {
      if (msg.member.voice.channel.id !== '800414879232032788') {
        msg.reply('You must be in the studying vc to make a message here');
        channel.send(`!shame ${await client.users.fetch(msg.author.id)} chatting in the wrong channel`);
        msg.delete();
      }
    } else {
      msg.reply('You must be in the studying vc to make a message here');
      channel.send(`!shame ${await client.users.fetch(msg.author.id)} chatting in the wrong channel`);
      msg.delete();
    }
  } else if (msg.member.voice.channel && msg.author.id !== client.user.id) {
    if (msg.member.voice.channel.id === '800414879232032788') {
      if (msg.channel.id !== '817255774425186304') {
        msg.reply('You can only speak in the vc chat channel when studying.');
        channel.send(`!shame ${await client.users.fetch(msg.author.id)} chatting in the wrong channel`);
        msg.delete();
      }
    }
  }
});

client.login(API_TOKEN)
  .then(() => console.log('Success!'))
  .catch((err) => console.error(err));
