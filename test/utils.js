const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

function loadDocument(path) {
  const html = fs.readFileSync(path).toString();
  const dom = new JSDOM(html, { runScripts: "dangerously" });
  return dom.window.document;
}

module.exports = { loadDocument };
