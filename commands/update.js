const { Users, SoundsNew } = require('../managers/db');
const { prefix } = require('../config.json');

module.exports = {
    name: 'update',
    description: 'Updates an existing song in the database',
    cooldown: 30,
    args: true,
    usage: '<name> <link> <start_time_in_seconds> <duration_in_seconds> <volume between 0 and 1>',
    async execute(message, args) {
        if (!message.guild) return;

        const minimumReqArgs = 2;
        if (!args || args.length < minimumReqArgs) {
            return message.reply(`Please try again with the following usage:\n${prefix}add ${usage}`);
        }

        const [ argName, argLink, argStart, argDuration, argVolume ] = args;
        const argNameLower = argName.toLowerCase();
        const clampedVolume = Math.max(0, Math.min(1, argVolume));

        const sound = await SoundsNew.findOne({
            where: { 
                $and: [
                    { name: argNameLower },
                    { server: message.guild.id }
                ]
            }
        });

        if (!sound) {
            return message.reply(`the song ${argName} could not be found.`);
        }

        return await sound.update({
            link: argLink,
            duration: argDuration,
            start: argStart,
            volume: clampedVolume
        });
    }
};