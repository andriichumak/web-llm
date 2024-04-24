import * as metricsData from "./metrics.json";
import * as attributesData from "./attributes.json";
import * as factsData from "./facts.json";

const mapper = (m: any) => {
    return {
        id: m.id,
        title: m.attributes.title,
        description: m.attributes.description,
        type: m.type,
    };
};

const metrics = metricsData.map(mapper);
const attributes = attributesData.map(mapper);
const facts = factsData.map(mapper);

export const entries = metrics.concat(attributes).concat(facts);
export const texts = entries.map(e => e.title);
