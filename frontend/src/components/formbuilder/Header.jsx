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
  { value: 'purple', label: 'Lavender', color: 'bg-violet-500' },
  { value: 'pink', label: 'Blush Pink', color: 'bg-pink-400' },
  { value: 'green', label: 'Emerald Green', color: 'bg-emerald-500' },
];

export const Header = () => {
  const {
    form,
    isPreviewMode,
    setIsPreviewMode,
    themeColor,
    setThemeColor,
    saveFormToServer,
    shareForm,
    isSaving,
    isPublishing,
  } = useFormContext();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveFormToServer();
      toast({
        title: "Saved",
        description: "Form saved to server.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err.message || 'Could not save form.',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async () => {
    try {
      const res = await shareForm();
      // server response expected to include shareToken or shareUrl
      const token = res?.shareToken || (res?.shareUrl && res.shareUrl.split('/').pop());
      const url = res?.shareUrl
        ? (res.shareUrl.startsWith('http') ? res.shareUrl : `${window.location.origin}${res.shareUrl}`)
        : `${window.location.origin}/s/${token}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch (e) {
        // ignore clipboard error
      }
      toast({
        title: "Published",
        description: `Shareable link copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Publish failed",
        description: err.message || 'Could not publish form.',
        variant: 'destructive'
      });
    }
  };

  return (
    <header className="w-full">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">Form Builder</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2" size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>

            <Button variant="outline" size="sm" onClick={handleShare} disabled={isPublishing}>
              <Share2 className="mr-2" size={16} />
              {isPublishing ? 'Publishing...' : 'Share'}
            </Button>
          </div>

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