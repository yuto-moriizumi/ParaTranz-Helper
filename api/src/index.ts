import express, { json } from "express";
import cors from "cors";
import { GlossaryEntries, Translator } from "deepl-node";
import { ApiRequest, ApiResponse } from "common";

const app = express();

app.get("/", (_, res) => {
  return res.status(200).json({ message: "Hello from root!" });
});

// ミドルウェア設定
app.use(json());
app.use(cors());

app.post<object, ApiResponse, ApiRequest>(
  "/translate",
  async ({ body }, res) => {
    console.log({ inc: body.text });
    const translator = new Translator(process.env.DEEPL_KEY ?? "");
    const glossaries = await translator.listGlossaries();
    const glossary = glossaries.length > 0 ? glossaries[0] : undefined;
    const textBefore = body.isAdjectiveCountryName
      ? `<p><span>${body.text}</span>国籍</p>`
      : body.text;
    const { text } = await translator.translateText(textBefore, "ja", "en-US", {
      glossary,
    });
    if (!body.isAdjectiveCountryName) return res.send({ text: text });
    const adjective = text.match(/<span>(.+)<\/span>/)?.[1] ?? text;
    res.send({ text: adjective });
  },
);

type ParatranzTerms = { results: { term: string; translation: string }[] };

// 登録済み辞書全てを削除し、新しい辞書を登録する
app.post("/glossaries", async (req, res) => {
  const translator = new Translator(process.env.DEEPL_KEY ?? "");
  const glossaries = await translator.listGlossaries();
  await Promise.all(
    glossaries.map((glossary) => translator.deleteGlossary(glossary)),
  );

  const terms = (await (
    await fetch(
      "https://paratranz.cn/api/projects/1511/terms?page=1&pageSize=500",
    )
  ).json()) as ParatranzTerms;

  await translator.createGlossary(
    "SSW",
    "ja",
    "en",
    new GlossaryEntries({
      entries: Object.fromEntries(
        terms.results.map((term) => [term.term, term.translation]),
      ),
    }),
  );
  res.status(201).send();
});

app.use((_, res) => {
  return res.status(404).json({ error: "Not Found" });
});

export { app };
