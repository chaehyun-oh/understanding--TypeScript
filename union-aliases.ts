type Combinable = number | string;
type ConversionDesc = "as-number" | "as-text";

function combine(
	input1: Combinable,
	input2: Combinable,
	resultConversion: ConversionDesc
) {
	let result;
	if (
		(typeof input1 === "number" && typeof input2 === "number") ||
		resultConversion === "as-number"
	) {
		result = +input1 + +input2;
	} else {
		result = input1.toString() + input2.toString();
	}

	// if (resultConversion === "as-number") {
	// 	return +result;
	// } else {
	// 	return result.toString();
	// }
	return result;
}

const combinedAge = combine(30, 26, "as-number");
console.log(combinedAge);

const combinedStringAges = combine("30", "26", "as-number");
console.log(combinedStringAges);

const combinedName = combine("Max", "Anna", "as-text");
console.log(combinedName);
