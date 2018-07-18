const fs = require('fs');
const Sequelize = require('sequelize');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);    
}

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    //SQLite only
    storage: 'database.sqlite'
});

/*
* equivalent to: CREATE TABLE tags(
* name VARCHAR(255)
* description TEXT,
* username VARCHAR(255)
* usage INT
* );
*/
const Tags = sequelize.define('tags', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    descrption: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

const cooldowns = new Discord.Collection();
const defaultCooldownSecs = 3;

client.on('ready', () => {
    console.log(`Connected! Logged in as: ${client.user.tag}`);
    Tags.sync();
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) {
        if (commandName === 'addtag') {
            const splitArgs = args.split(' ');
            const tagName = splitArgs.shift();
            const tagDesc = splitArgs.join(' ');

            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const tag = await Tags.create({
                    name: tagName,
                    descrption: tagDesc,
                    username: message.author.username
                });
                return message.reply(`Tag ${tag.name} added`);
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('That tag already exists');
                }
                return message.reply('Something went wrong with adding a tag.');
            }
        }
        else if (commandName === 'tag') {
            const tagName = args;

            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await Tags.findOne({ where: { name: tagName } });
            if (tag) {
                // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
                tag.increment('usage_count');
                return message.channel.send(tag.get('description'));
            }
            return message.reply(`Could not find tag: ${tagName}`);
        }
        else if (commandName === 'edittag') {

        }
        else if (commandName === 'taginfo') {

        }
        else if (commandName === 'showtags') {

        }
        else if (commandName === 'removetag') {

        }
    }
    else {

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
        const cooldownAmount = (command.cooldown || defaultCooldownSecs) * 1000;
        
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        } else {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            
            if (now < expirationTime) {
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
            message.reply("There was an error trying to exectute that command.");
        }
    }
});

client.login(process.env.api_key);
