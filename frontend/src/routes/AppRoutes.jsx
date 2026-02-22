import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../screens/Home';
import FormBuilderScreen from '../screens/FormBuilderScreen';
import PublicForm from '../screens/PublicForm';
import ResponsesScreen from '../screens/ResponsesScreen';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/s/:token" element={<PublicForm />} />
      <Route path="/builder" element={<FormBuilderScreen />} />
      <Route path="/builder/:formId" element={<FormBuilderScreen />} />
      <Route path="/form/:formId" element={<FormBuilderScreen />} />
      <Route path="/forms" element={<Home />} />
      <Route path="/responses/:id" element={<ResponsesScreen />} />
      {/* 404 - Redirect to home */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes;
