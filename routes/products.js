const express = require("express");
const db = require("../modules/connect-mysql");
const upload = require("../modules/upload-img");
const moment = require('moment-timezone');

const router = express.Router();

router.use((req, res, next)=>{
  const {url, baseUrl, originalUrl} = req;
  res.locals = {...res.locals, url, baseUrl, originalUrl}
  next();
})

router.get('/',async(req, res)=>{
    const [rows] = await db.query("SELECT * FROM products");

    res.json(rows);
})
module.exports = router;
