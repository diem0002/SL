let interval;
let totalRounds = 0;
let currentRound = 1;
let isResting = false;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const exerciseInput = document.getElementById('exerciseTime');
const restInput = document.getElementById('restTime');
const roundsInput = document.getElementById('rounds');

const setupDiv = document.getElementById('setup');
const timerDiv = document.getElementById('timer');
const countdownEl = document.getElementById('countdown');
const roundInfo = document.getElementById('roundInfo');
const modeTitle = document.getElementById('mode');

startBtn.onclick = () => {
  const exerciseTime = parseInt(exerciseInput.value);
  const restTime = parseInt(restInput.value);
  totalRounds = parseInt(roundsInput.value);

  if (!exerciseTime || !restTime || !totalRounds) return;

  setupDiv.classList.add('hidden');
  timerDiv.classList.remove('hidden');
  currentRound = 1;
  startRound(exerciseTime, restTime);
};

stopBtn.onclick = () => {
  clearInterval(interval);
  document.body.className = '';
  setupDiv.classList.remove('hidden');
  timerDiv.classList.add('hidden');
};

function startRound(exerciseTime, restTime) {
  isResting = false;
  document.body.className = 'active-work';
  modeTitle.textContent = '¡Ejercicio!';
  roundInfo.textContent = `Ronda ${currentRound}/${totalRounds}`;
  startCountdown(exerciseTime, () => {
    if (currentRound >= totalRounds) {
      modeTitle.textContent = '¡Finalizado!';
      document.body.className = 'active-finish';
    } else {
      document.body.className = 'active-rest';
      modeTitle.textContent = 'Descanso';
      startCountdown(restTime, () => {
        currentRound++;
        startRound(exerciseTime, restTime);
      });
    }
  });
}

function startCountdown(seconds, callback) {
  countdownEl.textContent = seconds;
  clearInterval(interval);
  interval = setInterval(() => {
    seconds--;
    countdownEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(interval);
      callback();
    }
  }, 1000);
}
