const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

const Users = sequelize.import('../models/users');
const Sounds = sequelize.import('../models/sounds');

module.exports = { Users, Sounds };