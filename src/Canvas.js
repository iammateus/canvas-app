var Canvas = function(params)
{  
    this.params = params;
    this.canvasContainer = document.getElementById(params.canvasId);
    this.blocksState = this.buildBlocksState();
    this.canvasDom = new CanvasDom(this);
    this.addEventListeners();
    this.isMouseDown = false;
    this.lastDrawBlocks = [];
};

Canvas.prototype.buildBlocksState = function()
{
    var canvasSize = this.params.size;
    var state = [];
    
    for (let rowsCounter = 0; rowsCounter < canvasSize; rowsCounter++) {
        
        var row = [];
        
        for (let columnCounter = 0; columnCounter < canvasSize; columnCounter++) {
            
            row.push({});
            
        }
        
        state.push(row);
        
    }
    
    return state;
}

Canvas.prototype.addEventListeners = function()
{
    this.canvasContainer.addEventListener('mousedown', this.canvasMousedown.bind(this));

    window.addEventListener('mouseup', this.canvasMouseup.bind(this));

    this.canvasContainer.addEventListener('mousemove', this.canvasMousemove.bind(this));
}

Canvas.prototype.canvasMousedown = function(event)
{
    event.preventDefault();
    this.isMouseDown = true;
    this.draw(event.target);
}

Canvas.prototype.canvasMouseup = function(event)
{
    this.isMouseDown = false;
    console.log("this.lastDrawBlocks",this.lastDrawBlocks);
    this.lastDrawBlocks = [];
}

Canvas.prototype.canvasMousemove = function(event)
{
    if(this.isMouseDown){
        this.draw(event.target);
    }
}

Canvas.prototype.draw = function(element)
{
    var targetX = element.getAttribute('x')
    var targetY = element.getAttribute('y');
    var nextBlock = [targetX,targetY];

    var previousBlock = this.lastDrawBlocks[this.lastDrawBlocks.length -1];

    if(previousBlock && arraysIsEqual(previousBlock, nextBlock)){
        return;
    }

    if(targetX && targetY){
        this.fillGap(previousBlock, nextBlock);
        this.drawBlock(targetX, targetY);
    }
}

Canvas.prototype.fillGap = function(previousBlock, nextBlock)
{
    if(!previousBlock){
        return;
    }

    var previousBlockX = parseInt(previousBlock[0]);
    var previousBlockY = parseInt(previousBlock[1]);

    var nextBlockX = parseInt(nextBlock[0]);
    var nextBlockY = parseInt(nextBlock[1]);

    var xDifference = previousBlockX - nextBlockX;
    var yDifference = previousBlockY - nextBlockY;

    var thereIsXDifference = xDifference < -1 || xDifference > 1;
    var thereIsYDifference = yDifference < -1 || yDifference > 1;
    
    if(!thereIsXDifference && !thereIsYDifference){
        return;
    }

    var positiveXDifference = xDifference > 0  ? xDifference : xDifference * -1;
    var positiveYDifference = yDifference > 0  ? yDifference : yDifference * -1;

    var biggestDifference = positiveXDifference;

    if(positiveYDifference > positiveXDifference){
        biggestDifference = positiveYDifference;
    }

    var blocksToDraw = [];

    for (let index = 0; index <= biggestDifference; index++) {

        var newBlockToDraw = [];

        previousBlock = blocksToDraw[blocksToDraw.length - 1] ? blocksToDraw[blocksToDraw.length - 1] : previousBlock;
        previousBlockX = parseInt(previousBlock[0]);
        previousBlockY = parseInt(previousBlock[1]);

        var blockX = previousBlockX;

        if(previousBlockX - nextBlockX > 1){
            blockX = previousBlockX - 1;
        }

        if(previousBlockX - nextBlockX < -1){
            blockX = previousBlockX + 1;
        }

        var blockY = previousBlockY;

        if(previousBlockY - nextBlockY > 1){
            blockY = previousBlockY - 1;
        }

        if(previousBlockY - nextBlockY < -1){
            blockY = previousBlockY + 1;
        }

        newBlockToDraw = [blockX, blockY];

        blocksToDraw.push(newBlockToDraw);
    }

    for (let index = 0; index < blocksToDraw.length; index++) {

        var targetX = blocksToDraw[index][0];
        var targetY = blocksToDraw[index][1];

        if(targetX > -1 && targetY > -1){
            this.drawBlock(targetX, targetY);
        }
    }

}

Canvas.prototype.drawBlock = function (targetX, targetY) {
    this.blocksState[targetX][targetY].backgroundColor = 'black';
    this.canvasDom.update();
    this.lastDrawBlocks.push([targetX,targetY]);
}
