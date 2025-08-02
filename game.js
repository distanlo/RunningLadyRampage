
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

function drawDog() {
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
}

function drawLady() {
  if (gameOver) return;
  ctx.drawImage(ladyImg, lady.x, lady.y, lady.width, lady.height);
}

function drawBones() {
  bones.forEach(b => {
    ctx.drawImage(boneImg, b.x, b.y, 60, 40);
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
      b.x + 60 > lady.x &&
      b.y < lady.y + lady.height &&
      b.y + 40 > lady.y
    ) {
      bones.splice(index, 1);
      score++;
      lady.hits++;
      if (lady.hits >= 3) {
        triggerWinAnimation();
      }
    }
  });

  bones = bones.filter(b => b.x < 800);
}

function triggerWinAnimation() {
  gameOver = true;
  const numParticles = 100;
  for (let i = 0; i < numParticles; i++) {
    shatterParticles.push({
      x: lady.x + lady.width / 2,
      y: lady.y + lady.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 5 + 2,
      color: 'hotpink'
    });
}

function updateShatter() {
  shatterParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; // gravity
  });
}

function drawShatter() {
  shatterParticles.forEach(p => {
    ctx.fillStyle = p.color;
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
  if (gameOver && shatterParticles.length > 0) {
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
