import {HuggingfaceSearchDefault} from "./HuggingfaceSearchDefault";
import {HuggingfaceSearchSnowflake} from "./HuggingfaceSearchSnowflake";
import {TensorflowSearchDefault} from "./TensorflowSearchDefault";
import {HuggingfaceTypeaheadDefault} from "./HuggingfaceTypeaheadDefault";
import {HuggingfaceTypeaheadLlama2} from "./HuggingfaceTypeaheadLlama2";

export default {
    "HuggingfaceSearchDefault": HuggingfaceSearchDefault,
    "HuggingfaceSearchSnowflake": HuggingfaceSearchSnowflake,
    "TensorflowSearchDefault": TensorflowSearchDefault,
    "HuggingfaceTypeaheadDefault": HuggingfaceTypeaheadDefault,
    "HuggingfaceTypeaheadLlama2": HuggingfaceTypeaheadLlama2,
} as unknown as {[key: string]: any};
