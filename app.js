"use strict";
// const names: Array<string> = [];
// // names[0].split(' ');
// const promise: Promise<number> = new Promise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve(10);
// 	}, 2000);
// });
// promise.then((data) => {
// 	// data.split(' ') // Error
// });
function merge(objA, objB) {
    return Object.assign(objA, objB);
}
// console.log(merge({ name: "Max" }, { age: 30 }));
const mergedObj = merge({ name: "Max", hobbies: ["Sports"] }, { age: 30 });
console.log(mergedObj);
function countAndDesc(element) {
    let description = "Got no value.";
    if (element.length === 1) {
        description = "Got 1 element.";
    }
    else if (element.length > 1) {
        description = "Got " + element.length + " elements.";
    }
    return [element, description];
}
console.log(countAndDesc("Hi there"));
function extractAndConvert(obj, key) {
    return obj[key];
}
console.log(extractAndConvert({ name: "Max" }, "name"));
