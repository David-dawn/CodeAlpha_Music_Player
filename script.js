const songs = document.querySelectorAll('.song');
const audio = document.querySelector('.audio');
const searchInput = document.querySelector('#search');
const songTitleEl = document.getElementById('current-song-title');
const artistEl = document.getElementById('current-artist');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// Additional elements for controls
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeControl = document.getElementById('volume-control');

let currentSong = null;
let isShuffle = false;
let isRepeat = false;

// Shuffle functionality
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

// Repeat functionality
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

// Volume control functionality
volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value;
});

// Search filter functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    songs.forEach(song => {
        const songTitle = song.querySelector('h2').textContent.toLowerCase();
        if (songTitle.includes(searchTerm)) {
            song.style.display = 'flex';
        } else {
            song.style.display = 'none';
        }
    });
});

// Format time for display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress bar and time
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    progressBar.value = (currentTime / duration) * 100;
    currentTimeEl.textContent = formatTime(currentTime);
    if (duration) {
        durationEl.textContent = formatTime(duration);
    }
});

// Change the current time when progress bar is manually adjusted
progressBar.addEventListener('input', () => {
    const { duration } = audio;
    audio.currentTime = (progressBar.value / 100) * duration;
});

// Function to play the next song
function playNextSong() {
    let nextIndex = isShuffle ? Math.floor(Math.random() * songs.length) : [...songs].indexOf(currentSong) + 1;
    if (nextIndex >= songs.length) {
        nextIndex = 0; // Loop back to the first song
    }
    playSongAtIndex(nextIndex);
}

// Play song at a specific index
function playSongAtIndex(index) {
    const song = songs[index];
    const src = song.dataset.src;
    const songTitle = song.querySelector('h2').textContent;
    const artist = song.querySelector('p').textContent;

    audio.src = src;
    audio.play();
    
    // Update song info
    songTitleEl.textContent = songTitle;
    artistEl.textContent = artist;

    // Highlight current song
    if (currentSong) {
        currentSong.classList.remove('active');
    }
    song.classList.add('active');
    currentSong = song;
}

// Play/pause functionality for clicking a song
songs.forEach((song, index) => {
    song.addEventListener('click', () => {
        if (currentSong === song && !audio.paused) {
            audio.pause();
        } else {
            playSongAtIndex(index);
        }
    });
});

// Handle end of song: play next or repeat
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.play();
    } else {
        playNextSong();
    }
});
