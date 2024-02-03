const { loadDocument } = require("./utils");

const document = loadDocument("./demo/rectangle/myd3.html");

test("myd3 inserts blue 50x20 rectangle", () => {
  const rect = document.querySelector("#chart > svg > g > rect");
  expect(rect.getAttribute("fill")).toBe("blue");
  expect(rect.getAttribute("width")).toBe("50");
  expect(rect.getAttribute("height")).toBe("20");
});

test("[bug] myd3 inserts an xhtml rect element", () => {
  const rect = document.querySelector("#chart > svg > g > rect");
  expect(rect.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
});
