// 載入env setting
require('dotenv').config();

const { json } = require('express');
const express = require('express');

const app = express();

app.set('view engine','ejs');

// setting ejs 第一個參數不需要副檔名
app.get('/',(req,res)=>{
    res.render('main',{name:'yun'});
});


app.get("/json-sales",(req,res)=>{
    const data = require(__dirname + '/data/sales.json')
    
    // 取得已經是原生類型
    // console.log(data);
    // res.json(data);
    res.render('json-sales',{data});

});

// qureyString的方法
app.get("/try-qs",(req,res)=>{
    res.json(req.query);
});

const urlencodedParser = express.urlencoded({extended:false});
const jsonParser = express.json();
app.post(["/try-post","/try-post2"],[urlencodedParser, jsonParser],(req,res) => {
    res.json(req.body);
});


app.get("/json-sales2", (req, res) => {
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
        sort: (a, b) => (a.age - b.age),
      },
      age_desc: {
        label: "年齡由大到小",
        sort: (a, b) => (b.age - a.age),
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

// setting public 
app.use(express.static('public'));

app.use((req,res)=>{
    res.type('text/html');
    res.status(404).send(`<h1>404 找不到你的頁面</h1>`);
});


const port = process.env.PORT || 3301;
 app.listen(port,()=>{
    console.log(`server started : ${port}`)
 })