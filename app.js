const STATE = {
    ARRIVAL: 'arrival',
    TRANSITION: 'transition',
    LISTENING: 'listening',
    TRANSFER: 'transfer',
    EXIT: 'exit'
};

let currentState = STATE.ARRIVAL;
let audioStarted = false;
let transferShown = false;
let audioEnded = false;
let videoHasPlayed = false;

const arrivalEl = document.getElementById('arrival');
const transitionEl = document.getElementById('transition');
const listeningEl = document.getElementById('listening');
const transferEl = document.getElementById('transfer');
const exitEl = document.getElementById('exit');

const characterImage = document.getElementById('character-image');
const characterVideo = document.getElementById('character-video');
const receiveBtn = document.getElementById('receive-btn');
const transitionText = document.getElementById('transition-text');
const nightAudio = document.getElementById('night-audio');
const sendBtn = document.getElementById('send-btn');
const exitCharacterContainer = document.getElementById('exit-character-container');
const exitText = document.getElementById('exit-text');

function setState(newState) {
    const allStates = [arrivalEl, transitionEl, listeningEl, transferEl, exitEl];
    allStates.forEach(state => state.classList.add('hidden'));
    
    currentState = newState;
    
    switch(newState) {
        case STATE.ARRIVAL:
            arrivalEl.classList.remove('hidden');
            break;
        case STATE.TRANSITION:
            transitionEl.classList.remove('hidden');
            break;
        case STATE.LISTENING:
            listeningEl.classList.remove('hidden');
            break;
        case STATE.TRANSFER:
            transferEl.classList.remove('hidden');
            break;
        case STATE.EXIT:
            exitEl.classList.remove('hidden');
            break;
    }
}

function checkAdSource() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('src') === 'ad';
}

function handleArrival() {
    trackArrival();
    
    characterVideo.loop = false;
    characterVideo.setAttribute('loop', 'false');
    
    if (checkAdSource()) {
        characterImage.style.opacity = '0';
        characterImage.style.visibility = 'hidden';
        characterVideo.classList.add('visible');
        
        const tryPlay = () => {
            characterVideo.play().then(() => {
                videoHasPlayed = true;
            }).catch(() => {
                setTimeout(tryPlay, 100);
            });
        };
        
        characterVideo.addEventListener('loadedmetadata', () => {
            tryPlay();
        }, { once: true });
        
        if (characterVideo.readyState >= 2) {
            tryPlay();
        }
        
        characterVideo.addEventListener('ended', () => {
            characterVideo.pause();
            characterVideo.removeAttribute('autoplay');
            if (characterVideo.duration > 0) {
                characterVideo.currentTime = Math.max(0, characterVideo.duration - 0.1);
            }
        }, { once: true });
    } else {
        characterVideo.classList.add('hidden');
        characterVideo.style.display = 'none';
    }
}

function handleReceive() {
    characterImage.classList.add('fade-out');
    characterVideo.classList.add('fade-out');
    characterVideo.classList.add('hidden');
    
    document.body.style.backgroundColor = '#050505';
    
    setTimeout(() => {
        characterImage.style.display = 'none';
        characterVideo.style.display = 'none';
        setState(STATE.TRANSITION);
        showTransitionMessages();
    }, 2000);
}

function showTransitionMessages() {
    const messages = [
        "You're not alone here.",
        "Stay for a bit.",
        "There's nothing you need to do."
    ];
    
    let messageIndex = 0;
    
    function showNextMessage() {
        if (messageIndex >= messages.length) {
            setTimeout(() => {
                startAudio();
            }, 500);
            return;
        }
        
        transitionText.textContent = messages[messageIndex];
        transitionText.classList.add('visible');
        
        setTimeout(() => {
            transitionText.classList.remove('visible');
            messageIndex++;
            
            if (messageIndex < messages.length) {
                setTimeout(showNextMessage, 500);
            } else {
                setTimeout(() => {
                    startAudio();
                }, 500);
            }
        }, 2500);
    }
    
    setTimeout(showNextMessage, 500);
}

function startAudio() {
    characterImage.style.display = 'none';
    characterVideo.style.display = 'none';
    setState(STATE.LISTENING);
    nightAudio.play();
    audioStarted = true;
    trackAudioStart();
    
    setupAudioListeners();
}

function setupAudioListeners() {
    ensureVisualsHidden();
    
    nightAudio.addEventListener('timeupdate', () => {
        const currentTime = nightAudio.currentTime;
        
        if (!transferShown && currentTime >= 20 && currentTime <= 25) {
            showTransfer();
        }
        
        ensureVisualsHidden();
    });
    
    nightAudio.addEventListener('ended', () => {
        handleAudioEnd();
    });
    
    listeningEl.addEventListener('click', () => {
        if (nightAudio.paused) {
            nightAudio.play();
        } else {
            nightAudio.pause();
        }
    });
}

function showTransfer() {
    if (transferShown) return;
    
    transferShown = true;
    transferEl.classList.remove('hidden');
    transferEl.classList.add('visible');
    trackTransferShown();
}

function handleSend(e) {
    e.stopPropagation();
    trackTransferClicked();
    
    const shareText = "I'm sending you Nindra Nandan for tonight.\nYou don't have to reply.\nJust listen if you're awake.";
    
    if (navigator.share) {
        navigator.share({
            title: 'Nindra Nandan',
            text: shareText
        }).catch(() => {
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    const url = window.location.origin + window.location.pathname;
    const fullText = `${text}\n\n${url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(fullText).then(() => {
            alert('Link copied to clipboard');
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Link copied to clipboard');
    }
}

function handleAudioEnd() {
    if (audioEnded) return;
    
    audioEnded = true;
    trackAudioCompleted();
    
    document.body.style.backgroundColor = '#030303';
    
    setTimeout(() => {
        setState(STATE.EXIT);
        
        setTimeout(() => {
            exitCharacterContainer.classList.add('visible');
            
            setTimeout(() => {
                exitText.classList.add('visible');
            }, 1000);
        }, 500);
    }, 5000);
}

function ensureVisualsHidden() {
    characterImage.style.display = 'none';
    characterImage.style.opacity = '0';
    characterImage.style.visibility = 'hidden';
    characterVideo.style.display = 'none';
    characterVideo.style.opacity = '0';
    characterVideo.style.visibility = 'hidden';
    characterVideo.classList.add('hidden');
}

receiveBtn.addEventListener('click', handleReceive);
sendBtn.addEventListener('click', handleSend);

handleArrival();

