Gameoflife.js
=============

Javascript and canvas implementation of the game of life.

To add the Game of Life to your webpage:

HTML:
```HTML
<script src="gameoflife.js"></script>
<div id="life_canvas_container"></div>
```

JavaScript:
```Javascript
var gol = new GameOfLife();
```

You can also pass in optional settings as follows:
```Javascript
var gol = new GameOfLife({speed: 1000, numRows: 100, numCols: 100});
```

Where the settings are:
```
	numRows = number of rows in the canvas (default 40)
	numCols = number of columns in the canvas (default 80)
    cellSize = side of cell in px (default 10)
	speed = how many milliseconds between generations (default 100)
    bordercolour = border colour between cells and around canvas. Hex String. 
            (default '#000000')
	drawBorder = draws border around each cell if true (default true)
	drawFrame = draws border around entire canvas if true (default true)
    deadCellBackgroundcolour = background colour of dead cell. Hex string.
			(default '#ff0000')
    liveCellBackgroundColour = background colour of live cell. Hex string.
			(default '#0000ff')
    emptyCellBackgroundColour = background colour of empty cell. Hex string.
			(default '#ffffff') Note: empty cell - a cell that was never visited.
    differenteateDeadEmptyCells = whether or not to show dead cells
            in a different colour from empty cells. (default false)
	elementId = ID of the div we use to set up the <canvas>
			(default 'life_canvas_container')
```

At present, this uses the simple two array implementation of the game of life.