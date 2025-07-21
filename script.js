// Elementos del DOM
const timerDisplay = document.getElementById('timer-display');
const phaseDisplay = document.getElementById('phase-display');
const roundDisplay = document.getElementById('round-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('btn-pause');
const resetBtn = document.getElementById('btn-reset');
const stopBtn = document.getElementById('btn-stop');

// Elementos de audio
const soundStart = document.getElementById('sound-start');
const soundEnd = document.getElementById('sound-end');
const soundStartRing = document.getElementById('sound-startRing') || new Audio('sounds/StartRing.mp3');

// Configuración de volumen
soundStart.volume = 0.9;  // Volumen para cuenta regresiva
soundEnd.volume = 1.0;    // Volumen para final
soundStartRing.volume = 1.0; // Volumen máximo para inicio

// Variables del temporizador
let workDuration, restDuration, totalRounds;
let currentRound = 1;
let isWorking = true;
let timeLeft = 0;
let timer = null;
let isPaused = false;
let isFirstRound = true; // Nueva variable para controlar el sonido inicial

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

  // Reiniciar estado
  currentRound = 1;
  isWorking = true;
  timeLeft = workDuration;
  isPaused = false;
  isFirstRound = true;
  
  // Configurar vista
  document.getElementById('preset-container').style.display = 'none';
  document.getElementById('timer-view').style.display = 'flex';
  updateDisplay();
  
  // Reproducir sonido de inicio SOLO en la primera ronda
  if (isFirstRound) {
    playSound(soundStartRing, 1.0);
    isFirstRound = false;
  }
  
  // Iniciar intervalo
  if (timer) clearInterval(timer);
  timer = setInterval(tick, 1000);
};

// Función principal del temporizador
function tick() {
  if (isPaused) return;
  
  timeLeft--;
  updateDisplay();
  
  // Sonido en 3, 2, 1 segundos
  if (timeLeft <= 3 && timeLeft > 0) {
    playSound(soundStart, 0.8);
  }
  
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
  playSound(soundEnd, 1.0);
}

function startNewRound() {
  isWorking = true;
  timeLeft = workDuration;
  updateDisplay();
  // Eliminado el playSound() aquí para que no suene en cada ronda
}

// Función para reproducir sonido con volumen específico
function playSound(soundElement, volume) {
  if (!soundElement) return;
  
  try {
    soundElement.currentTime = 0;
    soundElement.volume = volume;
    soundElement.play().catch(e => console.log('Error al reproducir sonido:', e));
  } catch (e) {
    console.error('Error con el elemento de audio:', e);
  }
}

// Reiniciar temporizador
function resetTimer() {
  isFirstRound = true; // Restablecer para que suene al reiniciar
  currentRound = 1;
  isWorking = true;
  timeLeft = workDuration;
  isPaused = false;
  
  updateDisplay();
  
  playSound(soundStartRing, 1.0);
  if (timer) clearInterval(timer);
  timer = setInterval(tick, 1000);
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