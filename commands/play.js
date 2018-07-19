const ytdl = require('ytdl-core');
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
                .then(connection => {
                    const stream = ytdl(song.link, { format: 'audioonly', begin: song.start });                   
                    const dispatcher = connection.playStream(stream);

                    dispatcher.on('error', err => {
                        console.log(`Error playing file: ${err}`);
                    })

                    dispatcher.setVolume(0.4);
                    dispatcher.resume();

                    if (song.duration) {
                        setTimeout(() => dispatcher.end(), song.duration * 1000);
                    }

                    if (song.volume) {
                        dispatcher.setVolume(sounds[songname].volume);
                    }
                })
                .catch(console.error);
        } else {
            message.channel.send('You need to join a voice channel first');
        }
    }
}