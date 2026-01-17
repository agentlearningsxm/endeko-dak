import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { Type, Heading, StickyNote, FileWarning, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DEFAULT_TEXT_TEMPLATES } from '../../lib/constants';
import type { TextVariant } from '../../types/blocks';

const textVariants: {
  id: TextVariant;
  icon: typeof Type;
  labelKey: string;
}[] = [
  { id: 'paragraph', icon: Type, labelKey: 'text.variants.paragraph' },
  { id: 'heading', icon: Heading, labelKey: 'text.variants.heading' },
  { id: 'note', icon: StickyNote, labelKey: 'text.variants.note' },
  { id: 'terms', icon: FileWarning, labelKey: 'text.variants.terms' },
];

export function TextLibrary() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Quick add empty variants */}
      <div>
        <h3 className="text-sm font-medium text-white/70 mb-2">Leeg blok</h3>
        <div className="space-y-2">
          {textVariants.map((variant) => (
            <DraggableTextItem
              key={variant.id}
              variant={variant.id}
              icon={variant.icon}
              label={t(variant.labelKey)}
              content=""
            />
          ))}
        </div>
      </div>

      {/* Pre-filled templates */}
      <div>
        <h3 className="text-sm font-medium text-white/70 mb-2">Sjablonen</h3>
        <div className="space-y-2">
          {DEFAULT_TEXT_TEMPLATES.map((template, index) => {
            const variantInfo = textVariants.find((v) => v.id === template.variant);
            return (
              <DraggableTextItem
                key={index}
                variant={template.variant}
                icon={variantInfo?.icon || Type}
                label={t(`text.variants.${template.variant}`)}
                content={template.content}
                showPreview
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface DraggableTextItemProps {
  variant: TextVariant;
  icon: typeof Type;
  label: string;
  content: string;
  showPreview?: boolean;
}

function DraggableTextItem({
  variant,
  icon: Icon,
  label,
  content,
  showPreview = false,
}: DraggableTextItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-text-${variant}-${content.slice(0, 20)}`,
    data: {
      origin: 'library',
      type: 'text',
      data: {
        content,
        variant,
        alignment: 'left',
        fontSize: 'normal',
      },
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'p-3 rounded-lg border transition-all duration-200',
        'bg-white/[0.03] border-white/[0.08]',
        'hover:bg-white/[0.06] hover:border-white/[0.15]',
        'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 scale-[1.02] shadow-xl'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-none mt-0.5">
          <GripVertical className="h-4 w-4 text-white/20" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded bg-secondary/20 flex items-center justify-center">
              <Icon className="h-3 w-3 text-secondary" />
            </div>
            <h4 className="text-sm font-medium text-white">{label}</h4>
          </div>

          {showPreview && content && (
            <p className="text-xs text-white/40 line-clamp-2">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
