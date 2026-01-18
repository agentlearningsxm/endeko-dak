import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useQuoteStore } from './stores/quoteStore';
import { useUIStore } from './stores/uiStore';
import { AppShell } from './components/layout/AppShell';
import { LibraryPanel } from './components/library';
import { BuilderCanvas } from './components/builder';
import { PreviewPanel } from './components/preview';
import { Toasts } from './components/Toasts';
import { SettingsModal } from './components/modals/SettingsModal';
import { SavedQuotesModal } from './components/modals/SavedQuotesModal';
import type { BlockType } from './types/blocks';

import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { TemplateLibrary } from './components/preview/TemplateLibrary';

// Import i18n
import './i18n';

function App() {
  const { addBlock, reorderBlocks, currentQuote } = useQuoteStore();
  const { setIsDragging, isDragging, activeModal, currentView } = useUIStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    setIsDragging(true, data?.type || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setIsDragging(false, null);

    if (!over) return;

    const activeData = active.data.current;

    // Library item dropped on canvas
    if (activeData?.origin === 'library' && over.id === 'builder-canvas') {
      const { type, data } = activeData as { type: BlockType; data: object };
      addBlock(type, data);
      return;
    }

    // Reordering within canvas
    if (activeData?.origin === 'canvas') {
      const overData = over.data.current;

      if (overData?.origin === 'canvas' && active.id !== over.id) {
        const blocks = currentQuote.blocks;
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          reorderBlocks(oldIndex, newIndex);
        }
      }
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'builder':
        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <AppShell
              libraryPanel={<LibraryPanel />}
              builderPanel={<BuilderCanvas />}
              previewPanel={<PreviewPanel />}
            />

            {/* Drag Overlay */}
            <DragOverlay>
              {isDragging && (
                <div className="px-4 py-2 rounded-lg bg-primary/20 border border-primary text-white text-sm font-medium shadow-lg backdrop-blur-md">
                  Drag to add
                </div>
              )}
            </DragOverlay>

            {/* Modals */}
            {activeModal === 'settings' && <SettingsModal />}
            {activeModal === 'savedQuotes' && <SavedQuotesModal />}

            {/* Toasts */}
            <Toasts />
          </DndContext>
        );
      case 'templates':
        return <TemplateLibrary />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <>
      {renderView()}
      {/* Global Toasts (Login/Dashboard also need toasts potentially) */}
      {currentView !== 'builder' && <Toasts />}
    </>
  );
}

export default App;
