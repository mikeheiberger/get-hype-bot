const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

sequelize.import('models/users');
const Sounds = sequelize.import('models/sounds');
const SoundsNew = sequelize.import('models/sounds_new');

const force = false; // process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    Sounds.findAll().then(async sounds =>
    {
        let migratedSounds = [];

        for (let i = 0; i < sounds.length; i++) {
            const currentSound = sounds[i];
            let startTime = currentSound.start;
            console.log(`Migrating : ${currentSound.name}`);
            if (currentSound.start) {
                console.log(`Old start sime: ${startTime}`);
                // Slicing off the s on this to make this an int for the new playback duration method
                startTime = currentSound.start.slice(0, -1);
                console.log(`New start time: ${startTime}`);
            }

            migratedSounds.push(
                SoundsNew.upsert({
                    name: currentSound.name,
                    link: currentSound.link,
                    start: startTime,
                    duration: currentSound.duration,
                    volume: currentSound.volume
                })
            );
        }

        await Promise.all(migratedSounds);
        console.log('Database synced');
        sequelize.close();
    });
}).catch(console.error);