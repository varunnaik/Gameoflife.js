var GameOfLife = function(settings) {
    
    // Setup the game
    
    /* 
        settings.numRows = number of rows in the canvas
        settings.numCols = number of columns in the canvas
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
	/* ************************ INITIALISE SETTINGS ***************************/
    this.zoomLevel = 1;
	this.numRows = 40;
	this.numCols = 80;
	this.elementId = 'life_canvas';
	this.cellSize = 10;
	this.borderColor = '#000000';
	this.deadCellBackgroundColor = '#ff0000';
	this.liveCellBackgroundColor = '#0000ff';
	this.emptyCellBackgroundColor = '#ffffff';
	this.differenteateDeadEmptyCells = false;
	this.allowClick = true;
	this.enableReset = true;
	this.enableClear = true;
	this.enablePredefines = true;
	this.flashClear = true;
	
	if (typeof settings !== 'undefined') {
		if (typeof settings.numRows !== 'undefined') {
			this.numRows = settings.numRows;
		}
		if (typeof settings.numCols !== 'undefined') {
			this.numCols = settings.numCols;
		}
		if (typeof settings.elementId !== 'undefined') {
			this.elementId = settings.elementId;
		}
		if (typeof settings.cellSize !== 'undefined') {
			this.cellSize = settings.cellSize;
		}
		if (typeof settings.borderColor !== 'undefined') {
			this.borderColor = settings.borderColor;
		}
		if (typeof settings.deadCellBackgroundColor !== 'undefined') {
			this.deadCellBackgroundColor = settings.deadCellBackgroundColor;
		}
		if (typeof settings.liveCellBackgroundColor !== 'undefined') {
			this.liveCellBackgroundColor = settings.liveCellBackgroundColor;
		}
		if (typeof settings.emptyCellBackgroundColor !== 'undefined') {
			this.emptyCellBackgroundColor = settings.emptyCellBackgroundColor;
		}
		if (typeof settings.differenteateDeadEmptyCells !== 'undefined') {
			this.differenteateDeadEmptyCells = settings.differenteateDeadEmptyCells;
		}
		if (typeof settings.allowClick !== 'undefined') {
			this.allowClick = settings.allowClick;
		}
		if (typeof settings.enableReset !== 'undefined') {
			this.enableReset = settings.enableReset;
		}
		if (typeof settings.enableClear !== 'undefined') {
			this.enableClear = settings.enableClear;
		}
		if (typeof settings.enablePredefines !== 'undefined') {
			this.enablePredefines = settings.enablePredefines;
		}
		if (typeof settings.flashClear !== 'undefined') {
			this.flashClear = settings.flashClear;
		}
	}
	
	/* ********************* END SETTINGS INITIALISATION **********************/
	
    this.initCanvas = function() {
		// Set up canvas and event handlers
        this.canvas = document.getElementById('life_canvas');
		this.context = this.canvas.getContext('2d');
		
		/* Set Canvas Width and Height as specified */
		this.canvas.height = ( this.numRows * this.cellSize ) ;
		this.canvas.width = (this.numCols * this.cellSize );
		
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
	
	this.updateBoard = function() {
		// Update the board with the current state of the game
		
		// For each position that has changed state: update it on the canvas
	
	},
	
	this.clear = function() {
		// Clears the game state as well as the canvas
		
		this.clearCanvas();	
	},
	
	this.initGame = function() {
	
	}
	
	this.initCanvas();
	this.initGame();
}