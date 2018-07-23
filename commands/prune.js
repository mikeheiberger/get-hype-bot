module.exports = {
    name: "prune",
    description: "Deletes the provided number of the messages from the current channel",
    args: true,
    usage: '<number>',
    cooldown: 10,
    roles: [ 'admin' ],
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('you need to input a number between 1 and 99');
        } else {
            message.channel.bulkDelete(amount, true)
                .catch(err => {
                    console.error(err);
                });
        }
    }
}