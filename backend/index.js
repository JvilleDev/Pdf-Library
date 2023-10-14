const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const PDFParser = require("pdf-parse");
const app = express();
const PORT = 3000;
app.use(cors());

app.use(bodyParser.json());
app.use("/static", express.static("static"));

let documents = [];
// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./static/library");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Routes
app.get("/indexed", (req, res) => {
  res.sendFile(path.join(__dirname, "index.json"));
});
app.get("/easy-search/:searchTerm", (req, res) => {
  const { searchTerm } = req.params;
  fs.readFile("index.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      const documents = JSON.parse(data);
      const results = documents.filter(
        (doc) =>
          doc.title.includes(searchTerm) ||
          doc.description.includes(searchTerm) ||
          doc.tags.includes(searchTerm)
      );
      res.json(results);
    }
  });
});
let indexedData = [];
fs.readFile("tokenizedIndex.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error al leer el archivo:", err);
  } else {
    indexedData = JSON.parse(data);
    app.get("/full-search/:searchTerm", async (req, res) => {
      try {
        const searchTerm = req.params.searchTerm.toLowerCase();
        const fileData = await readFile("tokenizedIndex.json");
        const tokenizedIndex = JSON.parse(fileData);
        const results = [];
        for (let entry of tokenizedIndex) {
          const { id, tokens } = entry;
          const searchText = tokens.join(" ");
          if (searchText.includes(searchTerm)) {
            const startIndex = searchText.indexOf(searchTerm);
            const endIndex = searchText.indexOf(".", startIndex);
            let context = searchText.substring(
              searchText.lastIndexOf(".", startIndex) + 1,
              endIndex !== -1 ? endIndex + 1 : searchText.length
            );

            results.push({ id, context });
          }
        }

        res.json(results);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
});
app.get("/info/:id", async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const fileData = await readFile("index.json");
    const parsedData = JSON.parse(fileData);
    const fileInfo = parsedData.find((item) => item.id === fileId);

    if (fileInfo) {
      res.json(fileInfo);
    } else {
      res
        .status(404)
        .json({
          message: "No se encontró el elemento con el ID proporcionado",
        });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
app.post("/new-document", upload.single("file"), async (req, res) => {
  const { title, description, tags } = req.body;
  const id = documents.length > 0 ? documents[documents.length - 1].id + 1 : 1;
  const filePath = `/static/library/${req.file.originalname}`;
  const newDocument = { id, title, description, tags, filePath };
  documents.push(newDocument);
  idx.addDoc(newDocument);
  fs.readFile("index.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      res.status(500).send("Internal Server Error");
    } else {
      let jsonData = JSON.parse(data);
      jsonData.push(newDocument);
      fs.writeFile("index.json", JSON.stringify(jsonData), (err) => {
        if (err) {
          console.error("Error al escribir en el archivo:", err);
          res.status(500).send("Internal Server Error");
        } else {
          tokenizeDocument(newDocument)
            .then((tokenizedDocument) => {
              let tokenizedContent = [];
              if (fs.existsSync("tokenizedIndex.json")) {
                const data = fs.readFileSync("tokenizedIndex.json", "utf8");
                tokenizedContent = JSON.parse(data);
              }
              tokenizedContent.push(tokenizedDocument);
              fs.writeFile(
                "tokenizedIndex.json",
                JSON.stringify(tokenizedContent),
                (err) => {
                  if (err) {
                    console.error(
                      "Error al escribir en el archivo tokenizado:",
                      err
                    );
                    res.status(500).send("Internal Server Error");
                  } else {
                    res.json(newDocument);
                  }
                }
              );
            })
            .catch((err) => {
              console.error("Error al tokenizar el documento:", err);
              res.status(500).send("Internal Server Error");
            });
        }
      });
    }
  });
});
const tokenizeDocument = async (document) => {
  const { id, filePath } = document;
  const pdfBuffer = await readFile(__dirname + filePath);
  const pdfData = await PDFParser(pdfBuffer);
  let text = pdfData.text;
  text = text.replace(/(\r\n|\n|\r)/gm, " ");
  const tokens = text.split(/\s+/);
  return { id, tokens };
};
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
