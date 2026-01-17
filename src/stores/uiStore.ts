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
}

// ============ STORE ACTIONS ============
interface UIActions {
  // Library
  setActiveLibraryTab: (tab: LibraryTab) => void;
  setLibrarySearchQuery: (query: string) => void;

  // Preview
  togglePreviewExpanded: () => void;
  setShowMobilePreview: (show: boolean) => void;

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
}

// ============ STORE IMPLEMENTATION ============
export const useUIStore = create<UIState & UIActions>((set) => ({
  // Initial state
  activeLibraryTab: 'services',
  librarySearchQuery: '',
  isPreviewExpanded: false,
  showMobilePreview: false,
  activeModal: null,
  modalData: null,
  editingBlockId: null,
  isDragging: false,
  draggedItemType: null,
  toasts: [],
  isSidebarCollapsed: false,

  // Library actions
  setActiveLibraryTab: (tab) => set({ activeLibraryTab: tab }),
  setLibrarySearchQuery: (query) => set({ librarySearchQuery: query }),

  // Preview actions
  togglePreviewExpanded: () => set((s) => ({ isPreviewExpanded: !s.isPreviewExpanded })),
  setShowMobilePreview: (show) => set({ showMobilePreview: show }),

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
