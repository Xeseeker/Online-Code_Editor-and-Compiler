import { create } from "zustand";
import * as processApi from "../services/processService";
import * as projectApi from "../services/projectService";

export const useProjectStore = create((set, get) => ({
  projects: [],
  activeProject: null,
  ports: null,
  processes: [],
  isLoading: false,
  error: "",
  loadProjects: async () => {
    set({ isLoading: true, error: "" });
    try {
      const projects = await projectApi.listProjects();
      set({ projects, activeProject: get().activeProject || projects[0] || null });
    } catch (error) {
      set({ error: error.response?.data?.error || "Unable to load projects" });
    } finally {
      set({ isLoading: false });
    }
  },
  createProject: async (name) => {
    const project = await projectApi.createProject(name);
    set((state) => ({ projects: [...state.projects, project], activeProject: project, ports: null, processes: [] }));
    return project;
  },
  setActiveProject: (project) => set({ activeProject: project, ports: null, processes: [] }),
  renameProject: async (projectId, name) => {
    const project = await projectApi.renameProject(projectId, name);
    set((state) => ({
      projects: state.projects.map((item) => (item.id === projectId ? project : item)),
      activeProject: state.activeProject?.id === projectId ? project : state.activeProject,
    }));
  },
  deleteProject: async (projectId) => {
    await projectApi.deleteProject(projectId);
    set((state) => {
      const projects = state.projects.filter((project) => project.id !== projectId);
      return {
        projects,
        activeProject: state.activeProject?.id === projectId ? projects[0] || null : state.activeProject,
        ports: null,
        processes: [],
      };
    });
  },
  loadRuntime: async (projectId) => {
    if (!projectId) return;
    const [ports, processes] = await Promise.all([
      processApi.getPorts(projectId),
      processApi.getProcesses(projectId),
    ]);
    set({ ports, processes });
  },
  runNpmInstall: async (projectId, target, packageName) => {
    const process = await processApi.runNpmInstall(projectId, target, packageName);
    set((state) => ({ processes: [process, ...state.processes] }));
  },
  runNpmScript: async (projectId, target, script) => {
    const process = await processApi.runNpmScript(projectId, target, script);
    set((state) => ({ processes: [process, ...state.processes] }));
  },
  stopProcess: async (projectId, processId) => {
    await processApi.stopProcess(projectId, processId);
    set((state) => ({
      processes: state.processes.map((process) =>
        process.id === processId ? { ...process, status: "stopped" } : process,
      ),
    }));
  },
}));
