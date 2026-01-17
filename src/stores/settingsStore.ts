import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CompanySettings, AppSettings, Language, QuoteTemplate } from '../types/blocks';
import i18n from '../i18n';

// ============ STORE STATE ============
interface SettingsState {
  company: CompanySettings;
  app: AppSettings;
}

// ============ STORE ACTIONS ============
interface SettingsActions {
  updateCompany: (data: Partial<CompanySettings>) => void;
  updateApp: (data: Partial<AppSettings>) => void;
  setLogo: (base64: string | null) => void;
  setLanguage: (language: Language) => void;
  setVatRate: (rate: number) => void;
  setDefaultTemplate: (template: QuoteTemplate) => void;
  resetSettings: () => void;
}

// ============ DEFAULT VALUES ============
const defaultCompany: CompanySettings = {
  companyName: '',
  address: '',
  postalCode: '',
  city: '',
  phone: '',
  email: '',
  website: '',
  kvkNumber: '',
  btwNumber: '',
  bankAccount: '',
  logoBase64: null,
};

const defaultApp: AppSettings = {
  language: 'nl',
  currency: 'EUR',
  vatRate: 21,
  defaultTemplate: 'modern',
  autoSaveInterval: 30000,
};

// ============ STORE IMPLEMENTATION ============
export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      company: defaultCompany,
      app: defaultApp,

      updateCompany: (data) =>
        set((state) => ({
          company: { ...state.company, ...data },
        })),

      updateApp: (data) =>
        set((state) => ({
          app: { ...state.app, ...data },
        })),

      setLogo: (base64) =>
        set((state) => ({
          company: { ...state.company, logoBase64: base64 },
        })),

      setLanguage: (language) => {
        // Update i18n
        i18n.changeLanguage(language);
        localStorage.setItem('endeko-language', language);

        set((state) => ({
          app: { ...state.app, language },
        }));
      },

      setVatRate: (vatRate) =>
        set((state) => ({
          app: { ...state.app, vatRate },
        })),

      setDefaultTemplate: (defaultTemplate) =>
        set((state) => ({
          app: { ...state.app, defaultTemplate },
        })),

      resetSettings: () =>
        set(() => ({
          company: defaultCompany,
          app: defaultApp,
        })),
    }),
    {
      name: 'endeko-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
