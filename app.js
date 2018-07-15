const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);    
}

client.on('ready', () => {
    console.log(`Connected! Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}`);
    }

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply("There was an error trying to exectute that command.");
    }
});

client.login(token);
