// Music player logic
const musicPlayer = document.querySelector('.music-player');
if (musicPlayer) {
    const audio = new Audio('mp3/سورة المؤمنون.mp3');
    const playBtn = musicPlayer.querySelector('.music-btn.play');
    const prevBtn = musicPlayer.querySelector('.music-btn.prev');
    const nextBtn = musicPlayer.querySelector('.music-btn.next');
    const progress = musicPlayer.querySelector('.music-progress');
    const currentTimeEl = musicPlayer.querySelector('.current-time');
    const durationEl = musicPlayer.querySelector('.total-duration');

    // Intro overlay logic - first click starts audio and hides overlay
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        const handleFirstClick = () => {
            introOverlay.classList.add('hidden');
            audio.play().then(() => {
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }).catch(() => {
                // ignore play errors (e.g. browser restrictions)
            });
            introOverlay.removeEventListener('click', handleFirstClick);
        };
        introOverlay.addEventListener('click', handleFirstClick);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60) || 0;
        const seconds = Math.floor(time % 60) || 0;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // global volume slider (0 - 100)
    const volumeSlider = document.querySelector('.slider .level');

    // default volume
    if (volumeSlider) {
        const initial = parseFloat(volumeSlider.value) || 70;
        audio.volume = initial / 100;
    } else {
        audio.volume = 0.7;
    }

    audio.addEventListener('loadedmetadata', () => {
        progress.max = Math.floor(audio.duration);
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        progress.value = Math.floor(audio.currentTime);
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    });

    progress.addEventListener('input', () => {
        audio.currentTime = progress.value;
    });

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            const v = parseFloat(volumeSlider.value) || 0;
            audio.volume = v / 100;
        });
    }

    // Dummy previous/next behavior (same track, small seek)
    prevBtn.addEventListener('click', () => {
        audio.currentTime = Math.max(audio.currentTime - 10, 0);
    });

    nextBtn.addEventListener('click', () => {
        audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || audio.currentTime + 10);
    });
}
