export var gameItems = [];
let setValues = []; 
let cardsState = [];
let flippedCards = []; 
let groupSize = 2; 
let lockBoard = false;

let timeInitialShow = 2000;
let timeErrorHide = 1000;

export let currentLevel = 1;
export let currentScore = 0;
let gameMode = 'mode1';

export function selectCards() { 
	gameMode = sessionStorage.getItem('gameMode') || 'mode1';
    let options = JSON.parse(localStorage.options || '{"pairs":2, "difficulty":"normal", "groupSize":2, "startLevel":1}');
	
	let loadedData = sessionStorage.getItem('load');
	if(loadedData){
		let data = JSON.parse(loadedData);
		gameItems = data.gameItems;
		cardsState = data.cardsState;
        groupSize = data.groupSize;
        gameMode = data.gameMode;
        currentLevel = data.currentLevel;
        currentScore = data.currentScore;
		
		sessionStorage.removeItem('load');
		if(gameMode==='mode2') updateTitle();
		flippedCards = [];
		lockBoard = false;
		return;
	}	
	
    let numDistinctCards = 2;
    //groupSize = parseInt(options.groupSize) || 2;
	
	if (gameMode === 'mode2'){
		currentLevel = parseInt(sessionStorage.getItem('currentLevel')) || parseInt(options.startLevel) || 1;
		currentScore = parseInt(sessionStorage.getItem('currentScore')) || 0;
		numDistinctCards = Math.min(2 + Math.floor((currentLevel-1)/2), 6);
		groupSize = 2 + Math.floor((currentLevel-1)/3);
		timeInitialShow = Math.max(2000 - ((currentLevel-1)*200), 250);
		timeErrorHide = Math.max(1000 - ((currentLevel-1)*100), 150);
		updateTitle();
	}
	else {
		currentLevel=1;
		currentScore=0;
		numDistinctCards = parseInt(options.pairs) || 2;
		groupSize = parseInt(options.groupSize) || 2;
		let difficulty = options.difficulty || 'normal';
		if(difficulty === 'easy') {
			timeInitialShow = 3000; timeErrorHide = 1500;
        } else if (difficulty === 'hard') {
            timeInitialShow = 500; timeErrorHide = 500;
        } else {
            timeInitialShow = 2000; timeErrorHide = 1000;
        }
        
        const titleElement = document.getElementById('title');
        if(titleElement) titleElement.innerText = `Mode Estàndard`;
    }	
	
    const availableCards = [
        "../resources/cb.png", "../resources/co.png", 
        "../resources/sb.png", "../resources/so.png", 
        "../resources/tb.png", "../resources/to.png"
    ];
    
    let selected = availableCards.slice(0, numDistinctCards);
    
    gameItems = [];
    for (let i = 0; i < groupSize; i++) {
        gameItems = gameItems.concat(selected);
    }
    
    gameItems.sort(() => Math.random() - 0.5);

    cardsState = new Array(gameItems.length).fill(0);
    setValues = [];
    flippedCards = [];
    lockBoard = false;
}

export function initCard(callback) { 
    setValues.push(callback); 
}

export function startGame() { 
    lockBoard = true;
    setValues.forEach((callback, indx) => {
        callback(gameItems[indx]);
        cardsState[indx] = 1;
    });

    setTimeout(() => {
        setValues.forEach((callback, indx) => {
            callback("../resources/back.png");
            cardsState[indx] = 0;
        });
        lockBoard = false;
    }, timeInitialShow);
}

export function clickCard(indx){
    if (lockBoard || cardsState[indx] !== 0) return;

    cardsState[indx] = 1;
    setValues[indx](gameItems[indx]); 
    flippedCards.push(indx);
    let firstCard = gameItems[flippedCards[0]];
    if (gameItems[indx] !== firstCard) {
        lockBoard = true;
		if (gameMode === 'mode2') {
			currentScore = Math.max(0, currentScore-(currentLevel*5));
			sessionStorage.setItem('currentScore', currentScore);
		}
        setTimeout(() => {
            flippedCards.forEach(i => {
                cardsState[i] = 0;
                setValues[i]("../resources/back.png");
            });
            flippedCards = [];
            lockBoard = false;
        }, timeErrorHide);
        return;
		
    }
	
    if (flippedCards.length === groupSize) {
        flippedCards.forEach(i => cardsState[i] = 2);
        flippedCards = [];
		
		if (gameMode==='mode2'){
			currentScore += (currentLevel*50);
			sessionStorage.setItem('currentScore', currentScore);
			updateTitle();
		}
		
        if (cardsState.every(state => state === 2)) {
			if (gameMode==='mode2'){
				currentScore += (currentLevel*50);
				sessionStorage.setItem('currentScore', currentScore);
				sessionStorage.setItem('currentLevel', currentLevel+1);
				setTimeout(() => {
					alert(`Nivell ${currentLevel} completat! Puntuació total: ${currentScore}`);
					location.reload();
				}, 500);
			}
			else {
				setTimeout(() => {
					alert("Felicitats! Has completat el nivell!");
				}, 300);
			}
        }
    }
}

function updateTitle() {
    const titleElement = document.getElementById('title');
    if (titleElement && gameMode === 'mode2') {
        titleElement.innerText = `Mode Infinit - Nivell ${currentLevel} | Punts: ${currentScore}`;
    }
}

export function registerFinalScore() {
    const alies = sessionStorage.getItem('alies') || 'Anònim';
    const score = parseInt(sessionStorage.getItem('currentScore')) || 0;
    if (score === 0) return;
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    ranking.push({ name: alies, points: score });
    ranking.sort((a, b) => b.points - a.points);
    ranking = ranking.slice(0, 10);

    localStorage.setItem('ranking', JSON.stringify(ranking));
	sessionStorage.removeItem('currentLevel');
	sessionStorage.removeItem('currentScore');
    console.log("Puntuació registrada al rànquing.");
}

export function saveGame(){
    const saveData = {
        gameItems: gameItems,
        cardsState: cardsState,
        groupSize: groupSize,
        gameMode: gameMode,
        currentLevel: currentLevel,
        currentScore: currentScore,
        date: new Date().toLocaleString(),
        alies: sessionStorage.getItem('alies') || 'Anònim'
    };
    let allSaves = JSON.parse(localStorage.getItem('memory_saves') || '[]');
    let existingIdx = allSaves.findIndex(s => s.alies === saveData.alies && s.gameMode === saveData.gameMode);
    if (existingIdx !== -1) {
        allSaves[existingIdx] = saveData;
    } else {
        allSaves.push(saveData);
    }
    localStorage.setItem('memory_saves', JSON.stringify(allSaves));
    alert("Partida guardada correctament!");
}