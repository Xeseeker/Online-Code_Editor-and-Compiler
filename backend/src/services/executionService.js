import { runJavaScript } from "../../../execution-engine/runners/javascriptRunner.js";
import { runJava } from "../../../execution-engine/runners/javaRunner.js";
import { runPython } from "../../../execution-engine/runners/pythonRunner.js";
import { runTypeScript } from "../../../execution-engine/runners/typescriptRunner.js";

const runners = {
  javascript: runJavaScript,
  java: runJava,
  python: runPython,
  typescript: runTypeScript,
};

export const supportedLanguages = Object.keys(runners);

export const executeCodeByLanguage = async ({ code, language }) => {
  const normalizedLanguage = language?.toLowerCase();
  const runner = runners[normalizedLanguage];

  if (!runner) {
    const error = new Error(`Unsupported language: ${language}`);
    error.statusCode = 400;
    throw error;
  }

  return runner(code);
};
