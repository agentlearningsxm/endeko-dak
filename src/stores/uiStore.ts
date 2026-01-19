import { create } from 'zustand';

// ============ TYPES ============
export type LibraryTab = 'services' | 'images' | 'text';
export type ModalType = 'settings' | 'imageUpload' | 'serviceEditor' | 'savedQuotes' | null;

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ============ STORE STATE ============
interface UIState {
  // Library panel
  activeLibraryTab: LibraryTab;
  librarySearchQuery: string;

  // Preview panel
  isPreviewExpanded: boolean;
  showMobilePreview: boolean;

  // Modals
  activeModal: ModalType;
  modalData: unknown;

  // Editing state
  editingBlockId: string | null;

  // Drag state
  isDragging: boolean;
  draggedItemType: string | null;

  // Toasts
  toasts: Toast[];

  // Sidebar
  isSidebarCollapsed: boolean;
  isLibraryCollapsed: boolean;
  isPreviewCollapsed: boolean;
  isHeaderVisible: boolean;

  // View state
  currentView: 'login' | 'dashboard' | 'builder' | 'templates';

  // Builder panel
  isBuilderCollapsed: boolean;
}

// ============ STORE ACTIONS ============
interface UIActions {
  // Library
  setActiveLibraryTab: (tab: LibraryTab) => void;
  setLibrarySearchQuery: (query: string) => void;
  toggleLibrary: () => void; // New
  toggleHeader: () => void; // New

  // Preview
  togglePreviewExpanded: () => void;
  setShowMobilePreview: (show: boolean) => void;
  togglePreview: () => void; // New

  // View actions
  setCurrentView: (view: 'login' | 'dashboard' | 'builder' | 'templates') => void;

  // Modals
  openModal: (modal: ModalType, data?: unknown) => void;
  closeModal: () => void;

  // Editing
  setEditingBlockId: (id: string | null) => void;

  // Drag
  setIsDragging: (dragging: boolean, itemType?: string | null) => void;

  // Toasts
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Sidebar
  toggleSidebar: () => void;

  // Builder
  toggleBuilder: () => void;
}

// ============ STORE IMPLEMENTATION ============
export const useUIStore = create<UIState & UIActions>((set) => ({
  // Initial state
  activeLibraryTab: 'services',
  librarySearchQuery: '',
  isLibraryCollapsed: false,
  isPreviewExpanded: false,
  showMobilePreview: false,
  isPreviewCollapsed: false,
  isHeaderVisible: true,
  activeModal: null,
  modalData: null,
  editingBlockId: null,
  isDragging: false,
  draggedItemType: null,
  toasts: [],
  isSidebarCollapsed: false,
  currentView: 'login',

  // Library actions
  setActiveLibraryTab: (tab) => set({ activeLibraryTab: tab }),
  setLibrarySearchQuery: (query) => set({ librarySearchQuery: query }),
  toggleLibrary: () => set((s) => ({ isLibraryCollapsed: !s.isLibraryCollapsed })), // New
  toggleHeader: () => set((s) => ({ isHeaderVisible: !s.isHeaderVisible })), // New

  // Preview actions
  togglePreviewExpanded: () => set((s) => ({ isPreviewExpanded: !s.isPreviewExpanded })),
  setShowMobilePreview: (show) => set({ showMobilePreview: show }),
  togglePreview: () => set((s) => ({ isPreviewCollapsed: !s.isPreviewCollapsed })), // New

  // Modal actions
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Editing actions
  setEditingBlockId: (id) => set({ editingBlockId: id }),

  // Drag actions
  setIsDragging: (dragging, itemType = null) =>
    set({ isDragging: dragging, draggedItemType: itemType }),

  // Toast actions
  addToast: (message, type) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), message, type },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Sidebar actions
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

  // View actions
  setCurrentView: (view) => set({ currentView: view }),

  // Builder actions
  isBuilderCollapsed: false,
  toggleBuilder: () => set((s) => ({ isBuilderCollapsed: !s.isBuilderCollapsed })),
}));

// ============ AUTO-DISMISS TOASTS ============
// This can be used in a component or hook
export function useToastAutoDismiss() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  // Auto-dismiss toasts after 4 seconds
  toasts.forEach((toast) => {
    setTimeout(() => {
      removeToast(toast.id);
    }, 4000);
  });
}
