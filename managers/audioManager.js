const ytdl = require('ytdl-core');

let dispatcher;

module.exports = {
    playStream(connection, song) {
        const stream = ytdl(song.link,  { format: 'audioonly', begin: song.start });
        dispatcher = connection.playStream(stream);
        
        dispatcher.on('error', err => {
            console.log(`Error playing file: ${err}`);
        })

        dispatcher.setVolume(song.volume || 0.4);
        dispatcher.resume();

        if (song.duration) {
            setTimeout(() => dispatcher.end(), song.duration * 1000);
        }
    },
    setVolume(volume) {
        dispatcher.setVolume(volume);
    }
}