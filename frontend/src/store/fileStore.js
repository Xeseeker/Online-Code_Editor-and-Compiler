import { create } from "zustand";
import * as fileApi from "../services/fileService";

const extensionToLanguage = (path = "") => {
  if (path.endsWith(".py")) return "python";
  if (path.endsWith(".java")) return "java";
  if (path.endsWith(".ts") || path.endsWith(".tsx")) return "typescript";
  return "javascript";
};

export const useFileStore = create((set, get) => ({
  tree: null,
  openTabs: [],
  activeFilePath: "",
  filesByPath: {},
  dirtyFiles: {},
  isSaving: false,
  loadTree: async (projectId) => {
    if (!projectId) return;
    const tree = await fileApi.getFileTree(projectId);
    set({ tree });
  },
  openFile: async (projectId, path) => {
    const existing = get().filesByPath[path];
    const file = existing || (await fileApi.readFile(projectId, path));
    set((state) => ({
      filesByPath: { ...state.filesByPath, [path]: { ...file, language: extensionToLanguage(path) } },
      openTabs: state.openTabs.includes(path) ? state.openTabs : [...state.openTabs, path],
      activeFilePath: path,
    }));
  },
  setActiveFile: (path) => set({ activeFilePath: path }),
  closeTab: (path) =>
    set((state) => {
      const openTabs = state.openTabs.filter((tab) => tab !== path);
      return { openTabs, activeFilePath: state.activeFilePath === path ? openTabs.at(-1) || "" : state.activeFilePath };
    }),
  updateActiveContent: (content) =>
    set((state) => ({
      filesByPath: {
        ...state.filesByPath,
        [state.activeFilePath]: { ...state.filesByPath[state.activeFilePath], content },
      },
      dirtyFiles: { ...state.dirtyFiles, [state.activeFilePath]: true },
    })),
  saveActiveFile: async (projectId) => {
    const { activeFilePath, filesByPath } = get();
    if (!projectId || !activeFilePath) return;
    set({ isSaving: true });
    await fileApi.saveFile(projectId, activeFilePath, filesByPath[activeFilePath]?.content || "");
    set((state) => ({ isSaving: false, dirtyFiles: { ...state.dirtyFiles, [activeFilePath]: false } }));
  },
  createFile: async (projectId, path) => {
    await fileApi.createFile(projectId, path);
    await get().loadTree(projectId);
    await get().openFile(projectId, path);
  },
  createFolder: async (projectId, path) => {
    await fileApi.createFolder(projectId, path);
    await get().loadTree(projectId);
  },
  deleteEntry: async (projectId, path) => {
    await fileApi.deleteEntry(projectId, path);
    await get().loadTree(projectId);
    get().closeTab(path);
  },
}));
