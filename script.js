// Elementos básicos del DOM
var timerDisplay = document.getElementById('timer-display');
var phaseDisplay = document.getElementById('phase-display');
var roundDisplay = document.getElementById('round-display');
var startBtn = document.getElementById('start-btn');
var pauseBtn = document.getElementById('btn-pause');
var resetBtn = document.getElementById('btn-reset');
var stopBtn = document.getElementById('btn-stop');
var soundStart = document.getElementById('sound-start');

// Variables del temporizador
var workTime = 30; // segundos
var restTime = 15; // segundos
var totalRounds = 5;
var currentRound = 1;
var isWorking = true;
var timeLeft = 0;
var timer = null;
var isPaused = false;

// Iniciar temporizador
startBtn.onclick = function() {
  // Obtener valores iniciales
  workTime = parseInt(document.getElementById('custom-work').value);
  if (document.getElementById('custom-work-unit').value === 'min') {
    workTime *= 60;
  }
  
  restTime = parseInt(document.getElementById('custom-rest').value);
  if (document.getElementById('custom-rest-unit').value === 'min') {
    restTime *= 60;
  }
  
  totalRounds = parseInt(document.getElementById('custom-rounds').value);
  
  // Configurar estado inicial
  document.getElementById('preset-container').style.display = 'none';
  document.getElementById('timer-view').style.display = 'flex';
  
  currentRound = 1;
  isWorking = true;
  timeLeft = workTime;
  isPaused = false;
  
  updateDisplay();
  playSound();
  
  // Iniciar el temporizador
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
    playSound();
  }
  
  // Cambio de fase cuando llega a 0
  if (timeLeft < 0) {
    if (isWorking) {
      if (restTime > 0) {
        // Cambiar a descanso
        isWorking = false;
        timeLeft = restTime;
        updateDisplay();
      } else {
        // Pasar a siguiente ronda
        nextRound();
      }
    } else {
      // Terminó el descanso
      nextRound();
    }
  }
}

function nextRound() {
  currentRound++;
  
  if (currentRound > totalRounds) {
    // Finalizar entrenamiento
    clearInterval(timer);
    document.getElementById('timer-view').className = 'finished';
    document.body.className = 'finished';
    phaseDisplay.textContent = 'Terminado';
    timerDisplay.textContent = '00:00';
    roundDisplay.textContent = '';
  } else {
    // Nueva ronda
    isWorking = true;
    timeLeft = workTime;
    updateDisplay();
    playSound();
  }
}

// Actualizar la pantalla
function updateDisplay() {
  // Mostrar tiempo (asegurarse que no sea negativo)
  var displayTime = Math.max(0, timeLeft);
  var min = Math.floor(displayTime / 60);
  var sec = displayTime % 60;
  timerDisplay.textContent = (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
  
  // Mostrar fase actual
  phaseDisplay.textContent = isWorking ? 'Trabajo' : 'Descanso';
  roundDisplay.textContent = 'Ronda ' + currentRound + ' / ' + totalRounds;
  
  // Color de fondo
  var bgClass = isPaused ? 'paused' : (isWorking ? 'active-work' : 'active-rest');
  document.getElementById('timer-view').className = bgClass;
  document.body.className = bgClass;
}

// Reproducir sonido
function playSound() {
  soundStart.currentTime = 0;
  soundStart.play();
}

// Controles
pauseBtn.onclick = function() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Continuar' : 'Pausar';
  updateDisplay();
};

resetBtn.onclick = function() {
  isWorking = true;
  currentRound = 1;
  timeLeft = workTime;
  updateDisplay();
  playSound();
};

stopBtn.onclick = function() {
  clearInterval(timer);
  document.getElementById('preset-container').style.display = 'flex';
  document.getElementById('timer-view').style.display = 'none';
  document.body.className = '';
};