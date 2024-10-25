const data = [
    {
        id: 1,
        artist: 'Audioslave',
        song: "I'm the Highway",
        img: 'assets/images/audioslave-cover.jpg',
        src: 'assets/music/audioslave.m4a'
    },
    {
        id: 2,
        artist: 'Collective Soul',
        song: "December",
        img: 'assets/images/collective-cover.jpg',
        src: 'assets/music/collective.m4a'
    },
    {
        id: 3,
        artist: 'U2',
        song: "Sleep like a baby tonight",
        img: 'assets/images/u2-cover.jpg',
        src: 'assets/music/u2.m4a'
    },
    {
        id: 4,
        artist: 'Nickelback',
        song: "Good times gone",
        img: 'assets/images/nickelback-cover.jpg',
        src: 'assets/music/nickelback.m4a'
    },
    {
        id: 5,
        artist: 'Soundgarden',
        song: "Fell on black days",
        img: 'assets/images/soundgarden-cover.jpg',
        src: 'assets/music/soundgarden.m4a'
    }
]

const albumCover = document.querySelector('.track-cover');
const albumCoverUnderVinyl = document.querySelector('.album-cover');
const nameOfSong = document.querySelector('.active-track-name');
const songDuration = document.querySelector('.time-rest');
const playIconCurrent = document.querySelector('.play .play.icon');
const prevIcon = document.querySelector('.arrow-left.icon')
const nextIcon = document.querySelector('.arrow-right.icon')
const vinyl = document.querySelector('.vinyl');
const songs = document.querySelector('.list');
const songsList = document.querySelectorAll('tr');
const progress = document.querySelector('.track input');
const timePassed = document.querySelector('.time-passed');
const timeRest = document.querySelector('.time-rest');
const pauseIcon = '<img alt="pause" src="assets/images/pause.png">' 
const playIcon = '<img alt="play" src="assets/images/play.png">'
const volume = document.querySelector('.sound-volume');
let newData = [];
let currentSong;
let currentVolume = 0.5;
let isPlaying = false;
let currentAudio;

function initPlayer() {
    if (newData.length > 0) {
        currentSong = newData[0]; 
        setCurrentSong(currentSong.id);
      }
}


function initListeners() {
    songs.addEventListener('click', (event) => handleList(event));
    volume.addEventListener('change', (event) => handleVolume(event));

}

function renderAudio() {
    let loadedSongs = 0;
  
    data.forEach((song) => {
    const audio = new Audio(song.src);

    audio.addEventListener('loadeddata', () => {
      const newSong = { ...song, duration: audio.duration, audio };
      newData = [...newData, newSong];
      loadedSongs++;

      if (loadedSongs === data.length) {
        initPlayer(); 
        initListeners(); 
        handleControls();
      }
    });
  });
}



function handleList({ target }) {
    const span = target.closest('span');
    if (!span) return;
    const id = span.id;
    if (!id) return;
    if (currentAudio) {
        currentAudio.pause(); 
        resetProgressBar();
    }
    setCurrentSong(id);

}

function findSong(songId) {
    const song = newData.find(({ id }) => Number(id) === Number(songId));
    if (!song) return;
    return song;
}


function setCurrentSong(songId) {

    const current = findSong(songId);
    if (!current) return;
    currentSong = current;
    showCurrentSong(current);
    currentAudio = current.audio;
    currentAudio.volume = currentVolume;
    

    handleControls();
    handleProgress(current);
    showCurrentInList();
    
        
    setTimeout(() => {
        playToggle();

    }, 5);
}

const timeFormat = (time) => time < 10 ? `0${time}` : time;

function showCurrentSong(item) {
    albumCover.innerHTML = `<img alt="album-cover" src=${item.img}>`;
    albumCoverUnderVinyl.innerHTML = `<img alt="album-cover" src=${item.img}>`;
    nameOfSong.innerHTML = `${item.artist} - ${item.song}`;
    songDuration.innerHTML = `${timeFormat(Math.floor(item.duration / 60))}:${timeFormat(Math.floor(item.duration % 60))}`;
    document.body.style.backgroundImage = `url(${item.img})`;
}

function playSong() {
    const audio = currentSong.audio;
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        showPaused();
    } else {
        audio.play();
        isPlaying = true;
        showPlaying();
    }
    playIconCurrent.classList.toggle('paused', !isPlaying);

}

function pauseSong() {
    const audio = currentSong.audio;
    if (!audio) return;
    audio.pause()
    
}

function playToggle() {
    if (isPlaying) {
        currentSong.audio.play();
    } else {
        currentSong.audio.pause();
    }
    playIconCurrent.classList.toggle('paused', !isPlaying);
}

function showPlaying() {
    playIconCurrent.innerHTML = pauseIcon;
    vinyl.classList.add('rotate');
}

function showPaused() {
    playIconCurrent.innerHTML = playIcon;
    vinyl.classList.remove('rotate');

}

function setPrevious() {
    if (currentAudio) {
        currentAudio.pause(); 
        resetProgressBar();
    }
    const currentInList = document.querySelector(`[data-id="${currentSong.id}"]`)
    const previousSong = currentInList.previousElementSibling;
    if (!previousSong) {
        currentSong = songs.lastElementChild;
    } else {
        currentSong = previousSong;
    }
    setCurrentSong(currentSong.id);
}

function setNext() {
    if (currentAudio) {
        currentAudio.pause(); 
        resetProgressBar();
    }
    const currentInList = document.querySelector(`[data-id="${currentSong.id}"]`)
    const nextSong = currentInList.nextElementSibling;
    if (!nextSong) {
        currentSong = songs.firstElementChild;
    } else {
        currentSong = nextSong;
    }
    setCurrentSong(currentSong.id);
}


function handleControls() {
    playIconCurrent.addEventListener('click', playSong);
    prevIcon.addEventListener('click', setPrevious);
    nextIcon.addEventListener('click', setNext)
}

function resetProgressBar() {
    currentAudio.currentTime = 0;
    progress.setAttribute('value', 0);
}

function updateTimes(currentTime, duration) {
    const rest = duration - currentTime;
    timePassed.innerHTML = `${timeFormat(Math.floor(currentTime / 60))}:${timeFormat(Math.floor(currentTime % 60))}`;
    timeRest.innerHTML = `${timeFormat(Math.floor(rest / 60))}:${timeFormat(Math.floor(rest % 60))}`;
}

function handleProgress({ audio, duration }) {
    audio.addEventListener('timeupdate', ({ target }) => {
        const { currentTime } = target;
        const valueTime = (currentTime * 100) / duration;
        progress.value = valueTime;
        updateTimes(currentTime, duration);
    });

    progress.addEventListener('input', ({ target: { value } }) => {
        const seekTime = (value / 100) * audio.duration; 
        audio.currentTime = seekTime;
        progress.value = value;
        updateTimes(seekTime, duration);
    });

    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        progress.setAttribute('value', 0);
        setNext();
    });

    audio.addEventListener('loadstart', () => {
        audio.currentTime = 0;
        progress.setAttribute('value', 0);
        console.log(progress.value);
    });
}


function handleVolume({ target: { value } }) {
    currentVolume = value;
    currentSong.audio.volume = value;
}


function showCurrentInList() {

    for (let song of songs.children) {
        song.classList.remove('active-song');
        if (+song.id === +currentSong.id) {
            song.classList.add('active-song');
        } 
    }
}

renderAudio();

