import hkc from '../js/hkc';

export default (function() {
  let context = null;
  let cols = 0;
  let rows = 0;
  let width = 0;
  let height = 0;
  let grid = null;
  let generationTimerId;
  let resolution = 40;
  let gpersecond = 1;
  let running = false;
  let next = null;

  function init() {
    cols = Math.floor(width / resolution);
    rows = Math.floor(height / resolution);
    grid = hkc.make2DArray(cols, rows);
    next = hkc.make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = hkc.random(0,2) == 2 ? 1 : 0;
      }
    }
  }

  function setup(canvas) {
    if(canvas === undefined || canvas === null ) throw new Error("Falta canvas");
    context = canvas.getContext('2d');
    if (!context) { throw new Error("ERROR context"); }
    width = canvas.width;
    height = canvas.height;    
    hkc.startAnimating(draw, +30, 1000);
    
    let stats_el = document.getElementById('stats');
    let statsTimerId = setInterval(statFunction, 150, stats_el);
  }

  function start(){    
    running = true;
    let t = (1/gpersecond) * 1000;    
    generationTimerId = setInterval(nextGeneration, t);
  }

  function reset(config) {
    config = config || {};
    gpersecond = config.gpersecond || gpersecond;
    resolution = config.resolution || resolution;
    resolution = resolution > 40 ? 40 : resolution;

    running = false;
    if(generationTimerId) clearInterval(generationTimerId);
    
    init();
  }

  function stop(){
    running = false;
    if(generationTimerId) clearInterval(generationTimerId);
  }

  function draw() {
    context.clearRect(0, 0, width, height);
  
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] == 1) {
          context.strokeStyle = "rgb(0,0,0)";
          context.fillRect(x, y, resolution - 1, resolution - 1);
        }
      }
    }
  }
  
  function nextGeneration(){
    next = hkc.make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];  
        let neighbors = countNeighbors(grid, i, j);  
        
        next[i][j] = 0;
        
        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }  
      }
    }  
    grid = next;
  }

  function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        sum += grid[col][row];
      }
    }
    sum -= grid[x][y];
    return sum;
  }

  function statFunction(stats_el){
    let sts = hkc.fpsStats();
    stats_el.innerHTML = 
      "<div><span>frameCount: " + sts.frameCount + "</span><br><span>lastSampleTime: " + sts.lastSampleTime + "</span><br><span>fpsInterval: " + sts.fpsInterval + "</span></div>" 
    ;
  }

  return {
    setup: setup,
    start: start,
    stop: stop,
    reset: reset,
    running: () => running,
    nextGen: nextGeneration
  };

})();
