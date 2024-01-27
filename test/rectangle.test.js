const { loadDocument } = require("./utils");

test("myd3 inserts blue 50x20 rectangle", () => {
  const document = loadDocument("./demo/rectangle/myd3.html");
  const rect = document.querySelector("#chart > svg > g > rect")
  expect(rect.getAttribute("fill")).toBe("blue");
  expect(rect.getAttribute("width")).toBe("50");
  expect(rect.getAttribute("height")).toBe("20");
});
