import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ children, type = 'single', defaultValue, className = '' }) => {
  const [openItems, setOpenItems] = useState(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  );

  const toggleItem = (value) => {
    if (type === 'multiple') {
      setOpenItems(prev =>
        prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
      );
    } else {
      setOpenItems(prev => (prev.includes(value) ? [] : [value]));
    }
  };

  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { openItems, toggleItem })
      )}
    </div>
  );
};

export const AccordionItem = ({ children, value, openItems, toggleItem, className = '' }) => {
  const isOpen = openItems?.includes(value);
  
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, isOpen, toggleItem })
      )}
    </div>
  );
};

export const AccordionTrigger = ({ children, value, isOpen, toggleItem, className = '' }) => {
  return (
    <button
      type="button"
      onClick={() => toggleItem?.(value)}
      className={`flex w-full items-center justify-between text-left font-medium transition-all ${className}`}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
  );
};

export const AccordionContent = ({ children, isOpen, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <div className={`overflow-hidden text-sm transition-all ${className}`}>
      {children}
    </div>
  );
};
