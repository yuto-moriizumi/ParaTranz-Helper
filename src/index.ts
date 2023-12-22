// import translate from "deepl";
import { createRoot } from "react-dom/client";
import { Main } from "./main";

async function main() {
  console.log("main");
  const translationArea = document
    .getElementsByClassName("translation-area")
    .item(0);
  if (translationArea === null)
    return console.error("translationArea was not found");
  const display = document.createElement("div");
  translationArea.parentNode?.insertBefore(
    display,
    translationArea.nextSibling,
  );
  // display.textContent = "翻訳中…";
  // const res = await translate({
  //   free_api: true,
  //   text: "翻訳おかしいこともあるのね。",
  //   source_lang: "JA",
  //   target_lang: "EN-US",
  //   auth_key: process.env.DEEPL_KEY ?? "",
  // });
  // display.textContent = res.data.translations[0].text;

  createRoot(display).render(Main());
}

main();
