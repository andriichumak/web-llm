import * as React from "react";
import {ExecutionResult, LanguageModel} from "./models/LanguageModel";

export const useModelTest = <T>(modelInstance: LanguageModel<T>) => {
    const modelRef = React.useRef<LanguageModel<T>>();
    const [loading, setLoading] = React.useState(true);
    const [input, setInput] = React.useState("");
    const [debouncedInput, setDebouncedInput] = React.useState("");
    const [loadingProgress, setLoadingProgress] = React.useState<any[]>([]);
    const [output, setOutput] = React.useState<ExecutionResult<T>>();
    const [computing, setComputing] = React.useState(false);

    React.useEffect(() => {
        modelRef.current = modelInstance;
        const loadModel = async () => {
            for await (const message of modelRef.current.loadModel()) {
                setLoadingProgress(prev => [...prev, message]);
            }

            setLoading(false);
        };
        loadModel();
    }, []);

    React.useEffect(() => {
        const timeout = setTimeout(() => setDebouncedInput(input), 500);
        return () => clearTimeout(timeout);
    }, [input]);

    React.useEffect(() => {
        if (debouncedInput === "") {
            setOutput(null);
            return;
        }
        setComputing(true);
        modelRef.current.execute(debouncedInput).then(output => {
            setOutput(output);
            setComputing(false);
        });
    }, [debouncedInput]);

    return {
        loading,
        loadingProgress,
        input,
        setInput,
        computing,
        output,
    };
};
