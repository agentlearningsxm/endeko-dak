import { useTranslation } from 'react-i18next';
import { Type } from 'lucide-react';
import { useQuoteStore } from '../../../stores/quoteStore';
import { Textarea, Select } from '../../ui';
import type { TextBlock, TextVariant, TextAlignment } from '../../../types/blocks';

interface TextBlockComponentProps {
  block: TextBlock;
}

export function TextBlockComponent({ block }: TextBlockComponentProps) {
  const { t } = useTranslation();
  const { updateBlock } = useQuoteStore();
  const { data } = block;

  const variantOptions: { value: TextVariant; label: string }[] = [
    { value: 'paragraph', label: t('text.variants.paragraph') },
    { value: 'heading', label: t('text.variants.heading') },
    { value: 'note', label: t('text.variants.note') },
    { value: 'terms', label: t('text.variants.terms') },
    { value: 'disclaimer', label: t('text.variants.disclaimer') },
  ];

  const alignmentOptions: { value: TextAlignment; label: string }[] = [
    { value: 'left', label: t('image.alignments.left') },
    { value: 'center', label: t('image.alignments.center') },
    { value: 'right', label: t('image.alignments.right') },
  ];

  const variantStyles = {
    paragraph: 'text-base',
    heading: 'text-2xl font-bold bg-transparent border-none p-0 focus:ring-0',
    note: 'text-sm italic bg-background-dark light-mode:bg-gray-100 p-4 rounded-xl border border-border-dark light-mode:border-border-light',
    terms: 'text-xs text-muted-dark light-mode:text-muted-light',
    disclaimer: 'text-xs text-muted-dark light-mode:text-muted-light italic',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center shadow-sm">
          <Type className="h-5 w-5 text-secondary" />
        </div>
        <span className="font-bold text-foreground text-lg">{t(`text.variants.${data.variant}`)}</span>
      </div>

      {/* Content */}
      <Textarea
        value={data.content}
        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
        placeholder={`${t(`text.variants.${data.variant}`)} tekst...`}
        rows={data.variant === 'heading' ? 1 : 4}
        className={variantStyles[data.variant]}
      />

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Select
          label={t('text.variant')}
          value={data.variant}
          onChange={(e) => updateBlock(block.id, { variant: e.target.value as TextVariant })}
          options={variantOptions}
        />

        <Select
          label={t('image.alignment')}
          value={data.alignment || 'left'}
          onChange={(e) => updateBlock(block.id, { alignment: e.target.value as TextAlignment })}
          options={alignmentOptions}
        />
      </div>
    </div>
  );
}
