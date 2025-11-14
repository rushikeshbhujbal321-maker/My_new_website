import './style.css'

let score = 0;
let level = 1;

const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const gameModal = document.getElementById('gameModal');
const gameContainer = document.getElementById('gameContainer');
const closeModal = document.getElementById('closeModal');

const gameButtons = document.querySelectorAll('[data-game]');
gameButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const gameType = e.target.getAttribute('data-game');
    openGame(gameType);
    playClickSound();
  });
});

closeModal.addEventListener('click', () => {
  gameModal.classList.remove('active');
  gameContainer.innerHTML = '';
});

gameModal.addEventListener('click', (e) => {
  if (e.target === gameModal) {
    gameModal.classList.remove('active');
    gameContainer.innerHTML = '';
  }
});

function playClickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playSuccessSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 1200;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

function updateScore(points) {
  score += points;
  scoreElement.textContent = score;

  if (score >= level * 100) {
    level++;
    levelElement.textContent = level;
    playSuccessSound();
  }
}

function openGame(gameType) {
  gameModal.classList.add('active');

  switch(gameType) {
    case 'color':
      initColorGame();
      break;
    case 'music':
      initMusicGame();
      break;
    case 'stars':
      initStarsGame();
      break;
    case 'draw':
      initDrawGame();
      break;
  }
}

function initColorGame() {
  gameContainer.innerHTML = `
    <h2 class="game-title">🎨 Color Magic</h2>
    <p class="game-score">Click the colors to create magic!</p>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 400px; margin: 0 auto;">
      ${['#FF6B9D', '#FEC368', '#48E5C2', '#A855F7', '#60A5FA', '#F472B6', '#34D399', '#FBBF24', '#F87171'].map((color, i) =>
        `<button class="color-btn" data-color="${color}" style="width: 100px; height: 100px; border-radius: 20px; border: none; background: ${color}; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 30px ${color}50;"></button>`
      ).join('')}
    </div>
  `;

  const colorBtns = gameContainer.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const color = e.target.getAttribute('data-color');
      createColorExplosion(e.clientX, e.clientY, color);
      updateScore(10);
      playClickSound();
    });

    btn.addEventListener('mouseenter', (e) => {
      e.target.style.transform = 'scale(1.2) rotate(10deg)';
    });

    btn.addEventListener('mouseleave', (e) => {
      e.target.style.transform = 'scale(1) rotate(0deg)';
    });
  });
}

function createColorExplosion(x, y, color) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = '50%';
    particle.style.background = color;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / 20;
    const velocity = 5 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    let posX = x;
    let posY = y;
    let opacity = 1;

    const animate = () => {
      posX += vx;
      posY += vy;
      opacity -= 0.02;

      particle.style.left = posX + 'px';
      particle.style.top = posY + 'px';
      particle.style.opacity = opacity;

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    animate();
  }
}

function initMusicGame() {
  gameContainer.innerHTML = `
    <h2 class="game-title">🎵 Music Bubbles</h2>
    <p class="game-score">Pop Score: <span id="bubbleScore">0</span></p>
    <canvas id="musicCanvas" class="canvas-game" width="500" height="500"></canvas>
  `;

  const canvas = document.getElementById('musicCanvas');
  const ctx = canvas.getContext('2d');
  const bubbles = [];
  let bubbleScore = 0;

  class Bubble {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 50;
      this.radius = 20 + Math.random() * 30;
      this.speed = 1 + Math.random() * 2;
      this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speed;
      this.wobble += 0.05;
      this.x += Math.sin(this.wobble) * 2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    }

    isOffScreen() {
      return this.y + this.radius < 0;
    }

    contains(x, y) {
      const dist = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
      return dist < this.radius;
    }
  }

  function spawnBubble() {
    bubbles.push(new Bubble());
  }

  setInterval(spawnBubble, 1000);

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = bubbles.length - 1; i >= 0; i--) {
      if (bubbles[i].contains(x, y)) {
        bubbles.splice(i, 1);
        bubbleScore += 10;
        document.getElementById('bubbleScore').textContent = bubbleScore;
        updateScore(10);
        playSuccessSound();
      }
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].update();
      bubbles[i].draw();

      if (bubbles[i].isOffScreen()) {
        bubbles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function initStarsGame() {
  gameContainer.innerHTML = `
    <h2 class="game-title">⭐ Star Collector</h2>
    <p class="game-score">Stars Caught: <span id="starScore">0</span></p>
    <canvas id="starsCanvas" class="canvas-game" width="500" height="500"></canvas>
  `;

  const canvas = document.getElementById('starsCanvas');
  const ctx = canvas.getContext('2d');
  const stars = [];
  let starScore = 0;
  let basketX = canvas.width / 2;

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.speed = 2 + Math.random() * 3;
      this.size = 15 + Math.random() * 15;
      this.rotation = 0;
      this.rotationSpeed = 0.05 + Math.random() * 0.1;
    }

    update() {
      this.y += this.speed;
      this.rotation += this.rotationSpeed;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⭐', 0, 0);
      ctx.restore();
    }

    isOffScreen() {
      return this.y > canvas.height + 20;
    }

    checkCollision(bx) {
      return this.y > canvas.height - 40 &&
             this.x > bx - 40 &&
             this.x < bx + 40;
    }
  }

  function spawnStar() {
    stars.push(new Star());
  }

  setInterval(spawnStar, 800);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = stars.length - 1; i >= 0; i--) {
      stars[i].update();
      stars[i].draw();

      if (stars[i].checkCollision(basketX)) {
        stars.splice(i, 1);
        starScore++;
        document.getElementById('starScore').textContent = starScore;
        updateScore(15);
        playSuccessSound();
      } else if (stars[i].isOffScreen()) {
        stars.splice(i, 1);
      }
    }

    ctx.fillStyle = '#FF6B9D';
    ctx.fillRect(basketX - 40, canvas.height - 40, 80, 40);
    ctx.fillStyle = '#FEC368';
    ctx.fillRect(basketX - 35, canvas.height - 35, 70, 30);

    requestAnimationFrame(animate);
  }

  animate();
}

function initDrawGame() {
  gameContainer.innerHTML = `
    <h2 class="game-title">🦄 Magic Draw</h2>
    <p class="game-score">Draw with rainbow colors!</p>
    <div style="text-align: center; margin-bottom: 15px;">
      <button id="clearCanvas" style="padding: 10px 30px; border-radius: 20px; border: none; background: linear-gradient(135deg, #FF6B9D, #FEC368); color: white; font-weight: 700; cursor: pointer; box-shadow: 0 5px 20px rgba(255,107,157,0.4);">Clear Canvas</button>
    </div>
    <canvas id="drawCanvas" class="canvas-game" width="600" height="500"></canvas>
  `;

  const canvas = document.getElementById('drawCanvas');
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let hue = 0;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener('mousedown', () => isDrawing = true);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseleave', () => isDrawing = false);

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    hue = (hue + 2) % 360;

    updateScore(1);
  });

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playClickSound();
  });
}
