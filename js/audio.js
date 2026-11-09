
document.querySelectorAll(".audio-player").forEach(player => {

    const audio = player.querySelector(".audio");
    const playButton = player.querySelector(".audio-play");
    const playIcon = player.querySelector(".play-icon");
    const timeline = player.querySelector(".audio-timeline");

    const currentTimeDisplay = player.querySelector(".current-time");
    const durationDisplay = player.querySelector(".duration");

    // Format time

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

    // Update icon

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

    // Update timeline

    audio.addEventListener("timeupdate", () => {

        const progress = (audio.currentTime / audio.duration) * 100;

        timeline.value = progress || 0;

        currentTimeDisplay.textContent = formatTime(audio.currentTime);

    });

    // Seek audio

    timeline.addEventListener("input", () => {

        if (Number.isFinite(audio.duration)) {
            audio.currentTime = (timeline.value / 100) * audio.duration;
        }

    });

    // Reset when finished

    audio.addEventListener("ended", () => {

        timeline.value = 0;
        currentTimeDisplay.textContent = "0:00";

    });

    // Debugging

    audio.addEventListener("loadedmetadata", () => {
        console.log("Audio loaded:", audio.querySelector("source").src);
    });

    audio.addEventListener("error", () => {
        console.error("Audio failed:", audio.querySelector("source").src, audio.error);
    });

});
