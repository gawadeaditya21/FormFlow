import React, { useState } from 'react';

export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, asChild, open, setOpen }) => {
  const child = asChild ? React.Children.only(children) : children;
  
  return React.cloneElement(child, {
    onClick: () => setOpen?.(!open),
  });
};

export const DropdownMenuContent = ({ children, align = 'center', open, setOpen, className = '' }) => {
  if (!open) return null;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={() => setOpen(false)}
      />
      <div
        className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${alignmentClasses[align]} ${className}`}
      >
        {React.Children.map(children, child =>
          React.cloneElement(child, { setOpen })
        )}
      </div>
    </>
  );
};

export const DropdownMenuItem = ({ children, onClick, setOpen, className = '' }) => {
  return (
    <div
      onClick={(e) => {
        onClick?.(e);
        setOpen?.(false);
      }}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
    >
      {children}
    </div>
  );
};
