import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import pkg from "./package.json";

/** @type {import("rollup").RollupOptions} */
export default {
	input: "./src/index.ts",
	external: [/.json/, /node_modules/],
	output: [
		{
			file: pkg.main,
			format: "cjs",
			exports: "named",
		},
		{
			file: pkg.module,
			format: "es",
			exports: "named",
		},
	],
	plugins: [
		resolve(),
		typescript({
			tsconfig: "./tsconfig.json",
		}),
		commonjs(),
		babel({
			babelHelpers: "bundled",
		}),
	],
};
