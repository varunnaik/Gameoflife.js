var GameOfLife = function(settings) {
    
    // Setup the game
    
    /* 
        settings.numRows = number of rows in the canvas
        settings.numCols = number of columns in the canvas
        settings.cellSize = side of cell in px (default 10)
		settings.speed = how many milliseconds between generations
        settings.bordercolour = border colour between cells and around canvas 
            (default black)
		settings.drawBorder = draws border around each cell if true
		settings.drawFrame = draws border around entire canvas if true
        settings.deadCellBackgroundcolour = background colour of dead cell
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
	this.speed = 100;
	this.elementId = 'life_canvas';
	this.cellSize = 10;
	this.borderColour = '#000000';
	this.drawBorder = true;
	this.drawFrame = true;
	this.deadCellBackgroundColour = '#ff0000';
	this.liveCellBackgroundColour = '#0000ff';
	this.emptyCellBackgroundColour = '#ffffff';
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
		if (typeof settings.speed !== 'undefined') {
			this.speed = settings.speed;
		}
		if (typeof settings.elementId !== 'undefined') {
			this.elementId = settings.elementId;
		}
		if (typeof settings.cellSize !== 'undefined') {
			this.cellSize = settings.cellSize;
		}
		if (typeof settings.bordercolour !== 'undefined') {
			this.bordercolour = settings.bordercolour;
		}
		if (typeof settings.drawBorder !== 'undefined') {
			this.drawBorder = settings.drawBorder;
		}
		if (typeof settings.drawFrame !== 'undefined') {
			this.drawFrame = settings.drawFrame;
		}
		if (typeof settings.deadCellBackgroundcolour !== 'undefined') {
			this.deadCellBackgroundcolour = settings.deadCellBackgroundcolour;
		}
		if (typeof settings.liveCellBackgroundcolour !== 'undefined') {
			this.liveCellBackgroundcolour = settings.liveCellBackgroundcolour;
		}
		if (typeof settings.emptyCellBackgroundcolour !== 'undefined') {
			this.emptyCellBackgroundcolour = settings.emptyCellBackgroundcolour;
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
	
	/* A short note on storage format:
		We store the row number and the columns in that row that are alive.
		Therefore, if cells #45, 78, 91 on row #6 are alive and the rest are
		dead, we represent it thus:
		[[6] [45,78,91]]
		All rows are present in the array, but only columns with living cells
		are present.
	*/	
	this.previousGeneration = [];
	this.currentGeneration = [];
	/* ********************* END SETTINGS INITIALISATION **********************/
	
	/* ********************* CANVAS AND DRAWING *******************************/
	
    this.initCanvas = function() {
		// Set up canvas and event handlers
        this.canvas = document.getElementById('life_canvas');
		this.context = this.canvas.getContext('2d');
		console.log(this.context);
		/* Set Canvas Width and Height as specified */
		this.canvas.height = ( this.numRows * this.cellSize) ;
		this.canvas.width = (this.numCols * this.cellSize);
		
		if (this.drawFrame === true) {
			if (this.drawBorder === false) {
				this.canvas.setAttribute('style', "border: 1px solid " +
															this.borderColour);
			} else {
				this.canvas.setAttribute('style', "border: 1px solid " +
					this.borderColour + "; border-right: 0; border-bottom: 0");
			}
		}
		
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
		
		//this.updateBoard();
    },

    this.clearCanvas = function(effect) {
        // Clears the canvas. Uses effect specified if any.
		// "diagonal": From top left, a flash to the bottom right
		// "cross": Vertical line from left to right, horizontal from top to
		//		bottom. Intersection gets cleared
		// "radiate": From centre, circle radiates outwards clearing everything
		// "spiral": Spiral starts from top left and works its way towards
		//		centre
		// none: Instantly clears the canvas
		
		for (var x = 0; x < this.numRows; x++) {
			for (var y = 0; y < this.numCols; y++) {
				this.drawCell(y, x, this.emptyCellBackgroundColour);
			}
		}
        
    },
	
	this.boardKillCell = function(row, col) {
		// Kills the cell at row, col on the Canvas		
		this.drawCell (col, row, this.deadCellBackgroundColour);
	},
	
	this.boardBringCellToLife = function(row, col) {
		// Brings the cell at row, col to life on the Canvas
		this.drawCell (col, row, this.liveCellBackgroundColour);
	},
	
	this.updateBoard = function() {
		// Update the board with the current state of the game

		// For each cell in previousGeneration not in currentGeneration: ded
		for (var i = 0; i < this.numRows; i++) {
			for (var j = 0; j < this.numCols; j++) {
				if (this.previousGeneration[i][j] && 
						!this.currentGeneration[i][j]) {
					this.boardKillCell(i, j);
				}
				if (this.currentGeneration[i][j] && 
						!this.previousGeneration[i][j]) {
					this.boardBringCellToLife(i, j);
				}				
			}
		}
	}
	
	this.drawCell = function(row, col, colour) {
		// Draws a cell on the canvas. 
		// Caller has to pass the colour of the cell - alive / dead / empty as
		// rgba or hex values
		// Border colour is determined from object
		// Cellsize is determined from object.
		
		var x = row * this.cellSize;
		var y = col * this.cellSize;
		
		if (this.drawBorder) {
			var cellSize = this.cellSize - 1; // Account for space taken by border
			this.context.strokeStyle = this.borderColour;
			this.context.strokeRect (x, y, cellSize, cellSize);
		} else {
			var cellSize = this.cellSize;
		}		
		
		this.context.fillStyle = colour;
		this.context.fillRect(x, y, cellSize, cellSize);
	
	}
	
	
	/* ********************* END CANVAS AND DRAWING ***************************/
	
	/* ********************* GAME OF LIFE *************************************/
	
	this.tick = function() {
		/*
			1. For each living cell in this generation:
			2. Apply all rules to 8 cells surrounding it, along with the cell itself.
			3. Store resulting live cells in new array
			
			Update: Get elements of old list not in new list and mark dead
			Get elements of new list not in old list and mark alive
			Assign old = new.
		*/

		// For each row
		var count = 0;
		for (var i = 0; i < this.numRows; i++) {
			for (var j = 0; j < this.numCols; j++) {				
				if (this.evolve(i, j)) {					
					this.currentGeneration[i][j] = 1;
					count += 1;
				}
			}
		}
		console.log("Evolved " + count + " of " + (this.numRows * this.numCols));
	}
	
	this.evolve = function(row, col) {
		// Returns true if cell at row, col should live and false if it should die
		
		var previousRow = row == 0? this.numRows-1 : row - 1;
		var previousColumn = col == 0? this.numCols-1 : col - 1;
		var nextRow = (row + 1) % this.numRows;
		var nextColumn = (col + 1) % this.numCols;
		
		var aliveCount = 0;
		var currentCellAlive = this.previousGeneration[row][col];
		
		if (this.previousGeneration[previousRow][previousColumn]) aliveCount+=1;
		if (this.previousGeneration[row][previousColumn]) aliveCount+=1;
		if (this.previousGeneration[nextRow][previousColumn]) aliveCount+=1;
		if (this.previousGeneration[previousRow][col]) aliveCount+=1;
		if (this.previousGeneration[nextRow][col]) aliveCount+=1;
		if (this.previousGeneration[previousRow][nextColumn]) aliveCount+=1;
		if (this.previousGeneration[row][nextColumn]) aliveCount+=1;
		if (this.previousGeneration[nextRow][nextColumn]) aliveCount+=1;
		
		if (currentCellAlive && aliveCount < 2) return false;
		if (currentCellAlive && (aliveCount == 2 || aliveCount == 3)) return true;
		if (currentCellAlive && aliveCount > 2) return false;
		if (! currentCellAlive && aliveCount == 3) return true;
		return false;	
	}
	
	
	/* ********************* END GAME OF LIFE *********************************/

	/* ********************* Play the game ************************************/
	
	this.clear = function() {
		// Clears the game state as well as the canvas
		
		this.clearCanvas();	
	},
	
	this.playGame = function() {
		// Plays the game continuously
		console.log("Play.");
	
		// Evolve the current generation
		this.tick();
		
		// Update the board
		this.updateBoard();

		// Prepare for next generation
		for (var i = 0; i < this.numRows; i++) {
			for (var j = 0; j < this.numCols; j++) {
				this.previousGeneration[i][j] = this.currentGeneration[i][j];
				this.currentGeneration[i][j] = 0;
			}
		}
		
		this.counter += 1;
		//if (this.counter == 3) return;

		var _this = this;
		
		// Prepare next call to tick
		setTimeout(function () {
			// Closure to call play game
			_this.playGame();
		}, this.speed);
	}
		
	this.initGame = function() {
		this.counter = 0;
		this.previousGeneration = [];
		this.currentGeneration = [];
		for (var x = 0; x < this.numRows; x++) {
			this.previousGeneration[x] = [];
			this.currentGeneration[x] = [];
			for (var y = 0; y < this.numCols; y++) {
				this.previousGeneration[x][y] = 0;
				this.currentGeneration[x][y] = 0;
			}
		}
		// Test Glider
		this.previousGeneration[0][2] = 1;
		this.previousGeneration[1][3] = 1;
		this.previousGeneration[2][1] = 1;
		this.previousGeneration[2][2] = 1;
		this.previousGeneration[2][3] = 1;
		
		this.clear();
		this.playGame();
	}
	
	this.initCanvas();
	this.initGame();
}