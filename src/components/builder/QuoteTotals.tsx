import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import { useQuoteStore } from '../../stores/quoteStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { formatCurrency } from '../../lib/constants';
import { cn } from '../../lib/utils';

export function QuoteTotals() {
  const { t } = useTranslation();
  const { currentQuote, updatePricing, getQuoteTotals } = useQuoteStore();
  const { app } = useSettingsStore();

  const { subtotal, vat, total } = getQuoteTotals();
  const isManual = currentQuote.isManualPricing;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground">Quote Pricing</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Manual</span>
          <button
            onClick={() => updatePricing({ isManualPricing: !isManual })}
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none",
              isManual ? "bg-primary" : "bg-border-dark light-mode:bg-slate-300"
            )}
          >
            <span
              className={cn(
                "inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200",
                isManual ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isManual ? (
          <>
            <div className="space-y-2">
              <label className="text-sm text-muted">Subtotaal excl. BTW</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark font-medium">€</span>
                <input
                  type="number"
                  value={currentQuote.manualSubtotal || 0}
                  onChange={(e) => updatePricing({ manualSubtotal: parseFloat(e.target.value) || 0 })}
                  className="matte-input pl-8 bg-background-dark/50"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted">BTW Bedrag (%)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark font-medium">€</span>
                <input
                  type="number"
                  value={currentQuote.manualVat || 0}
                  onChange={(e) => updatePricing({ manualVat: parseFloat(e.target.value) || 0 })}
                  className="matte-input pl-8 bg-background-dark/50"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="border-t border-border-dark light-mode:border-border-light pt-4 mt-2">
              <div className="flex justify-between items-center text-lg font-bold text-foreground">
                <span>Totaal incl. BTW</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between text-muted">
              <span>{t('quote.subtotal')}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-muted">
              <span>{t('quote.vat')} ({app.vatRate}%)</span>
              <span>{formatCurrency(vat)}</span>
            </div>

            <div className="border-t border-border-dark light-mode:border-border-light pt-2 mt-2">
              <div className="flex justify-between text-lg font-semibold text-foreground">
                <span>{t('quote.total')}</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
