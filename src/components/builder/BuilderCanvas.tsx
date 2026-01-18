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
import { Button } from '../ui'; // Removed GlassPanel
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
    <div className="h-full flex flex-col overflow-hidden bg-background-dark light-mode:bg-background-light">
      {/* Header */}
      <div className="flex-none p-4 border-b border-border-dark light-mode:border-border-light bg-panel-dark light-mode:bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t('builder.title')}</h2>
            <p className="text-sm text-muted">
              {t('quote.number')}: {currentQuote.number}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="default" size="sm" className="matte-button-primary" onClick={() => addBlock('service')}>
              <Plus className="h-4 w-4 mr-1" />
              Dienst
            </Button>
            <Button variant="default" size="sm" className="matte-button-ghost" onClick={() => addBlock('text')}>
              <Plus className="h-4 w-4 mr-1" />
              Tekst
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Client Details */}
          <div className="matte-panel shadow-lg bg-panel-dark light-mode:bg-panel-light border-border-dark light-mode:border-border-light">
            <ClientDetails />
          </div>

          {/* Blocks Drop Zone */}
          <div
            ref={setNodeRef}
            className={cn(
              'min-h-[300px] rounded-xl border-2 border-dashed transition-all duration-200',
              isOver
                ? 'border-primary bg-primary/10'
                : isDragging
                  ? 'border-border-dark light-mode:border-border-light bg-black/5'
                  : 'border-transparent',
              blocks.length === 0 && !isDragging && 'border-border-dark light-mode:border-border-light'
            )}
          >
            {blocks.length === 0 ? (
              <EmptyState />
            ) : (
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6 p-2">
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
            <div className="matte-panel p-8 bg-panel-dark light-mode:bg-panel-light border-border-dark light-mode:border-border-light">
              <QuoteTotals />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted p-8">
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
