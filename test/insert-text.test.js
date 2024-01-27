const { loadDocument } = require("./utils");

test("myd3 inserts 'hello world' to #chart", () => {
  const document = loadDocument("./demo/insert-text/myd3.html");
  expect(document.querySelector("#chart > div").textContent).toBe(
    "hello world",
  );
});
