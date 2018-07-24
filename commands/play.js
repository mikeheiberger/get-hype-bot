const audioManager = require('../managers/audioManager');
const { Users, Sounds } = require('../managers/db');

module.exports = {
    name: 'play',
    description: "Play's the audio clip specified in the arguments",
    cooldown: 30,
    args: true,
    usage: '<songname>',
    async execute(message, args) {
        if (!message.guild) return;

        if (!args) return;

        const songname = args[0];

        const song = await Sounds.findOne({ 
            where: { name: songname } 
        });  

        if (!song || !song.link) {
            return message.reply('that song hasn\'t been added yet');
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