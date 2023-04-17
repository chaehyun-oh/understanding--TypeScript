"use strict";
class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        // private readonly id: string;
        // private name: string;
        this.employees = [];
        // this.name = n;
    }
    static createEmployee(name) {
        return { name: name };
    }
    // {
    // 	// console.log("Department: " + this.name);
    // 	// console.log(`Department (${this.id}): ${this.name}`);
    // }
    addEmployee(employee) {
        this.employees.push(employee);
    }
    printEmployeeInfo() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}
Department.fiscalYear = 2020;
class ITDepartment extends Department {
    constructor(id, admins) {
        super(id, "IT");
        this.admins = admins;
    }
    describe() {
        console.log("IT Department - ID: " + this.id);
    }
}
class AccountingDepartment extends Department {
    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        throw new Error("No report found.");
    }
    set mostRecentReport(value) {
        if (!value) {
            throw new Error("Please pass in a valid value.");
        }
        this.addReport(value);
    }
    constructor(id, reports) {
        super(id, "Accounting");
        this.reports = reports;
        this.lastReport = reports[0];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        // only run once
        this.instance = new AccountingDepartment("d1", []);
        return this.instance;
    }
    describe() {
        console.log("Accounting Department - ID:" + this.id);
    }
    addEmployee(name) {
        if (name === "Max") {
            return;
        }
        this.employees.push(name);
    }
    addReport(text) {
        this.reports.push(text);
        this.lastReport = text;
    }
    printReports() {
        console.log(this.reports);
    }
}
const employee1 = Department.createEmployee("Max");
console.log(employee1, Department.fiscalYear);
const accounting = AccountingDepartment.getInstance();
// const accounting = new Department("d1", "Accounting");
// const accounting = new AccountingDepartment("d1", []);
// console.log(accounting.mostRecentReport);
accounting.mostRecentReport = "Year End report";
const it = new ITDepartment("d2", ["Max"]);
// console.log(accounting);
console.log(it);
accounting.addEmployee("Max");
accounting.addEmployee("Anna");
// accounting.employess[2] = "Jane"; //ERROR
// accounting.describe();
// accounting.printEmployeeInfo();
it.describe();
accounting.describe();
// accounting.addReport("Something went wrong....");
// accounting.printReports();
// console.log(accounting.mostRecentReport);
// const accountingCopy = { name: "dummy", describe: accounting.describe };
// accountingCopy.describe();
