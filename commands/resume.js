const audioManager = require('../managers/audioManager');

module.exports = {
    name: 'resume',
    description: 'Resumes the current sound',
    execute(message, args) {
        audioManager.resume();
    }
}