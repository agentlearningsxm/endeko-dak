import { useTranslation } from 'react-i18next';
import { FileText, Image, Type, Search } from 'lucide-react';
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
  const { activeLibraryTab, setActiveLibraryTab, librarySearchQuery, setLibrarySearchQuery } =
    useUIStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-white/[0.1]">
        <h2 className="text-lg font-semibold text-white mb-3">{t('library.title')}</h2>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLibraryTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md',
                'text-sm font-medium transition-all duration-200',
                activeLibraryTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
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
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeLibraryTab === 'services' && <ServiceLibrary />}
        {activeLibraryTab === 'images' && <ImageLibrary />}
        {activeLibraryTab === 'text' && <TextLibrary />}
      </div>

      {/* Footer hint */}
      <div className="flex-none p-4 border-t border-white/[0.1]">
        <p className="text-xs text-white/40 text-center">{t('library.dragToAdd')}</p>
      </div>
    </div>
  );
}
