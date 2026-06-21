import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { io } from "socket.io-client";
import "@xterm/xterm/css/xterm.css";

const socket = io("http://localhost:5000", { autoConnect: false });

const TerminalPanel = ({ projectId }) => {
  const containerRef = useRef(null);
  const terminalIdRef = useRef("");
  const [terminalId, setTerminalId] = useState("");

  useEffect(() => {
    if (!projectId || !containerRef.current) return undefined;

    socket.connect();
    const terminal = new Terminal({ cursorBlink: true, fontSize: 13, rows: 10, theme: { background: "#0f172a" } });
    terminal.open(containerRef.current);
    terminal.writeln("Opening project shell...");

    const handleReady = ({ terminalId: nextTerminalId }) => {
      terminalIdRef.current = nextTerminalId;
      setTerminalId(nextTerminalId);
    };
    const handleData = ({ data }) => terminal.write(data);
    const disposable = terminal.onData((data) => {
      if (terminalIdRef.current) {
        socket.emit("terminal:input", { terminalId: terminalIdRef.current, data });
      }
    });

    socket.emit("terminal:create", { projectId, cols: 100, rows: 10 });
    socket.on("terminal:ready", handleReady);
    socket.on("terminal:data", handleData);

    return () => {
      if (terminalIdRef.current) socket.emit("terminal:close", { terminalId: terminalIdRef.current });
      socket.off("terminal:ready", handleReady);
      socket.off("terminal:data", handleData);
      disposable.dispose();
      terminal.dispose();
      terminalIdRef.current = "";
      setTerminalId("");
    };
  }, [projectId]);

  return (
    <section className="flex min-h-0 flex-col border-t border-slate-800 bg-slate-950">
      <div className="flex h-9 items-center justify-between border-b border-slate-800 px-3 text-xs text-slate-300">
        <span>Terminal</span>
        <button type="button" className="rounded px-2 py-1 hover:bg-slate-800" onClick={() => terminalId && socket.emit("terminal:clear", { terminalId })}>Clear</button>
      </div>
      <div ref={containerRef} className="min-h-40 flex-1 overflow-hidden p-2" />
    </section>
  );
};

export default TerminalPanel;
