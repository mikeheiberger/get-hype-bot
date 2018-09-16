const { Users, SoundsNew } = require('../managers/db');

module.exports = {
    name: 'sounds',
    description: 'Lists the current sounds available to play (from new data type)',
    cooldown: 30,
    async execute(message, args) {
        const soundsAll = await SoundsNew.findAll({
            where: { server: null },
            attributes: ['name']
        });

        const soundsServer = await SoundsNew.findAll({
            where: { server: message.guild.id },
            attributes: ['name']
        });

        if (!soundsAll && !soundsServer) {
            return message.reply('no sounds are currently in the database. Add one!');
        }

        return message.reply(`here are the current sounds you can play.\n\n*Sounds for everyone:*\n${soundsAll.map(sound => sound.name).join('\n')}\n\n*Server specific sounds:*\n${soundsServer.map(sound => sound.name).join('\n')}\n  `);
    }
};