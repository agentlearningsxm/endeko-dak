import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, X } from 'lucide-react';
import { useQuoteStore } from '../../../stores/quoteStore';
import { formatCurrency } from '../../../lib/constants';
import { Input, Textarea, Select } from '../../ui';
import type { ServiceBlock, ServiceUnit, ServiceCategory } from '../../../types/blocks';

interface ServiceBlockComponentProps {
  block: ServiceBlock;
}

export function ServiceBlockComponent({ block }: ServiceBlockComponentProps) {
  const { t } = useTranslation();
  const { updateBlock } = useQuoteStore();
  const { data } = block;

  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    updateBlock(block.id, { items: [...data.items, newItem.trim()] });
    setNewItem('');
  };

  const handleRemoveItem = (index: number) => {
    updateBlock(block.id, {
      items: data.items.filter((_, i) => i !== index),
    });
  };

  const unitOptions: { value: ServiceUnit; label: string }[] = [
    { value: 'm²', label: 'm²' },
    { value: 'stuks', label: t('units.stuks') },
    { value: 'uur', label: t('units.uur') },
    { value: 'meter', label: t('units.meter') },
    { value: 'forfait', label: t('units.forfait') },
  ];

  const categoryOptions: { value: ServiceCategory; label: string }[] = [
    { value: 'dakbedekking', label: t('categories.dakbedekking') },
    { value: 'groen-dak', label: t('categories.groen-dak') },
    { value: 'hemelwaterafvoer', label: t('categories.hemelwaterafvoer') },
    { value: 'inspectie', label: t('categories.inspectie') },
    { value: 'isolatie', label: t('categories.isolatie') },
    { value: 'loodwerk', label: t('categories.loodwerk') },
    { value: 'renovatie', label: t('categories.renovatie') },
    { value: 'reparatie', label: t('categories.reparatie') },
    { value: 'zinkwerk', label: t('categories.zinkwerk') },
    { value: 'overig', label: t('categories.overig') },
  ];

  const lineTotal = data.price * data.quantity;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shadow-sm">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <Input
          value={data.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          placeholder={t('service.title')}
          className="flex-1 text-xl font-bold bg-transparent border-none p-0 focus:ring-0"
        />
      </div>

      {/* Description */}
      <Textarea
        value={data.description}
        onChange={(e) => updateBlock(block.id, { description: e.target.value })}
        placeholder={t('service.description')}
        rows={2}
        className="mb-4"
      />

      {/* Specifications */}
      <div className="mb-6">
        <label className="block text-sm font-bold uppercase tracking-wider text-muted-dark light-mode:text-muted-light mb-3">
          {t('service.specifications')}
        </label>

        {data.items.length > 0 && (
          <ul className="space-y-1 mb-2">
            {data.items.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-sm text-foreground group py-1"
              >
                <span className="text-primary">•</span>
                <span className="flex-1">{item}</span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/20 rounded"
                >
                  <X className="h-3 w-3 text-error" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t('service.addSpecification')}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button
            onClick={handleAddItem}
            className="px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-background-dark light-mode:bg-gray-100 border border-border-dark light-mode:border-border-light">
        <Input
          label={t('service.price')}
          type="number"
          step="0.01"
          min="0"
          value={data.price}
          onChange={(e) => updateBlock(block.id, { price: parseFloat(e.target.value) || 0 })}
        />

        <Input
          label={t('service.quantity')}
          type="number"
          step="1"
          min="1"
          value={data.quantity}
          onChange={(e) => updateBlock(block.id, { quantity: parseInt(e.target.value) || 1 })}
        />

        <Select
          label={t('service.unit')}
          value={data.unit}
          onChange={(e) => updateBlock(block.id, { unit: e.target.value as ServiceUnit })}
          options={unitOptions}
        />

        <Select
          label="Categorie"
          value={data.category}
          onChange={(e) => updateBlock(block.id, { category: e.target.value as ServiceCategory })}
          options={categoryOptions}
        />
      </div>

      {/* Line Total */}
      <div className="flex justify-end mt-6 pt-6 border-t border-border-dark light-mode:border-border-light">
        <div className="text-right">
          <span className="text-sm font-medium text-muted-dark light-mode:text-muted-light">{t('service.total')}: </span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
