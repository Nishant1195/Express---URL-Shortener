import express from "express";
import { shortenerRoute } from "./routes/shortener.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(shortenerRoute);
app.set("view engine", "ejs");


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
