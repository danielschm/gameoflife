class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.age = 0;

        const iState = Math.random() > 0.1 ? 0 : 1;
        this.state = iState;
        this.prevState = iState;
    }

    reset() {
        this.age = 0;
        this.state = 0;
    }

    update() {
        this.prevState = this.state;

        // --------- dieing --------------------------------------------------------------------------------------------
        const iCellLife = 20;
        const iHouseLife = 50;
        const iVirusLife = 80;

        switch (this.state) {
            case 1:
                if(++this.age > iCellLife) {
                    this.reset();
                    return;
                }
                break;
            case 2:
                if (++this.age > iHouseLife) {
                    this.reset();
                }
                return;
            case -1:
                if (++this.age > iVirusLife) {
                    this.reset();
                }
                return;
            default:
                break;
        }

        // --------- evolution -----------------------------------------------------------------------------------------
        const aNeighbors = this.getNeighbors();
        const aLiving = aNeighbors.filter(e => e.prevState > 0);
        const iLiving = aLiving.length;

        // ------------------- virus -----------------------------------------------------------------------------------
        if (this.state === 1) {
            const aVirus = aNeighbors.filter(e => e.state === -1);
            const iVirus = aVirus.length;
            if (iVirus > 1) {
                this.state = Math.random() > 0.2 ? -1 : 0;
                return;
            } else if (iVirus > 0) {
                this.state = 0;
                return;
            }
        }

        // --------- rules ---------------------------------------------------------------------------------------------
        const isNewHouse = arr => {
            if (arr.find(e => e.x === this.x-1 && e.y === this.y)) {
                if (arr.find(e => e.x === this.x && e.y === this.y-1)) {
                    if (arr.find(e => e.x === this.x+1 && e.y === this.y)) {
                        if (arr.find(e => e.x === this.x && e.y === this.y+1)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        switch (iLiving) {
            case 2:
                break;
            case 3:
                this.state = 1;
                break;
            case 4:
                this.state = window.advanced && isNewHouse(aLiving) ? 2 : 0;
                break;
            default:
                this.state = 0;
                break;
        }
    }

    getNeighbors() {
        const getCell = function (x, y) {
            if (x < 0 || y < 0) {
                return;
            }

            if (window.grid[x] && window.grid[x][y]) {
                return window.grid[x][y];
            }
        };

        const arr = [
            getCell(this.x - 1, this.y - 1),
            getCell(this.x - 1, this.y),
            getCell(this.x - 1, this.y + 1),
            getCell(this.x, this.y - 1),
            getCell(this.x, this.y + 1),
            getCell(this.x + 1, this.y - 1),
            getCell(this.x + 1, this.y),
            getCell(this.x + 1, this.y + 1),
        ];

        const temp = [];
        for (let i of arr)
            i && temp.push(i);

        return temp;
    }
}
