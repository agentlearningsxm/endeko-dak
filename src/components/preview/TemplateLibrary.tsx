import { useState, useCallback } from 'react';
import { Upload, Trash2, ArrowLeft, Link as LinkIcon, Plus, FileSpreadsheet, X, Check } from 'lucide-react';
import { useQuoteStore } from '../../stores/quoteStore';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../ui';
import { cn } from '../../lib/utils';

export function TemplateLibrary() {
    const { savedTemplates, addSavedTemplate, deleteSavedTemplate } = useQuoteStore();
    const { setCurrentView } = useUIStore();

    const [isUrlMode, setIsUrlMode] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    // New state for post-upload naming flow
    const [pendingImage, setPendingImage] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleImageLoad = (src: string, originalName?: string) => {
        setPendingImage(src);
        // Pre-fill name if available and not already typed manually
        if (originalName && !nameInput) {
            const cleanName = originalName.split('.')[0];
            // Capitalize first letter
            setNameInput(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    handleImageLoad(event.target.result as string, file.name);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [nameInput]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    handleImageLoad(event.target.result as string, file.name);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput) {
            handleImageLoad(urlInput);
            setUrlInput('');
            setIsUrlMode(false);
        }
    };

    const handleSaveTemplate = () => {
        if (pendingImage && nameInput) {
            addSavedTemplate(nameInput, pendingImage);
            setPendingImage(null);
            setNameInput('');
        }
    };

    const handleCancelPending = () => {
        setPendingImage(null);
        setNameInput('');
    };

    return (
        <div className="h-full flex flex-col bg-background-dark light-mode:bg-background-light p-8 overflow-y-auto relative">

            {/* Post-Upload Naming Modal/Overlay */}
            {pendingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-panel-dark light-mode:bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-border-dark light-mode:border-slate-200">
                        {/* Header */}
                        <div className="p-4 border-b border-border-dark light-mode:border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-foreground">Name Your Template</h3>
                            <button onClick={handleCancelPending} className="text-muted-dark hover:text-foreground transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Preview */}
                            <div className="aspect-[2/1] bg-black/5 rounded-lg overflow-hidden border border-border-dark light-mode:border-slate-200">
                                <img src={pendingImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>

                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-dark light-mode:text-muted-light">Template Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g., Summer Invoice 2025"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTemplate()}
                                    className="w-full px-4 py-2 rounded-lg bg-black/20 light-mode:bg-slate-100 border border-border-dark light-mode:border-slate-300 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="ghost" onClick={handleCancelPending}>Cancel</Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSaveTemplate}
                                    disabled={!nameInput.trim()}
                                    className="matte-button-primary"
                                >
                                    <Check className="h-4 w-4 mr-2" /> Save Template
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto w-full space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentView('builder')}
                        className="p-2 hover:bg-white/10 light-mode:hover:bg-slate-200 rounded-full transition-colors text-foreground"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Template Library</h1>
                        <p className="text-muted-dark light-mode:text-muted-light">Manage your custom PDF background templates.</p>
                    </div>
                </div>

                {/* Add New Template Section */}
                <div className="bg-panel-dark light-mode:bg-white p-6 rounded-xl border border-border-dark light-mode:border-border-light shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6 items-start">

                        {/* Upload / Drop Zone (Full Width) */}
                        <div className="flex-1 w-full relative">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-semibold text-foreground">Create New Template</h2>
                                {/* Toggle URL/Upload */}
                                <div className="flex gap-2">
                                    <Button
                                        variant={!isUrlMode ? "primary" : "ghost"}
                                        size="sm"
                                        onClick={() => setIsUrlMode(false)}
                                        className={!isUrlMode ? "matte-button-primary" : "matte-button-ghost"}
                                    >
                                        <Upload className="h-4 w-4 mr-2" /> Upload
                                    </Button>
                                    <Button
                                        variant={isUrlMode ? "primary" : "ghost"}
                                        size="sm"
                                        onClick={() => setIsUrlMode(true)}
                                        className={isUrlMode ? "matte-button-primary" : "matte-button-ghost"}
                                    >
                                        <LinkIcon className="h-4 w-4 mr-2" /> From URL
                                    </Button>
                                </div>
                            </div>

                            {isUrlMode ? (
                                <div className="flex gap-2 mt-4 p-8 border-2 border-dashed border-border-dark light-mode:border-slate-300 rounded-lg bg-black/5 light-mode:bg-slate-50">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-black/20 light-mode:bg-slate-100 border border-border-dark light-mode:border-slate-300 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={handleUrlSubmit}
                                        disabled={!urlInput}
                                        className="matte-button-primary"
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Preview
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative mt-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="lib-upload"
                                    />
                                    <label
                                        htmlFor="lib-upload"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 group",
                                            isDragOver
                                                ? "border-primary bg-primary/10 scale-[1.01]"
                                                : "border-border-dark light-mode:border-slate-300 hover:bg-white/5 light-mode:hover:bg-slate-50 hover:border-primary/50"
                                        )}
                                    >
                                        <div className="rounded-full bg-primary/10 p-4 mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className={cn("h-8 w-8", isDragOver ? "text-primary" : "text-muted-dark light-mode:text-muted-light")} />
                                        </div>
                                        <span className="text-lg font-medium text-foreground">Jump and drop or Upload</span>
                                        <span className="text-xs text-muted-dark light-mode:text-muted-light mt-1">Supports JPG, PNG • Max 5MB</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Existing Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedTemplates.map((template) => (
                        <div key={template.id} className="group relative aspect-[1/1.414] bg-white rounded-lg shadow-sm border border-border-dark light-mode:border-slate-200 overflow-hidden">
                            <img
                                src={template.imageUrl}
                                alt={template.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <h3 className="text-white font-bold text-lg mb-4 text-center">{template.name}</h3>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteSavedTemplate(template.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                            {/* Label (Always Visible) */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 border-t border-white/10">
                                <h4 className="text-white text-sm font-medium truncate">{template.name}</h4>
                                <span className="text-xs text-white/60">{new Date(template.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {savedTemplates.length === 0 && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-dark light-mode:text-muted-light opacity-60">
                            <div className="h-16 w-16 mb-4 rounded-full bg-black/10 flex items-center justify-center">
                                <FileSpreadsheet className="h-8 w-8" />
                            </div>
                            <p>No templates created yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
