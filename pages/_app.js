import { Fragment, useState } from "react";
import "@/styles/globals.css";
import Layout from "../components/layout";

export default function App({ Component, pageProps }) {
  const [language, setLanguage] = useState("javascript");
  return (
    <Layout language={language} setLanguage={setLanguage}>
      <Component {...pageProps} language={language} setLanguage={setLanguage} />
    </Layout>
  );
}
