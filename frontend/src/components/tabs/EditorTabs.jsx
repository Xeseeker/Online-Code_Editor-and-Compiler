const EditorTabs = ({ tabs, activeFilePath, dirtyFiles, onSelect, onClose }) => {
  if (!tabs.length) {
    return <div className="flex h-11 items-center border-b border-slate-800 bg-[#252526] px-3 text-sm text-slate-400">No file open</div>;
  }

  return (
    <div className="flex h-11 items-end overflow-x-auto border-b border-slate-800 bg-[#252526]">
      {tabs.map((path) => {
        const isActive = path === activeFilePath;
        return (
          <div key={path} className={`flex h-10 min-w-36 max-w-56 items-center gap-2 border-r border-slate-800 px-3 text-sm ${isActive ? "bg-[#1e1e1e] text-slate-100" : "bg-[#2d2d2d] text-slate-300"}`}>
            <button type="button" className="min-w-0 flex-1 truncate text-left" onClick={() => onSelect(path)} title={path}>
              {path.split("/").at(-1)}{dirtyFiles[path] ? " *" : ""}
            </button>
            <button type="button" className="h-6 w-6 rounded text-slate-400 hover:bg-slate-700 hover:text-white" onClick={() => onClose(path)} title="Close tab">�</button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
