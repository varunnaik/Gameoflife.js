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
	this.togglePaused = false; // True if simulation paused
	/* ********************* END SETTINGS INITIALISATION **********************/
	
	
	/* ********************* PRESET PATTERNS **********************************/
	this.patternLibrary = {
"1":{width: 11, height: 9, name: "1-2-3", pattern: 
{0: [2,3], 1: [0,3], 2: [0,1,3,5,6], 3: [1,3,6], 4: [1,6,8,9], 5: [2,3,4,6,8,9], 6: [5], 7: [4], 8: [4,5], }},
"2":{width: 12, height: 11, name: "1-2-3-4", pattern: 
{0: [5], 1: [4,6], 2: [3,5,7], 3: [3,7], 4: [0,1,3,5,7,9,10], 5: [0,2,8,10], 6: [3,4,5,6,7], 8: [5], 9: [4,6], 10: [5], }},
"3":{width: 8, height: 7, name: "18P2.471", pattern: 
{0: [3], 1: [1,2,3,4,5], 2: [0,6], 3: [0,1,2,3,4,6], 4: [5], 5: [2], 6: [2,3], }},
"4":{width: 8, height: 7, name: "1 beacon", pattern: 
{0: [2,3], 1: [1,3], 2: [0,3,5,6], 3: [0,1,3,6], 4: [1,3], 5: [1,4], 6: [2,3], }},
"5":{width: 9, height: 11, name: "20P2", pattern: 
{0: [1,2], 1: [1], 2: [4], 3: [3,4], 5: [1,2,3,4], 6: [0,5], 7: [0,1,4,6], 8: [4,7], 9: [5,7], 10: [6], }},
"6":{width: 8, height: 7, name: "21P2", pattern: 
{0: [3], 1: [1,2,3], 2: [0,6], 3: [0,2,3,4,5,6], 4: [1], 5: [4], 6: [3,4], }},
"7":{width: 8, height: 8, name: "22P2", pattern: 
{0: [2,3], 1: [1,4], 2: [1,3], 3: [0,1,3,6], 4: [3,5,6], 5: [0,1,3], 6: [0,3], 7: [1,2], }},
"8":{width: 6, height: 8, name: "23334M", pattern: 
{0: [2], 1: [0,1], 2: [1], 3: [0,3], 4: [4], 5: [1,4], 6: [2,4], 7: [1], }},
"9":{width: 8, height: 8, name: "23P2", pattern: 
{0: [5,6], 1: [0,3,6], 2: [0,1,2,3,4,5], 4: [2,3], 5: [3], 6: [0], 7: [0,1], }},
"10":{width: 14, height: 9, name: "24P10", pattern: 
{0: [7,8], 1: [7,10], 2: [3,8,12], 3: [4,5,9,11,12], 5: [0,1,3,7,8], 6: [0,4,9], 7: [2,5], 8: [4,5], }},
"11":{width: 9, height: 7, name: "24P2", pattern: 
{0: [4], 1: [0,1,4,5,6], 2: [0,7], 3: [1,2,3,4,5,7], 4: [6], 5: [3], 6: [3,4], }},
"12":{width: 9, height: 7, name: "26P2", pattern: 
{0: [1,2,4,5], 1: [0,2,4,6], 2: [0,7], 3: [1,2,3,4,5,7], 4: [6], 5: [3], 6: [3,4], }},
"13":{width: 13, height: 11, name: "28P7.2", pattern: 
{0: [1,2], 1: [2], 2: [1], 3: [1,2,10,11], 4: [3,8,11], 5: [1,2,5,6,9,10], 6: [0,3,8], 7: [0,1,9,10], 8: [10], 9: [9], 10: [9,10], }},
"14":{width: 14, height: 9, name: "28P7.1", pattern: 
{0: [2,3], 1: [2], 2: [7], 3: [0,1,2,3,4,5,7], 4: [0], 5: [1,2,4,5,9,10], 6: [2,4,9,11], 7: [2,4,11], 8: [3,11,12], }},
"15":{width: 11, height: 10, name: "29P9", pattern: 
{0: [1,2], 1: [2], 2: [2,4,5], 3: [1,2,4,6], 4: [7], 5: [5,6,7], 6: [0,1,8,9], 7: [0,3,5,6,8], 8: [2,3,5,8], 9: [6,7], }},
"16":{width: 14, height: 11, name: "30P5H2V0", pattern: 
{0: [4], 1: [3,4,5], 2: [2,3,5,6], 4: [1,3,5,7,10], 5: [0,1,5,9,10,11], 6: [0,1,5,12], 7: [10,12], 8: [8,10], 9: [9,12], 10: [12], }},
"17":{width: 14, height: 10, name: "37P10.1", pattern: 
{0: [2,3,9,10], 1: [2,4,8,10], 2: [3,9], 3: [0,6,12], 4: [0,1,2,3,4,8,9,10,11,12], 5: [5,7], 6: [2,3,9,10], 7: [2,10], 8: [3,9], 9: [2,3,9,10], }},
"18":{width: 13, height: 10, name: "37P7.1", pattern: 
{0: [4,5], 1: [0,1,5], 2: [1,5,7], 3: [1,3,4,6,8,10,11], 4: [2,4,6,8,9,11], 5: [4], 6: [2,8,9,10], 7: [0,10], 8: [0,4,5,6,7,9], 9: [1,7,8], }},
"19":{width: 13, height: 12, name: "38P11.1", pattern: 
{0: [2,3,5,6], 1: [3,5,7], 2: [3,8], 3: [0,1,3,9], 4: [0,1,3,10], 5: [3,5,11], 6: [3,5,6,10,11], 7: [4], 8: [5,6,7,8,9,10,11], 9: [11], 10: [7,8], 11: [7,8], }},
"20":{width: 14, height: 11, name: "38P7.2", pattern: 
{0: [4,8], 1: [0,3,5,7,9,12], 2: [0,2,5,7,10,12], 3: [1,4,5,7,8,11], 4: [5,7], 5: [2,3,9,10], 6: [2,10], 7: [4,8], 9: [1,4,8,11], 10: [2,3,9,10], }},
"21":{width: 14, height: 14, name: "41P7.2", pattern: 
{0: [9,10], 1: [9], 2: [10], 3: [9,10], 4: [8], 5: [9,10], 6: [8,11], 7: [3,5,6,7,8,9,12], 8: [1,2,3,5,10,11], 9: [0,5,7,9], 10: [1,2,3,4,9], 11: [5,6,7,8], 12: [3,6], 13: [3,4], }},
"22":{width: 14, height: 13, name: "42P10.1", pattern: 
{0: [5,6], 1: [4,7], 2: [3,6], 3: [2,4,5,7,8,9], 4: [2,5,10,12], 5: [3,7,9,11,12], 6: [0,1,2,9], 7: [0,3,4,5,6,7,9], 8: [3,8], 9: [4,5,6,7], 11: [6,7], 12: [6,7], }},
"23":{width: 13, height: 9, name: "4-8-12_diamond", pattern: 
{0: [4,5,6,7], 2: [2,3,4,5,6,7,8,9], 4: [0,1,2,3,4,5,6,7,8,9,10,11], 6: [2,3,4,5,6,7,8,9], 8: [4,5,6,7], }},
"24":{width: 9, height: 8, name: "4 boats", pattern: 
{0: [3], 1: [2,4], 2: [1,3,4], 3: [0,2,5,6], 4: [1,2,5,7], 5: [3,4,6], 6: [3,5], 7: [4], }},
"25":{width: 7, height: 4, name: "7468M", pattern: 
{0: [4], 1: [4,5], 2: [0,1,3,4], 3: [0], }},
"26":{width: 14, height: 13, name: "Achim's p16", pattern: 
{0: [7,8], 1: [7,9], 2: [2,7,9,10], 3: [1,2,8], 4: [0,3], 5: [0,1,2], 7: [10,11,12], 8: [9,12], 9: [4,10,11], 10: [2,3,5,10], 11: [3,5], 12: [4,5], }},
"27":{width: 12, height: 9, name: "Achim's p4", pattern: 
{0: [2,3,7,8], 1: [1,4,6,9], 2: [1,3,4,6,7,9], 3: [0,1,9,10], 4: [2,4,6,8], 5: [0,1,9,10], 6: [1,3,4,6,7,9], 7: [1,4,6,9], 8: [2,3,7,8], }},
"28":{width: 10, height: 9, name: "Achim's p8", pattern: 
{0: [1,2], 1: [0], 2: [1,5], 3: [1,5,6], 4: [3,5], 5: [2,3,7], 6: [3,7], 7: [8], 8: [6,7], }},
"29":{width: 8, height: 3, name: "Acorn", pattern: 
{0: [1], 1: [3], 2: [0,1,4,5,6], }},
"30":{width: 11, height: 10, name: "A for all", pattern: 
{0: [4,5], 1: [3,6], 2: [3,4,5,6], 3: [1,3,6,8], 4: [0,9], 5: [0,9], 6: [1,3,6,8], 7: [3,4,5,6], 8: [3,6], 9: [4,5], }},
"31":{width: 5, height: 3, name: "Aircraft carrier", pattern: 
{0: [0,1], 1: [0,3], 2: [2,3], }},
"32":{width: 15, height: 15, name: "Airforce", pattern: 
{0: [7], 1: [6,8], 2: [7], 4: [5,6,7,8,9], 5: [4,10,12,13], 6: [3,5,6,10,12,13], 7: [3,5,8,10], 8: [0,1,3,7,8,10], 9: [0,1,3,9], 10: [4,5,6,7,8], 12: [6], 13: [5,7], 14: [6], }},
"33":{width: 11, height: 12, name: "AK47 reaction", pattern: 
{0: [5], 1: [4,6], 2: [3,7], 3: [3,7], 4: [3,7], 5: [4,6], 6: [5], 8: [2,3], 9: [3], 10: [0,1,2,8,9], 11: [0,8,9], }},
"34":{width: 10, height: 8, name: "Almosymmetric", pattern: 
{0: [4], 1: [0,1,4,6], 2: [0,2], 3: [7,8], 4: [1], 5: [0,7], 6: [0,1,3,5], 7: [5], }},
"35":{width: 8, height: 4, name: "Anvil", pattern: 
{0: [1,2,3,4], 1: [0,5], 2: [1,2,3,5], 3: [3,5,6], }},
"36":{width: 14, height: 11, name: "aVerage", pattern: 
{0: [3,4], 1: [4,5,6], 2: [2,7], 3: [1,3,4,5,6,8], 4: [1,3,8,11], 5: [0,1,3,4,5,8,10,12], 6: [1,3,8,11], 7: [1,3,4,5,6,8], 8: [2,7], 9: [4,5,6], 10: [3,4], }},
"37":{width: 11, height: 10, name: "Bakery", pattern: 
{0: [4,5], 1: [3,6], 2: [3,5], 3: [1,2,4,8], 4: [0,3,7,9], 5: [0,2,6,9], 6: [1,5,7,8], 7: [4,6], 8: [3,6], 9: [4,5], }},
"38":{width: 5, height: 4, name: "Barge", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [2], }},
"39":{width: 5, height: 4, name: "Beacon", pattern: 
{0: [0,1], 1: [0], 2: [3], 3: [2,3], }},
"40":{width: 8, height: 7, name: "Beacon and two tails", pattern: 
{0: [0,1], 1: [0], 2: [3,5,6], 3: [2,3,5], 4: [5], 5: [2,3,4], 6: [2], }},
"41":{width: 13, height: 14, name: "Beacon on 38P11.1", pattern: 
{0: [1,2], 1: [1], 2: [4], 3: [3,4], 4: [0], 5: [0,1,2,3,4,5,6], 6: [7], 7: [0,1,5,6,8], 8: [0,6,8], 9: [1,8,10,11], 10: [2,8,10,11], 11: [3,8], 12: [4,6,8], 13: [5,6,8,9], }},
"42":{width: 7, height: 6, name: "Bee hat", pattern: 
{0: [1,2], 1: [0,3], 2: [1,2,4], 3: [2,4], 4: [0,2,4,5], 5: [0,1], }},
"43":{width: 5, height: 3, name: "Beehive", pattern: 
{0: [1,2], 1: [0,3], 2: [1,2], }},
"44":{width: 6, height: 7, name: "Beehive and cap", pattern: 
{0: [1,2], 1: [0,3], 2: [0,1,2,3], 4: [2,3], 5: [1,4], 6: [2,3], }},
"45":{width: 7, height: 7, name: "Beehive and dock", pattern: 
{0: [3,4], 1: [2,5], 2: [3,4], 4: [1,2,3,4], 5: [0,5], 6: [0,1,4,5], }},
"46":{width: 12, height: 5, name: "Beehive and long hook eating tub", pattern: 
{0: [5,9], 1: [1,3,4,6,8,10], 2: [0,2,6,8,10], 3: [1,6,9], 4: [5,6], }},
"47":{width: 6, height: 6, name: "Beehive and table", pattern: 
{0: [2,3], 1: [1,4], 2: [2,3], 4: [0,1,2,3], 5: [0,3], }},
"48":{width: 7, height: 6, name: "Beehive at beehive", pattern: 
{0: [4], 1: [3,5], 2: [3,5], 3: [1,2,4], 4: [0,3], 5: [1,2], }},
"49":{width: 7, height: 7, name: "Beehive at loaf", pattern: 
{0: [4], 1: [3,5], 2: [3,5], 3: [1,2,4], 4: [0,3], 5: [0,2], 6: [1], }},
"50":{width: 6, height: 6, name: "Beehive bend tail", pattern: 
{0: [1,2], 1: [0,3], 2: [1,2,4], 3: [4], 4: [1,2,3], 5: [1], }},
"51":{width: 8, height: 6, name: "Beehive with nine", pattern: 
{0: [1,2], 1: [0,3], 2: [1,2,4], 3: [4], 4: [4,6], 5: [5,6], }},
"52":{width: 7, height: 5, name: "Beehive with tail", pattern: 
{0: [1,2], 1: [0,3], 2: [1,2,4], 3: [4], 4: [4,5], }},
"53":{width: 13, height: 5, name: "Bent keys", pattern: 
{0: [1,10], 1: [0,2,9,11], 2: [1,3,4,7,8,10], 3: [4,7], 4: [4,7], }},
"54":{width: 5, height: 3, name: "B-heptomino", pattern: 
{0: [0,2,3], 1: [0,1,2], 2: [1], }},
"55":{width: 6, height: 2, name: "Bi-block", pattern: 
{0: [0,1,3,4], 1: [0,1,3,4], }},
"56":{width: 5, height: 7, name: "Bi-cap", pattern: 
{0: [1,2], 1: [0,3], 2: [0,1,2,3], 4: [0,1,2,3], 5: [0,3], 6: [1,2], }},
"57":{width: 8, height: 7, name: "Bi-clock", pattern: 
{0: [2], 1: [0,1], 2: [2,3], 3: [1,5], 4: [3,4], 5: [5,6], 6: [4], }},
"58":{width: 8, height: 6, name: "Big S", pattern: 
{0: [4,5], 1: [3,6], 2: [3,5,6], 3: [0,1,3], 4: [0,3], 5: [1,2], }},
"59":{width: 8, height: 7, name: "Bi-loaf 1", pattern: 
{0: [1], 1: [0,2], 2: [0,3], 3: [1,2,4], 4: [3,5], 5: [3,6], 6: [4,5], }},
"60":{width: 8, height: 7, name: "Bi-loaf 2", pattern: 
{0: [2], 1: [1,3], 2: [0,3], 3: [1,2,4,5], 4: [3,6], 5: [3,5], 6: [4], }},
"61":{width: 5, height: 7, name: "Bi-loaf 3", pattern: 
{0: [2], 1: [1,3], 2: [0,3], 3: [1,2], 4: [0,3], 5: [0,2], 6: [1], }},
"62":{width: 6, height: 5, name: "Bipole", pattern: 
{0: [0,1], 1: [0,2], 3: [2,4], 4: [3,4], }},
"63":{width: 8, height: 7, name: "Bi-pond", pattern: 
{0: [1,2], 1: [0,3], 2: [0,3], 3: [1,2,4,5], 4: [3,6], 5: [3,6], 6: [4,5], }},
"64":{width: 13, height: 12, name: "Biting off more than they can chew", pattern: 
{0: [0], 1: [0,1,2], 2: [3], 3: [2,3], 4: [3,4], 5: [4,5], 6: [3,6], 7: [3,6,7], 8: [4,5,7,8,9], 9: [8,10], 10: [10], 11: [10,11], }},
"65":{width: 4, height: 1, name: "Blinker", pattern: 
{0: [0,1,2], }},
"66":{width: 8, height: 6, name: "Blinkers bit pole", pattern: 
{0: [5,6], 1: [0,1,2,4,6], 3: [1,3,6], 4: [0,5], 5: [0,1,5], }},
"67":{width: 3, height: 2, name: "Block", pattern: 
{0: [0,1], 1: [0,1], }},
"68":{width: 5, height: 6, name: "Block and cap", pattern: 
{0: [1,2], 1: [0,3], 2: [0,1,2,3], 4: [0,1], 5: [0,1], }},
"69":{width: 7, height: 6, name: "Block and dock", pattern: 
{0: [3,4], 1: [3,4], 3: [1,2,3,4], 4: [0,5], 5: [0,1,4,5], }},
"70":{width: 5, height: 3, name: "Block and glider", pattern: 
{0: [0,1], 1: [0,2], 2: [2,3], }},
"71":{width: 6, height: 5, name: "Block and two tails", pattern: 
{0: [0,1,3,4], 1: [0,1,3], 2: [3], 3: [0,1,2], 4: [0], }},
"72":{width: 11, height: 5, name: "Blocker", pattern: 
{0: [6,8], 1: [5], 2: [0,1,4,9], 3: [0,1,3,6,8,9], 4: [4,5], }},
"73":{width: 7, height: 3, name: "Block on boat", pattern: 
{0: [0,1,3,4], 1: [0,1,3,5], 2: [4], }},
"74":{width: 5, height: 5, name: "Block on table", pattern: 
{0: [2,3], 1: [2,3], 3: [0,1,2,3], 4: [0,3], }},
"75":{width: 13, height: 5, name: "Blom", pattern: 
{0: [0,11], 1: [1,2,3,4,11], 2: [2,3,11], 3: [10], 4: [8,10], }},
"76":{width: 4, height: 3, name: "Boat", pattern: 
{0: [0,1], 1: [0,2], 2: [1], }},
"77":{width: 11, height: 10, name: "Boat on quadpole", pattern: 
{0: [1], 1: [0,2], 2: [1,2], 3: [3,4], 4: [3,5], 6: [5,7], 8: [7,9], 9: [8,9], }},
"78":{width: 9, height: 11, name: "Boat on spark coil", pattern: 
{0: [0,1,3,4], 1: [0,4], 2: [1,2,3], 5: [1,2,3], 6: [0,4], 7: [0,1,3,4], 8: [5,6], 9: [5,7], 10: [6], }},
"79":{width: 7, height: 6, name: "Boat-ship-tie", pattern: 
{0: [0,1], 1: [0,2], 2: [1,2], 3: [3,4], 4: [3,5], 5: [4], }},
"80":{width: 7, height: 6, name: "Boat-tie", pattern: 
{0: [1], 1: [0,2], 2: [1,2], 3: [3,4], 4: [3,5], 5: [4], }},
"81":{width: 7, height: 4, name: "Boat with long tail", pattern: 
{0: [0,1], 1: [0,2], 2: [1,4,5], 3: [2,3,5], }},
"82":{width: 5, height: 3, name: "Bookend", pattern: 
{0: [2,3], 1: [0,3], 2: [0,1,2], }},
"83":{width: 8, height: 4, name: "Bookends", pattern: 
{0: [0,1,5,6], 1: [0,2,4,6], 2: [2,4], 3: [1,2,4,5], }},
"84":{width: 12, height: 14, name: "Boss", pattern: 
{0: [5], 1: [4,6], 2: [4,6], 3: [3,4,6,7], 4: [2,8], 5: [1,3,5,7,9], 6: [1,3,7,9], 7: [0,1,3,7,9,10], 8: [0,3,5,7,10], 9: [2,8], 10: [3,4,6,7], 11: [4,6], 12: [4,6], 13: [5], }},
"85":{width: 4, height: 3, name: "Bullet heptomino", pattern: 
{0: [1], 1: [0,1,2], 2: [0,1,2], }},
"86":{width: 5, height: 3, name: "Bun", pattern: 
{0: [1,2], 1: [0,3], 2: [1,2,3], }},
"87":{width: 9, height: 4, name: "Bunnies", pattern: 
{0: [0,6], 1: [2,6], 2: [2,5,7], 3: [1,3], }},
"88":{width: 7, height: 6, name: "Bunnies 10", pattern: 
{0: [1], 1: [0,1,3], 2: [4,5], 3: [0,3], 4: [0], 5: [0], }},
"89":{width: 7, height: 4, name: "Bunnies 11", pattern: 
{0: [0,2,3,4], 1: [0,5], 2: [0,2,4], 3: [1,4], }},
"90":{width: 9, height: 7, name: "Bunnies 9", pattern: 
{0: [1], 1: [0,1,7], 2: [6], 3: [6], 4: [5], 5: [4], 6: [4], }},
"91":{width: 11, height: 11, name: "Burloaferimeter", pattern: 
{0: [4,5], 1: [5], 2: [4], 3: [3,5,6,7], 4: [3,5,8], 5: [0,1,3,7,9], 6: [0,1,3,8], 7: [4,5,6,7], 9: [4,5], 10: [4,5], }},
"92":{width: 5, height: 4, name: "Butterfly", pattern: 
{0: [0], 1: [0,1], 2: [0,2], 3: [1,2,3], }},
"93":{width: 7, height: 7, name: "By flops", pattern: 
{0: [3], 1: [1,3], 2: [5], 3: [0,1,2,3,4], 4: [5], 5: [1,3], 6: [3], }},
"94":{width: 14, height: 12, name: "Canada goose", pattern: 
{0: [0,1,2], 1: [0,10,11], 2: [1,8,9,10,12], 3: [3,4,7,8], 4: [4], 5: [8], 6: [4,5,9], 7: [3,5,7,8], 8: [3,5,8,10,11], 9: [2,7,8], 10: [2,3], 11: [2,3], }},
"95":{width: 11, height: 5, name: "Candlefrobra", pattern: 
{0: [5], 1: [1,3,4,6,8,9], 2: [0,2,6,8,9], 3: [1,6], 4: [5,6], }},
"96":{width: 6, height: 5, name: "Canoe", pattern: 
{0: [3,4], 1: [4], 2: [3], 3: [0,2], 4: [0,1], }},
"97":{width: 5, height: 3, name: "Cap", pattern: 
{0: [1,2], 1: [0,3], 2: [0,1,2,3], }},
"98":{width: 8, height: 4, name: "Carrier siamese carrier", pattern: 
{0: [0,1], 1: [0,3,4], 2: [2,3,6], 3: [5,6], }},
"99":{width: 8, height: 3, name: "Carrier siamese snake", pattern: 
{0: [0,1,3,4], 1: [0,2,3,6], 2: [5,6], }},
"100":{width: 9, height: 6, name: "Caterer", pattern: 
{0: [2], 1: [0,4,5,6,7], 2: [0,4], 3: [0], 4: [3], 5: [1,2], }},
"101":{width: 12, height: 13, name: "Cauldron", pattern: 
{0: [5], 1: [4,6], 2: [5], 4: [3,4,5,6,7], 5: [0,2,8,10], 6: [0,1,3,7,9,10], 7: [3,7], 8: [3,7], 9: [4,5,6], 11: [4,5,7], 12: [4,6,7], }},
"102":{width: 5, height: 3, name: "Century", pattern: 
{0: [2,3], 1: [0,1,2], 2: [1], }},
"103":{width: 5, height: 3, name: "C-heptomino", pattern: 
{0: [1,2,3], 1: [0,1,2], 2: [1], }},
"104":{width: 7, height: 6, name: "Cheshire cat", pattern: 
{0: [1,4], 1: [1,2,3,4], 2: [0,5], 3: [0,2,3,5], 4: [0,5], 5: [1,2,3,4], }},
"105":{width: 7, height: 5, name: "Cis-barge with tail", pattern: 
{0: [3], 1: [2,4], 2: [1,3,5], 3: [1,4], 4: [0,1], }},
"106":{width: 8, height: 9, name: "Cis-beacon and anvil", pattern: 
{0: [3,4], 1: [4], 2: [1], 3: [1,2], 5: [1,2,3,4], 6: [0,5], 7: [1,2,3,5], 8: [3,5,6], }},
"107":{width: 5, height: 8, name: "Cis-beacon and cap", pattern: 
{0: [2,3], 1: [3], 2: [0], 3: [0,1], 5: [0,1,2,3], 6: [0,3], 7: [1,2], }},
"108":{width: 7, height: 8, name: "Cis-beacon and dock", pattern: 
{0: [3,4], 1: [4], 2: [1], 3: [1,2], 5: [1,2,3,4], 6: [0,5], 7: [0,1,4,5], }},
"109":{width: 5, height: 7, name: "Cis-beacon and table", pattern: 
{0: [2,3], 1: [3], 2: [0], 3: [0,1], 5: [0,1,2,3], 6: [0,3], }},
"110":{width: 6, height: 8, name: "Cis-beacon up and long hook", pattern: 
{0: [2,3], 1: [3], 2: [0], 3: [0,1], 5: [0,1,2,3], 6: [0,4], 7: [3,4], }},
"111":{width: 6, height: 6, name: "Cis-block and long hook", pattern: 
{0: [3,4], 1: [0,4], 2: [0,1,2,3], 4: [2,3], 5: [2,3], }},
"112":{width: 7, height: 7, name: "Cis-boat and dock", pattern: 
{0: [2], 1: [1,3], 2: [1,2], 4: [1,2,3,4], 5: [0,5], 6: [0,1,4,5], }},
"113":{width: 12, height: 5, name: "Cis-boat and long hook eating tub", pattern: 
{0: [5], 1: [1,3,4,6,8,9], 2: [0,2,6,8,10], 3: [1,6,9], 4: [5,6], }},
"114":{width: 5, height: 6, name: "Cis-boat and table", pattern: 
{0: [1], 1: [0,2], 2: [0,1], 4: [0,1,2,3], 5: [0,3], }},
"115":{width: 6, height: 5, name: "Cis-boat with tail", pattern: 
{0: [3,4], 1: [3], 2: [0,1,3], 3: [0,2], 4: [1], }},
"116":{width: 7, height: 6, name: "Cis-fuse with two tails", pattern: 
{0: [3], 1: [1,2,3], 2: [0,4,5], 3: [1,4], 4: [2,4], 5: [3], }},
"117":{width: 5, height: 7, name: "Cis-hook and R-bee", pattern: 
{0: [2,3], 1: [0,3], 2: [0,1,2], 4: [0,1,2], 5: [0,3], 6: [1,2], }},
"118":{width: 6, height: 6, name: "Cis-hook with tail", pattern: 
{0: [3,4], 1: [2,4], 2: [1], 3: [0], 4: [1,2,3], 5: [3], }},
"119":{width: 7, height: 5, name: "Cis-loaf with tail", pattern: 
{0: [3,4], 1: [2,5], 2: [1,3,5], 3: [1,4], 4: [0,1], }},
"120":{width: 8, height: 4, name: "Cis-mirrored R-bee", pattern: 
{0: [1,2,4,5], 1: [0,2,4,6], 2: [0,2,4,6], 3: [1,5], }},
"121":{width: 5, height: 8, name: "Cis-R-bee and R-loaf", pattern: 
{0: [1,2], 1: [0,3], 2: [1,2,3], 4: [1,2,3], 5: [0,3], 6: [0,2], 7: [1], }},
"122":{width: 8, height: 5, name: "Cis-rotated R-bee", pattern: 
{0: [4,5], 1: [1,4,6], 2: [0,2,4,6], 3: [0,2,5], 4: [1,2], }},
"123":{width: 7, height: 5, name: "Cis-shillelagh", pattern: 
{0: [4,5], 1: [5], 2: [0,1,4], 3: [0,3], 4: [1,2], }},
"124":{width: 7, height: 5, name: "Claw with tail", pattern: 
{0: [0,1], 1: [1], 2: [1,3,4], 3: [2,5], 4: [4,5], }},
"125":{width: 5, height: 4, name: "Clock", pattern: 
{0: [2], 1: [0,2], 2: [1,3], 3: [1], }},
"126":{width: 13, height: 12, name: "Clock 2", pattern: 
{0: [6,7], 1: [6,7], 3: [4,5,6,7], 4: [0,1,3,8], 5: [0,1,3,6,8], 6: [3,6,8,10,11], 7: [3,5,8,10,11], 8: [4,5,6,7], 10: [4,5], 11: [4,5], }},
"127":{width: 11, height: 9, name: "Coe ship", pattern: 
{0: [4,5,6,7,8,9], 1: [2,3,9], 2: [0,1,3,9], 3: [4,8], 4: [6], 5: [6,7], 6: [5,6,7,8], 7: [5,6,8,9], 8: [7,8], }},
"128":{width: 13, height: 6, name: "Coe's p8", pattern: 
{0: [0,1], 1: [0,1,4,5], 2: [5,6], 3: [4,7], 4: [7,10,11], 5: [5,7,10,11], }},
"129":{width: 12, height: 5, name: "Conduit 1", pattern: 
{0: [0,2,3], 1: [0,1,3], 3: [9,10], 4: [9,10], }},
"130":{width: 12, height: 11, name: "Confused eaters", pattern: 
{0: [0], 1: [0,1,2], 2: [3], 3: [2], 4: [2,5], 5: [5], 6: [3,5], 7: [3,4,7,8], 8: [7,9], 9: [9], 10: [9,10], }},
"131":{width: 14, height: 7, name: "Cousins", pattern: 
{0: [5,7,8], 1: [3,4,5,7,9], 2: [0,2,9], 3: [0,1,3,4,6,7,9,11,12], 4: [3,5,10,12], 5: [3,5,7,8,9], 6: [4,5,7], }},
"132":{width: 6, height: 5, name: "Cover", pattern: 
{0: [4], 1: [2,3,4], 2: [1], 3: [1], 4: [0,1], }},
"133":{width: 14, height: 12, name: "Crab", pattern: 
{0: [8,9], 1: [7,8], 2: [9], 3: [11,12], 4: [10], 6: [9,12], 7: [1,2,8,9], 8: [0,1,7], 9: [2,7,9], 10: [4,5,8], 11: [4,5], }},
"134":{width: 9, height: 8, name: "Cross", pattern: 
{0: [2,3,4,5], 1: [2,5], 2: [0,1,2,5,6,7], 3: [0,7], 4: [0,7], 5: [0,1,2,5,6,7], 6: [2,5], 7: [2,3,4,5], }},
"135":{width: 15, height: 14, name: "Crowd", pattern: 
{0: [11], 1: [9,10,11], 2: [5,6,8], 3: [5,9], 4: [7,8,10], 5: [3,4,5,6,10], 6: [0,2,8,10,12,13], 7: [0,1,3,5,11,13], 8: [3,7,8,9,10], 9: [3,5,6], 10: [4,8], 11: [5,7,8], 12: [2,3,4], 13: [2], }},
"136":{width: 10, height: 8, name: "Cuphook", pattern: 
{0: [4,5], 1: [0,1,3,5], 2: [0,1,3], 3: [3], 4: [3,6], 5: [4,5,7], 6: [7], 7: [7,8], }},
"137":{width: 8, height: 5, name: "Dead spark coil", pattern: 
{0: [0,1,5,6], 1: [0,2,4,6], 2: [2,4], 3: [0,2,4,6], 4: [0,1,5,6], }},
"138":{width: 14, height: 13, name: "Diamond ring", pattern: 
{0: [6], 1: [5,7], 2: [4,6,8], 3: [4,8], 4: [2,3,6,9,10], 5: [1,6,11], 6: [0,2,4,5,7,8,10,12], 7: [1,6,11], 8: [2,3,6,9,10], 9: [4,8], 10: [4,6,8], 11: [5,7], 12: [6], }},
"139":{width: 9, height: 3, name: "Die hard", pattern: 
{0: [6], 1: [0,1], 2: [1,5,6,7], }},
"140":{width: 14, height: 13, name: "Dinner table", pattern: 
{0: [1], 1: [1,2,3,11,12], 2: [4,11], 3: [3,4,9,11], 4: [9,10], 5: [6], 6: [4,5,7], 8: [2,6,9], 9: [1,3,4,9], 10: [1,8], 11: [0,1,9,10,11], 12: [11], }},
"141":{width: 7, height: 3, name: "Dock", pattern: 
{0: [1,2,3,4], 1: [0,5], 2: [0,1,4,5], }},
"142":{width: 5, height: 4, name: "Eater 1", pattern: 
{0: [0,1], 1: [0,2], 2: [2], 3: [2,3], }},
"143":{width: 8, height: 7, name: "Eater 2", pattern: 
{0: [3,5,6], 1: [1,2,3,5,6], 2: [0], 3: [1,2,3,5,6], 4: [3,5], 5: [3,5], 6: [4], }},
"144":{width: 13, height: 12, name: "Eater 3", pattern: 
{0: [9,10], 1: [4,5,8,11], 2: [1,4,9,11], 3: [0,2,4,10], 4: [1,4,6,7], 5: [4,7], 6: [5,10], 7: [6,7,8,9,10], 9: [8], 10: [7,9], 11: [8], }},
"145":{width: 15, height: 14, name: "Eater 4", pattern: 
{0: [3,4], 1: [3], 2: [0,1,3], 3: [0,3,4], 4: [1,2,7], 5: [3,4,5,6,7], 6: [3,8,9], 7: [4,5,8], 8: [6,8], 9: [6,8,10,13], 10: [7,8,10,11,12,13], 11: [9], 12: [9,11], 13: [10,11], }},
"146":{width: 10, height: 6, name: "Eater 5", pattern: 
{0: [7,8], 1: [3,7,8], 2: [2,4], 3: [1,3], 4: [1], 5: [0,1], }},
"147":{width: 11, height: 10, name: "Eater/block frob", pattern: 
{0: [1,2], 1: [2], 2: [2,4], 3: [3,5], 4: [5,6,8,9], 5: [8,9], 6: [2,3], 7: [3], 8: [0,1,2], 9: [0], }},
"148":{width: 6, height: 7, name: "Eater on boat", pattern: 
{0: [1,2], 1: [1,3], 2: [3], 3: [3,4], 4: [1,2], 5: [0,2], 6: [1], }},
"149":{width: 9, height: 8, name: "Eater plug", pattern: 
{0: [7], 1: [5,6,7], 2: [4], 3: [5], 4: [2,5], 5: [1,3,4], 6: [1], 7: [0,1], }},
"150":{width: 5, height: 7, name: "Eater siamese eater", pattern: 
{0: [0,1], 1: [0,2], 2: [2], 3: [2,3], 4: [3], 5: [0,1,2], 6: [0], }},
"151":{width: 7, height: 6, name: "Elevener", pattern: 
{0: [4,5], 1: [3,5], 2: [3], 3: [1,2,3], 4: [0], 5: [0,1], }},
"152":{width: 6, height: 5, name: "Eleven loop", pattern: 
{0: [1], 1: [0,2], 2: [0,3], 3: [1,3], 4: [0,1,3,4], }},
"153":{width: 10, height: 8, name: "Elkies' p5", pattern: 
{0: [1], 1: [0,3,4,5], 2: [2], 3: [3,5,8], 4: [2,3,5,6,7,8], 5: [4], 6: [4,6], 7: [5,6], }},
"154":{width: 12, height: 11, name: "En retard", pattern: 
{0: [5], 1: [4,6], 2: [0,1,3,5,7,9,10], 3: [1,3,7,9], 4: [0,3,5,7,10], 5: [1,2,8,9], 6: [3,4,6,7], 7: [3,5,7], 8: [4,6], 9: [2,4,6,8], 10: [2,3,7,8], }},
"155":{width: 9, height: 6, name: "Extra extra long snake", pattern: 
{0: [0,1], 1: [0,2], 2: [3], 3: [4], 4: [5,7], 5: [6,7], }},
"156":{width: 8, height: 5, name: "Extra long snake", pattern: 
{0: [0,1], 1: [0,2], 2: [3], 3: [4,6], 4: [5,6], }},
"157":{width: 13, height: 10, name: "Extremely impressive", pattern: 
{0: [4,5], 1: [3,5,6,7], 2: [3,8], 3: [0,1,3,7,8], 4: [0,1,3,9,10], 5: [4,5,6,7,8,11], 6: [10,11], 7: [6], 8: [5,7], 9: [6], }},
"158":{width: 7, height: 6, name: "Figure eight", pattern: 
{0: [0,1], 1: [0,1,3], 2: [4], 3: [1], 4: [2,4,5], 5: [4,5], }},
"159":{width: 15, height: 10, name: "Figure eight on pentadecathlon", pattern: 
{0: [1,8,9], 1: [1,8,9,11], 2: [0,2,12], 3: [1,9], 4: [1,10,12,13], 5: [1,12,13], 6: [1], 7: [0,2], 8: [1], 9: [1], }},
"160":{width: 11, height: 10, name: "Fleet", pattern: 
{0: [4,5], 1: [3,5], 2: [3,4], 3: [1,2], 4: [0,2,8,9], 5: [0,1,7,9], 6: [7,8], 7: [5,6], 8: [4,6], 9: [4,5], }},
"161":{width: 8, height: 7, name: "Fore and back", pattern: 
{0: [0,1,3,4], 1: [0,1,3,5], 2: [6], 3: [0,1,2,4,5,6], 4: [0], 5: [1,3,5,6], 6: [2,3,5,6], }},
"162":{width: 8, height: 5, name: "Fourteener", pattern: 
{0: [4,5], 1: [0,1,4,6], 2: [0,6], 3: [1,2,3,4,5], 4: [3], }},
"163":{width: 8, height: 7, name: "Fox", pattern: 
{0: [4], 1: [4], 2: [2,5], 3: [0,1], 4: [4,6], 5: [2,4,6], 6: [6], }},
"164":{width: 11, height: 9, name: "French kiss", pattern: 
{0: [0], 1: [0,1,2], 2: [3], 3: [2,5,6], 4: [2,7], 5: [3,4,7], 6: [6], 7: [7,8,9], 8: [9], }},
"165":{width: 12, height: 13, name: "Frog II", pattern: 
{0: [2,3,7,8], 1: [2,4,6,8], 2: [4,6], 3: [3,5,7], 4: [3,4,6,7], 5: [1,2,8,9], 6: [0,3,5,7,10], 7: [1,3,7,9], 8: [0,1,3,7,9,10], 9: [4,5,6], 11: [3,5,6], 12: [3,4,6], }},
"166":{width: 9, height: 7, name: "Fumarole", pattern: 
{0: [3,4], 1: [1,6], 2: [1,6], 3: [1,6], 4: [2,5], 5: [0,2,5,7], 6: [0,1,6,7], }},
"167":{width: 15, height: 14, name: "Garden of Eden 2", pattern: 
{0: [0,1,3,5,7,9,10,12], 1: [0,2,3,4,6,7,8,10,11,13], 2: [0,1,2,3,5,6,7,9,10,12], 3: [0,1,2,4,6,8,10,11,12,13], 4: [1,2,3,5,7,8,9,11,12], 5: [0,1,2,3,4,5,6,8,9,10,11,13], 6: [1,3,5,6,7,8,9,10,11,12], 7: [0,2,3,4,6,7,9,11,13], 8: [0,1,2,3,4,5,7,8,9,10,11,12], 9: [0,2,3,5,6,7,8,9,11,13], 10: [0,1,2,4,5,6,7,8,9,10,11,12], 11: [1,2,3,5,7,9,11,12,13], 12: [0,1,2,4,6,8,10,11,13], 13: [0,2,3,4,5,6,7,8,9,10,11,12,13], }},
"168":{width: 14, height: 12, name: "Garden of Eden 3", pattern: 
{0: [2,4,5,6], 1: [0,1,3,5,6,7,8,9,11], 2: [0,2,4,5,7,9], 3: [1,2,3,4,6,8,9,10], 4: [0,2,4,5,7,8,9,11], 5: [1,2,3,5,6,8,10], 6: [2,6,7,8,11,12], 7: [1,3,4,6,8,10,11], 8: [0,1,2,4,5,6,7,9,11], 9: [1,3,4,5,6,10], 10: [1,3,5,6,9], 11: [1,2,4,7,8,11], }},
"169":{width: 13, height: 11, name: "Garden of Eden 4", pattern: 
{0: [1,3,4,6,7,10], 1: [2,4,5,6,8,9,10], 2: [2,3,5,6,7,9,11], 3: [1,3,4,5,7,8,9,11], 4: [0,1,2,3,4,7,8,9,10], 5: [1,2,4,5,6,8,11], 6: [1,2,3,5,7,10], 7: [1,2,4,5,6,9,10], 8: [0,2,3,4,6,7,8,10], 9: [0,3,4,7,9,11], 10: [10], }},
"170":{width: 12, height: 11, name: "Garden of Eden 5", pattern: 
{0: [1,2,3,6,7], 1: [1,2,4,6,8,9,10], 2: [1,2,3,6,7,8,9,10], 3: [0,2,4,6,8,10], 4: [0,1,2,3,5,7,9], 5: [4,5,6], 6: [1,3,5,7,8,9,10], 7: [0,2,4,6,8,10], 8: [0,1,2,3,4,7,8,9], 9: [0,1,2,4,6,8,9], 10: [3,4,7,8,9], }},
"171":{width: 11, height: 10, name: "Germ", pattern: 
{0: [4,5], 1: [5], 2: [3], 3: [2,4,5,6,7], 4: [2,7], 5: [1,2,4], 6: [2,4,6,7,8,9], 7: [0,2,4,9], 8: [0,1,5,6,7], 9: [7,8], }},
"172":{width: 4, height: 3, name: "Glider", pattern: 
{0: [1], 1: [2], 2: [0,1,2], }},
"173":{width: 6, height: 3, name: "Gliders by the dozen", pattern: 
{0: [0,1,4], 1: [0,4], 2: [0,3,4], }},
"174":{width: 14, height: 9, name: "Gray counter", pattern: 
{0: [6], 1: [5,7], 2: [4,6,8], 3: [1,4,8,11], 4: [0,2,4,8,10,12], 5: [1,4,8,11], 6: [4,6,8], 7: [5,7], 8: [6], }},
"175":{width: 9, height: 8, name: "Great on-off", pattern: 
{0: [2,3], 1: [1,4], 2: [1,3], 3: [0,1,3,6], 4: [4,5,7], 5: [7], 6: [4,5,6], 7: [4], }},
"176":{width: 7, height: 8, name: "Griddle and beehive", pattern: 
{0: [3], 1: [1,3], 2: [0,5], 3: [0,1,2,3,4,5], 5: [2,3], 6: [1,4], 7: [2,3], }},
"177":{width: 7, height: 7, name: "Griddle and block", pattern: 
{0: [3], 1: [1,3], 2: [0,5], 3: [0,1,2,3,4,5], 5: [2,3], 6: [2,3], }},
"178":{width: 7, height: 8, name: "Griddle and boat", pattern: 
{0: [3], 1: [1,3], 2: [0,5], 3: [0,1,2,3,4,5], 5: [2,3], 6: [1,3], 7: [2], }},
"179":{width: 5, height: 2, name: "Grin", pattern: 
{0: [0,3], 1: [1,2], }},
"180":{width: 6, height: 4, name: "Hat", pattern: 
{0: [2], 1: [1,3], 2: [1,3], 3: [0,1,3,4], }},
"181":{width: 12, height: 11, name: "Heart", pattern: 
{0: [5], 1: [4,7], 2: [1,4,7], 3: [0,2,4,6,8,9], 4: [1,4,7], 5: [4,10], 6: [5,6,7,8,9], 8: [7], 9: [6,8], 10: [7], }},
"182":{width: 11, height: 10, name: "Heptapole", pattern: 
{0: [0,1], 1: [0,2], 3: [2,4], 5: [4,6], 7: [6,8], 8: [9], 9: [8,9], }},
"183":{width: 4, height: 4, name: "Herschel", pattern: 
{0: [0], 1: [0,1,2], 2: [0,2], 3: [2], }},
"184":{width: 6, height: 4, name: "Herschel grandparent", pattern: 
{0: [0,2], 1: [0], 2: [0,2], 3: [3,4], }},
"185":{width: 6, height: 4, name: "Herschel parent", pattern: 
{0: [2], 1: [0,1], 2: [2,4], 3: [4], }},
"186":{width: 12, height: 12, name: "Hertz oscillator", pattern: 
{0: [3,4,6], 1: [3,5,6], 3: [4,5,6], 4: [3,5,7,9,10], 5: [3,7,9,10], 6: [0,1,3,7], 7: [0,1,3,7], 8: [4,5,6], 10: [4,5,7], 11: [4,6,7], }},
"187":{width: 10, height: 9, name: "Hexapole", pattern: 
{0: [0,1], 1: [0,2], 3: [2,4], 5: [4,6], 7: [6,8], 8: [7,8], }},
"188":{width: 14, height: 13, name: "Hivenudger", pattern: 
{0: [0,1,2,3,9,12], 1: [0,4,8], 2: [0,8,12], 3: [1,4,8,9,10,11], 5: [5,6], 6: [5,6], 7: [5,6], 9: [1,4,8,9,10,11], 10: [0,8,12], 11: [0,4,8], 12: [0,1,2,3,9,12], }},
"189":{width: 7, height: 5, name: "Honeycomb", pattern: 
{0: [2,3], 1: [1,4], 2: [0,2,3,5], 3: [1,4], 4: [2,3], }},
"190":{width: 14, height: 13, name: "Honey farm", pattern: 
{0: [6], 1: [5,7], 2: [5,7], 3: [6], 5: [1,2,10,11], 6: [0,3,9,12], 7: [1,2,10,11], 9: [6], 10: [5,7], 11: [5,7], 12: [6], }},
"191":{width: 12, height: 10, name: "Hooks", pattern: 
{0: [6,7], 1: [0,2,3,5,7], 2: [0,1,3,5], 3: [4,5], 4: [5], 6: [7,8], 7: [7], 8: [8,9,10], 9: [10], }},
"192":{width: 6, height: 4, name: "Hook with tail", pattern: 
{0: [0,1], 1: [1], 2: [1,3,4], 3: [2,4], }},
"193":{width: 6, height: 3, name: "House", pattern: 
{0: [1,2,3], 1: [0,4], 2: [0,1,3,4], }},
"194":{width: 12, height: 12, name: "Hustler", pattern: 
{0: [5,6], 1: [5,6], 3: [3,4,5,6], 4: [0,2,7], 5: [0,1,3,7], 6: [3,7,9,10], 7: [3,8,10], 8: [4,5,6,7], 10: [4,5], 11: [4,5], }},
"195":{width: 8, height: 5, name: "HWSS", pattern: 
{0: [3,4], 1: [1,6], 2: [0], 3: [0,6], 4: [0,1,2,3,4,5], }},
"196":{width: 6, height: 5, name: "Integral sign", pattern: 
{0: [3,4], 1: [2,4], 2: [2], 3: [0,2], 4: [0,1], }},
"197":{width: 7, height: 5, name: "Integral with hook", pattern: 
{0: [0,1], 1: [0,2], 2: [2], 3: [2,4,5], 4: [3,5], }},
"198":{width: 7, height: 6, name: "Integral with tub", pattern: 
{0: [0,1], 1: [0,2], 2: [2], 3: [2,4], 4: [3,5], 5: [4], }},
"199":{width: 15, height: 7, name: "Interchange", pattern: 
{0: [2,3,4,9,10,11], 2: [0,13], 3: [0,13], 4: [0,13], 6: [2,3,4,9,10,11], }},
"200":{width: 14, height: 9, name: "Jack", pattern: 
{0: [3,9], 1: [3,4,8,9], 2: [0,3,4,8,9,12], 3: [0,1,2,5,7,10,11,12], 4: [5,7], 5: [0,1,2,5,7,10,11,12], 6: [0,3,4,8,9,12], 7: [3,4,8,9], 8: [3,9], }},
"201":{width: 7, height: 7, name: "Jam", pattern: 
{0: [3,4], 1: [2,5], 2: [0,3,5], 3: [0,4], 4: [0], 5: [3], 6: [1,2], }},
"202":{width: 11, height: 11, name: "Karel's p15", pattern: 
{0: [2,7], 1: [2,3,4,5,6,7], 2: [2,7], 6: [2,3,4,5,6,7], 7: [1,8], 8: [0,9], 9: [1,8], 10: [2,3,4,5,6,7], }},
"203":{width: 5, height: 7, name: "Killer toads", pattern: 
{0: [1,2,3], 1: [0,1,2], 5: [0,1,2], 6: [1,2,3], }},
"204":{width: 10, height: 9, name: "Kok's galaxy", pattern: 
{0: [2,5,7], 1: [0,1,3,5,6,7], 2: [1,8], 3: [0,1,7], 5: [1,7,8], 6: [0,7], 7: [1,2,3,5,7,8], 8: [1,3,6], }},
"205":{width: 11, height: 10, name: "Lake 2", pattern: 
{0: [4,5], 1: [3,6], 2: [3,6], 3: [1,2,7,8], 4: [0,9], 5: [0,9], 6: [1,2,7,8], 7: [3,6], 8: [3,6], 9: [4,5], }},
"206":{width: 13, height: 7, name: "Laputa", pattern: 
{0: [3,4,6,7], 1: [3,4,6,10,11], 2: [8,11], 3: [1,2,3,4,5,6,8,9,10], 4: [0,3,5], 5: [0,1,5,7,8], 6: [4,5,7,8], }},
"207":{width: 10, height: 15, name: "Lidka", pattern: 
{0: [1], 1: [0,2], 2: [1], 10: [8], 11: [6,8], 12: [5,6,8], 14: [4,5,6], }},
"208":{width: 8, height: 9, name: "Light bulb", pattern: 
{0: [1,2,4], 1: [1,3,4], 3: [2,3,4], 4: [1,5], 5: [1,5], 6: [2,4], 7: [0,2,4,6], 8: [0,1,5,6], }},
"209":{width: 15, height: 6, name: "Lightweight emulator", pattern: 
{0: [2,3,5,8,10,11], 1: [2,11], 2: [3,4,9,10], 3: [0,1,2,5,6,7,8,11,12,13], 4: [0,3,10,13], 5: [1,2,11,12], }},
"210":{width: 10, height: 8, name: "Loading dock", pattern: 
{0: [4], 1: [2,3,4], 2: [1,5,6], 3: [0,2,3,7], 4: [1,5,6,8], 5: [2,3,7], 6: [4,5,6], 7: [4], }},
"211":{width: 5, height: 4, name: "Loaf", pattern: 
{0: [1,2], 1: [0,3], 2: [1,3], 3: [2], }},
"212":{width: 6, height: 5, name: "Loaf siamese barge", pattern: 
{0: [2,3], 1: [1,4], 2: [0,2,4], 3: [1,3], 4: [2], }},
"213":{width: 6, height: 5, name: "Loaf siamese loaf", pattern: 
{0: [2,3], 1: [1,4], 2: [0,2,4], 3: [0,3], 4: [1,2], }},
"214":{width: 6, height: 5, name: "Long barge", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [2,4], 4: [3], }},
"215":{width: 5, height: 4, name: "Long boat", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [2,3], }},
"216":{width: 7, height: 6, name: "Long canoe", pattern: 
{0: [4,5], 1: [5], 2: [4], 3: [3], 4: [0,2], 5: [0,1], }},
"217":{width: 6, height: 3, name: "Long hook", pattern: 
{0: [3,4], 1: [0,4], 2: [0,1,2,3], }},
"218":{width: 7, height: 4, name: "Long hook with tail", pattern: 
{0: [0,1], 1: [1,4,5], 2: [1,3,5], 3: [2], }},
"219":{width: 5, height: 6, name: "Long integral", pattern: 
{0: [2,3], 1: [1,3], 2: [1], 3: [2], 4: [0,2], 5: [0,1], }},
"220":{width: 7, height: 6, name: "Long long barge", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [2,4], 4: [3,5], 5: [4], }},
"221":{width: 6, height: 5, name: "Long long boat", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [2,4], 4: [3,4], }},
"222":{width: 8, height: 7, name: "Long long canoe", pattern: 
{0: [5,6], 1: [6], 2: [5], 3: [4], 4: [3], 5: [0,2], 6: [0,1], }},
"223":{width: 8, height: 4, name: "Long long hook with tail", pattern: 
{0: [0,1,5,6], 1: [1,4,6], 2: [1,3], 3: [2], }},
"224":{width: 8, height: 4, name: "Long long shillelagh", pattern: 
{0: [5,6], 1: [0,1,4,6], 2: [0,3], 3: [1,2], }},
"225":{width: 6, height: 5, name: "Long long ship", pattern: 
{0: [0,1], 1: [0,2], 2: [1,3], 3: [2,4], 4: [3,4], }},
"226":{width: 7, height: 4, name: "Long long snake", pattern: 
{0: [0,1], 1: [0,2], 2: [3,5], 3: [4,5], }},
"227":{width: 7, height: 3, name: "Long shillelagh", pattern: 
{0: [0,1,4,5], 1: [0,3,5], 2: [1,2], }},
"228":{width: 5, height: 4, name: "Long ship", pattern: 
{0: [0,1], 1: [0,2], 2: [1,3], 3: [2,3], }},
"229":{width: 6, height: 3, name: "Long snake", pattern: 
{0: [0,1], 1: [0,2,4], 2: [3,4], }},
"230":{width: 6, height: 4, name: "Loop", pattern: 
{0: [1,2], 1: [0,3], 2: [1,3], 3: [0,1,3,4], }},
"231":{width: 6, height: 4, name: "LWSS", pattern: 
{0: [1,4], 1: [0], 2: [0,4], 3: [0,1,2,3], }},
"232":{width: 6, height: 4, name: "Mango", pattern: 
{0: [1,2], 1: [0,3], 2: [1,4], 3: [2,3], }},
"233":{width: 10, height: 11, name: "Mathematician", pattern: 
{0: [4], 1: [3,5], 2: [3,5], 3: [2,3,5,6], 4: [0,8], 5: [0,1,2,6,7,8], 7: [0,1,2,3,4,5,6,7,8], 8: [0,8], 9: [3,4,5,6], 10: [3,6,7], }},
"234":{width: 8, height: 7, name: "Mazing", pattern: 
{0: [3,4], 1: [1,3], 2: [0,6], 3: [1,5,6], 5: [3,5], 6: [4], }},
"235":{width: 11, height: 7, name: "Mickey Mouse", pattern: 
{0: [1,2,7,8], 1: [0,3,6,9], 2: [0,3,4,5,6,9], 3: [1,2,7,8], 4: [3,4,5,6], 5: [3,6], 6: [4,5], }},
"236":{width: 14, height: 11, name: "Middleweight volcano", pattern: 
{0: [4,5,6,7,8], 1: [3,9], 2: [1,2,3,9,10,11], 3: [0,12], 4: [0,2,3,4,6,8,9,10,11], 5: [1,5,6,7], 6: [3,9,10,12], 7: [2,3,5,7,9,11,12], 8: [3,5,8], 9: [3,6,7], 10: [2,3], }},
"237":{width: 12, height: 10, name: "Mini pressure cooker", pattern: 
{0: [5], 1: [4,6], 2: [4,6], 3: [3,4,6,7], 4: [0,2,8,10], 5: [0,1,3,5,7,9,10], 6: [3,7], 7: [3,5,7], 8: [4,6], 9: [5], }},
"238":{width: 7, height: 7, name: "Mirrored dock", pattern: 
{0: [0,1,4,5], 1: [0,5], 2: [1,2,3,4], 4: [1,2,3,4], 5: [0,5], 6: [0,1,4,5], }},
"239":{width: 7, height: 6, name: "Mold", pattern: 
{0: [3,4], 1: [2,5], 2: [0,3,5], 3: [4], 4: [0,2,3], 5: [1], }},
"240":{width: 7, height: 14, name: "Mold and long hook eating tub", pattern: 
{0: [1,3], 1: [0], 2: [1,4], 3: [1,3,5], 4: [2,5], 5: [3,4], 7: [1,2,3,4], 8: [0,4], 9: [1], 10: [1], 11: [2], 12: [1,3], 13: [2], }},
"241":{width: 10, height: 14, name: "Mold on fumarole", pattern: 
{0: [3,4], 1: [2,5], 2: [1,3,5], 3: [1,4], 4: [0], 5: [1,3], 7: [4,5], 8: [2,7], 9: [2,7], 10: [2,7], 11: [3,6], 12: [1,3,6,8], 13: [1,2,7,8], }},
"242":{width: 11, height: 13, name: "Mold on pentadecathlon", pattern: 
{0: [2,7], 1: [0,1,3,4,5,6,8,9], 2: [2,7], 7: [6,8], 8: [9], 9: [5,8], 10: [4,6,8], 11: [4,7], 12: [5,6], }},
"243":{width: 8, height: 5, name: "Monogram", pattern: 
{0: [0,1,5,6], 1: [1,3,5], 2: [1,2,4,5], 3: [1,3,5], 4: [0,1,5,6], }},
"244":{width: 13, height: 10, name: "Montana", pattern: 
{0: [9,10], 1: [8,11], 2: [1,9,11], 3: [0,4,6,7,9,10], 4: [1,3,5,7,8], 5: [3,6,9,10], 6: [6,8,11], 7: [4,6,8,10], 8: [3,5,9], 9: [3,4], }},
"245":{width: 10, height: 5, name: "Moose antlers", pattern: 
{0: [0,1,7,8], 1: [0,8], 2: [1,2,3,5,6,7], 3: [3,5], 4: [4], }},
"246":{width: 7, height: 4, name: "Multum in parvo", pattern: 
{0: [3,4,5], 1: [2,5], 2: [1], 3: [0], }},
"247":{width: 8, height: 7, name: "Muttering moat 1", pattern: 
{0: [0,1], 1: [0,4,5], 2: [1,3,5], 4: [1,2,5], 5: [3,6], 6: [5,6], }},
"248":{width: 7, height: 5, name: "MWSS", pattern: 
{0: [3], 1: [1,5], 2: [0], 3: [0,5], 4: [0,1,2,3,4], }},
"249":{width: 12, height: 12, name: "Negentropy", pattern: 
{0: [3,4,6], 1: [3,5,6], 3: [4,5,6], 4: [3,5,7,9,10], 5: [3,4,7,9,10], 6: [0,1,3,7], 7: [0,1,3,7], 8: [4,5,6], 10: [4,5,7], 11: [4,6,7], }},
"250":{width: 10, height: 9, name: "New five", pattern: 
{0: [2,3], 1: [1,4], 2: [1,3,6], 3: [0,1,3,5,6], 4: [0], 5: [1,2,3,5,6,7,8], 6: [5,8], 7: [0,2,3], 8: [0,1,3,4], }},
"251":{width: 9, height: 8, name: "Octagon 2", pattern: 
{0: [3,4], 1: [2,5], 2: [1,6], 3: [0,7], 4: [0,7], 5: [1,6], 6: [2,5], 7: [3,4], }},
"252":{width: 13, height: 5, name: "Odd keys", pattern: 
{0: [10], 1: [1,9,11], 2: [0,2,3,4,7,8,10], 3: [1,4,7], 4: [4,7], }},
"253":{width: 10, height: 6, name: "Odd test tube baby", pattern: 
{0: [7], 1: [0,1,6,8], 2: [0,2,5,7], 3: [2,5], 4: [2,5], 5: [3,4], }},
"254":{width: 15, height: 15, name: "Orion", pattern: 
{0: [3,4], 1: [3,5], 2: [3], 3: [0,1,3], 4: [0,5], 5: [0,2,3,10,11,12], 6: [5,6,7,12,13], 7: [6,7,8,10,12], 8: [13], 9: [6,8], 10: [5,6,8], 11: [6], 12: [4,5,7], 13: [7], 14: [5,6], }},
"255":{width: 14, height: 13, name: "Orion 2", pattern: 
{0: [1,2], 1: [0,1], 2: [2], 3: [4,9,10,11], 4: [4,5,6,11,12], 5: [5,6,7,9,11], 6: [12], 7: [5,7], 8: [4,5,7], 9: [5], 10: [3,4,6], 11: [6], 12: [4,5], }},
"256":{width: 6, height: 7, name: "Ortho-loaf and table", pattern: 
{0: [2], 1: [1,3], 2: [1,4], 3: [2,3], 5: [0,1,2,3], 6: [0,3], }},
"257":{width: 9, height: 5, name: "OWSS", pattern: 
{0: [3,4,5], 1: [1,7], 2: [0], 3: [0,7], 4: [0,1,2,3,4,5,6], }},
"258":{width: 6, height: 6, name: "Paperclip", pattern: 
{0: [2,3], 1: [1,4], 2: [1,3,4], 3: [0,1,3], 4: [0,3], 5: [1,2], }},
"259":{width: 11, height: 3, name: "Pentadecathlon", pattern: 
{0: [2,7], 1: [0,1,3,4,5,6,8,9], 2: [2,7], }},
"260":{width: 11, height: 12, name: "Pentant", pattern: 
{0: [0,1], 1: [1], 2: [1,3], 3: [2,3,8,9], 4: [9], 5: [5,6,7,8], 6: [5], 7: [2,6,7,8], 8: [2,3,4,5,8], 9: [5], 10: [4], 11: [4,5], }},
"261":{width: 9, height: 8, name: "Pentapole", pattern: 
{0: [0,1], 1: [0,2], 3: [2,4], 5: [4,6], 6: [7], 7: [6,7], }},
"262":{width: 14, height: 12, name: "Pentoad", pattern: 
{0: [11,12], 1: [11], 2: [9,11], 3: [9,10], 4: [5,6], 5: [6], 6: [6], 7: [6,7], 8: [2,3], 9: [1,3], 10: [1], 11: [0,1], }},
"263":{width: 9, height: 8, name: "Phoenix 1", pattern: 
{0: [3], 1: [3,5], 2: [1], 3: [6,7], 4: [0,1], 5: [6], 6: [2,4], 7: [4], }},
"264":{width: 4, height: 3, name: "Pi-heptomino", pattern: 
{0: [0,1,2], 1: [0,2], 2: [0,2], }},
"265":{width: 13, height: 12, name: "Pinwheel", pattern: 
{0: [6,7], 1: [6,7], 3: [4,5,6,7], 4: [0,1,3,8], 5: [0,1,3,6,8], 6: [3,7,8,10,11], 7: [3,5,8,10,11], 8: [4,5,6,7], 10: [4,5], 11: [4,5], }},
"266":{width: 12, height: 5, name: "Piston", pattern: 
{0: [0,1,9,10], 1: [0,2,5,8,10], 2: [2,3,4,5,8], 3: [0,2,5,8,10], 4: [0,1,9,10], }},
"267":{width: 5, height: 4, name: "Pond", pattern: 
{0: [1,2], 1: [0,3], 2: [0,3], 3: [1,2], }},
"268":{width: 4, height: 2, name: "Pre-beehive", pattern: 
{0: [0,1,2], 1: [0,1,2], }},
"269":{width: 3, height: 2, name: "Pre-block", pattern: 
{0: [0], 1: [0,1], }},
"270":{width: 10, height: 3, name: "Pre-pulsar", pattern: 
{0: [0,1,2,6,7,8], 1: [0,2,6,8], 2: [0,1,2,6,7,8], }},
"271":{width: 12, height: 12, name: "Pressure cooker", pattern: 
{0: [5], 1: [4,6], 2: [4,6], 3: [3,4,6,7], 4: [0,2,8,10], 5: [0,1,3,5,7,9,10], 6: [3,7], 7: [3,7], 8: [4,5,6], 10: [3,5,6], 11: [3,4,6], }},
"272":{width: 14, height: 13, name: "Protein", pattern: 
{0: [4,5], 1: [4], 2: [6], 3: [2,3,4,5,7,9,10], 4: [1,7,9,12], 5: [1,4,5,7,9,11,12], 6: [0,1,3,9], 7: [3,6,7,9], 8: [3,8], 9: [4,5,6,7], 11: [4,5], 12: [4,5], }},
"273":{width: 13, height: 12, name: "Pseudo-barberpole", pattern: 
{0: [10,11], 1: [11], 2: [9], 3: [7,9], 5: [5,7], 7: [3,5], 9: [2,3], 10: [0], 11: [0,1], }},
"274":{width: 14, height: 13, name: "Pulsar", pattern: 
{0: [2,3,4,8,9,10], 2: [0,5,7,12], 3: [0,5,7,12], 4: [0,5,7,12], 5: [2,3,4,8,9,10], 7: [2,3,4,8,9,10], 8: [0,5,7,12], 9: [0,5,7,12], 10: [0,5,7,12], 12: [2,3,4,8,9,10], }},
"275":{width: 9, height: 8, name: "Pulsar quadrant", pattern: 
{0: [5], 1: [3,4,5], 2: [2,6,7], 3: [0,3,6], 4: [0,4,6], 5: [0,5], 7: [2,3,4], }},
"276":{width: 12, height: 12, name: "Pushalong 1", pattern: 
{0: [3], 1: [1,4], 2: [0,4], 3: [0,4], 4: [0,1,3], 5: [5,6], 6: [2,5,6], 7: [4], 8: [7,8,9], 9: [6,7,8,9,10], 10: [5,6,8,9,10], 11: [6,7], }},
"277":{width: 7, height: 6, name: "Quad", pattern: 
{0: [0,1,4,5], 1: [0,3,5], 2: [1], 3: [4], 4: [0,2,5], 5: [0,1,4,5], }},
"278":{width: 8, height: 7, name: "Quadpole", pattern: 
{0: [0,1], 1: [0,2], 3: [2,4], 5: [4,6], 6: [5,6], }},
"279":{width: 12, height: 9, name: "Quad pseudo still life", pattern: 
{0: [8,9], 1: [3,4,6,9], 2: [3,5,6,8], 3: [8,9], 4: [3,5,6,10], 5: [1,2,3,5,6,8,9], 6: [0,8], 7: [1,2,3,5,6,8], 8: [3,5,7], }},
"280":{width: 8, height: 5, name: "Queen bee", pattern: 
{0: [3], 1: [2,4], 2: [1,5], 3: [2,3,4], 4: [0,1,5,6], }},
"281":{width: 12, height: 10, name: "R2D2", pattern: 
{0: [5], 1: [4,6], 2: [3,5,7], 3: [3,5,7], 4: [0,1,3,7,9,10], 5: [0,1,3,7,9,10], 6: [3,7], 7: [3,5,7], 8: [4,6], 9: [5], }},
"282":{width: 8, height: 3, name: "Rabbits", pattern: 
{0: [0,4,5,6], 1: [0,1,2,5], 2: [1], }},
"283":{width: 13, height: 11, name: "$rats", pattern: 
{0: [5,6], 1: [6], 2: [4], 3: [0,1,3,5,6,7,8], 4: [0,1,3,9,11], 5: [3,6,7,8,10,11], 6: [3,8], 7: [4,5,6,8], 8: [7], 9: [6], 10: [6,7], }},
"284":{width: 6, height: 6, name: "R-bee and snake", pattern: 
{0: [0,1,3], 1: [0,2,3], 3: [1,2,3], 4: [1,4], 5: [2,3], }},
"285":{width: 15, height: 8, name: "Revolver", pattern: 
{0: [0,13], 1: [0,1,2,7,11,12,13], 2: [3,5,7,10], 3: [2,9,11], 4: [2,4,11], 5: [3,6,8,10], 6: [0,1,2,6,11,12,13], 7: [0,13], }},
"286":{width: 5, height: 4, name: "R-loaf", pattern: 
{0: [0,1,2], 1: [0,3], 2: [1,3], 3: [2], }},
"287":{width: 15, height: 14, name: "Roteightor", pattern: 
{0: [1], 1: [1,2,3,12,13], 2: [4,12], 3: [3,4,10,12], 4: [10,11], 6: [6,7], 7: [5,6,8], 8: [6,7,8], 9: [2,3,7,8,9], 10: [1,3,9,10], 11: [1,9], 12: [0,1,10,11,12], 13: [12], }},
"288":{width: 4, height: 3, name: "R-pentomino", pattern: 
{0: [1,2], 1: [0,1], 2: [1], }},
"289":{width: 8, height: 6, name: "Scorpion", pattern: 
{0: [3], 1: [1,2,3], 2: [0,4,5], 3: [0,2,4,6], 4: [1,2,4,6], 5: [5], }},
"290":{width: 14, height: 7, name: "Scot's p5", pattern: 
{0: [4,8], 1: [3,5,7,9], 2: [2,10], 4: [1,2,3,9,10,11], 5: [4,5,7,8], 6: [0,1,2,4,5,7,8,10,11,12], }},
"291":{width: 12, height: 11, name: "Scrubber", pattern: 
{0: [4], 1: [2,3,4], 2: [1], 3: [1,4,5,6], 4: [0,1,3,7], 5: [3,7], 6: [3,7,9,10], 7: [4,5,6,9], 8: [9], 9: [6,7,8], 10: [6], }},
"292":{width: 8, height: 5, name: "Sesquihat", pattern: 
{0: [4], 1: [0,1,3,5], 2: [1,3,5], 3: [1,3,5,6], 4: [2], }},
"293":{width: 6, height: 3, name: "Shillelagh", pattern: 
{0: [0,1], 1: [0,3,4], 2: [1,2,4], }},
"294":{width: 4, height: 3, name: "Ship", pattern: 
{0: [0,1], 1: [0,2], 2: [1,2], }},
"295":{width: 8, height: 7, name: "Ship on long boat", pattern: 
{0: [0,1], 1: [0,2], 2: [1,2], 3: [3,4], 4: [3,5], 5: [4,6], 6: [5], }},
"296":{width: 11, height: 10, name: "Ship on quadpole", pattern: 
{0: [0,1], 1: [0,2], 2: [1,2], 3: [3,4], 4: [3,5], 6: [5,7], 8: [7,9], 9: [8,9], }},
"297":{width: 7, height: 6, name: "Ship-tie", pattern: 
{0: [0,1], 1: [0,2], 2: [1,2], 3: [3,4], 4: [3,5], 5: [4,5], }},
"298":{width: 13, height: 4, name: "Short keys", pattern: 
{0: [1,10], 1: [0,2,3,4,7,8,9,11], 2: [1,4,7,10], 3: [4,7], }},
"299":{width: 9, height: 10, name: "Sidecar", pattern: 
{0: [1], 1: [0,6], 2: [0,6], 3: [0,1,2,3,4,6], 5: [4,5], 6: [2,7], 7: [1], 8: [1,7], 9: [1,2,3,4,5,6], }},
"300":{width: 7, height: 5, name: "Sidewalk", pattern: 
{0: [1,2,4,5], 1: [2,4], 2: [1,4], 3: [1,3], 4: [0,1,3,4], }},
"301":{width: 12, height: 7, name: "Silver's p5", pattern: 
{0: [0,1], 1: [0], 2: [1,4], 3: [3,4], 4: [3,7,9,10], 5: [2,7,8,10], 6: [2,3], }},
"302":{width: 8, height: 8, name: "Six Ls", pattern: 
{0: [3], 1: [1,2,3,6], 2: [0,4,5,6], 3: [0,1,2], 4: [4,5,6], 5: [0,1,2,6], 6: [0,3,4,5], 7: [3], }},
"303":{width: 8, height: 7, name: "Skewed quad", pattern: 
{0: [1,2], 1: [1,5,6], 2: [2,4,6], 4: [0,2,4], 5: [0,1,5], 6: [4,5], }},
"304":{width: 10, height: 9, name: "Small lake", pattern: 
{0: [4], 1: [3,5], 2: [3,5], 3: [1,2,6,7], 4: [0,8], 5: [1,2,6,7], 6: [3,5], 7: [3,5], 8: [4], }},
"305":{width: 8, height: 7, name: "Smiley", pattern: 
{0: [0,1,2,4,5,6], 1: [1,3,5], 3: [1,5], 5: [0,2,4,6], 6: [2,4], }},
"306":{width: 5, height: 2, name: "Snake", pattern: 
{0: [0,1,3], 1: [0,2,3], }},
"307":{width: 7, height: 6, name: "Snake bridge snake", pattern: 
{0: [4,5], 1: [4], 2: [5], 3: [4,5], 4: [0,1,3], 5: [0,2,3], }},
"308":{width: 10, height: 9, name: "Snake dance", pattern: 
{0: [3,4,6], 1: [3,5,6], 2: [0,1,3], 3: [1,4,6,7,8], 4: [0,3,5,8], 5: [0,1,2,4,7], 6: [5,7,8], 7: [2,3,5], 8: [2,4,5], }},
"309":{width: 8, height: 7, name: "Snake pit", pattern: 
{0: [0,2,3,5,6], 1: [0,1,3,5], 2: [6], 3: [0,1,2,4,5,6], 4: [0], 5: [1,3,5,6], 6: [0,1,3,4,6], }},
"310":{width: 12, height: 11, name: "Snake pit 2", pattern: 
{0: [5,6], 1: [4,7], 2: [4,6,7], 3: [1,2,4], 4: [0,2,4,6,7,8,9], 5: [0,10], 6: [1,2,3,4,6,8,10], 7: [6,8,9], 8: [3,4,6], 9: [3,6], 10: [4,5], }},
"311":{width: 8, height: 2, name: "Snake siamese snake", pattern: 
{0: [0,1,3,4,6], 1: [0,2,3,5,6], }},
"312":{width: 7, height: 5, name: "Snorkel loop", pattern: 
{0: [2,3], 1: [1,4], 2: [2,4], 3: [0,2,4,5], 4: [0,1], }},
"313":{width: 9, height: 5, name: "Spark coil", pattern: 
{0: [0,1,6,7], 1: [0,2,5,7], 2: [2,5], 3: [0,2,5,7], 4: [0,1,6,7], }},
"314":{width: 8, height: 7, name: "Spiral", pattern: 
{0: [0,1,6], 1: [1,4,5,6], 2: [1,3], 3: [2,4], 4: [3,5], 5: [0,1,2,5], 6: [0,5,6], }},
"315":{width: 5, height: 3, name: "Stairstep hexomino", pattern: 
{0: [0,1], 1: [1,2], 2: [2,3], }},
"316":{width: 12, height: 11, name: "Star", pattern: 
{0: [4,5,6], 2: [2,4,6,8], 4: [0,2,8,10], 5: [0,10], 6: [0,2,8,10], 8: [2,4,6,8], 10: [4,5,6], }},
"317":{width: 9, height: 8, name: "Stillater", pattern: 
{0: [3], 1: [2,4,6,7], 2: [2,4,5,7], 3: [0,1], 4: [1,3,5,6], 5: [1,3,6], 6: [2,5], 7: [3,4], }},
"318":{width: 11, height: 9, name: "Surprise", pattern: 
{0: [3,8,9], 1: [3,4,5,8], 2: [1,2,6,8], 3: [0,3,4,6,8,9], 4: [1,8], 5: [0,1,3,5,6,9], 6: [1,3,7,8], 7: [1,4,5,6], 8: [0,1,6], }},
"319":{width: 7, height: 4, name: "Switch engine", pattern: 
{0: [1,3], 1: [0], 2: [1,4], 3: [3,4,5], }},
"320":{width: 8, height: 5, name: "Symmetric scorpion", pattern: 
{0: [3], 1: [1,2,3,4,5], 2: [0,6], 3: [0,2,4,6], 4: [1,2,4,5], }},
"321":{width: 5, height: 2, name: "Table", pattern: 
{0: [0,1,2,3], 1: [0,3], }},
"322":{width: 5, height: 5, name: "Table on table", pattern: 
{0: [0,3], 1: [0,1,2,3], 3: [0,1,2,3], 4: [0,3], }},
"323":{width: 3, height: 3, name: "Tail", pattern: 
{0: [0], 1: [0], 2: [0,1], }},
"324":{width: 5, height: 4, name: "Teardrop", pattern: 
{0: [1,2,3], 1: [0,3], 2: [0,3], 3: [1,2], }},
"325":{width: 12, height: 12, name: "Technician", pattern: 
{0: [5], 1: [4,6], 2: [4,5], 3: [2,3], 4: [1,5,6,7], 5: [0,3,4,8,10], 6: [1,2,7,9,10], 7: [3,5,7], 8: [3,7], 9: [4,5,6], 10: [6,8], 11: [7,8], }},
"326":{width: 9, height: 5, name: "Test tube baby", pattern: 
{0: [0,1,6,7], 1: [0,2,5,7], 2: [2,5], 3: [2,5], 4: [3,4], }},
"327":{width: 14, height: 9, name: "Thumb 1", pattern: 
{0: [3,4], 1: [3,5,7,8,11,12], 2: [0,1,3,7,9,12], 3: [0,1,3,7,9,10,11], 4: [3,7], 5: [3,5,7,8,9], 6: [4,6,10], 7: [6,9,10], 8: [6,7], }},
"328":{width: 4, height: 5, name: "Thunderbird", pattern: 
{0: [0,1,2], 2: [1], 3: [1], 4: [1], }},
"329":{width: 12, height: 10, name: "T-nosed p4", pattern: 
{0: [4,5,6], 1: [5], 3: [4,5,6], 4: [3,7], 5: [2,8], 6: [2,4,6,8], 7: [1,2,4,6,8,9], 8: [0,3,4,6,7,10], 9: [0,1,9,10], }},
"330":{width: 5, height: 2, name: "Toad", pattern: 
{0: [1,2,3], 1: [0,1,2], }},
"331":{width: 12, height: 12, name: "Toaster", pattern: 
{0: [2,9,10], 1: [1,3,5,6,9], 2: [1,3,5,7,9], 3: [0,1,3,7,9,10], 4: [0,3,4,6,7,10], 5: [1,9], 6: [1,9], 7: [0,3,4,6,7,10], 8: [0,1,3,7,9,10], 9: [1,3,5,7,9], 10: [1,3,5,6,9], 11: [2,9,10], }},
"332":{width: 8, height: 7, name: "Traffic light", pattern: 
{0: [2,3,4], 2: [0,6], 3: [0,6], 4: [0,6], 6: [2,3,4], }},
"333":{width: 7, height: 6, name: "Trans-barge with tail", pattern: 
{0: [0,1], 1: [1], 2: [1,3], 3: [2,4], 4: [3,5], 5: [4], }},
"334":{width: 8, height: 8, name: "Trans-beacon and dock", pattern: 
{0: [5,6], 1: [6], 2: [3], 3: [3,4], 5: [1,2,3,4], 6: [0,5], 7: [0,1,4,5], }},
"335":{width: 7, height: 7, name: "Trans-beacon and table", pattern: 
{0: [4,5], 1: [5], 2: [2], 3: [2,3], 5: [0,1,2,3], 6: [0,3], }},
"336":{width: 6, height: 6, name: "Trans-block and long hook", pattern: 
{0: [3,4], 1: [0,4], 2: [0,1,2,3], 4: [0,1], 5: [0,1], }},
"337":{width: 7, height: 7, name: "Trans-boat and dock", pattern: 
{0: [1], 1: [0,2], 2: [1,2], 4: [1,2,3,4], 5: [0,5], 6: [0,1,4,5], }},
"338":{width: 7, height: 6, name: "Trans-boat with nine", pattern: 
{0: [0,1], 1: [0,2], 2: [1], 3: [2,3,4], 4: [5], 5: [4,5], }},
"339":{width: 6, height: 5, name: "Trans-boat with tail", pattern: 
{0: [0,1], 1: [0,2], 2: [1,3], 3: [3], 4: [3,4], }},
"340":{width: 7, height: 6, name: "Trans-fuse with two tails", pattern: 
{0: [0,1], 1: [1], 2: [1,3], 3: [2,4], 4: [4], 5: [4,5], }},
"341":{width: 6, height: 7, name: "Trans-hook and R-bee", pattern: 
{0: [3,4], 1: [1,4], 2: [1,2,3], 4: [1,2,3], 5: [0,3], 6: [1,2], }},
"342":{width: 7, height: 6, name: "Trans-loaf with tail", pattern: 
{0: [0,1], 1: [1], 2: [1,3,4], 3: [2,5], 4: [3,5], 5: [4], }},
"343":{width: 8, height: 5, name: "Trans-mirrored R-bee", pattern: 
{0: [5], 1: [1,2,4,6], 2: [0,2,4,6], 3: [0,2,4,5], 4: [1], }},
"344":{width: 6, height: 8, name: "Trans-R-bee and R-loaf", pattern: 
{0: [2,3], 1: [1,4], 2: [1,2,3], 4: [1,2,3], 5: [0,3], 6: [0,2], 7: [1], }},
"345":{width: 8, height: 7, name: "Trans-rotated R-bee", pattern: 
{0: [1], 1: [0,2], 2: [0,2], 3: [1,2,4,5], 4: [4,6], 5: [4,6], 6: [5], }},
"346":{width: 8, height: 7, name: "Trice tongs", pattern: 
{0: [2], 1: [2,3,4], 2: [0,1,5], 3: [1,3,5], 4: [1], 5: [2,3,6], 6: [5,6], }},
"347":{width: 9, height: 10, name: "Triple pseudo still life", pattern: 
{0: [6,7], 1: [2,4,7], 2: [1,3,4,6], 3: [1,6,7], 4: [0,1,3,4], 5: [3,4,6,7], 6: [0,1,6], 7: [1,3,4,6], 8: [0,3,5], 9: [0,1], }},
"348":{width: 7, height: 6, name: "Tripole", pattern: 
{0: [0,1], 1: [0,2], 3: [2,4], 4: [5], 5: [4,5], }},
"349":{width: 4, height: 2, name: "T-tetromino", pattern: 
{0: [0,1,2], 1: [1], }},
"350":{width: 4, height: 3, name: "Tub", pattern: 
{0: [1], 1: [0,2], 2: [1], }},
"351":{width: 14, height: 13, name: "Tubber", pattern: 
{0: [4,6], 1: [4,5,7], 2: [7,8,9], 3: [4,5,10], 4: [0,1,3,6,7,10], 5: [1,3,8,10,11], 6: [0,4,8,12], 7: [1,2,4,9,11], 8: [2,5,6,9,11,12], 9: [2,7,8], 10: [3,4,5], 11: [5,7,8], 12: [6,8], }},
"352":{width: 11, height: 6, name: "Tub test tube baby", pattern: 
{0: [1,8], 1: [0,2,7,9], 2: [1,3,6,8], 3: [3,6], 4: [3,6], 5: [4,5], }},
"353":{width: 5, height: 7, name: "Tub with long long tail", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [3], 4: [2], 5: [1], 6: [1,2], }},
"354":{width: 5, height: 6, name: "Tub with long tail", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [3], 4: [2], 5: [2,3], }},
"355":{width: 6, height: 5, name: "Tub with tail", pattern: 
{0: [1], 1: [0,2], 2: [1,3], 3: [3], 4: [3,4], }},
"356":{width: 10, height: 5, name: "Tumbler", pattern: 
{0: [1,7], 1: [0,2,6,8], 2: [0,3,5,8], 3: [2,6], 4: [2,3,5,6], }},
"357":{width: 13, height: 10, name: "Turtle", pattern: 
{0: [1,2,3,11], 1: [1,2,5,7,8,10,11], 2: [3,4,5,10], 3: [1,4,6,10], 4: [0,5,10], 5: [0,5,10], 6: [1,4,6,10], 7: [3,4,5,10], 8: [1,2,5,7,8,10,11], 9: [1,2,3,11], }},
"358":{width: 10, height: 5, name: "Twin hat", pattern: 
{0: [2,6], 1: [1,3,5,7], 2: [1,3,5,7], 3: [0,1,3,5,7,8], 4: [4], }},
"359":{width: 10, height: 8, name: "Two_Eaters", pattern: 
{0: [0,1], 1: [1], 2: [1,3], 3: [2,3], 4: [5,6], 5: [5,7], 6: [7], 7: [7,8], }},
"360":{width: 7, height: 6, name: "Two-glider mess", pattern: 
{0: [3,5], 1: [4,5], 2: [4], 3: [0,1,2], 4: [2], 5: [1], }},
"361":{width: 10, height: 9, name: "Two pulsar quadrants", pattern: 
{0: [4], 1: [4], 2: [3,4], 3: [2], 4: [0,3,6,7,8], 5: [0,4,6], 6: [0,5], 8: [2,3,4], }},
"362":{width: 15, height: 14, name: "Unicycle", pattern: 
{0: [2,3,7,8,9,10], 1: [2,3,6,11], 2: [0,1,3,6,10,12], 3: [0,1,2,7,11,13], 4: [13], 5: [13], 6: [1,2,10,13], 7: [0,3,11,12], 8: [0], 9: [0], 10: [0,2,6,11,12,13], 11: [1,3,7,10,12,13], 12: [2,7,10,11], 13: [3,4,5,6,10,11], }},
"363":{width: 9, height: 8, name: "Unix", pattern: 
{0: [1,2], 1: [1,2], 3: [1], 4: [0,2], 5: [0,3,6,7], 6: [4,6,7], 7: [2,3], }},
"364":{width: 8, height: 3, name: "Very long house", pattern: 
{0: [1,2,3,4,5], 1: [0,3,6], 2: [0,1,5,6], }},
"365":{width: 8, height: 7, name: "Washing machine", pattern: 
{0: [1,2,4,5], 1: [0,2,3,6], 2: [0,1,6], 3: [1,5], 4: [0,5,6], 5: [0,3,4,6], 6: [1,2,4,5], }},
"366":{width: 14, height: 13, name: "Wavefront", pattern: 
{0: [8,9], 1: [8], 2: [9], 3: [8,9], 4: [5,6,10,11], 5: [4,7,8,9,12], 6: [4,10,11], 7: [5,9], 8: [0,1,3,5,9], 9: [0,2,3,5,7,8], 10: [4,6], 11: [4,6], 12: [5], }},
"367":{width: 8, height: 7, name: "Why not", pattern: 
{0: [3], 1: [3,5], 2: [1], 3: [0,2,3,4,5,6], 4: [1], 5: [3,5], 6: [3], }},
"368":{width: 5, height: 4, name: "Wing", pattern: 
{0: [1,2], 1: [0,3], 2: [1,3], 3: [2,3], }},
"369":{width: 10, height: 11, name: "x66", pattern: 
{0: [2], 1: [0,1], 2: [0,3,4,5,8], 3: [0,5,6,7], 4: [1,2,3,6,7], 6: [1,2,3,6,7], 7: [0,5,6,7], 8: [0,3,4,5,8], 9: [0,1], 10: [2], }},
"370":{width: 4, height: 4, name: "Z-hexomino", pattern: 
{0: [0,1], 1: [1], 2: [1], 3: [1,2], }},

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
			
			this.createToolbar();			
			
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
		addButton.onclick = function(event) { // Closure
			_this.replacePattern.call(_this);
			event.preventDefault();
		};
		toolbar.appendChild(addButton);
		
		// Pause button
		var pauseButton = document.createElement('button');
		pauseButton.innerHTML = 'Pause';
		pauseButton.onclick = function(event) { // Closure
			_this.togglePause.call(_this);
			event.preventDefault();
		};
		this.pauseButton = pauseButton; // Cache for easy access
		toolbar.appendChild(pauseButton);
		
		// Step button
		var stepButton = document.createElement('button');
		stepButton.innerHTML = 'Step';
		stepButton.setAttribute('title', 'Pause to enable stepping');
		stepButton.setAttribute('disabled', 'disabled');
		stepButton.onclick = function(event) { // Closure
			_this.step.call(_this);
			event.preventDefault();
		}
		this.stepButton = stepButton; // Cache for easy access
		toolbar.appendChild(stepButton);

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


		// Reset button

		this.canvasContainer.appendChild(toolbar);	
	
	}
	
	this.replacePattern = function() {
		// Gets the user selected pattern and adds it to the centre of the game
		
		var select = document.getElementById('life_pattern_select');
		var pattern = select.options[select.options.selectedIndex].value;
		
		this.stopGame();
		this.clear();
		this.loadPattern(pattern, 0, 0, true);
		if (this.togglePaused === false) this.startGame();
		// Prevent inadvertent form submission
		return false;
	}
	
	this.togglePause = function() {
		// Toggles paused state of simulation
		if (this.togglePaused) {
			this.togglePaused = false;
			this.startGame();
			this.pauseButton.innerHTML = "Pause";
			this.stepButton.setAttribute('disabled', 'disabled');
		} else {
			this.togglePaused = true;
			this.stopGame();
			this.pauseButton.innerHTML = "Resume";
			this.stepButton.removeAttribute('disabled');
		}		
	}
	
	this.step = function() {
		// Steps the simulation forward one step
		
		// Don't mess up state of the internal array by writing to it twice
		// Once here below, once in the regular tick called every interval secs
		if (this.togglePaused === false) return;
		
		this.playGame();		
		
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
	
	this.stopGame = function() {
		// Stops a game in progress
		
		if (this.intervalHandle === null) return;
		clearTimeout(this.intervalHandle);
		this.intervalHandle = null;
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