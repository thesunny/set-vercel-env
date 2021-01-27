import chalk from "chalk"

export function log(...args: any[]) {
  console.log(chalk.green(...args))
}
