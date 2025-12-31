const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let rockets = [];
let particles = [];
let autoFire = false;

const popImg = new Image();
popImg.src = 'assets/hpy.jpg'; 

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();

class Particle {
  constructor(x, y, color, text = null, isImage = false) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.isImage = isImage;
    this.color = color;
    this.alpha = 1;
    this.velocity = {
      x: (Math.random() - 0.5) * (text || isImage ? 5 : 18),
      y: (Math.random() - 0.5) * (text || isImage ? 5 : 18)
    };
    this.gravity = (text || isImage) ? 0.02 : 0.2;
    this.friction = 0.96;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    if (this.isImage && popImg.complete) {
      const size = 80; 
      ctx.drawImage(popImg, this.x - size/2, this.y - size/2, size, size);
    } else if (this.text) {
      ctx.font = "bold 45px Segoe UI";
      ctx.fillStyle = this.color;
      ctx.textAlign = "center";
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.restore();
  }

  update() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.012;
  }
}

class Rocket {
  constructor(targetX, targetY) {
    this.x = targetX || Math.random() * canvas.width;
    this.y = canvas.height; 
    this.targetY = targetY || Math.random() * (canvas.height * 0.4);
    this.speed = 10;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.exploded = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      this.exploded = true;
      this.explode();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  explode() {
    const chance = Math.random();
    if (chance < 0.3) {
      
      for(let i=0; i<6; i++) particles.push(new Particle(this.x, this.y, this.color, null, true));
    } else if (chance < 0.6) {
      // Text Pop
      const txt = Math.random() > 0.5 ? "2026" : "HAPPY NEW YEAR";
      particles.push(new Particle(this.x, this.y, this.color, txt));
    } else {
      
      for (let i = 0; i < 100; i++) particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (autoFire && Math.random() < 0.05) rockets.push(new Rocket());
  rockets.forEach((r, i) => {
    r.update(); r.draw();
    if (r.exploded) rockets.splice(i, 1);
  });
  particles.forEach((p, i) => {
    if (p.alpha <= 0) particles.splice(i, 1);
    else { p.update(); p.draw(); }
  });
  requestAnimationFrame(animate);
}

const clickBtn = document.getElementById("click-btn");
const mainUI = document.getElementById("main-ui");
const finalUI = document.getElementById("new-year-2026");

clickBtn.onclick = (e) => {
  mainUI.classList.add("hidden"); 
  finalUI.classList.add("show-final"); 
  autoFire = true; 
  

  music.volume = 0.2; 
  
  rockets.push(new Rocket(e.clientX, e.clientY));
  music.play().catch(() => {});
};


document.getElementById("note-trigger").onclick = () => document.getElementById("popup").style.display = "flex";
document.getElementById("close-popup").onclick = () => document.getElementById("popup").style.display = "none";

animate();