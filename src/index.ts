import { createRoot } from "react-dom/client";
import { Main } from "./main";

async function main() {
  setTimeout(() => {
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
    createRoot(display).render(Main());
  }, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
