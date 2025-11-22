import test from "node:test";
import assert from "node:assert";
import { loadDocument } from "./utils.js";

test("myd3 inserts bar chart", async () => {
  const document = await loadDocument("./demo/bar_chart.html");
  const svg = document.querySelector("svg");
  assert.notStrictEqual(svg, null);

  const bars = svg.querySelectorAll("rect.bar");
  assert.strictEqual(bars.length, 14);
});
