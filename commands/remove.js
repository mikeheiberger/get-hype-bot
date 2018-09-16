const { Users, SoundsNew } = require('../managers/db');

module.exports = {
    name: 'remove',
    description: 'Removes the song from the song database',
    cooldown: 30,
    args: true,
    usage: '<name>',
    async execute(message, args) {
        if (!message.guild) return;

        const songName = args[0];

        const rowsRemoved = await SoundsNew.destroy({
            where: { 
                $and: [
                    { name: songName },
                    { server: message.guild.id }
                ]
            }
        });
        
        if (rowsRemoved === 0) {
            return message.reply(`could not find the song ${songName} to remove.`);
        }

        return message.reply(`${songName} successfully removed.`);

    }
};