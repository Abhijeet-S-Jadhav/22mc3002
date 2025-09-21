import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import validUrl from "valid-url";
import { logger } from "./logger.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

const store = new Map();
const DEFAULT_VALIDITY = 30 * 60 * 1000;

app.post("/api/shorten", (req, res) => {
  const { url, alias, validity } = req.body;
  if (!validUrl.isWebUri(url)) return res.status(400).json({ error: "Invalid URL" });

  let key = alias || nanoid(7);
  if (store.has(key)) return res.status(409).json({ error: "Alias already taken" });

  const expireAt = Date.now() + ((validity || 30) * 60 * 1000);
  store.set(key, { url, expireAt });

  res.json({ short: `http://localhost:3000/${key}`, key, expireAt });
});

app.get("/:key", (req, res) => {
  const data = store.get(req.params.key);
  if (!data) return res.status(404).send("Not found");

  if (Date.now() > data.expireAt) {
    store.delete(req.params.key);
    return res.status(410).send("Link expired");
  }

  res.redirect(data.url);
});

app.listen(4000, () => console.log("Backend running on 4000"));
