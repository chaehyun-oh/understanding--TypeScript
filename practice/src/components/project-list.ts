/// <reference path="base-component.ts" />

namespace App {
	// Project List class
	export class ProjectList
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
}
