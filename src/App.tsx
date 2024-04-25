import * as React from 'react';
import models from "./models";
import {useModelTest} from "./useModelTest";
import {entries, texts} from "./data";
import * as modelsConfig from "./models/models.json";
import {LanguageModel} from "./models/LanguageModel";

declare const SELECTED_MODEL: string;

const Model = models[SELECTED_MODEL];

const navigate = (e: React.ChangeEvent) => {
    const select = e.target as HTMLSelectElement;
    const selected = select.options[select.selectedIndex].value;
    window.location.href = selected === "HuggingfaceSearchDefault" ? "index.html" : `index.${selected}.html`;
};

export const App = () => {
    const modelRef = React.useRef<LanguageModel<any>>(
        new Model(entries, texts)
    );

    const {
        startLoading,
        computing,
        status,
        loadingProgress,
        input,
        setInput,
        output,
    } = useModelTest(modelRef.current);

    return (
        <article className="card">
            <nav className="demo">
                <a href="#" className="brand">FE Model Testing</a>

                <div className="menu">
                    <select onChange={navigate} value={SELECTED_MODEL}>
                        {Object.entries(modelsConfig).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
            </nav>

            <footer>
                {status === null ? <button onClick={startLoading}>Load</button> : null}
                {status === "loading" ? <p>Loading...</p> : null}
                {loadingProgress.map((m, i) => <p key={i}><b>{m.title}</b> in {m.time}ms</p>)}
                {status !== "loaded" ? null : (
                    <div>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={computing}
                        />
                        {computing ? <p>Computing...</p> : (output?.time ? <p>Computed in {output.time}ms</p> : null)}
                        {(() => {
                            if (typeof output?.output === "string") {
                                return <p>{output.output}</p>;
                            }

                            if (Array.isArray(output?.output)) {
                                return <table className="primary">
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Score</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {output.output.map((o, i) => <tr key={i}>
                                        <td>{o.title}</td>
                                        <td>{(o as any).score}</td>
                                    </tr>)}
                                    </tbody>
                                </table>
                            }

                            return null;
                        })()}
                    </div>
                )}
            </footer>
        </article>
    )
}
