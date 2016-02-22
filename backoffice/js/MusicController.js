// Ce qu'il faut bien comprendre c'est qu'on va pas descendre en dessous du dixième de la seconde (trop complexe à gérer)
// Est ce que cela veut dire qu'on sera toujours dans un modulo 100, bonne question ?


var Music = function(name, duration, modes) {

	this.m_name = name || 'Unknown';
	this.m_duration = duration || 0;
	this.m_modes = modes || [3];					// 5 aussi autorisé, on a laissé tomber le 4 (peut être un retour en arrière dans le futur)
	this.m_tracks = {
		'left': null,
		'leftmiddle': new Track(),
		'middle': new Track(),
		'rightmiddle': new Track(),
		'right': null
	};
		
};

Music.prototype.addNote = function(position, type, start, end) {

	
};

Music.prototype.fromFile = function(filename) {
	
	
};

Music.prototype.toFile = function() {
	
	
};



/***************************************************/
//						TRACK
/***************************************************/
var Track = function() {
	
	this.m_timers = new Array();
	this.m_notes = new Array();
	
};
	
Track.prototype.addNote = function(note) {

	// En principe il y a très peu de chance qu'une note longue soit ajoutée ici.
	// Il faut vérifier toutes les règles
	// Première chose à faire c'est de vérifier la logique de la note afin d'être sûr d'avoir des infos cohérentes
	note._checkLogic();
	
	// Les règles sont les suivantes
	// On peut ajouter une note courte si elle n'empiète sur aucune autre note ou sur la mesure d'une note longue
	// On peut ajouter une note longue du moment qu'il n'y a aucune note entre son start et end
	// Dans tous les cas, il faut chopper la note d'avant et d'après par rapport à celle que l'on veut ajouter
	
	var prev = null;
	var next = null;
	
	for (var i = 0; i < this.m_timers.length; i++) {
	
		var timer = this.m_timers[i];
		
		if (note.m_start > timer)
			prev = i;
		
		if (note.m_start < timer && next == null)
			next = i;
		
		if (prev != null && next != null)
			break;
		
	}
	
	// Y'a personne dans le tableau
	if (prev == null && next == null)
	{
		this.m_timers.push(note.m_start);
		this.m_notes[note.m_start] = note;
	}
	// En théorie, elle doit de mettre au début
	else if (prev == null && next != null)
	{
		var nextNote = this.m_notes[this.m_timers[next]];
		if (note.m_type != 1 || (note.m_type == 1 && note.m_end < nextNote.m_start))
		{
			this.m_timers.splice(0, 0, note.m_start);
			this.m_notes[note.m_start] = note;
		}
	}
	// En théorie, elle doit être à la fin
	else if (prev != null && next == null)
	{
		var prevNote = this.m_notes[this.m_timers[prev]];
		if (prevNote.m_type != 1 || (prevNote.m_type == 1 && prevNote.m_end < note.m_start))
		{
			this.m_timers.push(note.m_start);
			this.m_notes[note.m_start] = note;
		}
	}
	// En théorie, elle doit être insérée entre deux
	else
	{
		var prevNote = this.m_notes[this.m_timers[prev]];
		var nextNote = this.m_notes[this.m_timers[next]];
		
		// On teste sur la prev
		if (prevNote.m_type != 1 || (prevNote.m_type == 1 && prevNote.m_end < note.m_start))
		{
			// On teste sur la next
			if (note.m_type != 1 || (note.m_type == 1 && note.m_end < nextNote.m_start))
			{
				this.m_timers.splice(next, 0, note.m_start);
				this.m_notes[note.m_start] = note;
			}
		}
		
	}
	
};

Track.prototype.getNotesBetweenBounds = function(start, end) {

	
	
};

Track.prototype.removeNoteAt = function() {
	
	
	
};

/***************************************************/
//						NOTE
/***************************************************/
var Note = function(type, start, end) {

	this.m_type = type || 0;
	this.m_start = start || 0;						// en ms
	this.m_end = end || -1;							// en ms
	
	this._checkLogic();
};
	
Note.prototype.setType = function(type) {
	
	this.m_type = type;
	
	if (type == 0)
		this.m_end = -1;
	
};
	
Note.prototype.setStart = function(start) {

	this.m_start = start;
	this._checkLogic();
	
	console.log('Note mise à jour');
	
};
	
Note.prototype.setEnd = function(end) {
	
	this.m_end = end;
	this._checkLogic();
	
	console.log('Note mise à jour.');
	
};

Note.prototype._checkLogic = function() {
	
	// Cas où le start est plus petit que le end mais que le type n'est pas bon
	if (this.m_start < this.m_end && this.m_type == 0) {
	
		this.m_type = 1;
		
	}
	// Cas où le start == end
	else if (this.m_start == this.m_end) {
	
		this.m_end = -1;
		
		// On regarde si le type ne convient pas
		if (this.m_type == 1) {
			
			this.m_type = 0;
			
		}
		
	}
	// Cas où le start dépasse le end
	else if (this.m_start > this.m_end && this.m_type == 1) {
	
		var tmp = this.m_start;
		this.m_start = this.m_end;
		this.m_end = tmp;
		
		// On regarde si le type convient
		if (this.m_type == 0) {
			
			this.m_type = 1;
			
		}
		
	}
};