module.exports = (sequelize, DataTypes) => {
    return sequelize.define('sounds', {
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
            type: DataTypes.STRING,
            allowNull: true
        },
        volume: {
            type: DataTypes.RANGE(DataTypes.INTEGER),
            default: 1,
        }
    });
};