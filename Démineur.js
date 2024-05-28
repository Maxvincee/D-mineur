const compteurElement = document.getElementById("compteur_de_bombe");
var Demineur = {
    name: 'Demineur',
    
    difficulties: {
    easy: {
        lines: 8,
        columns: 8,
        mines: 10,
    },
    normal: {
        lines: 12,
        columns: 12,
        mines: 20,
    },
    hard: {
        lines: 16,
        columns: 16,
        mines: 32,
    },
    extreme: {
        lines: 20,
        columns: 20,
        mines: 48,
    },
    },
    
    settings: {
    },
    
    game: {
        status: 0,
        field: new Array(),
    },
    
    initialise: function() {
        "this.startGame('easy');"
    },
    
    startGame: function(difficulty) {
        console.log(this.difficulties[difficulty]);
        this.settings = this.difficulties[difficulty];
        console.log(this.settings);
        this.drawGameBoard();
        this.resetGame();
        this.compteur_de_bombe = this.settings.mines;
        compteurElement.innerText = `${this.compteur_de_bombe}`;
    },

    drawGameBoard: function() {
        board = document.getElementById('plateau');
        board.innerHTML = '';
        document.getElementById('result').innerHTML = '';
        border = document.createElement('table');
        field = document.createElement('tbody');
        border.appendChild(field);
        border.className = 'field';
        board.appendChild(border);
        for (i = 1; i <= this.settings['lines']; i ++){
            line = document.createElement('tr');

            for (j = 1; j <= this.settings['columns']; j++) {
                cell = document.createElement('td');
                cell.id = 'cell-'+i+'-'+j;
                cell.className = 'cell';
                cell.setAttribute('onclick', this.name+'.checkPosition('+i+', '+j+', true);');
                cell.setAttribute('oncontextmenu', this.name+'.markPosition('+i+', '+j+');return false;');
                line.appendChild(cell);
            }
            field.appendChild(line);
        }
        border.setAttribute('oncontextmenu', 'return false;');
    },

    resetGame: function() {
        this.game.field = new Array();
        for (i = 1; i <= this.settings['lines']; i++) {
            this.game.field[i] = new Array();
            for (j = 1; j <= this.settings['columns']; j++) {
                this.game.field[i][j] = 0;
            }
        }
        for (i = 1; i <= this.settings['mines']; i++) {
            x = Math.floor(Math.random() * (this.settings['columns'] - 1) + 1);
            y = Math.floor(Math.random() * (this.settings['lines'] - 1) + 1);
            while (this.game.field[x][y] == -1) {
                x = Math.floor(Math.random() * (this.settings['columns'] - 1) + 1);
                y = Math.floor(Math.random() * (this.settings['lines'] - 1) + 1);
            }
            this.game.field[x][y] = -1;

            for (j = x-1; j <= x+1; j++) {
                if (j == 0 || j == (this.settings['columns'] + 1)) {
                    continue;
                }
                for (k = y-1; k <= y+1; k++) {
                    if (k == 0 || k == (this.settings['lines'] + 1)) {
                        continue;
                    }
                    if (this.game.field[j][k] != -1) {
                        this.game.field[j][k] ++;
                    }
                }
            }
        }
    },

    markPosition: function(x, y) {
        if (this.game.status != 1)
            return;
        if (this.game.field[x][y] == 2)
            return;
        if (this.game.field[x][y] < -90) {
            document.getElementById('cell-'+x+'-'+y).className = 'cell';
            document.getElementById('cell-'+x+'-'+y).innerHTML = '';
            this.game.field[x][y] += 100;
            this.compteur_de_bombe++;
            compteurElement.innerText = `${this.compteur_de_bombe}`;
        } else {
            document.getElementById('cell-'+x+'-'+y).className = 'cell marked';
            document.getElementById('cell-'+x+'-'+y).innerHTML = '🚩';
            this.game.field[x][y] -= 100;
            this.compteur_de_bombe--;
            compteurElement.innerText = `${this.compteur_de_bombe}`;
        }
    },

    checkPosition: function(x, y) {
        if (this.game.status != 1) {
            return;
        }
        if (this.game.field[x][y] == -2) {
            return;
        }
        if (this.game.field[x][y] < -90) {
            return;
        }
        if (this.game.field[x][y] == -1) {
            document.getElementById('cell-'+x+'-'+y).className = 'cell bomb';
            this.displayLose();
            return;
        }
        
        document.getElementById('cell-'+x+'-'+y).className = 'cell clear';
        if (this.game.field[x][y] > 0) {
            document.getElementById('cell-'+x+'-'+y).innerHTML = this.game.field[x][y];
            this.game.field[x][y] = -2;
        }
        else if (this.game.field[x][y] == 0) {
            this.game.field[x][y] = -2;
            for (var j = x-1; j <= x+1; j++) {
                if (j == 0 || j == (this.settings['columns'] + 1))
                    continue;
                for (var k = y-1; k <= y+1; k++) {
                    if (k == 0 || k == (this.settings['lines'] + 1))
                        continue;
                    if (this.game.field[j][k] > -1) {
                        this.checkPosition(j, k);
                    }
                }
            }
        }
        this.checkWin();
    },



    checkWin: function() {
        for (var i = 1; i <= this.settings['lines']; i++) {
            for (var j = 1; j <= this.settings['columns']; j++) {
                v = this.game.field[i][j];
                if (v != -1 && v != -2 && v != -101){
                    return;
                }
            }
        }
        this.displayWin();
    },

    timer: function(){
        const departMinutes = 0
        let temps = departMinutes * 60

        const timerElement = document.getElementById("timer");
        
            let timerInterval = setInterval(() => {
                if (this.game.status == 0) {
                    window.clearInterval(timerInterval)
                }
                let minutes = parseInt(temps / 60, 10)
                let secondes = parseInt(temps % 60, 10)

                minutes = minutes < 10 ? "0" + minutes : minutes
                secondes = secondes < 10 ? "0" + secondes : secondes

                timerElement.innerText = `${minutes}:${secondes}`
                temps = temps + 1
            }, 1000)
    },

    /** @type {number | undefined} */
    compteur_de_bombe: undefined,

    displayWin: function() {
        document.getElementById('result').innerHTML = 'Gagné, gg wp ez';
        document.getElementById('result').style.color = '#ffd700';
        this.game.status = 0;
    },
        
    displayLose: function() {
        document.getElementById('result').innerHTML = 'Perdu, ah la loose prend ton L';
        document.getElementById('result').style.color = '#cc3333';
        this.game.status = 0;
    },
}

Demineur.game.status = 1;