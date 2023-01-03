const express = require("express");
const { months } = require("moment-timezone");
const db = require("../modules/connect-mysql");

const upload = require('../modules/upload-img')

const router = express.Router();

const getListData = async (req, res) => {
  let page = +req.query.page || 1; // 用戶要看第幾頁
  if (page < 1) {
    return res.redirect(req.baseUrl+trq.url); // 頁面轉向
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
router.post("/add", upload.none() , async (req, res) => {
  const output = {
    success:false,
    postData:req.body,
    code:0,
    error:{}
  }

  const {name, email, mobile, birthday, address} = req.body;
  
  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null ;


  const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";
  
  const [result] = await db.query(sql, [name, email, mobile, birthday, address]);

  output.result = result;
  res.json(req.body);
  //res.render("ab-list", output);
});

router.get("/", async (req, res) => {
  const output = await getListData(req, res);
  res.render("ab-list", output);
});

router.get("/api", async (req, res) => {
  const output = await getListData(req, res);
  for(let item of output.rows){
    item.birthday = res.locals.toDateString(item.birthday)
  }
  // TODO: 用forEach 練習一次
  res.json(output);
});

module.exports = router;
