import React from 'react';

export const RadioGroup = ({ children, value, onValueChange, className = '' }) => {
  return (
    <div className={`grid gap-2 ${className}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { selectedValue: value, onValueChange })
      )}
    </div>
  );
};

export const RadioGroupItem = React.forwardRef(
  ({ value, selectedValue, onValueChange, id, className = '', ...props }, ref) => {
    const isChecked = value === selectedValue;
    
    return (
      <button
        type="button"
        role="radio"
        aria-checked={isChecked}
        onClick={() => onValueChange?.(value)}
        id={id}
        className={`aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      >
        {isChecked && (
          <div className="flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-current" />
          </div>
        )}
      </button>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';
