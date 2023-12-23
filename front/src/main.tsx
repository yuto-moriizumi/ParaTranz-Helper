import { useEffect, useState } from "react";
import axios from "axios";

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
          undefined,
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (originalText === undefined) return;
    setText("翻訳中...");

    axios
      .post(
        "https://1thrt62esf.execute-api.ap-northeast-1.amazonaws.com/translate",
        { text: originalText },
      )
      .then(({ data }) => setText(data.text));
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
      <div>
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
        <button
          onClick={() =>
            axios.post(
              "https://1thrt62esf.execute-api.ap-northeast-1.amazonaws.com/glossaries",
            )
          }
        >
          辞書更新
        </button>
      </div>
    </div>
  );
}
