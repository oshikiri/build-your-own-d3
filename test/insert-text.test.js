import assert from "node:assert/strict";
import test from "node:test";
import { loadDocument } from "./utils.js";

test("myd3 inserts 'hello world' to #chart", () => {
  const document = loadDocument("./demo/insert-text/myd3.html");
  assert.equal(
    document.querySelector("#chart > div").textContent,
    "hello world",
  );
});
