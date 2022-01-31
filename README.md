# Set Vercel Env

Use the CLI to set all the variables in a dotenv file on Vercel. In `package.json` add something like:

```json
{
  "scripts": {
    "pushenv": "set-vercel-env examples.env"
  }
}
```
