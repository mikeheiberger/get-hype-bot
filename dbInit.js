const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:miy@motoS120@localhost:5432/get-hype-bot', {
    dialect: 'postgres'
});

const CurrencyShop = sequelize.import('models/currencyShop');
sequelize.import('models/users');
sequelize.import('models/userItems');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const shop = [
        CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
        CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
        CurrencyShop.upsert({ name: 'Cake', cost: 5 })
    ];
    await Promise.all(shop);
    console.log('Database synced');
    sequelize.close();
}).catch(console.error);