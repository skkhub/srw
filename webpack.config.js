var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  mode: 'development',

  devtool: '#eval-source-map',

  entry: {
    main: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: 'assets/[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'src': resolve('src'),
      'images': resolve('src/images')
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'srw',
      template: './index.html'
    }),
    // new ExtractTextPlugin({
    //   filename: 'css/[name].[contenthash].css'
    // })
  ],

  devServer: {
    port: 8080,
    inline: true,
    contentBase: './dist',
    hot: true,
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|gif|jpg|svg|jpeg)$/i,
        loader: 'url-loader',
        query: {
          limit: 8192,
          outputPath: 'assets/',
          name: '[name].[hash].[ext]'
        }
      },
      {
        test: /\.(mp3|wav|wma)$/i,
        loader: 'file-loader'
      }
    ]
  }
};