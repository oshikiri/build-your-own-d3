const { loadDocument } = require("./utils");

test.skip("myd3 inserts bar chart", () => {
  const document = loadDocument("./demo/bar_chart.html");
  expect(document.querySelector("#chart > div"));
});
