const ytdl = require('ytdl-core');

let dispatcher;

module.exports = {
    playStream(connection, song) {
        this.stop();

        
        const stream = ytdl(song.link,  { format: 'audioonly' });
        dispatcher = connection.playStream(stream, {
            seek: song.start
        });

        dispatcher.pause();

        dispatcher.on('error', err => {
            console.log(`Error playing file: ${err}`);
        })
        
        dispatcher.setVolume(song.volume || 0.4);

        if (song.duration && song.duration > 0) {
            dispatcher.on('speaking', () => {
                setTimeout(() => this.stop(), song.duration * 1000);
            });
        }

        dispatcher.resume();
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