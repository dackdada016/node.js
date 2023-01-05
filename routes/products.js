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

router.get('/toggle-like/:pid', async (req, res)=>{
    const output = {
      success: false,
      error: '',
      action: '',
    };
    // 必須是已登入的會員
    if(! req.session.user){
      output.error = '必須登入會員, 才能加到最愛';
      return res.json(output);
    }
  
    const sql1 = "SELECT * FROM product_likes WHERE `member_id`=? AND `product_id`=?";
    const [likes] = await db.query(sql1, [
      req.session.user.id,
      req.params.pid
    ]);
  
    if(likes.length){
      const sql2 = "DELETE FROM `product_likes` WHERE sid=" + likes[0].sid;
      const [result] = await db.query(sql2);
      output.success = !! result.affectedRows;
      output.action = 'delete';
    } else {
      // TODO: 判斷有沒有這個商品
  
      const sql3 = "INSERT INTO `product_likes`(`member_id`, `product_id`) VALUES (?,?)";
      const [result] = await db.query(sql3, [
        req.session.user.id,
        req.params.pid
      ]);
      output.success = !! result.affectedRows;
      output.action = 'insert';
    }
    res.json(output);
  });
  
  router.get('/', async (req, res)=>{
    const [rows] = await db.query("SELECT * FROM products");
  
    res.json(rows);
  });

router.get('/',async(req, res)=>{
    const [rows] = await db.query("SELECT * FROM products");

    res.json(rows);
})
module.exports = router;
