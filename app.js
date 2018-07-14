const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');
const auth = require('./auth.json');

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

client.on('message', msg => {
    if (msg.content.substring(0, 1) === '!') {
        let args = msg.content.substring(1).split(' ');
        const cmd = args[0];

        switch(cmd) {
            case 'ping':
                msg.reply('pong');
            break;
        }
    }
});

client.login(auth.token);
