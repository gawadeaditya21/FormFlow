import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../screens/Home';
import FormBuilderScreen from '../screens/FormBuilderScreen';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home/Landing Page */}
      <Route path="/" element={<Home />} />
      
      {/* Form Builder Page */}
      <Route path="/builder" element={<FormBuilderScreen />} />
      <Route path="/builder/:formId" element={<FormBuilderScreen />} />
      
      {/* Form Preview/Fill Page */}
      <Route path="/form/:formId" element={<FormBuilderScreen />} />
      
      {/* My Forms Page */}
      <Route path="/forms" element={<Home />} />
      
      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
