var Canvas = function (params) {
    this.params = params;

    this.blocksState = [];
    this.buildBlocksState();

    this.canvasDom = new CanvasDom(this);
    this.canvasContainer = this.canvasDom.canvasContainer;

    this.addEventListeners();

    this.isMouseDown = false;
    this.color = "black";
    this.lastDrawBlocks = [];

    if (params.lastBlocksState) {
        this.blocksState = params.lastState;
        this.canvasDom.update();
    }
};

Canvas.prototype.buildBlocksState = function () {
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
        this.blocksState.push(newRow);
    }
};

Canvas.prototype.addEventListeners = function () {
    this.canvasContainer.addEventListener(
        "mousedown",
        this.canvasMousedown.bind(this)
    );

    window.addEventListener("mouseup", this.canvasMouseup.bind(this));

    this.canvasContainer.addEventListener(
        "mousemove",
        this.canvasMousemove.bind(this)
    );

    this.canvasContainer.addEventListener(
        "mouseleave",
        this.canvasMouseLeave.bind(this)
    );
};

Canvas.prototype.canvasMousedown = function (event) {
    event.preventDefault();
    this.isMouseDown = true;
    this.draw(event.target);
};

Canvas.prototype.canvasMouseup = function (event) {
    this.isMouseDown = false;
    this.lastDrawBlocks = [];
};

Canvas.prototype.canvasMousemove = function (event) {
    if (this.isMouseDown) {
        this.draw(event.target);
    }
};

Canvas.prototype.canvasMouseLeave = function (event) {
    if (this.isMouseDown) {
        var mouseOffsetX = Math.round(event.offsetY / 10);
        var mouseOffsetY = Math.round(event.offsetX / 10);
        var maxOffset = this.params.size - 1;

        mouseOffsetX = mouseOffsetX <= maxOffset ? mouseOffsetX : maxOffset;
        mouseOffsetY = mouseOffsetY <= maxOffset ? mouseOffsetY : maxOffset;

        mouseOffsetX = mouseOffsetX > -1 ? mouseOffsetX : 0;
        mouseOffsetY = mouseOffsetY > -1 ? mouseOffsetY : 0;

        var elementToDraw = this.canvasDom.blockElements[mouseOffsetX][
            mouseOffsetY
        ];

        this.draw(elementToDraw);
    }
    this.lastDrawBlocks = [];
};

Canvas.prototype.draw = function (element) {
    var targetX = element.getAttribute("x");
    var targetY = element.getAttribute("y");
    var nextBlock = [targetX, targetY];

    var previousBlock = this.lastDrawBlocks[this.lastDrawBlocks.length - 1];

    if (previousBlock && arraysIsEqual(previousBlock, nextBlock)) {
        return;
    }

    if (targetX && targetY) {
        this.fillGap(previousBlock, nextBlock);
        this.drawBlock(targetX, targetY);
    }
};

Canvas.prototype.fillGap = function (previousBlock, nextBlock) {
    if (!previousBlock) {
        return;
    }

    var previousBlockX = parseInt(previousBlock[0]);
    var previousBlockY = parseInt(previousBlock[1]);

    var nextBlockX = parseInt(nextBlock[0]);
    var nextBlockY = parseInt(nextBlock[1]);

    var xDifference = previousBlockX - nextBlockX;
    var yDifference = previousBlockY - nextBlockY;

    var thereIsXDifference = xDifference < 0 || xDifference > 0;
    var thereIsYDifference = yDifference < 0 || yDifference > 0;

    if (!thereIsXDifference && !thereIsYDifference) {
        return;
    }

    var positiveXDifference = xDifference > 0 ? xDifference : xDifference * -1;
    var positiveYDifference = yDifference > 0 ? yDifference : yDifference * -1;

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
        previousBlockX = parseInt(previousBlock[0]);
        previousBlockY = parseInt(previousBlock[1]);

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

        newBlockToDraw = [newBlockX, newBlockY];
        this.drawBlock(newBlockX, newBlockY);
        blocksToDraw.push(newBlockToDraw);
    }
};

Canvas.prototype.drawBlock = function (targetX, targetY) {
    // Blocks state updated
    this.blocksState[targetX][targetY].backgroundColor = this.color || "black";
    this.canvasDom.update();
    this.lastDrawBlocks.push([targetX, targetY]);
};
