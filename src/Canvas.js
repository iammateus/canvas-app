var Canvas = function (params) {
    this.params = params;

    this.blockMatrizState = [];
    this.buildBlockMatrizState();

    this.canvasDom = new CanvasDom(this);

    this.color = "black";
    this.isMouseDown = false;
    this.lastBlocksDrawn = []; // Why keep last blocks drawn?
    this.lastMousePosition = null;

    if (params.blockMatrizState) {
        this.blockMatrizState = params.blockMatrizState;
        this.update();
    }
};

Canvas.prototype.buildBlockMatrizState = function () {
    var canvasSize = this.params.size;

    for (let rowsCounter = 0; rowsCounter < canvasSize; rowsCounter++) {
        var newRow = [];
        for (
            let columnCounter = 0;
            columnCounter < canvasSize;
            columnCounter++
        ) {
            newRow.push({});
        }
        this.blockMatrizState.push(newRow);
    }
};

Canvas.prototype.onMouseDown = function (event) {
    event.preventDefault();
    this.isMouseDown = true;
    this.draw(event.target);
};

Canvas.prototype.onMouseEnter = function (event) {
    if (!this.isMouseDown) {
        return;
    }

    var canvasSize = this.params.size;
    var lastMousePosition = this.lastMousePosition;
    var leastXDif = Infinity;
    var leastYDif = Infinity;
    var closestBlock = null;

    for (let rowsCounter = 0; rowsCounter < canvasSize; rowsCounter++) {
        for (
            let columnCounter = 0;
            columnCounter < canvasSize;
            columnCounter++
        ) {
            const rect = this.canvasDom.blockMatriz[rowsCounter][
                columnCounter
            ].getBoundingClientRect();
            var position = {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
            };
            if (
                Math.abs(position.x - lastMousePosition.x) < leastXDif ||
                Math.abs(position.y - lastMousePosition.y) < leastYDif
            ) {
                leastXDif = Math.abs(position.x - lastMousePosition.x);
                leastYDif = Math.abs(position.y - lastMousePosition.y);
                closestBlock = this.canvasDom.blockMatriz[rowsCounter][
                    columnCounter
                ];
            }
        }
    }
    this.draw(closestBlock);
};

Canvas.prototype.onMouseUp = function (event) {
    this.isMouseDown = false;
    this.lastBlocksDrawn = [];
};

Canvas.prototype.onMouseMove = function (event) {
    if (this.isMouseDown) {
        this.draw(event.target);
    }
    this.lastMousePosition = {
        x: event.x,
        y: event.y,
    };
};

Canvas.prototype.onMouseLeave = function (event) {
    if (this.isMouseDown) {
        var mouseOffsetX = Math.round(event.offsetY / 10);
        var mouseOffsetY = Math.round(event.offsetX / 10);
        var maxOffset = this.params.size - 1;

        mouseOffsetX = mouseOffsetX <= maxOffset ? mouseOffsetX : maxOffset;
        mouseOffsetY = mouseOffsetY <= maxOffset ? mouseOffsetY : maxOffset;

        mouseOffsetX = mouseOffsetX > -1 ? mouseOffsetX : 0;
        mouseOffsetY = mouseOffsetY > -1 ? mouseOffsetY : 0;

        var elementToDraw = this.canvasDom.blockMatriz[mouseOffsetX][
            mouseOffsetY
        ];

        this.draw(elementToDraw);
    }
    this.lastBlocksDrawn = [];
};

Canvas.prototype.draw = function (element) {
    var nextBlock = {
        x: element.getAttribute("x"),
        y: element.getAttribute("y"),
    };

    var previousBlock = this.lastBlocksDrawn[this.lastBlocksDrawn.length - 1];

    if (nextBlock.x && nextBlock.y) {
        if (previousBlock) {
            this.fillLineGap(previousBlock, nextBlock);
        }
        this.drawBlock(nextBlock.x, nextBlock.y);
    }
};

Canvas.prototype.fillLineGap = function (previousBlock, nextBlock) {
    previousBlock.x = parseInt(previousBlock.x);
    previousBlock.y = parseInt(previousBlock.y);

    var positiveXDifference = Math.abs(previousBlock.x - nextBlock.x);
    var positiveYDifference = Math.abs(previousBlock.y - nextBlock.y);

    var thereIsXDifference = positiveXDifference !== 0;
    var thereIsYDifference = positiveYDifference !== 0;
    if (!thereIsXDifference && !thereIsYDifference) {
        return;
    }

    var biggestDifference = positiveXDifference;
    if (positiveYDifference > positiveXDifference) {
        biggestDifference = positiveYDifference;
    }

    for (let index = 0; index <= biggestDifference; index++) {
        var blockToDraw = {};
        blockToDraw.x = previousBlock.x;

        if (previousBlock.x - nextBlock.x > 0) {
            blockToDraw.x = previousBlock.x - 1;
        }

        if (previousBlock.x - nextBlock.x < 0) {
            blockToDraw.x = previousBlock.x + 1;
        }

        blockToDraw.y = previousBlock.y;

        if (previousBlock.y - nextBlock.y > 0) {
            blockToDraw.y = previousBlock.y - 1;
        }

        if (previousBlock.y - nextBlock.y < 0) {
            blockToDraw.y = previousBlock.y + 1;
        }

        this.drawBlock(blockToDraw.x, blockToDraw.y);
        previousBlock = { x: blockToDraw.x, y: blockToDraw.y };
    }
};

Canvas.prototype.drawBlock = function (targetX, targetY) {
    // Blocks state updated
    this.blockMatrizState[targetX][targetY].backgroundColor =
        this.color || "black";
    this.lastBlocksDrawn.push({ x: targetX, y: targetY });
    this.update();
};

Canvas.prototype.update = function (targetX, targetY) {
    this.canvasDom.update();
};
