// import { readFile, writeFile } from "fs/promises";
// import path from "path";

// const DATA_FILE = path.join("data", "links.json");

// export const saveLinks = async (links) => {
//   await writeFile(DATA_FILE, JSON.stringify(links));
// };

// export const loadLinks = async () => {
//   try {
//     const data = await readFile(DATA_FILE, "utf-8");
//     return JSON.parse(data);
//   } catch (error) {
//     if (error.code === "ENOENT") {
//       await writeFile(DATA_FILE, JSON.stringify({}));
//       return {};
//     }
//     throw error;
//   }
// };

import { dbclient } from "../config/db-client.js";
import { env } from "../config/env.js";

const db = dbclient.db(env.MONGODB_DATABASE);
const store = db.collection('shortener');

export const loadLinks = async () => {
  return await store.find().toArray();
}

export const saveLinks = async (link) => {
  return await store.insertOne(link);
}

export const getshortencodeexists = async (shortCode) => {
  return await store.findOne({ shortCode: shortCode });
}