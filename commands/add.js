const { Users, Sounds } = require('../managers/db');
const { prefix } = require('../config.json');

module.exports = {
    name: 'add',
    description: 'Adds the song to the song database to be played later',
    cooldown: 30,
    args: true,
    usage: '<name> <link> <start time in seconds> <duration in seconds> <volume between 0 and 1>',
    async execute(message, args) {
        if (!message.guild) return;

        const minimumReqArgs = 2;
        if (!args || args.length < minimumReqArgs) {
            return message.reply(`Please try again with the following usage:\n${prefix}add ${usage}`);
        }

        // Check for existing song

        const [ argName, argLink, argStart, argDuration, argVolume ] = args;
        const fixedStart = argStart ? `${argStart}s` : null;
        const argNameLower = argName.toLowerCase();
        const clampedVolume = Math.max(0, Math.min(1, argVolume));

        return await Sounds.create({
            name: argNameLower,
            link: argLink,
            duration: argDuration,
            start: fixedStart,
            volume: clampedVolume
        });
    }
};