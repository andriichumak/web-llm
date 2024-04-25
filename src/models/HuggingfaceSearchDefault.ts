import {EntryScored, LanguageModel} from "./LanguageModel";
import {pipeline, dot, FeatureExtractionPipeline} from "@xenova/transformers";

export class HuggingfaceSearchDefault extends LanguageModel<EntryScored[]> {
    private model?: FeatureExtractionPipeline;
    private embeddings?: number[][];

    get isReady() {
        return this.model !== undefined && this.embeddings !== undefined;
    }

    async *loadModel() {
        const loadingStart = performance.now();
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
            quantized: true,
        });
        this.model = extractor;

        yield {
            title: "Model initialized",
            time: Math.round(performance.now() - loadingStart),
        };

        const embeddingStart = performance.now();
        this.embeddings = (await extractor(this.texts, { normalize: true, pooling: 'cls' })).tolist();

        yield {
            title: "Embeddings computed",
            time: Math.round(performance.now() - embeddingStart),
        };
    }

    async execute(input: string) {
        if (!this.model || !this.embeddings) {
            throw new Error("Model not loaded yet");
        }

        const startTime = performance.now();
        const needles = (await this.model([input], { normalize: true, pooling: 'cls' })).tolist();
        const scores = this.embeddings.map(hs => dot(needles[0], hs));
        const output = this.entries.map((entry, i) => ({...entry, score: scores[i]}));

        output.sort((a, b) => b.score - a.score);

        return {
            output,
            time: Math.round(performance.now() - startTime),
        };
    }
}
