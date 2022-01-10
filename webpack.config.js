const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
	mode: "production",
	entry: "./src/index.ts",
	experiments: {
		outputModule: true,
	},
	optimization: {
		minimize: false,
	},
	devtool: false,
	target: "node",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
		clean: true,
		library: {
			type: "module",
		},
		chunkFormat: "module",
	},

	resolve: {
		extensions: [".ts", ".js"],
	},
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	stats: {
		errorDetails: true,
	},
};
