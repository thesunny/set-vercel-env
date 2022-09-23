import * as s from "superstruct"
import { AssertType } from "@thesunny/assert-type"

describe("index", () => {
  it("should pass literal assertion", async () => {
    // we want this to be a `string` for unit testing purposes
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const env: string = "production"
    s.assert(
      env,
      s.union([
        s.literal("production"),
        s.literal("preview"),
        s.literal("development"),
      ])
    )
    AssertType.Equal<typeof env, "production" | "preview" | "development">(true)
  })

  it("should fail literal assertion", async () => {
    // we want this to be a `string` for unit testing purposes
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const env: string = "whatever"
    expect(() =>
      s.assert(
        env,
        s.union([
          s.literal("production"),
          s.literal("preview"),
          s.literal("development"),
        ])
      )
    ).toThrow(/literal/)
  })
})
