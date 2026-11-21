// The five scenes. Each level paints the same picture twice: once with every
// difference in its "A" state (left panel) and once with every difference in
// its "B" state (right panel). paint(ctx, d) draws the scene with d[i] true
// meaning difference i is in its B state. diffs give the click target of each
// difference in panel coordinates (600 x 560).
function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function rr(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function cloud(ctx, x, y, s) {
  circle(ctx, x, y, 22 * s, '#ffffff');
  circle(ctx, x + 22 * s, y - 8 * s, 18 * s, '#ffffff');
  circle(ctx, x + 44 * s, y, 20 * s, '#ffffff');
  ellipse(ctx, x + 22 * s, y + 8 * s, 42 * s, 14 * s, '#ffffff');
}

function flower(ctx, x, y, petal) {
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 13, y + Math.sin(a) * 13, 9, petal);
  }
  circle(ctx, x, y, 9, '#f2c94c');
  line(ctx, x, y + 9, x, y + 34, 4, '#2f7d32');
}

function gradient(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, 560);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 560);
}

// ---------------------------------------------------------------- Level 1
function paintGarden(ctx, d) {
  gradient(ctx, '#7ec8f7', '#dff5ff');
  // Sun, top left. B: it wears sunglasses.
  circle(ctx, 90, 80, 38, '#ffd93b');
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, 90 + Math.cos(a) * 46, 80 + Math.sin(a) * 46, 90 + Math.cos(a) * 58, 80 + Math.sin(a) * 58, 4, '#ffd93b');
  }
  circle(ctx, 78, 76, 4, '#8a5a00');
  circle(ctx, 102, 76, 4, '#8a5a00');
  ctx.strokeStyle = '#8a5a00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(90, 88, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  if (d[0]) {
    rr(ctx, 66, 66, 20, 12, 4, '#22223a');
    rr(ctx, 94, 66, 20, 12, 4, '#22223a');
    line(ctx, 86, 72, 94, 72, 3, '#22223a');
  }
  cloud(ctx, 300, 70, 1);
  cloud(ctx, 470, 48, 0.8);
  // B: one extra cloud drifting in.
  if (d[1]) cloud(ctx, 330, 150, 0.7);
  // Hills and path.
  ellipse(ctx, 150, 580, 260, 90, '#6abe5e');
  ellipse(ctx, 470, 590, 280, 100, '#57a848');
  ellipse(ctx, 300, 560, 130, 60, '#e8d5a8');
  // Tree, right. B: two extra apples.
  rect(ctx, 462, 330, 18, 90, '#7a4a21');
  circle(ctx, 470, 290, 52, '#2f8f3a');
  circle(ctx, 430, 315, 38, '#37a144');
  circle(ctx, 510, 315, 38, '#2f8f3a');
  circle(ctx, 448, 272, 10, '#e23b3b');
  circle(ctx, 492, 288, 10, '#e23b3b');
  circle(ctx, 470, 318, 10, '#e23b3b');
  if (d[5]) {
    circle(ctx, 432, 296, 10, '#e23b3b');
    circle(ctx, 506, 268, 10, '#e23b3b');
  }
  // Butterfly, top right. B: it flew away.
  if (!d[3]) {
    ellipse(ctx, 468, 180, 12, 16, '#b678e8');
    ellipse(ctx, 492, 180, 12, 16, '#d09bf5');
    ellipse(ctx, 468, 196, 10, 12, '#d09bf5');
    ellipse(ctx, 492, 196, 10, 12, '#b678e8');
    rect(ctx, 478, 176, 4, 26, '#5b3a7a');
  }
  // Mushroom, bottom right. B: purple cap with five dots.
  rect(ctx, 512, 452, 16, 30, '#fff3d6');
  ctx.fillStyle = d[4] ? '#8b5cf6' : '#e23b3b';
  ctx.beginPath();
  ctx.arc(520, 452, 30, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 508, 440, 4, '#ffffff');
  circle(ctx, 528, 436, 4, '#ffffff');
  circle(ctx, 520, 428, 4, '#ffffff');
  if (d[4]) {
    circle(ctx, 500, 448, 4, '#ffffff');
    circle(ctx, 538, 448, 4, '#ffffff');
  }
  // Flowers along the bottom. The big one, left: B turns its petals yellow.
  flower(ctx, 120, 430, d[2] ? '#ffd93b' : '#e23b3b');
  flower(ctx, 200, 470, '#ff8fb3');
  flower(ctx, 380, 480, '#ffffff');
  flower(ctx, 60, 500, '#ff8fb3');
  // Snail on the path. B: it slid away.
  if (!d[6]) {
    ellipse(ctx, 250, 505, 22, 10, '#c98f5f');
    circle(ctx, 242, 488, 16, '#e07840');
    ctx.strokeStyle = '#b3502a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(242, 488, 8, 0, Math.PI * 2);
    ctx.stroke();
    line(ctx, 266, 494, 272, 484, 2, '#5b3a2a');
    line(ctx, 270, 494, 278, 486, 2, '#5b3a2a');
  }
}

// ---------------------------------------------------------------- Level 2
function paintKitchen(ctx, d) {
  rect(ctx, 0, 0, 600, 420, '#f7e8c9');
  rect(ctx, 0, 420, 600, 140, '#c89b6a');
  line(ctx, 0, 420, 600, 420, 4, '#a67c52');
  // Window. B: night has fallen outside.
  rr(ctx, 220, 50, 160, 140, 10, '#8fd0f0');
  if (d[5]) {
    rr(ctx, 228, 58, 144, 124, 8, '#1c2b4a');
    circle(ctx, 340, 92, 16, '#f4f1e6');
    circle(ctx, 260, 84, 2, '#ffffff');
    circle(ctx, 300, 120, 2, '#ffffff');
    circle(ctx, 340, 140, 2, '#ffffff');
  } else {
    circle(ctx, 340, 92, 20, '#ffd93b');
    cloud(ctx, 250, 90, 0.55);
    cloud(ctx, 310, 140, 0.45);
  }
  line(ctx, 300, 50, 300, 190, 5, '#8a6d3b');
  line(ctx, 220, 120, 380, 120, 5, '#8a6d3b');
  // Wall clock. A: three o'clock. B: half past six.
  circle(ctx, 480, 90, 34, '#ffffff');
  ctx.strokeStyle = '#5b4a2a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(480, 90, 34, 0, Math.PI * 2);
  ctx.stroke();
  if (d[0]) {
    line(ctx, 480, 90, 480, 112, 4, '#22223a');
    line(ctx, 480, 90, 466, 90, 4, '#22223a');
  } else {
    line(ctx, 480, 90, 480, 68, 4, '#22223a');
    line(ctx, 480, 90, 500, 90, 4, '#22223a');
  }
  circle(ctx, 480, 90, 4, '#22223a');
  // Shelf with a plant, top left. B: two leaves fewer.
  rect(ctx, 40, 210, 110, 10, '#8a6d3b');
  rr(ctx, 78, 170, 34, 42, 6, '#e07840');
  line(ctx, 95, 170, 95, 130, 4, '#2f7d32');
  ellipse(ctx, 78, 132, 10, 20, '#37a144');
  ellipse(ctx, 95, 118, 10, 22, '#2f8f3a');
  ellipse(ctx, 112, 132, 10, 20, '#37a144');
  if (!d[4]) {
    ellipse(ctx, 66, 148, 9, 16, '#2f8f3a');
    ellipse(ctx, 124, 148, 9, 16, '#2f8f3a');
  }
  // Table with a mug. B: the mug is green, not blue.
  rr(ctx, 90, 380, 420, 22, 8, '#8a6d3b');
  rect(ctx, 110, 402, 14, 118, '#7a5c33');
  rect(ctx, 476, 402, 14, 118, '#7a5c33');
  rr(ctx, 130, 330, 44, 50, 8, d[1] ? '#37a144' : '#3b82f6');
  ctx.strokeStyle = d[1] ? '#37a144' : '#3b82f6';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(180, 355, 12, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Fruit bowl. B: one apple fewer.
  ellipse(ctx, 350, 400, 52, 16, '#5b8dd9');
  circle(ctx, 330, 388, 13, '#e23b3b');
  circle(ctx, 352, 382, 13, '#e23b3b');
  if (!d[2]) circle(ctx, 372, 390, 13, '#e23b3b');
  line(ctx, 352, 372, 352, 362, 3, '#5b3a2a');
  // Spoon or fork on the table. B: a fork instead of a spoon.
  if (d[6]) {
    line(ctx, 250, 452, 250, 492, 4, '#c0c6d4');
    line(ctx, 244, 452, 244, 436, 3, '#c0c6d4');
    line(ctx, 250, 452, 250, 436, 3, '#c0c6d4');
    line(ctx, 256, 452, 256, 436, 3, '#c0c6d4');
  } else {
    line(ctx, 250, 452, 250, 492, 4, '#c0c6d4');
    ellipse(ctx, 250, 440, 9, 12, '#c0c6d4');
  }
  // Cat on the chair, right. B: the cat wandered off.
  if (!d[3]) {
    rr(ctx, 500, 430, 70, 14, 6, '#a67c52');
    rect(ctx, 506, 444, 10, 76, '#8a6d3b');
    rect(ctx, 554, 444, 10, 76, '#8a6d3b');
    ellipse(ctx, 535, 420, 30, 16, '#f59e0b');
    circle(ctx, 562, 404, 13, '#f59e0b');
    poly(ctx, [[554, 396], [558, 382], [562, 396]], '#f59e0b');
    poly(ctx, [[566, 396], [570, 382], [574, 396]], '#f59e0b');
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(512, 408, 14, Math.PI * 0.6, Math.PI * 1.5);
    ctx.stroke();
  } else {
    rr(ctx, 500, 430, 70, 14, 6, '#a67c52');
    rect(ctx, 506, 444, 10, 76, '#8a6d3b');
    rect(ctx, 554, 444, 10, 76, '#8a6d3b');
  }
}

// ---------------------------------------------------------------- Level 3
function paintSpace(ctx, d) {
  gradient(ctx, '#0b1030', '#27408f');
  // Fixed stars.
  const stars = [[60, 60], [140, 200], [220, 80], [330, 60], [420, 210], [540, 260], [90, 330], [560, 160], [260, 260], [380, 300], [40, 450], [540, 480]];
  for (const [x, y] of stars) circle(ctx, x, y, 2.5, '#ffffff');
  // Shooting star. B: it has already passed.
  if (!d[4]) {
    line(ctx, 120, 90, 200, 140, 3, '#ffffff');
    circle(ctx, 120, 90, 5, '#ffffff');
    circle(ctx, 150, 110, 2, '#ffd93b');
  }
  // Moon, top left. B: two extra craters.
  circle(ctx, 90, 70, 30, '#e8e8e8');
  circle(ctx, 80, 62, 6, '#c9c9c9');
  circle(ctx, 100, 78, 5, '#c9c9c9');
  circle(ctx, 88, 84, 4, '#c9c9c9');
  if (d[5]) {
    circle(ctx, 102, 58, 5, '#c9c9c9');
    circle(ctx, 76, 74, 4, '#c9c9c9');
  }
  // Planet with rings, top right. B: the rings are gone.
  circle(ctx, 480, 120, 52, '#e07840');
  ellipse(ctx, 480, 128, 34, 12, '#c25a2e');
  if (!d[0]) {
    ctx.strokeStyle = '#f2c94c';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.ellipse(480, 120, 78, 20, -0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Satellite, centre. B: it drifted away.
  if (!d[6]) {
    rr(ctx, 258, 168, 44, 24, 6, '#c0c6d4');
    poly(ctx, [[280, 168], [300, 140], [312, 152]], '#7dd3fc');
    line(ctx, 258, 180, 230, 168, 4, '#c0c6d4');
    line(ctx, 302, 180, 330, 192, 4, '#c0c6d4');
    circle(ctx, 280, 180, 5, '#f2c94c');
  }
  // Rocket, left. B: a blue flame instead of orange.
  poly(ctx, [[180, 240], [205, 300], [155, 300]], '#e23b3b');
  rr(ctx, 162, 300, 36, 90, 12, '#f4f1e6');
  circle(ctx, 180, 330, 12, '#7dd3fc');
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(180, 330, 12, 0, Math.PI * 2);
  ctx.stroke();
  poly(ctx, [[162, 360], [140, 400], [162, 392]], '#e23b3b');
  poly(ctx, [[198, 360], [220, 400], [198, 392]], '#e23b3b');
  poly(ctx, [[172, 390], [188, 390], [180, 430]], d[1] ? '#3b82f6' : '#f97316');
  // Astronaut, bottom centre, waving a flag. B: the star is missing from it.
  circle(ctx, 350, 380, 26, '#ffffff');
  ctx.fillStyle = '#7dd3fc';
  ctx.beginPath();
  ctx.arc(350, 380, 18, 0, Math.PI * 2);
  ctx.fill();
  rr(ctx, 322, 404, 56, 62, 14, '#f4f1e6');
  rr(ctx, 322, 440, 16, 40, 6, '#f4f1e6');
  rr(ctx, 362, 440, 16, 40, 6, '#f4f1e6');
  line(ctx, 378, 404, 378, 330, 4, '#c0c6d4');
  poly(ctx, [[378, 330], [420, 342], [378, 354]], '#e23b3b');
  if (!d[2]) {
    circle(ctx, 394, 342, 5, '#f2c94c');
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      circle(ctx, 394 + Math.cos(a) * 8, 342 + Math.sin(a) * 8, 1.5, '#f2c94c');
    }
  }
  // Alien, bottom right. B: a third eye.
  ellipse(ctx, 520, 420, 26, 32, '#4ade80');
  circle(ctx, 512, 402, 7, '#1c2b1c');
  circle(ctx, 530, 402, 7, '#1c2b1c');
  if (d[3]) circle(ctx, 521, 388, 6, '#1c2b1c');
  line(ctx, 506, 438, 506, 460, 4, '#4ade80');
  line(ctx, 536, 438, 536, 460, 4, '#4ade80');
  line(ctx, 498, 418, 484, 430, 4, '#4ade80');
  line(ctx, 542, 418, 556, 430, 4, '#4ade80');
  ctx.strokeStyle = '#1c2b1c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(521, 424, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

// ---------------------------------------------------------------- Level 4
function paintSea(ctx, d) {
  gradient(ctx, '#1b6fb5', '#0b3d66');
  // Light rays from the surface.
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  poly(ctx, [[120, 0], [180, 0], [260, 420], [180, 420]], 'rgba(255,255,255,0.08)');
  poly(ctx, [[380, 0], [420, 0], [480, 420], [420, 420]], 'rgba(255,255,255,0.08)');
  ellipse(ctx, 300, 560, 340, 70, '#e8d5a8');
  // Seaweed, left. B: one frond shorter.
  ctx.strokeStyle = '#2f8f3a';
  ctx.lineCap = 'round';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(70, 520);
  ctx.quadraticCurveTo(50, 440, 70, 380);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(95, 520);
  ctx.quadraticCurveTo(115, 450, 95, d[6] ? 460 : 400);
  ctx.stroke();
  // Fish, top left. B: one stripe fewer.
  ellipse(ctx, 150, 150, 42, 24, '#f97316');
  poly(ctx, [[188, 150], [214, 132], [214, 168]], '#f97316');
  circle(ctx, 124, 144, 5, '#ffffff');
  circle(ctx, 124, 144, 2.5, '#22223a');
  line(ctx, 150, 130, 150, 170, 4, '#ffffff');
  line(ctx, 166, 130, 166, 170, 4, '#ffffff');
  if (!d[0]) line(ctx, 134, 130, 134, 170, 4, '#ffffff');
  // Octopus, right. B: two arms fewer.
  circle(ctx, 450, 250, 34, '#b678e8');
  circle(ctx, 438, 244, 6, '#ffffff');
  circle(ctx, 462, 244, 6, '#ffffff');
  circle(ctx, 438, 244, 3, '#22223a');
  circle(ctx, 462, 244, 3, '#22223a');
  ctx.strokeStyle = '#b678e8';
  ctx.lineWidth = 9;
  const arms = d[3] ? 6 : 8;
  for (let i = 0; i < arms; i += 1) {
    const x = 424 + i * 8;
    ctx.beginPath();
    ctx.moveTo(x, 276);
    ctx.quadraticCurveTo(x + 4, 300, x - 4, 318);
    ctx.stroke();
  }
  // Bubbles rising. B: two bubbles fewer.
  circle(ctx, 200, 300, 8, 'rgba(255,255,255,0.5)');
  circle(ctx, 216, 272, 6, 'rgba(255,255,255,0.5)');
  circle(ctx, 188, 258, 7, 'rgba(255,255,255,0.5)');
  if (!d[4]) {
    circle(ctx, 208, 236, 5, 'rgba(255,255,255,0.5)');
    circle(ctx, 194, 214, 6, 'rgba(255,255,255,0.5)');
  }
  // Coral, bottom right. B: orange instead of pink.
  ctx.strokeStyle = d[1] ? '#f97316' : '#ff8fb3';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(480, 520);
  ctx.quadraticCurveTo(470, 470, 452, 440);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(480, 520);
  ctx.quadraticCurveTo(490, 470, 508, 448);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(480, 520);
  ctx.quadraticCurveTo(480, 480, 480, 452);
  ctx.stroke();
  // Treasure chest, bottom centre. B: closed, no gold spilling out.
  rr(ctx, 262, 470, 76, 44, 8, '#7a4a21');
  line(ctx, 262, 492, 338, 492, 4, '#f2c94c');
  if (!d[2]) {
    poly(ctx, [[262, 470], [262, 448], [300, 438], [338, 448], [338, 470]], '#8a5a2a');
    circle(ctx, 284, 462, 6, '#f2c94c');
    circle(ctx, 300, 456, 6, '#f2c94c');
    circle(ctx, 316, 462, 6, '#f2c94c');
    circle(ctx, 292, 470, 5, '#ffd93b');
    circle(ctx, 308, 470, 5, '#ffd93b');
  } else {
    poly(ctx, [[262, 470], [262, 452], [300, 444], [338, 452], [338, 470]], '#8a5a2a');
  }
  rr(ctx, 292, 486, 16, 14, 3, '#f2c94c');
  // Starfish on the sand. B: it buried itself.
  if (!d[5]) {
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 18 : 8;
      const x = 520 + Math.cos(a) * r;
      const y = 500 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    circle(ctx, 520, 500, 5, '#e23b3b');
  }
}

// ---------------------------------------------------------------- Level 5
function paintWinter(ctx, d) {
  gradient(ctx, '#1c2b4a', '#3a5a8c');
  // Snow ground.
  ellipse(ctx, 300, 580, 340, 80, '#f4f1e6');
  // Moon, top right. B: a crescent instead of full.
  circle(ctx, 520, 80, 30, '#f4f1e6');
  if (d[5]) circle(ctx, 532, 74, 26, '#3a5a8c');
  // Falling snow.
  for (const [x, y] of [[60, 90], [160, 150], [260, 60], [360, 120], [460, 180], [80, 260], [540, 300], [200, 220], [420, 260], [300, 200]]) {
    circle(ctx, x, y, 3, 'rgba(255,255,255,0.85)');
  }
  // House one, left, with chimney. B: no smoke.
  rr(ctx, 90, 300, 130, 110, 6, '#b3502a');
  poly(ctx, [[80, 302], [155, 240], [230, 302]], '#7a2e1a');
  rect(ctx, 110, 240, 22, 50, '#8a5a2a');
  if (!d[1]) {
    circle(ctx, 121, 222, 12, 'rgba(255,255,255,0.75)');
    circle(ctx, 128, 200, 15, 'rgba(255,255,255,0.65)');
    circle(ctx, 118, 176, 18, 'rgba(255,255,255,0.5)');
  }
  rr(ctx, 110, 330, 28, 28, 4, '#ffd93b');
  rr(ctx, 172, 330, 28, 28, 4, '#ffd93b');
  rr(ctx, 140, 368, 30, 42, 4, '#5b3a2a');
  // House two, right. B: only two windows lit.
  rr(ctx, 400, 290, 140, 120, 6, '#2f5d8a');
  poly(ctx, [[390, 292], [470, 228], [550, 292]], '#1c2b4a');
  rr(ctx, 420, 320, 28, 28, 4, '#ffd93b');
  rr(ctx, 462, 320, 28, 28, 4, d[2] ? '#3a5a8c' : '#ffd93b');
  rr(ctx, 504, 320, 28, 28, 4, '#ffd93b');
  rr(ctx, 456, 368, 28, 42, 4, '#5b3a2a');
  // Pine tree, centre. B: two extra ornaments.
  poly(ctx, [[330, 240], [290, 330], [370, 330]], '#2f7d32');
  poly(ctx, [[330, 290], [280, 380], [380, 380]], '#2f8f3a');
  rect(ctx, 322, 380, 16, 24, '#7a4a21');
  circle(ctx, 318, 300, 6, '#e23b3b');
  circle(ctx, 344, 330, 6, '#f2c94c');
  circle(ctx, 312, 352, 6, '#7dd3fc');
  circle(ctx, 350, 362, 6, '#e23b3b');
  if (d[3]) {
    circle(ctx, 330, 268, 6, '#f2c94c');
    circle(ctx, 336, 316, 6, '#ff8fb3');
  }
  // Snowman, left centre. B: a beanie instead of a top hat.
  circle(ctx, 200, 420, 34, '#ffffff');
  circle(ctx, 200, 366, 26, '#ffffff');
  circle(ctx, 200, 326, 20, '#ffffff');
  circle(ctx, 194, 322, 3, '#22223a');
  circle(ctx, 206, 322, 3, '#22223a');
  poly(ctx, [[200, 328], [216, 332], [200, 336]], '#f97316');
  if (d[0]) {
    rr(ctx, 182, 300, 36, 12, 6, '#e23b3b');
    rr(ctx, 188, 282, 24, 20, 4, '#e23b3b');
  } else {
    rr(ctx, 182, 298, 36, 12, 6, '#22223a');
    rect(ctx, 188, 278, 24, 22, '#22223a');
  }
  line(ctx, 172, 366, 150, 346, 4, '#7a4a21');
  line(ctx, 228, 366, 250, 346, 4, '#7a4a21');
  // Reindeer, right. B: no antlers.
  ellipse(ctx, 500, 430, 30, 18, '#a67c52');
  circle(ctx, 528, 414, 13, '#a67c52');
  if (!d[4]) {
    line(ctx, 522, 402, 512, 384, 3, '#7a4a21');
    line(ctx, 522, 402, 532, 382, 3, '#7a4a21');
    line(ctx, 512, 384, 504, 378, 2, '#7a4a21');
    line(ctx, 532, 382, 540, 376, 2, '#7a4a21');
  }
  circle(ctx, 540, 410, 4, '#e23b3b');
  line(ctx, 482, 442, 482, 470, 4, '#a67c52');
  line(ctx, 518, 442, 518, 470, 4, '#a67c52');
  // Sled with a gift, bottom centre. B: the gift is gone.
  line(ctx, 280, 486, 330, 486, 4, '#8a5a2a');
  line(ctx, 282, 486, 272, 472, 4, '#8a5a2a');
  line(ctx, 328, 486, 338, 472, 4, '#8a5a2a');
  if (!d[6]) {
    rr(ctx, 292, 452, 26, 26, 4, '#e23b3b');
    line(ctx, 305, 452, 305, 478, 3, '#f2c94c');
    line(ctx, 292, 465, 318, 465, 3, '#f2c94c');
  }
}

export const LEVELS = [
  {
    name: 'Sunny Garden',
    sub: 'A bright morning in the garden',
    diffs: [
      { x: 90, y: 80, r: 40 },
      { x: 330, y: 150, r: 34 },
      { x: 120, y: 430, r: 28 },
      { x: 480, y: 180, r: 30 },
      { x: 520, y: 450, r: 30 },
      { x: 470, y: 300, r: 34 },
      { x: 250, y: 500, r: 28 },
    ],
    paint: paintGarden,
  },
  {
    name: 'Cozy Kitchen',
    sub: 'Somebody moved things around',
    diffs: [
      { x: 480, y: 90, r: 34 },
      { x: 150, y: 355, r: 28 },
      { x: 350, y: 390, r: 30 },
      { x: 535, y: 415, r: 32 },
      { x: 95, y: 140, r: 30 },
      { x: 300, y: 120, r: 38 },
      { x: 250, y: 465, r: 26 },
    ],
    paint: paintKitchen,
  },
  {
    name: 'Space Adventure',
    sub: 'Something is odd among the stars',
    diffs: [
      { x: 480, y: 120, r: 40 },
      { x: 180, y: 410, r: 28 },
      { x: 394, y: 342, r: 24 },
      { x: 521, y: 405, r: 28 },
      { x: 150, y: 110, r: 32 },
      { x: 90, y: 70, r: 30 },
      { x: 280, y: 180, r: 28 },
    ],
    paint: paintSpace,
  },
  {
    name: 'Under the Sea',
    sub: 'The reef is hiding changes',
    diffs: [
      { x: 150, y: 150, r: 30 },
      { x: 480, y: 470, r: 32 },
      { x: 300, y: 465, r: 32 },
      { x: 450, y: 270, r: 32 },
      { x: 200, y: 260, r: 28 },
      { x: 520, y: 500, r: 26 },
      { x: 85, y: 430, r: 30 },
    ],
    paint: paintSea,
  },
  {
    name: 'Winter Village',
    sub: 'A quiet snowy evening',
    diffs: [
      { x: 200, y: 320, r: 30 },
      { x: 121, y: 200, r: 28 },
      { x: 476, y: 334, r: 28 },
      { x: 330, y: 320, r: 30 },
      { x: 522, y: 392, r: 26 },
      { x: 520, y: 80, r: 30 },
      { x: 305, y: 465, r: 26 },
    ],
    paint: paintWinter,
  },
];

