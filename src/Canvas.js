var Canvas = function (params) {
    this.params = params;

    this.blockMatrizState = [];
    this.buildBlockMatrizState();

    this.canvasDom = new CanvasDom(this);

    this.isMouseDown = false;
    this.color = "black";
    this.lastBlocksDrawn = [];
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
    var targetX = element.getAttribute("x");
    var targetY = element.getAttribute("y");
    var nextBlock = { x: targetX, y: targetY };

    var previousBlock = this.lastBlocksDrawn[this.lastBlocksDrawn.length - 1];

    if (previousBlock && objectsIsEqual(previousBlock, nextBlock)) {
        return;
    }

    if (targetX && targetY) {
        if (previousBlock) {
            this.fillLineGap(previousBlock, nextBlock);
        }
        this.drawBlock(targetX, targetY);
    }
};

Canvas.prototype.fillLineGap = function (previousBlock, nextBlock) {
    var previousBlockX = parseInt(previousBlock.x);
    var previousBlockY = parseInt(previousBlock.y);

    var nextBlockX = parseInt(nextBlock.x);
    var nextBlockY = parseInt(nextBlock.y);

    var xDifference = previousBlockX - nextBlockX;
    var yDifference = previousBlockY - nextBlockY;

    var thereIsXDifference = xDifference < 0 || xDifference > 0;
    var thereIsYDifference = yDifference < 0 || yDifference > 0;

    if (!thereIsXDifference && !thereIsYDifference) {
        return;
    }

    var positiveXDifference = Math.abs(xDifference);
    var positiveYDifference = Math.abs(yDifference);

    var biggestDifference = positiveXDifference;

    if (positiveYDifference > positiveXDifference) {
        biggestDifference = positiveYDifference;
    }

    var blocksToDraw = [];

    for (let index = 0; index <= biggestDifference; index++) {
        var newBlockToDraw = [];

        previousBlock = blocksToDraw[blocksToDraw.length - 1]
            ? blocksToDraw[blocksToDraw.length - 1]
            : previousBlock;
        previousBlockX = parseInt(previousBlock.x);
        previousBlockY = parseInt(previousBlock.y);

        var newBlockX = previousBlockX;

        if (previousBlockX - nextBlockX > 0) {
            newBlockX = previousBlockX - 1;
        }

        if (previousBlockX - nextBlockX < 0) {
            newBlockX = previousBlockX + 1;
        }

        var newBlockY = previousBlockY;

        if (previousBlockY - nextBlockY > 0) {
            newBlockY = previousBlockY - 1;
        }

        if (previousBlockY - nextBlockY < 0) {
            newBlockY = previousBlockY + 1;
        }

        newBlockToDraw = { x: newBlockX, y: newBlockY };
        this.drawBlock(newBlockX, newBlockY);
        blocksToDraw.push(newBlockToDraw);
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
