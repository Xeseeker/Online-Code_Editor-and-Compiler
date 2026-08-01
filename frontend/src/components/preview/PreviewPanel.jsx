import { useState } from "react";

const PreviewPanel = ({ ports, processes, onInstall, onRefresh, onRunBuild, onRunDev, onStop }) => {
  const [target, setTarget] = useState("frontend");
  const [previewTarget, setPreviewTarget] = useState("frontend");
  const [packageName, setPackageName] = useState("");
  const port = previewTarget === "frontend" ? ports?.frontendPort : ports?.backendPort;
  const url = port ? `http://localhost:${port}` : "";

  return (
    <section className="flex min-h-0 flex-col overflow-hidden border-l border-slate-200 bg-white">
      <div className="flex h-11 items-center justify-between border-b border-slate-200 px-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
          <p className="font-mono text-xs text-slate-500">{url || "No port allocated"}</p>
        </div>
        <button type="button" className="h-8 rounded border border-slate-300 px-2 text-xs hover:bg-slate-50" onClick={onRefresh}>Refresh</button>
      </div>

      <div className="grid gap-2 border-b border-slate-200 p-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <select className="h-8 rounded border border-slate-300 px-2" value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="frontend">frontend</option>
            <option value="backend">backend</option>
          </select>
          <select className="h-8 rounded border border-slate-300 px-2" value={previewTarget} onChange={(event) => setPreviewTarget(event.target.value)}>
            <option value="frontend">preview frontend</option>
            <option value="backend">preview backend</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="h-8 rounded bg-blue-600 px-2 font-medium text-white hover:bg-blue-700" onClick={() => onRunDev(target)}>Run dev</button>
          <button type="button" className="h-8 rounded border border-slate-300 px-2 font-medium hover:bg-slate-50" onClick={() => onRunBuild(target)}>Build</button>
        </div>
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded border border-slate-300 px-2"
            placeholder="package name"
            value={packageName}
            onChange={(event) => setPackageName(event.target.value)}
          />
          <button
            type="button"
            className="h-8 rounded border border-slate-300 px-2 font-medium hover:bg-slate-50"
            onClick={() => onInstall(target, packageName)}
          >
            Install
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto border-b border-slate-200">
        {url ? (
          <iframe title="Project preview" src={url} className="h-full min-h-52 w-full bg-white" />
        ) : (
          <div className="flex h-full min-h-52 items-center justify-center text-sm text-slate-500">Start a dev server to preview</div>
        )}
      </div>

      <div className="max-h-48 overflow-auto p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase text-slate-500">Processes</h3>
          <span className="text-xs text-slate-400">{processes.length}</span>
        </div>
        <div className="space-y-2">
          {processes.length ? processes.map((process) => (
            <div key={process.id} className="rounded border border-slate-200 p-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{process.name}</p>
                  <p className="font-mono text-slate-500">{process.status}{process.port ? ` :${process.port}` : ""}</p>
                </div>
                {process.status === "running" ? (
                  <button type="button" className="h-7 rounded border border-slate-300 px-2 hover:bg-slate-50" onClick={() => onStop(process.id)}>Stop</button>
                ) : null}
              </div>
              {process.logs ? <pre className="mt-2 max-h-20 overflow-auto whitespace-pre-wrap rounded bg-slate-950 p-2 font-mono text-[11px] text-slate-200">{process.logs}</pre> : null}
            </div>
          )) : <p className="text-xs text-slate-500">No project processes yet.</p>}
        </div>
      </div>
    </section>
  );
};

export default PreviewPanel;
