const ytdl = require('ytdl-core');
const sounds = require('../sounds.json');

let currentDispatcher;

module.exports = {
    playStream(connection, songLink) {
        const stream = ytdl(songLink,  { format: 'audioonly', begin: song.start });
        currentDispatcher = connection.playStream(stream);
        
        dispatcher.on('error', err => {
            console.log(`Error playing file: ${err}`);
        })

        dispatcher.setVolume(0.4);
        dispatcher.resume();
    },
    setVolume(volume) {
        currentDispatcher.setVolume(volume);
    }
}