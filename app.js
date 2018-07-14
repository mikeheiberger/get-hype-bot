const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');
const { prefix, token, sounds } = require('./config.json');

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
    else if (message.content == `${prefix}join`) {
        if (!message.guild) return;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    logger.info(`Joined voice channel: ${message.member.voiceChannel.name}`);

                    const dispatcher = connection.playFile(sounds[0]);

                    dispatcher.on('error', err => {
                        logger.info(`Error playing file: ${err}`);
                    })

                    dispatcher.setVolume(0.1);
                    dispatcher.resume();
                })
                .catch(logger.error);
        } else {
            message.channel.send('You need to join a voice channel first');
        }
    }
    else if (message.content == `${prefix}leave`) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave();
        }
    }
});

client.login(token);
