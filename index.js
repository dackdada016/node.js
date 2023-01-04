if (process.argv[2] === "production") {
  require("dotenv").config({ path: __dirname + "/production.env" });
} else {
  require("dotenv").config({ path: __dirname + "/dev.env" });
}

const multer = require("multer");
const upload = require("./modules/upload-img");
const session = require("express-session");
const MysqlStroe = require("express-mysql-session")(session); 
const moment = require("moment-timezone");
const db = require("./modules/connect-mysql");
const bcrypt = require('bcryptjs');

// 第一個參數要空物件
const sessionStroe = new MysqlStroe({}, db)
const express = require("express");

const app = express();

app.set("view engine", "ejs");

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    console.log({origin});
    callback(null, true);
  },
};
app.use(require("cors")(corsOptions));


app.use(
  session({
    saveUninitialized: false,
    resave: false,
    store: sessionStroe,
    secret: "ksdjfgdks948564908jdfghkl89",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 自訂  middleware
app.use((req, res, next) => {
  res.locals.title = process.env.SITE_TITLE || "*** 沒有設定 ***";
  
  // 樣版輔助函式, helper functions
  res.locals.toDateString = d=>moment(d).format('YYYY-MM-DD');
  res.locals.toDatetimeString = d=>moment(d).format('YYYY-MM-DD HH:mm:ss');



  next();
});

// 路由設定, routes
app.get("/", (req, res) => {
  res.render("main", { name: "Ester" });
});


app.get("/json-sales", (req, res) => {
  const data = require(__dirname + "/data/sales.json");

  console.log(data); // 取得已經是原生類型

  // res.json(data);
  res.render("json-sales", { data });
});

app.get("/json-sales2", (req, res) => {
  res.locals.title = res.locals.title ? "測試 - " + res.locals.title : "測試";

  const data = require(__dirname + "/data/sales.json");
  const { orderby } = req.query;

  const handleObj = {
    name_asc: {
      label: "姓名由小到大",
      sort: (a, b) => (a.name < b.name ? -1 : 1),
    },
    name_desc: {
      label: "姓名由大到小",
      sort: (a, b) => (a.name > b.name ? -1 : 1),
    },
    age_asc: {
      label: "年齡由小到大",
      sort: (a, b) => a.age - b.age,
    },
    age_desc: {
      label: "年齡由大到小",
      sort: (a, b) => b.age - a.age,
    },
  };

  // 有對應到 key 才做排序
  if (handleObj[orderby]) {
    data.sort(handleObj[orderby].sort);
  }

  res.render("json-sales2", { data, handleObj, orderby });
});

app.get("/json-sales3", (req, res) => {
  const data = require(__dirname + "/data/sales.json");

  const handleAr = [
    {
      key: "name_asc",
      label: "姓名由小到大",
      sort: (a, b) => {},
    },
    {
      key: "name_desc",
      label: "姓名由大到小",
      sort: (a, b) => {},
    },
    {
      key: "age_asc",
      label: "年齡由小到大",
      sort: (a, b) => {},
    },
    {
      key: "age_desc",
      label: "年齡由大到小",
      sort: (a, b) => {},
    },
  ];

  res.render("json-sales", { data, handleObj });
});

app.get("/try-qs", (req, res) => {
  res.json(req.query);
});

app.post(["/try-post", "/try-post2"], (req, res) => {
  res.json(req.body);
});

app.get("/try-post-form", (req, res) => {
  res.render("try-post-form");
});
app.post("/try-post-form", (req, res) => {
  // res.json(req.body)
  res.render("try-post-form", req.body);
});

app.post("/try-upload", upload.single("avatar"), (req, res) => {
  res.json(req.file);
});
app.post("/try-uploads", upload.array("photos"), (req, res) => {
  res.json(req.files);
});

app.get("/my-params1/:action?/:id?", (req, res) => {
  res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.slice(3);
  u = u.split("?")[0]; // 丟掉 query string
  u = u.split("-").join("");
  res.send(u);
});

app.use(require("./routes/admin2"));
app.use("/admins", require("./routes/admin2"));

app.get("/try-sess", (req, res) => {
  req.session.my_var = req.session.my_var || 0;
  req.session.my_var++;
  res.json({
    my_var: req.session.my_var,
    session: req.session,
  });
});

app.get("/try-moment", (req, res) => {
  const d1 = new Date();
  const m1 = moment(); // new Date()
  const m1a = m1.format("YYYY/MM/DD");
  const m1b = m1.format("YYYY-MM-DD HH:mm:ss");
  const m1c = m1.tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
  const m2 = moment("2023-01-02"); // new Date()

  res.json({ m1a, m1b, m1c, d1, m2 });
});

app.get("/try-db", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categories");

  res.json(rows);
});

app.get("/add-member", async(req, res)=>{
  const sql = "INSERT INTO `members`(`email`, `password`, `hash`, `nickname`, `create_at`) VALUES (?, ?, '','ESTER',NOW()) ";
  const password = await bcrypt.hash('12345', 10);
  
  const [result] = await db.query(sql, ['dack@test.com',password]);
  res.json(result);
})

app.use("/address-book", require("./routes/address-book"));

app.use(express.static("public"));
// ***** 所有的路由設定都要放在這行之前 *****
app.use((req, res) => {
  res.type("text/html");
  res.status(404).send(`<h1>404 找不到你要的頁面</h1>`);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server started: ${port}`);
});
