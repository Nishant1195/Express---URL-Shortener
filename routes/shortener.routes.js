
import { Router } from "express";

import { getShortener, postShortener } from "../controller/postShortener.controller.js";



const router = Router();



router.get("/report", (req, res) => {
    const student = {title: 'Welcome', name: 'Nishant'};
    res.render("reports", {student});
})


router.get("/", getShortener);

router.post("/", postShortener);



router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();

    if (!links[shortCode]) return res.status(404).send("404 error occurred");

    return res.redirect(links[shortCode]);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

export const shortenerRoute = router;