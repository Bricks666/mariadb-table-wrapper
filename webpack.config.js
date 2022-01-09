const path = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.ts",
	experiments: {
		outputModule: true,
	},

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
		clean: true,
		library: {
			type: "commonjs-module",
		},
	},

	resolve: {
		extensions: [".ts"],
	},
	externals: {
		mariadb: "mariadb",
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
