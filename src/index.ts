import { spawnSync } from "child_process";
import dotenv from "dotenv";
import chalk from "chalk";
import * as utils from "@thesunny/script-utils";

/**
 * USAGE:
 *
 * Execute this script with a path to a `.env` file as its first argument.
 *
 *   ts-node scripts/push-vercel-env .env/temporary-test.env
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
const path: string | undefined = process.argv[2];

utils.title(`Set environment variables from\n${JSON.stringify(path)}`);

utils.ensureFileExists(path);
/**
 * If path wasn't set, show a reminder
 */
if (typeof path === "undefined") {
  console.log(chalk.red(`A path argument must be provided but is not`));
  process.exit(1);
}

/**
 * Load env variables using dotenv. Returns `undefined` if a file is not found
 */
const env = dotenv.config({ path }).parsed;

if (env === undefined) {
  console.log(chalk.red(`Could not find .env file at ${JSON.stringify(path)}`));
  console.log();
  process.exit(1);
}

/**
 * Show the env variables we are outputting
 */
utils.task("Log environment variables");
for (const [key, value] of Object.entries(env)) {
  console.log(`${key}=${value}`);
}
utils.pass("Done");

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
    utils.task(`Remove ${key}`);
    /**
     * spawnSync does not open up a new shell while execSync does. spawnSync
     * also gives us a return object with information in it while execSync
     * returned no useful information (though it it supposed to return `stdout`).
     * In fact, `stdout` just gets output to the screen and we can't access it.
     *
     * Note that the `stdio` shown below may not be necessary but is there for
     * clarity.
     */
    const removeResult = spawnSync("vercel", ["env", "rm", key, "-y"], {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
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
      utils.pass(`Done`);
    } else if (
      removeResult.stderr.includes("Environment Variable was not found")
    ) {
      utils.pass(`Done (no env var to remove)`);
    } else {
      utils.fail(removeResult.stderr);
    }
  } catch (e) {
    utils.fail(e);
  }

  if (value === "") {
    utils.task(`Skip adding ${key} (it's blank)`);
    utils.pass("Done");
  } else {
    /**
     * Add each env var. We are more interested that it succeeded here so we
     * don't swallow the output.
     */
    utils.task(`Add ${key}=${value}`);
    /**
     * spawnSync does not open up a new shell while execSync does. spawnSync
     * also gives us a return object with information in it while execSync
     * returned no useful information (though it it supposed to return `stdout`).
     * In fact, `stdout` just gets output to the screen and we can't access it.
     *
     * Note that the `stdio` shown below may not be necessary but is there for
     * clarity.
     */
    const addResult = spawnSync("vercel", ["env", "add", key, "production"], {
      input: value,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
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
      utils.pass(`Done`);
    } else {
      utils.fail(addResult.stderr);
    }
  }
});
