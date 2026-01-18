import { useTranslation } from 'react-i18next';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useQuoteStore } from '../../../stores/quoteStore';
import { Input, Select } from '../../ui';
import type { ImageBlock, ImageWidth, ImageAlignment } from '../../../types/blocks';

interface ImageBlockComponentProps {
  block: ImageBlock;
}

export function ImageBlockComponent({ block }: ImageBlockComponentProps) {
  const { t } = useTranslation();
  const { updateBlock } = useQuoteStore();
  const { data } = block;

  const widthOptions: { value: ImageWidth; label: string }[] = [
    { value: 'full', label: t('image.widths.full') },
    { value: 'half', label: t('image.widths.half') },
    { value: 'third', label: t('image.widths.third') },
  ];

  const alignmentOptions: { value: ImageAlignment; label: string }[] = [
    { value: 'left', label: t('image.alignments.left') },
    { value: 'center', label: t('image.alignments.center') },
    { value: 'right', label: t('image.alignments.right') },
  ];

  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    third: 'w-1/3',
  };

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center shadow-sm">
          <ImageIcon className="h-5 w-5 text-accent" />
        </div>
        <span className="font-bold text-foreground text-lg">Afbeelding</span>
      </div>

      {/* Image Preview */}
      {data.src ? (
        <div
          className={cn(
            'mb-4 rounded-lg overflow-hidden',
            widthClasses[data.width],
            alignmentClasses[data.alignment]
          )}
        >
          <img
            src={data.src}
            alt={data.alt}
            className="w-full h-auto object-cover"
          />
        </div>
      ) : (
        <div className="mb-6 h-40 rounded-xl bg-background-dark light-mode:bg-gray-50 border-2 border-dashed border-border-dark light-mode:border-border-light flex flex-col items-center justify-center gap-2">
          <ImageIcon className="h-8 w-8 text-muted-dark light-mode:text-muted-light opacity-50" />
          <span className="text-muted-dark light-mode:text-muted-light text-sm font-medium">Geen afbeelding geselecteerd</span>
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('image.caption')}
          value={data.caption}
          onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
          placeholder="Bijschrift..."
        />

        <Input
          label="Alt tekst"
          value={data.alt}
          onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
          placeholder="Beschrijving..."
        />

        <Select
          label={t('image.width')}
          value={data.width}
          onChange={(e) => updateBlock(block.id, { width: e.target.value as ImageWidth })}
          options={widthOptions}
        />

        <Select
          label={t('image.alignment')}
          value={data.alignment}
          onChange={(e) => updateBlock(block.id, { alignment: e.target.value as ImageAlignment })}
          options={alignmentOptions}
        />
      </div>
    </div>
  );
}
