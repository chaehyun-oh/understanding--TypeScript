// const person: {
// 	name: string;
// 	age: number;
// }

// const person: {
// 	name: string;
// 	age: number;
// 	hobbies: string[];
// 	role: [number, string];
// } = {
// 	name: "Max",
// 	age: 30,
// 	hobbies: ["Sports", "Cooking"],
// 	role: [2, "author"],
// };

// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;

// >> Enum makes it easier
enum Role {
	ADMIN = "ADMIN",
	READ_ONLY = 100,
	AUTHOR = 200,
}

const person = {
	name: "Max",
	age: 30,
	hobbies: ["Sports", "Cooking"],
	role: Role.ADMIN,
};

let favoriteActivities: any[];
favoriteActivities = ["Sprots"];

console.log(person.name);

for (const hobby of person.hobbies) {
	console.log(hobby.toUpperCase());
	// console.log(hobby.map()); >> ERROR
}

if (person.role === Role.AUTHOR) {
	console.log("is author");
}
