// Elementos del DOM
const timerDisplay = document.getElementById('timer-display');
const phaseDisplay = document.getElementById('phase-display');
const roundDisplay = document.getElementById('round-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('btn-pause');
const resetBtn = document.getElementById('btn-reset');
const stopBtn = document.getElementById('btn-stop');

// Elementos de audio
const soundStartRing = document.getElementById('sound-startRing'); // Sonido de inicio (2s)
const soundStart = document.getElementById('sound-start'); // Para doble pitido
const soundEnd = document.getElementById('sound-end'); // Sonido final

// Configuración de volumen
soundStartRing.volume = 1.0; // Máximo volumen para inicio
soundStart.volume = 0.8;     // Volumen para cambios
soundEnd.volume = 1.0;      // Volumen para final

// Variables del temporizador
let workDuration, restDuration, totalRounds;
let currentRound = 1;
let isWorking = true;
let timeLeft = 0;
let timer = null;
let isPaused = false;
let isFirstRound = true;

// Iniciar temporizador
startBtn.onclick = function() {
  // Obtener valores iniciales
  const work = parseInt(document.getElementById('custom-work').value);
  const rest = parseInt(document.getElementById('custom-rest').value);
  const rounds = parseInt(document.getElementById('custom-rounds').value);
  const workUnit = document.getElementById('custom-work-unit').value;
  const restUnit = document.getElementById('custom-rest-unit').value;

  // Calcular duraciones
  workDuration = workUnit === 'min' ? work * 60 : work;
  restDuration = restUnit === 'min' ? rest * 60 : rest;
  totalRounds = rounds;

  // Configurar estado inicial
  document.getElementById('preset-container').style.display = 'none';
  document.getElementById('timer-view').style.display = 'flex';
  
  currentRound = 1;
  isWorking = true;
  timeLeft = workDuration;
  isPaused = false;
  isFirstRound = true;
  
  updateDisplay();
  
  // Reproducir sonido de inicio (2 segundos) SOLO en primera ronda
  if (soundStartRing) {
    soundStartRing.currentTime = 0;
    soundStartRing.play();
    
    // Iniciar temporizador después de 2 segundos (duración del sonido)
    setTimeout(() => {
      timer = setInterval(tick, 1000);
    }, 2000);
  } else {
    timer = setInterval(tick, 1000);
  }
};

// Función principal del temporizador
function tick() {
  if (isPaused) return;
  
  timeLeft--;
  updateDisplay();
  
  // Cambio de fase
  if (timeLeft < 0) {
    if (isWorking) {
      if (restDuration > 0) {
        switchToRest();
      } else {
        nextRoundOrFinish();
      }
    } else {
      nextRoundOrFinish();
    }
  }
}

function switchToRest() {
  isWorking = false;
  timeLeft = restDuration;
  updateDisplay();
  // Doble pitido al cambiar fase
  playDoubleBeep();
}

function nextRoundOrFinish() {
  currentRound++;
  
  if (currentRound > totalRounds) {
    finishWorkout();
  } else {
    startNewRound();
  }
}

function finishWorkout() {
  clearInterval(timer);
  document.getElementById('timer-view').className = 'finished';
  document.body.className = 'finished';
  phaseDisplay.textContent = 'Terminado';
  timerDisplay.textContent = '00:00';
  roundDisplay.textContent = '';
  // Sonido final
  playSound(soundEnd);
}

function startNewRound() {
  isWorking = true;
  timeLeft = workDuration;
  updateDisplay();
  // Doble pitido al cambiar de ronda
  playDoubleBeep();
}

// Función para doble pitido
function playDoubleBeep() {
  if (!soundStart) return;
  
  soundStart.currentTime = 0;
  soundStart.play();
  
  setTimeout(() => {
    soundStart.currentTime = 0;
    soundStart.play();
  }, 300);
}

// Función para reproducir sonido
function playSound(soundElement) {
  if (!soundElement) return;
  soundElement.currentTime = 0;
  soundElement.play().catch(e => console.log('Error de sonido:', e));
}

// Reiniciar temporizador
function resetTimer() {
  isFirstRound = true; // Restablecer para sonido inicial
  isWorking = true;
  currentRound = 1;
  timeLeft = workDuration;
  isPaused = false;
  updateDisplay();
  
  // Reproducir sonido de inicio (2 segundos) al reiniciar
  if (soundStartRing) {
    soundStartRing.currentTime = 0;
    soundStartRing.play();
    
    setTimeout(() => {
      if (timer) clearInterval(timer);
      timer = setInterval(tick, 1000);
    }, 2000);
  } else {
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  }
}

// Actualizar la pantalla
function updateDisplay() {
  const displayTime = Math.max(0, timeLeft);
  const min = Math.floor(displayTime / 60).toString().padStart(2, '0');
  const sec = (displayTime % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
  
  phaseDisplay.textContent = isWorking ? 'Trabajo' : 'Descanso';
  roundDisplay.textContent = `Ronda ${currentRound} / ${totalRounds}`;
  
  const bgClass = isPaused ? 'paused' : (isWorking ? 'active-work' : 'active-rest');
  document.getElementById('timer-view').className = bgClass;
  document.body.className = bgClass;
}

// Controladores de eventos
pauseBtn.onclick = function() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Continuar' : 'Pausar';
  updateDisplay();
};

resetBtn.onclick = function() {
  resetTimer();
};

stopBtn.onclick = function() {
  clearInterval(timer);
  document.getElementById('preset-container').style.display = 'flex';
  document.getElementById('timer-view').style.display = 'none';
  document.body.className = '';
};