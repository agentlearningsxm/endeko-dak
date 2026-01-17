import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useQuoteStore } from '../../stores/quoteStore';
import { useUIStore } from '../../stores/uiStore';
import { formatCurrency } from '../../lib/constants';
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
      <div className="text-center py-8 text-white/40">
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
        <div className="flex-none mt-1">
          <GripVertical className="h-4 w-4 text-white/20" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
              <FileText className="h-3 w-3 text-primary" />
            </div>
            <h4 className="text-sm font-medium text-white truncate">{service.title}</h4>
          </div>

          <p className="text-xs text-white/50 line-clamp-2 mb-2">{service.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">
              {t(`categories.${service.category}`)}
            </span>
            <span className="text-sm font-medium text-primary">
              {formatCurrency(service.price)}/{t(`units.${service.unit}`)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
