const { Users, SoundsNew } = require('../managers/db');

module.exports = {
    name: 'sounds_new',
    description: 'Lists the current sounds available to play (from new data type)',
    cooldown: 30,
    async execute(message, args) {
        const sounds = await SoundsNew.findAll({
            where: {
                $or: [
                    { server: message.guild.id },
                    { server: null }
                ]
            },
            attributes: ['name']
        });

        if (!sounds) {
            return message.reply('no sounds are currently in the database. Add one!');
        }

        return message.reply(`here are the current sounds you can play:\n${sounds.map(sound => sound.name).join('\n')}`);
    }
};