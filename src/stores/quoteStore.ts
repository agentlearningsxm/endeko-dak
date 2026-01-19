import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Block,
  BlockType,
  Quote,
  ClientDetails,
  QuoteTemplate,
  ServiceBlockData,
  SavedImage,
  SavedTemplate,
} from '../types/blocks';
import { createBlock } from '../types/blocks';
import { DEFAULT_SERVICES, generateQuoteNumber } from '../lib/constants';

import {
  saveProfileData,
  loadProfileData,
  requestRootFolder,
  isWorkspaceConfigured,
  listAvailableProfiles,
  deleteProfileFolder
} from '../utils/fileSync';

// ============ DISK SYNC HELPER ============
async function syncToDisk(profileName: string, data: any) {
  if (!profileName) return;
  try {
    await saveProfileData(profileName, data);
  } catch (error) {
    console.error(`Failed to sync profile ${profileName}:`, error);
  }
}

// ============ HELPER FUNCTIONS ============
function createEmptyClientDetails(): ClientDetails {
  return {
    name: '',
    companyName: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    phone: '',
  };
}

function createEmptyQuote(): Quote {
  return {
    id: crypto.randomUUID(),
    number: generateQuoteNumber(),
    clientDetails: createEmptyClientDetails(),
    blocks: [],
    template: 'modern',
    templateBackgroundImage: null,
    status: 'draft',
    validityDays: 30,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ============ STORE STATE ============
interface QuoteState {
  // Current working quote
  currentQuote: Quote;

  // Saved quotes list
  savedQuotes: Quote[];

  // Service library (user's custom services)
  serviceLibrary: ServiceBlockData[];

  // Image library (uploaded images)
  imageLibrary: SavedImage[];

  // Template library (custom saved templates)
  savedTemplates: SavedTemplate[];

  // Persistence status
  isLocalSyncActive: boolean;
  lastSyncedAt: string | null;

  // Profile management
  activeProfile: string;
  profiles: string[];
}

// ============ STORE ACTIONS ============
interface QuoteActions {
  // Block operations
  addBlock: (type: BlockType, data?: Partial<Block['data']>, index?: number) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, data: Partial<Block['data']>) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  duplicateBlock: (id: string) => void;

  // Client details
  updateClientDetails: (details: Partial<ClientDetails>) => void;

  // Quote management
  setTemplate: (template: QuoteTemplate) => void;
  setTemplateBackgroundImage: (url: string | null) => void;
  setNotes: (notes: string) => void;
  saveCurrentQuote: () => void;
  loadQuote: (id: string) => void;
  createNewQuote: () => void;
  deleteQuote: (id: string) => void;
  addSavedQuote: (quote: Quote) => void;

  // Library management
  addToServiceLibrary: (service: ServiceBlockData) => void;
  updateServiceInLibrary: (index: number, service: ServiceBlockData) => void;
  removeFromServiceLibrary: (index: number) => void;

  // Image library
  addImage: (src: string, name: string) => void;
  removeImage: (id: string) => void;

  // Template library
  addSavedTemplate: (name: string, imageUrl: string) => void;
  deleteSavedTemplate: (id: string) => void;

  // Utilities
  clearCurrentQuote: () => void;
  updatePricing: (pricing: Partial<{ isManualPricing: boolean; manualSubtotal: number; manualVat: number }>) => void;
  getQuoteTotals: () => { subtotal: number; vat: number; total: number };
  loadFromDisk: () => Promise<void>;
  setupWorkspace: () => Promise<void>;
  checkWorkspaceStatus: () => Promise<void>;

  // Profile actions
  createProfile: (name: string) => Promise<void>;
  switchProfile: (name: string) => Promise<void>;
  deleteProfile: (name: string) => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

// ============ STORE IMPLEMENTATION ============
export const useQuoteStore = create<QuoteState & QuoteActions>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuote: createEmptyQuote(),
      savedQuotes: [],
      serviceLibrary: DEFAULT_SERVICES,
      imageLibrary: [],
      savedTemplates: [],
      isLocalSyncActive: false,
      lastSyncedAt: null,
      activeProfile: 'default',
      profiles: ['default'],

      // ============ BLOCK OPERATIONS ============
      addBlock: (type, data = {}, index) =>
        set((state) => {
          const newBlock = createBlock(type, data);
          const blocks = [...state.currentQuote.blocks];

          if (index !== undefined && index >= 0) {
            blocks.splice(index, 0, newBlock);
          } else {
            blocks.push(newBlock);
          }

          return {
            currentQuote: {
              ...state.currentQuote,
              blocks,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      removeBlock: (id) =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            blocks: state.currentQuote.blocks.filter((b) => b.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      updateBlock: (id, data) =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            blocks: state.currentQuote.blocks.map((b) =>
              b.id === id ? { ...b, data: { ...b.data, ...data } } as Block : b
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      reorderBlocks: (oldIndex, newIndex) =>
        set((state) => {
          const blocks = [...state.currentQuote.blocks];
          const [moved] = blocks.splice(oldIndex, 1);
          blocks.splice(newIndex, 0, moved);

          return {
            currentQuote: {
              ...state.currentQuote,
              blocks,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      duplicateBlock: (id) =>
        set((state) => {
          const blockIndex = state.currentQuote.blocks.findIndex((b) => b.id === id);
          if (blockIndex === -1) return state;

          const originalBlock = state.currentQuote.blocks[blockIndex];
          const duplicatedBlock = createBlock(originalBlock.type, { ...originalBlock.data });

          const blocks = [...state.currentQuote.blocks];
          blocks.splice(blockIndex + 1, 0, duplicatedBlock);

          return {
            currentQuote: {
              ...state.currentQuote,
              blocks,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      // ============ CLIENT DETAILS ============
      updateClientDetails: (details) =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            clientDetails: { ...state.currentQuote.clientDetails, ...details },
            updatedAt: new Date().toISOString(),
          },
        })),

      // ============ QUOTE MANAGEMENT ============
      setTemplate: (template) =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            template,
            updatedAt: new Date().toISOString(),
          },
        })),

      setTemplateBackgroundImage: (url) =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            templateBackgroundImage: url,
            updatedAt: new Date().toISOString(),
          },
        })),

      setNotes: (notes) =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            notes,
            updatedAt: new Date().toISOString(),
          },
        })),

      saveCurrentQuote: () =>
        set((state) => {
          const existingIndex = state.savedQuotes.findIndex(
            (q) => q.id === state.currentQuote.id
          );

          const updatedQuote = {
            ...state.currentQuote,
            updatedAt: new Date().toISOString(),
          };

          let savedQuotes: Quote[];
          if (existingIndex >= 0) {
            savedQuotes = [...state.savedQuotes];
            savedQuotes[existingIndex] = updatedQuote;
          } else {
            savedQuotes = [updatedQuote, ...state.savedQuotes];
          }

          return {
            currentQuote: updatedQuote,
            savedQuotes,
          };
        }),

      loadQuote: (id) =>
        set((state) => {
          const quote = state.savedQuotes.find((q) => q.id === id);
          if (!quote) return state;

          return {
            currentQuote: { ...quote },
          };
        }),

      createNewQuote: () =>
        set(() => ({
          currentQuote: createEmptyQuote(),
        })),

      deleteQuote: (id) =>
        set((state) => ({
          savedQuotes: state.savedQuotes.filter((q) => q.id !== id),
        })),

      addSavedQuote: (quote) =>
        set((state) => ({
          savedQuotes: [...state.savedQuotes, quote],
        })),

      // ============ SERVICE LIBRARY ============
      addToServiceLibrary: (service) =>
        set((state) => ({
          serviceLibrary: [...state.serviceLibrary, service],
        })),

      updateServiceInLibrary: (index, service) =>
        set((state) => {
          const serviceLibrary = [...state.serviceLibrary];
          serviceLibrary[index] = service;
          return { serviceLibrary };
        }),

      removeFromServiceLibrary: (index) =>
        set((state) => ({
          serviceLibrary: state.serviceLibrary.filter((_, i) => i !== index),
        })),

      // ============ IMAGE LIBRARY ============
      addImage: (src, name) =>
        set((state) => ({
          imageLibrary: [
            ...state.imageLibrary,
            {
              id: crypto.randomUUID(),
              src,
              name,
              uploadedAt: new Date().toISOString(),
            },
          ],
        })),

      removeImage: (id) =>
        set((state) => ({
          imageLibrary: state.imageLibrary.filter((img) => img.id !== id),
        })),

      // ============ TEMPLATE LIBRARY ============
      addSavedTemplate: (name, imageUrl) =>
        set((state) => ({
          savedTemplates: [
            ...state.savedTemplates,
            {
              id: crypto.randomUUID(),
              name,
              imageUrl,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteSavedTemplate: (id) =>
        set((state) => ({
          savedTemplates: state.savedTemplates.filter((t) => t.id !== id),
        })),

      // ============ UTILITIES ============
      clearCurrentQuote: () =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            blocks: [],
            clientDetails: createEmptyClientDetails(),
            notes: '',
            isManualPricing: false,
            manualSubtotal: 0,
            manualVat: 0,
            updatedAt: new Date().toISOString(),
          },
        })),

      updatePricing: (pricing) =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            ...pricing,
            updatedAt: new Date().toISOString(),
          },
        })),

      getQuoteTotals: () => {
        const state = get();
        const { isManualPricing, manualSubtotal, manualVat } = state.currentQuote;

        if (isManualPricing) {
          const subtotal = manualSubtotal || 0;
          const vat = manualVat || 0;
          const total = subtotal + vat;
          return { subtotal, vat, total };
        }

        const subtotal = state.currentQuote.blocks
          .filter((b): b is Block & { type: 'service' } => b.type === 'service')
          .reduce((sum, block) => {
            const data = block.data as ServiceBlockData;
            return sum + data.price * data.quantity;
          }, 0);

        const vatRate = 21; // Will be from settings
        const vat = subtotal * (vatRate / 100);
        const total = subtotal + vat;

        return { subtotal, vat, total };
      },

      loadFromDisk: async () => {
        const { activeProfile } = get();
        try {
          const data = await loadProfileData(activeProfile);
          if (data) {
            set((state) => ({
              ...state,
              ...data,
              isLocalSyncActive: true,
            }));
          }
        } catch (error) {
          console.error('Failed to load from local file:', error);
        }
      },

      setupWorkspace: async () => {
        try {
          const success = await requestRootFolder();
          if (success) {
            set({ isLocalSyncActive: true });
            await get().refreshProfiles();
            // Try to load current active profile from the new folder
            await get().loadFromDisk();
          }
        } catch (error) {
          console.error('Failed to setup workspace:', error);
        }
      },

      checkWorkspaceStatus: async () => {
        const configured = await isWorkspaceConfigured();
        set({ isLocalSyncActive: configured });
        if (configured) {
          await get().refreshProfiles();
        }
      },

      createProfile: async (name: string) => {
        if (!name) return;
        set({ activeProfile: name });
        // Initial sync for new profile (empty states)
        const state = get();
        const dataToSync = {
          savedQuotes: [],
          serviceLibrary: DEFAULT_SERVICES,
          imageLibrary: [],
          savedTemplates: [],
        };
        await syncToDisk(name, dataToSync);
        set((state) => ({
          ...state,
          ...dataToSync,
          profiles: Array.from(new Set([...state.profiles, name])),
          lastSyncedAt: new Date().toISOString(),
        }));
      },

      switchProfile: async (name: string) => {
        set({ activeProfile: name });
        await get().loadFromDisk();
      },

      deleteProfile: async (name: string) => {
        const { activeProfile, profiles } = get();

        // 1. Delete from disk
        const success = await deleteProfileFolder(name);

        if (success) {
          // 2. Remove from list
          const newProfiles = profiles.filter(p => p !== name);

          set({ profiles: newProfiles });

          // 3. If we deleted the active profile, switch to the first available one or default
          if (activeProfile === name) {
            const nextProfile = newProfiles[0] || 'default';
            if (newProfiles.length === 0) {
              await get().createProfile('default');
            } else {
              await get().switchProfile(nextProfile);
            }
          }
        }
      },

      refreshProfiles: async () => {
        const profiles = await listAvailableProfiles();
        if (profiles.length > 0) {
          set({ profiles });
        }
      },
    }),
    // Persistence
    {
      name: 'endeko-quote-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeProfile: state.activeProfile,
        profiles: state.profiles,
      }),
      onRehydrateStorage: () => {
        return (rehydratedState, error) => {
          if (!error && rehydratedState) {
            rehydratedState.checkWorkspaceStatus();
            rehydratedState.loadFromDisk();
          }
        };
      },
    }
  )
);

// ============ AUTO SYNC TO DISK ============
useQuoteStore.subscribe((state, prevState) => {
  // Only sync if actual data changed (to avoid circular updates or redundant writes)
  const hasChanged =
    JSON.stringify(state.savedQuotes) !== JSON.stringify(prevState.savedQuotes) ||
    JSON.stringify(state.serviceLibrary) !== JSON.stringify(prevState.serviceLibrary) ||
    JSON.stringify(state.imageLibrary) !== JSON.stringify(prevState.imageLibrary) ||
    JSON.stringify(state.savedTemplates) !== JSON.stringify(prevState.savedTemplates);

  if (hasChanged && state.isLocalSyncActive) {
    const dataToSync = {
      savedQuotes: state.savedQuotes,
      serviceLibrary: state.serviceLibrary,
      imageLibrary: state.imageLibrary,
      savedTemplates: state.savedTemplates,
    };
    syncToDisk(state.activeProfile, dataToSync).then(() => {
      useQuoteStore.setState({ lastSyncedAt: new Date().toISOString() });
    });
  }
});
