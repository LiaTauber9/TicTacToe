//data
let winArr = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8]];
let pathList = ['./png/o1.png', './png/o2.png', './png/o3.png', './png/o4.png', './png/o5.png']
let pathPos = 0;
let host = JSON.parse(localStorage.getItem('host'));
let guest = JSON.parse(localStorage.getItem('guest'));
let isSingle = host.name === 'The Bear';
let currentPlayerSimbol = '';
let currentPlayer;
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
    hostScore.textContent = host.score;
    //reset variabls
    playerX = [];
    playerO = [];
    winCellsIndex = [];
    emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    turns = 0;
    currentPlayerSimbol = (Math.round(Math.random())) > 0 ? 'x' : 'o';
    setCurrentPlayer();
    console.log(currentPlayerSimbol);
}

// change player
function setCurrentPlayer() {
    currentPlayer = currentPlayerSimbol =='x' ? host : guest;
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
        setTimeout(winAnim, 1000, ()=> {
            endGame(currentPlayerSimbol);
        }) 
        winScoreSum();
        // endGame(currentPlayerSimbol);
        console.log(currentPlayerSimbol + ' won');

    } else {
        console.log('no winner yet');
        turns++
        //temporary code, need to change !!!!!!
        if (turns < 9) {
            changePlayer();
        } else {
            setTimeout(endGame,1000, 't');
            // endGame('t')
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
    setCurrentPlayer();
}

// auto player - choose cell and click
function autoPlayTurn() {
    console.log('entered autoPlayTurn');
    let element;
    let winIndex = isWinIndex('x');
    console.log(winIndex);
    if (winIndex >= 0) {
        element = document.getElementById('cell' + winIndex);
    } else {
        winIndex = isWinIndex('o');
        console.log(winIndex);
        if (winIndex >= 0) {
            element = document.getElementById('cell' + winIndex);
        } else {
            const index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            console.log(index);
            element = document.getElementById('cell' + index)
        }
    }
    console.log(element);
    clickedCell = element;
    setTimeout(clickCell, 1000)
}

function isWinIndex(simbole) {
    const playerClickedList = simbole == 'x' ? playerX : playerO;
    for (i of winArr) {
        const included = i.filter(num => playerClickedList.includes(num));

        if (included.length > 1) {
            console.log('2 index with option of win' + included);
            const winIndex = i.filter(num => included.includes(num) == false);
            console.log('index for win is: ' + winIndex + 'empty cells are: ' + emptyCells);
            if (emptyCells.includes(winIndex[0])) {
                return winIndex[0]
                console.log('return win index' + winIndex[0]);
            }
        }
    }
    return -1;
}

// when game ends:
function endGame(symbol) {
    document.getElementById('board').remove();
    if (symbol != 't') {
        // creat win animation    ?????
        winScoreSum();
        localStorage.setItem('host', JSON.stringify({ name: host.name, score: host.score, symbol: 'x' }));
        localStorage.setItem('guest', JSON.stringify({ name: guest.name, score: guest.score, symbol: 'o' }));
        document.getElementById('boardNext').style.display = 'flex'
        guestScore.textContent = guest.score;
        hostScore.textContent = host.score;
        endGameNext()
       
    } else {
        document.getElementById("tieBoard").style = 'display: flex; ';
    }
}

function winScoreSum() {
    if (currentPlayerSimbol == 'x') {
        host.score += playerO.length;
        guest.score = guestScore.textContent*1;
    } else {
        guest.score += playerX.length;
        host.score = hostScore.textContent*1;
    }
}

//moving to the next game
function endGameNext() {
    const isEnough = isEnoughCoockis()
    console.log('isEnoughCoockies return: ' + isEnough);
    if (isEnough == 'enough') {
        document.getElementById("startNewGame").disabled = false;
    } else {
        const baker = isEnough == 'guest' || 'both' ? 'guest' : 'host';
        const bakerObj = isEnough == 'guest' || 'both' ? guest : host;
        localStorage.setItem('baker', baker)
        document.getElementById('mesageNext').textContent = `${bakerObj.name} you don't have enough coockies for the game, you have to bake some more..`
    }
}

function isEnoughCoockis() {
    return guest.score < 5 && host.score < 5 ? 'both' : guest.score < 5 ? 'guest' : host.score < 5 ? 'host' : 'enough'
}

function onclickTie() {
    window.location.href = 'exercise.html'
}
 // animation whem a player wins

 function winAnim(onDone){
    const scoreElem = document.querySelector( 
        currentPlayerSimbol === 'o' ? '#score2 span' : isSingle ?  '#bearImg' : '#score1 span').getBoundingClientRect();
         const imgElemArr = document.getElementsByClassName('simbolImg');
        const targetX = scoreElem.left + (scoreElem.width/2)
        const targetY = scoreElem.top + (scoreElem.height/2)
        let index = 0;
         for(let i of imgElemArr){
            index ++;
            const elem = i.getBoundingClientRect();
            const startX = Number(elem.left) +(elem.width/2);
            const startY = Number(elem.top) +(elem.height/2);
            const x = (startX-targetX)*(-1);
            const y = (startY-targetY)*(-1);    
            i.animate([ 
                {transform: `scale(1) translateX(0px) translateY(0px)`} ,      
               {transform: `rotate(0deg) scale(1) translateX(${x}px) translateY(${y}px)`}
                // {transform: `scale(0) translateX(-1500px) translateY(0px)`}
            ],
            {
                duration: 1000,
                'fill': 'forwards',
                composite : 'add'
                // iteration: 1
            }).onfinish = () => {
                i.animate([ 
                    {transform: `scale(1) rotate(0)`} ,      
                   {transform: `scale(0) rotate(360deg)`}
                    // {transform: `scale(0) translateX(-1500px) translateY(0px)`}
                ],
                {
                    duration: 1500,
                    'fill': 'forwards',
                    composite: "add"
                    // iteration: 1
                }).onfinish = () => {
                   index--;
                   if(index == 0) {
                    onDone();
                   }
                } 
            };
         }         
 }










// guest.score = isSingle ? singleScoreSum(symbol) : twoPlayersScoreSum(symbol);


// const btnNewGame = document.getElementById('startNewGame');
// btnNewGame.disabled = isSingle ? guestScore.textContent >=5 ? false : true
//   !!!!!!!










initGame();
