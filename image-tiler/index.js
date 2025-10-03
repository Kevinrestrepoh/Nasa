import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import cors from "cors";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.post("/convert", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const outputName = Date.now().toString();
  const outputPath = `tiles/${outputName}`;

  const cmd = `vips dzsave "${inputPath}" "${outputPath}" --layout dz --tile-size 256 --overlap 1 --suffix .jpg[Q=95]`;

  exec(cmd, (err, stdout, stderr) => {
    fs.unlinkSync(inputPath); // cleanup upload

    if (err) {
      console.error("VIPs error:", stderr);
      return res.status(500).json({ error: stderr });
    }

    res.json({
      message: "Converted!",
      dzi: `/tiles/${outputName}.dzi`
    });
  });
});

app.use("/tiles", express.static("tiles"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 VIPS backend running on ${PORT}`));
