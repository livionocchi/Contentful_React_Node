const path = require('./paths');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
      main: path.appIndexJs,
    },
    output: {
      filename: 'static/js/[name].js',
      path: path.appBuild,
      publicPath: "/"
    },
    devServer: {
      port: 3042,
      historyApiFallback: true,
      overlay: true,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/node_modules/],
          use: [{ loader: "babel-loader" }]
        },
        {
          test: /.*\.(gif|png|jp(e*)g|svg)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 21000,
                name: "static/images/[name].[ext]"
              }
            }
          ]
        },
        // Vendor CSS loader
        // This is necessary to pack third party libraries like antd
        {
          test: /\.css$/,
          include: path.appNodeModules,
          use: [
            'style-loader',
            'css-loader'
          ],
        },
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: path.appHtml,
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
}
