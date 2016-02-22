function formatTime(seconds) {

	seconds = Math.floor(seconds);
	
	var finalMinutes = Math.floor(seconds / 60);
	var finalSeconds = Math.floor(seconds % 60);
	
	return finalMinutes + ':' + (finalSeconds < 10 ? '0' + finalSeconds : finalSeconds);
}