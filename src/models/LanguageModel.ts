export type LoadingProgressMessage = {
    title: string;
    time: number;
};

export type Entry = {
    id: string;
    title: string;
    description: string;
    type: string;
}

export type EntryScored = Entry & {
    score: number;
};

export type ExecutionResult<T> = {
    output: T;
    time: number;
};

export abstract class LanguageModel<T> {
    abstract isReady: boolean;

    constructor(protected entries: Entry[], protected texts: string[]) {};

    abstract loadModel(): AsyncGenerator<LoadingProgressMessage>;
    abstract execute(input: string): Promise<ExecutionResult<T>>;
}
