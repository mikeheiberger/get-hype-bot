const audioManager = require('../managers/audioManager');

module.exports = {
    name: 'pause',
    description: 'Pauses the current sound',
    execute(message, args) {
        audioManager.pause();
    }
}