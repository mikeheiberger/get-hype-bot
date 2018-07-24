const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const { Users, Sounds } = require('./managers/db');
const { Op } = require('sequelize');
const { prefix, default_cd } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);    
}

process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));

const cooldowns = new Discord.Collection();

// const currency = new Discord.Collection();
// Reflect.defineProperty(currency, 'add', {
//     value: async function add(id, amount) {
//         const user = currency.get(id);
//         if (user) {
//             user.balance += Number(amount);
//             return user.save();
//         }
        
//         const newUser = await Users.create({ user_id: id, balance: amount });
//         currency.set(id, newUser);
//         return newUser;
//     }
// });

// Reflect.defineProperty(currency, 'getBalance', {
//     value: function getBalance(id) {
//         const user = currency.get(id);
//         return user ? user.balance : 0;
//     }
// });

client.on('ready', async () => {
    // const storedBalances = await Users.findAll();
    // storedBalances.forEach(b => currency.set(b.user_id, b));
    console.log(`Connected! Logged in as: ${client.user.tag}`);
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) 
    return;
    
    // currency.add(message.author.id, 1);

    const messageContent = message.content.toLowerCase();

    const args = messageContent.slice(prefix.length).split(/ +/);
    const commandName = args.shift();

    if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
        
        // Check for required command roles
        if (command.roles && command.roles.length) {
            if (!message.member) {
                return message.channel.send(`Only server members are allowed to use that command ${message.author}.`);
            }
            
            const rolesIntersection = message.member.roles
            .filter(role => command.roles.includes(role.name));
            
            if (rolesIntersection.size === 0) {
                return message.channel.send(`You do not have the correct server role to execute \`${prefix}${command.name}\``);
            }
        }
        
        // Check for arguments
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}`;
            
            if (command.usage) {
                reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``;
            }
            
            return message.channel.send(reply);
        }
        
        // Check cooldown
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || default_cd) * 1000;
        
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        } else {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            
            if (now < expirationTime && !process.env.DEBUG) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before trying the \`${command.name}\` command again.`);
            }
            
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        
        try {
            command.execute(message, args);
        }
        catch (error) {
            console.error(error);
            message.reply("there was an error trying to exectute that command.");
        }
    }
    else {
        message.reply('that command does not exist');
    }
});

client.login(process.env.api_key);
