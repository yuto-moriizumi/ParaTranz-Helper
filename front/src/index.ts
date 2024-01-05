import { createRoot } from "react-dom/client";
import { Main } from "./main";

async function main() {
  setInterval(() => {
    const container = document.getElementById("paratranz-helper-container");
    if (container !== null) return;
    const translationArea = document
      .getElementsByClassName("translation-area")
      .item(0);
    if (translationArea === null)
      return console.error("translationArea was not found");
    const display = document.createElement("div");
    display.id = "paratranz-helper-container";
    translationArea.parentNode?.insertBefore(
      display,
      translationArea.nextSibling,
    );
    createRoot(display).render(Main());
  }, 500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
