import { runJavaScript } from "../../../execution-engine/runners/javascriptRunner.js";
import { runPython } from "../../../execution-engine/runners/pythonRunner.js";

const runners = {
  javascript: runJavaScript,
  python: runPython,
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
