import fs from "fs/promises";
import { createServer } from "http";
import crypto from "crypto";
import path from "path";
import express from "express";
import { url } from "inspector";

const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join("data", "links.json");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

const serveFile = async (res, filePath, contentType) => {
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found");
  }
};

const loadLinks = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};

const saveLinks = async (links) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(links));
};

app.get("/", async (req, res) => {
  try {
    const file = await fs.readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replaceAll("{{shorten_url}}", Object.entries(links).map(([shortCode, url]) => `<li><a href="/${shortCode}" target="_blank">${req.host}/${shortCode}</a> - ${url}<li>`
    ).join(""));
    
    return res.send(content);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error!")
  }
})

app.post("/", async (req, res) => {
  try {
    const { url, shortCode } = req.body;

     const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
     const links = await loadLinks();
      if (links[finalShortCode]) {
        return res.status(400).send("Short code already exists. Please choose another.")
      }
      links[finalShortCode] = url;

      await saveLinks(links);
      res.redirect("/")
  } catch (error) {
    
  }
})

app.get("/:shortcode", async (req, res) => {
  
  try {
    const {shortCode} = req.params;
    const links = await loadLinks();
  
    if(!links[shortCode]) return res.status(404).send("404 error occured!");
   return res.redirect(links[shortCode]); 
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error!")
  
  }
})



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
