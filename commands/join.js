const ytdl = require('ytdl-core');

module.exports = {
    name: 'join',
    description: 'Makes the bot join your current voice channel',
    execute(message, args) {
        if (!message.guild) return;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const stream = ytdl('https://www.youtube.com/watch?v=Hy8kmNEo1i8', { format: 'audioonly' });
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