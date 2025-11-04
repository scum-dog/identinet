console.log("main.ts loaded successfully");

function exposeGlobals(obj: Record<string, any>) {
  for (const [key, value] of Object.entries(obj)) {
    (globalThis as any)[key] = value;
  }
}

function testFunction() {
  console.log("testFunction was called");
}

exposeGlobals({
  testFunction,
});
