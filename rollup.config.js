import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import pkg from "./package.json";

const generateOutput = (format) => {
	return {
		file: outputPath[format],
		exports: "named",
		compact: true,
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
	external: [/.json/, /node_modules/, /dist/],
	output: [generateOutput("cjs"), generateOutput("es")],
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
