
const audio = document.getElementById("audio");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");

const timeline = document.getElementById("audioTimeline");

const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

// Format seconds into minutes and seconds

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Play / pause

playButton.addEventListener("click", () => {

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }

});

// Update play button icon

function updatePlayButton() {

    if (audio.paused) {

        playIcon.innerHTML =
            '<path d="M7 4.5 L19 12 L7 19.5 Z"/>';

        playButton.setAttribute("aria-label", "Play audio");

    } else {

        playIcon.innerHTML =
            '<path d="M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z"/>';

        playButton.setAttribute("aria-label", "Pause audio");
    }
}

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("ended", updatePlayButton);

// Load duration

audio.addEventListener("loadedmetadata", () => {

    durationDisplay.textContent = formatTime(audio.duration);

});

// Update timeline and current time

audio.addEventListener("timeupdate", () => {

    const progress = (audio.currentTime / audio.duration) * 100;

    timeline.value = progress || 0;

    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);

});

// Seek through audio

timeline.addEventListener("input", () => {

    if (Number.isFinite(audio.duration)) {
        audio.currentTime =
            (timeline.value / 100) * audio.duration;
    }

});

// Reset when audio ends

audio.addEventListener("ended", () => {

    timeline.value = 0;
    currentTimeDisplay.textContent = "0:00";

});
