import express, { json } from "express";
import cors from "cors";
import { GlossaryEntries, Translator } from "deepl-node";

const app = express();

app.get("/", (_, res) => {
  return res.status(200).json({ message: "Hello from root!" });
});

// ミドルウェア設定
app.use(json());
app.use(cors());

app.post<object, object, { text: string }>("/translate", async (req, res) => {
  console.log({ inc: req.body.text });
  const translator = new Translator(process.env.DEEPL_KEY ?? "");
  const glossaries = await translator.listGlossaries();
  const glossary = glossaries.length > 0 ? glossaries[0] : undefined;
  const { text } = await translator.translateText(
    req.body.text,
    "ja",
    "en-US",
    {
      glossary,
    },
  );
  res.send({ text: text });
});

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
