// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
importScripts("https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide();
  // await self.pyodide.loadPackage(["numpy", "pytz"]);
}
let pyodideReadyPromise = loadPyodideAndPackages();

addEventListener("message", async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;

  let oldLogger = console.log;
  let output = "";
  let logger = (msg) => {
    output += msg;
    output += "\n";
  };
  console.log = logger;
  console.error = logger;
  console.info = logger;
  console.debug = logger;

  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    // await self.pyodide.loadPackagesFromImports(python);
    let results = await self.pyodide.runPythonAsync(event.data);
    // output += results;
  } catch (error) {
    output += error.message || error;
  }
  self.postMessage(output);
});
