import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/toaster';
import './index.css';

function App() {
  return (
    <Router>
      <FormProvider>
        <AppRoutes />
        <Toaster />
      </FormProvider>
    </Router>
  );
}

export default App;
