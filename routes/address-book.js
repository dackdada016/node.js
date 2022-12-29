const express = require("express");
const db =  require("../modules/connect-mysql");

const router = express.Router();

router.get('/',async (req,res) => {
    
    let page = +req.query.page || 1

    const perPage = 20;
    const t_sql = "SELECT COUNT(1) totalRows FROM address_book ";
    const [[{totalRows}]] = await db.query(t_sql);
    const totalPage = Math.ceil(totalRows/perPage)
    res.json({totalRows, totalPage, page});
   
  });

module.exports = router;