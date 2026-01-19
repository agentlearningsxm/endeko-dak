import React, { useState, useEffect } from 'react';
import { useQuoteStore } from '../../stores/quoteStore';
import { Folder, UserPlus, Users, CheckCircle2, AlertCircle, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const ProfileManager: React.FC = () => {
    const {
        isLocalSyncActive,
        lastSyncedAt,
        setupWorkspace,
        checkWorkspaceStatus,
        activeProfile,
        profiles,
        createProfile,
        switchProfile,
        deleteProfile
    } = useQuoteStore();

    const [isCreating, setIsCreating] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');

    useEffect(() => {
        checkWorkspaceStatus();
    }, [checkWorkspaceStatus]);

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProfileName.trim()) return;
        await createProfile(newProfileName.trim());
        setNewProfileName('');
        setIsCreating(false);
    };

    return (
        <div className="flex items-center gap-4 px-4 py-1.5 bg-slate-900/80 border-b border-white/10 backdrop-blur-xl z-50 overflow-x-auto whitespace-nowrap">
            {/* Folder Connection */}
            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                {isLocalSyncActive ? (
                    <CheckCircle2 size={14} className="text-green-400" />
                ) : (
                    <AlertCircle size={14} className="text-amber-400" />
                )}
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    {isLocalSyncActive ? 'Workspace Connected' : 'Folder Not Set'}
                </span>
                {!isLocalSyncActive && (
                    <button
                        onClick={setupWorkspace}
                        className="ml-2 flex items-center gap-1.5 px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-md hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                        <Folder size={12} />
                        SELECT WORKSPACE FOLDER
                    </button>
                )}
                {isLocalSyncActive && (
                    <button
                        onClick={setupWorkspace}
                        className="ml-1 p-1 text-slate-500 hover:text-white transition-colors"
                        title="Change Workspace Folder"
                    >
                        <RefreshCw size={12} />
                    </button>
                )}
            </div>

            {/* Profile Selection */}
            {isLocalSyncActive && (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Users size={14} />
                        <span className="text-[11px] font-semibold">Profile:</span>
                    </div>

                    <select
                        value={activeProfile}
                        onChange={(e) => switchProfile(e.target.value)}
                        className="bg-slate-800 border border-white/5 text-slate-200 text-[11px] font-medium rounded px-2 py-0.5 outline-none hover:border-primary/50 transition-colors cursor-pointer"
                    >
                        {profiles.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete profile "${activeProfile}"? This cannot be undone.`)) {
                                deleteProfile(activeProfile);
                            }
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete current profile"
                    >
                        <Trash2 size={12} />
                    </button>

                    {!isCreating ? (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-wide"
                        >
                            <UserPlus size={12} />
                            New Profile
                        </button>
                    ) : (
                        <form onSubmit={handleCreateProfile} className="flex items-center gap-2">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Profile name..."
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                className="bg-slate-800 border-b border-primary text-slate-100 text-[11px] px-2 py-0.5 outline-none min-w-[120px]"
                            />
                            <button
                                type="submit"
                                className="p-1 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                            >
                                <Plus size={12} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="text-[10px] text-slate-500 hover:text-slate-300 px-1"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Sync Info */}
            {isLocalSyncActive && lastSyncedAt && (
                <div className="ml-auto flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 italic">
                        Saved to "{activeProfile}.json" at {format(new Date(lastSyncedAt), 'HH:mm:ss')}
                    </span>
                </div>
            )}
        </div>
    );
};
