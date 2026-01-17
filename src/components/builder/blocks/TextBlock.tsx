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
    heading: 'text-lg font-semibold',
    note: 'text-sm italic bg-white/[0.03] p-3 rounded-lg',
    terms: 'text-xs text-white/60',
    disclaimer: 'text-xs text-white/50 italic',
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center">
          <Type className="h-4 w-4 text-secondary" />
        </div>
        <span className="font-medium text-white">{t(`text.variants.${data.variant}`)}</span>
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
