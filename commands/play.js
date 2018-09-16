const audioManager = require('../managers/audioManager');
const { Users, SoundsNew } = require('../managers/db');

module.exports = {
    name: 'play',
    description: "Plays the audio clip specified in the arguments",
    cooldown: 30,
    args: true,
    usage: '<songname>',
    async execute(message, args) {
        if (!message.guild) return;

        if (!args) return;

        const songname = args[0].toLowerCase();

        const song = await SoundsNew.findOne({ 
            where: { name: songname } 
        });  

        if (!song) {
            return message.reply('that song hasn\'t been added yet');
        }

        if (!song.link) {
            return message.reply('there seems to be an issue with this song\'s youtube link. Please use the update command to fix it.');
        }

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => audioManager.playStream(connection, song))
                .catch(console.error);
        } else {
            message.reply('you need to join a voice channel first');
        }
    }
}