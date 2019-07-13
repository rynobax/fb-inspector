'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-dom.production.min.js');
} else {
  module.exports = require('./react-dom.development.js');
}