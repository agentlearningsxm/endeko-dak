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
  getQuoteTotals: () => { subtotal: number; vat: number; total: number };
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

      // ============ UTILITIES ============
      clearCurrentQuote: () =>
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            blocks: [],
            clientDetails: createEmptyClientDetails(),
            notes: '',
            updatedAt: new Date().toISOString(),
          },
        })),

      getQuoteTotals: () => {
        const state = get();
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
    }),
    {
      name: 'endeko-quote-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedQuotes: state.savedQuotes,
        serviceLibrary: state.serviceLibrary,
        imageLibrary: state.imageLibrary,
        savedTemplates: state.savedTemplates,
      }),
    }
  )
);
