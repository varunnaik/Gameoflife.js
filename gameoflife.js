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
		settings.initialRules = Rules to start the game with
        settings.allowClick = allow users to click on a cell to make it alive
        settings.enableReset = show reset button at bottom right if mouse enters
            canvas. Resets the canvas to its initial state.
        settings.enableClear = show clear button at bottom right if mouse enters
            canvas
        settings.enablePredefines = show listbox with predefined shapes at
            bottom right if mouse enters canvas
        settings.flashClear = whether to clear the canvas with a flash animation
            or to simply clear it instantly
		settings.enableRuleChange = is the user allowed to change rules
			during the game?
        settings.elementId = ID of the div we use to set up the <canvas>
            
        Initial State:
        
        
        Animate List:
		
		Initial Rules
    */
	/* ************************ INITIALISE SETTINGS ***************************/
    this.zoomLevel = 1;
	this.numRows = 40;
	this.numCols = 80;
	this.speed = 100;
	this.elementId = 'life_canvas_container';
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
	this.rules = true;

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
		if (typeof settings.borderColour !== 'undefined') {
			this.borderColour = settings.borderColour;
		}
		if (typeof settings.drawBorder !== 'undefined') {
			this.drawBorder = settings.drawBorder;
		}
		if (typeof settings.drawFrame !== 'undefined') {
			this.drawFrame = settings.drawFrame;
		}
		if (typeof settings.deadCellBackgroundColour !== 'undefined') {
			this.deadCellBackgroundColour = settings.deadCellBackgroundColour;
		}
		if (typeof settings.liveCellBackgroundColour !== 'undefined') {
			this.liveCellBackgroundColour = settings.liveCellBackgroundColour;
		}
		if (typeof settings.emptyCellBackgroundColour !== 'undefined') {
			this.emptyCellBackgroundColour = settings.emptyCellBackgroundColour;
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
	this.generationNumber = 0; // Which generation is the current generation?
	this.intervalHandle = null; // SetInterval handle used when running game
	/* ********************* END SETTINGS INITIALISATION **********************/
	
	
	/* ********************* PRESET PATTERNS **********************************/
	this.patternLibrary = {
		"1": {width: 3, height: 3, name: "Glider", pattern:
			{0: [1], 1: [2], 2: [0,1,2]}},
		"2": {width: 2, height: 2, name: "Stil Life (Block)", pattern:
			{0: [0,1], 1: [0,1]}},
		"3": {width: 3, height: 3, name: "Blinker", pattern:
			{0: [0,1,2]}},
		"4": {width: 36, height: 9, name: "Gosper Glider Gun", pattern:
			{0: [24], 1: [22,24], 2: [12,13,20,21,34,35], 3: [11,15,20,21,34,35],
			4: [0,1,10,16,20,21], 5: [0,1,10,14,16,17,22,24],  6: [10,16,24],
			7: [11,15], 8: [12,13]}},
		"5": {width: 18, height: 5, name: "Puffer 2", pattern:
			{0: [1,2,3,15,16,17], 1: [0,3,14,17], 2: [3,8,9,10,17],
			3: [3,8,11,17], 4: [2,7,16]}}
	}

	
	
	/* ********************* END PRESET PATTERNS ******************************/
	
	/* ********************* CANVAS AND DRAWING *******************************/
	
    this.initCanvas = function() {
		// Set up canvas and event handlers
		
		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('id', 'life_canvas');
		this.canvasContainer = document.getElementById(this.elementId);
		this.canvasContainer.appendChild(this.canvas);
		
		this.context = this.canvas.getContext('2d');

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
			
			document.getElementById(this.elementId).addEventListener('click', 
				function(event) {
									
				}
			);
		
		}
		
		if (this.enableReset || this.enableClear || this.enablePredefines) {
			
			var toolbar = document.createElement('form');
			toolbar.setAttribute('style', 
				"height: 22px; padding: 3px; margin: 0; width: "+
					(this.numCols * this.cellSize) +"px; margin: 0 auto;");
			
			// Pattern select dropdown
			var patternSelect = document.createElement('select');
			patternSelect.setAttribute('id', "life_pattern_select");
			for (var i in this.patternLibrary) {
				var option = document.createElement('option');
				option.innerHTML = this.patternLibrary[i].name;
				option.value = i;
				patternSelect.appendChild(option);
			}
			toolbar.appendChild(patternSelect);
			
			// Add Button
			var addButton = document.createElement('button');
			addButton.innerHTML="Add";
			var _this = this;
			addButton.onclick = function(event) {_this.replacePattern.call(_this);event.preventDefault(); };
			toolbar.appendChild(addButton);
			
			// Generation count indicator
			var generationDivContainer = document.createElement('div');
			generationDivContainer.setAttribute('style', 'width: 200px; ' +
				'float: right; margin: 0;');
			generationDivContainer.setAttribute("id", "life_generation_count");
			generationDivContainer.innerHTML = "Current Generation: ";
			var generationDiv = document.createElement('div');
			generationDiv.setAttribute('style', 'width: 60px;'  +
				'float: right; margin: 0;');
			this.generationDiv = generationDiv; // Cache reference for fast updates
			generationDivContainer.appendChild(generationDiv);
			toolbar.appendChild(generationDivContainer);			
			
			this.canvasContainer.appendChild(toolbar);
				
			
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
		this.generationDiv.innerHTML = this.generationNumber;
        
    },
	
	this.quickClearCanvas = function() {
		// Quickly and efficiently clears the canvas be making all living cells
		// empty
	
		for (var i = 0; i < this.numRows; i++) {
			for (var j = 0; j < this.numCols; j++) {
				if (this.currentGeneration[i][j]) {
					this.boardEmptyCell(i,j);
				}
				if (this.previousGeneration[i][j]) {
					this.boardEmptyCell(i,j);
				}				
			}
		}		
	}
	
	this.boardEmptyCell = function(row, col) {
		// Marks the cell at row, col as empty
		this.drawCell (col, row, this.emptyCellBackgroundColour);
	}
	
	this.boardKillCell = function(row, col) {
		// Kills the cell at row, col on the Canvas	
		
		if (this.differenteateDeadEmptyCells) {
			this.drawCell (col, row, this.deadCellBackgroundColour);
		} else {
			this.drawCell (col, row, this.emptyCellBackgroundColour);
		}
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
		this.generationDiv.innerHTML = this.generationNumber;
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
	
	this.createToolbar = function() {
		// Create drawing toolbar and add it to the document
		
		var toolbar = document.createElement('form');
		toolbar.style="height: 20px; padding: 3px; margin: 0";
	
	}
	
	this.replacePattern = function() {
		// Gets the user selected pattern and adds it to the centre of the game
		
		var select = document.getElementById('life_pattern_select');
		var pattern = select.options[select.options.selectedIndex].value;
		
		this.clear();
		this.loadPattern(pattern, 0, 0, true);
		
		// Prevent inadvertent form submission
		return false;
	}
	
	/* ********************* END CANVAS AND DRAWING ***************************/
	
	/* ********************* EVENTS *******************************************/
	
	this.showBar = function() {
		
		if (this.toolbarVisible) return;
		
		// Show the toolbar wih transition
	}
	this.hideBar = function() {
		// If barvisible and mouse in bar do not hide
		
		if (this.toolbarVisible === false) return;
		
		// Get mouse position
		// If mouse inside bar or canvas forget it
		// If mouse leaves bar quit
	}	
	this.mouseDown = function(event) {
	
	}
	
	this.mouseMove = function(event) {
	
	}
	
	this.mouseUp = function(event) {
	
	}
	
	/* ********************* END EVENTS ***************************************/
	
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
		this.generationNumber += 1;
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
	
	/* ******************* GAME RULES AND PARAMETERS **************************/
	this.loadPattern = function(patternId, offsetStartX, offsetStartY, centre) {
		// Loads the specified pattern from the internal pattern library
		// If the selected pattern is too large for the board, throws a Pattern
		// Too Large exception.
		// If offsetStartX and offsetStartY are *both* set, renders the pattern
		// Offset to that position from 0,0
		// Otherwise, if centre is set, centres the pattern on the canvas
		
		if (typeof this.patternLibrary[patternId] === 'undefined') {
			throw ("Pattern not found: " + patternId + ".");
		}
			
		if (this.numRows < this.patternLibrary[patternId].height || 
				this.numCols < this.patternLibrary[patternId].width) {
			throw ("Pattern too large.");
		}
		
		var pattern = this.patternLibrary[patternId];
		
		if (centre) {
			// Draw the pattern at the centre of the canvas.
			// Get centre of canvas
			var centreY = this.numRows/2;
			var centreX = this.numCols/2;
			// Get centre of pattern
			var patternCentreY = pattern.height / 2;
			var patternCentreX = pattern.width / 2;
			// To match centre of both, subtract the two	
			var offsetStartY = parseInt(centreX - patternCentreX);
			var offsetStartX = parseInt(centreY - patternCentreY);
		} else {
			if (typeof offsetStartX === 'undefined') {
				var offsetStartX = 0;
			} 
			if (typeof offsetStartY === 'undefined') {
				var offsetStartY = 0;
			}
		}
	
		// Draw the pattern into the internal array
		for (var x in pattern.pattern) {
			row = parseInt(x) + offsetStartX;
			for (var y in pattern.pattern[x]) {				
				col = pattern.pattern[x][y] + offsetStartY;
				this.currentGeneration[row][col] = 1;
			}			
		}
		this.updateBoard();
	}
	
	this.changeRules = function(ruleId) {
		// Changes the rules of the game used by evolve()
		
	}	
	/* ******************* END GAME RULES AND PARAMETERS **********************/

	/* ********************* Play the game ************************************/
	
	this.clear = function() {
		// Clears the game state as well as the canvas
		
		for (var i = 0; i < this.numRows; i++) {
			for (var j = 0; j < this.numCols; j++) {
				this.previousGeneration[i][j] = 0;
				this.currentGeneration[i][j] = 0;
			}
		}
		this.generationNumber = 0;
		this.clearCanvas();	
	},
	
	this.playGame = function() {
		// Plays the game continuously
		
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
	}
	
	this.startGame = function() {
		// Starts playing the game
		
		if (this.intervalHandle !== null) throw "Game already in progress!";
		
		var _this = this;
		// Prepare next call to tick
		this.intervalHandle = setInterval(function () {
			// Closure to call play game
			_this.playGame();
		}, this.speed);
	}
		
	this.initGame = function() {
		// Initialises internal data structures and starts playing the game
		
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
				
		this.clear();
		this.clearCanvas();
		this.loadPattern(5, 0, 0, true);
		this.startGame();		
	}
	
	this.initCanvas();
	this.initGame();
}