const audioManager = require('../managers/audioManager');

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
                .then(connection => {
                    audioManager.playStream(connection);
                    if (song.duration) {
                        setTimeout(() => dispatcher.end(), song.duration * 1000);
                    }
                })
                .catch(console.error);
        } else {
            message.channel.send('You need to join a voice channel first');
        }
    }
}