/* eslint-disable no-console */
// const Command = require('./models/command.js');
const StudyUser = require('./models/studyUser.js');

module.exports.ping = (client, message) => {
  message.reply('pong');
};

module.exports.join = (client, message) => {
  if (client.voice.connections.array()[0]) {
    message.reply('I\'m already in a voice channel');
  } else if (message.member.voice.channel) {
    message.member.voice.channel.join();
  } else {
    message.reply('You aren\'t in a voice channel');
  }
};

module.exports.leave = (client, message) => {
  const voiceChannelConnection = client.voice.connections.array()[0];
  if (voiceChannelConnection) {
    voiceChannelConnection.disconnect();
  } else {
    message.reply('I\'m not in a voice channel');
  }
};

module.exports.muteAll = (client, message) => {
  if (!client.voice.connections.array()[0]) {
    this.join(client, message);
  }
  const { members } = client.voice.connections.array()[0].channel;
  members.forEach((user) => {
    user.voice.setMute(true);
  });
};

module.exports.unmuteAll = (client, message) => {
  if (!client.voice.connections.array()[0]) {
    this.join(client, message);
  }
  const { members } = client.voice.connections.array()[0].channel;
  members.forEach((user) => {
    console.log('Unmuting');
    user.voice.setMute(false);
  });
};

module.exports.study = (client, message) => {
  const studyFunc = () => {
    this.running = true;
    let counter = 0;
    const listenerFunc = () => {
      this.muteAll(client, message);
      console.log('Running Listener ', counter);
      counter += 1;
    };
    listenerFunc.bind(module.exports);
    const time = 60000 * parseInt(message.content.substring(message.content.indexOf(' ') + 1), 10);
    this.muteAll(client, message);
    client.on('voiceStateUpdate', listenerFunc);
    message.reply(`Time to study for ${time / 60000} minute(s). Let's stay focused~`);
    setTimeout(() => {
      message.reply('The study session is up!');
      client.removeListener('voiceStateUpdate', listenerFunc);
      this.unmuteAll(client, message);
      this.running = false;
    }, time);
  };
  studyFunc.bind(module.exports);
  if (!this.running) {
    studyFunc();
  } else {
    message.reply('You\'re already in a study session.');
  }
};

module.exports.shame = (client, message) => {
  const user = message.mentions.users.first();
  const channel = client.channels.cache.get(message.channel.id);
  const reason = message.content.substring(message.content.indexOf('>') + 1).trim();
  if (reason.length > 0) {
    StudyUser.findOne({ id: user.id }, (err, studyUser) => {
      if (studyUser) {
        // StudyUser.updateOne({ id: user.id }, { shames: studyUser.shames + 1 },
        //   (error) => {
        //     if (error) {
        //       console.error(error);
        //     } else {
        //       channel.send(`Shame on ${user} for ${reason} instead of working.
        //       They now have ${studyUser.shames + 1} shames.`);
        //     }
        //   });
        studyUser.shames.push({ description: reason });
        studyUser.save();
        channel.send(`Shame on ${user} for ${reason} instead of working. Current number of shames: ${studyUser.shames.length + 1}`);
      } else {
        StudyUser.create({ id: user.id, shames: [{ description: reason }] })
          .then(() => channel.send(`Shame on ${user} for ${reason} instead of working. This is their first shame.`))
          .catch((e) => console.error(e));
      }
    });
  } else {
    message.reply('You did not specify a reason.');
  }
};

module.exports.shameList = (client, message) => {
  const user = message.author;
  const channel = client.channels.cache.get(message.channel.id);
  console.log(client.user.id);
  StudyUser.findOne({ id: user.id }, (err, studyUser) => {
    if (studyUser) {
      let messageBack = '```# | Reason\n--------------\n';
      for (let i = 0; i < studyUser.shames.length; i += 1) {
        messageBack += `${i} | ${studyUser.shames[i].description}\n`;
      }
      messageBack += '```';
      channel.send(messageBack);
    } else {
      message.reply('You have no shames. Cheers!');
    }
  });
};

module.exports.commands = (client, message) => {
  const channel = client.channels.cache.get(message.channel.id);
  channel.send(`
\`\`\`
PREFIX: '!'
unmuteAll: Unmutes (server unmute) everyone in the voice channel
muteAll: Server mutes everyone in the voice channel
ping: pong
join: Joins the voice channel you're in
leave: Leaves the voice channel
study [time to study, in minutes]: Joins the voice channel, and mutes everyone for x amount of minutes, then unmutes everyone once the study session is up
shame [@user] [reason (optional)]: Shame someone for not studying and/or violating study stream rules. Shows their current shames and adds to them.
\`\`\``);
};

module.exports.join.bind(module.exports);
module.exports.leave.bind(module.exports);
module.exports.muteAll.bind(module.exports);
module.exports.unmuteAll.bind(module.exports);
module.exports.study.bind(module.exports);
module.exports.commands.bind(module.exports);
