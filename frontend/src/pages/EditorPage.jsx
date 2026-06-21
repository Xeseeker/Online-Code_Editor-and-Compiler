import { useState } from "react";
import CodeEditor from "../components/Editor";
import LanguageSelector, { languages } from "../components/LanguageSelector";
import Output from "../components/Output";
import RunButton from "../components/RunButton";
import { executeCode } from "../api/compilerApi";

const starterCode = {
  javascript: "console.log('Hello JavaScript');",
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java");
  }
}`,
  python: "print('Hello Python')",
  typescript: `const message: string = "Hello TypeScript";
console.log(message);`,
};

const EditorPage = () => {
  const [language, setLanguageState] = useState("javascript");
  const [code, setCode] = useState(starterCode.javascript);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    setCode(starterCode[nextLanguage]);
    setOutput("");
  };

  const runCode = async () => {
    try {
      setIsRunning(true);
      setOutput("");
      const result = await executeCode({ code, language });

      setOutput(result.output || "Code ran successfully.");
    } catch (error) {
      setOutput(error.response?.data?.error || "Error running code");
    } finally {
      setIsRunning(false);
    }
  };

  const activeLanguage = languages.find((item) => item.value === language);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 font-mono text-sm font-bold text-white">
              CE
            </div>
            <div>
              <h1 className="text-base font-semibold leading-5">Code Editor</h1>
              <p className="text-xs text-slate-500">{activeLanguage.runtime}</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-600 md:flex">
            {languages.map((item) => (
              <span key={item.value} className="rounded-md bg-slate-100 px-2 py-1">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_minmax(0,1fr)_380px]">
        <aside className="rounded-md border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Language</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              {activeLanguage.label}
            </h2>
          </div>

          <LanguageSelector language={language} setLanguage={setLanguage} />

          <div className="mt-5 divide-y divide-slate-200 rounded-md border border-slate-200 text-sm">
            <div className="p-3">
              <p className="text-xs font-medium text-slate-500">File</p>
              <p className="mt-1 font-mono text-slate-800">{activeLanguage.extension}</p>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-slate-500">Runtime</p>
              <p className="mt-1 font-mono text-slate-800">{activeLanguage.runtime}</p>
            </div>
          </div>
        </aside>

        <section className="flex min-h-[520px] flex-col overflow-hidden">
          <div className="flex h-12 items-center justify-between rounded-t-md border border-slate-800 bg-[#252526] px-3">
            <div className="flex h-full items-end">
              <div className="flex h-10 items-center rounded-t-md bg-[#1e1e1e] px-4 font-mono text-sm text-slate-100">
                {activeLanguage.extension}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-slate-400 sm:inline">
                {activeLanguage.runtime}
              </span>
              <RunButton runCode={runCode} isRunning={isRunning} />
            </div>
          </div>

          <CodeEditor code={code} setCode={setCode} language={language} />
        </section>

        <Output output={output} isRunning={isRunning} />
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{activeLanguage.label}</span>
          <span>{isRunning ? "Running" : "Ready"}</span>
        </div>
      </footer>
    </div>
  );
};

export default EditorPage;


