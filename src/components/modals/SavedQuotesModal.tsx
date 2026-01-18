import { useTranslation } from 'react-i18next';
import { X, FileText, Trash2, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../stores/uiStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { formatDate } from '../../lib/constants';
import { GlassPanel, Button } from '../ui';

export function SavedQuotesModal() {
  const { t } = useTranslation();
  const { closeModal } = useUIStore();
  const { savedQuotes, loadQuote, deleteQuote } = useQuoteStore();

  const handleLoad = (id: string) => {
    loadQuote(id);
    closeModal();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('messages.confirmDelete'))) {
      deleteQuote(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-dark light-mode:border-border-light">
          <h2 className="text-lg font-bold text-foreground">{t('nav.savedQuotes')}</h2>
          <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="h-5 w-5 text-muted-dark light-mode:text-muted-light" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedQuotes.length === 0 ? (
            <div className="text-center py-12 text-muted-dark light-mode:text-muted-light">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('messages.noQuotes')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => handleLoad(quote.id)}
                  className={cn(
                    'p-4 rounded-lg border cursor-pointer transition-all duration-200',
                    'bg-white/[0.03] border-white/[0.08]',
                    'hover:bg-white/[0.06] hover:border-white/[0.15]'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-bold text-foreground">{quote.number}</span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                            quote.status === 'draft' && 'bg-background-dark text-muted-dark border border-border-dark',
                            quote.status === 'sent' && 'bg-primary/10 text-primary border border-primary/20',
                            quote.status === 'accepted' && 'bg-success/10 text-success border border-success/20',
                            quote.status === 'rejected' && 'bg-error/10 text-error border border-error/20'
                          )}
                        >
                          {t(`quote.status.${quote.status}`)}
                        </span>
                      </div>

                      <p className="text-sm text-foreground/80 mb-2">
                        {quote.clientDetails.companyName || quote.clientDetails.name || 'Geen klant'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-dark light-mode:text-muted-light">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(quote.updatedAt)}
                        </span>
                        <span>{quote.blocks.length} blokken</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(quote.id, e)}
                        className="p-2 hover:bg-error/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-white/40 hover:text-error" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-white/[0.1]">
          <Button variant="default" onClick={closeModal}>
            {t('actions.close')}
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
