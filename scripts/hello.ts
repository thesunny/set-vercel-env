import { log } from "~/lib/log"
import minimist from "minimist"

const args = minimist(process.argv)

log(`Hello ${args.name ? args.name : "World"}`)
