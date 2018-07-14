module.exports = {
    name: 'join',
    description: 'Makes the bot join your current voice channel',
    execute(message, args) {
        if (!message.guild) return;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const dispatcher = connection.playFile('C:/Users/Michael/Documents/CHVRCHES - The Bones of What You Believe [Deluxe Version] (2013)/01 The Mother We Share.mp3');

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