import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit3, Save, Share2, Paintbrush, Check } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const themes = [
  { value: 'blue', label: 'Ocean Blue', color: 'bg-[#7AB2D3]' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'green', label: 'Emerald Green', color: 'bg-emerald-500' },
];

export const Header = () => {
  const { form, isPreviewMode, setIsPreviewMode, themeColor, setThemeColor } = useFormContext();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Form saved!",
      description: "Your form has been saved successfully.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied!",
      description: "The form link has been copied to your clipboard.",
    });
  };

  const handleThemeChange = (color) => {
    setThemeColor(color);
    toast({
      title: "Theme updated!",
      description: `Switched to ${themes.find(t => t.value === color)?.label} theme.`,
    });
  };

  return (
    <header className="border-b border-primary/20 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isPreviewMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-primary p-2 rounded-lg"
          >
            {isPreviewMode ? (
              <Eye className="h-5 w-5 md:h-6 md:w-6 text-white" />
            ) : (
              <Edit3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
            )}
          </motion.div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-primary-dark">{form.title}</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" size="sm" onClick={handleSave} className="border-primary/30 hover:border-primary hover:bg-primary/5 hidden md:flex">
            <Save className="h-4 w-4 mr-2 text-primary" />
            <span className="hidden lg:inline">Save</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare} className="border-primary/30 hover:border-primary hover:bg-primary/5 hidden md:flex">
            <Share2 className="h-4 w-4 mr-2 text-primary" />
            <span className="hidden lg:inline">Share</span>
          </Button>

          {/* Preview Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10">
            <span className="text-xs md:text-sm font-medium text-primary-dark">Preview</span>
            <Switch
              checked={isPreviewMode}
              onCheckedChange={setIsPreviewMode}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
