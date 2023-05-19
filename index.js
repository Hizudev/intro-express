import express from "express";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname + "/public/index.html");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;

app.post("/canciones", async (req, res) => {
  const { id, titulo, artista, tono } = req.body;
  try {
    if (titulo.trim() === "" || artista.trim() === "" || tono.trim() === "") {
      res.status(500).json({
        ok: false,
        message: "Informacion incompleta, por favor rellenar",
      });
    } else {
      const data = await fs.readFile("repertorio.json", "utf-8");
      const songs = JSON.parse(data);
      const newSong = {
        id,
        titulo,
        artista,
        tono,
      };
      songs.push(newSong);
      fs.writeFile("repertorio.json", JSON.stringify(songs));
      res.status(200).json({
        ok: true,
        message: "Cancion agregada exitosamente",
      });
    }
  } catch (e) {
    res.status(500).json({
      ok: false,
      message: `${e}`,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(filePath);
});

app.get("/canciones", async (req, res) => {
  try {
    const data = await fs.readFile("repertorio.json", "utf-8");
    const songs = JSON.parse(data);
    res.json(songs);
  } catch (e) {
    res.status(500).json({
      ok: false,
      message: `${e}`,
    });
  }
});

app.put("/canciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    if (titulo.trim() === "" || artista.trim() === "" || tono.trim() === "") {
      res.status(500).json({
        ok: false,
        message: "Informacion incompleta, por favor rellenar",
      });
    } else {
      const data = await fs.readFile("repertorio.json", "utf-8");
      const songs = JSON.parse(data);
      const songIndex = songs.findIndex((song) => song.id == id);
      songs[songIndex] = {
        id,
        titulo,
        artista,
        tono,
      };
      await fs.writeFile("repertorio.json", JSON.stringify(songs));
      res
        .status(200)
        .json({ ok: true, message: "Cancion actualizada con exito" });
    }
  } catch (e) {
    res.status(500).json({ ok: false, message: `${e}` });
  }
});

app.delete("/canciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile("repertorio.json", "utf-8");
    const songs = JSON.parse(data);
    const newData = songs.filter((song) => song.id != id);
    await fs.writeFile("repertorio.json", JSON.stringify(newData));
    res
      .status(200)
      .json({ ok: true, message: "Cancion eliminada exitosamente" });
  } catch (e) {
    res.status(500).json({ ok: false, message: `${e}` });
  }
});

app.listen(PORT, () => {
  console.log(`Funcionando en: http://localhost:${PORT}`);
});
