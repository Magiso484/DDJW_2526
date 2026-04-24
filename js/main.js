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
        const alies = prompt("Introdueix el teu àlies de jugador:");
        if (alies != null && alies.trim() !== "") {
            sessionStorage.setItem('alies', alies);          
            mainMenu.classList.add('hidden');
            modeSelection.classList.remove('hidden');
			
			if(!sessionStorage.getItem('gameMode')){
				sessionStorage.getItem('gameMode', 'mode1');
			}
			
			clearModeSelection();
			if(sessionStorage.getItem('gameMode') === 'mode1') btnMode1.classList.add('selected');
			else btnMode2.classList.add('selected');
        }
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
        sessionStorage.removeItem('load');
        window.location.assign("./html/game.html");
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
        console.log("S'ha clicat el botó de Puntuacions. S'implementarà en el futur.");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});