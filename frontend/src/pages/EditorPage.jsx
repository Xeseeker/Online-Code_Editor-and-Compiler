import { useEffect, useMemo, useState } from "react";
import CodeEditor from "../components/Editor";
import FileExplorer from "../components/fileExplorer/FileExplorer";
import LanguageSelector from "../components/LanguageSelector";
import { languages } from "../constants/languages";
import Output from "../components/Output";
import PreviewPanel from "../components/preview/PreviewPanel";
import RunButton from "../components/RunButton";
import EditorTabs from "../components/tabs/EditorTabs";
import TerminalPanel from "../components/terminal/TerminalPanel";
import { executeCode } from "../api/compilerApi";
import { useEditorStore } from "../store/editorStore";
import { useFileStore } from "../store/fileStore";
import { useProjectStore } from "../store/projectStore";

const starterCode = {
  javascript: "console.log('Hello JavaScript');",
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java");
  }
}`,
  python: "print('Hello Python')",
  typescript: `const message: string = "Hello TypeScript";
console.log(message);`,
};

const EditorPage = () => {
  const [language, setLanguageState] = useState("javascript");
  const [scratchCode, setScratchCode] = useState(starterCode.javascript);
  const { output, isRunning, setOutput, setIsRunning } = useEditorStore();
  const {
    projects,
    activeProject,
    createProject,
    deleteProject,
    loadProjects,
    renameProject,
    setActiveProject,
  } = useProjectStore();
  const {
    activeFilePath,
    closeTab,
    createFile,
    createFolder,
    deleteEntry,
    dirtyFiles,
    filesByPath,
    loadTree,
    openFile,
    openTabs,
    saveActiveFile,
    setActiveFile,
    tree,
    updateActiveContent,
  } = useFileStore();

  const activeFile = activeFilePath ? filesByPath[activeFilePath] : null;
  const editorLanguage = activeFile?.language || language;
  const editorCode = activeFile?.content ?? scratchCode;

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (activeProject?.id) {
      loadTree(activeProject.id);
    }
  }, [activeProject?.id, loadTree]);

  useEffect(() => {
    if (!activeProject?.id || !activeFilePath || !dirtyFiles[activeFilePath]) return undefined;
    const timeoutId = window.setTimeout(() => saveActiveFile(activeProject.id), 800);
    return () => window.clearTimeout(timeoutId);
  }, [activeProject?.id, activeFilePath, dirtyFiles, filesByPath, saveActiveFile]);

  const activeLanguage = useMemo(
    () => languages.find((item) => item.value === editorLanguage) || languages[0],
    [editorLanguage],
  );

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    setScratchCode(starterCode[nextLanguage]);
    setOutput("");
  };

  const setCode = (value) => {
    if (activeFilePath) {
      updateActiveContent(value);
    } else {
      setScratchCode(value);
    }
  };

  const runCode = async () => {
    try {
      setIsRunning(true);
      setOutput("");
      const result = await executeCode({ code: editorCode, language: editorLanguage });
      setOutput(result.output || "Code ran successfully.");
    } catch (error) {
      setOutput(error.response?.data?.error || "Error running code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCreateProject = async () => {
    const name = window.prompt("Project name", "Fullstack app");
    if (!name) return;
    const project = await createProject(name);
    await loadTree(project.id);
  };

  const handleRenameProject = async () => {
    if (!activeProject) return;
    const name = window.prompt("Project name", activeProject.name);
    if (name) await renameProject(activeProject.id, name);
  };

  const handleDeleteProject = async () => {
    if (!activeProject || !window.confirm(`Delete ${activeProject.name}?`)) return;
    await deleteProject(activeProject.id);
  };

  const handleCreateFile = async () => {
    if (!activeProject) return;
    const path = window.prompt("File path", "frontend/src/App.jsx");
    if (path) await createFile(activeProject.id, path);
  };

  const handleCreateFolder = async () => {
    if (!activeProject) return;
    const path = window.prompt("Folder path", "frontend/src/components");
    if (path) await createFolder(activeProject.id, path);
  };

  const handleDeleteEntry = async (path) => {
    if (!activeProject || !window.confirm(`Delete ${path}?`)) return;
    await deleteEntry(activeProject.id, path);
  };

  return (
    <div className="flex h-screen min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 font-mono text-sm font-bold text-white">
              CE
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-5">{activeProject?.name || "Code Editor"}</h1>
              <p className="truncate text-xs text-slate-500">
                {activeProject ? `Modified ${new Date(activeProject.lastModifiedAt).toLocaleString()}` : activeLanguage.runtime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded border border-slate-300 bg-white px-2 text-sm"
              value={activeProject?.id || ""}
              onChange={(event) => setActiveProject(projects.find((project) => project.id === event.target.value) || null)}
              title="Open project"
            >
              <option value="">Scratch file</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <button type="button" className="h-9 rounded border border-slate-300 px-3 text-sm hover:bg-slate-50" onClick={handleCreateProject}>New</button>
            <button type="button" className="h-9 rounded border border-slate-300 px-3 text-sm hover:bg-slate-50" onClick={handleRenameProject} disabled={!activeProject}>Rename</button>
            <button type="button" className="h-9 rounded border border-slate-300 px-3 text-sm hover:bg-slate-50" onClick={handleDeleteProject} disabled={!activeProject}>Delete</button>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
        <FileExplorer
          tree={tree}
          onOpenFile={(path) => activeProject && openFile(activeProject.id, path)}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onDelete={handleDeleteEntry}
        />

        <section className="flex min-h-0 flex-col overflow-hidden">
          <EditorTabs
            tabs={openTabs}
            activeFilePath={activeFilePath}
            dirtyFiles={dirtyFiles}
            onSelect={setActiveFile}
            onClose={closeTab}
          />
          <div className="flex h-12 items-center justify-between border-b border-slate-800 bg-[#1e1e1e] px-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-sm text-slate-100">{activeFilePath || activeLanguage.extension}</p>
              <p className="text-xs text-slate-400">{dirtyFiles[activeFilePath] ? "Autosaving" : "Saved"}</p>
            </div>
            <div className="flex items-center gap-2">
              {!activeFilePath ? <LanguageSelector language={language} setLanguage={setLanguage} /> : null}
              <RunButton runCode={runCode} isRunning={isRunning} />
            </div>
          </div>
          <CodeEditor code={editorCode} setCode={setCode} language={editorLanguage} />
          {activeProject ? <TerminalPanel projectId={activeProject.id} /> : null}
        </section>

        <div className="grid min-h-0 grid-rows-2">
          <Output output={output} isRunning={isRunning} />
          <PreviewPanel port={5174} />
        </div>
      </main>
    </div>
  );
};

export default EditorPage;

