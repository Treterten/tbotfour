// const Command = require('./models/command.js');

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

module.exports.join.bind(module.exports);
module.exports.leave.bind(module.exports);
module.exports.muteAll.bind(module.exports);
module.exports.unmuteAll.bind(module.exports);
module.exports.study.bind(module.exports);
