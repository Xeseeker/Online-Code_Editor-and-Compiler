const Output = ({ output, isRunning }) => {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Output</h2>
          <p className="text-xs text-slate-500">Execution result</p>
        </div>
        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
          {isRunning ? "Running" : "Ready"}
        </span>
      </div>

      <pre className="min-h-[220px] flex-1 overflow-auto bg-[#0f172a] p-4 font-mono text-sm leading-6 text-emerald-300">
        {isRunning ? "Running code..." : output || "Output will appear here."}
      </pre>
    </section>
  );
};

export default Output;
