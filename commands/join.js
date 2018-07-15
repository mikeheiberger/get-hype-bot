const ytdl = require('ytdl-core');
const sounds = require('../sounds.json');

module.exports = {
    name: 'join',
    description: 'Makes the bot join your current voice channel',
    execute(message, args) {
        if (!message.guild) return;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const stream = ytdl(sounds["scatman"].link, { format: 'audioonly' });
                    const dispatcher = connection.playStream(stream);

                    dispatcher.on('error', err => {
                        console.log(`Error playing file: ${err}`);
                    })

                    dispatcher.setVolume(0.1);
                    dispatcher.resume();
                })
                .catch(console.error);
        } else {
            message.channel.send('You need to join a voice channel first');
        }
    }
}