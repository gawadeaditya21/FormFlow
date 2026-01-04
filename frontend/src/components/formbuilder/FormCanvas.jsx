import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';
import { QuestionCard } from './QuestionCard';
import { DropZone } from './DropZone';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const FormCanvas = ({ isDragging = false }) => {
  const { form, updateFormTitle, updateFormDescription, addQuestion, setActiveQuestionId } = useFormContext();
  
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const handleCanvasClick = () => {
    setActiveQuestionId(null);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCanvasClick}
      className="flex-1 overflow-y-auto bg-sky-100/70"
    >
      {/* Remove max-w-4xl to use full width */}
      <div className="w-full h-full px-4 md:px-6 lg:px-8 xl:px-12 py-4 md:py-8 space-y-6">
        {/* Form Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden"
        >
          {/* Gradient Header Bar */}
          <div className="h-4 bg-gradient-primary" />
          
          <div className="p-6 md:p-8 space-y-4">
            <Input
              value={form.title}
              onChange={(e) => updateFormTitle(e.target.value)}
              className="text-3xl lg:text-4xl font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent tracking-tight text-primary-dark"
              placeholder="Form title"
            />
            <Textarea
              value={form.description}
              onChange={(e) => updateFormDescription(e.target.value)}
              className="text-muted-foreground border-none shadow-none px-0 resize-none focus-visible:ring-0 bg-transparent text-base"
              placeholder="Form description"
              rows={2}
            />
          </div>
        </motion.div>

        {/* Drop Zone at Start */}
        <DropZone index={0} isDragging={isDragging} />

        {/* Questions List with Drop Zones */}
        <SortableContext
          items={form.questions.map(q => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {form.questions.map((question, index) => (
              <React.Fragment key={question.id}>
                <QuestionCard
                  question={question}
                  index={index}
                />
                {/* Drop Zone after each question */}
                <DropZone index={index + 1} isDragging={isDragging} />
              </React.Fragment>
            ))}
          </AnimatePresence>
        </SortableContext>

        {/* Empty State */}
        {form.questions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-12 md:p-16 lg:p-20 border-2 border-dashed rounded-2xl text-center transition-all duration-300 ${
              isDragging || isOver
                ? 'border-primary bg-primary/5'
                : 'border-border bg-white'
            }`}
          >
            <FileText className={`h-16 w-16 md:h-20 md:w-20 mx-auto mb-4 ${isDragging || isOver ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="text-xl md:text-2xl font-semibold mb-2 text-primary-dark">
              {isDragging || isOver ? 'Drop to add question' : 'Start building your form'}
            </h3>
            <p className="text-muted-foreground text-base md:text-lg">
              Drag items from the sidebar or click to add questions
            </p>
          </motion.div>
        )}

        {/* Add Question Button */}
        {form.questions.length > 0 && (
          <motion.button
            onClick={(e) => { e.stopPropagation(); addQuestion('short-text'); }}
            className="w-full p-4 md:p-5 border-2 border-dashed border-primary/30 rounded-xl text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-base md:text-lg"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus className="h-5 w-5 md:h-6 md:w-6" />
            <span>Add question</span>
          </motion.button>
        )}

        {/* Add some bottom padding */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};
