function addd(n1: number, n2: number): number {
	return n1 + n2;
}

function addAndHandle(n1: number, n2: number, cd: (num: number) => void) {
	const result = n1 + n2;
	cd(result);
}

function printResult2(num: number): void {
	console.log("Result: " + num);
}

printResult2(addd(5, 12));

let combineValues: (a: number, b: number) => number;

combineValues = addd;
console.log(combineValues(8, 8));

addAndHandle(10, 20, (result) => {
	console.log(result);
});
