import translate from "deepl";
import { useEffect, useState } from "react";

export function Main() {
  return <Sub />;
}

function Sub() {
  const [originalText, setOriginalText] = useState<string | undefined>(
    undefined,
  );
  const [text, setText] = useState("翻訳中...");

  useEffect(() => {
    const interval = setInterval(() => {
      setOriginalText(
        document.getElementsByClassName("original well").item(0)?.textContent ??
          undefined ??
          undefined,
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (originalText === undefined) return;
    setText("翻訳中...");
    translate({
      free_api: true,
      text: originalText,
      source_lang: "JA",
      target_lang: "EN-US",
      auth_key: process.env.DEEPL_KEY ?? "",
    }).then(({ data }) => setText(data.translations[0].text));
  }, [originalText]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <p>{text}</p>
      <button
        onClick={() => {
          const textarea = document
            .getElementsByClassName("translation form-control")
            .item(0) as HTMLTextAreaElement;
          textarea.value = text;
          textarea.dispatchEvent(new InputEvent("input", { data: text }));
        }}
      >
        挿入
      </button>
    </div>
  );
}
