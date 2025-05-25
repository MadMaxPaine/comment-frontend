// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // або .tsx, якщо TypeScript
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', // для React Router
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // для React
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset/resource',
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // для імпорту без розширення
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // використовуй шаблон з CRA
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    historyApiFallback: true, // для React Router
    hot: true,
  },
  mode: 'development', // або 'production'
};
