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

  test("It solves a difficult arrow.", () => {
    expect(
      getBoxToBoxArrow(
        -4710.06155657891,
        -1571.6917781196591,
        545.7397072097903,
        457.4198639994165,
        -5335.457377534619,
        -768.3931456842388,
        559.06478024143,
        358.2843535608206
      )
    ).toBeTruthy()
  })
})
