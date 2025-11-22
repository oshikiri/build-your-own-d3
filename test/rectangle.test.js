import assert from "node:assert/strict";
import test from "node:test";
import { loadDocument } from "./utils.js";

const document = loadDocument("./demo/rectangle/myd3.html");

test("myd3 inserts blue 50x20 rectangle", () => {
  const rect = document.querySelector("#chart > svg > g > rect");
  assert.equal(rect.getAttribute("fill"), "blue");
  assert.equal(rect.getAttribute("width"), "50");
  assert.equal(rect.getAttribute("height"), "20");
});

test("myd3 inserts an svg rect element", () => {
  const rect = document.querySelector("#chart > svg > g > rect");
  assert.equal(rect.namespaceURI, "http://www.w3.org/2000/svg");
});
