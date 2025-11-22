import test from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadMiniD3() {
  const code = readFileSync(resolve(__dirname, "../mini-d3.js"), "utf8");
  const dom = new JSDOM("<!doctype html><body></body>", {
    runScripts: "dangerously",
  });
  dom.window.eval(code + "\nwindow.d3 = d3;");
  return dom;
}

test("append creates html elements in html namespace", () => {
  const dom = loadMiniD3();
  const { document, d3 } = dom.window;
  d3.select("body").append("div");
  const div = document.querySelector("body > div");
  assert.strictEqual(div.namespaceURI, "http://www.w3.org/1999/xhtml");
});

test("append creates svg elements in svg namespace", () => {
  const dom = loadMiniD3();
  const { document, d3 } = dom.window;
  d3.select("body").append("svg");
  const svg = document.querySelector("body > svg");
  assert.strictEqual(svg.namespaceURI, "http://www.w3.org/2000/svg");
});

test("append creates svg child elements with svg namespace", () => {
  const dom = loadMiniD3();
  const { document, d3 } = dom.window;
  d3.select("body").append("svg").append("g").append("rect");
  const rect = document.querySelector("body > svg > g > rect");
  assert.strictEqual(rect.namespaceURI, "http://www.w3.org/2000/svg");
});
