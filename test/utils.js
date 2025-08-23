const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path_module = require("path");

async function loadDocument(path) {
  const html = fs.readFileSync(path).toString();
  const filePath = path_module.resolve(path);
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    url: `file://${filePath}`,
  });
  dom.window.fetch = async (url) => {
    const jsonPath = path_module.resolve(path_module.dirname(path), url);
    const data = fs.readFileSync(jsonPath);
    return {
      json: () => JSON.parse(data),
      text: () => data.toString(),
    };
  };
  return new Promise((resolve) => {
    dom.window.addEventListener("load", () => {
      resolve(dom.window.document);
    });
  });
}

module.exports = { loadDocument };
