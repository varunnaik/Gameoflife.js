var gameOfLife = function(settings) {
    
    // Setup the game
    
    /* 
        settings.height = height of canvas
        settings.width = width of canvas
        settings.cellSize = side of cell in px (default 10)
        settings.borderColor = border colour between cells and around canvas 
            (default black)
        settings.deadCellBackgroundColor = background colour of dead cell
        settings.liveCellBackgroundColour = background colour of live cell
        settings.emptyCellBackgroundColour = background colour of empty cell 
            (a cell that was never visited)
        settings.differenteateDeadEmptyCells = whether or not to show dead cells
            in a different colour from empty cells.
        settings.initialState = initial state of canvas (see below)
        settings.animateList = list of games and how long each should play
            (see below)
        settings.allowClick = allow users to click on a cell to make it alive
        settings.enableReset = show reset button at bottom right if mouse enters
            canvas. Resets the canvas to its initial state.
        settings.enableClear = show clear button at bottom right if mouse enters
            canvas
        settings.enablePredefines = show listbox with predefined shapes at
            bottom right if mouse enters canvas
        settings.flashClear = whether to clear the canvas with a flash animation
            or to simply clear it instantly
        settings.elementId = ID of the <canvas> to use to show this
            
        Initial State:
        
        
        Animate List:
    */    
    this.zoomLevel = 1;
    this.height = typeof settings.height !== 'undefined'? settings.height : 350;
    this.width = typeof settings.width !== 'undefined'? settings.width : 900;
    this.elementId = typeof settings.elementId !== 'undefined'?
                                            settings.elementId : 'life_canvas';
    this.cellSize = typeof settings.cellSize !== 'undefined'?
														settings.cellSize : 10;
	this.borderColor = typeof settings.borderColor !== 'undefined'?
											  settings.borderColor : '#000000';
	this.deadCellBackgroundColor = 
			typeof settings.deadCellBackgroundColor !== 'undefined'?
								  settings.deadCellBackgroundColor : '#ff0000';
	this.liveCellBackgroundColor = 
			typeof settings.liveCellBackgroundColor !== 'undefined'?
								  settings.liveCellBackgroundColor : '#0000ff';
	this.emptyCellBackgroundColor = 
			typeof settings.emptyCellBackgroundColor !== 'undefined'?
								 settings.emptyCellBackgroundColor : '#ffffff';
	this.differenteateDeadEmptyCells = 
			typeof settings.differenteateDeadEmptyCells !== 'undefined'?
								  settings.differenteateDeadEmptyCells : false;
	this.allowClick = typeof settings.allowClick !== 'undefined'?
													settings.allowClick : true;
	this.enableReset = typeof settings.enableReset !== 'undefined'?
												   settings.enableReset : true;
	this.enableClear = typeof settings.enableClear !== 'undefined'?
												   settings.enableClear : true;
	this.enablePredefines = typeof settings.enablePredefines !== 'undefined'?
											  settings.enablePredefines : true;
	this.flashClear = typeof settings.flashClear !== 'undefined'?
												   settings.flashClear : false;


    this.initCanvas = function() {
        this.canvas = document.getElementById('life_canvas');
        this.context = this.canvas.getContext('2d');
		
		
		/* **Event handlers** */
		
		if (this.enableClick) {
			// Register click event listener
		
		}
		
		if (this.enableReset || this.enableClear || this.enablePredefines) {
			// Show toolbar when mouse enters canvas
			
		}
		
		if (this.enableReset) {
			// Show the enable reset button and set up the event handler
		}
		
		if (this.enableClear) {
			// Show the enable clear button and set up the event handler
			
		}
		if (this.enablePredefines) {
			// Show the listbox allowing the user to select a preset, and
			// set up the event handler
		}
		
    
    },

    this.clearCanvas = function() {
        // Clears the canvas. If this.flashClear is true, then animates a 
		// flashing effect from top left to bottom right. If false, silently and
		// immediately clears the canvas.
        
    },



}