## API Report File for "nadle"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { InputLogObject } from 'consola';
import { RimrafAsyncOptions } from 'rimraf';

// @public (undocumented)
export type Awaitable<T> = T | PromiseLike<T>;

// @public (undocumented)
export type CacheKey = string;

// @public (undocumented)
export namespace CacheKey {
    // (undocumented)
    export function compute(input: CacheKeyInput): Promise<CacheKey>;
}

// @public (undocumented)
export interface CacheKeyInput {
    // Warning: (ae-forgotten-export) The symbol "FileFingerprints" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    readonly inputsFingerprints: FileFingerprints;
    // (undocumented)
    readonly taskName: string;
}

// @public (undocumented)
export class CacheManager {
    constructor(projectDir: string);
    // Warning: (ae-forgotten-export) The symbol "CacheQuery" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    hasCache(cacheQuery: CacheQuery): Promise<boolean>;
    // (undocumented)
    readLatestRunMetadata(taskName: string): Promise<RunCacheMetadata | null>;
    // (undocumented)
    readRunMetadata(cacheQuery: CacheQuery): Promise<RunCacheMetadata | null>;
    // (undocumented)
    restoreOutputs(cacheQuery: CacheQuery, projectDir: string): Promise<void>;
    // (undocumented)
    saveOutputs(cacheQuery: CacheQuery, projectDir: string, outputPaths: string[]): Promise<void>;
    // (undocumented)
    writeLatestRunMetadata({ taskName, cacheKey }: CacheQuery): Promise<void>;
    // (undocumented)
    writeRunMetadata(cacheQuery: CacheQuery, metadata: RunCacheMetadata): Promise<void>;
}

// @public (undocumented)
export type Callback<T = unknown, P = {
    context: Context;
}> = (params: P) => T;

// @public (undocumented)
export interface ConfigBuilder {
    // (undocumented)
    config(builder: Callback<TaskConfiguration> | TaskConfiguration): void;
}

// @public (undocumented)
export function configure(options: Partial<NadleConfigFileOptions>): void;

// @public (undocumented)
export interface Context {
    // (undocumented)
    readonly nadle: Nadle;
}

// @public (undocumented)
export class DefaultReporter implements Reporter {
    constructor(nadle: Nadle);
    // (undocumented)
    readonly nadle: Nadle;
    // (undocumented)
    onExecutionFailed(error: any): Promise<void>;
    // (undocumented)
    onExecutionFinish(): Promise<void>;
    // (undocumented)
    onExecutionStart(): Promise<void>;
    // (undocumented)
    onTaskFailed(task: RegisteredTask): Promise<void>;
    // (undocumented)
    onTaskFinish(task: RegisteredTask): Promise<void>;
    // (undocumented)
    onTaskRestoreFromCache(task: RegisteredTask): Promise<void>;
    // (undocumented)
    onTasksScheduled(tasks: string[]): Promise<void>;
    // (undocumented)
    onTaskStart(task: RegisteredTask, threadId: number): Promise<void>;
    // (undocumented)
    onTaskUpToDate(task: RegisteredTask): Promise<void>;
}

// @public (undocumented)
export const DeleteTask: Task<DeleteTaskOptions>;

// @public (undocumented)
export interface DeleteTaskOptions extends RimrafAsyncOptions {
    // (undocumented)
    readonly paths: string | string[];
}

// @public (undocumented)
export const ExecTask: Task<{
    command: string;
    args: string[] | string;
}>;

// @public (undocumented)
export function formatSuggestions(names: string[]): string;

// @public (undocumented)
export namespace Inputs {
    // Warning: (ae-forgotten-export) The symbol "DirDeclaration" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    export function dirs(...patterns: string[]): DirDeclaration;
    // Warning: (ae-forgotten-export) The symbol "FileDeclaration" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    export function files(...patterns: string[]): FileDeclaration;
}

// @public (undocumented)
export class Logger {
    constructor(options: LoggerOptions);
    // (undocumented)
    clearFullScreen(message?: string): void;
    // (undocumented)
    clearScreen(message: string, force?: boolean): void;
    // (undocumented)
    debug(message: InputLogObject | string, ...args: unknown[]): void;
    // (undocumented)
    error(message: any, ...args: unknown[]): void;
    // (undocumented)
    readonly errorStream: NodeJS.WriteStream;
    // (undocumented)
    getColumns(): number;
    // (undocumented)
    info(message: InputLogObject | string, ...args: unknown[]): void;
    // (undocumented)
    log(message: any, ...args: unknown[]): void;
    // (undocumented)
    readonly options: Required<LoggerOptions>;
    // (undocumented)
    readonly outputStream: NodeJS.WriteStream;
    // (undocumented)
    updateLogLevel(logLevel: SupportLogLevel): void;
    // (undocumented)
    warn(message: any, ...args: unknown[]): void;
}

// @public (undocumented)
export interface LoggerOptions {
    // @internal (undocumented)
    readonly isWorkerThread?: boolean;
    // (undocumented)
    readonly logLevel?: SupportLogLevel;
}

// @public (undocumented)
export class Nadle {
    constructor(options: NadleCLIOptions);
    // (undocumented)
    computeTaskGroups(): [string, (RegisteredTask & {
        description?: string;
    })[]][];
    // (undocumented)
    execute(tasks: string[]): Promise<void>;
    // (undocumented)
    listTasks(): void;
    // (undocumented)
    readonly logger: Logger;
    // (undocumented)
    onTaskFailed(task: RegisteredTask): Promise<void>;
    // (undocumented)
    onTaskFinish(task: RegisteredTask): Promise<void>;
    // (undocumented)
    onTaskRestoreFromCache(task: RegisteredTask): Promise<void>;
    // (undocumented)
    onTasksScheduled(tasks: string[]): Promise<void>;
    // (undocumented)
    onTaskStart(task: RegisteredTask, threadId: number): Promise<void>;
    // (undocumented)
    onTaskUpToDate(task: RegisteredTask): Promise<void>;
    // (undocumented)
    get options(): NadleResolvedOptions;
    // (undocumented)
    printNoTasksFound(): void;
    // (undocumented)
    registerTask(): Promise<void>;
    // (undocumented)
    readonly registry: TaskRegistry;
    // (undocumented)
    readonly reporter: Reporter;
    // (undocumented)
    showConfig(): void;
    // (undocumented)
    static readonly version: string;
}

// @public (undocumented)
export interface NadleCLIOptions extends NadleUserBaseOptions {
    // (undocumented)
    readonly cache?: boolean;
    // (undocumented)
    readonly configPath?: string;
    // (undocumented)
    readonly dryRun: boolean;
    // (undocumented)
    readonly list: boolean;
    // (undocumented)
    readonly showConfig: boolean;
    // (undocumented)
    readonly stacktrace: boolean;
}

// @public (undocumented)
export interface NadleConfigFileOptions extends NadleUserBaseOptions {
}

// @public (undocumented)
export interface NadlePackageJson {
    // (undocumented)
    readonly nadle?: {
        root?: true;
    };
}

// @public (undocumented)
export interface NadleResolvedOptions extends Required<Omit<NadleCLIOptions, "maxWorkers" | "minWorkers">> {
    // (undocumented)
    readonly maxWorkers: number;
    // (undocumented)
    readonly minWorkers: number;
    // (undocumented)
    readonly projectDir: string;
}

// @public (undocumented)
export interface NadleUserBaseOptions {
    // @internal (undocumented)
    readonly isWorkerThread?: boolean;
    // (undocumented)
    readonly logLevel?: SupportLogLevel;
    // (undocumented)
    readonly maxWorkers?: number | string;
    // (undocumented)
    readonly minWorkers?: number | string;
    // (undocumented)
    readonly parallel?: boolean;
    // (undocumented)
    readonly showSummary?: boolean;
}

// @public (undocumented)
export namespace Outputs {
    const // (undocumented)
    files: typeof Inputs.files;
    const // (undocumented)
    dirs: typeof Inputs.dirs;
}

// @public (undocumented)
export const PnpmTask: Task<{
    args: string[];
}>;

// @public (undocumented)
export interface RegisteredTask extends Task {
    // (undocumented)
    configResolver: Callback<TaskConfiguration>;
    // (undocumented)
    name: string;
    // (undocumented)
    optionsResolver: Resolver | undefined;
    // (undocumented)
    result: {
        duration: number | null;
        startTime: number | null;
    };
    // (undocumented)
    status: TaskStatus;
}

// @public (undocumented)
export interface Reporter {
    // (undocumented)
    onExecutionFailed?: (error: any) => Awaitable<void>;
    // (undocumented)
    onExecutionFinish?: () => Awaitable<void>;
    // (undocumented)
    onExecutionStart?: () => Awaitable<void>;
    // (undocumented)
    onTaskFailed?: (task: RegisteredTask) => Awaitable<void>;
    // (undocumented)
    onTaskFinish?: (task: RegisteredTask) => Awaitable<void>;
    // (undocumented)
    onTaskRestoreFromCache?: (task: RegisteredTask) => Awaitable<void>;
    // (undocumented)
    onTasksScheduled?: (tasks: string[]) => Awaitable<void>;
    // (undocumented)
    onTaskStart?: (task: RegisteredTask, threadId: number) => Awaitable<void>;
    // (undocumented)
    onTaskUpToDate?: (task: RegisteredTask) => Awaitable<void>;
}

// @public (undocumented)
export type Resolver<T = unknown> = T | Callback<T>;

// @public (undocumented)
export function resolveTask(input: string, allTasks: string[]): {
    result: string;
} | {
    result: undefined;
    suggestions: string[];
};

// @public
export interface RunCacheMetadata {
    cacheKey: string;
    inputsFingerprints: FileFingerprints;
    outputsFingerprint: string;
    taskName: string;
    timestamp: string;
    version: 1;
}

// @public (undocumented)
export namespace RunCacheMetadata {
    // (undocumented)
    export function create(params: {
        taskName: string;
        cacheKey: CacheKey;
        outputsFingerprint: string;
        inputsFingerprints: FileFingerprints;
    }): RunCacheMetadata;
}

// @public (undocumented)
export type SupportLogLevel = (typeof SupportLogLevels)[number];

// @public (undocumented)
export const SupportLogLevels: ["error", "log", "info", "debug"];

// @public (undocumented)
export interface Task<Options = unknown> {
    // (undocumented)
    run: Callback<Awaitable<void>, {
        options: Options;
        context: Context & {
            workingDir: string;
        };
    }>;
}

// @public (undocumented)
export interface TaskCacheMetadata {
    readonly latest: string;
}

// @public (undocumented)
export namespace TaskCacheMetadata {
    // (undocumented)
    export function create(latestCacheKey: string): TaskCacheMetadata;
}

// @public (undocumented)
export interface TaskConfiguration {
    dependsOn?: string[];
    description?: string;
    env?: TaskEnv;
    group?: string;
    // Warning: (ae-forgotten-export) The symbol "Declaration" needs to be exported by the entry point index.d.ts
    inputs?: Declaration[];
    outputs?: Declaration[];
    workingDir?: string;
}

// @public (undocumented)
export type TaskEnv = Record<string, string | number | boolean>;

// @public (undocumented)
export type TaskFn = Callback<Awaitable<void>, {
    context: Context & {
        workingDir: string;
    };
}>;

// @public (undocumented)
export class TaskRegistry {
    // (undocumented)
    findByName(taskName: string): RegisteredTask | undefined;
    // (undocumented)
    getAll(): RegisteredTask[];
    // (undocumented)
    getByName(taskName: string): RegisteredTask;
    // (undocumented)
    has(name: string): boolean;
    // (undocumented)
    onTaskFailed(name: string): void;
    // (undocumented)
    onTaskFinish(name: string): void;
    // (undocumented)
    onTaskRestoreFromCache(name: string): void;
    // (undocumented)
    onTasksScheduled(names: string[]): void;
    // (undocumented)
    onTaskStart(name: string): void;
    // (undocumented)
    onTaskUpToDate(name: string): void;
    // (undocumented)
    register(name: string, task: RegisteredTask): void;
}

// @public (undocumented)
export const taskRegistry: TaskRegistry;

// @public (undocumented)
export const tasks: {
    register: typeof registerTask;
};

// @public (undocumented)
export enum TaskStatus {
    // (undocumented)
    Failed = "failed",
    // (undocumented)
    Finished = "finished",
    // (undocumented)
    FromCache = "from-cache",
    // (undocumented)
    Registered = "registered",
    // (undocumented)
    Running = "running",
    // (undocumented)
    Scheduled = "scheduled",
    // (undocumented)
    UpToDate = "up-to-date"
}

// Warnings were encountered during analysis:
//
// lib/index.d.ts:241:5 - (ae-forgotten-export) The symbol "registerTask" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```
