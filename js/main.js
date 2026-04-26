addEventListener('load', function() {
    const mainMenu = document.getElementById('main-menu');
    const modeSelection = document.getElementById('mode-selection');
	const btnMode1 = document.getElementById('mode1');
	const btnMode2 = document.getElementById('mode2');
	
	function clearModeSelection() {
		btnMode1.classList.remove('selected');
		btnMode2.classList.remove('selected');
	}
	
    document.getElementById('play').addEventListener('click', function() {
        mainMenu.classList.add('hidden');
        modeSelection.classList.remove('hidden');
        if(!sessionStorage.getItem('gameMode')) {
            sessionStorage.setItem('gameMode', 'mode1');
        }
        clearModeSelection();
        if(sessionStorage.getItem('gameMode') === 'mode1') btnMode1.classList.add('selected');
        else btnMode2.classList.add('selected');
    });

	btnMode1.addEventListener('click', function() {
        sessionStorage.setItem('gameMode', 'mode1');
        clearModeSelection();
		btnMode1.classList.add('selected');
		console.log("Mode 1 seleccionat");
    });

    btnMode2.addEventListener('click', function() {
        sessionStorage.setItem('gameMode', 'mode2');
        clearModeSelection();
		btnMode2.classList.add('selected');
		console.log("Mode 2 seleccionat");
    });
	
	document.getElementById('start-game').addEventListener('click', function() {
        const alies = prompt("Introdueix el teu àlies de jugador per començar:");
        
        if (alies != null && alies.trim() !== "") {
            sessionStorage.setItem('alies', alies);
            sessionStorage.removeItem('load');
			sessionStorage.removeItem('currentLevel');
			sessionStorage.removeItem('currentScore');
            window.location.assign("./html/game.html");
        } else if (alies != null) {
            alert("Has d'introduir un nom per poder jugar.");
        }
    });
	
    document.getElementById('back-menu').addEventListener('click', function() {
        modeSelection.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        window.location.assign("./html/options.html");
    });

	document.getElementById('scores').addEventListener('click', function() {
        window.location.assign("./html/scores.html");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        let allSaves = JSON.parse(localStorage.getItem('memory_saves') || '[]');
        if (allSaves.length === 0) {
            alert("No hi ha cap partida guardada en aquest navegador.");
            return;
        }
        let message = "Tria el número de la partida que vols carregar:\n";
        allSaves.forEach((s, idx) => {
            message += `${idx + 1}. ${s.alies} - ${s.gameMode} (Nivell ${s.currentLevel}) - ${s.date}\n`;
        });
        let choice = prompt(message);
        let idx = parseInt(choice) - 1;
        if (allSaves[idx]) {
            sessionStorage.setItem('load', JSON.stringify(allSaves[idx]));
            sessionStorage.setItem('gameMode', allSaves[idx].gameMode);
            sessionStorage.setItem('alies', allSaves[idx].alies);
            window.location.assign("./html/game.html");
        }
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});