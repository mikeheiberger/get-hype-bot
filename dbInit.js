const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgresql://postgres:miy@motoS120@localhost:5432/get-hype-bot", {
    dialect: 'postgres'
});

sequelize.import('models/users');
const sounds = sequelize.import('models/sounds');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const startingSounds = [
        sounds.upsert({ name: 'scatman', link:  "https://www.youtube.com/watch?v=Hy8kmNEo1i8", duration: 15 }),
        sounds.upsert({ name: 'scatmansworld', link: "https://www.youtube.com/watch?v=7neipvZ_H0c", duration: 18 }),
        sounds.upsert({ name: 'dududu', link: "https://youtu.be/E4_mORQrsPY", start: 30, duration: 7 }),
        sounds.upsert({ name: 'hype', link: "https://www.youtube.com/watch?v=ah4VQXe8YqU" }),
        sounds.upsert({ name: 'ahhh', link: "https://www.youtube.com/watch?v=yBLdQ1a4-JI" }),
        sounds.upsert({ name: 'bag', link: "https://www.youtube.com/watch?v=kFDlxrHNsic", start: 11 }),
        sounds.upsert({ name: 'sadhorn', link: "https://www.youtube.com/watch?v=9Jz1TjCphXE" }),
        sounds.upsert({ name: 'goddamn', link: "https://www.youtube.com/watch?v=PTqtrGBYpxQ", volume: 1 }),
        sounds.upsert({ name: 'tryin', link: "https://www.youtube.com/watch?v=hMgHZ5dy918", start: 55, duration: 4, volume: 1 }),
        sounds.upsert({ name: 'werewolf', link: "https://www.youtube.com/watch?v=6gCj62KHG0g", start: 15, duration: 8 }),
    ];
    await Promise.all(startingSounds);
    console.log('Database synced');
    sequelize.close();
}).catch(console.error);