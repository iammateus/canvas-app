var CanvasDom = function (canvas) {
    this.canvas = canvas;

    var canvasId = "canvas-" + getRandomString();
    var canvasSquare = document.createElement("div");
    canvasSquare.setAttribute("id", canvasId);
    canvasSquare.classList.add("canvas");
    canvasSquare.style.width = canvas.params.size * 10 + 2 + "px";

    var mainContainer = document.getElementById(canvas.params.containerId);
    mainContainer.appendChild(canvasSquare);

    this.canvasContainer = canvasSquare;
    this.blockElements = [];
    this.buildCanvasDom();
    this.update();
};

CanvasDom.prototype.buildCanvasDom = function (event) {
    var blockElements = [];
    var size = this.canvas.params.size;

    for (let rowsCounter = 0; rowsCounter < size; rowsCounter++) {
        var row = [];

        for (let columnCounter = 0; columnCounter < size; columnCounter++) {
            var block = document.createElement("div");
            block.classList.add("block");
            block.setAttribute("x", rowsCounter);
            block.setAttribute("y", columnCounter);

            this.canvasContainer.appendChild(block);
            row.push(block);
        }

        blockElements.push(row);
    }

    this.blockElements = blockElements;
};

CanvasDom.prototype.update = function () {
    var size = this.canvas.params.size;
    var blocksState = this.canvas.blocksState;

    for (let rowsCounter = 0; rowsCounter < size; rowsCounter++) {
        for (let columnCounter = 0; columnCounter < size; columnCounter++) {
            var blockElement = this.blockElements[rowsCounter][columnCounter];
            var blockState = blocksState[rowsCounter][columnCounter];

            if (blockState.backgroundColor) {
                blockElement.style.backgroundColor = blockState.backgroundColor;
            }
        }
    }
};
