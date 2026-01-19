import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { Button } from '../ui';

export function AddServiceModal() {
    const { closeModal } = useUIStore();
    const { addToServiceLibrary } = useQuoteStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [items, setItems] = useState<string[]>(['']);

    const handleAddItem = () => setItems([...items, '']);
    const handleRemoveItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const handleSave = () => {
        if (!title.trim()) return;

        addToServiceLibrary({
            title: title.trim(),
            description: description.trim(),
            items: items.filter(i => i.trim() !== ''),
            price: price ? parseFloat(price) : 0,
            quantity: 1,
            unit: 'stuks',
            category: 'overig'
        });
        closeModal();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="matte-panel w-full max-w-lg bg-panel-dark text-foreground overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border-dark">
                    <h3 className="text-lg font-bold">Add New Service</h3>
                    <button onClick={closeModal} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-muted" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted">Service Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="matte-input"
                            placeholder="e.g. Bitumen Dakbedekking"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted">Short Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="matte-input min-h-[80px] py-3"
                            placeholder="Brief overview of the service..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted">Price (Optional)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark font-medium">€</span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="matte-input pl-8"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted">Service Details (Bullet Points)</label>
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        value={item}
                                        onChange={(e) => handleItemChange(index, e.target.value)}
                                        className="matte-input"
                                        placeholder="Feature or step..."
                                    />
                                    {items.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors flex-none"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddItem}
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors font-medium mt-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add detail
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-background-dark/50 border-t border-border-dark flex justify-end gap-3 font-semibold">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-muted-dark hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="matte-button-primary px-6"
                        disabled={!title.trim()}
                    >
                        Save to Library
                    </Button>
                </div>
            </div>
        </div>
    );
}
