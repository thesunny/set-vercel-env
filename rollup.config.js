// import { DEFAULT_EXTENSIONS } from "@babel/core"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import minimist from "minimist"
import fs from "fs"
// import nodePolyfills from "rollup-plugin-node-polyfills"
// import replace from "rollup-plugin-replace"
// import resolve from "@rollup/plugin-node-resolve"
import sizes from "rollup-plugin-sizes"
// import { terser } from "rollup-plugin-terser"
import typescript from "rollup-plugin-typescript2"

// const args = minimist(process.argv)
// console.log(args)
// console.log("Running rollup with config/rollup/dynamic/rollup.config.js")
// console.log("")
// console.log(`name:   ${args.n}`)
// console.log(`input:  ${args.i}`)
// console.log(`output: ${args.o}`)

fs.rmdirSync("./bin", { recursive: true })

const entries = fs.readdirSync("./scripts").map((entry) => `scripts/${entry}`)
console.log({ entries })

const plugins = [
  /**
   * React error process is not defined
   * <https://github.com/rollup/rollup/issues/487>
   */
  // replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
  /**
   * The three arguments jsnext, preferBuiltins and browser are used to get
   * it to work with axios.
   *
   * <https://github.com/axios/axios/issues/1259>
   */
  // resolve({ jsnext: true, preferBuiltins: true, browser: true }),
  json(),
  /**
   * `commonjs` must come after `resolve`
   * <https://github.com/axios/axios/issues/1259>
   */
  commonjs(),
  /**
   * For some reason, somewhere in `~/lib/convert` something calls in `path`
   */
  // nodePolyfills(),
  // babel(),
  typescript(),
  // terser(),
  sizes(),
]

export default {
  // input: "lib/crash/index.tsx", // Provide in CLI as args.i
  input: entries,
  output: [
    {
      banner: "#!/usr/bin/env node",
      // name: "__hello__", // Provide in CLI as args.n
      file: "bin/hello.js", // Provide in CLI as args.o
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins,
}
