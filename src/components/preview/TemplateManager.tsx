import { Plus, Check } from 'lucide-react';
import { useQuoteStore } from '../../stores/quoteStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui';

export function TemplateManager() {
    const { currentQuote, setTemplateBackgroundImage, savedTemplates } = useQuoteStore();
    const { setCurrentView } = useUIStore();

    const handleSelectTemplate = (url: string) => {
        setTemplateBackgroundImage(url);
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">

            {/* Create / Manage Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('templates')}
                className="flex-none h-14 border border-dashed border-border-dark light-mode:border-slate-300 hover:border-primary hover:bg-primary/5 hover:text-primary text-muted-dark light-mode:text-muted-light transition-all flex flex-col gap-1 items-center justify-center px-4"
                title="Manage Templates"
            >
                <Plus className="h-4 w-4" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Create</span>
            </Button>

            <div className="w-px h-8 bg-border-dark light-mode:bg-border-light mx-2 flex-none" />

            {/* Saved User Templates */}
            {savedTemplates.length === 0 ? (
                <div className="flex items-center justify-center px-4 h-14 text-muted-dark light-mode:text-muted-light text-xs italic">
                    No saved templates
                </div>
            ) : (
                savedTemplates.map((template) => {
                    const isActive = currentQuote.templateBackgroundImage === template.imageUrl;
                    return (
                        <button
                            key={template.id}
                            onClick={() => handleSelectTemplate(template.imageUrl)}
                            className={cn(
                                "flex-none group relative h-14 w-14 rounded-lg overflow-hidden border transition-all duration-200",
                                isActive
                                    ? "border-primary ring-2 ring-primary/50"
                                    : "border-border-dark light-mode:border-slate-200 hover:border-primary/50"
                            )}
                            title={template.name}
                        >
                            <img
                                src={template.imageUrl}
                                alt={template.name}
                                className="w-full h-full object-cover"
                            />
                            {isActive && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <div className="bg-primary text-white rounded-full p-0.5 shadow-sm">
                                        <Check className="h-3 w-3" />
                                    </div>
                                </div>
                            )}
                            {/* Hover Name Tooltip */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-0.5 text-[8px] text-white truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {template.name}
                            </div>
                        </button>
                    );
                })
            )}

        </div>
    );
}
