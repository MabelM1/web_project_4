const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //entry: { main: "./src/index.js" },
  entry: { main: "./src/pages/index.js" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  module: {
    rules: [ // this is an array of rules
      // add an object containing rules for Babel to it
      {
        // a regular expression that searches for all js files
        test: /\.js$/,
        // all files must be processed by babel-loader
        loader: "babel-loader",
        // exclude the node_modules folder, we don't need to process files in it
        exclude: "/node_modules/"
      },
      {
        // use these rules only for CSS files
          test: /\.css$/,
          loader:  [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {importLoaders:1}
            },
             "postcss-loader"
          ]
      },
      {
        test: /\.(png|svg|jpg|gif|woff2?)$/,
        // file-loader should be used when processing those files
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html" // path to our index.html file
    }),
    new MiniCssExtractPlugin()
  ]
}
