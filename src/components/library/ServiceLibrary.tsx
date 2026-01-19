import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical, FileText, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useQuoteStore } from '../../stores/quoteStore';
import { useUIStore } from '../../stores/uiStore';
import type { ServiceBlockData } from '../../types/blocks';

export function ServiceLibrary() {
  const { serviceLibrary } = useQuoteStore();
  const { librarySearchQuery } = useUIStore();

  // Filter services by search query
  const filteredServices = serviceLibrary.filter(
    (service) =>
      service.title.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(librarySearchQuery.toLowerCase())
  );

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-dark light-mode:text-muted-light">
        <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">
          {librarySearchQuery ? 'Geen diensten gevonden' : 'Geen diensten beschikbaar'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredServices.map((service, index) => (
        <DraggableServiceItem key={index} service={service} index={index} />
      ))}
    </div>
  );
}

interface DraggableServiceItemProps {
  service: ServiceBlockData;
  index: number;
}

function DraggableServiceItem({ service, index }: DraggableServiceItemProps) {
  const { t } = useTranslation();
  const { addBlock } = useQuoteStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-service-${index}`,
    data: {
      origin: 'library',
      type: 'service',
      data: service,
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
      className={cn(
        'p-4 rounded-xl border transition-all duration-200',
        'bg-background-dark light-mode:bg-gray-50 border-border-dark light-mode:border-border-light',
        'hover:border-primary/50 hover:shadow-md',
        isDragging && 'opacity-50 scale-[1.02] shadow-xl'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle - ONLY this part is draggable */}
        <div
          {...listeners}
          {...attributes}
          className="flex-none mt-1 cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-white/5"
        >
          <GripVertical className="h-4 w-4 text-muted-dark light-mode:text-muted-light" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
              <FileText className="h-3 w-3 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-foreground truncate">{service.title}</h4>

            {/* Direct Add Button */}
            <button
              onClick={() => addBlock('service', service)}
              className="ml-auto p-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              title="Add to quote"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Description with expand/collapse */}
          <div className="mb-2">
            <p className={cn(
              "text-xs text-muted-dark light-mode:text-muted-light transition-all duration-200",
              isExpanded ? "" : "line-clamp-2"
            )}>
              {service.description}
            </p>

            {/* Show items when expanded */}
            {isExpanded && service.items && service.items.length > 0 && (
              <ul className="mt-2 space-y-1 pl-4 border-l-2 border-primary/30">
                {service.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-dark light-mode:text-muted-light">
                    • {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Always show expand button for ALL services */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-[10px] text-primary hover:underline flex items-center gap-0.5"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  <span>Show more</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-dark light-mode:text-muted-light uppercase tracking-wider">
              {t(`categories.${service.category}`)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
