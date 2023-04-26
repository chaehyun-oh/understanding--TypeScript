// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
	const originMethod = descriptor.value;
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originMethod.bind(this);
			return boundFn;
		},
	};
	return adjDescriptor;
}

// Project input class
class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputEl: HTMLInputElement;
	descInputEl: HTMLInputElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById(
			"project-input"
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = "user-input";

		this.titleInputEl = this.element.querySelector(
			"#title"
		) as HTMLInputElement;
		this.descInputEl = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.peopleInputEl = this.element.querySelector(
			"#people"
		) as HTMLInputElement;

		this.configure();
		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputEl.value;
		const enteredDesc = this.descInputEl.value;
		const enteredPeople = this.peopleInputEl.value;

		if (
			enteredTitle.trim().length === 0 ||
			enteredDesc.trim().length === 0 ||
			enteredPeople.trim().length === 0
		) {
			alert("Invalid input, please try again");
			return;
		} else {
			return [enteredTitle, enteredDesc, +enteredPeople];
		}
	}

	private clearInputs() {
		this.titleInputEl.value = "";
		this.descInputEl.value = "";
		this.peopleInputEl.value = "";
	}

	@autobind
	private submitHandler(e: Event) {
		e.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			console.log(title, desc, people);
			this.clearInputs();
		}
	}

	private configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}

const prjInput = new ProjectInput();