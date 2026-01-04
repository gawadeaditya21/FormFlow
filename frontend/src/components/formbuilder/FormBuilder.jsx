import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useFormContext } from '../../context/FormContext';
import { Header } from './Header';
import { UnifiedSidebar } from './UnifiedSidebar';
import { FormCanvas } from './FormCanvas';
import { FormPreview } from './FormPreview';
import { DragOverlayItem } from './DragOverlayItem';

export const FormBuilder = () => {
  const { isPreviewMode, addQuestion, addSmartField, reorderQuestions } = useFormContext();
  const [activeType, setActiveType] = useState(null);
  const [activeSmartField, setActiveSmartField] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragStart = (event) => {
    const { active } = event;
    const data = active.data.current;
    setIsDragging(true);

    if (data?.isFromSidebar) {
      setActiveType(data.type);
    } else if (data?.isSmartField) {
      setActiveSmartField(data.smartField);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);

    const currentActiveType = activeType;
    const currentActiveSmartField = activeSmartField;
    setActiveType(null);
    setActiveSmartField(null);

    if (!over) {
      return;
    }

    const activeData = active.data.current;

    // Handle dropping from sidebar - check if dropping on a drop zone
    if (activeData?.isFromSidebar) {
      const overData = over.data.current;
      if (overData?.isDropZone) {
        addQuestion(activeData.type, overData.index);
        return;
      } else if (over.id === 'canvas') {
        addQuestion(activeData.type);
        return;
      }
    }

    // Handle dropping smart field
    if (activeData?.isSmartField) {
      const overData = over.data.current;
      if (overData?.isDropZone) {
        addSmartField(activeData.smartField, overData.index);
        return;
      } else if (over.id === 'canvas') {
        addSmartField(activeData.smartField);
        return;
      }
    }

    // Handle reordering
    if (!activeData?.isFromSidebar && !activeData?.isSmartField && active.id !== over.id) {
      reorderQuestions(active.id, over.id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-gradient-to-br from-primary-lighter to-white">
        <Header />
        {isPreviewMode ? (
          <FormPreview />
        ) : (
          <div className="flex-1 flex overflow-hidden">
            <UnifiedSidebar />
            <FormCanvas isDragging={isDragging} />
          </div>
        )}
        <DragOverlay>
          {activeType && <DragOverlayItem type={activeType} />}
          {activeSmartField && <DragOverlayItem smartField={activeSmartField} />}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
