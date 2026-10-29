/**
 * PRN Global App Store — Zustand with API Integration
 * Connects to backend API instead of localStorage
 */
import { create } from 'zustand';
import api from '../services/api';

// ─────────────────────────────────────────────
// Default design presets
// ─────────────────────────────────────────────
export const CANVAS_PRESETS = [
  { id: 'custom',          label: 'Custom Size',         width: 800,  height: 600  },
  { id: 'ig-post',         label: 'Instagram Post',      width: 1080, height: 1080 },
  { id: 'ig-story',        label: 'Instagram Story',     width: 1080, height: 1920 },
  { id: 'fb-post',         label: 'Facebook Post',       width: 1200, height: 630  },
  { id: 'yt-thumbnail',    label: 'YouTube Thumbnail',   width: 1280, height: 720  },
  { id: 'presentation',    label: 'Presentation (16:9)', width: 1920, height: 1080 },
  { id: 'a4-landscape',    label: 'A4 Landscape',        width: 1123, height: 794  },
  { id: 'a4-portrait',     label: 'A4 Portrait',         width: 794,  height: 1123 },
  { id: 'twitter-post',    label: 'Twitter/X Post',      width: 1200, height: 675  },
  { id: 'linkedin-post',   label: 'LinkedIn Post',       width: 1200, height: 627  },
  { id: 'business-card',   label: 'Business Card',       width: 1050, height: 600  },
  { id: 'poster',          label: 'Poster (A3)',         width: 1587, height: 2245 },
];

// ─────────────────────────────────────────────
// Blank page factory
// ─────────────────────────────────────────────
export const createBlankPage = () => ({
  name: 'Page 1',
  canvasJSON: '{}',
  thumbnail: null,
  width: 800,
  height: 600,
  background: '#ffffff',
  order: 0
});

// ─────────────────────────────────────────────
// Store with API Integration
// ─────────────────────────────────────────────
const useAppStore = create((set, get) => ({
  // ── Auth State ──────────────────────────────────────────
  user: null,
  isLoading: false,
  error: null,

  // ── Auth Actions ────────────────────────────────────────
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register(userData);
      set({ user: response.user, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(credentials);
      set({ user: response.user, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.logout();
      set({ user: null, projects: [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  loadCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await api.getCurrentUser();
      set({ user: response.user, isLoading: false });
      return response;
    } catch (error) {
      set({ user: null, isLoading: false });
      console.log('Not logged in:', error.message);
    }
  },

  setUser: (user) => set({ user }),

  // ── Projects State ──────────────────────────────────────
  projects: [],
  currentProject: null,

  // ── Projects Actions ────────────────────────────────────
  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await api.getProjects();
      set({ projects: response.projects || [], isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createNewProject: async (overrides = {}) => {
    set({ isLoading: true });
    try {
      const projectData = {
        title: overrides.title || 'Untitled Design',
        width: overrides.width || 800,
        height: overrides.height || 600,
        background: overrides.background || '#ffffff',
        pages: overrides.pages || [createBlankPage()],
        ...overrides
      };
      
      const response = await api.createProject(projectData);
      const newProject = response.project;
      
      set(state => ({
        projects: [newProject, ...state.projects],
        currentProject: newProject,
        isLoading: false
      }));
      
      return newProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProject: async (id, changes) => {
    set({ isLoading: true });
    try {
      const response = await api.updateProject(id, changes);
      const updatedProject = response.project;
      
      set(state => ({
        projects: state.projects.map(p => 
          p._id === id ? updatedProject : p
        ),
        currentProject: state.currentProject?._id === id ? updatedProject : state.currentProject,
        isLoading: false
      }));
      
      return updatedProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    try {
      await api.deleteProject(id);
      
      set(state => ({
        projects: state.projects.filter(p => p._id !== id),
        currentProject: state.currentProject?._id === id ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  duplicateProject: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.duplicateProject(id);
      const duplicatedProject = response.project;
      
      set(state => ({
        projects: [duplicatedProject, ...state.projects],
        isLoading: false
      }));
      
      return duplicatedProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  getProject: (id) => {
    return get().projects.find(p => p._id === id);
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  // ── Templates ───────────────────────────────────────────
  templates: [],

  loadTemplates: async () => {
    set({ isLoading: true });
    try {
      const response = await api.getTemplates();
      set({ templates: response.templates || [], isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── Brand Kit ───────────────────────────────────────────
  brandKit: {
    colors: ['#5b50d6', '#e84393', '#f59e0b', '#10b981', '#0ea5e9', '#111827'],
    fonts:  ['Inter', 'Plus Jakarta Sans', 'Georgia'],
    logos:  [],
  },

  loadBrandKit: async () => {
    try {
      const response = await api.getBrandKit();
      set({ brandKit: response.brandKit });
      return response;
    } catch (error) {
      console.log('Error loading brand kit:', error.message);
    }
  },

  updateBrandKit: async (changes) => {
    try {
      const response = await api.updateBrandKit(changes);
      set({ brandKit: response.brandKit });
      return response;
    } catch (error) {
      console.log('Error updating brand kit:', error.message);
      throw error;
    }
  },

  // ── UI State ────────────────────────────────────────────
  ui: {
    sidebarTab: 'elements',
    showGrid: false,
    showGuides: true,
    zoom: 1,
    proModalOpen: false,
    newDesignModalOpen: false,
  },

  setUI: (changes) => set(state => ({ 
    ui: { ...state.ui, ...changes } 
  })),

  // ── File Upload ─────────────────────────────────────────
  uploadImage: async (file) => {
    set({ isLoading: true });
    try {
      const response = await api.uploadImage(file);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── Clear Error ─────────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useAppStore;