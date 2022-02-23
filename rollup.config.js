import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import pkg from "./package.json";

const generateOutput = (format) => {
	/** @type {import("rollup").OutputOptions} */
	return {
		file: outputPath[format],
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
	external: [/.json/, /node_modules/],
	output: [generateOutput("cjs"), generateOutput("es")],
	plugins: [
		resolve(),
		typescript({
			tsconfig: "tsconfig.json",
		}),
		commonjs(),
		babel({
			babelHelpers: "bundled",
		}),
	],
};
