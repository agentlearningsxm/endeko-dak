import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { Upload, Link, Image, X, GripVertical } from 'lucide-react';
import { cn, compressImage } from '../../lib/utils';
import { useQuoteStore } from '../../stores/quoteStore';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../ui';
import type { SavedImage } from '../../types/blocks';

export function ImageLibrary() {
  const { t } = useTranslation();
  const { imageLibrary, addImage, removeImage } = useQuoteStore();
  const { addToast } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      addToast('Alleen afbeeldingen zijn toegestaan', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('Afbeelding is te groot (max 10MB)', 'error');
      return;
    }

    try {
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });

      addImage(compressed, file.name);
      addToast('Afbeelding toegevoegd', 'success');
    } catch {
      addToast('Fout bij uploaden', 'error');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleURLAdd = () => {
    const url = prompt('Voer afbeeldings-URL in:');
    if (!url) return;

    try {
      new URL(url);
      addImage(url, 'URL afbeelding');
      addToast('Afbeelding toegevoegd', 'success');
    } catch {
      addToast('Ongeldige URL', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload buttons */}
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {t('library.uploadImage')}
        </Button>

        <Button variant="default" size="sm" className="flex-1" onClick={handleURLAdd}>
          <Link className="h-4 w-4" />
          URL
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Image grid */}
      {imageLibrary.length === 0 ? (
        <div className="text-center py-8 text-muted-dark light-mode:text-muted-light">
          <Image className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nog geen afbeeldingen</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {imageLibrary.map((image) => (
            <DraggableImageItem
              key={image.id}
              image={image}
              onRemove={() => removeImage(image.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DraggableImageItemProps {
  image: SavedImage;
  onRemove: () => void;
}

function DraggableImageItem({ image, onRemove }: DraggableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-image-${image.id}`,
    data: {
      origin: 'library',
      type: 'image',
      data: {
        src: image.src,
        alt: image.name,
        caption: '',
        width: 'full',
        alignment: 'center',
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
      className={cn(
        'relative group rounded-lg overflow-hidden border',
        'bg-background-dark light-mode:bg-white border-border-dark light-mode:border-border-light',
        'hover:border-primary/50 hover:shadow-md',
        isDragging && 'opacity-50'
      )}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute top-2 left-2 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 cursor-grab"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 hover:bg-error/80"
      >
        <X className="h-4 w-4 text-white" />
      </button>

      {/* Image */}
      <img
        src={image.src}
        alt={image.name}
        className="w-full h-24 object-cover"
        draggable={false}
      />

      {/* Name */}
      <div className="p-2">
        <p className="text-xs text-muted-dark light-mode:text-muted-light truncate">{image.name}</p>
      </div>
    </div>
  );
}
