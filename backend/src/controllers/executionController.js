import {
  executeCodeByLanguage,
  supportedLanguages,
} from "../services/executionService.js";

export const executeCode = async (req, res) => {
  try {
    const { code, language = "javascript" } = req.body;

    if (typeof code !== "string") {
      return res.status(400).json({ error: "Code must be a string" });
    }

    const output = await executeCodeByLanguage({ code, language });
    res.json({ output });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: String(error.message || error),
      supportedLanguages,
    });
  }
};
