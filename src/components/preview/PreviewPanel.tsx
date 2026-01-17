import { useTranslation } from 'react-i18next';
import { Download, Share2, Printer, Expand, Minimize } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { Button, IconButton } from '../ui';
import { TemplateSelector } from './TemplateSelector';
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-white/[0.1]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">{t('preview.title')}</h2>

          <div className="flex items-center gap-1">
            <IconButton onClick={togglePreviewExpanded} title={isPreviewExpanded ? 'Minimize' : 'Expand'}>
              {isPreviewExpanded ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Expand className="h-5 w-5" />
              )}
            </IconButton>
          </div>
        </div>

        {/* Template Selector */}
        <TemplateSelector />
      </div>

      {/* PDF Preview */}
      <div className="flex-1 overflow-hidden bg-white/[0.02]">
        <PDFViewer />
      </div>

      {/* Actions */}
      <div className="flex-none p-4 border-t border-white/[0.1]">
        <div className="flex gap-2">
          <Button variant="primary" className="flex-1" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            {t('preview.download')}
          </Button>

          <Button variant="default" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>

          <Button variant="default">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
