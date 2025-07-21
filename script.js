// Obtener referencias a los elementos del DOM
const timerDisplay = document.getElementById('timer-display');
const phaseDisplay = document.getElementById('phase-display');
const roundDisplay = document.getElementById('round-display');

const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('btn-pause');
const resetButton = document.getElementById('btn-reset');
const stopButton  = document.getElementById('btn-stop');

// Cargar sonidos
const soundStart = document.getElementById('sound-start'); // beep 3-2-1
const soundEnd = document.getElementById('sound-end');

// Variables del temporizador
let workSeconds, restSeconds, totalRounds;
let currentRound = 1;
let isWorking = true;
let timeLeft = 0;
let intervalId = null;
let paused = false;

// Función para iniciar
startButton.addEventListener('click', () => {
  const work = parseInt(document.getElementById('custom-work').value);
  const rest = parseInt(document.getElementById('custom-rest').value);
  const rounds = parseInt(document.getElementById('custom-rounds').value);

  const workUnit = document.getElementById('custom-work-unit').value;
  const restUnit = document.getElementById('custom-rest-unit').value;

  workSeconds = workUnit === 'min' ? work * 60 : work;
  restSeconds = restUnit === 'min' ? rest * 60 : rest;
  totalRounds = rounds;

  currentRound = 1;
  isWorking = true;
  paused = false;
  timeLeft = workSeconds;

  document.getElementById('preset-container').style.display = 'none';
  document.getElementById('timer-view').style.display = 'flex';
  document.getElementById('timer-view').className = 'active-work';
  document.body.className = 'active-work';

  updateTimerDisplay();
  updateRoundDisplay();

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(tick, 1000);
});

// Pausar
pauseButton.addEventListener('click', () => {
  paused = !paused;
  if (paused) {
    clearInterval(intervalId);
    document.getElementById('timer-view').className = 'paused';
    document.body.className = 'paused';
    pauseButton.textContent = 'Continuar';
  } else {
    intervalId = setInterval(tick, 1000);
    document.getElementById('timer-view').className = isWorking ? 'active-work' : 'active-rest';
    document.body.className = isWorking ? 'active-work' : 'active-rest';
    pauseButton.textContent = 'Pausar';
  }
});

// Reiniciar ronda actual
resetButton.addEventListener('click', () => {
  timeLeft = isWorking ? workSeconds : restSeconds;
  updateTimerDisplay();
});

// Detener y volver al inicio
stopButton.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  document.getElementById('preset-container').style.display = 'flex';
  document.getElementById('timer-view').style.display = 'none';
  document.body.className = '';
  document.getElementById('timer-view').className = '';
});

// Tick
function tick() {
  if (timeLeft <= 0) {
    if (isWorking) {
      if (restSeconds > 0) {
        isWorking = false;
        timeLeft = restSeconds;
        document.getElementById('timer-view').className = 'active-rest';
        document.body.className = 'active-rest';
        phaseDisplay.textContent = 'Descanso';
        soundStart.currentTime = 0;
        soundStart.play();
      } else {
        nextRoundOrFinish();
      }
    } else {
      nextRoundOrFinish();
    }
  } else {
    // beep en los últimos 3, 2, 1 segundos
    if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
      soundStart.currentTime = 0;
      soundStart.play();
    }

    timeLeft--;
    updateTimerDisplay();
  }
}

function nextRoundOrFinish() {
  currentRound++;
  if (currentRound > totalRounds) {
    clearInterval(intervalId);
    document.getElementById('timer-view').className = 'finished';
    document.body.className = 'finished';
    phaseDisplay.textContent = 'Fin del entrenamiento';
    timerDisplay.textContent = '00:00';
    roundDisplay.textContent = '';
    soundEnd.currentTime = 0;
    soundEnd.play();
  } else {
    isWorking = true;
    timeLeft = workSeconds;
    document.getElementById('timer-view').className = 'active-work';
    document.body.className = 'active-work';
    phaseDisplay.textContent = 'Trabajo';
    updateRoundDisplay();
    soundStart.currentTime = 0;
    soundStart.play();
  }
}

function updateTimerDisplay() {
  const min = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const sec = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

function updateRoundDisplay() {
  roundDisplay.textContent = `Ronda ${currentRound} / ${totalRounds}`;
}
