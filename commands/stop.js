const audioManager = require('../managers/audioManager');

module.exports = {
    name: 'stop',
    description: 'Ends the current sound',
    execute(message, args) {
        audioManager.stop();
    }
}