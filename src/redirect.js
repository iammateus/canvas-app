function checkUrlIdIfEmptyRedirect() {
    if (!getParameterByName("id")) {
        location = location + "?id=canvas-" + getRandomString();
    }
}
