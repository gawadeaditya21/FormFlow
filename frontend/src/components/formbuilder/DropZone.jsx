import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const DropZone = ({ index, isDragging }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${index}`,
    data: {
      isDropZone: true,
      index,
    },
  });

  const showZone = isDragging || isOver;

  if (!showZone) {
    return (
      <div
        ref={setNodeRef}
        className="h-2 transition-all duration-200"
      />
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ height: 8, opacity: 0 }}
      animate={{
        height: isOver ? 80 : 40,
        opacity: isOver ? 1 : 0.6,
      }}
      className={`relative transition-all duration-200 ${
        isOver ? 'my-4' : 'my-2'
      }`}
    >
      <div
        className={`absolute inset-0 border-2 border-dashed rounded-lg flex items-center justify-center transition-all ${
          isOver
            ? 'border-primary bg-primary/10 scale-105'
            : 'border-primary/30 bg-primary/5'
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Plus className="h-5 w-5" />
          <span>{isOver ? 'Drop here to add' : 'Drag here'}</span>
        </div>
      </div>
    </motion.div>
  );
};
