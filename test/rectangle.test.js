import test from "node:test";
import assert from "node:assert";
import { loadDocument } from "./utils.js";

test("myd3 inserts blue 50x20 rectangle", async () => {
  const document = await loadDocument("./demo/rectangle/myd3.html");
  const rect = document.querySelector("#chart > svg > g > rect");
  assert.strictEqual(rect.getAttribute("fill"), "blue");
  assert.strictEqual(rect.getAttribute("width"), "50");
  assert.strictEqual(rect.getAttribute("height"), "20");
});

test("myd3 inserts an svg rect element", async () => {
  const document = await loadDocument("./demo/rectangle/myd3.html");
  const rect = document.querySelector("#chart > svg > g > rect");
  assert.strictEqual(rect.namespaceURI, "http://www.w3.org/2000/svg");
});
