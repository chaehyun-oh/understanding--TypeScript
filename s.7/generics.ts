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

function merge<T extends object, U extends object>(objA: T, objB: U) {
	return Object.assign(objA, objB);
}

// console.log(merge({ name: "Max" }, { age: 30 }));

const mergedObj = merge({ name: "Max", hobbies: ["Sports"] }, { age: 30 });
console.log(mergedObj);

interface Lengthy {
	length: number;
}

function countAndDesc<T extends Lengthy>(element: T): [T, string] {
	let description = "Got no value.";
	if (element.length === 1) {
		description = "Got 1 element.";
	} else if (element.length > 1) {
		description = "Got " + element.length + " elements.";
	}
	return [element, description];
}

console.log(countAndDesc("Hi there"));

function extractAndConvert<T extends object, U extends keyof T>(
	obj: T,
	key: U
) {
	return obj[key];
}

console.log(extractAndConvert({ name: "Max" }, "name"));

class DataStorage<T extends string | number | boolean> {
	private data: T[] = [];

	addItem(item: T) {
		this.data.push(item);
	}

	removeItem(item: T) {
		if (this.data.indexOf(item) === -1) {
			return;
		}

		this.data.splice(this.data.indexOf(item), 1);
	}

	getItems() {
		return [...this.data];
	}
}

const textStorage = new DataStorage<string>();

textStorage.addItem("Max");
textStorage.addItem("Manu");
textStorage.removeItem("Max");
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();
// objStorage.addItem({ name: "Max" });
// objStorage.addItem({ name: "Manu" });

interface CourseGoal {
	title: string;
	description: string;
	completeUntil: Date;
}

function createCourseGoal(
	title: string,
	description: string,
	date: Date
): CourseGoal {
	let courseGoal: Partial<CourseGoal> = {};
	courseGoal.title = title;
	courseGoal.description = description;
	courseGoal.completeUntil = date;
	return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ["Max", "Anna"];
