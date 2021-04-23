var CanvasDom = function (canvas) {
    this.canvas = canvas;
    this.parentElement = document.getElementById(canvas.params.containerId);
    this.mainElement = null;
    this.blockMatriz = [];
    this.renderCanvas();
    this.update();
    this.addEventListeners();
};

CanvasDom.prototype.renderCanvas = function () {
    this.renderContainer();
    this.renderBlocks();
};

CanvasDom.prototype.renderContainer = function () {
    this.mainElement = document.createElement("div");
    this.mainElement.setAttribute("id", this.canvas.params.canvasId);
    this.mainElement.classList.add("canvas");

    var bordersWidth = 2;
    var blockWidth = 10;
    var width = this.canvas.params.size * blockWidth + bordersWidth;
    this.mainElement.style.width = width + "px";

    this.parentElement.appendChild(this.mainElement);
};

CanvasDom.prototype.renderBlocks = function () {
    var blockMatriz = [];
    var size = this.canvas.params.size;

    for (let rowsCounter = 0; rowsCounter < size; rowsCounter++) {
        var row = [];

        for (let columnCounter = 0; columnCounter < size; columnCounter++) {
            var block = document.createElement("div");
            block.classList.add("block");
            block.setAttribute("x", rowsCounter);
            block.setAttribute("y", columnCounter);

            this.mainElement.appendChild(block);
            row.push(block);
        }

        blockMatriz.push(row);
    }

    this.blockMatriz = blockMatriz;
};

CanvasDom.prototype.addEventListeners = function () {
    this.mainElement.addEventListener(
        "mousedown",
        this.canvas.onMouseDown.bind(this.canvas)
    );

    window.addEventListener("mouseup", this.canvas.onMouseUp.bind(this.canvas));

    this.mainElement.addEventListener(
        "mousemove",
        this.canvas.onMouseMove.bind(this.canvas)
    );

    this.mainElement.addEventListener(
        "mouseleave",
        this.canvas.onMouseLeave.bind(this.canvas)
    );
};

CanvasDom.prototype.update = function () {
    var size = this.canvas.params.size;
    var blockMatrizState = this.canvas.blockMatrizState;

    for (let rowsCounter = 0; rowsCounter < size; rowsCounter++) {
        for (let columnCounter = 0; columnCounter < size; columnCounter++) {
            var blockElement = this.blockMatriz[rowsCounter][columnCounter];
            var blockState = blockMatrizState[rowsCounter][columnCounter];

            if (blockState.backgroundColor) {
                blockElement.style.backgroundColor = blockState.backgroundColor;
            }
        }
    }
};
