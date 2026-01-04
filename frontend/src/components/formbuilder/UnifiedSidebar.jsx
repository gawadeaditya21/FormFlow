import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import {
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Calendar,
  Upload,
  User,
  Mail,
  Phone,
  Users,
  MapPin,
  GripVertical
} from 'lucide-react';
import { QUESTION_TYPES, SMART_FIELDS } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const iconMap = {
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Calendar,
  Upload,
  User,
  Mail,
  Phone,
  Users,
  MapPin,
};

const DraggableItem = ({ type, name, icon, index }) => {
  const { addQuestion } = useFormContext();
  const dragId = `sidebar-${type}`;
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: { type, isFromSidebar: true },
  });

  const Icon = iconMap[icon];

  const handleClick = () => {
    addQuestion(type);
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group flex items-center gap-3 p-3 rounded-lg cursor-move transition-all duration-200 ${
        isDragging
          ? 'opacity-50'
          : 'hover:bg-primary/10 hover:shadow-md active:scale-95 border border-transparent hover:border-primary/20'
      }`}
      whileHover={{ x: 4 }}
      layout
    >
      <GripVertical className="h-4 w-4 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      {Icon && <Icon className="h-5 w-5 text-primary shrink-0" />}
      <span className="text-sm font-medium text-primary-dark">{name}</span>
    </motion.div>
  );
};

const SmartFieldItem = ({ field, index }) => {
  const { addSmartField } = useFormContext();
  const dragId = `smart-${field.id}`;
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: { smartField: field, isSmartField: true },
  });

  const Icon = iconMap[field.icon];

  const handleClick = () => {
    addSmartField(field);
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group flex items-center gap-3 p-3 rounded-lg cursor-move transition-all duration-200 ${
        isDragging
          ? 'opacity-50'
          : 'hover:bg-primary/10 hover:shadow-md active:scale-95 border border-transparent hover:border-primary/20'
      }`}
      whileHover={{ x: 4 }}
      layout
    >
      <GripVertical className="h-4 w-4 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      {Icon && <Icon className="h-5 w-5 text-primary shrink-0" />}
      <span className="text-sm font-medium text-primary-dark">{field.name}</span>
    </motion.div>
  );
};

export const UnifiedSidebar = () => {
  return (
    <aside className="w-72 lg:w-80 bg-white border-r border-primary/20 flex flex-col h-full shadow-sm">
      <div className="p-6  bg-gradient-to-b from-sky-400/50 to-white">
        <h2 className="text-xl font-bold text-primary-dark">Form Elements</h2>
        <p className="text-sm text-cyan-800/90">
          Drag or click to add
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="multiple" defaultValue={["questions", "smart"]} className="space-y-3">
          <AccordionItem value="questions" className="border border-primary/20 rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-3">
              <span className="font-semibold text-primary-dark">Question Types</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pb-3">
              {QUESTION_TYPES.map((item, index) => (
                <DraggableItem
                  key={item.type}
                  type={item.type}
                  name={item.name}
                  icon={item.icon}
                  index={index}
                />
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="smart" className="border border-primary/20 rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-3">
              <span className="font-semibold text-primary-dark">Smart Fields</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pb-3">
              {SMART_FIELDS.map((field, index) => (
                <SmartFieldItem
                  key={field.id}
                  field={field}
                  index={index}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};
