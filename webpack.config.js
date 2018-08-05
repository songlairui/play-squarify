const path = require('path')
const os = require('os')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const targetInterface = Object.values(os.networkInterfaces())
  .map(arr => arr.find(interface => interface.family === 'IPv4'))
  .find(interface => !interface.internal)

const host = '0.0.0.0'
const port = 8008

console.info(`listening at: ${targetInterface}:${port}`)

module.exports = {
  mode: 'development',
  devtool: '',
  entry: [path.join(__dirname, './src/index.js')],
  output: {
    path: path.join(__dirname, './bundle'),
    filename: 'bundle.[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, './src/index.html')
    }),
    new CleanWebpackPlugin(['bundle'])
  ],
  devServer: {
    contentBase: path.join(__dirname, 'bundle'),
    host,
    port,
    disableHostCheck: true
  }
}
