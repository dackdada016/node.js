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

const getListData = async (req, res) => {
  let page = +req.query.page || 1; // 用戶要看第幾頁
  if (page < 1) {
    return res.redirect(req.baseUrl + trq.url); // 頁面轉向
  }

  const perPage = 20;
  const t_sql = "SELECT COUNT(1) totalRows FROM address_book";
  const [[{ totalRows }]] = await db.query(t_sql);
  const totalPages = Math.ceil(totalRows / perPage);

  let rows = [];
  if (totalRows > 0) {
    if (page > totalPages) {
      return res.redirect("?page=" + totalPages); // 頁面轉向到最後一頁
    }

    const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${
      (page - 1) * perPage
    }, ${perPage}`;

    [rows] = await db.query(sql);
  }

  return { totalRows, totalPages, page, rows };
};

router.get("/add", async (req, res) => {
  res.render("ab-add");
});

router.post("/add", upload.none(), async (req, res) => {
  const output = {
    success: false,
    postData: req.body, // 除錯用
    code: 0,
    errors: {},
  };

  let { name, email, mobile, birthday, address } = req.body;

  if(!name || name.length<2){
    output.errors.name = '請輸入正確的姓名';
    return res.json(output);
  }


  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;

  // TODO: 資料檢查

  const sql =
    "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

  const [result] = await db.query(sql, [
    name,
    email,
    mobile,
    birthday,
    address,
  ]);

  output.result = result;
  output.success = !! result.affectedRows;


  // affectedRows
  res.json(output);
});



router.get("/edit/:sid", async (req, res) => {

  const sid = +req.params.sid || 0;
  if(!sid){
    output.errors = '沒有sid';
    return res.redirect(req.baseUrl); //轉向到列表
  }
  const sql = "SELECT * FROM address_book WHERE sid=?";
  const [rows] = await db.query(sql,[sid]);
  if(rows.length < 1){
    output.errors = '沒有資料';
    return res.redirect(req.baseUrl); //轉向
  }

  const row = rows[0];
  // res.json(row);
  res.render("ab-edit",{...row});
});

router.put("/edit/:sid", upload.none(), async (req, res) => {

  return res.json(req.body);

  const output = {
    success: false,
    postData: req.body, // 除錯用
    code: 0,
    errors: {},
  };

  let { name, email, mobile, birthday, address } = req.body;

  if(!name || name.length<2){
    output.errors.name = '請輸入正確的姓名';
    return res.json(output);
  }


  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;

  // TODO: 資料檢查

  const sql =
    "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

  const [result] = await db.query(sql, [
    name,
    email,
    mobile,
    birthday,
    address,
  ]);

  output.result = result;
  output.success = !! result.affectedRows;


  // affectedRows
  res.json(output);
});



router.delete("/:sid", async (req, res) => {

  const output = {
    success:false,
    errors:''
  }

  const sid = +req.params.sid || 0 ;
  if(!sid){
    output.errors('NO SID')
    return res.json({output})
  };
  const sql = "DELETE FROM `address_book` WHERE sid=?";
  const [result] = await db.query(sql, [sid]);
  output.success = !!result.affectedRows;
  res.json(output);
});


router.get("/", async (req, res) => {
  const output = await getListData(req, res);
  res.render("ab-list", output);
});

router.get("/api", async (req, res) => {
  const output = await getListData(req, res);
  for (let item of output.rows) {
    item.birthday2 = res.locals.toDateString(item.birthday);
    // item.birthday = res.locals.toDateString(item.birthday);
  }
  // TODO: 用 output.rows.forEach() 再寫一次功能
  res.json(output);
});

module.exports = router;
