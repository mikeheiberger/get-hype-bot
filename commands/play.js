const ytdl = require('ytdl-core');
const sounds = require('../sounds.json');

module.exports = {
    name: 'play',
    description: "Play's the audio clip specified in the arguments",
    execute(message, args) {
        if (!message.guild) return;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const songname = args[0];
                    const link = sounds[songname].link;
                    const start = sounds[songname].start;
                    console.log(start);

                    const stream = ytdl(link, { format: 'audioonly', begin: start });
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