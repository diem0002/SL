// Elementos del DOM
const timerDisplay = document.getElementById('timer-display');
const phaseDisplay = document.getElementById('phase-display');
const roundDisplay = document.getElementById('round-display');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('btn-pause');
const resetButton = document.getElementById('btn-reset');
const stopButton = document.getElementById('btn-stop');
const presetContainer = document.getElementById('preset-container');
const timerView = document.getElementById('timer-view');

// Sonidos
const soundStart = document.getElementById('sound-start');
const soundEnd = document.getElementById('sound-end');

// Variables del temporizador
let workSeconds, restSeconds, totalRounds;
let currentRound = 1;
let isWorking = true;
let timeLeft = 0;
let intervalId = null;
let paused = false;
let initialValues = {};
let lastBeepTime = -1;

// Iniciar temporizador
startButton.addEventListener('click', startTimer);

function startTimer() {
  // Obtener valores iniciales
  const work = parseInt(document.getElementById('custom-work').value);
  const rest = parseInt(document.getElementById('custom-rest').value);
  const rounds = parseInt(document.getElementById('custom-rounds').value);
  const workUnit = document.getElementById('custom-work-unit').value;
  const restUnit = document.getElementById('custom-rest-unit').value;

  // Guardar valores iniciales
  initialValues = {
    workSeconds: workUnit === 'min' ? work * 60 : work,
    restSeconds: restUnit === 'min' ? rest * 60 : rest,
    totalRounds: rounds
  };

  resetTimer(true);

  // Configurar vista
  presetContainer.style.display = 'none';
  timerView.style.display = 'flex';
  updateViewClasses();
  phaseDisplay.textContent = 'Trabajo';
  updateTimerDisplay();
  updateRoundDisplay();

  // Iniciar intervalo
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(tick, 1000);
  
  // Sonido de inicio
  playStartSound();
}

function tick() {
  timeLeft--;
  updateTimerDisplay();

  // Beep en 3, 2, 1 segundos (solo si estamos en los últimos 3 segundos)
  if (timeLeft <= 3 && timeLeft > 0 && timeLeft !== lastBeepTime) {
    playStartSound();
    lastBeepTime = timeLeft;
  }

  // Cambio de fase cuando llega a 0
  if (timeLeft < 0) {
    if (isWorking) {
      if (restSeconds > 0) {
        // Cambiar a descanso
        switchToRest();
      } else {
        // Pasar directamente a siguiente ronda
        nextRoundOrFinish();
      }
    } else {
      // Terminó el descanso
      nextRoundOrFinish();
    }
  }
}

function switchToRest() {
  isWorking = false;
  timeLeft = restSeconds;
  lastBeepTime = -1; // Resetear el último beep
  updateViewClasses();
  phaseDisplay.textContent = 'Descanso';
  updateTimerDisplay();
  // No reproducir sonido aquí
}

function nextRoundOrFinish() {
  currentRound++;
  
  if (currentRound > totalRounds) {
    // Finalizar entrenamiento
    finishWorkout();
  } else {
    // Nueva ronda
    startNewRound();
  }
}

function finishWorkout() {
  clearInterval(intervalId);
  intervalId = null;
  timerView.className = 'finished';
  document.body.className = 'finished';
  phaseDisplay.textContent = 'Terminado';
  timerDisplay.textContent = '00:00';
  roundDisplay.textContent = '';
  soundEnd.currentTime = 0;
  soundEnd.play();
}

function startNewRound() {
  isWorking = true;
  timeLeft = workSeconds;
  lastBeepTime = -1; // Resetear el último beep
  updateViewClasses();
  phaseDisplay.textContent = 'Trabajo';
  updateRoundDisplay();
  playStartSound(); // Sonido al inicio de nueva ronda
}

// Reiniciar completamente
resetButton.addEventListener('click', () => resetTimer(false));

function resetTimer(isInitialStart) {
  // Restaurar valores iniciales
  workSeconds = initialValues.workSeconds || 30;
  restSeconds = initialValues.restSeconds || 15;
  totalRounds = initialValues.totalRounds || 5;
  currentRound = 1;
  isWorking = true;
  timeLeft = workSeconds;
  lastBeepTime = -1;
  
  // Actualizar vista
  updateViewClasses();
  updateTimerDisplay();
  updateRoundDisplay();
  phaseDisplay.textContent = 'Trabajo';
  
  // Reiniciar intervalo si estaba corriendo y no es pausa
  if (!paused && !isInitialStart && intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(tick, 1000);
  }
  
  if (!isInitialStart) {
    playStartSound();
  }
}

// Pausar/continuar
pauseButton.addEventListener('click', togglePause);

function togglePause() {
  paused = !paused;
  
  if (paused) {
    clearInterval(intervalId);
    timerView.className = 'paused';
    document.body.className = 'paused';
    phaseDisplay.textContent = 'Pausado';
    pauseButton.textContent = 'Continuar';
  } else {
    intervalId = setInterval(tick, 1000);
    updateViewClasses();
    phaseDisplay.textContent = isWorking ? 'Trabajo' : 'Descanso';
    pauseButton.textContent = 'Pausar';
  }
}

// Detener temporizador
stopButton.addEventListener('click', stopTimer);

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  paused = false;
  presetContainer.style.display = 'flex';
  timerView.style.display = 'none';
  document.body.className = '';
  timerView.className = '';
}

// Funciones auxiliares
function updateViewClasses() {
  const viewClass = paused ? 'paused' : (isWorking ? 'active-work' : 'active-rest');
  timerView.className = viewClass;
  document.body.className = viewClass;
}

function updateTimerDisplay() {
  const min = Math.max(0, Math.floor(timeLeft / 60)).toString().padStart(2, '0');
  const sec = Math.max(0, timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

function updateRoundDisplay() {
  roundDisplay.textContent = `Ronda ${currentRound} / ${totalRounds}`;
}

function playStartSound() {
  soundStart.currentTime = 0;
  soundStart.play();
}