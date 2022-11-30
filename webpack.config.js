const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: process.env.NODE_ENV,
  devServer: {
    hot: true,
    proxy: {
      "/": "http://localhost:3000",
    },
    static: {
      directory: path.resolve(__dirname, "./build"),
    },
    port: 8080,
    open: true,
    historyApiFallback: true,
  },
  entry: path.resolve(__dirname, "./client/main.js"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js",
    publicPath: "/build",
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/env", "@babel/preset-react"] },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./index.html"),
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
      os: false,
      path: false,
    },
  },
};
