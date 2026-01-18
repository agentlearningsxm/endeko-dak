import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useQuoteStore } from '../../../stores/quoteStore';
import { IconButton } from '../../ui';
import type { Block } from '../../../types/blocks';
import type { ReactNode } from 'react';

interface BlockWrapperProps {
  block: Block;
  children: ReactNode;
}

export function BlockWrapper({ block, children }: BlockWrapperProps) {
  const { t } = useTranslation();
  const { removeBlock, duplicateBlock } = useQuoteStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { origin: 'canvas', block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-xl border transition-all duration-200',
        'bg-panel-dark light-mode:bg-panel-light border-border-dark light-mode:border-border-light',
        'hover:border-primary/50 hover:shadow-md',
        isDragging && 'opacity-50 z-50 shadow-2xl'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center',
          'cursor-grab active:cursor-grabbing',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        <GripVertical className="h-5 w-5 text-muted-dark light-mode:text-muted-light" />
      </div>

      {/* Actions */}
      <div
        className={cn(
          'absolute right-2 top-2 flex gap-1',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        <IconButton
          onClick={() => duplicateBlock(block.id)}
          title={t('builder.duplicateBlock')}
          className="h-7 w-7"
        >
          <Copy className="h-3.5 w-3.5" />
        </IconButton>

        <IconButton
          onClick={() => removeBlock(block.id)}
          title={t('builder.deleteBlock')}
          className="h-7 w-7 hover:bg-error/20 hover:text-error"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </IconButton>
      </div>

      {/* Content */}
      <div className="pl-8 pr-24">{children}</div>
    </div>
  );
}
