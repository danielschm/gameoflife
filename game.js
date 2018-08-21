window.onload = function() {
  setup();
  speed = 20;
  window.gameInterval = setInterval(function() {
    draw();
  }, speed);
}

function setup() {
    window.width = 1200;
    window.height = 800;
    window.res = 10;

    window.grid = [];

    for (let i = 0; i < window.width/window.res; i++) {
      const row = [];
      for (let j = 0; j < window.height/window.res; j++) {
        row.push(new Cell(i,j));
      }
      window.grid.push(row);
    }

    document.getElementById("canvas").addEventListener("mousemove", e => {
      spawnGlider(Math.round(e.x/window.res),Math.round(e.y/window.res));
    });
}

function spawnGlider(x,y) {
  const getCell = (x,y) => window.grid[x][y];
  getCell(x,y-1).state = 1;
  getCell(x,y).state = 0;
  getCell(x+1,y).state = 1;
  getCell(x-1,y+1).state = 1;
  getCell(x,y+1).state = 1;
  getCell(x+1,y+1).state = 1;
}

function draw() {
  const ctx = getCtx();

  // background
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,this.width,this.height);

  ctx.strokeStyle = "black";
  //grid
  for (let i = 0; i < window.grid.length; i++) {
    for (let j = 0; j <  window.grid[i].length; j++) {
      const cell = window.grid[i][j];
      ctx.fillStyle = cell.state === 1 ? hslToHex(200,80,40+cell.age) : "black";
      ctx.fillRect(i*window.res,j*window.res,window.res,window.res);
      ctx.strokeRect(i*window.res,j*window.res,window.res,window.res);
    }
  }

  for (let i = 0; i < window.grid.length; i++) {
    for (let j = 0; j <  window.grid[i].length; j++) {
      const cell = window.grid[i][j];
      cell.update();
    }
  }
}

function getCtx() {
  return document.getElementById("canvas").getContext("2d");
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  if (l > 100) l = 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
