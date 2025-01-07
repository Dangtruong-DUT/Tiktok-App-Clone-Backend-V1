import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import GlobalStyles from '@/components/GlobalStyles';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyles>
        <App />
    </GlobalStyles>
  </React.StrictMode>
);


reportWebVitals();
