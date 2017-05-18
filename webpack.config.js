'use strict'

var path = require("path");
module.exports = {
  entry: './src/bundle-interactives.js',
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "eli-interactives.bundle2.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
