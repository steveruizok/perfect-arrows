import { getBoxToBoxArrow } from "../src"

describe("getBoxToBoxArrow", () => {
  test("it computes an arrow between boxes", () => {
    expect(getBoxToBoxArrow(10, 10, 10, 10, 30, 30, 10, 10)).toMatchSnapshot()
  })

  test("it computes an arrow from a large box to a small box", () => {
    expect(
      getBoxToBoxArrow(10, 10, 576, 384, 600, 30, 10, 10)
    ).toMatchSnapshot()
  })

  test("it computes an arrow from a box back to itself", () => {
    expect(getBoxToBoxArrow(10, 10, 10, 10, 10, 10, 10, 10)).toMatchSnapshot()
  })

  test("it computes an arrow between boxes with straights disabled", () => {
    expect(
      getBoxToBoxArrow(10, 10, 10, 10, 30, 30, 10, 10, { straights: false })
    ).toMatchSnapshot()
  })

  test("it computes an arrow between boxes with straights disabled", () => {
    expect(
      getBoxToBoxArrow(10745, 4384, 71, 134, 10674, 4715, 82, 165)
    ).toMatchSnapshot()
  })
})
