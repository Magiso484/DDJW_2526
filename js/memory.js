export var gameItems = [];
let setValues = []; 
let cardsState = [];
let flippedCards = []; 
let groupSize = 2; 
let lockBoard = false;

let timeInitialShow = 2000;
let timeErrorHide = 1000;

export function selectCards() { 
    let options = JSON.parse(localStorage.options || '{"pairs":2, "difficulty":"normal", "groupSize":2}');
    let numDistinctCards = parseInt(options.pairs) || 2;
    groupSize = parseInt(options.groupSize) || 2;
	
	let difficulty = options.difficulty || 'normal';
	if (difficulty === 'easy') {
		timeInitialShow = 3000;
		timeErrorHide = 1500;
	}
	else if (difficulty === 'hard') {
		timeInitialShow = 1000;
		timeErrorHide = 500;
	}
	else{
		timeInitialShow = 2000;
		timeErrorHide = 1000;
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
        if (cardsState.every(state => state === 2)) {
            setTimeout(() => {
                alert("Felicitats! Has completat el nivell!");
            }, 300);
        }
    }
}

export function saveGame(){
    console.log("S'ha demanat guardar la partida. Estat actual:", {gameItems, cardsState});
}