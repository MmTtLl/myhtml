var canvas,
ctx,
dpr,
width,
height,
gui,
opt,
constraints,
points,
tick;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  gui = new dat.GUI();

  opt = {
    count: 5,
    radius: 150,
    spread: 60,
    speed: 50,
    pulse: 30,
    randomize: randomize };


  constraints = {
    count: {
      min: 1,
      max: 12 },

    radius: {
      min: 0,
      max: 400 },

    spread: {
      min: 0,
      max: 200 },

    speed: {
      min: 0,
      max: 100 },

    pulse: {
      min: 0,
      max: 100 } };



  gui.add(opt, 'count').min(constraints.count.min).max(constraints.count.max).step(1).name('Point Pairs').onChange(reset);
  gui.add(opt, 'radius').min(constraints.radius.min).max(constraints.radius.max).step(1).name('Radius Base').onChange(reset);
  gui.add(opt, 'spread').min(constraints.spread.min).max(constraints.spread.max).step(1).name('Radius Spread').onChange(reset);
  gui.add(opt, 'speed').min(constraints.speed.min).max(constraints.speed.max).step(1).name('Rotation Speed').onChange(reset);
  gui.add(opt, 'pulse').min(constraints.pulse.min).max(constraints.pulse.max).step(1).name('Pulse Speed').onChange(reset);
  gui.add(opt, 'randomize');

  points = [];
  tick = 0;

  reset();
  loop();
}

function reset() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  points.length = 0;
  for (var i = 0; i < opt.count * 2; i++) {
    var angle = i / (opt.count * 2) * Math.PI * 2;
    points.push({
      alt: i % 2 !== 0 ? true : false,
      x: 0,
      y: 0,
      x1: Math.cos(angle) * (opt.radius - opt.spread),
      y1: Math.sin(angle) * (opt.radius - opt.spread),
      x2: Math.cos(angle) * (opt.radius + opt.spread),
      y2: Math.sin(angle) * (opt.radius + opt.spread) });

  }
}

function randomize() {
  opt.count = randInt(constraints.count.min, constraints.count.max);
  opt.radius = randInt(constraints.radius.min, constraints.radius.max);
  opt.spread = randInt(constraints.spread.min, constraints.spread.max);
  opt.speed = randInt(constraints.speed.min, constraints.speed.max);
  opt.pulse = randInt(constraints.pulse.min, constraints.pulse.max);
  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }
  reset();
}

function step() {
  for (var i = 0; i < opt.count * 2; i++) {
    var p = points[i],
    sin = Math.sin(tick * (opt.pulse / 1000)),
    cos = Math.cos(tick * (opt.pulse / 1000));
    if (p.alt) {
      p.x = p.x1 + sin * (p.x2 - p.x1) / 2;
      p.y = p.y1 + sin * (p.y2 - p.y1) / 2;
    } else {
      p.x = p.x1 + cos * (p.x1 - p.x2) / 2;
      p.y = p.y1 + cos * (p.y1 - p.y2) / 2;
    }
  }
  tick++;
}

function draw() {
  ctx.save();

  ctx.translate(width / 2, height / 2);
  ctx.rotate(opt.count % 2 ? Math.PI / (opt.count * 2) : Math.PI / (opt.count * 1));
  ctx.rotate(tick * (opt.speed / 3000));
  ctx.beginPath();
  for (var i = 0; i < opt.count * 2; i++) {
    // this one liner courtesy of ana tudor
    ctx[i === 0 ? 'moveTo' : 'lineTo'](points[i].x, points[i].y);
  }
  ctx.closePath();

  ctx.globalCompositeOperation = 'lighter';
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'hsla(' + (tick + 160) + ', 80%, 50%, 0.5)';
  ctx.stroke();

  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'hsla(0, 0%, 0%, 0.05)';
  ctx.stroke();
  ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1)';
  ctx.fill();

  ctx.restore();
}

function loop() {
  requestAnimationFrame(loop);
  step();
  draw();
}

window.addEventListener('resize', reset);

init();