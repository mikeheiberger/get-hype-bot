const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');
const { prefix, token } = require('./config.json');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            colorize: true,
            level: 'debug'
        })
    ]
});

client.on('ready', () => {
    logger.info(`Connected! Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.content === `${prefix}ping`) {
        message.channel.send('Pong!');
    }
    else if (message.content === `${prefix}server`) {
        message.channel.send(`This server's name is: ${message.guild.name}`);
    }
});

client.login(token);
