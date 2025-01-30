import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './Store/store.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
createRoot(document.getElementById('root')).render(
  <ThemeProvider>
 
  <Provider store={store}>
  <StrictMode>
    <App />
  </StrictMode>
  </Provider>
  
  </ThemeProvider>
)
