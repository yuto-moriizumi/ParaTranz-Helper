import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ApiRequest, ApiResponse } from "common";

export function Main() {
  return <Sub />;
}

function Sub() {
  const [originalText, setOriginalText] = useState<string | undefined>(
    undefined,
  );
  const [text, setText] = useState("翻訳中...");
  const [key, setKey] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setOriginalText(
        document.getElementsByClassName("original well").item(0)?.textContent ??
          undefined,
      );
      const tbody = document.getElementsByTagName("tbody").item(0);
      if (tbody === null) return;
      const tr = tbody.children.item(0);
      if (tr === null) return;
      const td = tr.children.item(1);
      if (td === null || td.textContent === null) return;
      setKey(td.textContent.trim());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (originalText === undefined) return;
    setText("翻訳中...");
    const mode = getMode(key);
    axios
      .post<ApiResponse, AxiosResponse<ApiResponse>, ApiRequest>(
        "https://1thrt62esf.execute-api.ap-northeast-1.amazonaws.com/translate",
        {
          text: originalText,
          isAdjectiveCountryName: mode === "adjective",
        },
      )
      .then(({ data }) =>
        setText((mode === "definition" ? "the " : "") + data.text),
      );
  }, [key, originalText]);

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

function getMode(key: string) {
  if (key.endsWith("DEF:0")) return "definition";
  if (key.endsWith("ADJ:0")) return "adjective";
  return "normal";
}
