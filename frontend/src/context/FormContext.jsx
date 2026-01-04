import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FormContext = createContext(undefined);

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
    ];
  }

  if (type === 'dropdown' && base.options) {
    base.options = [
      { id: uuidv4(), value: 'Select an option' },
      { id: uuidv4(), value: 'Option 1' },
      { id: uuidv4(), value: 'Option 2' },
    ];
  }

  return base;
};

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState({
    id: uuidv4(),
    title: 'Untitled Form',
    description: 'Add a description for your form',
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [themeColor, setThemeColor] = useState('blue');

  const updateFormTitle = useCallback((title) => {
    setForm(prev => ({ ...prev, title, updatedAt: new Date() }));
  }, []);

  const updateFormDescription = useCallback((description) => {
    setForm(prev => ({ ...prev, description, updatedAt: new Date() }));
  }, []);

  const addQuestion = useCallback((type, index) => {
    const newQuestion = createDefaultQuestion(type);
    setForm(prev => {
      const questions = [...prev.questions];
      if (index !== undefined) {
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

    if (smartField.id === 'gender') {
      newQuestion.options = [
        { id: uuidv4(), value: 'Male' },
        { id: uuidv4(), value: 'Female' },
        { id: uuidv4(), value: 'Non-binary' },
        { id: uuidv4(), value: 'Prefer not to say' },
      ];
    }

    setForm(prev => {
      const questions = [...prev.questions];
      if (index !== undefined) {
        questions.splice(index, 0, newQuestion);
      } else {
        questions.push(newQuestion);
      }
      return { ...prev, questions, updatedAt: new Date() };
    });
    setActiveQuestionId(newQuestion.id);
  }, []);

  const updateQuestion = useCallback((id, updates) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      ),
      updatedAt: new Date(),
    }));
  }, []);

  const deleteQuestion = useCallback((id) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
      updatedAt: new Date(),
    }));
    setActiveQuestionId(null);
  }, []);

  const duplicateQuestion = useCallback((id) => {
    setForm(prev => {
      const questionIndex = prev.questions.findIndex(q => q.id === id);
      if (questionIndex === -1) return prev;

      const original = prev.questions[questionIndex];
      const duplicate = {
        ...original,
        id: uuidv4(),
        options: original.options?.map(opt => ({ ...opt, id: uuidv4() })),
      };

      const questions = [...prev.questions];
      questions.splice(questionIndex + 1, 0, duplicate);
      return { ...prev, questions, updatedAt: new Date() };
    });
  }, []);

  const reorderQuestions = useCallback((activeId, overId) => {
    setForm(prev => {
      const oldIndex = prev.questions.findIndex(q => q.id === activeId);
      const newIndex = prev.questions.findIndex(q => q.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;

      const questions = [...prev.questions];
      const [removed] = questions.splice(oldIndex, 1);
      questions.splice(newIndex, 0, removed);
      
      return { ...prev, questions, updatedAt: new Date() };
    });
  }, []);

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
