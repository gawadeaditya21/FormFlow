import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FormContext = createContext(undefined);

// --- Server API helpers (Save & Share) ---
const API_BASE =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:5000/api';

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let errMsg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      errMsg = body.message || JSON.stringify(body);
    } catch (e) { }
    const err = new Error(errMsg);
    err.status = res.status;
    throw err;
  }
  try {
    return await res.json();
  } catch (e) {
    return {};
  }
}

const createDefaultQuestion = (type) => {
  const base = {
    id: uuidv4(),
    type,
    label: 'Untitled Question',
    required: false,
  };

  if (type === 'multiple-choice' || type === 'checkbox' || type === 'dropdown') {
    base.options = [
      { id: uuidv4(), value: 'Option 1' },
      { id: uuidv4(), value: 'Option 2' },
    ];
  }

  if (type === 'rating') {
    base.range = { min: 1, max: 5 };
  }

  return base;
};

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    questions: [],
  });

  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [themeColor, setThemeColor] = useState('blue');

  const updateFormTitle = useCallback((title) => {
    setForm((prev) => ({ ...prev, title, updatedAt: new Date() }));
  }, []);

  const updateFormDescription = useCallback((description) => {
    setForm((prev) => ({ ...prev, description, updatedAt: new Date() }));
  }, []);

  const addQuestion = useCallback((type, index) => {
    const newQuestion = createDefaultQuestion(type);
    setForm((prev) => {
      const questions = [...prev.questions];
      if (typeof index === 'number') {
        questions.splice(index, 0, newQuestion);
      } else {
        questions.push(newQuestion);
      }
      return { ...prev, questions, updatedAt: new Date() };
    });
    setActiveQuestionId(newQuestion.id);
  }, []);

  const addSmartField = useCallback((smartField, index) => {
    const newQuestion = {
      id: uuidv4(),
      type: smartField.config.type,
      label: smartField.config.label,
      required: smartField.config.required,
      validation: smartField.config.validation,
    };

    setForm((prev) => {
      const questions = [...prev.questions];
      if (typeof index === 'number') {
        questions.splice(index, 0, newQuestion);
      } else {
        questions.push(newQuestion);
      }
      return { ...prev, questions, updatedAt: new Date() };
    });
    setActiveQuestionId(newQuestion.id);
  }, []);

  const updateQuestion = useCallback((id, patch) => {
    setForm((prev) => {
      const questions = prev.questions.map((q) => (q.id === id ? { ...q, ...patch } : q));
      return { ...prev, questions, updatedAt: new Date() };
    });
  }, []);

  const deleteQuestion = useCallback((id) => {
    setForm((prev) => {
      const questions = prev.questions.filter((q) => q.id !== id);
      return { ...prev, questions, updatedAt: new Date() };
    });
    setActiveQuestionId(null);
  }, []);

  const duplicateQuestion = useCallback((id) => {
    setForm((prev) => {
      const idx = prev.questions.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const original = prev.questions[idx];
      const copy = {
        ...original,
        id: uuidv4(),
        label: `${original.label} (copy)`,
        options: original.options?.map((opt) => ({ ...opt, id: uuidv4() })),
      };
      const questions = [...prev.questions];
      questions.splice(idx + 1, 0, copy);
      return { ...prev, questions, updatedAt: new Date() };
    });
  }, []);

  const reorderQuestions = useCallback((from, to) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      const [moved] = questions.splice(from, 1);
      questions.splice(to, 0, moved);
      return { ...prev, questions, updatedAt: new Date() };
    });
  }, []);

  // Save & Share states
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const saveFormToServer = useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        questions: form.questions,
      };
      // decide create or update
      if (form._id) {
        const res = await apiRequest(`/forms/${form._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setForm((prev) => ({ ...prev, _id: res._id || res.id || prev._id, updatedAt: res.updatedAt || new Date() }));
        return res;
      } else {
        const res = await apiRequest(`/forms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setForm((prev) => ({ ...prev, _id: res._id || res.id || prev._id, updatedAt: res.updatedAt || new Date() }));
        return res;
      }
    } catch (err) {
      console.error('saveFormToServer error', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [form]);

  const shareForm = useCallback(async () => {
    setIsPublishing(true);
    try {
      let id = form._id;

      // If not saved yet → save first and capture returned id
      if (!id) {
        const saved = await saveFormToServer();
        id = saved?._id || saved?.id;
      }

      if (!id) {
        throw new Error("Form ID missing after save.");
      }

      const res = await apiRequest(`/forms/${id}/publish`, {
        method: 'POST',
      });

      return res;
    } catch (err) {
      console.error('shareForm error', err);
      throw err;
    } finally {
      setIsPublishing(false);
    }
  }, [form, saveFormToServer]);

  return (
    <FormContext.Provider
      value={{
        form,
        isPreviewMode,
        setIsPreviewMode,
        updateFormTitle,
        updateFormDescription,
        addQuestion,
        addSmartField,
        updateQuestion,
        deleteQuestion,
        duplicateQuestion,
        reorderQuestions,
        activeQuestionId,
        setActiveQuestionId,
        themeColor,
        setThemeColor,
        // Save & Share functions
        saveFormToServer,
        shareForm,
        isSaving,
        isPublishing,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};