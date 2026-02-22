import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            value,
            onValueChange,
            open,
            setOpen,
          });
        }

        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            value,
            open,
            setOpen,
          });
        }

        return child;
      })}
    </div>
  );
};

export const SelectTrigger = ({ children, className = '', value, open, setOpen, ...props }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpen?.(!open);
      }}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue = ({ children }) => {
  return <span>{children}</span>;
};

export const SelectContent = ({ children, value, onValueChange, open, setOpen }) => {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={() => setOpen(false)}
      />
      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
        {React.Children.map(children, child =>
          React.cloneElement(child, { onValueChange, setOpen, selectedValue: value })
        )}
      </div>
    </>
  );
};

export const SelectItem = ({ children, value, onValueChange, setOpen, selectedValue }) => {
  const isSelected = selectedValue === value;
  
  return (
    <div
      onClick={() => {
        onValueChange?.(value);
        setOpen?.(false);
      }}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      {children}
    </div>
  );
};
