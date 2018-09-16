module.exports = (sequelize, DataTypes) => {
    return sequelize.define('sounds_new', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            default: -1
        },
        start: {
            type: DataTypes.INTEGER,
            default: 0
        },
        volume: {
            type: DataTypes.INTEGER,
            default: 1,
        },
        server: {
            type: DataTypes.STRING,
            allowNull: true,
            default: null
        }
    });
};