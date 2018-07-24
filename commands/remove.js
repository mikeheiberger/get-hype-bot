const { Users, Sounds } = require('../managers/db');

module.exports = {
    name: 'remove',
    description: 'Removes the song from the song database',
    cooldown: 30,
    args: true,
    usage: '<name>',
    async execute(message, args) {
        if (!message.guild) return;

        const songName = args[0];

        const rowsRemoved = await Sounds.destroy({
            where: { name: songName }
        });
        
        if (rowsRemoved === 0) {
            return message.reply(`could not find the song ${songName} to remove.`);
        }

        return message.reply(`${songName} successfully removed.`);

    }
};