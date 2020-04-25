function arraysIsEqual(array1, array2){
    array1 = JSON.stringify(array1);
    array2 = JSON.stringify(array2);
    return array1 === array2;
}