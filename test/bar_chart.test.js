const { loadDocument } = require("./utils");

test("myd3 inserts bar chart", async () => {
  const document = await loadDocument("./demo/bar_chart.html");
  const svg = document.querySelector("svg");
  expect(svg).not.toBeNull();

  const bars = svg.querySelectorAll("rect.bar");
  expect(bars.length).toBe(14);
});
