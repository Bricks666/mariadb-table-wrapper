const path = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.ts",

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
		clean: true,
		globalObject: "this",
		library: {
			type: "umd2",
		},
	},

	resolve: {
		extensions: [".ts"],
	},
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
