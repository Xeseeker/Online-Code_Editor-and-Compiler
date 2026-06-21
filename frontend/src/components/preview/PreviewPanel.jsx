const PreviewPanel = ({ port }) => {
  const url = port ? `http://localhost:${port}` : "";

  return (
    <section className="flex min-h-0 flex-col overflow-hidden border-l border-slate-200 bg-white">
      <div className="flex h-11 items-center justify-between border-b border-slate-200 px-3">
        <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
        <span className="font-mono text-xs text-slate-500">{url || "No port"}</span>
      </div>
      {url ? (
        <iframe title="Project preview" src={url} className="min-h-0 flex-1 bg-white" />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">Start a dev server to preview</div>
      )}
    </section>
  );
};

export default PreviewPanel;
