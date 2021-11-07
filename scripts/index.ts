import { log } from "~/lib/log";

/**
 * For named arguments, use the tiny `minimist` package
 */
const args = process.argv.slice(2);

log(args);
