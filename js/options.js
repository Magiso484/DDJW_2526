import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var optionsManager = function(){
    const default_options = {
        pairs: 2, // No sempre seràn pairs ara
        difficulty: 'normal',
		groupSize: 2,
		startLevel: 1
    } 
	
	var gameMode = sessionStorage.getItem('gameMode') || 'mode1';

    var pairs = $('#pairs');
    var difficulty = $('#dif');
	var group = $('#group');
	var startLevel = $('#start-level');
    
	if(gameMode == 'mode2'){
		$('#opts-mode1').hide();
		$('#opts-mode2').show();
		$('#title-options').text('Opcions - Mode Infinit');
	}
	else {
		$('#opts-mode2').hide();
		$('#opts-mode1').show();
		$('#title-options').text('Opcions - Mode Estàndard');
	}	
	
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var currentOptions = Object.assign({}, default_options, savedOptions);

    pairs.val(currentOptions.pairs);
    difficulty.val(currentOptions.difficulty);
	group.val(currentOptions.groupSize);
	startLevel.val(currentOptions.startLevel);

    pairs.on('change', () => currentOptions.pairs = parseInt(pairs.val()));

    difficulty.on('change', () => currentOptions.difficulty = difficulty.val());
	
	group.on('change', () => currentOptions.groupSize = parseInt(group.val()));
	
	startLevel.on('change', () => currentOptions.startLevel = parseInt(startLevel.val()));

    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(currentOptions);
        },
        defaultValues: function(){
            Object.assign(currentOptions, default_options);
            pairs.val(currentOptions.pairs);
            difficulty.val(currentOptions.difficulty);
			group.val(currentOptions.groupSize);
			startLevel.val(currentOptions.startLevel);
        }
    }
}();

$('#default').on('click', function(){
    optionsManager.defaultValues();
})

$('#apply').on('click', function(){
    optionsManager.applyChanges();
    location.assign("../");
});
