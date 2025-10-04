import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import cors from "cors";
import pool from "./db.js";

const app = express();
const upload = multer({ dest: "uploads/" });

const TILES_DIR = path.join(process.cwd(), "tiles");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.post("/convert", upload.single("image"), async (req, res) => {
  const inputPath = req.file.path;
  let outputName = req.body.name && req.body.name.trim() !== ""
    ? req.body.name
    : req.file.originalname.split(".").slice(0, -1).join(".");
    outputName = outputName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
  const outputPath = `tiles/${outputName}/${outputName}`;

  const cmd = `vips dzsave "${inputPath}" "${outputPath}" --layout dz --tile-size 256 --overlap 1 --suffix .jpg[Q=95]`;

  const query = `
        INSERT INTO datasets (id, name, description, type, resolution, objects, credits, year, tile_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *;
      `;
      const values = [
        outputName,
        "Name",
        `Dataset generated for ${outputName}`,
        "unknown",
        "unknown",
        "unknown",
        "Local Upload",
        new Date().getFullYear().toString(),
        outputPath + ".dzi"
      ];

      const result = await pool.query(query, values);

  exec(cmd, (err, stdout, stderr) => {
    fs.unlinkSync(inputPath); // cleanup upload

    if (err) {
      console.error("VIPs error:", stderr);
      return res.status(500).json({ error: stderr });
    }

    res.json({
      message: "Converted!",
      dzi: result.rows[0].tile_url
    });
  });
});

app.get("/datasets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM datasets ORDER BY year DESC;");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching datasets:", err);
    res.status(500).json({ error: "Failed to fetch datasets" });
  }
});

app.use("/tiles", express.static("tiles"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 VIPS backend running on ${PORT}`));
