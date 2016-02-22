var DURATION = 198.25;
var TIME_PASSED = 0;
var LAST = 0;
var WIDTH = 500;
var IS_DRAG = false;
var MOUSE_DOWN = false;
var IS_REFRESHING = false;

var App = {

	begin : function() {
	
		var self = this;
		
		TimelineInterface.begin();
		AudioController.begin();
		AudioController.updateCallback = self.update;
		AudioController.load('musics/Major Lazer - Light It Up.mp3', 
							 null, 
							 function() {
								
								var time_passed = AudioController.timePassed;
								var duration = AudioController.duration;
								var name = AudioController.musicName;
		
								$('.timeline_timePassed').html(formatTime(time_passed));
								$('.timeline_duration').html(formatTime(duration));
								$('.musicName').html(name);
			
							}
		);
		
	},
	
	update : function() {
		
		// mise à jour des infos
		var time_passed = AudioController.timePassed;	
		var duration = AudioController.duration;
		$('.timeline_timePassed').html(formatTime(time_passed));

		var offset = (time_passed / duration) * WIDTH;
		$('.timeline_progressBar').css('width', offset + 'px');
		$('.timeline_progressHandler').css('left', offset + 'px');
		
	}
	
	
};

function init() {

	App.begin();
	
	debugger;
	
	// Test d'une track  ==> Suite aux premiers tests, cela fonctionne, reste peut être les cas d'égalité à gérer
	var t = new Track();
	t.addNote(new Note(0, 5000));
	t.addNote(new Note(1, 5500, 10000));
	t.addNote(new Note(0, 9000));
	t.addNote(new Note(0, 11000));
	t.addNote(new Note(1, 2000, 4500));
	t.addNote(new Note(0, 5400));
	t.addNote(new Note(1, 4500, 4900));
	
}

$(document).ready(function() {
	
	init();
	
});