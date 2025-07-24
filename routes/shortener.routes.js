
import { Router } from "express";

import { getShortener, postShortener,getRedirecttoShortener, getRedirecttoReport } from "../controller/postShortener.controller.js";



const router = Router();



router.get("/report", getRedirecttoReport)


router.get("/", getShortener);

router.post("/", postShortener);



router.get("/:shortCode", getRedirecttoShortener);

export const shortenerRoute = router;