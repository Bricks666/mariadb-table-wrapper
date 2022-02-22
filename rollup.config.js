import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

import pkg from "./package.json";

/** @type {import("rollup").RollupOptions} */
export default {
	input: "./src/index.ts",
	output: [
		{
			file: pkg.main,
			format: "csj",
			exports: "named",
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: "es",
			exports: "named",
			sourcemap: true,
		},
	],
	plugins: [
		resolve(),
		typescript({
			rollupCommonJSResolveHack: true,
			clean: true,
		}),
		commonjs(),
	],
};
