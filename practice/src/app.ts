// Drag & Drop Interfaces

interface Draggable {
	dragStartHandler(e: DragEvent): void;
	dragEndHandler(e: DragEvent): void;
}

interface DragTarget {
	dragOverHandler(e: DragEvent): void;
	dropHandler(e: DragEvent): void;
	dragLeaveHandler(e: DragEvent): void;
}

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
type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];
	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
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

// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string
	) {
		this.templateElement = document.getElementById(
			templateId
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElementId)! as T;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as U;
		if (newElementId) {
			this.element.id = newElementId;
		}

		this.attach(insertAtStart);
	}

	private attach(insertAtBeginning: boolean) {
		this.hostElement.insertAdjacentElement(
			insertAtBeginning ? "afterbegin" : "beforeend",
			this.element
		);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}

//  ProjectItem Class

class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable
{
	private project: Project;

	get persons() {
		if (this.project.people === 1) {
			return "1 person";
		} else {
			return `${this.project.people} persons`;
		}
	}

	constructor(hostId: string, project: Project) {
		super("single-project", hostId, false, project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}

	@autobind
	dragStartHandler(e: DragEvent): void {
		console.log(e);
	}

	dragEndHandler(e: DragEvent): void {}

	configure() {
		this.element.addEventListener("dragstart", this.dragStartHandler);
		this.element.addEventListener("dragend", this.dragEndHandler);
	}
	renderContent() {
		this.element.querySelector("h2")!.textContent = this.project.title;
		this.element.querySelector("h3")!.textContent =
			this.persons + "assigned";
		this.element.querySelector("p")!.textContent = this.project.desc;
	}
}

// Project List class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
	assignedProject: Project[];

	constructor(private type: "active" | "finished") {
		super("project-list", "app", false, `${type}-projects`);

		this.assignedProject = [];

		this.configure();
		this.renderContent();
	}

	configure() {
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
	}

	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + "PROJECTS";
	}

	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;
		for (const prjItem of this.assignedProject) {
			new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
		}
	}
}

// Project input class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const FinishedPrjList = new ProjectList("finished");
