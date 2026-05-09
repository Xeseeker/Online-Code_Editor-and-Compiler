const RunButton = ({ runCode, isRunning }) => {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      disabled={isRunning}
      onClick={runCode}
      type="button"
    >
      <span aria-hidden="true">{isRunning ? "..." : "▶"}</span>
      {isRunning ? "Running" : "Run"}
    </button>
  );
};

export default RunButton;
