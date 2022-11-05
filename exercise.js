let baker = localStorage.getItem('baker');
bakerObj = JSON.parse(localStorage.getItem(baker));
let score = bakerObj.score * 1;
console.log(baker);
let  exercise = {
    num1: document.getElementById('num1'),
    num2: document.getElementById('num2'),
    ansInput: document.getElementById('answer'),
    check: document.getElementById('check')
}
let bakeBtn = document.getElementById('bakeMoreBtn');
let message = document.getElementById('resultMessage');
let scoreElem = document.getElementById
('coockiesSum');
scoreElem.textContent = score;
document.getElementById('name').textContent = baker.name;




function createExercise(){
    // const idP = ["num1", "operator", "num2", "equal", "answer", "check"]
    // for(i of idP){
    //     const p = document.createElement(i == "answer" ? 'input' : 'p');
    //     p.setAttribute('id', i)
    //     p.setAttribute('class', 'exP');
    //     document.getElementById('exercise').appendChild(p);
    // }
   
    
}

function setExercise(){
    message.style.display = 'none'
    bakeBtn.style.display = 'none';
    // exercise.check.style.display = 'none';
    exercise.ansInput.value = ''; 
    exercise.num1.textContent = Math.ceil(Math.random()*10);
    exercise.num2.textContent = Math.ceil(Math.random()*10);
    // exercise.ansInput.addEventListener('keydown',  enableCheck());    
}

function enableCheck(){
    if(/^[0-9]*$/.test(exercise.ansInput.value)){
        console.log('key down event');
        exercise.check.textContent = 'CHECK';
        exercise.check.style.background = 'yellow';
        // exercise.check.style.display = 'flex'; 
    }      
}

function check(){
        if(exercise.num1.textContent * exercise.num2.textContent == Number(exercise.ansInput.value)){
            exercise.check.textContent = 'v';
            exercise.check.style.background = '#35f35b'
            scoreElem.textContent++;
            // alert(`you have now ${scoreElem.textContent} cookies!`)
            bakeBtn.style.display = 'flex';
            message.style.display = 'flex'
            if(scoreElem.textContent >=5){
                document.getElementById('playGameBtn').style.display = 'flex'
            } 
        }else{
            exercise.check.textContent = 'x';
            exercise.check.style.background = 'red'
            exercise.ansInput.value = '';
        } 
        // exercise.check.removeEventListener('click', check());
}

function goToGame(){
    bakerObj.score = scoreElem.textContent;
    localStorage.setItem(baker, JSON.stringify(bakerObj));
    window.location.href = "game.html";
}
setExercise()
