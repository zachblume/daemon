import React, { useRef, useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import "@fontsource/source-code-pro";
import styles from "@/styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });
import Editor from "@monaco-editor/react";

export default function Home({ language }) {
  const handleEditorChange = async (value) => {
    if (language == "python") handleEditorChangePython(value);
    else handleEditorChangeJS(value);
  };

  // Worker reference
  const workerRef = useRef();
  // Process
  const handleEditorChangeJS = async (value) => {
    if (workerRef && workerRef.current) workerRef.current.terminate();
    workerRef.current = new Worker(new URL("../worker.js", import.meta.url));
    workerRef.current.onmessage = (event) => setLog(event.data);
    workerRef.current.postMessage(value);
  };

  const handleEditorChangePython = async (value) => {
    const pyodideWorker = new Worker(new URL("../python.js", import.meta.url));
    pyodideWorker.onmessage = (event) => setLog(event.data);
    pyodideWorker.postMessage(value);
  };

  // State and methods for the editor
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [llog, setLog] = useState("");
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    handleEditorChange(editorRef.current.getValue());
  };

  var defaultJSValue = `// Write your JavaScript code below\nconsole.log("Hello, world! Edit this statement and glance below.")\n\nfor (let i=0; i<5; i++) { console.log("Loop five times!"); }`;
  var defaultPythonValue = `# Write Python below!
for fizzbuzz in range(12):
    if fizzbuzz % 3 == 0 and fizzbuzz % 5 == 0:
        print("fizzbuzz")
        continue
    elif fizzbuzz % 3 == 0:
        print("fizz")
        continue
    elif fizzbuzz % 5 == 0:
        print("buzz")
        continue
    print(fizzbuzz)`;

  useEffect(() => {
    if (editorRef && editorRef.current) {
      console.log(language);
      if (language == "python") editorRef.current.setValue(defaultPythonValue);
      else editorRef.current.setValue(defaultJSValue);
    }
  }, [language]);

  return (
    <>
      <Head>
        <title>😈 Daemon</title>
        <meta
          name="description"
          content="daemon is a JS and Python browser sandbox that executes your code on every keystroke."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😈</text></svg>"
        />
        <meta property="og:title" content="😈 Daemon" />

        <meta
          name="image"
          property="og:image"
          content="https://www.daemon.live/screenshot.png"
        />
        <meta name="author" content="Zach Blume" />
        <meta
          property="og:description"
          content="daemon is a JS and Python browser sandbox that executes your code on every keystroke."
        />
        <meta property="og:url" content="https://www.daemon.live" />
      </Head>
      <main>
        <div id="ide">
          <Editor
            language={language}
            defaultValue={defaultJSValue}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              lineNumbers: "on",
              // fontFamily: "Source Code Pro",
              // fontSize: "14px",
            }}
          />
        </div>
        <div id="console">
          <h1>Output</h1>
          <pre>{llog}</pre>
        </div>
      </main>
    </>
  );
}
