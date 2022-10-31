let isSingle = true;
const submit = document.getElementById('enterGame');
submit.addEventListener('click', enterGame);
function enterGame(event) {
    event.preventDefault();
    let hostName = document.getElementById('name2').value;
    let guestName = document.getElementById('name1').value;
    if (!isSingle) { //checking 2 names and seving the host + guest names
        if (hostName.length > 0 && guestName.length > 0) {
            localStorage.setItem('host', JSON.stringify({ name: hostName, score: 5, symbol: 'x'}));
            localStorage.setItem('guest', JSON.stringify({ name: guestName, score: 5, symbol: 'o'}));
        } else {
            alert('Some name is missing.. enter the names of two players');
        }
    } else if (guestName.length > 0) {
        //checking 1 name and seving the guest name + auto-player, and  then enter the game
        localStorage.setItem('guest', JSON.stringify({ name: guestName, score: 5 }));
        localStorage.setItem('host', JSON.stringify({ name: 'The Bear', score: 50 }));
        window.location = 'game.html';
    } else {
        alert('Please enter your name')
    }
}

