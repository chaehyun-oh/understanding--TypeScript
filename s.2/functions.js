"use strict";
function addd(n1, n2) {
    return n1 + n2;
}
function addAndHandle(n1, n2, cd) {
    const result = n1 + n2;
    cd(result);
}
function printResult2(num) {
    console.log("Result: " + num);
}
printResult2(addd(5, 12));
let combineValues;
combineValues = addd;
console.log(combineValues(8, 8));
addAndHandle(10, 20, (result) => {
    console.log(result);
});
