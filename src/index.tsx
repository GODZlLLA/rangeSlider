import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import './styles/style.scss';

const root = document.querySelector('#app') as HTMLElement;
createRoot(root).render(<App />);