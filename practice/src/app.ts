// Project Type
enum ProjectStatus {
	Active,
	Finished,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public desc: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

// Project State Management
type Listener = (items: Project[]) => void;

class ProjectState {
	private listeners: any[] = [];
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn);
	}

	addProject(title: string, desc: string, numOfPeople: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			desc,
			numOfPeople,
			ProjectStatus.Active
		);
		this.projects.push(newProject);
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}
}

const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;
	if (validatableInput.required) {
		isValid =
			isValid && validatableInput.value.toString().trim().length !== 0;
	}
	if (
		validatableInput.minLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.length > validatableInput.minLength;
	}
	if (
		validatableInput.maxLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.length < validatableInput.maxLength;
	}
	if (
		validatableInput.min != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value > validatableInput.min;
	}
	if (
		validatableInput.max != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value < validatableInput.max;
	}
	return isValid;
}

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

// Project List class
class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;
	assignedProject: Project[];

	constructor(private type: "active" | "finished") {
		this.templateElement = document.getElementById(
			"project-list"
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;
		this.assignedProject = [];

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as HTMLElement;
		this.element.id = `${this.type}-projects`;
		projectState.addListener((projects: Project[]) => {
			const relevantProject = projects.filter((prj) => {
				if (this.type == "active") {
					return prj.status === ProjectStatus.Active;
				}
				return prj.status === ProjectStatus.Finished;
			});
			this.assignedProject = relevantProject;
			this.renderProjects();
		});
		this.attach();
		this.renderContent();
	}

	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;
		for (const prjItem of this.assignedProject) {
			const listItem = document.createElement("li");
			listItem.textContent = prjItem.title;
			listEl?.appendChild(listItem);
		}
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + "PROJECTS";
	}

	private attach() {
		this.hostElement.insertAdjacentElement("beforeend", this.element);
	}
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

	private configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const FinishedPrjList = new ProjectList("finished");
