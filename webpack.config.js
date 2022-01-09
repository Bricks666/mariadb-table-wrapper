const path = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.ts",

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
		clean: true,
		library: {
			type: "umd2",
		},
	},

	resolve: {
		extensions: [".ts", ".js"],
	},
	externals: ["mariadb"],
	module: {
		rules: [
			{
				test: /\.ts/,
				use: ["ts-loader"],
				exclude: /node_modules/,
			},
		],
	},
};
