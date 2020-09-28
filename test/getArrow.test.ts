import { getArrow } from "../src"

describe("getArrow", () => {
  test("it computes an arrow between points", () => {
    expect(getArrow(10, 10, 30, 30)).toMatchSnapshot()
  })

  test("it computes an arrow from a point back to itself", () => {
    expect(getArrow(10, 10, 10, 10)).toMatchSnapshot()
  })

  test("it computes a bowed arrow between points", () => {
    expect(getArrow(10, 10, 30, 11, { bow: 1 })).toMatchSnapshot()
  })
})
