class Cell {
  constructor(x,y) {
    this.x = x;
    this.y = y;

    this.age = 1;

    const iState = Math.random() > 0.01 ? 0 : 1;
    this.state = iState;
    this.prevState = iState;
  }

  update() {
    this.prevState = this.state;
    let iLiving = this.getNeighbors().reduce((acc, c) => {
      return acc + c.prevState;
    }, 0);
    switch (iLiving) {
      case 2:
        break;
      case 3:
        this.state = 1;
        break;
      default:
        this.state = 0;
    }
    if (this.prevState === 1 && this.state === 1) {
      this.age++;
    } else {
      this.age = 1;
    }
  }

  getNeighbors() {
    const getCell = function(x,y) {
      if (x < 0 || y < 0) {
        return;
      }

      if (window.grid[x] && window.grid[x][y]) {
        return window.grid[x][y];
      }
    }

    const arr = [
      getCell(this.x-1,this.y-1),
      getCell(this.x-1,this.y),
      getCell(this.x-1,this.y+1),
      getCell(this.x,this.y-1),
      getCell(this.x,this.y+1),
      getCell(this.x+1,this.y-1),
      getCell(this.x+1,this.y),
      getCell(this.x+1,this.y+1),
    ];

    const temp = [];
    for (let i of arr)
      i && temp.push(i);

    return temp;
  }
}
