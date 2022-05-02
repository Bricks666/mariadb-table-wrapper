import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import ttypescript from "ttypescript";

import pkg from "../package.json";

const generateOutput = (format) => {
	/** @type {import("rollup").OutputOptions} */
	return {
		file: outputPath[`${format}`],
		exports: "named",
		format,
	};
};

const outputPath = {
	cjs: pkg.main,
	es: pkg.module,
};

/** @type {import("rollup").RollupOptions} */
export default {
	input: "./src/index.ts",
	output: [generateOutput("cjs"), generateOutput("es")],
	external: [/.json/, /node_modules/],

	plugins: [
		resolve(),
		typescript({
			typescript: ttypescript,
		}),
		commonjs(),
		babel({
			babelHelpers: "bundled",
		}),
	],
};
