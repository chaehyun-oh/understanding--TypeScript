"use strict";
class Person {
    constructor(n) {
        this.age = 30;
        this.name = n;
    }
    greet(phrase) {
        console.log(phrase + "" + this.name);
    }
}
let user1;
user1 = new Person("Max");
user1.greet("Hi there I am ");
