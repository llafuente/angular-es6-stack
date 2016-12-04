var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
let extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

const isProduction = false;

module.exports = {
  entry: './app/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    //root: path.resolve('app/'),
    modules: ['node_modules', 'app'],
    //extensions: ['', '.js', '.scss'] 
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
          fallbackLoader: "style-loader",
          loader: [
            {
              loader: 'css-loader',
              query: {
                root: path.resolve(__dirname, 'app'),
                sourceMap: !isProduction,
              }
            },
            {
              loader: 'sass-loader',
              query: {
                root: path.resolve(__dirname, 'app'),
                sourceMaps: !isProduction,
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
        /*
          {
            loader: "eslint-loader",
            options: {
              exclude: '/node_modules/'
            }
          },
        */
          { loader: 'babel-loader' }
        ]
      },
      // new ExtractTextPlugin('css/app.css', { allChunks: true })
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: './images/[name].[hash].[ext]'
            }
          }
        ]
      },
      
    ]
  },
  devtool: "source-map",
  plugins: [
    new ExtractTextPlugin("styles.css")
  ]
  /*
  plugins: [
    new webpack.HtmlWebpackPlugin({
        inject: "body",
        template: "app/index.html",
        filename: "index.html"
     })
  ]
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
      {
        test: /\.js$/,
        loader: 'ng-annotate?add=true!babel',
        exclude: /node_modules/
      },
      {
        test: /.html$/,
        loader: 'ngtemplate?relativeTo=' + __dirname +'/app!html?root=' + __dirname + '/app'
      },
      {
        test: /\.png$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true, output: { comments: false }}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, "./app")]
        },
      }
    })


  ],
  resolve: {
    root: path.resolve('app/'),
    extensions: ['', '.js']
  },
  eslint: {
    failOnError: true
  },
  devtool: '#source-map'
  */
};
