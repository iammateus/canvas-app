var CanvasDom = function (canvas) {
    this.canvas = canvas;
    this.mainContainer = document.getElementById(canvas.params.containerId);
    this.canvasContainer = null;
    this.blockElements = [];
    this.renderCanvas();
    this.update();
};

CanvasDom.prototype.renderCanvas = function () {
    this.renderContainer();
    this.renderBlocks();
};

CanvasDom.prototype.renderContainer = function () {
    this.canvasContainer = document.createElement("div");
    this.canvasContainer.setAttribute("id", getParameterByName("id"));
    this.canvasContainer.classList.add("canvas");
    this.canvasContainer.style.width = this.canvas.params.size * 10 + 2 + "px";
    this.mainContainer.appendChild(this.canvasContainer);
};

CanvasDom.prototype.renderBlocks = function () {
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
