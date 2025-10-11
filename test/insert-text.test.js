const { loadDocument } = require("./utils");

test("myd3 inserts 'hello world' to #chart", async () => {
  const document = await loadDocument("./demo/insert-text/myd3.html");
  expect(document.querySelector("#chart > div").textContent).toBe(
    "hello world",
  );
});
