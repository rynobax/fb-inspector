import React from 'react';
import ReactDOM from 'react-dom';
import './assets/normalize.css';
import './assets/root.css';
import './assets/reach.css';
import '@reach/menu-button/styles.css';
import '@reach/dialog/styles.css';
import '@reach/tooltip/styles.css';

// import Setup from './Setup';
import Test from './Test';
// import * as seed from './hooks/seed';
// seed.start();

// const whyDidYouRender = require('@welldone-software/why-did-you-render');
// whyDidYouRender(React);

ReactDOM.render(<Test />, document.getElementById('root'));
