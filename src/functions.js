function objectsIsEqual(obj1, obj2) {
    obj1 = JSON.stringify(obj1);
    obj2 = JSON.stringify(obj2);
    return obj1 === obj2;
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
