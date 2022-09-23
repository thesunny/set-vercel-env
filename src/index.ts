#!/usr/bin/env node

import dotenv from "dotenv"
import chalk from "chalk"
import * as utils from "@thesunny/script-utils"
import * as s from "superstruct"
import { setVercelEnv } from "./set-vercel-env"
import { Options } from "./set-vercel-env"
export { setVercelEnv } from "./set-vercel-env"

/**
 * VERCEL DOCS:
 *
 * https://vercel.com/docs/cli#commands/env
 *
 * USAGE:
 *
 * Execute this script with a path to a `.env` file as its first argument,
 * the environment (production|preview|development) as its second and the
 * gitbranch as a third if in production.
 *
 *   set-vercel-env .env/temporary-test.env production production
 *   set-vercel-env .env/temporary-test.env production staging
 *   set-vercel-env .env/temporary-test.env preview
 *   set-vercel-env .env/temporary-test.env development
 *
 * Every environment variable in the `.env` file will be first removed and then
 * added. If the value of an environment variable is `` (i.e. empty) then the
 * variable will be removed but not added.
 *
 * If there is an environment variable set on Vercel and you want to remove it,
 * set the value to `` and then run this script to make sure it is removed
 * from Vercel. If you remove the environment variable including the key,
 * this script will not remove the variable on Vercel. This is because there is
 * no way to inspect the current environment variables in Vercel to see if they
 * match the ones in the local `.env` file and figure out which ones we need
 * to remove.
 */

/**
 * type with undefined because we're not sure how many args were passed in
 */
// const path: string | undefined = process.argv[2]
const [, , path, environment, gitbranch] = process.argv as (
  | string
  | undefined
)[]

utils.task("Checking CLI arguments")
utils.message(JSON.stringify(process.argv.slice(2)))

if (typeof path !== "string") {
  utils.fail("Expected first CLI arg [path-to-env] to be defined")
}
if (!path.endsWith(".env")) {
  utils.fail("Expected first CLI arg [path-to-env] to end in '.env'")
}

function checkOptions(
  environment: string | undefined,
  gitbranch: string | undefined
): Options {
  if (typeof environment !== "string") {
    utils.fail("Expected second CLI arg [environment] to be defined")
  }
  if (!["production", "preview", "development"].includes(environment)) {
    utils.fail(
      `Expected second CLI arg to be production, preview or development but is ${JSON.stringify(
        environment
      )}`
    )
  }
  // s.assert(environment, s.enums(["production", "preview", "development"]))
  s.assert(
    environment,
    s.union([
      s.literal("production"),
      s.literal("preview"),
      s.literal("development"),
    ])
  )
  if (environment !== "preview" && typeof gitbranch === "string") {
    utils.fail(
      "Third CLI arg cannot be defined expected for in preview environment"
    )
  }
  utils.pass("Done")
  if (environment === "preview") {
    return { environment, gitbranch }
  } else {
    return { environment }
  }
}

const options = checkOptions(environment, gitbranch)

utils.title(`Set environment variables from\n${JSON.stringify(path)}`)

utils.ensureFileExists(path)
/**
 * If path wasn't set, show a reminder
 */
if (typeof path === "undefined") {
  console.log(chalk.red(`A path argument must be provided but is not`))
  process.exit(1)
}

/**
 * Load env variables using dotenv. Returns `undefined` if a file is not found
 */
const env = dotenv.config({ path }).parsed

if (env === undefined) {
  console.log(chalk.red(`Could not find .env file at ${JSON.stringify(path)}`))
  console.log()
  process.exit(1)
}

setVercelEnv(env, options)
