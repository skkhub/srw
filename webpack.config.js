var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, dir)
}

function getIPAdress(){
  var interfaces = require('os').networkInterfaces();
  for(var devName in interfaces){
    var iface = interfaces[devName];
    for(var i=0;i<iface.length;i++){
      var alias = iface[i];
      if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
        return alias.address;
      }
    }
  }
}

module.exports = (env, argv) => ({
  // mode: 'development',

  devtool: '#eval-source-map',

  entry: {
    main: './src/index.js',
    demo: './src/demo.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: argv.mode == 'development' ? '/' : './',
    filename: 'assets/[name].[hash].js'
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
      template: './index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: 'srw',
      filename: 'demo.html',
      template: './index.html',
      showErrors: true,
      chunks: ['demo']
    })
  ],

  devServer: {
    port: 8080,
    inline: true,
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    overlay: true,
    stats: 'errors-only',
    host: getIPAdress()
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
          outputPath: 'assets/images/',
          name: '[name].[hash].[ext]'
        }
      },
      {
        test: /\.(mp3|wav|wma)$/i,
        loader: 'file-loader',
        query: {
          outputPath: 'assets/audio/'
        }
      }
    ]
  }
});