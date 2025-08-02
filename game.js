
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dogImg = new Image();
const ladyImg = new Image();
const boneImg = new Image();

dogImg.src = 'assets/dog.png';
ladyImg.src = 'assets/lady.png';
boneImg.src = 'assets/bone.png';

let imagesLoaded = 0;
function checkLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 3) {
    gameLoop();
  }
}

dogImg.onload = checkLoaded;
ladyImg.onload = checkLoaded;
boneImg.onload = checkLoaded;

let dog = { x: 50, y: 280, width: 100, height: 100 };
let lady = { x: 800, y: 280, width: 80, height: 100, hits: 0 };
let bones = [];
let score = 0;
let gameOver = false;
let shatterParticles = [];
let explosionTriggered = false;
let scaleLady = false;
let scale = 1;

function drawDog() {
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
}

function drawLady() {
  if (gameOver && !explosionTriggered) {
    // Draw enlarged lady before explosion
    scale += 0.05;
    let newWidth = lady.width * scale;
    let newHeight = lady.height * scale;
    let newX = lady.x + lady.width / 2 - newWidth / 2;
    let newY = lady.y + lady.height / 2 - newHeight / 2;
    ctx.drawImage(ladyImg, newX, newY, newWidth, newHeight);
    if (scale >= 2.5) {
      triggerWinAnimation(newX + newWidth / 2, newY + newHeight / 2);
      explosionTriggered = true;
    }
  } else if (!gameOver) {
    ctx.drawImage(ladyImg, lady.x, lady.y, lady.width, lady.height);
  }
}

function drawBones() {
  bones.forEach(b => {
    ctx.drawImage(boneImg, b.x, b.y, 80, 50); // Enlarged bone
  });
}

function update() {
  if (gameOver) {
    updateShatter();
    return;
  }

  lady.x -= 2;
  if (lady.x + lady.width < 0) {
    lady.x = 800;
    lady.hits = 0;
  }

  bones.forEach((b, index) => {
    b.x += 6;
    if (
      b.x < lady.x + lady.width &&
      b.x + 80 > lady.x &&
      b.y < lady.y + lady.height &&
      b.y + 50 > lady.y
    ) {
      bones.splice(index, 1);
      score++;
      lady.hits++;
      if (lady.hits >= 3) {
        gameOver = true;
        scale = 1;
        explosionTriggered = false;
      }
    }
  });

  bones = bones.filter(b => b.x < 800);
}

function triggerWinAnimation(centerX, centerY) {
  const numParticles = 150;
  for (let i = 0; i < numParticles; i++) {
    shatterParticles.push({
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      size: Math.random() * 6 + 2,
      color: 'hotpink',
      alpha: 1
    });
  }
}

function updateShatter() {
  shatterParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.alpha -= 0.01;
  });
  shatterParticles = shatterParticles.filter(p => p.alpha > 0);
}

function drawShatter() {
  shatterParticles.forEach(p => {
    ctx.fillStyle = `rgba(255,105,180,${p.alpha})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDog();
  drawLady();
  drawBones();
  drawShatter();
  ctx.fillStyle = 'lime';
  ctx.fillText("Score: " + score, 10, 20);
  if (gameOver && explosionTriggered && shatterParticles.length === 0) {
    ctx.fillText("YOU WIN", canvas.width / 2 - 40, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    bones.push({ x: dog.x + dog.width, y: dog.y + 30 });
  }
});

canvas.addEventListener('touchstart', e => {
  bones.push({ x: dog.x + dog.width, y: dog.y + 30 });
});
