import React from 'react';
import ReactDOM from 'react-dom';
import './assets/normalize.css';
import './assets/root.css';

import Context from './Context';

(ReactDOM as any)
  .unstable_createRoot(document.getElementById('root'))
  .render(<Context />);
