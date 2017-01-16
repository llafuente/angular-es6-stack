const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
  entry: './app/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[file].source.map',
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'app')
    ]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          { loader: 'ngtemplate-loader' },
          {
            loader: 'html-loader',
            options: {
              root: path.resolve(__dirname, 'app'),
            }
          },
        ]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: {
                root: path.resolve(__dirname, 'app'),
                sourceMap: isProduction,
                includePaths: [
                  path.resolve(__dirname, 'app'),
                  path.resolve(__dirname, 'node_modules')
                ]
              }
            },
            {
              loader: 'sass-loader',
              query: {
                root: path.resolve(__dirname, 'app'),
                sourceMaps: isProduction,
                includePaths: [
                  path.resolve(__dirname, 'app'),
                  path.resolve(__dirname, 'node_modules')
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        use: [
          /* isProduction ? uglify : none, see below  */
          { loader: 'ng-annotate-loader' },
          { loader: 'babel-loader' },
          {
            loader: 'eslint-loader',
            options: {
              exclude: '/node_modules/',
              failOnWarning: false,
              failOnError: false,
            }
          },
        ]
      },
      // new ExtractTextPlugin('css/app.css', { allChunks: true })
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './images/[name].[hash].[ext]'
            }
          }
        ]
      },

    ]
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('styles.css')
  ],

  // enable API proxy
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        secure: false
      }
    }
  }
};

if (isProduction) {
  module.exports.module.rules[2].use.unshift({
    loader: 'uglify-loader',
    options: {
      mangle: true,
      sourceMap: true
    }
  });
}
