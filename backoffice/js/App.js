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
	
}

$(document).ready(function() {
	
	init();
	
});