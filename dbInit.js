const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:miy@motoS120@localhost:5432/get-hype-bot', {
    dialect: 'postgres'
});

sequelize.import('models/users');
const sounds = sequelize.import('models/sounds');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const startingSounds = [
        sounds.upsert({ name: 'scatman', link:  "https://www.youtube.com/watch?v=Hy8kmNEo1i8", duration: 15 }),
        sounds.upsert({ name: 'scatmansworld', link: "https://www.youtube.com/watch?v=7neipvZ_H0c", duration: 18 }),
        sounds.upsert({ name: 'dududu', link: "https://youtu.be/E4_mORQrsPY", start: "30s", duration: 7 })
    ];
    await Promise.all(startingSounds);
    console.log('Database synced');
    sequelize.close();
}).catch(console.error);