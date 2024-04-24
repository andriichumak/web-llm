import {LanguageModel} from "./LanguageModel";
import {pipeline, TextGenerationOutput, TextGenerationPipeline} from "@xenova/transformers";

export class HuggingfaceTypeaheadLlama2 extends LanguageModel<string> {
    private model?: TextGenerationPipeline;

    get isReady() {
        return this.model !== undefined;
    }

    async *loadModel() {
        const loadingStart = performance.now();
        this.model = await pipeline('text-generation', 'Xenova/llama2.c-stories15M');

        yield {
            title: "Model initialized",
            time: Math.round(performance.now() - loadingStart),
        };
    }

    async execute(input: string) {
        if (!this.model) {
            throw new Error("Model not loaded yet");
        }

        const startTime = performance.now();
        const results = (await this.model(input, {
            temperature: 2,
            max_new_tokens: 50,
            repetition_penalty: 1.5,
        })) as TextGenerationOutput;

        return {
            output: results[0].generated_text as string,
            time: Math.round(performance.now() - startTime),
        };
    }
}
