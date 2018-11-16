const path = require("path");
const webpack = require("webpack");
const webpackCommonConfig = require("webpack-config-clay");

module.exports = Object.assign(webpackCommonConfig, {
	entry: {
		app: "./src/App.js",
		vendor: ['react', 'react-dom']
	},
	output: Object.assign(webpackCommonConfig.output, {
		filename: "./build/globals/query-builder.js"
	}),
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
				loader: "babel-loader"
				}
			},
			{
				test: /\.(sass|scss)$/,
				loader: ["style-loader", "css-loader", "sass-loader"]
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		hot: true,
		port: 9000
	},
	plugins: [new webpack.HotModuleReplacementPlugin()]
});
