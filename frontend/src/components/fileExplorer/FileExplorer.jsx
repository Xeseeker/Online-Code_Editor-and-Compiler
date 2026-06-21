const FileNode = ({ node, level = 0, onOpenFile, onDelete }) => {
  const isFolder = node.type === "folder";

  return (
    <div>
      <div
        className="group flex h-8 items-center justify-between gap-2 rounded px-2 text-sm text-slate-700 hover:bg-slate-100"
        style={{ paddingLeft: `${8 + level * 14}px` }}
      >
        <button
          type="button"
          className="min-w-0 flex-1 truncate text-left"
          onClick={() => !isFolder && onOpenFile(node.path)}
          title={node.path || node.name}
        >
          <span className="mr-2 inline-block w-4 text-center text-xs text-slate-400">{isFolder ? "?" : ""}</span>
          {node.name}
        </button>
        {node.path ? (
          <button
            type="button"
            className="hidden h-6 w-6 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 group-hover:block"
            onClick={() => onDelete(node.path)}
            title="Delete"
          >
            �
          </button>
        ) : null}
      </div>
      {isFolder && node.children?.map((child) => (
        <FileNode key={child.path} node={child} level={level + 1} onOpenFile={onOpenFile} onDelete={onDelete} />
      ))}
    </div>
  );
};

const FileExplorer = ({ tree, onOpenFile, onCreateFile, onCreateFolder, onDelete }) => {
  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-11 items-center justify-between border-b border-slate-200 px-3">
        <h2 className="text-sm font-semibold text-slate-900">Explorer</h2>
        <div className="flex items-center gap-1">
          <button type="button" className="h-7 w-7 rounded hover:bg-slate-100" onClick={onCreateFile} title="New file">+</button>
          <button type="button" className="h-7 w-7 rounded hover:bg-slate-100" onClick={onCreateFolder} title="New folder">?</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        {tree ? <FileNode node={tree} onOpenFile={onOpenFile} onDelete={onDelete} /> : <p className="px-2 py-3 text-sm text-slate-500">No project open</p>}
      </div>
    </aside>
  );
};

export default FileExplorer;
