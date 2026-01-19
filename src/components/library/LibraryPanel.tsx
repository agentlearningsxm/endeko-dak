import { useTranslation } from 'react-i18next';
import { FileText, Image, Type, Search, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore, type LibraryTab } from '../../stores/uiStore';
import { Input } from '../ui';
import { ServiceLibrary } from './ServiceLibrary';
import { ImageLibrary } from './ImageLibrary';
import { TextLibrary } from './TextLibrary';

const tabs: { id: LibraryTab; icon: typeof FileText; labelKey: string }[] = [
  { id: 'services', icon: FileText, labelKey: 'library.services' },
  { id: 'images', icon: Image, labelKey: 'library.images' },
  { id: 'text', icon: Type, labelKey: 'library.text' },
];

export function LibraryPanel() {
  const { t } = useTranslation();
  const { activeLibraryTab, setActiveLibraryTab, librarySearchQuery, setLibrarySearchQuery, openModal } =
    useUIStore();

  return (
    <div className="h-full flex flex-col bg-panel-dark light-mode:bg-panel-light text-foreground">
      {/* Header */}
      <div className="flex-none p-4 border-b border-border-dark light-mode:border-border-light">
        <h2 className="text-lg font-semibold text-foreground mb-3">{t('library.title')}</h2>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-background-dark light-mode:bg-gray-100 border border-border-dark light-mode:border-border-light">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLibraryTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md',
                'text-sm font-medium transition-all duration-200',
                activeLibraryTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-dark light-mode:text-muted-light hover:text-foreground hover:bg-white/5 light-mode:hover:bg-white'
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t(tab.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search (for services) */}
      {activeLibraryTab === 'services' && (
        <div className="flex-none p-4 pb-0">
          <Input
            placeholder={t('library.searchServices')}
            value={librarySearchQuery}
            onChange={(e) => setLibrarySearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="matte-input"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeLibraryTab === 'services' && <ServiceLibrary />}
        {activeLibraryTab === 'images' && <ImageLibrary />}
        {activeLibraryTab === 'text' && <TextLibrary />}
      </div>

      {/* Footer / Add Service */}
      <div className="flex-none p-4 border-t border-border-dark light-mode:border-border-light bg-background-dark/50 light-mode:bg-gray-50/50">
        {activeLibraryTab === 'services' && (
          <button
            onClick={() => openModal('serviceEditor')}
            className="w-full mb-3 matte-button-primary py-2 text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add services
          </button>
        )}
        <p className="text-[10px] text-muted-dark light-mode:text-muted-light text-center uppercase tracking-widest opacity-60">
          {activeLibraryTab !== 'services' && t('library.dragToAdd')}
        </p>
      </div>
    </div>
  );
}
