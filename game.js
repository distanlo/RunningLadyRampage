
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
  console.log(`Loaded image ${imagesLoaded}/3`);
  if (imagesLoaded === 3) {
    console.log("All images loaded. Starting game...");
    gameLoop();
  }
}

dogImg.onload = checkLoaded;
ladyImg.onload = checkLoaded;
boneImg.onload = checkLoaded;

dogImg.onerror = () => console.error("Failed to load dog image");
ladyImg.onerror = () => console.error("Failed to load lady image");
boneImg.onerror = () => console.error("Failed to load bone image");

let dog = { x: 50, y: 300, width: 50, height: 50 };
let lady = { x: 800, y: 300, width: 40, height: 50, hits: 0 };
let bones = [];
let score = 0;
let gameOver = false;

function drawDog() {
  if (dogImg.complete && dogImg.naturalWidth > 0) {
    ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(dog.x, dog.y, dog.width, dog.height);
  }
}

function drawLady() {
  if (ladyImg.complete && ladyImg.naturalWidth > 0) {
    ctx.drawImage(ladyImg, lady.x, lady.y, lady.width, lady.height);
  } else {
    ctx.fillStyle = "hotpink";
    ctx.fillRect(lady.x, lady.y, lady.width, lady.height);
  }
}

function drawBones() {
  bones.forEach(b => {
    if (boneImg.complete && boneImg.naturalWidth > 0) {
      ctx.drawImage(boneImg, b.x, b.y, 15, 10);
    } else {
      ctx.fillStyle = "yellow";
      ctx.fillRect(b.x, b.y, 15, 10);
    }
  });
}

function update() {
  if (gameOver) return;

  lady.x -= 2;
  if (lady.x + lady.width < 0) {
    lady.x = 800;
    lady.hits = 0;
  }

  bones.forEach((b, index) => {
    b.x += 5;
    if (
      b.x < lady.x + lady.width &&
      b.x + 10 > lady.x &&
      b.y < lady.y + lady.height &&
      b.y + 5 > lady.y
    ) {
      bones.splice(index, 1);
      score++;
      lady.hits++;
      if (lady.hits >= 3) {
        gameOver = true;
        alert("You win! The lady has been hit 3 times!");
      }
    }
  });

  bones = bones.filter(b => b.x < 800);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDog();
  drawLady();
  drawBones();
  ctx.fillStyle = 'lime';
  ctx.fillText("Score: " + score, 10, 20);
  if (gameOver) {
    ctx.fillText("GAME OVER", canvas.width / 2 - 40, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    bones.push({ x: dog.x + dog.width, y: dog.y + 10 });
  }
});

canvas.addEventListener('touchstart', e => {
  bones.push({ x: dog.x + dog.width, y: dog.y + 10 });
});
