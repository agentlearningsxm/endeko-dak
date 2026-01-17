import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import { useQuoteStore } from '../../stores/quoteStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { formatCurrency } from '../../lib/constants';

export function QuoteTotals() {
  const { t } = useTranslation();
  const { getQuoteTotals } = useQuoteStore();
  const { app } = useSettingsStore();

  const { subtotal, vat, total } = getQuoteTotals();

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-white">Totalen</h3>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-white/70">
          <span>{t('quote.subtotal')}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-white/70">
          <span>{t('quote.vat')} ({app.vatRate}%)</span>
          <span>{formatCurrency(vat)}</span>
        </div>

        <div className="border-t border-white/[0.1] pt-2 mt-2">
          <div className="flex justify-between text-lg font-semibold text-white">
            <span>{t('quote.total')}</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
