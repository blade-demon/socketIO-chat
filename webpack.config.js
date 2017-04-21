var path = require('path');

module.exports = {
  entry: './public/js/chat.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js"
  }
};