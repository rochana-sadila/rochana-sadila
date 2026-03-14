console.log(
  "Hi there! Welcome to my website. I hope you find it useful and enjoyable. If you have any questions or feedback, please feel free to contact me. Thank you for visiting!",
);

const canvas = document.getElementById("rain");
const ctx = canvas.getContext("2d");
let W,
  H,
  drops = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  init();
}

function rand(a, b) {
  return a + Math.random() * (b - a);
}

function makeDrop() {
  return {
    x: rand(0, W),
    y: rand(-H, 0),
    vy: rand(9, 22),
    len: rand(12, 32),
    alpha: rand(0.15, 0.55),
    width: rand(0.6, 1.4),
  };
}

function init() {
  drops = [];
  const count = Math.floor((W * H) / 7000);
  for (let i = 0; i < count; i++) {
    const d = makeDrop();
    d.y = rand(-H, H); // stagger on load
    drops.push(d);
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  drops.forEach((d) => {
    // Move
    d.y += d.vy;
    if (d.y > H + 40) {
      d.y = rand(-60, -10);
      d.x = rand(0, W);
      d.vy = rand(9, 22);
      d.len = rand(12, 32);
      d.alpha = rand(0.15, 0.55);
    }

    // Slight horizontal drift from "wind"
    const angle = 0.12; // radians, slight lean right
    const dx = Math.sin(angle) * d.len;
    const dy = Math.cos(angle) * d.len;

    // Tail (fading streak)
    const grad = ctx.createLinearGradient(d.x, d.y, d.x - dx, d.y - dy);
    grad.addColorStop(0, `rgba(200,230,180,${d.alpha})`);
    grad.addColorStop(1, `rgba(200,230,180,0)`);

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = d.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - dx, d.y - dy);
    ctx.stroke();

    // Bright head dot
    ctx.fillStyle = `rgba(220,245,200,${d.alpha * 1.4})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.width * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  requestAnimationFrame(draw);
}

resize();
draw();
window.addEventListener("resize", resize);
