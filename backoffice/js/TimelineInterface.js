var TimelineInterface = {
	
	begin : function() {
		
		this.mousePos_mem = null;
		this.buttonDown = false;
		this.isDraging = false;
		
		this.init();
		
	},
		
	init : function() {
	
		var self = this;
		
		// PLAY - PAUSE
		$('.play').click(function() {
			
			$(this).toggleClass('is-playing');
			AudioController.togglePlayPause();
			
		});
		
		$('.volume_button').click(function() {
			
			$(this).toggleClass('muted');
			AudioController.toggleVolume();
			
		});
		
		$('.timeline_progressWrapper').contextmenu(function(e) {
			
			e.preventDefault();
			
		});
	
		// Timeline interaction
		$('.timeline_progressWrapper').mousedown(function(e) {
		
			e.preventDefault();
			self.mouseDown(e);
		
		});
	
		$('.timeline_progressWrapper').mousemove(function(e) {

			e.preventDefault();
			self.mouseMove(e);

		});

		$('.timeline_progressWrapper').mouseup(function(e) {

			e.preventDefault();
			self.mouseUp(e);

		});
		
	},
	
	mouseDown : function(e) {
		
		this.buttonDown = true;
		
	},
		
	mouseMove : function(e) {
		
		if (this.buttonDown && !this.isDraging)
			this.isDraging = true;

		if (this.isDraging) {

			var x = e.pageX - $(".timeline_progressWrapper").offset().left;

			console.log(x);

			var seconds = (x / WIDTH) * AudioController.duration;
			AudioController.updateInfo = false;
			AudioController.goTo(seconds, false);

			App.update();

		}
		
	},
		
	mouseUp : function(e) {
		
		var x = e.pageX - $(".timeline_progressWrapper").offset().left;

		var seconds = (x / WIDTH) * AudioController.duration;
		AudioController.updateInfo = true;
		AudioController.goTo(seconds, true);

		App.update();

		this.isDraging = false;
		this.buttonDown = false;
		
	}
	
};