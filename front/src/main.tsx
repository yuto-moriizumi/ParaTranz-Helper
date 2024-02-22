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
      const key =
        document
          .getElementsByTagName("tbody")
          .item(0)
          ?.children.item(0)
          ?.children.item(1)?.textContent ?? "";
      setKey(key.trim());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (originalText === undefined) return;
    setText("翻訳中...");
    (async () => {
      // 既に同一テキストが翻訳済みの場合は、翻訳済みテキストを取得する
      const translation = await getPastTranslation();
      if (translation) return setText(translation);
      const mode = getMode(key);
      try {
        const translated = await translate(originalText, mode === "adjective");
        setText((mode === "definition" ? "the " : "") + translated);
      } catch (error) {
        console.error(error);
        setText("翻訳APIエラー");
      }
    })();
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

async function translate(text: string, isAdjectiveCountryName: boolean) {
  const { data } = await axios.post<
    ApiResponse,
    AxiosResponse<ApiResponse>,
    ApiRequest
  >("https://1thrt62esf.execute-api.ap-northeast-1.amazonaws.com/translate", {
    text,
    isAdjectiveCountryName,
  });
  return data.text;
}

/** 既に同一テキストが翻訳済みの場合は、翻訳済みテキストを取得する */
async function getPastTranslation() {
  while (document.getElementsByClassName("loading").item(0)) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const translation = document.getElementsByClassName("string-item").item(0);
  if (translation === null) return;
  const matchRateString =
    translation.children.item(0)?.children.item(0)?.textContent ?? undefined;
  if (matchRateString === undefined) return;
  const matchRateStr = matchRateString.match(/([\d\\.]+)%/)?.[1] ?? "0";
  const matchRate = parseFloat(matchRateStr);
  if (matchRate < 100) return undefined;
  return (
    translation.getElementsByClassName("translation notranslate").item(0)
      ?.textContent ?? undefined
  );
}
