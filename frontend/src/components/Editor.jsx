import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, language }) => {
  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-b-md border-x border-b border-slate-800 bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
        }}
        onChange={(value) => setCode(value || "")}
      />
    </div>
  );
};

export default CodeEditor;
