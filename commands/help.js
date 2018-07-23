const { prefix, default_cd } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Provides help for the specified command',
    cooldown: 5,
    usage: '<command>',
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            // Message the user with available commands
            data.push('Here\'s a list of available commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`You can send \`${prefix}help [command name]\` to get help with a specific command.`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all available commands.');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}`, error);
                    message.reply('it seems I can\'t DM you. Do you have DMs disabled?');
                });
        } 

        // show help for the specific command
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName);

        if (!command) {
            return message.reply('that\'s not a valid command.');
        }

        data.push(`**Name:** ${commandName}`);

        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        data.push(`**Cooldown:** ${command.cooldown || default_cd} second(s)`);

        message.channel.send(data, { split: true });
    }
}