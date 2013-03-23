var GameOfLife = function(settings) {
    
    // Setup the game
    
    /* 
        settings.numRows = number of rows in the canvas
        settings.numCols = number of columns in the canvas
        settings.cellSize = side of cell in px (default 10)
		settings.speed = how many milliseconds between generations
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
	this.speed = 100;
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
		if (typeof settings.speed !== 'undefined') {
			this.speed = settings.speed;
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
		
		this.updateBoard();
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
				this.drawCell(x, y, this.emptyCellBackgroundCOlour);
			}
		}
        
    },
	
	this.boardKillCell = function(row, col) {
		// Kills the cell at row, col on the Canvas		
		this.drawCell (row, col, this.deadCellBackgroundColour);
	},
	
	this.boardBringCellToLife = function() {
		// Brings the cell at row, col to life on the Canvas
		this.drawCell (row, col, this.liveCellBackgroundColour);
	},
	
	this.updateBoard = function() {
		// Update the board with the current state of the game
		
		// For each cell in previousGeneration not in currentGeneration: ded
		for (var i = 0; i < this.previousGeneration.length; i++) {
			for (var j = 0; j < this.previousGeneration[i].length; j++) {
				if (this.currentGeneration[i].indexOf(
						this.previousGeneration[i][j] === -1) {
					this.boardKillCell(i, this.previousGeneration[i][j]);
				}
			}
		}
		
		// For each cell in currentGeneration not in previousGeneration: LIVE!
		for (var i = 0; i < this.currentGeneration.length; i++) {
			for (var j = 0; j < this.currentGeneration.length; j++) {
				if (this.previousGeneration[i].indexOf(
						this.currentGeneration[i][j] === -1) {
					this.boardBringCellToLife(i, this.currentGeneration[i][j]);
				}
			}
		}		
	}
	
	this.drawCell = function(row, col, color) {
		// Draws a cell on the canvas. 
		// Caller has to pass the colour of the cell - alive / dead / empty as
		// rgba or hex values
		// Border colour is determined from object
		// Cellsize is determined from object.
		
		var x = row * this.cellSize;
		var y = col * this.cellSize;
		
		this.context.strokeStyle = this.borderColour;
		this.context.strokeRect (x, y, this.cellSize, this.cellSize);
		this.context.fillStyle = colour;
		this.context.fillRect(x, y, this.cellSize, this.cellSize);
	
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
		for (var i in this.previousGeneration) {
			var row = this.previousGeneration[i];
			
			// For each column
			for (var j = 0; j < row.length; j++) {
				var col = this.previousGeneration[i][j];
				
				// Evolve the neighbours of the cell at row, col
				var neighbours = this.getLivingCellNeighbourhood(row, col);
				for (var k = 0; k < this.neighbours.length; k++) {
					if (this.evolveCell(neighbours[k][0], neighbours[k][1])) {
						this.currentGeneration[neighbours[k][0]].push(
								neighbours[k][1]
						);					
					}
				}

				// Evolve the cell at row, col
				if (this.evolveCell(row, col)) {
					this.currentGeneration[row].push(col);
				}
			}
		}
	
	},
	
	this.isCellAlive = function(row, col) {
		// Returns true if the cell at row, col is alive
		// False otherwise
		if (typeof this.previousGeneration[row] === 'undefined') {
			return false;
		}
		if (this.previousGeneration[row].indexOf(col) > -1) {
			return true;
		}
		return false;
	}
	
	this.getLivingCellNeighbourhood = function(row, col) {
		// Given a cell located at row and col, return an array containing
		// the row and cols of its neighbours that are alive
		// Example: Given row = 10 and col = 10, return
		// [[9,9],[9,10],[9,11],[10,9],[10,11],[11,9],[11,10],[11,11]]
		// ASSUMING all neighbours are alive
		
		var previousRow = row == 0? this.numRows : row - 1;
		var previousColumn = col == 0? this.numCols : col - 1;
		var nextRow = (row + 1) % this.numRows;
		var nextColumn = (col + 1) % this.numCols;
		
		var neighbourhood = [];
		
		if (this.isCellAlive(previousRow, previousColumn)) {
			neighbourhood.push([previousRow, previousColumn]);
		}
		if (this.isCellAlive(row, previousColumn)) {
			neighbourhood.push([row, previousColumn]);
		}
		if (this.isCellAlive(nextRow, previousColumn)) {
			neighbourhood.push([nextRow, previousColumn]);
		}
		if (this.isCellAlive(previousRow, col)) {
			neighbourhood.push([previousRow, col]);
		}
		if (this.isCellAlive(nextRow, col)) {
			neighbourhood.push([nextRow, col]);
		}
		if (this.isCellAlive(previousRow, nextColumn)) {
			neighbourhood.push([previousRow, nextColumn]);
		}
		if (this.isCellAlive(row, nextColumn)) {
			neighbourhood.push([row, nextColumn]);
		}
		if (this.isCellAlive(nextRow, nextColumn)) {
			neighbourhood.push([nextRow, nextColumn]);
		}
		return neighbourhood;
	
	}
	
	this.evolveCell = function(row, col) {
		// Evolve the cell located at this.previousGeneration[row][cell]
		// Return true if alive or false if dead
		// Parameters: 
		// row: row of cell to evolve, index to this.previousGeneration
		// col: column of cell to evolve, index to this.previousGeneration[row]
		// Return:
		// true: Cell is alive after evolution, 
		// false: Cell is dead after evolution
		
		var aliveCount = 0;
		var currentCellAlive = this.previousGeneration[row][col];
		
		var neighbours = this.getLivingCellNeighbourhood(row, col);
		
		for (var i = 0; i < neighbourhood.length; i++) {
			if (this.previousGeneration[neighbours[i][0], neighbours[i][1]) {
				aliveCount += 1;
			}		
		}
		/*
		var previousRow = row == 0? this.numRows : row - 1;
		var previousColumn = col == 0? this.numCols : col - 1;
		var nextRow = (row + 1) % this.numRows;
		var nextColumn = (col + 1) % this.numCols;		
		
		if (this.previousGeneration[previousRow][previousColumn]) aliveCount+=1;
		if (this.previousGeneration[row][previousColumn]) aliveCount+=1;
		if (this.previousGeneration[nextRow][previousColumn]) aliveCount+=1;
		if (this.previousGeneration[previousRow][col]) aliveCount+=1;
		if (this.previousGeneration[nextRow][col]) aliveCount+=1;
		if (this.previousGeneration[previousRow][nextColumn]) aliveCount+=1;
		if (this.previousGeneration[row][nextColumn]) aliveCount+=1;
		if (this.previousGeneration[nextRow][nextColumn]) aliveCount+=1;
		*/
		if (currentCellAlive && aliveCount < 2) return false;
		if (currentCellAlive && (2 <= aliveCount <= 3) return true;
		if (currentCellAlive && aliveCount > 2) return false;
		if (! currentCellAlive && aliveCount == 3) return true;
		
	},
	
	
	/* ********************* END GAME OF LIFE *********************************/

	/* ********************* Play the game ************************************/
	
	this.clear = function() {
		// Clears the game state as well as the canvas
		
		this.clearCanvas();	
	},
	
	this.playGame = function() {
		// Plays the game continuously
	
		// Evolve the current generation
		this.tick();
		
		// Update the board
		this.updateboard();
		
		// Prepare for next generation
		this.previousGeneration = this.currentGeneration;
		
		// Prepare next call to tick
		setTimeout(this.playGame, this.speed);
	}


	
	this.initGame = function() {
	
	}
	
	this.initCanvas();
	this.initGame();
}