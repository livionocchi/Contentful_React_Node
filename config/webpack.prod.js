const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('./paths');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const enableBundleAnalyzer = process.env.ENABLE_ANALYZER === 'true';

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: "css-loader" }
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: "css-loader" },
            { loader: "sass-loader",
              options: {
                data: `
                  @import "./src/styles/_variables.scss";
                  @import "./src/styles/_mixins.scss";
                  @import "./src/styles/_globals.scss";
                  `
              }
            }
          ]
        },
      ]
    },
    optimization: {
      splitChunks: {
          chunks: 'all',
      },
      runtimeChunk: false,
    },
    plugins: [
      new CleanWebpackPlugin([path.appBuild], {
          root: process.cwd(),
          verbose: true,
          dry: false
      }),
      new OptimizeCssAssetsPlugin(),
      new MiniCssExtractPlugin({
          filename: "static/css/[name].css",
          chunkFilename: "static/css/[id].[hash:8].css"
      }),
      new ManifestPlugin(),
      new BundleAnalyzerPlugin({
          analyzerMode: enableBundleAnalyzer === true ? 'static' : 'disabled',
          openAnalyzer: true,
      }),
      new CopyPlugin([
      {
        from: path.appPublic,
        to: path.appBuild ,
        ignore: ['index.html'],
      }
    ]),
      new WebpackShellPlugin({
        onBuildStart:['yarn sync'], 
        onBuildEnd:['echo "Webpack End"']
      })
    ],
});
