import assert from "node:assert/strict";
import test from "node:test";
import { loadDocument } from "./utils.js";

test.skip("myd3 inserts bar chart", () => {
  const document = loadDocument("./demo/bar_chart.html");
  assert.ok(document.querySelector("#chart > div"));
});
