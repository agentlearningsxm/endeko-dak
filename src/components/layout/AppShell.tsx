import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  FolderOpen,
  Settings,
  Plus,
  Globe,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { Button, IconButton } from '../ui';

interface AppShellProps {
  libraryPanel: ReactNode;
  builderPanel: ReactNode;
  previewPanel: ReactNode;
}

export function AppShell({ libraryPanel, builderPanel, previewPanel }: AppShellProps) {
  const { t } = useTranslation();
  const { isPreviewExpanded, openModal } = useUIStore();
  const { app, setLanguage } = useSettingsStore();
  const { createNewQuote } = useQuoteStore();

  const toggleLanguage = () => {
    setLanguage(app.language === 'nl' ? 'en' : 'nl');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-none h-14 border-b border-white/[0.1] bg-white/[0.02] backdrop-blur-xl">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">{t('app.name')}</h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => createNewQuote()}
            >
              <Plus className="h-4 w-4" />
              {t('nav.newQuote')}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal('savedQuotes')}
            >
              <FolderOpen className="h-4 w-4" />
              {t('nav.savedQuotes')}
            </Button>

            <IconButton onClick={toggleLanguage} title={t('settings.language')}>
              <Globe className="h-5 w-5" />
            </IconButton>

            <IconButton onClick={() => openModal('settings')} title={t('nav.settings')}>
              <Settings className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Library */}
        <aside
          className={cn(
            'flex-none w-80 border-r border-white/[0.1]',
            'bg-white/[0.02] overflow-hidden flex flex-col',
            isPreviewExpanded && 'hidden lg:flex'
          )}
        >
          {libraryPanel}
        </aside>

        {/* Center Panel - Builder */}
        <section
          className={cn(
            'flex-1 overflow-hidden flex flex-col',
            isPreviewExpanded && 'hidden lg:flex'
          )}
        >
          {builderPanel}
        </section>

        {/* Right Panel - Preview */}
        <aside
          className={cn(
            'flex-none border-l border-white/[0.1]',
            'bg-white/[0.02] overflow-hidden flex flex-col',
            isPreviewExpanded ? 'w-full lg:w-[600px]' : 'w-96'
          )}
        >
          {previewPanel}
        </aside>
      </main>
    </div>
  );
}
