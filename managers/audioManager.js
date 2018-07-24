const ytdl = require('ytdl-core');

let dispatcher;

module.exports = {
    playStream(connection, song) {
        this.stop();

        const stream = ytdl(song.link,  { format: 'audioonly', begin: song.start });
        dispatcher = connection.playStream(stream);
        
        dispatcher.on('error', err => {
            console.log(`Error playing file: ${err}`);
        })

        dispatcher.setVolume(song.volume || 0.4);
        dispatcher.resume();

        if (song.duration && song.duration > 0) {
            setTimeout(() => this.stop(), song.duration * 1000);
        }
    },

    setVolume(volume) {
        dispatcher.setVolume(volume);
    },

    pause() {
        if (dispatcher) {
            dispatcher.pause();
        }
    },

    resume() {
        if (dispatcher) {
            dispatcher.resume();
        }
    },

    stop() {
        if (dispatcher) {
            dispatcher.end();
        }
    }
}