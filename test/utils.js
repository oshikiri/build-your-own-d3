import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import path from "node:path";

async function loadDocument(filePath) {
  const html = readFileSync(filePath).toString();
  const resolvedFilePath = path.resolve(filePath);
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    url: `file://${resolvedFilePath}`,
  });
  dom.window.fetch = async (url) => {
    const jsonPath = path.resolve(path.dirname(filePath), url);
    const data = readFileSync(jsonPath);
    return {
      json: () => JSON.parse(data.toString()),
      text: () => data.toString(),
    };
  };
  return new Promise((resolve) => {
    dom.window.addEventListener("load", () => {
      resolve(dom.window.document);
    });
  });
}

export { loadDocument };
