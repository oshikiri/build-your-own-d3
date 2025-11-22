import { JSDOM } from "jsdom";
import fs from "fs";

export function loadDocument(path) {
  const html = fs.readFileSync(path).toString();
  const dom = new JSDOM(html, { runScripts: "dangerously" });
  return dom.window.document;
}
