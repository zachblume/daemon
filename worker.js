//web worker
addEventListener("message", (event) => {
  let output = "";
  let logger = (msg) => {
    output += msg;
    output += "\n";
  };
  console.log = logger;
  console.error = logger;
  console.info = logger;
  console.debug = logger;
  try {
    eval(event.data);
  } catch (e) {
    console.error(e);
  }
  postMessage(output);
});
