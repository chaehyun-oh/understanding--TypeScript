/// <reference path="drag-drop-interfaces.ts" />
/// <reference path="project-model.ts" />
/// <reference path="project-state.ts" />
/// <reference path="validation.ts" />
/// <reference path="autobind-decorator.ts" />

namespace App {
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
			e.dataTransfer!.setData("text/plain", this.project.id);
			e.dataTransfer!.effectAllowed = "move";
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
	class ProjectList
		extends Component<HTMLDivElement, HTMLElement>
		implements DragTarget
	{
		assignedProject: Project[];

		constructor(private type: "active" | "finished") {
			super("project-list", "app", false, `${type}-projects`);

			this.assignedProject = [];

			this.configure();
			this.renderContent();
		}

		@autobind
		dragOverHandler(e: DragEvent): void {
			if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
				e.preventDefault();
				const listEl = this.element.querySelector("ul")!;
				listEl.classList.add("droppable");
			}
		}

		@autobind
		dropHandler(e: DragEvent): void {
			const prjId = e.dataTransfer!.getData("text/plain");
			projectState.moveProject(
				prjId,
				this.type === "active"
					? ProjectStatus.Active
					: ProjectStatus.Finished
			);
		}

		@autobind
		dragLeaveHandler(_: DragEvent): void {
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.remove("droppable");
		}

		configure() {
			this.element.addEventListener("dragover", this.dragOverHandler);
			this.element.addEventListener("dragleave", this.dragLeaveHandler);
			this.element.addEventListener("drop", this.dropHandler);

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
			listEl.innerHTML = "";
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
}
