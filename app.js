const fs = require('fs');
const util = require('util');
const Sequelize = require('sequelize');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);    
}

// const sequelize = new Sequelize('database', 'user', 'password', {
//     host: 'localhost',
//     dialect: 'sqlite',
//     logging: false,
//     operatorsAliases: false,
//     //SQLite only
//     storage: 'database.sqlite'
// });

/*
* equivalent to: CREATE TABLE tags(
* name VARCHAR(255)
* description TEXT,
* username VARCHAR(255)
* usage INT
* );
*/
// const Tags = sequelize.define('tags', {
//     name: {
//         type: Sequelize.STRING,
//         unique: true,
//     },
//     description: Sequelize.TEXT,
//     username: Sequelize.STRING,
//     usage_count: {
//         type: Sequelize.INTEGER,
//         defaultValue: 0,
//         allowNull: false
//     }
// });

const cooldowns = new Discord.Collection();
const defaultCooldownSecs = 3;

client.on('ready', () => {
    console.log(`Connected! Logged in as: ${client.user.tag}`);
    // Tags.sync();
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    const messageContent = message.content.toLowerCase();

    const args = messageContent.slice(prefix.length).split(/ +/);
    const commandName = args.shift();

    if (!client.commands.has(commandName)) {
        if (commandName === 'addtag') {
            const tagName = args.shift();
            const tagDesc = args.join(' ');

            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const tag = await Tags.create({
                    name: tagName,
                    description: tagDesc,
                    username: message.author.username
                });
                return message.reply(`Tag ${tag.name} added`);
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('that tag already exists');
                }
                console.log(util.inspect(e, false, null));
                return message.reply('something went wrong with adding a tag.');
            }
        }
        else if (commandName === 'tag') {
            try {
                const tagName = args.shift();
                
                // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
                const tag = await Tags.findOne({ where: { name: tagName } });
                if (tag) {
                    // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
                    tag.increment('usage_count');
                    return message.channel.send(tag.get('description'));
                }
                return message.reply(`could not find tag: ${tagName}`);
            }
            catch (e) {
                return message.reply('something when wrong with finding the tag');
            }
        }
        else if (commandName === 'edittag') {
            const tagName = args.shift();
            const tagDesc = args.join(' ');

            // equivalent to UPDATE tags (description) values (?) WHERE name='?';
            const affectedRows = await Tags.update({ description: tagDesc }, { where: { name: tagName } });
            if (affectedRows > 0) {
                return message.reply(`tag ${tagName} was edited`);
            }
            return message.reply(`could not find a tag with name ${tagName}`);
        }
        else if (commandName === 'taginfo') {
            const tagName = args;

            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await Tags.findOne({ where: { name: tagName } });
            if (tag) {
                return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
            }
            return message.reply(`could not find tag: ${tagName}`);
        }
        else if (commandName === 'showtags') {
            // equivalent to: SELECT name FROM tags;
            const tagList = await Tags.findAll({ attributes: ['name'] });
            const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
            return message.channel.send(`List of tags: ${tagString}`);
        }
        else if (commandName === 'removetag') {
            const tagName = args;

            // equivalent to: DELETE from tags WHERE name = ?;
            const rowCount = await Tags.destroy({ where: { name: tagName } });
            if (!rowCount) return message.reply('that tag does not exist');

            return message.reply(`${tagName} deleted`);
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
            message.reply("There was an error trying to exectute that command.");
        }
    }
});

client.login(process.env.api_key);
