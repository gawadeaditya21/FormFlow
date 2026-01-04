import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GripVertical,
  Trash2,
  Copy,
  Plus,
  X,
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Calendar,
  Upload
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { QUESTION_TYPES } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const iconMap = {
  'short-text': Type,
  'paragraph': AlignLeft,
  'multiple-choice': CircleDot,
  'checkbox': CheckSquare,
  'dropdown': ChevronDown,
  'date': Calendar,
  'file-upload': Upload,
};

const typeLabels = {
  'short-text': 'Short Answer',
  'paragraph': 'Paragraph',
  'multiple-choice': 'Multiple Choice',
  'checkbox': 'Checkboxes',
  'dropdown': 'Dropdown',
  'date': 'Date',
  'file-upload': 'File Upload',
};

export const QuestionCard = ({ question, index }) => {
  const { updateQuestion, deleteQuestion, duplicateQuestion, activeQuestionId, setActiveQuestionId } = useFormContext();
  const isActive = activeQuestionId === question.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = iconMap[question.type];

  const handleAddOption = () => {
    const newOption = { id: uuidv4(), value: `Option ${(question.options?.length || 0) + 1}` };
    updateQuestion(question.id, {
      options: [...(question.options || []), newOption],
    });
  };

  const handleRemoveOption = (optionId) => {
    if (question.options && question.options.length <= 1) return; // Prevent removing last option
    updateQuestion(question.id, {
      options: question.options?.filter(opt => opt.id !== optionId),
    });
  };

  const handleUpdateOption = (optionId, value) => {
    updateQuestion(question.id, {
      options: question.options?.map(opt =>
        opt.id === optionId ? { ...opt, value } : opt
      ),
    });
  };

  const handleCardClick = () => {
    setActiveQuestionId(question.id);
  };

  const handleTypeChange = (newType) => {
    const needsOptions = ['multiple-choice', 'checkbox', 'dropdown'].includes(newType);
    const hasExistingOptions = question.options && question.options.length > 0;

    let newOptions = question.options;
    
    // Initialize options for types that need them
    if (needsOptions && !hasExistingOptions) {
      if (newType === 'dropdown') {
        newOptions = [
          { id: uuidv4(), value: 'Option 1' },
          { id: uuidv4(), value: 'Option 2' },
        ];
      } else {
        newOptions = [
          { id: uuidv4(), value: 'Option 1' },
          { id: uuidv4(), value: 'Option 2' },
        ];
      }
    }

    updateQuestion(question.id, {
      type: newType,
      options: needsOptions ? newOptions : undefined,
    });
  };

  const hasOptions = ['multiple-choice', 'checkbox', 'dropdown'].includes(question.type);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border-2 shadow-sm transition-all duration-200 ${
        isActive 
          ? 'border-primary shadow-lg ring-4 ring-primary/10' 
          : 'border-border hover:border-primary/50 hover:shadow-md'
      } ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-pointer'}`}
    >
      {/* Floating Actions - Top Right */}
      <div className="absolute -top-3 -right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          variant="secondary"
          className="h-9 w-9 p-0 rounded-full shadow-lg bg-white hover:bg-accent border-2 border-primary/20"
          onClick={(e) => { e.stopPropagation(); duplicateQuestion(question.id); }}
        >
          <Copy className="h-4 w-4 text-primary" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-9 w-9 p-0 rounded-full shadow-lg"
          onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-3 top-6 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-5 w-5 text-primary" />
      </div>

      {/* Question Content */}
      <div className="p-6 pl-12 space-y-4">
        {/* Type Switcher & Index */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            value={question.type}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger
              className="w-[220px] border-primary/30 focus:border-primary focus:ring-primary/20 bg-primary/5"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-primary" />}
                  <span className="font-medium text-primary-dark">{typeLabels[question.type]}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((qt) => {
                const QtIcon = iconMap[qt.type];
                return (
                  <SelectItem key={qt.type} value={qt.type}>
                    <div className="flex items-center gap-2">
                      {QtIcon && <QtIcon className="h-4 w-4 text-primary" />}
                      <span>{qt.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            #{index + 1}
          </div>
        </div>

        {/* Question Label */}
        <Input
          value={question.label}
          onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent text-primary-dark"
          placeholder="Enter your question"
        />

        {/* Description */}
        <Input
          value={question.description || ''}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-muted-foreground border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent"
          placeholder="Add description (optional)"
        />

        {/* Options for multiple choice, checkbox, dropdown */}
        {hasOptions && (
          <div className="space-y-3 pt-2">
            <AnimatePresence mode="popLayout">
              {question.options?.map((option, optIndex) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 bg-accent-mint/30 rounded-lg p-2"
                >
                  {question.type === 'multiple-choice' && (
                    <CircleDot className="h-5 w-5 text-primary shrink-0" />
                  )}
                  {question.type === 'checkbox' && (
                    <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                  )}
                  {question.type === 'dropdown' && (
                    <span className="text-sm font-medium text-primary shrink-0 w-6">
                      {optIndex + 1}.
                    </span>
                  )}
                  <Input
                    value={option.value}
                    onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 h-9 text-sm border-primary/20 focus:border-primary"
                    placeholder={`Option ${optIndex + 1}`}
                  />
                  {question.options && question.options.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); handleRemoveOption(option.id); }}
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); handleAddOption(); }}
              className="text-primary hover:text-primary hover:bg-primary/10 w-full justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add option
            </Button>
          </div>
        )}

        {/* Preview inputs for other types */}
        {question.type === 'short-text' && (
          <Input
            disabled
            placeholder="Short answer text"
            className="mt-2 bg-accent-mint/20"
          />
        )}

        {question.type === 'paragraph' && (
          <Textarea
            disabled
            placeholder="Long answer text"
            className="mt-2 bg-accent-mint/20"
            rows={3}
          />
        )}

        {question.type === 'date' && (
          <Input
            type="date"
            disabled
            className="mt-2 bg-accent-mint/20"
          />
        )}

        {question.type === 'file-upload' && (
          <div className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-accent-mint/20">
            <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">File upload area</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
          <div className="flex items-center gap-3">
            <Switch
              checked={question.required}
              onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
              onClick={(e) => e.stopPropagation()}
            />
            <Label className="text-sm font-medium cursor-pointer text-primary-dark">Required</Label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
