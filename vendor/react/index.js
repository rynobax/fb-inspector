'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react.production.min.js');
} else {
  module.exports = require('./react.development.js');
}