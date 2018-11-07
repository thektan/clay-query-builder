const path = require("path");
const webpack = require("webpack");
const webpackCommonConfig = require("webpack-config-clay");

module.exports = Object.assign(webpackCommonConfig, {
	entry: "./src/all/query-builder.js",
	output: Object.assign(webpackCommonConfig.output, {
		filename: "./build/globals/query-builder.js"
	}),
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		hot: true,
		port: 9000
	},
	plugins: [new webpack.HotModuleReplacementPlugin()]
});
