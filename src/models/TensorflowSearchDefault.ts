import {EntryScored, LanguageModel} from "./LanguageModel";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';

export class TensorflowSearchDefault extends LanguageModel<EntryScored[]> {
    private model?: use.UniversalSentenceEncoder;
    private embeddings?: tf.Tensor2D;

    get isReady() {
        return this.model !== undefined && this.embeddings !== undefined;
    }

    async *loadModel() {
        const loadingStart = performance.now();
        const extractor = await use.load();
        this.model = extractor;

        yield {
            title: "Model initialized",
            time: Math.round(performance.now() - loadingStart),
        };

        const embeddingStart = performance.now();
        this.embeddings = (await extractor.embed(this.texts));

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
        const needle = await this.model.embed([input]);
        const scores = await tf.matMul(needle, this.embeddings, false, true).data();
        const output = this.entries.map((entry, i) => ({...entry, score: scores[i]}));

        output.sort((a, b) => b.score - a.score);

        return {
            output,
            time: Math.round(performance.now() - startTime),
        };
    }
}
