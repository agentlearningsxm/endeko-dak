/**
 * Utility for local file system persistence using the Browser File System Access API.
 * This version supports Project Folders and Human-Readable Summaries.
 */

// --- TypeScript Definitions for File System Access API ---
declare global {
    interface Window {
        showSaveFilePicker(options?: any): Promise<FileSystemFileHandle>;
        showDirectoryPicker(options?: any): Promise<FileSystemDirectoryHandle>;
    }
}

interface FileSystemHandle {
    readonly kind: 'file' | 'directory';
    readonly name: string;
    queryPermission(descriptor?: { mode: 'read' | 'readwrite' }): Promise<'granted' | 'denied' | 'prompt'>;
    requestPermission(descriptor?: { mode: 'read' | 'readwrite' }): Promise<'granted' | 'denied' | 'prompt'>;
}

interface FileSystemFileHandle extends FileSystemHandle {
    readonly kind: 'file';
    getFile(): Promise<File>;
    createWritable(options?: { keepExistingData?: boolean }): Promise<FileSystemWritableFileStream>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
    readonly kind: 'directory';
    getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
    getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
    removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
    values(): AsyncIterableIterator<FileSystemHandle>;
}

interface FileSystemWritableFileStream extends WritableStream {
    write(data: any): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
    close(): Promise<void>;
}
// ---------------------------------------------------------

const ROOT_FOLDER_KEY = 'endeko-root-folder';
const HANDLE_STORE_NAME = 'endeko-file-handles';
const DB_NAME = 'EndekoDB';
const DB_VERSION = 1;

async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(HANDLE_STORE_NAME)) {
                db.createObjectStore(HANDLE_STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveHandle(key: string, handle: FileSystemHandle) {
    const db = await openDB();
    const tx = db.transaction(HANDLE_STORE_NAME, 'readwrite');
    tx.objectStore(HANDLE_STORE_NAME).put(handle, key);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

async function getHandle(key: string): Promise<FileSystemHandle | null> {
    const db = await openDB();
    const tx = db.transaction(HANDLE_STORE_NAME, 'readonly');
    const request = tx.objectStore(HANDLE_STORE_NAME).get(key);
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Request a root directory from the user
 */
export async function requestRootFolder(): Promise<boolean> {
    try {
        const handle = await window.showDirectoryPicker({
            mode: 'readwrite',
            startIn: 'documents'
        });
        await saveHandle(ROOT_FOLDER_KEY, handle);
        return true;
    } catch (error) {
        if ((error as Error).name === 'AbortError') return false;
        console.error('Failed to request directory handle:', error);
        return false;
    }
}

/**
 * Verify permissions for a handle
 */
async function verifyPermission(handle: FileSystemHandle, mode: 'read' | 'readwrite' = 'readwrite') {
    if ((await handle.queryPermission({ mode })) === 'granted') return true;
    if ((await handle.requestPermission({ mode })) === 'granted') return true;
    return false;
}

/**
 * Generate a human readable summary string
 */
function generateProjectSummary(data: any): string {
    const total = data.savedQuotes?.[0] ?
        (data.savedQuotes[0].isManualPricing === true ?
            (data.savedQuotes[0].manualSubtotal + data.savedQuotes[0].manualVat) :
            'Calculated in App'
        ) : 0;

    const clientName = data.savedQuotes?.[0]?.clientDetails?.name || 'No Client Set';
    const quoteCount = data.savedQuotes?.length || 0;
    const lastUpdate = new Date().toLocaleString();

    return `PROJECT SUMMARY
===========================================
Client: ${clientName}
Last Updated: ${lastUpdate}
Total Quotes: ${quoteCount}
Latest Quote Value: ${typeof total === 'number' ? '€' + total.toFixed(2) : total}
===========================================

This folder contains the project data for Endeko Dak.
DO NOT DELETE 'internal_data.json' or this project will be lost.
`;
}

/**
 * Save profile data to a specific Project Folder
 */
export async function saveProfileData(profileName: string, data: any): Promise<boolean> {
    try {
        const rootHandle = (await getHandle(ROOT_FOLDER_KEY)) as FileSystemDirectoryHandle | null;
        if (!rootHandle) return false;

        if (!(await verifyPermission(rootHandle))) return false;

        // Create or Get Profile Folder
        const folderName = profileName.replace(/[^a-z0-9 ]/gi, '_').trim();
        const profileDir = await rootHandle.getDirectoryHandle(folderName, { create: true });

        // 1. Save Internal JSON Data
        const jsonHandle = await profileDir.getFileHandle('internal_data.json', { create: true });
        const writableJson = await jsonHandle.createWritable();
        await writableJson.write(JSON.stringify(data, null, 2));
        await writableJson.close();

        // 2. Save Human Readable Summary
        const summaryHandle = await profileDir.getFileHandle('Project_Summary.txt', { create: true });
        const writableTxt = await summaryHandle.createWritable();
        await writableTxt.write(generateProjectSummary(data));
        await writableTxt.close();

        return true;
    } catch (error) {
        console.error(`Failed to save profile ${profileName}:`, error);
        return false;
    }
}

/**
 * Load profile data from a specific Project Folder
 */
export async function loadProfileData(profileName: string): Promise<any | null> {
    try {
        const rootHandle = (await getHandle(ROOT_FOLDER_KEY)) as FileSystemDirectoryHandle | null;
        if (!rootHandle) return null;

        if (!(await verifyPermission(rootHandle, 'read'))) return null;

        const folderName = profileName.replace(/[^a-z0-9 ]/gi, '_').trim();
        let profileDir: FileSystemDirectoryHandle;

        // Try to find the folder first
        try {
            profileDir = await rootHandle.getDirectoryHandle(folderName);
        } catch {
            // Fallback: Check for legacy .json file in root
            // If folder missing, maybe it's an old single-file profile
            return await loadLegacyProfile(rootHandle, profileName);
        }

        // Load from internal_data.json
        try {
            const fileHandle = await profileDir.getFileHandle('internal_data.json');
            const file = await fileHandle.getFile();
            const contents = await file.text();
            return JSON.parse(contents);
        } catch {
            return null;
        }
    } catch (error) {
        console.error(`Failed to load profile ${profileName}:`, error);
        return null;
    }
}

/**
 * Fallback to load legacy .json files from root
 */
async function loadLegacyProfile(rootHandle: FileSystemDirectoryHandle, profileName: string) {
    const fileName = `${profileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    try {
        const fileHandle = await rootHandle.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        const contents = await file.text();
        return JSON.parse(contents);
    } catch {
        return null;
    }
}

/**
 * List all existing profiles (Folders + Legacy JSON)
 */
export async function listAvailableProfiles(): Promise<string[]> {
    try {
        const rootHandle = (await getHandle(ROOT_FOLDER_KEY)) as FileSystemDirectoryHandle | null;
        if (!rootHandle) return [];

        if (!(await verifyPermission(rootHandle, 'read'))) return [];

        const profiles: Set<string> = new Set();

        for await (const entry of rootHandle.values()) {
            // Check for Folders
            if (entry.kind === 'directory') {
                profiles.add(entry.name.replace(/_/g, ' '));
            }
            // Check for Legacy JSON files
            else if (entry.kind === 'file' && entry.name.endsWith('.json') && entry.name !== 'internal_data.json') {
                profiles.add(entry.name.replace('.json', '').replace(/_/g, ' '));
            }
        }
        return Array.from(profiles);
    } catch (error) {
        console.error('Failed to list profiles:', error);
        return [];
    }
}

/**
 * Delete a profile folder
 */
export async function deleteProfileFolder(profileName: string): Promise<boolean> {
    try {
        const rootHandle = (await getHandle(ROOT_FOLDER_KEY)) as FileSystemDirectoryHandle | null;
        if (!rootHandle) return false;

        if (!(await verifyPermission(rootHandle))) return false;

        const folderName = profileName.replace(/[^a-z0-9 ]/gi, '_').trim();

        // Try deleting directory
        try {
            await rootHandle.removeEntry(folderName, { recursive: true });
            return true;
        } catch {
            // Try deleting legacy json
            try {
                const fileName = `${profileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
                await rootHandle.removeEntry(fileName);
                return true;
            } catch {
                return false;
            }
        }
    } catch (error) {
        console.error(`Failed to delete profile ${profileName}:`, error);
        return false;
    }
}

/**
 * Check if a root folder is configured
 */
export async function isWorkspaceConfigured(): Promise<boolean> {
    const handle = await getHandle(ROOT_FOLDER_KEY);
    return !!handle;
}
