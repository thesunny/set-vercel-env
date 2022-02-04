import * as utils from "@thesunny/script-utils"
import { spawnSync } from "child_process"

export type Options =
  | {
      environment: "production" | "development"
      gitbranch?: undefined
    }
  | {
      environment: "preview"
      gitbranch?: string
    }

export function setVercelEnv(
  env: Record<string, string>,
  { environment, gitbranch }: Options
) {
  /**
   * Show the env variables we are outputting
   */
  utils.task("Log environment variables")
  for (const [key, value] of Object.entries(env)) {
    console.log(`${key}=${value}`)
  }
  utils.pass("Done")

  Object.entries(env).map(([key, value]) => {
    try {
      /**
       * Remove each env var first or Vercel won't allow us to add a new one.
       * We don't want to show all the error messages so we we use the `stdio`
       * option to swallow them without showing them.
       *
       * the `stdio` property is set to handle `stdin`, `stdout` and `stderror`
       * in custom ways.
       *
       * https://nodejs.org/api/child_process.html#optionsstdio
       */
      utils.task(`Remove ${key}`)
      /**
       * spawnSync does not open up a new shell while execSync does. spawnSync
       * also gives us a return object with information in it while execSync
       * returned no useful information (though it it supposed to return `stdout`).
       * In fact, `stdout` just gets output to the screen and we can't access it.
       *
       * Note that the `stdio` shown below may not be necessary but is there for
       * clarity.
       */
      const removeArgs = ["env", "rm", key, environment]
      if (typeof gitbranch === "string") {
        removeArgs.push(gitbranch)
      }
      removeArgs.push("-y")
      // const removeResult = spawnSync("vercel", ["env", "rm", key, "-y"], {
      const removeResult = spawnSync("vercel", removeArgs, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      })
      /**
       * `spawnSync` should return the output of the command in the `stdout`
       * property of the result but for some reason returns it in `stderr`.
       *
       * I think this may be an issue in the `vercel` cli where it's using
       * stderr instead of stdout to display data.
       *
       * I can't see what this is and a few experiments I did to switch this up
       * (like changing the `stdio` props in multiple ways) was unsuccessful.
       *
       * For the time being, this works though.
       */
      if (removeResult.stderr.includes("Removed Environment Variable")) {
        utils.pass(`Done`)
      } else if (
        removeResult.stderr.includes("Environment Variable was not found")
      ) {
        utils.pass(`Done (no env var to remove)`)
      } else {
        utils.fail(removeResult.stderr)
      }
    } catch (e) {
      utils.fail(e)
    }

    if (value === "") {
      utils.task(`Skip adding ${key} (it's blank)`)
      utils.pass("Done")
    } else {
      /**
       * Add each env var. We are more interested that it succeeded here so we
       * don't swallow the output.
       */
      utils.task(`Add ${key}=${value}`)
      /**
       * spawnSync does not open up a new shell while execSync does. spawnSync
       * also gives us a return object with information in it while execSync
       * returned no useful information (though it it supposed to return `stdout`).
       * In fact, `stdout` just gets output to the screen and we can't access it.
       *
       * Note that the `stdio` shown below may not be necessary but is there for
       * clarity.
       */
      const addArgs = ["env", "add", key, environment]
      if (typeof gitbranch === "string") {
        addArgs.push(gitbranch)
      }
      const addResult = spawnSync("vercel", addArgs, {
        input: value,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      })
      /**
       * `spawnSync` should return the output of the command in the `stdout`
       * property of the result but for some reason returns it in `stderr`.
       *
       * I think this may be an issue in the `vercel` cli where it's using
       * stderr instead of stdout to display data.
       *
       * I can't see what this is and a few experiments I did to switch this up
       * (like changing the `stdio` props in multiple ways) was unsuccessful.
       *
       * For the time being, this works though.
       */
      if (addResult.stderr.includes("Added Environment Variable")) {
        utils.pass(`Done`)
      } else {
        utils.fail(addResult.stderr)
      }
    }
  })
}
