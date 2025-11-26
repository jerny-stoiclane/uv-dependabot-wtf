import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import React from 'react';

import Router from './Router';
import { AuthProvider } from './contexts/auth.context';

// Armhr app
const App: React.FC = () => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </LocalizationProvider>
);

export default App;
