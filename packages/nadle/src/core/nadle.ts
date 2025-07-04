import Fs from "node:fs/promises";
import process from "node:process";
import { pathToFileURL } from "node:url";

import c from "tinyrainbow";
import { createJiti } from "jiti";

import { Logger } from "./reporting/logger.js";
import { TaskPool } from "./engine/task-pool.js";
import { capitalize } from "./utilities/utils.js";
import { Project } from "./options/project-resolver.js";
import { TaskResolver } from "./options/task-resolver.js";
import { TaskScheduler } from "./engine/task-scheduler.js";
import { taskRegistry } from "./registration/task-registry.js";
import { OptionsResolver } from "./options/options-resolver.js";
import { renderTaskSelection } from "./views/tasks-selection.js";
import { type Reporter, DefaultReporter } from "./reporting/reporter.js";
import { TaskStatus, type RegisteredTask } from "./registration/types.js";
import { fileOptionsRegistry } from "./registration/file-options-registry.js";
import { TaskIdentifierResolver } from "./registration/task-identifier-resolver.js";
import { type NadleCLIOptions, type NadleResolvedOptions } from "./options/types.js";

export class Nadle {
	public static readonly version: string = "0.4.0"; // x-release-please-version

	public readonly logger = new Logger();
	public readonly registry = taskRegistry;

	private readonly reporter: Reporter = new DefaultReporter(this);
	private readonly taskResolver = new TaskResolver(this.logger, this.registry);
	private readonly taskScheduler = new TaskScheduler(this);
	private readonly jiti = createJiti(import.meta.url, {
		interopDefault: true,
		extensions: OptionsResolver.SUPPORT_EXTENSIONS.map((ext) => `.${ext}`)
	});

	#options: NadleResolvedOptions | undefined;

	private static readonly UnnamedGroup = "Unnamed";

	public resolvedTasks: string[] = [];

	public constructor(private readonly cliOptions: NadleCLIOptions) {}

	public async init(): Promise<this> {
		const optionsResolver = new OptionsResolver();
		const configFile = await optionsResolver.resolveConfigFile(this.cliOptions.configFile);
		await this.configureProject(configFile);

		// Add this point, the options and tasks from configuration file are registered
		this.#options = await new OptionsResolver().resolve({
			configFile,
			cliOptions: this.cliOptions,
			taskResolver: this.taskResolver,
			fileOptions: fileOptionsRegistry.get(),
			allTasks: this.registry.getAllByName()
		});

		this.logger.init(this.#options);

		await this.configureWorkspaces();

		await this.reporter.init?.();

		return this;
	}

	public async execute(tasks: string[]) {
		await this.init();

		try {
			this.reporter.onExecutionStart?.();
			this.resolvedTasks = this.taskResolver.resolve(tasks).filter((task) => !this.options.excludedTasks.includes(task));

			if (this.options.showConfig) {
				this.showConfig();
			} else if (this.options.list) {
				this.listTasks();
			} else if (this.options.dryRun) {
				this.dryRunTasks();
			} else if (this.options.cleanCache) {
				await this.cleanCache();
			} else {
				await this.runTasks();
			}
		} catch (error) {
			this.reporter.onExecutionFailed?.(error);
			// eslint-disable-next-line n/no-process-exit,@typescript-eslint/no-explicit-any
			process.exit((error as any).errorCode || 1);
		}

		this.reporter.onExecutionFinish?.();
	}

	public get options(): NadleResolvedOptions {
		if (this.#options === undefined) {
			throw new Error("Nadle options are not initialized. Please call init() before accessing options.");
		}

		return this.#options;
	}

	private async runTasks() {
		let chosenTasks: string[] = this.resolvedTasks;

		if (chosenTasks.length === 0) {
			chosenTasks = await renderTaskSelection(this.registry);

			if (chosenTasks.length === 0) {
				this.printNoTasksSpecified();

				return;
			}
		}

		const scheduler = this.taskScheduler.init(chosenTasks);
		await this.onTasksScheduled(scheduler.scheduledTask);

		await new TaskPool(this, (taskName) => scheduler.getReadyTasks(taskName)).run();
	}

	private dryRunTasks() {
		if (this.resolvedTasks.length === 0) {
			this.printNoTasksSpecified();

			return;
		}

		const orderedTasks = new TaskScheduler(this).init(this.resolvedTasks).getOrderedTasks();

		this.logger.log(c.bold("Execution plan:"));

		for (const task of orderedTasks) {
			this.logger.log(`${c.yellow(">")} Task ${c.bold(TaskIdentifierResolver.getDisplayName(task))}`);
		}
	}

	private listTasks() {
		if (taskRegistry.getAll().length === 0) {
			this.logger.log("No tasks found");

			return;
		}

		const groups = this.computeTaskGroups();

		for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
			const [groupName, tasks] = groups[groupIndex];

			const label = `${capitalize(groupName)} tasks`;
			this.logger.log(c.bold(label));
			this.logger.log(c.bold("-".repeat(label.length)));

			for (const task of tasks) {
				const { description, name: taskName } = task;

				if (description) {
					this.logger.log(c.bold(c.green(TaskIdentifierResolver.getDisplayName(taskName))) + c.yellow(` - ${description}`));
				} else {
					this.logger.log(c.green(TaskIdentifierResolver.getDisplayName(taskName)));
				}
			}

			if (groupIndex < groups.length - 1) {
				this.logger.log("");
			}
		}
	}

	private showConfig() {
		this.logger.log(JSON.stringify(this.options, null, 2));
	}

	private async cleanCache() {
		try {
			this.logger.log(`Cleaning cache at ${this.options.cacheDir}...`);
			await Fs.rm(this.options.cacheDir, { force: true, recursive: true });
		} catch (error) {
			this.logger.error(`Failed to clean cache at ${this.options.cacheDir}:`, error);
			throw error;
		}
	}

	private computeTaskGroups(): [string, (RegisteredTask & { description?: string })[]][] {
		const tasksByGroup: Record<string, (RegisteredTask & { description?: string })[]> = {};

		for (const task of this.registry.getAll()) {
			const { description, group = Nadle.UnnamedGroup } = task.configResolver();

			tasksByGroup[group] ??= [];
			tasksByGroup[group].push({ ...task, description });
		}

		return Object.entries(tasksByGroup)
			.sort(([firstGroupName], [secondGroupName]) => {
				if (firstGroupName === Nadle.UnnamedGroup) {
					return 1;
				}

				if (secondGroupName === Nadle.UnnamedGroup) {
					return -1;
				}

				return firstGroupName.localeCompare(secondGroupName);
			})
			.map(([groupName, tasks]) => {
				return [groupName, tasks.sort((firstTask, secondTask) => firstTask.name.localeCompare(secondTask.name))];
			});
	}

	private printNoTasksSpecified() {
		this.logger.log("No tasks were specified. Please specify one or more tasks to execute, or use the --list option to view available tasks.");
	}

	public async configureProject(configFilePath: string) {
		this.registry.updateWorkspaceId(Project.ROOT_WORKSPACE_ID);

		await this.jiti.import(pathToFileURL(configFilePath).toString());
	}

	public async configureWorkspaces() {
		for (const workspace of this.options.project.workspaces) {
			const configPath = await new OptionsResolver().resolveWorkspaceConfigFile(workspace.absolutePath);

			if (!configPath) {
				continue;
			}

			this.registry.updateWorkspaceId(workspace.id);
			await this.jiti.import(pathToFileURL(configPath).toString());
		}
	}

	public async onTaskStart(task: RegisteredTask, threadId: number) {
		this.registry.onTaskStart(task.name);
		await this.reporter.onTaskStart?.(task, threadId);
	}

	public async onTaskFinish(task: RegisteredTask) {
		this.registry.onTaskFinish(task.name);
		await this.reporter.onTaskFinish?.(task);
	}
	public async onTaskUpToDate(task: RegisteredTask) {
		this.registry.onTaskUpToDate(task.name);
		await this.reporter.onTaskUpToDate?.(task);
	}

	public async onTaskRestoreFromCache(task: RegisteredTask) {
		this.registry.onTaskRestoreFromCache(task.name);
		await this.reporter.onTaskRestoreFromCache?.(task);
	}

	public async onTaskFailed(task: RegisteredTask) {
		this.registry.onTaskFailed(task.name);
		await this.reporter.onTaskFailed?.(task);
	}

	public async onTaskCanceled(task: RegisteredTask) {
		if (task.status === TaskStatus.Running) {
			this.registry.onTaskCanceled(task.name);
			await this.reporter.onTaskCanceled?.(task);
		}
	}

	public async onTasksScheduled(tasks: string[]) {
		this.registry.onTasksScheduled(tasks);
		await this.reporter.onTasksScheduled?.(tasks);
	}
}
