// const { Users, Sounds } = require('../managers/db');

// module.exports = {
//     name: 'sounds',
//     description: 'Lists the current sounds available to play',
//     cooldown: 30,
//     async execute(message, args) {
//         const sounds = await Sounds.findAll({
//             attributes: ['name']
//         });

//         if (!sounds) {
//             return message.reply('no sounds are currently in the database. Add one!');
//         }

//         return message.reply(`here are the current sounds you can play:\n${sounds.map(sound => sound.name).join('\n')}`);
//     }
// };