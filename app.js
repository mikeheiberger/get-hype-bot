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

let dispatcher;

client.on('ready', () => {
    logger.info(`Connected! Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === `ping`) {
        message.channel.send('Pong!');
    }
    else if (command === `server`) {
        message.channel.send(`This server's name is: ${message.guild.name}`);
    }
    else if (command === `join`) {
        if (!message.guild) return;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    logger.info(`Joined voice channel: ${message.member.voiceChannel.name}`);

                    dispatcher = connection.playFile(sounds[0]);

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
    else if (command === `leave`) {
        if (message.member) {
            const guildID = message.member.guild.id;
            logger.info(`Guild to leave: ${guildID}`);

            const allVCIDs = client.voiceConnections.keys();
            for (const key of allVCIDs) {
                logger.info(`Voice Connection key: ${key}`);
            };

            const clientIsInChannel = client.voiceConnections.has(guildID);
            logger.info(`Client in channel: ${clientIsInChannel}`);

            if (clientIsInChannel) {
                const channelToLeave = client.voiceConnections.get(guildID);
                channelToLeave.channel.leave();
            }
        }
    }
    else if (command === `play`) {
        if (dispatcher) {
            dispatcher.resume();
        }
    }
    else if (command === 'stop') {
        if (dispatcher) {
            dispatcher.pause();
        }
    }
});

client.login(token);
