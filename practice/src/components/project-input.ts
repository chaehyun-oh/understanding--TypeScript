/// <reference path="base-component.ts" />

namespace App {
	// Project input class
	export class ProjectInput extends Component<
		HTMLDivElement,
		HTMLFormElement
	> {
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

			const titleValidatable: Validatable = {
				value: enteredTitle,
				required: true,
			};
			const descValidatable: Validatable = {
				value: enteredDesc,
				required: true,
				minLength: 5,
			};
			const peopleValidatable: Validatable = {
				value: +enteredPeople,
				required: true,
				min: 2,
				max: 9,
			};
			if (
				!validate(titleValidatable) ||
				!validate(descValidatable) ||
				!validate(peopleValidatable)
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
}
