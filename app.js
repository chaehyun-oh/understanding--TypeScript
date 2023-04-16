"use strict";
class Department {
    constructor(n) {
        this.employees = [];
        this.name = n;
    }
    describe() {
        console.log("Department: " + this.name);
    }
    addEmployee(employee) {
        this.employees.push(employee);
    }
    printEmployeeInfo() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}
const accounting = new Department("Accounting");
// console.log(accounting);
accounting.addEmployee("Max");
accounting.addEmployee("Anna");
// accounting.employess[2] = "Jane"; //ERROR
accounting.describe();
accounting.printEmployeeInfo();
// const accountingCopy = { name: "dummy", describe: accounting.describe };
// accountingCopy.describe();
