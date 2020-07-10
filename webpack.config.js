/* eslint-disable no-undef */
const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
//node의 모듈 시스템
module.exports = {
  mode: mode,
  entry: {
    main: "./src/app.js",
    result: "./src/result.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  devServer: {
    overlay: true,
    stats: "errors-only",
    before: (app) => {
      app.get("/api/users", (req, res) => {
        res.json([
          {
            id: 1,
            name: "Alice",
          },
          {
            id: 2,
            name: "moles",
          },
          {
            id: 3,
            name: "bound",
          },
        ]);
      });
    },
    hot: true,
  },
  optimization: {
    minimizer:
      mode === "production"
        ? [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 콘솔 로그를 제거 한다
                },
              },
            }),
          ]
        : [],
    splitChunks: {
      chunks: "all",
    },
  },
  externals: {
    axios: "axios",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          publicPath: "",
          name: "[name].[ext]?[hash]",
          limit: 20000, //20kb
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
                Build Date : ${new Date().toLocaleString()}
                Commit Version : ${childProcess.execSync(
                  "git rev-parse --short HEAD"
                )}
                Author : ${childProcess.execSync("git config user.name")} 
                MODE : ${process.env.NODE_ENV}
            `,
    }),
    new webpack.DefinePlugin({
      TWO: JSON.stringify("1+1"),
      "api.domain": "dev.moles.co.kr",
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, //공백제거
              removeComments: true, //주석제거
            }
          : false,
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ]
      : []),
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/axios/dist/axios.min.js",
          to: "./axios.min.js",
        },
      ],
    }),
  ],
};
