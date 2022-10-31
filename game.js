//data
let winArr = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8]];
let pathList = ['./png/o1.png', './png/o2.png', './png/o3.png', './png/o4.png', './png/o5.png']
let pathPos = 0;
let host = JSON.parse(localStorage.getItem('host'));
let guest = JSON.parse(localStorage.getItem('guest'));
let isSingle = host.name == 'The Bear';
let currentPlayerSimbol = '';
let playerX;
let playerO;
let emptyCells;
let turns;
let winCellsIndex;
let clickedCell = 0;
//html elements
let guestScore = document.querySelector('#score2 span');
let gustNameBox = document.getElementById('name2');
let hostScore = document.querySelector('#score1 span');
let hostNameBox = document.getElementById('name1');
//animations
let currentPlayerAnim;

function initGame() {
    //creat game-board
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.index = i;
        cell.setAttribute('id', 'cell' + i)
        cell.addEventListener('click', click)
        document.getElementById('board').appendChild(cell);
    }
    //set player name and score
    document.getElementById('name2').textContent = guest.name;
    guestScore.textContent = guest.score;
    //reset variabls
    playerX = [];
    playerO = [];
    winCellsIndex = [];
    emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    turns = 0;
    currentPlayerSimbol = (Math.round(Math.random())) > 0 ? 'x' : 'o';
    currentPlayer();
    console.log(currentPlayerSimbol);
}

// change player
function currentPlayer() {
    currentPlayerAnim = setInterval(flicker);
    addScoreTextAnim();
    previousPlayer();
    if (isSingle) {
        if (currentPlayerSimbol == 'x') {
            for (i of emptyCells) {
                document.getElementById('cell' + i).removeEventListener('click', click)
            }
            autoPlayTurn();
        } else {
            for (i of emptyCells) {
                document.getElementById('cell' + i).addEventListener('click', click)
            }
        }
    }
}

function previousPlayer() {
    clearInterval(currentPlayerAnim);
    removeScoreTextAnim();
}

function flicker() {
    const elemId = currentPlayerSimbol == 'o' ? 'scoreBox2' : isSingle ? 'bearBoard' : 'scoreBox1';
    const elem = document.getElementById(elemId);
    elem.classList.add('flicker');
}

function addScoreTextAnim() {
    if (currentPlayerSimbol == 'o') {
        document.getElementById('name2').textContent += " it's your turn";
        document.getElementById('name2').classList.add('txtFlicker');
    } else {
        if (isSingle) {
            document.querySelector(`#bearBoard p`).classList.add('biggerFont');
        } else {
            document.getElementById('name1').textContent += " it's your turn";
            document.getElementById('name1').classList.add('txtFlicker');
        }
    }
}

function removeScoreTextAnim() {
    if (currentPlayerSimbol == 'x') {
        document.getElementById('name2').textContent = guest.name;
        document.getElementById('name2').classList.remove('txtFlicker')
    } else {
        if (isSingle) {
            document.querySelector(`#bearBoard p`).classList.remove('biggerFont')
        } else {
            document.getElementById('name1').textContent = host.name;
            document.getElementById('name1').classList.remove('txtFlicker')
        }

    }
}
// main function for click-event
function click(event) {
    clickedCell = event.target
    console.log(clickedCell);
    clickCell()
}

function clickCell() {
    const playerScore = currentPlayerSimbol == 'x' ? hostScore : guestScore;
    playerScore.textContent--;
    setCell();
    addCelllIndex(clickedCell.index);
    clickedCell.removeEventListener('click', click);
    if (checkResult()) {
        console.log("got into if checkResult");
        for (i of emptyCells) {
            document.getElementById('cell' + i).removeEventListener('click', click)
        }
        endGame(currentPlayerSimbol);
        console.log(currentPlayerSimbol + ' won')

    } else {
        console.log('no winner yet');
        turns++
        //temporary code, need to change !!!!!!
        if (turns < 9) {
            changePlayer();
        } else {
            // currentPlayerSimbol = (currentPlayerSimbol == 'x') ? 'o' : 'x';
            // removeScoreTextAnim(); 
            // clearInterval(currentPlayerAnim);
            // console.log('its a tie');
            endGame('t')
        }
        // turns < 9 ? changePlayer() :  // endGame('t') !!!!!!!
    }
}
//display simbole when player clicks on board
function setCell() {
    let img = document.createElement('img')
    img.classList += ('simbolImg');
    clickedCell.appendChild(img);
    img.src = setImg();
}

function setImg() {
    if (currentPlayerSimbol == 'o') {
        pathPos++
        return pathList[pathPos - 1];
    } else {
        return './png/x.png'
    }
}
//set data of click-event then change player and start new turn
function addCelllIndex(index) {
    if (currentPlayerSimbol == 'x') {
        playerX.push(index)
    } else {
        playerO.push(index)
    }
    emptyCells.splice(emptyCells.indexOf(index), 1);
}

function checkResult() {
    let player = (currentPlayerSimbol == 'x') ? playerX : playerO;
    for (let i of winArr) {
        if (i.every(num => player.includes(num))) {
            i.forEach(index => winCellsIndex.push(index));
            return true
        }
    }
    return false;
}

function changePlayer() {
    currentPlayerSimbol = (currentPlayerSimbol == 'x') ? 'o' : 'x';
    currentPlayer();
}

// auto player - choose cell and click
function autoPlayTurn() {
    console.log('entered autoPlayTurn');
    let element;
    if (isWinIndex('x')) {
        element = document.getElementById('cell' + isWinIndex('x'))
    } else if (isWinIndex('o')) {
        element = document.getElementById('cell' + isWinIndex('o'))
    } else {
        const index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        console.log(index);
        element = document.getElementById('cell' + index)
    }
    console.log(element);
    clickedCell = element;
    setTimeout(clickCell, 2000)
}

function isWinIndex(simbole) {
    const playerClickedList = simbole == 'x' ? playerX : playerO;
    for (i of winArr) {
        const included = i.filter(num => playerClickedList.includes(num));
        if (included.length > 1) {
            const winIndex = i.filter(num => included.includes(num) == false);
            if (emptyCells.includes(winIndex[0])) {
                return winIndex[0]
            }
        }
    }
    return false;
}

// when game ends:
function endGame(symbol) {
    document.getElementById('board').remove();
    if (symbol != 't') {
        // creat win animation    ?????
        const isEnough = isEnoughCoockis()
        localStorage.setItem('host', JSON.stringify({ name: host.name, score: host.score, symbol: 'x' }));
        localStorage.setItem('guest', JSON.stringify({ name: guest.name, score: guest.score, symbol: 'o' }));
        document.getElementById('winBoard').style.display = 'flex'
        if(isEnough == 'both'){
            document.getElementById("startNewGame").disabled = false;
        }

    } else {
        document.getElementById("resultBoard").style = 'display: flex; ';
    }

}

function winScoreSum() {
    if (currentPlayerSimbol == 'x') {
        host.score += guestScore.textContent;
        guest.score = guestScore.textContent;
    } else {
        guest.score += hostScore.textContent;
        host.score = hostScore.textContent;
    }
}

//moving to the next game
function onclickNext() {
    const isEnough = isEnoughCoockis()
    if (isEnough == 'guest' || isEnough == 'host') {
        askToBake(isEnough)
    } else {
        window.location.reload()
    }
}

function isEnoughCoockis() {
    return guest.score < 5 && host.score < 5 ? 'both' : guest.score < 5 ? 'guest' : host.score < 5 ? 'host' : 'enough'
}






// guest.score = isSingle ? singleScoreSum(symbol) : twoPlayersScoreSum(symbol);


// const btnNewGame = document.getElementById('startNewGame');
// btnNewGame.disabled = isSingle ? guestScore.textContent >=5 ? false : true
//   !!!!!!!










initGame();




