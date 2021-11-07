import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import sizes from "rollup-plugin-sizes";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const plugins = [
  /**
   * Include JSON support in case we need it
   */
  json(),
  // resolve({
  //   jsnext: true,
  //   main: true,
  //   browser: true,
  //   // extensions: [".js", ".json"],
  //   // preferBuiltins: false,
  // }),
  /**
   * So we can resolve commonjs style
   */
  commonjs(),
  /**
   * Most explicit to have all our configuration in a separate tsconfig file
   */
  typescript({ tsconfig: "tsconfig.rollup.json" }),
  /**
   * Minimize code
   */
  // terser(),
  /**
   * Output sizes when we're done
   */
  sizes(),
];

export default {
  input: "src/index.ts",
  output: [
    {
      banner: "#!/usr/bin/env node",
      file: ".dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins,
};
