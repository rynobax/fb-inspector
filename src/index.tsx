import React from 'react';
import ReactDOM from 'react-dom';
import './assets/normalize.css';
import './assets/root.css';
import './assets/reach.css';
import '@reach/menu-button/styles.css';
import "@reach/dialog/styles.css";

import Setup from './Setup';

(ReactDOM as any)
  .unstable_createRoot(document.getElementById('root'))
  .render(<Setup />);
