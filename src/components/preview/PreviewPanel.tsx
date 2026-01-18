import { useTranslation } from 'react-i18next';
import { Download, Share2, Printer, Expand, Minimize, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../ui';
import { TemplateManager } from './TemplateManager';
import { PDFViewer } from './PDFViewer';

export function PreviewPanel() {
  const { t } = useTranslation();
  const { isPreviewExpanded, togglePreviewExpanded } = useUIStore();

  const handleDownload = async () => {
    // PDF download will be handled by PDFViewer
    const event = new CustomEvent('downloadPdf');
    window.dispatchEvent(event);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-panel-dark light-mode:bg-white text-foreground relative">
      {/* Header */}
      {!isPreviewExpanded && (
        <div className="flex-none p-4 border-b border-border-dark light-mode:border-border-light">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">{t('preview.title')}</h2>

            <div className="flex items-center gap-1">
              <button
                onClick={togglePreviewExpanded}
                title={isPreviewExpanded ? 'Minimize' : 'Expand'}
                className="p-2 rounded-lg hover:bg-black/5 light-mode:hover:bg-gray-100 text-muted-dark light-mode:text-muted-light transition-colors"
              >
                {isPreviewExpanded ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Expand className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Template Manager */}
          <TemplateManager />
        </div>
      )}

      {/* PDF Preview */}
      <div className="flex-1 overflow-hidden bg-black/20 light-mode:bg-gray-200">
        <PDFViewer />
      </div>

      {/* Actions */}
      {!isPreviewExpanded && (
        <div className="flex-none p-4 border-t border-border-dark light-mode:border-border-light bg-panel-dark light-mode:bg-white">
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1 matte-button-primary" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              {t('preview.download')}
            </Button>

            <Button variant="default" onClick={handlePrint} className="matte-button-ghost">
              <Printer className="h-4 w-4" />
            </Button>

            <Button variant="default" className="matte-button-ghost">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Close Button (Expanded Mode) */}
      {isPreviewExpanded && (
        <button
          onClick={togglePreviewExpanded}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          title={t('common.close')}
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
