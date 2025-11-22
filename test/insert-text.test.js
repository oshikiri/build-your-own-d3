import test from "node:test";
import assert from "node:assert";
import { loadDocument } from "./utils.js";

test("myd3 inserts 'hello world' to #chart", async () => {
  const document = await loadDocument("./demo/insert-text/myd3.html");
  assert.strictEqual(
    document.querySelector("#chart > div").textContent,
    "hello world",
  );
});
