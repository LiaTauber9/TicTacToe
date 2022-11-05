//Globals
let egg = document.getElementById("egg");
clickDown = 0;
let curXPos = 0;
curDown = false;
let test = 5;
let timer = "";
let timerBoard = document.getElementById('timerContainer')

var sound1 = new Audio("http://hostinsomestuff.ucoz.site/_ld/0/1_timer_or_desk_b.mp3");




//Mouse Move Listener
egg.addEventListener('mousemove', function (e) {
    if (curDown === true) {
        if (curXPos >= 5 && clickDown + 5 < e.pageX) {
            curXPos -= 5;
            clickDown += 5;
            // egg.style.scrollLeft = curXPos;
            $('#egg').scrollLeft(curXPos);
        }
        else if (curXPos <= 1180 && clickDown - 5 > e.pageX) {
            curXPos += 50;
            clickDown -= 5;
            // egg.style.scrollLeft = curXPos);
            $('#egg').scrollLeft(curXPos);
            console.log(curXPos);
        }
    }



});


//Mousedown and up listeners
egg.addEventListener('mousedown', function (e) {

    curDown = true; clickDown = e.pageX; clearInterval(timer);
});
egg.addEventListener('mouseup', function (e) {
    curDown = false;


    //Timer begins here
    timer = setInterval(function () {
        if (curXPos > 0) {
            curXPos -= .315;
            // egg.style.scrollLeft = curXPos;
            $('#egg').scrollLeft(curXPos);
            console.log(curXPos);
            if (curXPos <= 0) {
                sound1.play();
                setTimeout(checkEx(),1500);
                 //HERES THE AUDIO ALERT
                // checkEx();
            }
        }
    }, 16.666);

});


//Prevents highlighting
function stopDefAction(evt) {
    evt.preventDefault();
}
egg.addEventListener('mousedown', stopDefAction);
////////////////////////////////////////////////////
//exercise code

// timerBoard.addEventListener('click', creatExercise());


let baker = localStorage.getItem('baker');
bakerObj = JSON.parse(localStorage.getItem(baker));
let score = bakerObj.score * 1;
let exBoard = document.getElementById('exerciseSec');
let exArray = [];

egg.addEventListener('click', createExercise, {once: true})
function createExercise() {
    for (let i = 0; i < 7; i++) {
        let exBox = document.createElement('div');
        exBox.classList.add('exBox');
        exBoard.appendChild(exBox);
        let inArr = [];
        for (let e = 0; e < 6; e++) {
            const elem = document.createElement(e == 4 ? 'input' : 'div');
            elem.classList.add('exElem');
            elem.setAttribute('index', e);
            elem.textContent = e == 0 || e == 2 ? Math.ceil(Math.random() * 10) : e == 1 ? 'x' : e == 3 ? '=' : '';
            console.log(elem);
            exBox.appendChild(elem);
            inArr.push(elem);
            console.log(inArr);
        }
        exArray.push(inArr);
    }
    egg.removeEventListener('mousedown', createExercise);
}


// setTimeout(timerEnd ,60000)

function timerEnd() {
    // exArray.forEach(ex => ex.forEach(i => i[4].disabled = true))
    const result = document.createElement('p');
    result.classList.add('result');
    document.getElementById('timerSec').appendChild(result);
    result.textContent = "TIME'S OUT"
    setTimeout(checkEx, 2000);
}

function checkEx() {
    for (i of exArray) {
        if (i[0].textContent * i[2].textContent == i[4].value) {
            console.log('right answer' + i[4].value);
            i[5].classList.add('v');
            i[5].textContent = 'v'
            score++
        } else {
            i[5].classList.add('x');
            i[5].textContent = 'x'
        }
    }
    setTimeout(function(){
        document.getElementById('result').style.display = 'flex';
        const resultMessage = document.getElementById('resultMessage')
    console.log(result + 'result');
    resultMessage.textContent = `You have now ${score} coockies`;
    bakerObj.score = score;
    localStorage.setItem(baker, JSON.stringify(bakerObj));
    }, 1500)    
}

function updateScore(){

}

