console.log("main.js loaded successfully");

function exposeGlobals(obj) {
  for (const [key, value] of Object.entries(obj)) {
    globalThis[key] = value;
  }
}

function testFunction() {
  console.log("testFunction was called");
}

exposeGlobals({
  testFunction,
});
