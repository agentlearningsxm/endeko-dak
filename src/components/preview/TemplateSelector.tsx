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
            'p-2 rounded-lg border transition-all duration-200 text-center',
            currentQuote.template === template.id
              ? 'bg-primary/20 border-primary text-white'
              : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white'
          )}
        >
          <template.icon className="h-5 w-5 mx-auto mb-1" />
          <div className="text-xs font-medium">{t(template.labelKey)}</div>
        </button>
      ))}
    </div>
  );
}
