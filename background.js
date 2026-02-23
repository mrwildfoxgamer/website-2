
const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let particlesArray;

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

let mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 15000;
  
  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 2) + 0.5;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 1) - 0.5;
    let directionY = (Math.random() * 1) - 0.5;
    let color = 'rgba(255, 255, 255, 0.15)'; 

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
      + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      
      if (distance < (canvas.width / 10) * (canvas.height / 10)) {
        opacityValue = 1 - (distance / 10000);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.05})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
    
    if (mouse.x && mouse.y) {
      let dx = mouse.x - particlesArray[a].x;
      let dy = mouse.y - particlesArray[a].y;
      let mouseDistance = Math.sqrt(dx * dx + dy * dy);
      
      if (mouseDistance < mouse.radius) {
        let mouseOpacity = 1 - (mouseDistance / mouse.radius);
        ctx.strokeStyle = `rgba(201, 241, 53, ${mouseOpacity * 0.8})`; 
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

init();
animate();