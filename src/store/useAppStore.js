/**
 * PRN Global App Store — Zustand
 * Manages: projects, current design, user auth state, UI state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
let _pageCounter = 0;
export const createBlankPage = () => ({
  id: `page-${Date.now()}-${++_pageCounter}`,
  name: 'Page',
  canvasJSON: null,   // null = empty canvas
  thumbnail: null,
});

// ─────────────────────────────────────────────
// Project factory
// ─────────────────────────────────────────────
let _projectCounter = 0;
export const createProject = (overrides = {}) => {
  const id = `proj-${Date.now()}-${++_projectCounter}`;
  const page = createBlankPage();
  return {
    id,
    title: 'Untitled Design',
    preset: 'custom',
    width: 800,
    height: 600,
    background: '#ffffff',
    pages: [page],
    currentPageIndex: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    thumbnail: null,
    ...overrides,
  };
};

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────
const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Auth (local-only for now) ──────────────────────────
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // ── Projects ──────────────────────────────────────────
      projects: [],

      createNewProject: (overrides = {}) => {
        const proj = createProject(overrides);
        set((s) => ({ projects: [proj, ...s.projects] }));
        return proj;
      },

      updateProject: (id, changes) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...changes, updatedAt: Date.now() } : p
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      duplicateProject: (id) => {
        const proj = get().projects.find((p) => p.id === id);
        if (!proj) return;
        const copy = {
          ...proj,
          id: `proj-${Date.now()}`,
          title: `${proj.title} (copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({
          projects: [copy, ...s.projects],
        }));
        return copy;
      },

      getProject: (id) => get().projects.find((p) => p.id === id),

      // ── Current editor state ──────────────────────────────
      currentProjectId: null,
      setCurrentProjectId: (id) => set({ currentProjectId: id }),

      // ── Brand Kit ─────────────────────────────────────────
      brandKit: {
        colors: ['#5b50d6', '#e84393', '#f59e0b', '#10b981', '#0ea5e9', '#111827'],
        fonts:  ['Inter', 'Plus Jakarta Sans', 'Georgia'],
        logos:  [],
      },
      updateBrandKit: (changes) =>
        set((s) => ({ brandKit: { ...s.brandKit, ...changes } })),

      // ── UI flags ──────────────────────────────────────────
      ui: {
        sidebarTab: 'elements',   // elements | templates | uploads | brand | text | pages
        showGrid: false,
        showGuides: true,
        zoom: 1,
        proModalOpen: false,
        newDesignModalOpen: false,
      },
      setUI: (changes) =>
        set((s) => ({ ui: { ...s.ui, ...changes } })),
    }),
    {
      name: 'prn-app-storage',
      partialize: (state) => ({
        user: state.user,
        projects: state.projects,
        brandKit: state.brandKit,
      }),
    }
  )
);

export default useAppStore;
