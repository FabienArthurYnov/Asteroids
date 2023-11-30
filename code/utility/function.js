function write(object, key = "") { // Store a object (convert to a json) with a key
    const jsonData = JSON.stringify(object)
    localStorage.setItem(key, jsonData)
}

// get the json object by the key
function read(key = "") {
    const jsonData = localStorage.getItem(key);

    // Convertir la chaîne JSON en objet JSON
    var data = JSON.parse(jsonData);
    return data
}

export { write, read }  