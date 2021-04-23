var App = function () {};

App.prototype.init = function () {
    this.handleUrl();

    var canvasId = getParameterByName("id");
    window.canvas = {};
    window.canvas[canvasId] = new Canvas({
        containerId: "canvas-container",
        canvasId: canvasId,
        size: 50,
    });
};

App.prototype.handleUrl = function () {
    if (!getParameterByName("id")) {
        location = location + "?id=canvas-" + getRandomString();
    }
};
