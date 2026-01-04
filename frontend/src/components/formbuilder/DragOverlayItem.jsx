import React from 'react';
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
  MapPin
} from 'lucide-react';

const questionIconMap = {
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Calendar,
  Upload,
};

const smartIconMap = {
  User,
  Mail,
  Phone,
  Users,
  MapPin,
  Calendar,
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

const typeIcons = {
  'short-text': 'Type',
  'paragraph': 'AlignLeft',
  'multiple-choice': 'CircleDot',
  'checkbox': 'CheckSquare',
  'dropdown': 'ChevronDown',
  'date': 'Calendar',
  'file-upload': 'Upload',
};

export const DragOverlayItem = ({ type, smartField }) => {
  if (smartField) {
    const Icon = smartIconMap[smartField.icon];
    return (
      <div className="w-64 p-4 bg-white border-2 border-primary rounded-xl shadow-xl cursor-grabbing">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <span className="font-medium">{smartField.name}</span>
        </div>
      </div>
    );
  }

  if (type) {
    const Icon = questionIconMap[typeIcons[type]];
    return (
      <div className="w-64 p-4 bg-white border-2 border-primary rounded-xl shadow-xl cursor-grabbing">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <div className="flex flex-col">
            <span className="font-medium">{typeLabels[type]}</span>
            <span className="text-sm text-muted-foreground">New question</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
