import Component from "./base-component";
import * as Validation from "../util/validation.js";
import { autobind } from "../decorators/autobind-decorator.js";
import { projectState } from "../state/project-state.js";

// Project input class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputEl: HTMLInputElement;
	descInputEl: HTMLInputElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		super("project-input", "app", true, "user-input");
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
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputEl.value;
		const enteredDesc = this.descInputEl.value;
		const enteredPeople = this.peopleInputEl.value;

		const titleValidatable: Validation.Validatable = {
			value: enteredTitle,
			required: true,
		};
		const descValidatable: Validation.Validatable = {
			value: enteredDesc,
			required: true,
			minLength: 5,
		};
		const peopleValidatable: Validation.Validatable = {
			value: +enteredPeople,
			required: true,
			min: 2,
			max: 9,
		};
		if (
			!Validation.validate(titleValidatable) ||
			!Validation.validate(descValidatable) ||
			!Validation.validate(peopleValidatable)
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
			projectState.addProject(title, desc, people);
			this.clearInputs();
		}
	}

	configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	renderContent(): void {}
}
