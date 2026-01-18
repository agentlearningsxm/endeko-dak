import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  FolderOpen,
  Settings,
  Plus,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu,
  Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { Button } from '../ui';

interface AppShellProps {
  libraryPanel: ReactNode;
  builderPanel: ReactNode;
  previewPanel: ReactNode;
}

export function AppShell({ libraryPanel, builderPanel, previewPanel }: AppShellProps) {
  const { t } = useTranslation();
  const {
    isLibraryCollapsed,
    toggleLibrary,
    isPreviewCollapsed,
    togglePreview,
    openModal,
    setCurrentView,
    isHeaderVisible,
    toggleHeader,
    isPreviewExpanded
  } = useUIStore();
  const { app, setLanguage } = useSettingsStore();
  const { createNewQuote } = useQuoteStore();

  const toggleLanguage = () => {
    setLanguage(app.language === 'nl' ? 'en' : 'nl');
  };

  const toggleTheme = () => {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background-dark light-mode:bg-background-light">

      {/* Header */}
      {isHeaderVisible && (
        <header className="flex-none h-16 z-20 border-b border-border-dark light-mode:border-border-light bg-panel-dark light-mode:bg-panel-light shadow-sm transition-all duration-300">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">{t('app.name')}</h1>
                <p className="text-xs text-muted-dark light-mode:text-muted-light">Quote Builder</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="matte-button-primary"
                onClick={() => createNewQuote()}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('nav.newQuote')}
              </Button>

              <div className="h-8 w-px bg-border-dark light-mode:bg-border-light mx-2" />

              <Button
                variant="custom"
                size="sm"
                className="bg-transparent border border-white/10 light-mode:border-slate-300 text-white light-mode:text-slate-700 hover:bg-white/10 light-mode:hover:bg-slate-100 transition-colors"
                onClick={() => setCurrentView('dashboard')}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                {t('nav.savedQuotes')}
              </Button>

              <button
                onClick={toggleTheme}
                className="w-10 h-10 p-0 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 light-mode:hover:bg-slate-100 text-white light-mode:text-slate-700 transition-colors"
                title="Toggle Theme"
              >
                <Sun className="w-5 h-5 hidden light-mode:block" />
                <Moon className="w-5 h-5 block light-mode:hidden" />
              </button>

              <button
                onClick={toggleLanguage}
                className="w-10 h-10 p-0 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 light-mode:hover:bg-slate-100 text-white light-mode:text-slate-700 transition-colors"
                title={t('settings.language')}
              >
                <Globe className="h-5 w-5" />
              </button>

              <button
                onClick={() => openModal('settings')}
                className="w-10 h-10 p-0 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 light-mode:hover:bg-slate-100 text-white light-mode:text-slate-700 transition-colors"
                title={t('nav.settings')}
              >
                <Settings className="h-5 w-5" />
              </button>

              <div className="h-8 w-px bg-border-dark light-mode:bg-border-light mx-2" />

              <button
                onClick={toggleHeader}
                className="w-8 h-8 p-0 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 light-mode:hover:bg-slate-100 text-muted-dark light-mode:text-muted-light transition-colors"
                title="Hide Header"
              >
                <ChevronLeft className="h-4 w-4 rotate-90" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Floating Header Trigger (when hidden) */}
      {!isHeaderVisible && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={toggleHeader}
            className="bg-panel-dark light-mode:bg-panel-light border-x border-b border-border-dark light-mode:border-border-light rounded-b-lg px-3 py-1 shadow-md hover:h-8 transition-all h-6 flex items-center justify-center group"
          >
            <ChevronLeft className="w-4 h-4 text-muted-dark light-mode:text-muted-light -rotate-90 group-hover:text-primary transition-colors" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative z-10 p-4 gap-4">
        <aside
          className={cn(
            'flex-none transition-all duration-300 ease-in-out',
            'matte-panel overflow-hidden flex flex-col',
            isLibraryCollapsed ? 'w-12' : 'w-80'
          )}
        >
          <div className="h-10 border-b border-border-dark light-mode:border-border-light flex items-center justify-between px-3 bg-panel-dark light-mode:bg-panel-light">
            {!isLibraryCollapsed && <span className="text-xs font-bold uppercase tracking-wider text-muted-dark light-mode:text-muted-light">Tools</span>}
            <button onClick={toggleLibrary} className="p-1 hover:bg-white/5 light-mode:hover:bg-black/5 rounded transition-colors ml-auto text-muted-dark light-mode:text-muted-light">
              {isLibraryCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          <div className={cn("flex-1 overflow-y-auto overflow-x-hidden", isLibraryCollapsed && "invisible")}>
            {libraryPanel}
          </div>
        </aside>

        {/* Center Panel - Builder */}
        <section className="flex-1 overflow-hidden flex flex-col relative rounded-xl border border-border-dark light-mode:border-border-light bg-background-dark light-mode:bg-gray-100 shadow-inner">
          {/* Editor Area */}
          <div className="absolute inset-0 overflow-hidden">
            {builderPanel}
          </div>
        </section>

        {/* Right Panel - Preview */}
        <aside
          className={cn(
            'flex-none transition-all duration-300 ease-in-out',
            'matte-panel overflow-hidden flex flex-col',
            isPreviewExpanded
              ? 'flex-1 w-full border-none shadow-none z-30' // Expanded style
              : isPreviewCollapsed ? 'w-12 border-none bg-transparent shadow-none' : 'w-96' // Standard/Collapsed style
          )}
        >
          {!isPreviewExpanded && (
            <div className={cn("h-10 border-b border-border-dark light-mode:border-border-light flex items-center px-3 bg-panel-dark light-mode:bg-panel-light", isPreviewCollapsed ? "justify-center bg-transparent border-none" : "justify-between")}>
              <button onClick={togglePreview} className="p-1 hover:bg-white/5 light-mode:hover:bg-black/5 rounded transition-colors mr-auto text-muted-dark light-mode:text-muted-light">
                {isPreviewCollapsed ? <Menu className="w-4 h-4 bg-panel-dark light-mode:bg-white shadow border border-border-dark rounded p-1 w-8 h-8" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {!isPreviewCollapsed && <span className="text-xs font-bold uppercase tracking-wider text-muted-dark light-mode:text-muted-light">Live Preview</span>}
            </div>
          )}
          <div className={cn("flex-1 overflow-hidden bg-white", isPreviewCollapsed && "invisible")}>
            {/* Preview is always white paper typically */}
            {previewPanel}
          </div>
        </aside>
      </main>
    </div>
  );
}
