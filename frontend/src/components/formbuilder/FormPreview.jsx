import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from '../../context/FormContext';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useToast } from '../../hooks/use-toast';

const QuestionPreview = ({ question, index }) => {
  const [value, setValue] = useState('');

  const renderInput = () => {
    switch (question.type) {
      case 'short-text':
        return (
          <Input
            type="text"
            placeholder="Your answer"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-primary/30 focus:border-primary"
          />
        );

      case 'paragraph':
        return (
          <Textarea
            placeholder="Your answer"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-primary/30 focus:border-primary"
          />
        );

      case 'multiple-choice':
        return (
          <RadioGroup value={value} onValueChange={setValue}>
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer">{option.value}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <Checkbox
                  id={option.id}
                  checked={Array.isArray(value) && value.includes(option.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue([...(Array.isArray(value) ? value : []), option.id]);
                    } else {
                      setValue(value.filter((v) => v !== option.id));
                    }
                  }}
                />
                <Label htmlFor={option.id} className="cursor-pointer">{option.value}</Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="border-primary/30 focus:border-primary">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-primary/30 focus:border-primary"
          />
        );

      case 'file-upload':
        return (
          <Input
            type="file"
            onChange={(e) => setValue(e.target.files?.[0]?.name || '')}
            className="border-primary/30 focus:border-primary"
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm space-y-4"
    >
      <div>
        <Label className="text-base font-semibold text-primary-dark">
          {question.label}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {question.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {question.description}
          </p>
        )}
      </div>
      {renderInput()}
    </motion.div>
  );
};

export const FormPreview = () => {
  const { form } = useFormContext();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Form submitted!",
      description: "This is a preview - responses aren't saved yet.",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-sky-100/70">
      {/* Remove max-w-3xl for full width */}
      <form onSubmit={handleSubmit} className="w-full h-full px-4 md:px-6 lg:px-8 xl:px-12 py-4 md:py-8 space-y-6">
        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden"
        >
          <div className="h-4 bg-gradient-primary" />
          <div className="p-6 md:p-8 space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-primary-dark">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-muted-foreground text-base">
                {form.description}
              </p>
            )}
            <p className="text-sm text-destructive">* Required</p>
          </div>
        </motion.div>

        {/* Questions */}
        {form.questions.map((question, index) => (
          <QuestionPreview key={question.id} question={question} index={index} />
        ))}

        {/* Submit Button */}
        {form.questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: form.questions.length * 0.1 }}
          >
            <Button type="submit" size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white shadow-lg">
              Submit
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {form.questions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-white rounded-2xl border border-primary/10 shadow-sm">
            No questions yet. Add some questions to see the preview!
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-8"></div>
      </form>
    </div>
  );
};
