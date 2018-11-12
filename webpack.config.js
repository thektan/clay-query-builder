const path = require("path");
const webpack = require("webpack");
const webpackCommonConfig = require("webpack-config-clay");

module.exports = Object.assign(webpackCommonConfig, {
	entry: "./src/all/query-builder.js",
	output: Object.assign(webpackCommonConfig.output, {
		filename: "./build/globals/query-builder.js"
	}),
	module: {
		rules: [
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
