const languages = [
  {
    label: "JavaScript",
    value: "javascript",
    extension: "main.js",
    runtime: "Node 20",
  },
  {
    label: "Java",
    value: "java",
    extension: "Main.java",
    runtime: "OpenJDK 21",
  },
  {
    label: "Python",
    value: "python",
    extension: "main.py",
    runtime: "Python 3.12",
  },
  {
    label: "TypeScript",
    value: "typescript",
    extension: "main.ts",
    runtime: "Deno 2",
  },
];

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <select
      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
    >
      {languages.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label} - {item.runtime}
        </option>
      ))}
    </select>
  );
};

export { languages };
export default LanguageSelector;
