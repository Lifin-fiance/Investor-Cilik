// js/audio.js

/**
 * Plays a sound effect from an HTML audio element.
 * @param {string} soundId - The ID of the <audio> element to play.
 */
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Rewind to the start
        sound.play().catch(error => {
            // Autoplay can be blocked by the browser, so we catch the error.
            // A user interaction is usually required to play audio.
            console.error(`Could not play sound: ${soundId}`, error);
        });
    }
}

export { playSound };