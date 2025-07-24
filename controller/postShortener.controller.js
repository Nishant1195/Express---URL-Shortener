import crypto from "crypto";
import { loadLinks, saveLinks } from "../model/datashortener.model.js";
export const getShortener = async (req, res) => {
  try {
    
    const links = await loadLinks();

    res.render("index", {links, host:req.host});
   
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
}

export const postShortener =  async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const links = await loadLinks();

    if (links[finalShortCode]) {
      return res
        .status(400)
        .send("Short code already exists. Please choose another.");
    }

    links[finalShortCode] = url;

    await saveLinks(links);
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
 }

 export const getRedirecttoShortener = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();

    if (!links[shortCode]) return res.status(404).send("404 error occurred");

    return res.redirect(links[shortCode]);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export const getRedirecttoReport = (req, res) => {
    const student = {title: 'Welcome', name: 'Nishant'};
    res.render("reports", {student});
}
