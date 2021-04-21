function arraysIsEqual(array1, array2) {
    array1 = JSON.stringify(array1);
    array2 = JSON.stringify(array2);
    return array1 === array2;
}

function getRandomString() {
    return Math.random().toString(36).slice(-5);
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function handleUrl() {
    if (!getParameterByName("id")) {
        location = location + "?id=canvas-" + getRandomString();
    }
}
