import { useTranslation } from 'react-i18next';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useQuoteStore } from '../../stores/quoteStore';
import { useUIStore } from '../../stores/uiStore';
import { ClientDetails } from './ClientDetails';
import { BlockWrapper } from './blocks/BlockWrapper';
import { ServiceBlockComponent } from './blocks/ServiceBlock';
import { ImageBlockComponent } from './blocks/ImageBlock';
import { TextBlockComponent } from './blocks/TextBlock';
import { SectionBlockComponent } from './blocks/SectionBlock';
import { QuoteTotals } from './QuoteTotals';
import { GlassPanel, Button } from '../ui';
import type { Block } from '../../types/blocks';

export function BuilderCanvas() {
  const { t } = useTranslation();
  const { currentQuote, addBlock } = useQuoteStore();
  const { isDragging } = useUIStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'builder-canvas',
  });

  const blocks = currentQuote.blocks;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none p-4 border-b border-white/[0.1]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{t('builder.title')}</h2>
            <p className="text-sm text-white/50">
              {t('quote.number')}: {currentQuote.number}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={() => addBlock('service')}>
              <Plus className="h-4 w-4" />
              Dienst
            </Button>
            <Button variant="default" size="sm" onClick={() => addBlock('text')}>
              <Plus className="h-4 w-4" />
              Tekst
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Client Details */}
          <GlassPanel intensity="low">
            <ClientDetails />
          </GlassPanel>

          {/* Blocks Drop Zone */}
          <div
            ref={setNodeRef}
            className={cn(
              'min-h-[300px] rounded-xl border-2 border-dashed transition-all duration-200',
              isOver
                ? 'border-primary bg-primary/10'
                : isDragging
                ? 'border-white/30 bg-white/[0.02]'
                : 'border-transparent',
              blocks.length === 0 && !isDragging && 'border-white/[0.1]'
            )}
          >
            {blocks.length === 0 ? (
              <EmptyState />
            ) : (
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 p-2">
                  {blocks.map((block) => (
                    <BlockWrapper key={block.id} block={block}>
                      <BlockRenderer block={block} />
                    </BlockWrapper>
                  ))}
                </div>
              </SortableContext>
            )}
          </div>

          {/* Quote Totals */}
          {blocks.some((b) => b.type === 'service') && (
            <GlassPanel intensity="low">
              <QuoteTotals />
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-white/40 p-8">
      <Layers className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-center text-sm max-w-xs">{t('builder.emptyCanvas')}</p>
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'service':
      return <ServiceBlockComponent block={block} />;
    case 'image':
      return <ImageBlockComponent block={block} />;
    case 'text':
      return <TextBlockComponent block={block} />;
    case 'section':
      return <SectionBlockComponent block={block} />;
    default:
      return null;
  }
}
