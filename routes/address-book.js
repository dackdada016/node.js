const express = require("express");
const db = require("../modules/connect-mysql");

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

router.get("/", async (req, res) => {
  const output = await getListData(req, res);
  res.render("ab-list", output);
});

router.get("/api", async (req, res) => {
  const output = await getListData(req, res);
  res.json(output);
});

module.exports = router;
