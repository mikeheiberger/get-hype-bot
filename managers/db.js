const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

const Users = sequelize.import('../models/users');
const Sounds = sequelize.import('../models/sounds');

// Users.prototype.addItem = async function(item) {
//     const userItem = await UserItems.findOne({
//         where: { user_id: this.user_id, item_id: item.id }
//     });

//     if (userItem) {
//         userItem.amount += 1;
//         return userItem.save();
//     }

//     return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
// };

// Users.prototype.getItems = function() {
//     return UserItems.findAll({
//         where: { user_id: this.user_id },
//         include: ['item']
//     });
// }

module.exports = { Users, Sounds };