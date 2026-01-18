import { useTranslation } from 'react-i18next';
import { LayoutTemplate, Crown, FileSpreadsheet, Minimize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useQuoteStore } from '../../stores/quoteStore';
import type { QuoteTemplate } from '../../types/blocks';

const templates: {
  id: QuoteTemplate;
  icon: typeof LayoutTemplate;
  labelKey: string;
  descriptionKey: string;
}[] = [
    {
      id: 'modern',
      icon: LayoutTemplate,
      labelKey: 'preview.templates.modern',
      descriptionKey: 'Strak design',
    },
    {
      id: 'classy',
      icon: Crown,
      labelKey: 'preview.templates.classy',
      descriptionKey: 'Elegant',
    },
    {
      id: 'technical',
      icon: FileSpreadsheet,
      labelKey: 'preview.templates.technical',
      descriptionKey: 'Gedetailleerd',
    },
    {
      id: 'compact',
      icon: Minimize2,
      labelKey: 'preview.templates.compact',
      descriptionKey: 'Compact',
    },
  ];

export function TemplateSelector() {
  const { t } = useTranslation();
  const { currentQuote, setTemplate } = useQuoteStore();

  return (
    <div className="grid grid-cols-4 gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => setTemplate(template.id)}
          className={cn(
            'p-3 rounded-lg border transition-all duration-200 text-center flex flex-col items-center justify-center gap-1',
            currentQuote.template === template.id
              ? 'bg-primary border-primary text-white shadow-md'
              : 'bg-panel-dark light-mode:bg-panel-light border-border-dark light-mode:border-border-light text-text-dark light-mode:text-text-light hover:border-primary/50'
          )}
        >
          <template.icon className={cn(
            "h-5 w-5 mb-1",
            currentQuote.template === template.id ? "text-white" : "text-primary"
          )} />
          <div className="text-xs font-bold uppercase tracking-tight">{t(template.labelKey)}</div>
        </button>
      ))}
    </div>
  );
}
