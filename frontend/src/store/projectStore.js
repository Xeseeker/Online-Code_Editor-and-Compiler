import { create } from "zustand";
import * as projectApi from "../services/projectService";

export const useProjectStore = create((set, get) => ({
  projects: [],
  activeProject: null,
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
    set((state) => ({ projects: [...state.projects, project], activeProject: project }));
    return project;
  },
  setActiveProject: (project) => set({ activeProject: project }),
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
      return { projects, activeProject: state.activeProject?.id === projectId ? projects[0] || null : state.activeProject };
    });
  },
}));
