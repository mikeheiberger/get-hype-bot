module.exports = {
    name: 'leave',
    description: 'Makes the bot leave any voice channel in a server',
    execute(message, args) {
        if (message.member) {
            const guildID = message.member.guild.id;

            if (message.client.voiceConnections.has(guildID)) {
                const channelToLeave = message.client.voiceConnections.get(guildID);
                channelToLeave.channel.leave();
            }
        }
    }
}