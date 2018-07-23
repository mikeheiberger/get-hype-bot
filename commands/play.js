const audioManager = require('../managers/audioManager');
const sounds = require('../sounds.json');

module.exports = {
    name: 'play',
    description: "Play's the audio clip specified in the arguments",
    cooldown: 30,
    execute(message, args) {
        if (!message.guild) return;

        if (!args) return;

        const songname = args[0];

        const song = sounds[songname];
        if (!song || !song.link) return;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => audioManager.playStream(connection, song))
                .catch(console.error);
        } else {
            message.channel.reply('you need to join a voice channel first');
        }
    }
}