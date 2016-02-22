AudioController = {

	begin : function() {
		
		this.isPlaying = false;
		this.duration = 0;
		this.timePassed = 0;
		this.musicBuffer = null;
		this.musicName = null;
		this.volume = 1;
		
		this.updateCallback = null;
		this.updateInfo = true;
		this.intervalID = null;
		
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.audioAnalyser = this.audioCtx.createAnalyser();
		this.audioAnalyser.connect(this.audioCtx.destination);
		
		this._startTime = 0;
		this._startOffset = 0;
		
	},
	
	load : function(filename, onprogress, onload) {
		
		var self = this;
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", filename, true);
		xhr.responseType = "arraybuffer";
		
		xhr.onprogress = function(e) {
		
			// If we don't have this information we can't compute progress information
			if (e.lengthComputable) {

				var percentComplete = Math.floor((e.loaded / e.total) * 100) / 100;

				if (onprogress)
					onprogress(percentComplete);

			} else {

				console.warn('We can\'t compute progress information');

			}
			
		};
		
		xhr.onload = function() {
			
			self.audioCtx.decodeAudioData(
				xhr.response,
				function(buffer) {
					
					self.musicName = filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
					self.musicBuffer = buffer;
					self.duration = buffer.duration;
					
					if (onload)
						onload();
					
				},
				function(error) {
					
					alert("decodeAudioData error : " + error);
					
				}
			);
			
		};
		
		xhr.onerror = function() {
		
			alert("Error with " + filename);
			
		};
		
		xhr.send();
		
	},
	
	play : function() {
		
		if (this.isPlaying || this.musicBuffer == null)
			return false;
		
		this.isPlaying = true;
		
		this._startTime = this.audioCtx.currentTime;
		
		this._gain = this.audioCtx.createGain();
		this._gain.connect(this.audioAnalyser);
		
		this._source = this.audioCtx.createBufferSource();
		this._source.connect(this._gain);
		this._source.buffer = this.musicBuffer;
		this._source.loop = true;
		
		this._source[this._source.start ? 'start' : noteOn](0, this._startOffset % this.duration);
		
		this.setVolume(this.volume);
		
		var self = this;
		this.intervalID = setInterval(function() {
			
			if (!self.updateInfo)
				return;
			
			self.timePassed = ((self.audioCtx.currentTime - self._startTime) + self._startOffset) % self.duration;
			
			if (self.updateCallback)
				self.updateCallback();
			
		}, 33);
		
		return true;
		
	},
	
	pause : function() {
		
		if (!this.isPlaying || this.musicBuffer == null)
			return false;
		
		this.isPlaying = false;
		
		this._source[this._source.stop ? 'stop' : 'noteOff'](0);
		this._startOffset += this.audioCtx.currentTime - this._startTime;
		
		clearInterval(this.intervalID);
		this.intervalID = null;
		
		return true;
	},
	
	togglePlayPause : function() {
	
		if (this.isPlaying)
			this.pause();
		else
			this.play();
		
	},
	
	goTo : function(seconds, forceTogglePlayPause) {
	
		if (seconds < 0 || seconds > this.duration)
			return;
		
		this._startOffset = seconds;
		this.timePassed = this._startOffset;
		
		if (forceTogglePlayPause) {
		
			this.togglePlayPause();
			this.togglePlayPause();
			
		}
		
		
		this.updateCallback();
		
	},
	
	setVolume : function(value) {
	
		if (value < 0 || value > 1)
			return;
		
		this._gain.gain.value = value * value;
		
	},
	
	toggleVolume : function() {
	
		this.volume = this.volume == 1 ? 0 : 1;
		
		this.setVolume(this.volume);
		
	}
	
};