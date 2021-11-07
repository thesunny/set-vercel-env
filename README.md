# CLI Starter Kit

## How to get started with `cli-starter-kit`

```sh
# in your project root, initialize an empty git repo
git init

# pull next-starter-kit
git pull git@github.com:thesunny/cli-starter-kit.git

# Open the directory and `package.json`
code . package.json
```

Edit `package.json` to fit your needs

```json
{
  "name": "name-of-your-package",
  "version": "0.1.0",
  "description": "Description of your package"
}
```

## How to update

```sh
# use the built in script
yarn update:kit

# or manually re-pull cli-starter-kit
git pull git@github.com:thesunny/cli-starter-kit.git
```

## How to publish

```sh
yarn publish
```

## Resources

Starter kit for creating NPM packages with executable scripts.

[A guide to creating a NodeJS command-line package](https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e)

[Write a simple node executable with typescript and vscode](https://medium.com/wizardnet972/write-a-simple-node-executable-with-typescript-and-vscode-97c58adca02d)
