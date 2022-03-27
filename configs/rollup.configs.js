import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import pkg from "../package.json";

export const generateOutput = (format, mode = "dev") => {
	/** @type {import("rollup").OutputOptions} */
	return {
		file: outputPath[`${format}:${mode}`],
		exports: "named",
		format,
	};
};

export const outputPath = {
	"cjs:prod": pkg.main,
	"es:prod": pkg.module,
	"cjs:dev": pkg.dev,
	"es:dev": pkg.devModule,
};

/** @type {import("rollup").RollupOptions} */

export const getInputFile = (mode = "dev") => {
	return mode === "dev" ? "./src/index.dev.ts" : "./src/index.ts";
};
export const baseConfig = {
	external: [/.json/, /node_modules/],
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
