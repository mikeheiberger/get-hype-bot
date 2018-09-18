const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

let dispatcher;

module.exports = {
    playStream(connection, song) {
        this.stop();
        
        let stream;

        const file = path.resolve(__dirname, '..', 'songs', `${song.name}.webm`);
        if (fs.existsSync(file)) {
            stream = fs.createReadStream(file);
            console.log('Playing stream from file');
        } else {
            let dlStream = ytdl(song.link, { 
                quality: 'highestaudio',
                filter: 'audioonly',
                highWaterMark: 1024 * 1024 * 10 // 10 megabytes
            });
            
            dlStream.on('info', (info, format) => {
                dlStream.pipe(
                    stream = fs.createWriteStream(
                        path.resolve(__dirname, '..', 'songs', `${song.name}.${format.container}`)));         
            });
        }

        stream.on('readable', () => {
            dispatcher = connection.playStream(stream, {
                seek: song.start
            });
            
            dispatcher.setVolume(song.volume || 0.4);

            dispatcher.on('error', err => {
                console.log(`Error playing file: ${err}`);
            })

            if (song.duration && song.duration > 0) {
                dispatcher.on('speaking', () => {
                    setTimeout(() => this.stop(), song.duration * 1000);
                });
            }
        });
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